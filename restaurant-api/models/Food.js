const mongoose = require("mongoose");

const foodSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },

        description: {
            type: String,
            required: true
        },

        ingredients: [
            {
                type: String
            }
        ],

        price: {
            type: Number,
            required: true
        },

        image: {
            type: String,
            default: ""
        },

        availability: {
            type: Boolean,
            default: true
        },

        preparationTime: {
            type: Number,
            required: true
        },

        menu: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Menu",
            required: true
        }
    },
    {
        timestamps: true
    }
);

// =========================
// Database Indexes
// =========================

// Search food by name
foodSchema.index({
    name: 1
});

// Filter foods by menu
foodSchema.index({
    menu: 1
});

// Sort/filter by price
foodSchema.index({
    price: 1
});

// Future availability filtering
foodSchema.index({
    availability: 1
});

module.exports = mongoose.model("Food", foodSchema);