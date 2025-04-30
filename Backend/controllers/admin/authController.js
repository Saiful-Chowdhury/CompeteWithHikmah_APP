// controllers/authController.js
const User = require("../../models/userSchema");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const joi = require("joi");

// Validation schema for user registration
const userSchema = joi.object({
  name: joi.string().min(3).max(30).required(),
  email: joi.string().email().required(),
  password: joi.string().min(8).max(30).required(),
  role: joi.string().valid("User", "Admin").default("User"),
});

// Validation schema for login
const loginSchema = joi.object({
  email: joi.string().email().required(),
  password: joi.string().min(8).max(30).required(),
});

// Register a new user
exports.register = async (req, res) => {
  try {
    // Step 1: Validate the request body using Joi
    const { error } = userSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { name, email, password } = req.body;

    // Step 2: Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists." });
    }

    // Step 3: Create and save the new user
    const newUser = new User({
      name,
      email,
      password, // Password will be hashed by the pre-save hook in the User model
      role:"User", // Default role is "User"
    });

    await newUser.save();

    // Step 4: Generate JWT token
    const token = jwt.sign(
      { userId: newUser._id, role: newUser.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Step 5: Respond with success message and token
    res.status(201).json({
      message: "User registered successfully.",
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error." });
  }
};
exports.adminRegister = async (req, res) => {
  try {
    // Step 1: Validate the request body using Joi
    const { error } = userSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { name, email, password, role } = req.body;

    // Step 2: Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists." });
    }

    // Step 3: Create and save the new user
    const newUser = new User({
      name,
      email,
      password, // Password will be hashed by the pre-save hook in the User model
      role: role || "User", // Default role is "User"
    });

    await newUser.save();

    // Step 4: Generate JWT token
    const token = jwt.sign(
      { userId: newUser._id, role: newUser.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Step 5: Respond with success message and token
    res.status(201).json({
      message: "User registered successfully.",
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error." });
  }
};

// Login a user
exports.login = async (req, res) => {
  try {
    // Step 1: Validate the request body using Joi
    const { error } = loginSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { email, password } = req.body;

    // Step 2: Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password." });
    }

    // Step 3: Compare passwords
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid email or password." });
    }

    // Step 4: Generate JWT token
    const token = jwt.sign(
      { userId: user._id, role: user.role,email:user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Step 5: Respond with success message and token
    res.status(200).json({
      message: "Login successful.",
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error." });
  }
};

// Get all users (Admin-only)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, { password: 0 }); // Exclude passwords from the response
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error." });
  }
};

// Get a single user by ID
exports.getUserById = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId, { password: 0 }); // Exclude passwords from the response

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error." });
  }
};

// Update a user by ID
exports.updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const updates = req.body;

    // Step 1: Validate the request body using Joi
    const { error } = userSchema.validate(updates);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    // Step 2: Update the user
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found." });
    }

    res.status(200).json({
      message: "User updated successfully.",
      user: updatedUser,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error." });
  }
};

// Delete a user by ID
exports.deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;

    // Step 1: Delete the user
    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found." });
    }

    res.status(200).json({
      message: "User deleted successfully.",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error." });
  }
};