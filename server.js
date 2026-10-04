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
          margin-bottom: 30px;
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
        }
      </style>
    </head>
    <body>
      <h1>ArtCatalog Team 8 API</h1>

      <p>
        Browse artists and artworks through the Swagger documentation.
        Administrative actions require GitHub authentication.
      </p>

      /api-docs
        Open API Documentation
      </a>
    </body>
    </html>
  `);
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
