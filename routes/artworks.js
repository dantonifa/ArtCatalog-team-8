const express = require("express");
const router = express.Router();

const controller = require("../controllers/artworks");

const { isAdmin } = require("../middleware/auth");

const { validateArtwork } = require("../middleware/validation");

// Public routes
router.get("/", controller.getAll);
router.get("/:id", controller.getOne);

// Admin-only routes
router.post("/", isAdmin, validateArtwork, controller.create);
router.put("/:id", isAdmin, validateArtwork, controller.update);
router.delete("/:id", isAdmin, controller.remove);

module.exports = router;