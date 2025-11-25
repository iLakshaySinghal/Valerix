const logger = require("../utils/logger");

function errorHandler(err, req, res, next) {
  logger.error(err);

  const status = err.status || err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  // Hide stacktrace in production
  const response = {
    success: false,
    message,
  };

  if (process.env.NODE_ENV !== "production") {
    response.stack = err.stack;
    response.details = err.details || undefined;
  }

  res.status(status).json(response);
}

module.exports = errorHandler;
