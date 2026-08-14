const asyncHandler = require("express-async-handler");
const Hostel = require("../models/Hostel");

const createHostel = asyncHandler(async (req, res) => {
  const hostel = await Hostel.create(req.body);
  res.status(201).json(hostel);
});

const getHostels = asyncHandler(async (req, res) => {
  const { search, page = 1, limit = 10, sort = "-createdAt" } = req.query;

  let query = {};
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: "i" } },
      { location: { $regex: search, $options: "i" } }
    ];
  }

  const hostels = await Hostel.find(query)
    .sort(sort)
    .limit(limit * 1)
    .skip((page - 1) * limit);

  const total = await Hostel.countDocuments(query);

  res.json({
    hostels,
    totalPages: Math.ceil(total / limit),
    currentPage: parseInt(page),
    totalHostels: total
  });
});

const getHostelById = asyncHandler(async (req, res) => {
  const hostel = await Hostel.findById(req.params.id);

  if (!hostel) {
    res.status(404);
    throw new Error("Hostel not found");
  }

  res.json(hostel);
});

const updateHostel = asyncHandler(async (req, res) => {
  const hostel = await Hostel.findById(req.params.id);

  if (!hostel) {
    res.status(404);
    throw new Error("Hostel not found");
  }

  hostel.name = req.body.name ?? hostel.name;
  hostel.location = req.body.location ?? hostel.location;
  hostel.description = req.body.description ?? hostel.description;
  hostel.totalRooms = req.body.totalRooms ?? hostel.totalRooms;
  hostel.availableRooms = req.body.availableRooms ?? hostel.availableRooms;

  const updatedHostel = await hostel.save();

  res.json(updatedHostel);
});

const deleteHostel = asyncHandler(async (req, res) => {
  const hostel = await Hostel.findById(req.params.id);

  if (!hostel) {
    res.status(404);
    throw new Error("Hostel not found");
  }

  await hostel.deleteOne();

  res.json({
    message: "Hostel deleted successfully",
  });
});

module.exports = {
  createHostel,
  getHostels,
  getHostelById,
  updateHostel,
  deleteHostel,
};