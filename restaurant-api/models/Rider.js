const mongoose = require("mongoose");

const riderSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    phone: {
      type: String,
      required: true,
      trim: true
    },

    vehicleType: {
      type: String,
      enum: ["car", "bike", "scooter"],
      required: true
    },

    status: {
      type: String,
      enum: ["available", "en_route", "returning", "offline"],
      default: "available"
    },

    location: {
      lat: { type: Number },
      lng: { type: Number },
      updatedAt: { type: Date }
    }
  },
  {
    timestamps: true
  }
);

riderSchema.index({ status: 1 });

module.exports = mongoose.model("Rider", riderSchema);
