// routes/carouselRoutes.js
const express = require("express");
const router = express.Router();
const carouselController = require("../../controllers/admin/caroaselControllers");

// Create a new carousel item
router.post("/", carouselController.createCarouselItem);

// Get all carousel items
router.get("/", carouselController.getAllCarouselItems);
router.get("/:id", carouselController.getSingleCarouselItem);

// Update a carousel item
router.put("/:id", carouselController.updateCarouselItem);

// Delete a carousel item
router.delete("/:id", carouselController.deleteCarouselItem);

module.exports = router;