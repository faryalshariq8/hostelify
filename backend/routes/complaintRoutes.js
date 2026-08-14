const express = require("express");

const {
  submitComplaint,
  getMyComplaints,
  getAllComplaints,
  updateComplaintStatus,
} = require("../controllers/complaintController");

const { protect } = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");

const router = express.Router();

// Student
router.post("/", protect, submitComplaint);
router.get("/my", protect, getMyComplaints);

// Admin
router.get("/", protect, admin, getAllComplaints);
router.put("/:id", protect, admin, updateComplaintStatus);

module.exports = router;