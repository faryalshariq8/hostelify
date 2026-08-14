const express = require("express");
const {
  submitLeave,
  getMyLeaves,
  getAllLeaves,
  updateLeaveStatus
} = require("../controllers/leaveController");
const { protect } = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");

const router = express.Router();

router.route("/")
  .post(protect, submitLeave)
  .get(protect, admin, getAllLeaves);

router.get("/my", protect, getMyLeaves);

router.put("/:id", protect, admin, updateLeaveStatus);

module.exports = router;
