const express = require("express");
const {
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
  getAnnouncements,
} = require("../controllers/announcementController");

const { protect } = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");

const router = express.Router();

router.route("/")
  .post(protect, admin, createAnnouncement)
  .get(protect, getAnnouncements);

router.route("/:id")
  .put(protect, admin, updateAnnouncement)
  .delete(protect, admin, deleteAnnouncement);

module.exports = router;
