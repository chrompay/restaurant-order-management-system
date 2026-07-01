const Menu = require("../models/Menu");
const AppError = require("../utils/AppError");
const sendResponse = require("../utils/responseHandler");

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

    const menus = await Menu.find();

    sendResponse(res, {
      message: "Menus retrieved successfully",
      data: menus,
      meta: {
        count: menus.length
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

    sendResponse(res, {
      message: "Menu retrieved successfully",
      data: menu
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