const asyncHandler = require("express-async-handler");
const User = require("../models/User");

// @desc    Get all students (with search, pagination)
// @route   GET /api/users/students
// @access  Admin
const getStudents = asyncHandler(async (req, res) => {
  const { search, page = 1, limit = 10, sort = "-createdAt" } = req.query;

  let query = { role: "student" };

  if (search) {
    query.$or = [
      { fullName: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } }
    ];
  }

  const students = await User.find(query)
    .select("-password")
    .sort(sort)
    .limit(limit * 1)
    .skip((page - 1) * limit);

  const total = await User.countDocuments(query);

  res.json({
    students,
    totalPages: Math.ceil(total / limit),
    currentPage: parseInt(page),
    totalStudents: total
  });
});

// @desc    Delete a student
// @route   DELETE /api/users/students/:id
// @access  Admin
const deleteStudent = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user && user.role === "student") {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "Student removed" });
  } else {
    res.status(404);
    throw new Error("Student not found");
  }
});

module.exports = {
  getStudents,
  deleteStudent
};
