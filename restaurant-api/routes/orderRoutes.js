const express = require("express");

const router = express.Router();

const {
  createOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
  cancelOrder
} = require("../controllers/orderController");

const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");
const validate = require("../middleware/validateMiddleware");

const {
  createOrderSchema
} = require("../validators/orderValidator");

// Customer must be logged in
router.post("/", protect, validate(createOrderSchema), createOrder);

router.get("/my-orders", protect, getMyOrders);

// Admin - View All Orders
router.get("/all-orders", protect, authorize("admin"), getAllOrders);

// Admin - Update Order Status
router.patch("/:orderId/status", protect, authorize("admin"), updateOrderStatus); //http://localhost:5000/api/orders/:orderId/status

// Customer - Cancel Order
router.patch("/:orderId/cancel", protect, cancelOrder); //http://localhost:5000/api/orders/:orderId/cancel

module.exports = router;