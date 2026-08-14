const asyncHandler = require("express-async-handler");
const Room = require("../models/Room");
const Hostel = require("../models/Hostel");
const RoomAllocation = require("../models/RoomAllocation");
const RoomTransferRequest = require("../models/RoomTransferRequest");
const updateHostelAvailability = require("../utils/updateHostelAvailability");

const createRoom = asyncHandler(async (req, res) => {
  const hostel = await Hostel.findById(req.body.hostel);

  if (!hostel) {
    res.status(404);
    throw new Error("Hostel not found");
  }

  if (req.body.occupied > req.body.capacity) {
    res.status(400);
    throw new Error("Occupied cannot exceed capacity");
  }

  const isAvailable = req.body.occupied < req.body.capacity;

  const room = await Room.create({
    ...req.body,
    isAvailable,
  });

  await updateHostelAvailability(hostel._id);

  res.status(201).json(room);
});

const getRooms = asyncHandler(async (req, res) => {
  const { search, page = 1, limit = 10, sort = "roomNumber" } = req.query;

  let query = {};
  if (search) {
    const hostels = await Hostel.find({ name: { $regex: search, $options: "i" } }).select("_id");
    const hostelIds = hostels.map(h => h._id);
    
    query.$or = [
      { roomNumber: { $regex: search, $options: "i" } },
      { roomType: { $regex: search, $options: "i" } },
      { hostel: { $in: hostelIds } }
    ];
  }

  const rooms = await Room.find(query)
    .populate("hostel", "name location")
    .sort(sort)
    .limit(limit * 1)
    .skip((page - 1) * limit);

  const total = await Room.countDocuments(query);

  res.json({
    rooms,
    totalPages: Math.ceil(total / limit),
    currentPage: parseInt(page),
    totalRooms: total
  });
});

const getRoomsByHostel = asyncHandler(async (req, res) => {
  const rooms = await Room.find({
    hostel: req.params.hostelId,
  }).populate("hostel", "name");

  res.json(rooms);
});

const updateRoom = asyncHandler(async (req, res) => {
  const room = await Room.findById(req.params.id);

  if (!room) {
    res.status(404);
    throw new Error("Room not found");
  }

  room.roomNumber = req.body.roomNumber ?? room.roomNumber;
  room.capacity = req.body.capacity ?? room.capacity;
  room.occupied = req.body.occupied ?? room.occupied;
  room.roomType = req.body.roomType ?? room.roomType;
  room.fee = req.body.fee ?? room.fee;
  
  if (room.occupied > room.capacity) {
      res.status(400);
      throw new Error("Occupied cannot exceed capacity");
  }

  room.isAvailable = room.occupied < room.capacity;
  const updatedRoom = await room.save();
  await updateHostelAvailability(room.hostel);
  res.json(updatedRoom);
});

const deleteRoom = asyncHandler(async (req, res) => {
  const room = await Room.findById(req.params.id);

  if (!room) {
    res.status(404);
    throw new Error("Room not found");
  }

  await room.deleteOne();
  await updateHostelAvailability(room.hostel);

  res.json({
    message: "Room deleted successfully",
  });
});

// ROOM TRANSFERS
const requestTransfer = asyncHandler(async (req, res) => {
  const { newRoom, reason } = req.body;

  const currentAllocation = await RoomAllocation.findOne({ student: req.user._id, status: "Active" });

  if (!currentAllocation) {
    res.status(400);
    throw new Error("You do not have an active room allocation");
  }

  const targetRoom = await Room.findById(newRoom);
  if (!targetRoom || !targetRoom.isAvailable) {
    res.status(400);
    throw new Error("The requested room is either invalid or unavailable");
  }

  const existingRequest = await RoomTransferRequest.findOne({ student: req.user._id, status: "Pending" });
  if (existingRequest) {
    res.status(400);
    throw new Error("You already have a pending transfer request");
  }

  const transferRequest = await RoomTransferRequest.create({
    student: req.user._id,
    currentRoom: currentAllocation.room,
    newRoom: targetRoom._id,
    reason
  });

  res.status(201).json(transferRequest);
});

const getTransferRequests = asyncHandler(async (req, res) => {
  const requests = await RoomTransferRequest.find()
    .populate("student", "fullName email")
    .populate({ path: "currentRoom", populate: { path: "hostel", select: "name" } })
    .populate({ path: "newRoom", populate: { path: "hostel", select: "name" } })
    .sort({ createdAt: -1 });

  res.json(requests);
});

const approveTransfer = asyncHandler(async (req, res) => {
  const transfer = await RoomTransferRequest.findById(req.params.id);

  if (!transfer) {
    res.status(404);
    throw new Error("Transfer request not found");
  }
  
  if (transfer.status !== "Pending") {
    res.status(400);
    throw new Error("Transfer is already processed");
  }

  const oldRoom = await Room.findById(transfer.currentRoom);
  const newRoom = await Room.findById(transfer.newRoom);

  if (!newRoom.isAvailable) {
    res.status(400);
    throw new Error("Target room is no longer available");
  }

  // Update rooms
  if (oldRoom) {
    oldRoom.occupied = Math.max(0, oldRoom.occupied - 1);
    oldRoom.isAvailable = oldRoom.occupied < oldRoom.capacity;
    await oldRoom.save();
    await updateHostelAvailability(oldRoom.hostel);
  }

  newRoom.occupied += 1;
  newRoom.isAvailable = newRoom.occupied < newRoom.capacity;
  await newRoom.save();
  await updateHostelAvailability(newRoom.hostel);

  // Update Allocation
  const allocation = await RoomAllocation.findOne({ student: transfer.student, status: "Active" });
  if (allocation) {
    allocation.room = newRoom._id;
    allocation.hostel = newRoom.hostel;
    await allocation.save();
  }

  transfer.status = "Approved";
  await transfer.save();

  res.json({ message: "Transfer approved successfully" });
});

const rejectTransfer = asyncHandler(async (req, res) => {
  const transfer = await RoomTransferRequest.findById(req.params.id);

  if (!transfer) {
    res.status(404);
    throw new Error("Transfer request not found");
  }

  transfer.status = "Rejected";
  await transfer.save();

  res.json({ message: "Transfer rejected successfully" });
});


module.exports = {
  createRoom,
  getRooms,
  getRoomsByHostel,
  updateRoom,
  deleteRoom,
  requestTransfer,
  getTransferRequests,
  approveTransfer,
  rejectTransfer
};