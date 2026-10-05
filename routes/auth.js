const express = require("express");
require("../config/passport");
const passport = require("passport");

const router = express.Router();
const authController = require("../controllers/auth");

// Login
router.get("/github", (req, res) => {
  res.redirect("https://github.com/login");
});

// Callback
router.get(
  "/github/callback",
  passport.authenticate("github", {
    failureRedirect: "/",
  }),
  (req, res) => {
    res.redirect("/api-docs");
  }
);

// Current User
router.get("/me", authController.getCurrentUser);

// Logout
router.get("/logout", authController.logout);

module.exports = router;
