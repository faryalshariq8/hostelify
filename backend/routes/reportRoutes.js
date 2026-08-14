const express = require("express");
const {
  getDashboardStats,
  getMonthlyRevenue,
  getHostelOccupancy,
  getComplaintTrend,
  getApplicationsPerMonth
} = require("../controllers/reportController");

const { protect } = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");

const router = express.Router();

router.use(protect, admin); // All reports are admin only

router.get("/dashboard", getDashboardStats);
router.get("/revenue", getMonthlyRevenue);
router.get("/occupancy", getHostelOccupancy);
router.get("/complaints", getComplaintTrend);
router.get("/applications", getApplicationsPerMonth);

module.exports = router;
