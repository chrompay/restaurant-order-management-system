const express = require("express");

const router = express.Router();

const {
  getRestaurantSettings,
  updateRestaurantSettings,
  getNotificationPreferences,
  updateNotificationPreferences
} = require("../controllers/settingsController");

const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");
const validate = require("../middleware/validateMiddleware");

const {
  updateRestaurantSettingsSchema,
  updateNotificationPreferenceSchema
} = require("../validators/settingsValidator");

// Admin Only
router.get("/restaurant", protect, authorize("admin"), getRestaurantSettings);
router.patch("/restaurant", protect, authorize("admin"), validate(updateRestaurantSettingsSchema), updateRestaurantSettings);

// Any authenticated user - own preferences
router.get("/notifications", protect, getNotificationPreferences);
router.patch("/notifications", protect, validate(updateNotificationPreferenceSchema), updateNotificationPreferences);

module.exports = router;
