const asyncHandler = require("express-async-handler");
const User = require("../models/User");
const HostelApplication = require("../models/HostelApplication");
const RoomAllocation = require("../models/RoomAllocation");

const getMyProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  res.json(user);
});

const getMyApplication = asyncHandler(async (req, res) => {
  const application = await HostelApplication.findOne({
    student: req.user._id,
  }).populate("hostel", "name address availableRooms image");

  if (!application) {
    res.status(404);
    throw new Error("No application found");
  }

  res.json(application);
});

const getMyAllocation = asyncHandler(async (req, res) => {
  const allocation = await RoomAllocation.findOne({
    student: req.user._id,
    status: "Active"
  })
    .populate("hostel")
    .populate("room");

  if (!allocation) {
    res.status(404);
    throw new Error("No room allocated yet");
  }

  res.json(allocation);
});

module.exports = {
  getMyProfile,
  getMyApplication,
  getMyAllocation,
};