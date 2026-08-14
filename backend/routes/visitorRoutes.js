const express = require("express");
const {
  submitVisitorRequest,
  getMyVisitorRequests,
  getAllVisitorRequests,
  updateVisitorStatus
} = require("../controllers/visitorController");
const { protect } = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");

const router = express.Router();

router.route("/")
  .post(protect, submitVisitorRequest)
  .get(protect, admin, getAllVisitorRequests);

router.get("/my", protect, getMyVisitorRequests);

router.put("/:id", protect, admin, updateVisitorStatus);

module.exports = router;
