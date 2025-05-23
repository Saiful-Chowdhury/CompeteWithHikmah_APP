const express = require('express');
const router = express.Router();

const { register,adminRegister, getAllUsers, login,getUserById,updateUser,deleteUser,adminLogin } = require('../../controllers/admin/authController')
const { authenticate } = require('../../middleware/authMiddleware');


// Public routes
router.post("/register", register);
router.post("/admin/register", adminRegister);
router.post("/login", login);
router.post("/admin/login", adminLogin);

// Admin routes
router.get("/users", getAllUsers); // Get all users (Admin-only)
router.get("/users/:id", getUserById); // Get a single user by ID
router.put("/users/:id", updateUser); // Update a user
router.delete("/users/:id", deleteUser); // Delete a user


module.exports = router;