const asyncHandler = require("express-async-handler");
const User = require("../models/User");
const Hostel = require("../models/Hostel");
const Room = require("../models/Room");
const HostelApplication = require("../models/HostelApplication");
const Complaint = require("../models/Complaint");
const FeePayment = require("../models/FeePayment");
const Announcement = require("../models/Announcement");

const getDashboardStats = asyncHandler(async (req, res) => {
  const students = await User.countDocuments({ role: "student" });
  const hostels = await Hostel.countDocuments();
  const rooms = await Room.countDocuments();
  
  const allRooms = await Room.find();
  let occupiedRooms = 0;
  let availableRooms = 0;
  allRooms.forEach(room => {
    if (room.occupied >= room.capacity) {
      occupiedRooms++;
    } else {
      availableRooms++;
    }
  });

  const pendingApplications = await HostelApplication.countDocuments({ status: "Pending" });
  const approvedApplications = await HostelApplication.countDocuments({ status: "Approved" });
  
  const pendingComplaints = await Complaint.countDocuments({ status: "Pending" });
  const resolvedComplaints = await Complaint.countDocuments({ status: "Resolved" });

  const payments = await FeePayment.aggregate([
    { $match: { status: "Paid" } },
    { $group: { _id: null, totalRevenue: { $sum: "$amount" } } }
  ]);
  
  const totalRevenue = payments.length > 0 ? payments[0].totalRevenue : 0;

  // Recent data
  const recentApplications = await HostelApplication.find().sort({ createdAt: -1 }).limit(5).populate("student", "fullName").populate("hostel", "name");
  const recentComplaints = await Complaint.find().sort({ createdAt: -1 }).limit(5).populate("student", "fullName");
  const recentPayments = await FeePayment.find().sort({ createdAt: -1 }).limit(5).populate("student", "fullName");
  const recentAnnouncements = await Announcement.find().sort({ createdAt: -1 }).limit(5);

  res.json({
    students,
    hostels,
    rooms,
    occupiedRooms,
    availableRooms,
    pendingApplications,
    approvedApplications,
    pendingComplaints,
    resolvedComplaints,
    totalRevenue,
    recentApplications,
    recentComplaints,
    recentPayments,
    recentAnnouncements
  });
});

const getMonthlyRevenue = asyncHandler(async (req, res) => {
  const revenue = await FeePayment.aggregate([
    { $match: { status: "Paid" } },
    {
      $group: {
        _id: {
          year: { $year: "$paymentDate" },
          month: { $month: "$paymentDate" }
        },
        total: { $sum: "$amount" }
      }
    },
    { $sort: { "_id.year": 1, "_id.month": 1 } }
  ]);
  res.json(revenue);
});

const getHostelOccupancy = asyncHandler(async (req, res) => {
  const occupancy = await Room.aggregate([
    {
      $group: {
        _id: "$hostel",

        totalCapacity: {
          $sum: "$capacity",
        },

        currentOccupancy: {
          $sum: "$occupied",
        },
      },
    },

    {
      $lookup: {
        from: "hostels",
        localField: "_id",
        foreignField: "_id",
        as: "hostelDetails",
      },
    },

    {
      $unwind: "$hostelDetails",
    },

    {
      $project: {
        hostelName: "$hostelDetails.name",

        totalCapacity: 1,

        currentOccupancy: 1,

        occupancyRate: {
          $multiply: [
            {
              $divide: [
                "$currentOccupancy",
                {
                  $cond: [
                    { $eq: ["$totalCapacity", 0] },
                    1,
                    "$totalCapacity",
                  ],
                },
              ],
            },
            100,
          ],
        },
      },
    },
  ]);

  res.json(occupancy);
});

const getComplaintTrend = asyncHandler(async (req, res) => {
  const trends = await Complaint.aggregate([
    {
      $group: {
        _id: {
          year: { $year: "$createdAt" },
          month: { $month: "$createdAt" },
          status: "$status"
        },
        count: { $sum: 1 }
      }
    },
    { $sort: { "_id.year": 1, "_id.month": 1 } }
  ]);
  res.json(trends);
});

const getApplicationsPerMonth = asyncHandler(async (req, res) => {
  const apps = await HostelApplication.aggregate([
    {
      $group: {
        _id: {
          year: { $year: "$createdAt" },
          month: { $month: "$createdAt" },
          status: "$status"
        },
        count: { $sum: 1 }
      }
    },
    { $sort: { "_id.year": 1, "_id.month": 1 } }
  ]);
  res.json(apps);
});

module.exports = {
  getDashboardStats,
  getMonthlyRevenue,
  getHostelOccupancy,
  getComplaintTrend,
  getApplicationsPerMonth
};
