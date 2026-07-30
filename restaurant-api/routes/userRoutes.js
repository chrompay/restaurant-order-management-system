const express = require("express");

const router = express.Router();

const {
  getUsers,
  getUser,
  toggleBlockCustomer,
  getTeamMembers,
  inviteTeamMember,
  updateUserRole,
  removeTeamMember
} = require("../controllers/userController");

const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");
const validate = require("../middleware/validateMiddleware");

const {
  inviteTeamMemberSchema,
  updateRoleSchema
} = require("../validators/userValidator");

// Team management (admin only). Registered before "/:id" so "/team" isn't
// swallowed by the customer-detail wildcard route below.
router.get("/team", protect, authorize("admin"), getTeamMembers);
router.post("/team", protect, authorize("admin"), validate(inviteTeamMemberSchema), inviteTeamMember);
router.patch("/team/:id/role", protect, authorize("admin"), validate(updateRoleSchema), updateUserRole);
router.delete("/team/:id", protect, authorize("admin"), removeTeamMember);

router.get("/", protect, authorize("admin", "manager"), getUsers);
router.get("/:id", protect, authorize("admin", "manager"), getUser);
router.patch("/:id/block", protect, authorize("admin", "manager"), toggleBlockCustomer);

module.exports = router;
