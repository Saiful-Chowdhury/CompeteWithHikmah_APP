// routes/blogRoutes.js
const express = require("express");
const router = express.Router();
const blogController = require("../../controllers/admin/blogControllers");

// Create a new blog
router.post("/admin", blogController.createBlog);

// Get all blogs
router.get("/", blogController.getAllBlogs);
router.get("/:id", blogController.getSingleBlog);
router.delete("/:id", blogController.deleteBlog);
router.put("/:id", blogController.updateBlog);

// Add a comment to a blog
router.post("/:id/comments", blogController.addComment);

module.exports = router;