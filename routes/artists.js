const express = require("express");
const router = express.Router();
const controller = require("../controllers/artists");
const { isAuthenticated } = require("../middleware/auth");
const { validateArtist } = require("../middleware/validation");

// Public routes
router.get("/", controller.getAll);
router.get("/:id", controller.getOne);

// Protected routes (must be logged in)
router.post("/", isAuthenticated, validateArtist, controller.create);
router.put("/:id", isAuthenticated, validateArtist, controller.update);
router.delete("/:id", isAuthenticated, controller.remove);

module.exports = router;
