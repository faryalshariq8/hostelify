const asyncHandler = require("express-async-handler");
const HostelApplication = require("../models/HostelApplication");
const Hostel = require("../models/Hostel");
const Room = require("../models/Room");
const RoomAllocation = require("../models/RoomAllocation");
const updateHostelAvailability = require("../utils/updateHostelAvailability");

const applyForHostel = asyncHandler(async (req, res) => {
  const { hostel } = req.body;

  const hostelExists = await Hostel.findById(hostel);

  if (!hostelExists) {
    res.status(404);
    throw new Error("Hostel not found");
  }

  // Duplicate prevention check
  const alreadyApplied = await HostelApplication.findOne({
    student: req.user._id,
    hostel, // Or maybe any pending application
    status: { $in: ["Pending", "Approved"] } // Prevent if they already have an active/pending one
  });

  if (alreadyApplied) {
    res.status(400);
    throw new Error("You already have an active or pending application");
  }

  const application = await HostelApplication.create({
    student: req.user._id,
    hostel,
  });

  res.status(201).json(application);
});

const getApplications = asyncHandler(async (req, res) => {
  const applications = await HostelApplication.find()
    .populate("student", "fullName email")
    .populate("hostel", "name")
    .sort({ createdAt: -1 });

  res.json(applications);
});

const approveApplication = asyncHandler(async (req, res) => {
  const { roomId } = req.body;

  const application = await HostelApplication.findById(req.params.id);

  if (!application) {
    res.status(404);
    throw new Error("Application not found");
  }

  if (application.status === "Approved") {
    res.status(400);
    throw new Error("Application is already approved");
  }

  const room = await Room.findById(roomId);

  if (!room) {
    res.status(404);
    throw new Error("Room not found");
  }

  if (!room.isAvailable) {
    res.status(400);
    throw new Error("Room is already full");
  }

  if (room.hostel.toString() !== application.hostel.toString()) {
    res.status(400);
    throw new Error(
      "Selected room does not belong to the requested hostel"
    );
  }

  // Prevent multiple active allocations
  const activeAllocation = await RoomAllocation.findOne({ student: application.student, status: "Active" });
  if (activeAllocation) {
    res.status(400);
    throw new Error("Student already has an active room allocation");
  }

  application.status = "Approved";
  await application.save();

  await RoomAllocation.create({
    student: application.student,
    hostel: application.hostel,
    room: room._id,
    allocatedBy: req.user._id,
    status: "Active"
  });

  room.occupied += 1;

  if (room.occupied >= room.capacity) {
    room.isAvailable = false;
  }

  await room.save();
  await updateHostelAvailability(room.hostel);

  res.json({
    message: "Application approved successfully",
  });
});

const rejectApplication = asyncHandler(async (req, res) => {
  const application = await HostelApplication.findById(req.params.id);

  if (!application) {
    res.status(404);
    throw new Error("Application not found");
  }

  application.status = "Rejected";
  await application.save();

  res.json({
    message: "Application rejected",
  });
});

module.exports = {
  applyForHostel,
  getApplications,
  approveApplication,
  rejectApplication,
};