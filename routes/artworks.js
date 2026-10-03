const express = require("express");
const router = express.Router();
const controller = require("../controllers/artworks");
const { isAuthenticated } = require("../middleware/auth");
const { validateArtwork } = require("../middleware/validation");

// Public routes
router.get("/", controller.getAll);
router.get("/:id", controller.getOne);

// Protected routes
router.post("/", isAuthenticated, validateArtwork, controller.create);
router.put("/:id", isAuthenticated, validateArtwork, controller.update);
router.delete("/:id", isAuthenticated, controller.remove);

module.exports = router;
