const asyncHandler = require("express-async-handler");

const RoomTransferRequest = require("../models/RoomTransferRequest");
const RoomAllocation = require("../models/RoomAllocation");
const Room = require("../models/Room");


// @desc    Submit room transfer request
// @route   POST /api/room-transfers
// @access  Student
const submitRoomTransfer = asyncHandler(async (req, res) => {
  const { newRoom, reason } = req.body;

  if (!newRoom || !reason) {
    res.status(400);
    throw new Error("New room and reason are required");
  }

  // Find student's active room allocation
  const allocation = await RoomAllocation.findOne({
    student: req.user._id,
    status: "Active",
  });

  if (!allocation) {
    res.status(400);
    throw new Error("You do not have an active room allocation");
  }

  // Make sure student isn't requesting their current room
  if (allocation.room.toString() === newRoom) {
    res.status(400);
    throw new Error("You are already allocated to this room");
  }

  // Make sure requested room exists
  const requestedRoom = await Room.findById(newRoom);

  if (!requestedRoom) {
    res.status(404);
    throw new Error("Requested room not found");
  }

  // Make sure room is available
  if (!requestedRoom.isAvailable || requestedRoom.occupied >= requestedRoom.capacity) {
    res.status(400);
    throw new Error("Requested room is not available");
  }

  // Prevent multiple pending requests
  const existingRequest = await RoomTransferRequest.findOne({
    student: req.user._id,
    status: "Pending",
  });

  if (existingRequest) {
    res.status(400);
    throw new Error("You already have a pending room transfer request");
  }

  const transferRequest = await RoomTransferRequest.create({
    student: req.user._id,
    currentRoom: allocation.room,
    newRoom,
    reason,
  });

  const populatedRequest = await RoomTransferRequest.findById(
    transferRequest._id
  )
    .populate("currentRoom", "roomNumber roomType")
    .populate("newRoom", "roomNumber roomType");

  res.status(201).json(populatedRequest);
});


// @desc    Get student's room transfer requests
// @route   GET /api/room-transfers/my
// @access  Student
const getMyRoomTransfers = asyncHandler(async (req, res) => {
  const requests = await RoomTransferRequest.find({
    student: req.user._id,
  })
    .populate("currentRoom", "roomNumber roomType")
    .populate("newRoom", "roomNumber roomType")
    .sort({ createdAt: -1 });

  res.json(requests);
});


// @desc    Get all room transfer requests
// @route   GET /api/room-transfers
// @access  Admin
const getAllRoomTransfers = asyncHandler(async (req, res) => {
  const requests = await RoomTransferRequest.find()
    .populate("student", "fullName email")
    .populate("currentRoom", "roomNumber roomType")
    .populate("newRoom", "roomNumber roomType")
    .sort({ createdAt: -1 });

  res.json(requests);
});


// @desc    Approve/reject room transfer
// @route   PUT /api/room-transfers/:id
// @access  Admin
const updateRoomTransferStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;

  if (!["Approved", "Rejected"].includes(status)) {
    res.status(400);
    throw new Error("Status must be Approved or Rejected");
  }

  const request = await RoomTransferRequest.findById(req.params.id);

  if (!request) {
    res.status(404);
    throw new Error("Room transfer request not found");
  }

  if (request.status !== "Pending") {
    res.status(400);
    throw new Error("This room transfer request has already been processed");
  }

  request.status = status;

  await request.save();

  res.json({
    message: `Room transfer request ${status.toLowerCase()}`,
    request,
  });
});


module.exports = {
  submitRoomTransfer,
  getMyRoomTransfers,
  getAllRoomTransfers,
  updateRoomTransferStatus,
};