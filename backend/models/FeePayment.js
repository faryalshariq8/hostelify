const mongoose = require("mongoose");

const feePaymentSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    hostel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hostel",
      required: true,
    },
    room: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    paymentDate: {
      type: Date,
      default: Date.now,
    },
    paymentMethod: {
      type: String,
      enum: ["Card", "Bank Transfer", "Cash", "Online"],
      required: true,
    },
    transactionId: {
      type: String,
      required: true,
      unique: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Paid", "Failed"],
      default: "Paid",
    },
    receiptNumber: {
      type: String,
      required: true,
      unique: true,
    },
    semester: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

feePaymentSchema.index({ student: 1, transactionId: 1 });

module.exports = mongoose.model("FeePayment", feePaymentSchema);
