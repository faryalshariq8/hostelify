const express = require("express");
const {
  viewProfile,
  editProfile,
  changePassword,
} = require("../controllers/profileController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.route("/")
  .get(protect, viewProfile)
  .put(protect, editProfile);

router.put("/password", protect, changePassword);

module.exports = router;
