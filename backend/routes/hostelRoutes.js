const express = require("express");

const {
  createHostel,
  getHostels,
  getHostelById,
  updateHostel,
  deleteHostel,
} = require("../controllers/hostelController");

const { protect } = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");

const router = express.Router();

// Student + Admin
router.get("/", protect, getHostels);
router.get("/:id", protect, getHostelById);

// Admin only
router.post("/", protect, admin, createHostel);
router.put("/:id", protect, admin, updateHostel);
router.delete("/:id", protect, admin, deleteHostel);

module.exports = router;