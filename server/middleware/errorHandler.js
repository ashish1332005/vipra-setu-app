const errorHandler = (error, req, res, next) => {
  const statusCode = error.statusCode || (res.statusCode && res.statusCode !== 200 ? res.statusCode : 500);
  const message = formatErrorMessage(error);

  res.status(statusCode).json({
    message,
    stack: process.env.NODE_ENV === 'production' ? undefined : error.stack,
  });
};

const formatErrorMessage = (error) => {
  const message = error.message || 'Server error';
  if (
    message.includes('ECONNREFUSED') ||
    message.includes('MongoDB connection') ||
    message.includes('buffering timed out')
  ) {
    return 'Database connection is not available. Please configure MONGO_URI on the backend and restart the server.';
  }
  return message;
};

module.exports = errorHandler;
