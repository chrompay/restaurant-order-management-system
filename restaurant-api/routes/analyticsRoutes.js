const express = require("express");

const router = express.Router();

const {
  getOverview,
  getSales,
  getKitchen,
  getCustomers
} = require("../controllers/analyticsController");

const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

router.get("/overview", protect, authorize("admin", "manager"), getOverview);
router.get("/sales", protect, authorize("admin", "manager"), getSales);
router.get("/kitchen", protect, authorize("admin", "manager"), getKitchen);
router.get("/customers", protect, authorize("admin", "manager"), getCustomers);

module.exports = router;
