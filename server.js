require("dotenv").config();

const express = require("express");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const passport = require("passport");

require("./config/passport");

const { initDb } = require("./data/database");
const authRoutes = require("./routes/auth");
const artistRoutes = require("./routes/artists");
const artworkRoutes = require("./routes/artworks");
const errorHandler = require("./middleware/errorHandler");

const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json");

const app = express();
const PORT = process.env.PORT || 3000;

app.set("trust proxy", 1);

app.use(express.json());

// Sessions stored in MongoDB: Render restarts no longer log you out
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI,
      collectionName: "sessions",
    }),
    cookie: {
      secure: true,
      httpOnly: true,
      sameSite: "lax",
      maxAge: 1000 * 60 * 60 * 24, // 1 day
    },
  })
);

// Passport
app.use(passport.initialize());
app.use(passport.session());

// ==========================================
// ====== HOME ROUTE =========================
// ==========================================

app.get("/", (req, res) => {
  const isLoggedIn = req.isAuthenticated && req.isAuthenticated();

  const authButton = isLoggedIn
    ? `
      <a class="btn" href="/auth/logout">
        Logout
      </a>
    `
    : `
      <a class="btn" href="/auth/github">
        Admin Login
      </a>
    `;

  const adminInfo =
    isLoggedIn && req.user?.role === "admin"
      ? `<p><strong>Logged in as Administrator: ${req.user.username}</strong></p>`
      : "";

  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>ArtCatalog Team 8 API</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          text-align: center;
          margin-top: 100px;
        }

        h1 {
          margin-bottom: 20px;
        }

        p {
          color: #555;
          margin-bottom: 20px;
        }

        .btn {
          display: inline-block;
          padding: 12px 24px;
          background-color: #85ea2d;
          color: black;
          text-decoration: none;
          border-radius: 6px;
          font-size: 18px;
          font-weight: bold;
          margin: 10px;
        }

        .btn:hover {
          background-color: #70c325;
        }
      </style>
    </head>

    <body>
      <h1>ArtCatalog Team 8 API</h1>

      <p>
        Browse artists and artworks through the Swagger documentation.
        Administrative actions require GitHub authentication.
      </p>

      ${adminInfo}

      <a class="btn" href="/api-docs">
        Open API Documentation
      </a>

      ${authButton}
    </body>
    </html>
  `);
});

// ==========================================
// ====== FEATURE ROUTES =====================
// ==========================================

app.use("/auth", authRoutes);
app.use("/artists", artistRoutes);
app.use("/artworks", artworkRoutes);

// ==========================================
// ====== SWAGGER ============================
// ==========================================

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// ==========================================
// ====== GLOBAL ERROR HANDLER ===============
// ==========================================

app.use(errorHandler);

// ==========================================
// ====== INITIALIZE DATABASE & START ========
// ==========================================

initDb((err) => {
  if (err) {
    console.error("❌ Database initialization failed:", err);
    process.exit(1);
  }

  app.listen(PORT, () => {
    console.log(`🚀 Server successfully running on port ${PORT}`);
  });
});