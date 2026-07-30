const express = require("express");

const router = express.Router();

const {
  getKpis,
  getRevenueSeries,
  getPeakHours,
  getPrepTimeSeries,
  getTopFoodsToday
} = require("../controllers/dashboardController");

const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

router.get("/kpis", protect, authorize("admin", "manager"), getKpis);
router.get("/revenue-series", protect, authorize("admin", "manager"), getRevenueSeries);
router.get("/peak-hours", protect, authorize("admin", "manager"), getPeakHours);
router.get("/prep-time-series", protect, authorize("admin", "manager"), getPrepTimeSeries);
router.get("/top-foods", protect, authorize("admin", "manager"), getTopFoodsToday);

module.exports = router;
