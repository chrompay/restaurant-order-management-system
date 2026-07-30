const Joi = require("joi");

const createRiderSchema = Joi.object({
  name: Joi.string()
    .min(2)
    .max(100)
    .required(),

  phone: Joi.string()
    .min(7)
    .max(20)
    .required(),

  vehicleType: Joi.string()
    .valid("car", "bike", "scooter")
    .required(),

  status: Joi.string()
    .valid("available", "en_route", "returning", "offline")
});

const updateRiderSchema = Joi.object({
  name: Joi.string()
    .min(2)
    .max(100),

  phone: Joi.string()
    .min(7)
    .max(20),

  vehicleType: Joi.string()
    .valid("car", "bike", "scooter"),

  status: Joi.string()
    .valid("available", "en_route", "returning", "offline")
}).min(1);

const updateLocationSchema = Joi.object({
  lat: Joi.number()
    .min(-90)
    .max(90)
    .required(),

  lng: Joi.number()
    .min(-180)
    .max(180)
    .required()
});

module.exports = {
  createRiderSchema,
  updateRiderSchema,
  updateLocationSchema
};
