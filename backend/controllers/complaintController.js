const asyncHandler = require("express-async-handler");
const Complaint = require("../models/Complaint");
const User = require("../models/User");

const submitComplaint = asyncHandler(async (req, res) => {
  const complaint = await Complaint.create({
    student: req.user._id,
    title: req.body.title,
    description: req.body.description,
  });

  res.status(201).json(complaint);
});

const getMyComplaints = asyncHandler(async (req, res) => {
  const complaints = await Complaint.find({
    student: req.user._id,
  }).sort({ createdAt: -1 });

  res.json(complaints);
});

const getAllComplaints = asyncHandler(async (req, res) => {
  const { search, status, page = 1, limit = 10, sort = "-createdAt" } = req.query;

  let query = {};
  if (status) {
    query.status = status;
  }

  if (search) {
    const users = await User.find({ fullName: { $regex: search, $options: "i" } }).select("_id");
    const userIds = users.map(u => u._id);
    
    query.$or = [
      { title: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
      { student: { $in: userIds } }
    ];
  }

  const complaints = await Complaint.find(query)
    .populate("student", "fullName email")
    .sort(sort)
    .limit(limit * 1)
    .skip((page - 1) * limit);

  const total = await Complaint.countDocuments(query);

  res.json({
    complaints,
    totalPages: Math.ceil(total / limit),
    currentPage: parseInt(page),
    totalComplaints: total
  });
});

const updateComplaintStatus = asyncHandler(async (req, res) => {
  const complaint = await Complaint.findById(req.params.id);

  if (!complaint) {
    res.status(404);
    throw new Error("Complaint not found");
  }

  complaint.status = req.body.status;

  await complaint.save();

  res.json(complaint);
});

module.exports = {
  submitComplaint,
  getMyComplaints,
  getAllComplaints,
  updateComplaintStatus,
};