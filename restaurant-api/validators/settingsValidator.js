const Joi = require("joi");

const businessHourSchema = Joi.object({
  day: Joi.string()
    .valid("Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday")
    .required(),

  isOpen: Joi.boolean(),

  openTime: Joi.string(),

  closeTime: Joi.string()
});

const updateRestaurantSettingsSchema = Joi.object({
  name: Joi.string()
    .min(2)
    .max(100),

  email: Joi.string()
    .email()
    .allow(""),

  phone: Joi.string()
    .allow(""),

  address: Joi.string()
    .allow(""),

  businessHours: Joi.array()
    .items(businessHourSchema),

  targetPrepTimeMinutes: Joi.number()
    .positive()
}).min(1);

const updateNotificationPreferenceSchema = Joi.object({
  newOrders: Joi.boolean(),
  cancellations: Joi.boolean(),
  dailySummary: Joi.boolean(),
  productUpdates: Joi.boolean()
}).min(1);

module.exports = {
  updateRestaurantSettingsSchema,
  updateNotificationPreferenceSchema
};
