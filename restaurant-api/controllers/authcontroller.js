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

module.exports = {
  registerUser,
  loginUser,
  getProfile
};