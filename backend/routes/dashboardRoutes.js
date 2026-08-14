const express = require("express");

const {
  getMyProfile,
  getMyApplication,
  getMyAllocation,
} = require("../controllers/dashboardController");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/profile", protect, getMyProfile);

router.get("/application", protect, getMyApplication);

router.get("/allocation", protect, getMyAllocation);

module.exports = router;