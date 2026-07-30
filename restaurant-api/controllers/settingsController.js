const RestaurantSettings = require("../models/RestaurantSettings");
const NotificationPreference = require("../models/NotificationPreference");
const sendResponse = require("../utils/responseHandler");

// Admin - Restaurant profile + business hours (singleton doc)
const getRestaurantSettings = async (req, res, next) => {
  try {

    const settings = await RestaurantSettings.getSingleton();

    sendResponse(res, {
      message: "Restaurant settings retrieved successfully",
      data: settings
    });

  } catch (error) {
    next(error);
  }
};

const updateRestaurantSettings = async (req, res, next) => {
  try {

    const settings = await RestaurantSettings.getSingleton();

    Object.assign(settings, req.body);

    await settings.save();

    sendResponse(res, {
      message: "Restaurant settings updated successfully",
      data: settings
    });

  } catch (error) {
    next(error);
  }
};

// Any authenticated user - their own notification preferences
const getNotificationPreferences = async (req, res, next) => {
  try {

    const preferences = await NotificationPreference.getOrCreateForUser(req.user._id);

    sendResponse(res, {
      message: "Notification preferences retrieved successfully",
      data: preferences
    });

  } catch (error) {
    next(error);
  }
};

const updateNotificationPreferences = async (req, res, next) => {
  try {

    const preferences = await NotificationPreference.getOrCreateForUser(req.user._id);

    Object.assign(preferences, req.body);

    await preferences.save();

    sendResponse(res, {
      message: "Notification preferences updated successfully",
      data: preferences
    });

  } catch (error) {
    next(error);
  }
};

module.exports = {
  getRestaurantSettings,
  updateRestaurantSettings,
  getNotificationPreferences,
  updateNotificationPreferences
};
