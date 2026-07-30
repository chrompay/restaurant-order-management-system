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
    .required(),

  availability: Joi.boolean(),

  station: Joi.string()
    .valid(
      "Bakery",
      "Beverages",
      "Breakfast",
      "Fryer",
      "Grill",
      "Legumes & Pots",
      "Pepper Soup",
      "Protein Prep",
      "Rice & Grains",
      "Swallow & Soup"
    )
});

const updateFoodSchema = Joi.object({
  name: Joi.string()
    .min(2)
    .max(100),

  description: Joi.string()
    .min(5),

  ingredients: Joi.array()
    .items(Joi.string()),

  price: Joi.number()
    .positive(),

  preparationTime: Joi.number()
    .positive(),

  menu: Joi.string(),

  availability: Joi.boolean(),

  station: Joi.string()
    .valid(
      "Bakery",
      "Beverages",
      "Breakfast",
      "Fryer",
      "Grill",
      "Legumes & Pots",
      "Pepper Soup",
      "Protein Prep",
      "Rice & Grains",
      "Swallow & Soup"
    )
}).min(1);

module.exports = {
  createFoodSchema,
  updateFoodSchema
};
