const express = require("express");
const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");
const validate = require("../middleware/validateMiddleware");
const createUploader = require("../middleware/uploadMiddleware");


const router = express.Router();

const uploadAvatar = createUploader("avatars");

const {
  registerUser,
  loginUser,
  getProfile,
  updateProfile,
  changePassword
} = require("../controllers/authController");

const {
  registerSchema,
  loginSchema,
  updateProfileSchema,
  changePasswordSchema
} = require("../validators/authValidator");

router.post("/register",validate(registerSchema),registerUser);
router.post("/login",validate(loginSchema),loginUser);
router.get("/profile", protect, getProfile);//http://localhost:5000/api/v1/auth/profile
router.patch("/profile", protect, uploadAvatar.single("avatar"), validate(updateProfileSchema), updateProfile);
router.patch("/change-password", protect, validate(changePasswordSchema), changePassword);
router.get("/admin-test", protect, authorize("admin"),(req, res) => {res.json({success: true,
      message: "Welcome Admin"
    });
  }
);


module.exports = router;