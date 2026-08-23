const express = require("express");

const { protect } = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");
const { getStudents, deleteStudent } = require("../controllers/userController");

const router = express.Router();

// Admin route to get all students
router.get("/students", protect, admin, getStudents);

// Admin route to delete a student
router.delete("/students/:id", protect, admin, deleteStudent);

module.exports = router;