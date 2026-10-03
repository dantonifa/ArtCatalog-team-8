const passport = require("passport");
const GitHubStrategy = require("passport-github2").Strategy;
const { ObjectId } = require("mongodb");
const { getDatabase } = require("../data/database");

// GitHub OAuth strategy
passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: "/auth/github/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const db = getDatabase();
        const users = db.collection("users");

        // Look for existing user
        let user = await users.findOne({
          oauthProvider: "github",
          oauthId: String(profile.id),
        });

        if (!user) {
          // First-time login → create user
          const newUser = {
            oauthProvider: "github",
            oauthId: String(profile.id),
            displayName: profile.displayName || profile.username,
            email: profile.emails?.[0]?.value || null,
            role: "user", // default role
            createdAt: new Date(),
            lastLoginAt: new Date(),
          };
          const result = await users.insertOne(newUser);
          user = { _id: result.insertedId, ...newUser };
        } else {
          // Existing user → update last login
          await users.updateOne(
            { _id: user._id },
            { $set: { lastLoginAt: new Date() } },
          );
          user.lastLoginAt = new Date();
        }

        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    },
  ),
);

// Serialize only the user ID into the session
passport.serializeUser((user, done) => {
  done(null, user._id.toString());
});

// Deserialize user from DB on each request
passport.deserializeUser(async (id, done) => {
  try {
    const db = getDatabase();
    const user = await db
      .collection("users")
      .findOne({ _id: new ObjectId(id) });
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

module.exports = passport;
