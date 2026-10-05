const express = require("express");
const router = express.Router();

const controller = require("../controllers/artists");

const { isAdmin } = require("../middleware/auth");

const { validateArtist } = require("../middleware/validation");

// Public routes
router.get("/", controller.getAll);
router.get("/:id", controller.getOne);

// Admin-only routes
router.post("/", isAdmin, validateArtist, controller.create);
router.put("/:id", isAdmin, validateArtist, controller.update);
router.delete("/:id", isAdmin, controller.remove);

module.exports = router;