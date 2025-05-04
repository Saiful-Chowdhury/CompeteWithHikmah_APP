// controllers/carouselController.js
const Carousel = require("../../models/caroaselSchema");
const joi = require("joi");

// Validation schema for carousel creation and updates
const carouselSchema = joi.object({
  imageUrl: joi.string().uri().required(),
  title: joi.string().min(5).max(100).required(),
  description: joi.string().min(10).max(200).required(),
  link: joi.string().uri().allow("").optional(),
});

// Create a new carousel item
exports.createCarouselItem = async (req, res) => {
  try {
    const { error } = carouselSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { imageUrl, title, description, link } = req.body;

    const newCarouselItem = new Carousel({
      imageUrl,
      title,
      description,
      link,
    });

    await newCarouselItem.save();

    res.status(201).json({
      message: "Carousel item created successfully.",
      carouselItem: newCarouselItem,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error." });
  }
};

// Get all carousel items
exports.getAllCarouselItems = async (req, res) => {
  try {
    const carouselItems = await Carousel.find();
    res.status(200).json({
      message: "Carousel items retrieved successfully.",
      carouselItems,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error." });
  }
};

// Update a carousel item
exports.updateCarouselItem = async (req, res) => {
  try {
    const carouselItemId = req.params.id;
    const { error } = carouselSchema.validate(req.body);

    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { imageUrl, title, description, link } = req.body;

    const updatedCarouselItem = await Carousel.findByIdAndUpdate(
      carouselItemId,
      { $set: { imageUrl, title, description, link } },
      { new: true, runValidators: true }
    );

    if (!updatedCarouselItem) {
      return res.status(404).json({ message: "Carousel item not found." });
    }

    res.status(200).json({
      message: "Carousel item updated successfully.",
      carouselItem: updatedCarouselItem,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error." });
  }
};

// Delete a carousel item
exports.deleteCarouselItem = async (req, res) => {
  try {
    const carouselItemId = req.params.id;

    const deletedCarouselItem = await Carousel.findByIdAndDelete(carouselItemId);

    if (!deletedCarouselItem) {
      return res.status(404).json({ message: "Carousel item not found." });
    }

    res.status(200).json({
      message: "Carousel item deleted successfully.",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error." });
  }
};