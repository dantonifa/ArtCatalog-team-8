const express = require("express");
const passport = require("../config/passport");
const authController = require("../controllers/auth");

const router = express.Router();

router.get("/github", passport.authenticate("github", { scope: ["user:email"] }));

router.get(
  "/github/callback",
  passport.authenticate("github", { failureRedirect: "/" }),
  (req, res) => req.session.save(() => res.redirect("/api-docs"))
);

router.get("/me", authController.getCurrentUser);
router.get("/logout", authController.logout);

module.exports = router;