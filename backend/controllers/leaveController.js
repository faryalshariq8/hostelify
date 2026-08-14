const asyncHandler = require("express-async-handler");
const LeaveRequest = require("../models/LeaveRequest");
const User = require("../models/User");

// @desc    Submit a leave request
// @route   POST /api/leaves
// @access  Student
const submitLeave = asyncHandler(async (req, res) => {
  const { reason, startDate, endDate } = req.body;

  const leave = await LeaveRequest.create({
    student: req.user._id,
    reason,
    startDate,
    endDate,
  });

  res.status(201).json(leave);
});

// @desc    Get my leave requests
// @route   GET /api/leaves/my
// @access  Student
const getMyLeaves = asyncHandler(async (req, res) => {
  const leaves = await LeaveRequest.find({ student: req.user._id }).sort({ createdAt: -1 });
  res.json(leaves);
});

// @desc    Get all leave requests
// @route   GET /api/leaves
// @access  Admin
const getAllLeaves = asyncHandler(async (req, res) => {
  const leaves = await LeaveRequest.find()
    .populate("student", "fullName email")
    .sort({ createdAt: -1 });
  res.json(leaves);
});

// @desc    Approve or Reject leave request
// @route   PUT /api/leaves/:id
// @access  Admin
const updateLeaveStatus = asyncHandler(async (req, res) => {
  const { status } = req.body; // "Approved" or "Rejected"

  const leave = await LeaveRequest.findById(req.params.id);

  if (!leave) {
    res.status(404);
    throw new Error("Leave request not found");
  }

  leave.status = status;
  await leave.save();

  res.json({ message: `Leave request ${status.toLowerCase()}`, leave });
});

module.exports = {
  submitLeave,
  getMyLeaves,
  getAllLeaves,
  updateLeaveStatus
};
