const Food = require("../models/Food");
const AppError = require("../utils/AppError");
const sendResponse = require("../utils/responseHandler");
const buildPagination = require("../utils/paginate");

// Create Food
const createFood = async (req, res, next) => {
    try {

        if (req.file) {
            req.body.image = `/uploads/foods/${req.file.filename}`;
        }

        const food = await Food.create(req.body);

        sendResponse(res, {
            statusCode: 201,
            message: "Food created successfully",
            data: food
        });

    } catch (error) {
        next(error);
    }
};

// Get All Foods
const getFoods = async (req, res, next) => {
    try {

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 5;

        const skip = (page - 1) * limit;

        const filter = {};

        // Search by food name
        if (req.query.name && typeof req.query.name === "string") {
            filter.name = {
                $regex: req.query.name,
                $options: "i"
            };
        }

        // Filter by category (menu id)
        if (req.query.menu && typeof req.query.menu === "string") {
            filter.menu = req.query.menu;
        }

        let query = Food.find(filter)
            .populate("menu", "categoryName");

        // Sort
        if (req.query.sort && typeof req.query.sort === "string") {
            query = query.sort(req.query.sort);
        }

        const totalRecords =
            await Food.countDocuments(filter);

        const foods = await query
            .skip(skip)
            .limit(limit);

        sendResponse(res, {
            message: "Foods retrieved successfully",
            data: foods,
            meta: {
                count: foods.length,
                ...buildPagination({ page, limit, totalRecords })
            }
        });

    } catch (error) {
        next(error);
    }
};

// Get Single Food
const getFood = async (req, res, next) => {
    try {

        const food = await Food.findById(req.params.id)
            .populate("menu", "categoryName");

        if (!food) {
            return next(
                new AppError(
                    "Food not found",
                    404
                )
            );
        }

        sendResponse(res, {
            message: "Food retrieved successfully",
            data: food
        });

    } catch (error) {
        next(error);
    }
};

// Update Food
const updateFood = async (req, res, next) => {
    try {

        if (req.file) {
            req.body.image = `/uploads/foods/${req.file.filename}`;
        }

        const food = await Food.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!food) {
            return next(
                new AppError(
                    "Food not found",
                    404
                )
            );
        }

        sendResponse(res, {
            message: "Food updated successfully",
            data: food
        });

    } catch (error) {
        next(error);
    }
};

// Delete Food
const deleteFood = async (req, res, next) => {
    try {

        const food = await Food.findById(req.params.id);

        if (!food) {
            return next(
                new AppError(
                    "Food not found",
                    404
                )
            );
        }

        await food.deleteOne();

        sendResponse(res, {
            message: "Food deleted successfully"
        });

    } catch (error) {
        next(error);
    }

};

module.exports = {
    createFood,
    getFoods,
    getFood,
    updateFood,
    deleteFood
};