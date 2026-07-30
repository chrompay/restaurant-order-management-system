const Menu = require("../models/Menu");
const Food = require("../models/Food");
const Order = require("../models/Order");
const AppError = require("../utils/AppError");
const sendResponse = require("../utils/responseHandler");
const buildPagination = require("../utils/paginate");

// Create Menu
const createMenu = async (req, res, next) => {
  try {

    const menu = await Menu.create(req.body);

    sendResponse(res, {
      statusCode: 201,
      message: "Menu created successfully",
      data: menu
    });

  } catch (error) {
    next(error);
  }
};

// Get All Menus
const getMenus = async (req, res, next) => {
  try {

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const skip = (page - 1) * limit;

    const totalRecords = await Menu.countDocuments();

    const menus = await Menu.find()
      .sort("categoryName")
      .skip(skip)
      .limit(limit);

    // Item count per menu (single aggregation, avoids N+1 queries)
    const itemCounts = await Food.aggregate([
      {
        $group: {
          _id: "$menu",
          count: { $sum: 1 }
        }
      }
    ]);

    const itemCountMap = new Map(
      itemCounts.map(entry => [String(entry._id), entry.count])
    );

    // Revenue share per menu, attributed via each order item's food -> menu.
    // Note: attribution is based on a food's *current* menu assignment, since
    // order items only snapshot foodName/priceAtPurchase, not the menu.
    const revenueByMenu = await Order.aggregate([
      { $unwind: "$items" },
      {
        $lookup: {
          from: "foods",
          localField: "items.food",
          foreignField: "_id",
          as: "foodDoc"
        }
      },
      { $unwind: "$foodDoc" },
      {
        $group: {
          _id: "$foodDoc.menu",
          revenue: {
            $sum: { $multiply: ["$items.priceAtPurchase", "$items.quantity"] }
          }
        }
      }
    ]);

    const revenueMap = new Map(
      revenueByMenu.map(entry => [String(entry._id), entry.revenue])
    );

    const totalRevenue = revenueByMenu.reduce(
      (sum, entry) => sum + entry.revenue,
      0
    );

    const menusWithStats = menus.map(menu => {
      const menuRevenue = revenueMap.get(String(menu._id)) || 0;

      return {
        ...menu.toObject(),
        itemCount: itemCountMap.get(String(menu._id)) || 0,
        revenue: totalRevenue > 0
          ? Math.round((menuRevenue / totalRevenue) * 1000) / 10
          : 0
      };
    });

    sendResponse(res, {
      message: "Menus retrieved successfully",
      data: menusWithStats,
      meta: {
        count: menusWithStats.length,
        ...buildPagination({ page, limit, totalRecords })
      }
    });

  } catch (error) {
    next(error);
  }
};

// Get Single Menu
const getMenu = async (req, res, next) => {
  try {

    const menu = await Menu.findById(req.params.id);

    if (!menu) {
      return next(
        new AppError(
          "Menu not found",
          404
        )
      );
    }

    const foods = await Food.find({
      menu: menu._id,
      availability: true
    });

    sendResponse(res, {
      message: "Menu retrieved successfully",
      data: {
        ...menu.toObject(),
        foods
      }
    });

  } catch (error) {
    next(error);
  }
};

// Update Menu
const updateMenu = async (req, res, next) => {
  try {

    const menu = await Menu.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!menu) {
      return next(
        new AppError(
          "Menu not found",
          404
        )
      );
    }

    sendResponse(res, {
      message: "Menu updated successfully",
      data: menu
    });

  } catch (error) {
    next(error);
  }
};

// Delete Menu
const deleteMenu = async (req, res, next) => {
  try {

    const menu = await Menu.findByIdAndDelete(req.params.id);

    if (!menu) {
      return next(
        new AppError(
          "Menu not found",
          404
        )
      );
    }

    sendResponse(res, {
      message: "Menu deleted successfully"
    });

  } catch (error) {
    next(error);
  }
};

module.exports = {
  createMenu,
  getMenus,
  getMenu,
  updateMenu,
  deleteMenu
};