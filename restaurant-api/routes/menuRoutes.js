const express = require("express");

const router = express.Router();

const {
  createMenu,
  getMenus,
  getMenu,
  updateMenu,
  deleteMenu
} = require("../controllers/menuController");

const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");
const validate = require("../middleware/validateMiddleware");

const {
  createMenuSchema,
  updateMenuSchema
} = require("../validators/menuValidator");

router.post("/",protect,authorize("admin"),validate(createMenuSchema),createMenu);

router.get("/", getMenus);
router.get("/:id", getMenu);
router.patch("/:id", protect, authorize("admin"), validate(updateMenuSchema), updateMenu);
router.delete("/:id", protect, authorize("admin"), deleteMenu);//http://localhost:5000/api/menus/:id

module.exports = router;