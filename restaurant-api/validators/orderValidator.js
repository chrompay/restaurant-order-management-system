const Joi = require("joi");

const createOrderSchema = Joi.object({
  items: Joi.array()
    .items(
      Joi.object({
        food: Joi.string().required(),
        quantity: Joi.number()
          .integer()
          .min(1)
          .required(),
        notes: Joi.string().allow("")
      })
    )
    .min(1)
    .required(),

  customerId: Joi.string()
});

const assignRiderSchema = Joi.object({
  riderId: Joi.string().required()
});

const updateOrderStatusSchema = Joi.object({
  status: Joi.string()
    .valid(
      "Pending",
      "Confirmed",
      "Preparing",
      "Out For Delivery",
      "Delivered",
      "Cancelled"
    )
    .required()
});

module.exports = {
  createOrderSchema,
  assignRiderSchema,
  updateOrderStatusSchema
};