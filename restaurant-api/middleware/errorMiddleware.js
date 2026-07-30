const errorHandler = (
  err,
  req,
  res,
  next
) => {

  // Invalid MongoDB ID
  if (err.name === "CastError") {
    return res.status(400).json({
      success: false,
      status: "fail",
      message: "Invalid ID format"
    });
  }

  // Duplicate Key Error
  if (err.code === 11000) {
    return res.status(400).json({
      success: false,
      status: "fail",
      message: "Duplicate field value entered"
    });
  }

  // Mongoose Validation Error
  if (err.name === "ValidationError") {

    const errors = Object.values(
      err.errors
    ).map(val => val.message);

    return res.status(400).json({
      success: false,
      status: "fail",
      errors
    });
  }

  // JWT Invalid Token
  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({
      success: false,
      status: "fail",
      message: "Invalid token"
    });
  }

  // JWT Expired Token
  if (err.name === "TokenExpiredError") {
    return res.status(401).json({
      success: false,
      status: "fail",
      message: "Token expired"
    });
  }

  // Multer Upload Error
  if (err.name === "MulterError") {
    return res.status(400).json({
      success: false,
      status: "fail",
      message: err.message
    });
  }

  res.status(
    err.statusCode || 500
  ).json({
    success: false,
    status: err.status || "error",
    message:
      err.message || "Server Error"
  });

};

module.exports = errorHandler;