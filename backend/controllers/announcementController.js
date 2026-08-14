const asyncHandler = require("express-async-handler");
const Announcement = require("../models/Announcement");

// @desc    Create announcement
// @route   POST /api/announcements
// @access  Admin
const createAnnouncement = asyncHandler(async (req, res) => {
  const { title, description, targetAudience } = req.body;

  const announcement = await Announcement.create({
    title,
    description,
    targetAudience,
    createdBy: req.user._id,
  });

  res.status(201).json(announcement);
});

// @desc    Update announcement
// @route   PUT /api/announcements/:id
// @access  Admin
const updateAnnouncement = asyncHandler(async (req, res) => {
  const announcement = await Announcement.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );

  if (!announcement) {
    res.status(404);
    throw new Error("Announcement not found");
  }

  res.json(announcement);
});

// @desc    Delete announcement
// @route   DELETE /api/announcements/:id
// @access  Admin
const deleteAnnouncement = asyncHandler(async (req, res) => {
  const announcement = await Announcement.findById(req.params.id);

  if (!announcement) {
    res.status(404);
    throw new Error("Announcement not found");
  }

  await announcement.deleteOne();
  res.json({ message: "Announcement deleted successfully" });
});

// @desc    Get all announcements (admin and student)
// @route   GET /api/announcements
// @access  Public/Student
const getAnnouncements = asyncHandler(async (req, res) => {
  const announcements = await Announcement.find()
    .populate("createdBy", "fullName")
    .sort({ createdAt: -1 });

  res.json(announcements);
});

module.exports = {
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
  getAnnouncements,
};
