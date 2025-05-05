// Backend/controllers/admin/blogControllers.js
const Blog = require("../../models/blogsSchema");
const joi = require("joi");

// Validation schema for blog creation
const blogSchema = joi.object({
  title: joi.string().min(5).max(100).required(),
  author: joi.string().min(3).max(50).required(),
  content: joi.string().min(10).required(),
  category: joi.string().min(3).max(50).required(),
  imageUrl: joi.string().uri().allow("").optional(),
});

// Validation schema for updating a blog
const updateBlogSchema = joi.object({
  title: joi.string().min(5).max(100).optional(),
  author: joi.string().min(3).max(50).optional(),
  content: joi.string().min(10).optional(),
  category: joi.string().min(3).max(50).optional(),
  imageUrl: joi.string().uri().allow("").optional(),
}).or("title", "author", "content", "category", "imageUrl"); // At least one field must be provided

// Validation schema for adding a comment
const commentSchema = joi.object({
  author: joi.string().min(3).max(50).required(),
  content: joi.string().min(10).required(),
});

// Create a new blog
exports.createBlog = async (req, res) => {
  try {
    const { error } = blogSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { title, author, content, category, imageUrl } = req.body;

    const newBlog = new Blog({
      title,
      author,
      content,
      category,
      imageUrl,
    });

    await newBlog.save();

    res.status(201).json({
      message: "Blog created successfully.",
      blog: newBlog,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error." });
  }
};

// Get all blogs
exports.getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    res.status(200).json({
      message: "Blogs retrieved successfully.",
      blogs,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error." });
  }
};

// Get a single blog by ID
exports.getSingleBlog = async (req, res) => {
  try {
    const blogId = req.params.id;
    const blog = await Blog.findById(blogId); // Fixed typo here
    if (!blog) {
      return res.status(404).json({ message: "Blog not found." });
    }
    res.status(200).json({
      message: "Blog retrieved successfully.",
      blog,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error." });
  }
};

// Add a comment to a blog
exports.addComment = async (req, res) => {
  try {
    const blogId = req.params.id;
    const { error } = commentSchema.validate(req.body);

    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { author, content } = req.body;

    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found." });
    }

    blog.comments.push({ author, content });
    await blog.save();

    res.status(201).json({
      message: "Comment added successfully.",
      blog,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error." });
  }
};

// Delete a blog
exports.deleteBlog = async (req, res) => {
  try {
    const blogId = req.params.id;
    const blog = await Blog.findById(blogId); // Fixed typo here
    if (!blog) {
      return res.status(404).json({ message: "Blog not found." });
    }

    await Blog.findByIdAndDelete(blogId); // Use findByIdAndDelete instead of remove()
    res.status(200).json({
      message: "Blog deleted successfully.",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error." });
  }
};

// Update a blog
exports.updateBlog = async (req, res) => {
  try {
    const blogId = req.params.id;

    // Validate the request body
    const { error } = updateBlogSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { title, author, content, category, imageUrl } = req.body;

    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found." });
    }

    // Update only the fields provided in the request body
    blog.title = title || blog.title;
    blog.author = author || blog.author;
    blog.content = content || blog.content;
    blog.category = category || blog.category;
    blog.imageUrl = imageUrl || blog.imageUrl;

    await blog.save();

    res.status(200).json({
      message: "Blog updated successfully.",
      blog,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error." });
  }
};