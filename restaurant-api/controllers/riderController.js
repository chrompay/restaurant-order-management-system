const Rider = require("../models/Rider");
const AppError = require("../utils/AppError");
const sendResponse = require("../utils/responseHandler");
const buildPagination = require("../utils/paginate");

// Create Rider
const createRider = async (req, res, next) => {
  try {

    const rider = await Rider.create(req.body);

    sendResponse(res, {
      statusCode: 201,
      message: "Rider created successfully",
      data: rider
    });

  } catch (error) {
    next(error);
  }
};

// Get All Riders
const getRiders = async (req, res, next) => {
  try {

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;

    const skip = (page - 1) * limit;

    const filter = {};

    if (req.query.status) {
      filter.status = req.query.status;
    }

    const totalRecords = await Rider.countDocuments(filter);

    const riders = await Rider.find(filter)
      .sort("name")
      .skip(skip)
      .limit(limit);

    sendResponse(res, {
      message: "Riders retrieved successfully",
      data: riders,
      meta: {
        count: riders.length,
        ...buildPagination({ page, limit, totalRecords })
      }
    });

  } catch (error) {
    next(error);
  }
};

// Get Single Rider
const getRider = async (req, res, next) => {
  try {

    const rider = await Rider.findById(req.params.id);

    if (!rider) {
      return next(
        new AppError(
          "Rider not found",
          404
        )
      );
    }

    sendResponse(res, {
      message: "Rider retrieved successfully",
      data: rider
    });

  } catch (error) {
    next(error);
  }
};

// Update Rider
const updateRider = async (req, res, next) => {
  try {

    const rider = await Rider.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!rider) {
      return next(
        new AppError(
          "Rider not found",
          404
        )
      );
    }

    sendResponse(res, {
      message: "Rider updated successfully",
      data: rider
    });

  } catch (error) {
    next(error);
  }
};

// Update Rider Location (admin-manual stand-in until a rider-facing client exists)
const updateRiderLocation = async (req, res, next) => {
  try {

    const { lat, lng } = req.body;

    const rider = await Rider.findByIdAndUpdate(
      req.params.id,
      {
        location: { lat, lng, updatedAt: new Date() }
      },
      {
        new: true,
        runValidators: true
      }
    );

    if (!rider) {
      return next(
        new AppError(
          "Rider not found",
          404
        )
      );
    }

    sendResponse(res, {
      message: "Rider location updated successfully",
      data: rider
    });

  } catch (error) {
    next(error);
  }
};

module.exports = {
  createRider,
  getRiders,
  getRider,
  updateRider,
  updateRiderLocation
};
