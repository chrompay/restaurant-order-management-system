const bcrypt = require("bcryptjs");
const User = require("../models/User");
const Order = require("../models/Order");
const AppError = require("../utils/AppError");
const sendResponse = require("../utils/responseHandler");
const buildPagination = require("../utils/paginate");
const classifyCustomer = require("../utils/customerTier");

const TEAM_ROLES = ["admin", "manager", "staff", "kitchen", "delivery"];

// Admin/Manager - List customers with aggregated order stats
const getUsers = async (req, res, next) => {
  try {

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const skip = (page - 1) * limit;

    const match = { role: "customer" };

    if (req.query.search && typeof req.query.search === "string") {
      match.$or = [
        { fullName: { $regex: req.query.search, $options: "i" } },
        { email: { $regex: req.query.search, $options: "i" } }
      ];
    }

    const totalRecords = await User.countDocuments(match);

    const customers = await User.aggregate([
      { $match: match },
      { $sort: { fullName: 1 } },
      { $skip: skip },
      { $limit: limit },
      {
        $lookup: {
          from: "orders",
          let: { userId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$customer", "$$userId"] },
                status: { $ne: "Cancelled" }
              }
            },
            { $project: { totalAmount: 1, createdAt: 1 } }
          ],
          as: "orders"
        }
      },
      {
        $addFields: {
          totalOrders: { $size: "$orders" },
          totalSpent: { $sum: "$orders.totalAmount" },
          lastOrderAt: { $max: "$orders.createdAt" }
        }
      },
      {
        $project: {
          password: 0,
          orders: 0
        }
      }
    ]);

    const data = customers.map(customer => ({
      ...customer,
      tier: classifyCustomer(customer.totalSpent, customer.totalOrders)
    }));

    sendResponse(res, {
      message: "Customers retrieved successfully",
      data,
      meta: {
        count: data.length,
        ...buildPagination({ page, limit, totalRecords })
      }
    });

  } catch (error) {
    next(error);
  }
};

// Admin/Manager - Single customer detail: favorite foods + order history
const getUser = async (req, res, next) => {
  try {

    const user = await User.findOne({
      _id: req.params.id,
      role: "customer"
    }).select("-password");

    if (!user) {
      return next(
        new AppError(
          "Customer not found",
          404
        )
      );
    }

    const orders = await Order.find({ customer: user._id })
      .sort("-createdAt")
      .select("items totalAmount status createdAt updatedAt");

    const activeOrders = orders.filter(order => order.status !== "Cancelled");
    const totalOrders = activeOrders.length;
    const totalSpent = activeOrders.reduce((sum, order) => sum + order.totalAmount, 0);
    const lastOrderAt = orders[0]?.createdAt || null;

    const foodCounts = {};

    activeOrders.forEach(order => {
      order.items.forEach(item => {
        foodCounts[item.foodName] = (foodCounts[item.foodName] || 0) + item.quantity;
      });
    });

    const favoriteFoods = Object.entries(foodCounts)
      .map(([name, orderCount]) => ({ name, orders: orderCount }))
      .sort((a, b) => b.orders - a.orders)
      .slice(0, 5);

    const orderHistory = orders.map(order => ({
      _id: order._id,
      totalAmount: order.totalAmount,
      status: order.status,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
      itemCount: order.items.reduce((sum, item) => sum + item.quantity, 0)
    }));

    sendResponse(res, {
      message: "Customer retrieved successfully",
      data: {
        ...user.toObject(),
        totalOrders,
        totalSpent,
        lastOrderAt,
        tier: classifyCustomer(totalSpent, totalOrders),
        favoriteFoods,
        orderHistory
      }
    });

  } catch (error) {
    next(error);
  }
};

// Admin/Manager - Toggle a customer's blocked state (also enforced at login/protect)
const toggleBlockCustomer = async (req, res, next) => {
  try {

    const user = await User.findOne({
      _id: req.params.id,
      role: "customer"
    });

    if (!user) {
      return next(
        new AppError(
          "Customer not found",
          404
        )
      );
    }

    user.isActive = !user.isActive;

    await user.save();

    sendResponse(res, {
      message: user.isActive
        ? "Customer unblocked successfully"
        : "Customer blocked successfully",
      data: {
        _id: user._id,
        isActive: user.isActive
      }
    });

  } catch (error) {
    next(error);
  }
};

// Admin - List all internal team members (non-customer roles)
const getTeamMembers = async (req, res, next) => {
  try {

    const members = await User.find({ role: { $in: TEAM_ROLES } })
      .select("-password")
      .sort("fullName");

    sendResponse(res, {
      message: "Team members retrieved successfully",
      data: members
    });

  } catch (error) {
    next(error);
  }
};

// Admin - "Invite Member": directly create an account with a role (no email-invite infra)
const inviteTeamMember = async (req, res, next) => {
  try {

    const { fullName, email, password, role } = req.body;

    const existing = await User.findOne({ email });

    if (existing) {
      return next(
        new AppError(
          "A user with this email already exists",
          400
        )
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const member = await User.create({
      fullName,
      email,
      password: hashedPassword,
      role
    });

    sendResponse(res, {
      statusCode: 201,
      message: "Team member invited successfully",
      data: {
        _id: member._id,
        fullName: member.fullName,
        email: member.email,
        role: member.role
      }
    });

  } catch (error) {
    next(error);
  }
};

// Admin - Change a team member's role
const updateUserRole = async (req, res, next) => {
  try {

    if (req.params.id === req.user._id.toString()) {
      return next(
        new AppError(
          "You cannot change your own role",
          400
        )
      );
    }

    const member = await User.findOne({
      _id: req.params.id,
      role: { $in: TEAM_ROLES }
    });

    if (!member) {
      return next(
        new AppError(
          "Team member not found",
          404
        )
      );
    }

    member.role = req.body.role;

    await member.save();

    sendResponse(res, {
      message: "Role updated successfully",
      data: {
        _id: member._id,
        role: member.role
      }
    });

  } catch (error) {
    next(error);
  }
};

// Admin - Remove a team member's account
const removeTeamMember = async (req, res, next) => {
  try {

    if (req.params.id === req.user._id.toString()) {
      return next(
        new AppError(
          "You cannot remove your own account",
          400
        )
      );
    }

    const member = await User.findOne({
      _id: req.params.id,
      role: { $in: TEAM_ROLES }
    });

    if (!member) {
      return next(
        new AppError(
          "Team member not found",
          404
        )
      );
    }

    await member.deleteOne();

    sendResponse(res, {
      message: "Team member removed successfully"
    });

  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUsers,
  getUser,
  toggleBlockCustomer,
  getTeamMembers,
  inviteTeamMember,
  updateUserRole,
  removeTeamMember
};
