const express = require("express");

const {
  submitRoomTransfer,
  getMyRoomTransfers,
  getAllRoomTransfers,
  updateRoomTransferStatus,
} = require("../controllers/roomTransferController");

const { protect } = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");

const router = express.Router();

// Student
router.post("/", protect, submitRoomTransfer);
router.get("/my", protect, getMyRoomTransfers);

// Admin
router.get("/", protect, admin, getAllRoomTransfers);
router.put("/:id", protect, admin, updateRoomTransferStatus);

module.exports = router;