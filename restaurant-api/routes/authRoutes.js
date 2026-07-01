const express = require("express");
const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");
const validate = require("../middleware/validateMiddleware");


const router = express.Router();

const {
  registerUser, 
  loginUser, 
  getProfile
} = require("../controllers/authController");

const {
  registerSchema,
  loginSchema
} = require("../validators/authValidator");

router.post("/register",validate(registerSchema),registerUser);
router.post("/login",validate(loginSchema),loginUser);
router.get("/profile", protect, getProfile);//http://localhost:5000/api/v1/auth/profile
router.get("/admin-test", protect, authorize("admin"),(req, res) => {res.json({success: true,
      message: "Welcome Admin"
    });
  }
);


module.exports = router;