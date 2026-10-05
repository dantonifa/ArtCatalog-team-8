const express = require("express");
const passport = require("../config/passport");
const authController = require("../controllers/auth");

const router = express.Router();

// Step 1: send the user to GitHub's authorize page
router.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"] })
);

// Step 2: GitHub returns here, then go to Swagger
router.get(
  "/github/callback",
  passport.authenticate("github", { failureRedirect: "/" }),
  (req, res) => {
    req.session.save(() => res.redirect("/api-docs"));
  }
);

router.get("/me", authController.getCurrentUser);
router.get("/logout", authController.logout);

module.exports = router;