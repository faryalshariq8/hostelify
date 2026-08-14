const asyncHandler = require("express-async-handler");
const FeePayment = require("../models/FeePayment");
const RoomAllocation = require("../models/RoomAllocation");
const crypto = require("crypto");
console.log("Stripe key:", process.env.STRIPE_SECRET_KEY);
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const makePayment = asyncHandler(async (req, res) => {
  const { paymentMethod, amount, semester } = req.body;
  const currentSemester = semester || "Current";

  const allocation = await RoomAllocation.findOne({ student: req.user._id, status: "Active" });

  if (!allocation) {
    res.status(400);
    throw new Error("No active room allocated to make payment for");
  }

  // Prevent duplicate fee payments for the same semester
  const existingPayment = await FeePayment.findOne({
    student: req.user._id,
    semester: currentSemester,
    status: "Paid"
  });

  if (existingPayment) {
    res.status(400);
    throw new Error(`Fee for ${currentSemester} semester is already paid`);
  }

  const transactionId = "TXN" + crypto.randomBytes(6).toString("hex").toUpperCase();
  const receiptNumber = "REC" + Date.now().toString().slice(-6);

  const payment = await FeePayment.create({
    student: req.user._id,
    hostel: allocation.hostel,
    room: allocation.room,
    amount,
    paymentMethod,
    transactionId,
    receiptNumber,
    semester: currentSemester,
    status: "Paid"
  });

  res.status(201).json({
    message: "Payment successful",
    payment
  });
});

// @desc    Generate Stripe Payment Intent
// @route   POST /api/payments/intent
// @access  Student
const createPaymentIntent = asyncHandler(async (req, res) => {
  const { amount } = req.body;
  
  if (!amount) {
    res.status(400);
    throw new Error("Amount is required");
  }

  // Multiply by 100 as Stripe expects amounts in cents
  const paymentIntent = await stripe.paymentIntents.create({
    amount: amount * 100,
    currency: "usd",
  });

  res.json({
    clientSecret: paymentIntent.client_secret,
  });
});

const getPaymentHistory = asyncHandler(async (req, res) => {
  const payments = await FeePayment.find({ student: req.user._id })
    .populate("hostel", "name")
    .populate("room", "roomNumber")
    .sort({ createdAt: -1 });

  res.json(payments);
});

const getAllPayments = asyncHandler(async (req, res) => {
  const { search, status, page = 1, limit = 10, sort = "-createdAt" } = req.query;

  let query = {};

  if (status) {
    query.status = status;
  }

  if (search) {
    const User = require("../models/User");
    const users = await User.find({ fullName: { $regex: search, $options: "i" } }).select("_id");
    const userIds = users.map(u => u._id);

    const Hostel = require("../models/Hostel");
    const hostels = await Hostel.find({ name: { $regex: search, $options: "i" } }).select("_id");
    const hostelIds = hostels.map(h => h._id);
    
    query.$or = [
      { student: { $in: userIds } },
      { hostel: { $in: hostelIds } },
      { transactionId: { $regex: search, $options: "i" } },
      { receiptNumber: { $regex: search, $options: "i" } }
    ];
  }

  const payments = await FeePayment.find(query)
    .populate("student", "fullName email")
    .populate("hostel", "name")
    .populate("room", "roomNumber")
    .sort(sort)
    .limit(limit * 1)
    .skip((page - 1) * limit);

  const total = await FeePayment.countDocuments(query);

  res.json({
    payments,
    totalPages: Math.ceil(total / limit),
    currentPage: parseInt(page),
    totalPayments: total
  });
});

module.exports = {
  makePayment,
  createPaymentIntent,
  getPaymentHistory,
  getAllPayments
};
