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

// Parse JSON bodies
app.use(express.json());

// Sessions
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  }),
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
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

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
