const Joi = require("joi");

// delivery/staff are excluded: restaurant-admin is staff-only and currently
// only admin/manager/kitchen have real wired capability there.
const TEAM_ROLES = ["admin", "manager", "kitchen"];

const inviteTeamMemberSchema = Joi.object({
  fullName: Joi.string()
    .min(3)
    .max(50)
    .required(),

  email: Joi.string()
    .email()
    .required(),

  password: Joi.string()
    .min(6)
    .required(),

  role: Joi.string()
    .valid(...TEAM_ROLES)
    .required()
});

const updateRoleSchema = Joi.object({
  role: Joi.string()
    .valid(...TEAM_ROLES)
    .required()
});

module.exports = {
  inviteTeamMemberSchema,
  updateRoleSchema
};
