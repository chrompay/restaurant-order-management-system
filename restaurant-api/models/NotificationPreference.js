const mongoose = require("mongoose");

const notificationPreferenceSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true
    },

    newOrders: {
      type: Boolean,
      default: true
    },

    cancellations: {
      type: Boolean,
      default: true
    },

    dailySummary: {
      type: Boolean,
      default: true
    },

    productUpdates: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

// Per-user singleton, created lazily on first read.
notificationPreferenceSchema.statics.getOrCreateForUser = async function (userId) {
  let preferences = await this.findOne({ user: userId });

  if (!preferences) {
    preferences = await this.create({ user: userId });
  }

  return preferences;
};

module.exports = mongoose.model("NotificationPreference", notificationPreferenceSchema);
