const express = require("express");

const router = express.Router();

const {
  createRider,
  getRiders,
  getRider,
  updateRider,
  updateRiderLocation
} = require("../controllers/riderController");

const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");
const validate = require("../middleware/validateMiddleware");

const {
  createRiderSchema,
  updateRiderSchema,
  updateLocationSchema
} = require("../validators/riderValidator");

router.post("/", protect, authorize("admin", "manager"), validate(createRiderSchema), createRider);

router.get("/", protect, authorize("admin", "manager", "delivery"), getRiders);
router.get("/:id", protect, authorize("admin", "manager", "delivery"), getRider);

router.patch("/:id", protect, authorize("admin", "manager"), validate(updateRiderSchema), updateRider);
router.patch("/:id/location", protect, authorize("admin", "manager", "delivery"), validate(updateLocationSchema), updateRiderLocation);

module.exports = router;
