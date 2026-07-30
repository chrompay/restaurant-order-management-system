const Joi = require("joi");

const registerSchema = Joi.object({
  fullName: Joi.string()
    .min(3)
    .max(50)
    .required(),

  email: Joi.string()
    .email()
    .required(),

  password: Joi.string()
    .min(6)
    .required()
});

const loginSchema = Joi.object({
  email: Joi.string()
    .email()
    .required(),

  password: Joi.string()
    .required()
});

const updateProfileSchema = Joi.object({
  fullName: Joi.string()
    .min(3)
    .max(50),

  phone: Joi.string()
    .allow(""),

  address: Joi.string()
    .allow("")
}).min(1);

const changePasswordSchema = Joi.object({
  currentPassword: Joi.string()
    .required(),

  newPassword: Joi.string()
    .min(6)
    .required()
});

module.exports = {
  registerSchema,
  loginSchema,
  updateProfileSchema,
  changePasswordSchema
};