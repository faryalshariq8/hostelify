const asyncHandler = require("express-async-handler");
const VisitorRequest = require("../models/VisitorRequest");

const submitVisitorRequest = asyncHandler(async (req, res) => {
  const { visitorName, relation, visitDate } = req.body;

  const visitor = await VisitorRequest.create({
    student: req.user._id,
    visitorName,
    relation,
    visitDate,
  });

  res.status(201).json(visitor);
});

const getMyVisitorRequests = asyncHandler(async (req, res) => {
  const visitors = await VisitorRequest.find({ student: req.user._id }).sort({ createdAt: -1 });
  res.json(visitors);
});

const getAllVisitorRequests = asyncHandler(async (req, res) => {
  const visitors = await VisitorRequest.find()
    .populate("student", "fullName email")
    .sort({ createdAt: -1 });
  res.json(visitors);
});

const updateVisitorStatus = asyncHandler(async (req, res) => {
  const { status } = req.body; // "Approved" or "Rejected"

  const visitor = await VisitorRequest.findById(req.params.id);

  if (!visitor) {
    res.status(404);
    throw new Error("Visitor request not found");
  }

  visitor.status = status;
  await visitor.save();

  res.json({ message: `Visitor request ${status.toLowerCase()}`, visitor });
});

module.exports = {
  submitVisitorRequest,
  getMyVisitorRequests,
  getAllVisitorRequests,
  updateVisitorStatus
};
