const express = require("express");
const {
  makePayment,
  createPaymentIntent,
  getPaymentHistory,
  getAllPayments,
} = require("../controllers/paymentController");
const { protect } = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");

const router = express.Router();

router.post("/pay", protect, makePayment);
router.post("/intent", protect, createPaymentIntent);
router.get("/history", protect, getPaymentHistory);
router.get("/", protect, admin, getAllPayments);

module.exports = router;
