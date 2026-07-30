const mongoose = require("mongoose");

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const businessHourSchema = new mongoose.Schema(
  {
    day: {
      type: String,
      enum: DAYS,
      required: true
    },

    isOpen: {
      type: Boolean,
      default: true
    },

    openTime: {
      type: String,
      default: "09:00"
    },

    closeTime: {
      type: String,
      default: "22:00"
    }
  },
  { _id: false }
);

const restaurantSettingsSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      default: "My Restaurant"
    },

    email: {
      type: String,
      default: ""
    },

    phone: {
      type: String,
      default: ""
    },

    address: {
      type: String,
      default: ""
    },

    businessHours: {
      type: [businessHourSchema],
      default: () => DAYS.map(day => ({
        day,
        isOpen: day !== "Sunday",
        openTime: "09:00",
        closeTime: day === "Friday" || day === "Saturday" ? "23:00" : "22:00"
      }))
    },

    targetPrepTimeMinutes: {
      type: Number,
      default: 15
    }
  },
  { timestamps: true }
);

// Singleton doc, created lazily on first read so there's no seed migration to run.
restaurantSettingsSchema.statics.getSingleton = async function () {
  let settings = await this.findOne();

  if (!settings) {
    settings = await this.create({});
  }

  return settings;
};

module.exports = mongoose.model("RestaurantSettings", restaurantSettingsSchema);
