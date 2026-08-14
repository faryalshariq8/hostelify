const express = require("express");

const { protect } = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");
const { getStudents } = require("../controllers/userController");

const router = express.Router();

// Admin route to get all students
router.get("/students", protect, admin, getStudents);

module.exports = router;