require("dotenv").config();

const express = require("express");
const session = require("express-session");
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

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: true,
      httpOnly: true,
      sameSite: "none"
    }
  })
);

// Passport
app.use(passport.initialize());
app.use(passport.session());

// Home route
app.get("/", (req, res) => {
  res.json({
    message: "Welcome to the Art Catalog API",
  });
});

// API Routes
app.use("/auth", authRoutes);
app.use("/artists", artistRoutes);
app.use("/artworks", artworkRoutes);

// Swagger Documentation
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument, {
    customSiteTitle: "ArtCatalog API",

    customCss: `
      .swagger-ui .topbar-wrapper::after {
        content: '';
      }

      .github-login-btn {
        background: #24292f;
        color: white !important;
        padding: 8px 16px;
        border-radius: 6px;
        text-decoration: none;
        font-weight: bold;
        margin-left: 20px;
      }
    `,

    customJs: `
      window.onload = function() {
        const interval = setInterval(() => {
          const topbar = document.querySelector('.topbar-wrapper');

          if (topbar && !document.querySelector('.github-login-btn')) {
            const btn = document.createElement('a');

            btn.href = '/auth/github';
            btn.innerText = 'Login with GitHub';
            btn.className = 'github-login-btn';

            topbar.appendChild(btn);

            clearInterval(interval);
          }
        }, 500);
      };
    `
  })
);

// Error Handler
app.use(errorHandler);

// Initialize Database and Start Server
initDb((err) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
