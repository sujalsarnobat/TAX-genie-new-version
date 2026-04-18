const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.isOperational ? err.message : 'Internal server error';

  // Log error in development
  if (process.env.NODE_ENV !== 'production') {
    console.error('Error:', err.message);
    if (!err.isOperational) console.error(err.stack);
  }

  // Handle Mongoose validation errors
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({
      status: 'error',
      message: 'Validation failed',
      errors: messages,
    });
  }

  // Handle Mongoose duplicate key errors
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(409).json({
      status: 'error',
      message: `${field} already exists`,
    });
  }

  // Handle Mongoose cast errors (invalid ObjectId, etc.)
  if (err.name === 'CastError') {
    return res.status(400).json({
      status: 'error',
      message: `Invalid ${err.path}: ${err.value}`,
    });
  }

  res.status(statusCode).json({
    status: 'error',
    message,
  });
};

module.exports = errorHandler;
