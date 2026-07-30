const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    items: [
      {
        food: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Food",
          required: true
        },

        foodName: {
          type: String,
          required: true
        },

        priceAtPurchase: {
          type: Number,
          required: true
        },

        quantity: {
          type: Number,
          required: true,
          min: 1
        },

        station: {
          type: String,
          enum: [
            "Bakery",
            "Beverages",
            "Breakfast",
            "Fryer",
            "Grill",
            "Legumes & Pots",
            "Pepper Soup",
            "Protein Prep",
            "Rice & Grains",
            "Swallow & Soup"
          ]
        },

        notes: {
          type: String,
          default: ""
        },

        completed: {
          type: Boolean,
          default: false
        }
      }
    ],

    totalAmount: {
      type: Number,
      default: 0
    },

    discountAmount: {
      type: Number,
      default: 0
    },

    assignedRider: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Rider",
      default: null
    },

    status: {
      type: String,
      enum: [
        "Pending",
        "Confirmed",
        "Preparing",
        "Out For Delivery",
        "Delivered",
        "Cancelled"
      ],
      default: "Pending"
    }
  },
  {
    timestamps: true
  }
);

// =========================
// Database Indexes
// =========================

// Customer order history
orderSchema.index({
  customer: 1,
  createdAt: -1
});

// Admin dashboard (status + newest)
orderSchema.index({
  status: 1,
  createdAt: -1
});

// General newest orders
orderSchema.index({
  createdAt: -1
});

module.exports = mongoose.model("Order", orderSchema);