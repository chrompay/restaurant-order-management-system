const Joi = require("joi");

const createFoodSchema = Joi.object({
  name: Joi.string()
    .min(2)
    .max(100)
    .required(),

  description: Joi.string()
    .min(5)
    .required(),

  ingredients: Joi.array()
    .items(Joi.string())
    .required(),

  price: Joi.number()
    .positive()
    .required(),

  preparationTime: Joi.number()
    .positive()
    .required(),

  menu: Joi.string()
    .required()
});

module.exports = {
  createFoodSchema
};