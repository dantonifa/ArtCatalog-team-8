// routes/auth.js
const express = require("express");
const passport = require("passport"); // Ensure it targets your local passport config setup
const authController = require("../controllers/auth");
const router = express.Router();

// Clicking the Admin Login button triggers this, forcing Express to redirect the user to GitHub
router.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"] }),
);

// GitHub returns the authorized user to this exact route location
router.get(
  "/github/callback",
  passport.authenticate("github", { failureRedirect: "/" }),
  (req, res) => {
    res.redirect("/");
  },
);

router.get("/me", authController.getCurrentUser);
router.get("/logout", authController.logout);

module.exports = router;
