const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const AppError = require("../utils/AppError");
const sendResponse = require("../utils/responseHandler");

// Register User
const registerUser = async (req, res, next) => {
  try {
    const { fullName, email, password } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ email });

    if (userExists) {
      return next(
        new AppError(
          "User already exists",
          400
        )
      );
    }

    // Hash Password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create User
    const user = await User.create({
      fullName,
      email,
      password: hashedPassword
    });

    sendResponse(res, {
      statusCode: 201,
      message: "User registered successfully",
      data: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    next(error);
  }
};

// Login User
const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return next(
        new AppError(
          "Invalid credentials",
          401
        )
      );
    }
    const match = await bcrypt.compare(
      password,
      user.password
    );

    if (!match) {
      return next(
        new AppError(
          "Invalid credentials",
          401
        )
      );
    }

    if (!user.isActive) {
      return next(
        new AppError(
          "This account has been blocked",
          403
        )
      );
    }

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d"
      }
    );

    sendResponse(res, {
      message: "Login successful",
      data: {
        token,
        user: {
          _id: user._id,
          fullName: user.fullName,
          email: user.email,
          role: user.role
        }
      }
    });

  } catch (error) {
    next(error);
  }
};

// Get User Profile
const getProfile = async (req, res, next) => {
  try {
    sendResponse(res, {
      message: "Profile retrieved successfully",
      data: req.user
    });
  } catch (error) {
    next(error);
  }
};

// Update the logged-in user's own profile (My Account)
const updateProfile = async (req, res, next) => {
  try {

    const allowedFields = ["fullName", "phone", "address"];
    const updates = {};

    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    if (req.file) {
      updates.avatar = `/uploads/avatars/${req.file.filename}`;
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      updates,
      {
        new: true,
        runValidators: true
      }
    ).select("-password");

    sendResponse(res, {
      message: "Profile updated successfully",
      data: user
    });

  } catch (error) {
    next(error);
  }
};

// Change the logged-in user's own password
const changePassword = async (req, res, next) => {
  try {

    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user._id);

    const match = await bcrypt.compare(currentPassword, user.password);

    if (!match) {
      return next(
        new AppError(
          "Current password is incorrect",
          401
        )
      );
    }

    user.password = await bcrypt.hash(newPassword, 10);

    await user.save();

    sendResponse(res, {
      message: "Password updated successfully"
    });

  } catch (error) {
    next(error);
  }
};

module.exports = {
  registerUser,
  loginUser,
  getProfile,
  updateProfile,
  changePassword
};