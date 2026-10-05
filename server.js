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
    cookie: { secure: true, httpOnly: true, sameSite: "none" }
  })
);

// Passport
app.use(passport.initialize());
app.use(passport.session());

// ==========================================
// ====== ALL ROUTES ========================
// ==========================================

// Home route
app.get("/", (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>ArtCatalog Team 8 API</title>
      <style>
        body { font-family: Arial, sans-serif; text-align: center; margin-top: 100px; }
        h1 { margin-bottom: 20px; }
        p { color: #555; margin-bottom: 30px; }
        .btn { display: inline-block; padding: 12px 24px; background-color: #85ea2d; color: black; text-decoration: none; border-radius: 6px; font-size: 18px; font-weight: bold; margin: 10px; }
      </style>
    </head>
    <body>
      <h1>ArtCatalog Team 8 API</h1>
      <p>
        Browse artists and artworks through the Swagger documentation. Administrative actions require GitHub authentication.
      </p>
      <a class="btn" href="/api-docs">Open API Documentation</a>
      <a class="btn" href="/auth/github">Admin Login</a>
    </body>
    </html>
  `);
});

// Mounted feature routes
app.use("/auth", authRoutes);
app.use("/artists", artistRoutes);
app.use("/artworks", artworkRoutes);

// Swagger Documentation Route
const swaggerOptions = {
  customJsStr: `
    (function () {
      function setupLogoutButton() {
        const logoutOperation = document.querySelector(
          '.opblock[data-path="/auth/logout"]'
        );

        if (!logoutOperation) {
          return;
        }

        const executeButton = logoutOperation.querySelector(
          '.execute-wrapper .execute'
        );

        if (!executeButton || executeButton.dataset.logoutRedirectAttached) {
          return;
        }

        executeButton.dataset.logoutRedirectAttached = "true";

        executeButton.addEventListener("click", function (event) {
          event.preventDefault();
          event.stopImmediatePropagation();

          // Perform a normal browser navigation.
          // This allows /auth/logout to execute and its
          // res.redirect("/") to take the browser to the home page.
          window.location.href = "/auth/logout";
        }, true);
      }

      // Swagger UI renders its operations dynamically,
      // so watch for the logout operation to appear.
      const observer = new MutationObserver(setupLogoutButton);

      observer.observe(document.body, {
        childList: true,
        subtree: true
      });

      // Also try immediately.
      setupLogoutButton();
    })();
  `
};

app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument, swaggerOptions)
);


// ==========================================
// ====== GLOBAL ERROR HANDLER ==============
// ==========================================
// (Must be loaded AFTER all routes are registered)
app.use(errorHandler);

// ==========================================
// ====== INITIALIZE DATABASE & START =======
// ==========================================
initDb((err) => {
  if (err) {
    console.error("❌ Database initialization failed:", err);
    process.exit(1); 
  } else {
    // Start listening on the port Render gives you
    app.listen(PORT, () => {
      console.log(`🚀 Server successfully running on port ${PORT}`);
    });
  }
});
