const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const apiLimiter = require("./config/rateLimiter");

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const foodRoutes = require("./routes/foodRoutes");
const menuRoutes = require("./routes/menuRoutes");
const orderRoutes = require("./routes/orderRoutes");
const errorHandler = require("./middleware/errorMiddleware");

dotenv.config();

connectDB();

// Initialize Express App
const app = express();
// =========================
// Security Middleware
// =========================
app.use(helmet());
app.use(apiLimiter);

// =========================
// Core Middleware
// =========================
app.use(cors());

app.use(express.json());

app.use(express.urlencoded({
  extended: true
}));

app.use(morgan("dev"));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/foods", foodRoutes);
app.use("/api/menus", menuRoutes);
app.use("/api/orders", orderRoutes);


// Test Route
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Restaurant API Running"
  });
});

const PORT = process.env.PORT || 5000;

// Global Error Handler
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});