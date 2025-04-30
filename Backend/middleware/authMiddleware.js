// middleware/authMiddleware.js
const jwt = require("jsonwebtoken");
require("dotenv").config();

// Middleware to verify JWT token
exports.authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // Extract token from Authorization header

  if (!token) {
    return res.status(401).json({ message: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach user data to request object
    next();
  } catch (error) {
    res.status(400).json({ message: "Invalid token." });
  }
};