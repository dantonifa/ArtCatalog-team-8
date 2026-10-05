const passport = require("passport");
const GitHubStrategy = require("passport-github2").Strategy;
const { ObjectId } = require("mongodb");
const { getDatabase } = require("../data/database");

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: process.env.CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const users = getDatabase().collection("users");

        // Role is recalculated on EVERY login
        const role =
          profile.username === process.env.ADMIN_GITHUB_USERNAME
            ? "admin"
            : "user";

        const result = await users.findOneAndUpdate(
          { oauthProvider: "github", oauthId: String(profile.id) },
          {
            $set: {
              username: profile.username,
              displayName: profile.displayName || profile.username,
              email: profile.emails?.[0]?.value || null,
              role,
              lastLoginAt: new Date(),
            },
            $setOnInsert: {
              oauthProvider: "github",
              oauthId: String(profile.id),
              createdAt: new Date(),
            },
          },
          { upsert: true, returnDocument: "after" }
        );

        // Works for both mongodb driver v5 (returns doc) and v6 (returns { value })
        const user = result && result.value !== undefined ? result.value : result;
        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

passport.serializeUser((user, done) => done(null, user._id.toString()));

passport.deserializeUser(async (id, done) => {
  try {
    const user = await getDatabase()
      .collection("users")
      .findOne({ _id: new ObjectId(id) });
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

module.exports = passport;