const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const apiLimiter = require("./config/rateLimiter");
const sanitizeBody = require("./middleware/sanitizeBody");

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const foodRoutes = require("./routes/foodRoutes");
const menuRoutes = require("./routes/menuRoutes");
const orderRoutes = require("./routes/orderRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const riderRoutes = require("./routes/riderRoutes");
const userRoutes = require("./routes/userRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");
const settingsRoutes = require("./routes/settingsRoutes");
const errorHandler = require("./middleware/errorMiddleware");

dotenv.config();

connectDB();

// Initialize Express App
const app = express();
// =========================
// Security Middleware
// =========================
app.use(helmet());
// Rate limiting disabled during active development (a frontend refetch-loop
// bug was tripping the 100req/15min limit and locking out the whole app for
// 15 minutes at a time). Re-enable before any real deployment.
// app.use(apiLimiter);

// =========================
// Core Middleware
// =========================
// Allowed frontend origins: restaurant-admin today, plus whatever origin the
// future customer-facing app is served from once it exists (add it to
// CLIENT_ORIGINS in .env, no code change needed).
const allowedOrigins = process.env.CLIENT_ORIGINS
  ? process.env.CLIENT_ORIGINS.split(",").map(origin => origin.trim())
  : ["http://localhost:5173"];

app.use(cors({
  origin: (origin, callback) => {
    // No origin = curl/Postman/server-to-server — allow.
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error("Not allowed by CORS"));
  }
}));

app.use(express.json());

app.use(express.urlencoded({
  extended: true
}));

app.use(sanitizeBody);

app.use(morgan("dev"));

app.use("/uploads", express.static("uploads"));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/foods", foodRoutes);
app.use("/api/menus", menuRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/riders", riderRoutes);
app.use("/api/users", userRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/settings", settingsRoutes);


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