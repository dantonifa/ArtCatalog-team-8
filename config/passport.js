// config/passport.js
const passport = require("passport");
const GitHubStrategy = require("passport-github2").Strategy;
const { ObjectId } = require("mongodb");
const { getDatabase } = require("../data/database");

passport.use(
  new GitHubStrategy(
    {
      // These credentials must be perfectly bound to your .env properties
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: process.env.CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const users = getDatabase().collection("users");

        // CRITICAL ADMIN CONVERSION:
        // Evaluates your personal GitHub username against your environment config variable.
        // If they match perfectly, it sets your profile role as "admin".
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
              role, // Injects "admin" status directly into the database document
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

        const user = result && result.value !== undefined ? result.value : result;
        return done(null, user);
      } catch (err) {
        console.error("❌ Passport strategy error:", err);
        return done(err, null);
      }
    }
  )
);

// Standard session serialization handlers to store the user ID inside the session cookie
passport.serializeUser((user, done) => {
  done(null, user._id.toString());
});

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
