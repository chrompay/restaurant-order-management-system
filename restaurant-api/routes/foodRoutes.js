const express = require("express");

const router = express.Router();

const {
  createFood,
  getFoods,
  getFood,
  updateFood,
  deleteFood
} = require("../controllers/foodController");

const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");
const validate = require("../middleware/validateMiddleware");

const {createFoodSchema} = require("../validators/foodValidator");

// Admin Only
router.post("/",protect,authorize("admin"),validate(createFoodSchema),createFood);

// Public Routes
router.get("/", getFoods);
router.get("/:id", getFood);

// Admin Only
router.patch("/:id",protect,authorize("admin"),updateFood); //http://localhost:5000/api/foods/:id

router.delete("/:id",protect,authorize("admin"),deleteFood);

module.exports = router;