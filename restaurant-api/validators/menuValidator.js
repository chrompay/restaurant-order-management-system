const Joi = require("joi");

// Create Menu Validation
const createMenuSchema = Joi.object({
  categoryName: Joi.string()
    .min(2)
    .max(50)
    .required(),

  description: Joi.string()
    .allow("")
});

// Update Menu Validation (PATCH)
const updateMenuSchema = Joi.object({
  categoryName: Joi.string()
    .min(2)
    .max(50),

  description: Joi.string()
    .allow("")
}).min(1);

module.exports = {
  createMenuSchema,
  updateMenuSchema
};