const ApiError = require('../utils/ApiError');
const env = require('../config/env');

const notFoundHandler = (req, res, next) => {
  next(new ApiError(404, `Route not found: ${req.originalUrl}`));
};

const errorHandler = (err, req, res, next) => {
  let error = err;

  if (!(error instanceof ApiError)) {
    const statusCode = error.statusCode || 500;
    const message = error.message || 'Internal Server Error';
    error = new ApiError(statusCode, message, error.errors || [], err.stack);
  }

  if (error.statusCode >= 500) {
    console.error(err);
  }

  const response = {
    success: false,
    message: error.message,
    errors: error.errors,
  };

  if (env.NODE_ENV === 'development') {
    response.stack = error.stack;
  }

  res.status(error.statusCode || 500).json(response);
};

module.exports = { notFoundHandler, errorHandler };