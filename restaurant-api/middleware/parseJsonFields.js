const AppError = require("../utils/AppError");

// Multipart/form-data fields arrive as strings (or as flattened arrays only
// when a field repeats more than once). For fields that must be a JSON
// array/object regardless of how many values were sent, the client sends a
// single JSON-stringified value which this middleware parses back before
// Joi/Mongoose ever sees it.
const parseJsonFields = (fieldNames) => {
  return (req, res, next) => {
    try {
      fieldNames.forEach((fieldName) => {
        if (typeof req.body[fieldName] === "string") {
          req.body[fieldName] = JSON.parse(req.body[fieldName]);
        }
      });

      next();
    } catch (error) {
      next(new AppError(`Invalid JSON in field: ${fieldNames.join(", ")}`, 400));
    }
  };
};

module.exports = parseJsonFields;
