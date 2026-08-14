const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema(
  {
    hostel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hostel",
      required: true,
    },

    roomNumber: {
      type: String,
      required: true,
    },

    capacity: {
      type: Number,
      required: true,
      min: 1,
    },

    occupied: {
      type: Number,
      default: 0,
    },

    roomType: {
      type: String,
      enum: ["Single", "Double", "Triple"],
      default: "Double",
    },

    fee: {
      type: Number,
      required: true,
    },

    isAvailable: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

roomSchema.index({ hostel: 1, roomNumber: 1 }, { unique: true });

module.exports = mongoose.model("Room", roomSchema);