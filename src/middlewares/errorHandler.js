// middlewares/errorHandler.js
const errorHandler = (err, req, res, next) => {
  console.error("Error Handler:", err);

  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";

  // Mongoose validation error
  if (err.name === "ValidationError") {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((val) => val.message)
      .join(", ");
  }

  // Mongoose bad ObjectId error
  if (err.name === "CastError") {
    statusCode = 400;
    message = `Resource not found with id of ${err.value}`;
  }

  // Duplicate key error (MongoDB)
  if (err.code && err.code === 11000) {
    statusCode = 400;
    message = `Duplicate field value entered`;
  }

  res.status(statusCode).json({
    success: false,
    message,
  });
};

module.exports = errorHandler;
