const express = require("express");

const router = express.Router();

const {
  createOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
  toggleOrderItem,
  assignRider,
  cancelOrder,
  deleteOrder
} = require("../controllers/orderController");

const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");
const validate = require("../middleware/validateMiddleware");

const {
  createOrderSchema,
  assignRiderSchema,
  updateOrderStatusSchema
} = require("../validators/orderValidator");

// Customer must be logged in
router.post("/", protect, validate(createOrderSchema), createOrder);

router.get("/my-orders", protect, getMyOrders);

// Admin/Manager - View All Orders
router.get("/all-orders", protect, authorize("admin", "manager"), getAllOrders);

// Admin/Manager/Kitchen - Update Order Status (includes kitchen bump/recall)
router.patch("/:orderId/status", protect, authorize("admin", "manager", "kitchen"), validate(updateOrderStatusSchema), updateOrderStatus); //http://localhost:5000/api/orders/:orderId/status

// Kitchen - Toggle a single order item's prep-complete state
router.patch("/:orderId/items/:itemId/toggle", protect, authorize("admin", "manager", "kitchen"), toggleOrderItem);

// Admin/Manager - Assign a rider and dispatch the order
router.patch("/:orderId/assign-rider", protect, authorize("admin", "manager"), validate(assignRiderSchema), assignRider);

// Customer - Cancel Order
router.patch("/:orderId/cancel", protect, cancelOrder); //http://localhost:5000/api/orders/:orderId/cancel

// Admin - Delete Order (terminal statuses only)
router.delete("/:orderId", protect, authorize("admin"), deleteOrder);

module.exports = router;