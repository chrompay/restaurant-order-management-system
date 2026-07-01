/**
 * Standard API Success Response Utility
 *
 * @param {Object} res - Express Response Object
 * @param {Object} options
 */

const sendResponse = (
  res,
  {
    statusCode = 200,
    message = "Request successful",
    data = null,
    meta = null
  }
) => {

  const response = {
    success: true,
    status: "success",
    message,
    timestamp: new Date().toISOString(),
    data
  };

  if (meta) {
    response.meta = meta;
  }

  return res
    .status(statusCode)
    .json(response);

};

module.exports = sendResponse;