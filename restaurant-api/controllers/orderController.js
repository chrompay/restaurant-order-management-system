const Order = require("../models/Order");
const Food = require("../models/Food");
const User = require("../models/User");
const Rider = require("../models/Rider");
const AppError = require("../utils/AppError");
const sendResponse = require("../utils/responseHandler");
const buildPagination = require("../utils/paginate");

const createOrder = async (req, res, next) => {
  try {

    const { items, customerId } = req.body;

    if (!items || items.length === 0) {
      return next(
        new AppError(
          "Order must contain at least one food item",
          400
        )
      );
    }

    let customer = req.user._id;

    // Admin may create an order on behalf of an existing customer account
    if (customerId && req.user.role === "admin") {
      const customerExists = await User.findById(customerId);

      if (!customerExists) {
        return next(
          new AppError(
            "Customer not found",
            404
          )
        );
      }

      customer = customerExists._id;
    }

    let totalAmount = 0;

    const orderItems = [];

    for (const item of items) {

      const food = await Food.findById(item.food);

      if (!food) {
        return next(
          new AppError(
            `Food not found: ${item.food}`,
            404
          )
        );
      }

      totalAmount += food.price * item.quantity;

      orderItems.push({
        food: food._id,
        foodName: food.name,
        priceAtPurchase: food.price,
        quantity: item.quantity,
        station: food.station,
        notes: item.notes || ""
      });
    }

    const order = await Order.create({
      customer,
      items: orderItems,
      totalAmount
    });

    sendResponse(res, {
      statusCode: 201,
      message: "Order created successfully",
      data: order
    });

  } catch (error) {
    next(error);
  }
};

// Get Customer Orders
const getMyOrders = async (req, res, next) => {
  try {

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const skip = (page - 1) * limit;

    const filter = { customer: req.user._id };

    const totalRecords =
      await Order.countDocuments(filter);

    const orders = await Order.find(filter)
      .populate("customer", "fullName email phone address")
      .populate("items.food", "name price")
      .populate("assignedRider", "name phone vehicleType status location")
      .sort("-createdAt")
      .skip(skip)
      .limit(limit);

    sendResponse(res, {
      message: "Orders retrieved successfully",
      data: orders,
      meta: {
        count: orders.length,
        ...buildPagination({ page, limit, totalRecords })
      }
    });

  } catch (error) {
    next(error);
  }
};

// Admin - View All Orders
const getAllOrders = async (req, res, next) => {
  try {

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;

    const skip = (page - 1) * limit;

    const filter = {};

    // Filter by status
    if (req.query.status) {
      filter.status = req.query.status;
    }

    // Filter by date range (createdAt)
    if (req.query.from || req.query.to) {
      filter.createdAt = {};

      if (req.query.from) {
        filter.createdAt.$gte = new Date(req.query.from);
      }

      if (req.query.to) {
        filter.createdAt.$lte = new Date(req.query.to);
      }
    }

    // Search by customer name/email
    if (req.query.search && typeof req.query.search === "string") {
      const matchingCustomers = await User.find({
        $or: [
          { fullName: { $regex: req.query.search, $options: "i" } },
          { email: { $regex: req.query.search, $options: "i" } }
        ]
      }).select("_id");

      filter.customer = {
        $in: matchingCustomers.map(customer => customer._id)
      };
    }

    let query = Order.find(filter)
      .populate("customer", "fullName email phone address")
      .populate("items.food", "name price")
      .populate("assignedRider", "name phone vehicleType status location");

    // Sorting
    if (req.query.sort && typeof req.query.sort === "string") {
      query = query.sort(req.query.sort);
    } else {
      query = query.sort("-createdAt");
    }

    const totalRecords =
      await Order.countDocuments(filter);

    const orders = await query
      .skip(skip)
      .limit(limit);

    sendResponse(res, {
      message: "Orders retrieved successfully",
      data: orders,
      meta: {
        count: orders.length,
        ...buildPagination({ page, limit, totalRecords })
      }
    });

  } catch (error) {
    next(error);
  }
};

// Admin - Update Order Status
const updateOrderStatus = async (req, res, next) => {
  try {

    const { status } = req.body;

    const order = await Order.findById(req.params.orderId);

    if (!order) {
      return next(
        new AppError(
          "Order not found",
          404
        )
      );
    }

    order.status = status;

    await order.save();

    sendResponse(res, {
      message: "Order status updated successfully",
      data: order
    });

  } catch (error) {
    next(error);
  }
};

// Kitchen - Toggle a single order item's prep-complete state
const toggleOrderItem = async (req, res, next) => {
  try {

    const { orderId, itemId } = req.params;

    const order = await Order.findById(orderId);

    if (!order) {
      return next(
        new AppError(
          "Order not found",
          404
        )
      );
    }

    const item = order.items.id(itemId);

    if (!item) {
      return next(
        new AppError(
          "Order item not found",
          404
        )
      );
    }

    item.completed = !item.completed;

    await order.save();

    sendResponse(res, {
      message: "Order item updated successfully",
      data: order
    });

  } catch (error) {
    next(error);
  }
};

// Admin/Manager - Assign a rider to an order and dispatch it
const assignRider = async (req, res, next) => {
  try {

    const { riderId } = req.body;

    const order = await Order.findById(req.params.orderId);

    if (!order) {
      return next(
        new AppError(
          "Order not found",
          404
        )
      );
    }

    const rider = await Rider.findById(riderId);

    if (!rider) {
      return next(
        new AppError(
          "Rider not found",
          404
        )
      );
    }

    order.assignedRider = rider._id;
    order.status = "Out For Delivery";

    await order.save();
    await order.populate("assignedRider", "name phone vehicleType status location");

    sendResponse(res, {
      message: "Rider assigned successfully",
      data: order
    });

  } catch (error) {
    next(error);
  }
};

// Customer Cancel Order
const cancelOrder = async (req, res, next) => {
  try {

    const order = await Order.findById(
      req.params.orderId
    );

    if (!order) {
      return next(
        new AppError(
          "Order not found",
          404
        )
      );
    }

    // Ensure customer owns the order
    if (
      order.customer.toString() !==
      req.user._id.toString()
    ) {
      return next(
        new AppError(
          "Unauthorized",
          403
        )
      );
    }

    if (
      order.status === "Delivered" ||
      order.status === "Out For Delivery"
    ) {
      return next(
        new AppError(
          "Order can no longer be cancelled",
          400
        )
      );
    }

    order.status = "Cancelled";

    await order.save();

    sendResponse(res, {
      message: "Order cancelled successfully",
      data: order
    });

  } catch (error) {
    next(error);
  }
};

// Admin - Delete an order (terminal statuses only)
const deleteOrder = async (req, res, next) => {
  try {

    const order = await Order.findById(req.params.orderId);

    if (!order) {
      return next(
        new AppError(
          "Order not found",
          404
        )
      );
    }

    if (
      order.status !== "Delivered" &&
      order.status !== "Cancelled"
    ) {
      return next(
        new AppError(
          "Only delivered or cancelled orders can be deleted",
          400
        )
      );
    }

    await order.deleteOne();

    sendResponse(res, {
      message: "Order deleted successfully"
    });

  } catch (error) {
    next(error);
  }
};

module.exports = {
  createOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
  toggleOrderItem,
  assignRider,
  cancelOrder,
  deleteOrder
};