const mongoose = require("mongoose");

const menuSchema = new mongoose.Schema(
  {
    categoryName: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      default: ""
    },

    icon: {
      type: String,
      default: "utensils-crossed"
    },

    status: {
      type: String,
      enum: ["Active", "Draft"],
      default: "Active"
    }
  },
  {
    timestamps: true
  }
);

// =========================
// Database Indexes
// =========================

// Unique menu category
menuSchema.index(
  {
    categoryName: 1
  },
  {
    unique: true
  }
);

module.exports = mongoose.model("Menu", menuSchema);