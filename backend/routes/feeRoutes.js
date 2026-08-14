const express = require("express");
const {
  createFeeStructure,
  updateFeeStructure,
  deleteFeeStructure,
  getFeeStructures,
  getMyFee,
} = require("../controllers/feeController");
const { protect } = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");

const router = express.Router();

router.get("/my", protect, getMyFee);

router.route("/")
  .post(protect, admin, createFeeStructure)
  .get(protect, admin, getFeeStructures);

router.route("/:id")
  .put(protect, admin, updateFeeStructure)
  .delete(protect, admin, deleteFeeStructure);

module.exports = router;
