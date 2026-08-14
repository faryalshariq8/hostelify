const asyncHandler = require("express-async-handler");
const FeeStructure = require("../models/FeeStructure");
const RoomAllocation = require("../models/RoomAllocation");

const createFeeStructure = asyncHandler(async (req, res) => {
  const { hostel, roomType, amount } = req.body;

  const fee = await FeeStructure.create({
    hostel,
    roomType,
    amount,
  });

  res.status(201).json(fee);
});

const updateFeeStructure = asyncHandler(async (req, res) => {
  const fee = await FeeStructure.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!fee) {
    res.status(404);
    throw new Error("Fee structure not found");
  }

  res.json(fee);
});

const deleteFeeStructure = asyncHandler(async (req, res) => {
  const fee = await FeeStructure.findById(req.params.id);

  if (!fee) {
    res.status(404);
    throw new Error("Fee structure not found");
  }

  await fee.deleteOne();
  res.json({ message: "Fee structure removed" });
});

const getFeeStructures = asyncHandler(async (req, res) => {
  const fees = await FeeStructure.find().populate("hostel", "name");
  res.json(fees);
});

const getMyFee = asyncHandler(async (req, res) => {
  const allocation = await RoomAllocation.findOne({
    student: req.user._id,
    status: "Active",
  })
    .populate("hostel")
    .populate("room");

  if (!allocation) {
    res.status(404);
    throw new Error("No room allocated yet");
  }

  const feeStructure = await FeeStructure.findOne({
    hostel: allocation.hostel._id,
    roomType: allocation.room.roomType,
  });

  // Current semester used by the payment system
  const currentSemester = req.query.semester || "Fall 2026";

  // Check whether this student has already paid for this semester
  const FeePayment = require("../models/FeePayment");

  const existingPayment = await FeePayment.findOne({
    student: req.user._id,
    semester: currentSemester,
    status: "Paid",
  });

  res.json({
    room: allocation.room,
    fee: feeStructure ? feeStructure.amount : 0,
    dueDate: new Date(
      new Date().setMonth(new Date().getMonth() + 1)
    ),
    semester: currentSemester,
    status: existingPayment ? "Paid" : "Unpaid",
    payment: existingPayment
      ? {
          transactionId: existingPayment.transactionId,
          receiptNumber: existingPayment.receiptNumber,
          paymentDate: existingPayment.paymentDate,
          paymentMethod: existingPayment.paymentMethod,
          amount: existingPayment.amount,
        }
      : null,
  });
});

module.exports = {
  createFeeStructure,
  updateFeeStructure,
  deleteFeeStructure,
  getFeeStructures,
  getMyFee,
};