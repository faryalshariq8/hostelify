const express = require("express");

const {
  applyForHostel,
  getApplications,
  approveApplication,
  rejectApplication,
} = require("../controllers/applicationController");

const { protect } = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");

const router = express.Router();

// Student
router.post("/", protect, applyForHostel);

// Admin
router.get("/", protect, admin, getApplications);

router.put(
  "/:id/approve",
  protect,
  admin,
  approveApplication
);

router.put(
  "/:id/reject",
  protect,
  admin,
  rejectApplication
);

module.exports = router;