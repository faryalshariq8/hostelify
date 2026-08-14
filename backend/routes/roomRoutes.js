const express = require("express");

const {
  createRoom,
  getRooms,
  getRoomsByHostel,
  updateRoom,
  deleteRoom,
  requestTransfer,
  getTransferRequests,
  approveTransfer,
  rejectTransfer
} = require("../controllers/roomController");

const { protect } = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");

const router = express.Router();

router.route("/")
  .post(protect, admin, createRoom)
  .get(protect, getRooms);

router.get("/hostel/:hostelId", protect, getRoomsByHostel);

// Room Transfer Routes
router.route("/transfer")
  .post(protect, requestTransfer)
  .get(protect, admin, getTransferRequests);

router.put("/transfer/:id/approve", protect, admin, approveTransfer);
router.put("/transfer/:id/reject", protect, admin, rejectTransfer);

router.route("/:id")
  .put(protect, admin, updateRoom)
  .delete(protect, admin, deleteRoom);

module.exports = router;