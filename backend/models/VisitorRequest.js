const mongoose = require("mongoose");

const visitorRequestSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    visitorName: {
      type: String,
      required: true,
    },
    relation: {
      type: String,
      required: true,
    },
    visitDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
      index: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("VisitorRequest", visitorRequestSchema);
