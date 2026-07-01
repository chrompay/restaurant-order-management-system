const Order = require("../models/Order");
const Food = require("../models/Food");
const AppError = require("../utils/AppError");
const sendResponse = require("../utils/responseHandler");

const createOrder = async (req, res, next) => {
  try {

    const { items } = req.body;

    if (!items || items.length === 0) {
      return next(
        new AppError(
          "Order must contain at least one food item",
          400
        )
      );
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
        quantity: item.quantity
      });
    }

    const order = await Order.create({
      customer: req.user._id,
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

    const orders = await Order.find({
      customer: req.user._id
    })
      .populate("customer", "fullName email")
      .populate("items.food", "name price");

    sendResponse(res, {
      message: "Orders retrieved successfully",
      data: orders,
      meta: {
        count: orders.length
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

    let query = Order.find(filter)
      .populate("customer", "fullName email")
      .populate("items.food", "name price");

    // Sorting
    if (req.query.sort) {
      query = query.sort(req.query.sort);
    } else {
      query = query.sort("-createdAt");
    }

    const totalRecords =
      await Order.countDocuments(filter);

    const totalPages = Math.ceil(totalRecords / limit);

    const orders = await query
      .skip(skip)
      .limit(limit);

    sendResponse(res, {
      message: "Orders retrieved successfully",
      data: orders,
      meta: {
        page,
        limit,
        count: orders.length,
        totalRecords,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1
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

    const allowedStatuses = [
      "Pending",
      "Confirmed",
      "Preparing",
      "Out For Delivery",
      "Delivered",
      "Cancelled"
    ];

    if (!allowedStatuses.includes(status)) {
      return next(
        new AppError(
          "Invalid status",
          400
        )
      );
    }

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

module.exports = {
  createOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
  cancelOrder
};