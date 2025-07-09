// Global error handling middleware for Express applications
const errorMiddleware = (err, req, res, next) => {
  try {
    // Create a copy of the error object to avoid mutating the original
    let error = { ...err };

    // Preserve the original error message
    error.message = err.message;

    // Log the error for debugging purposes
    console.error(err);

    // Handle MongoDB CastError - typically occurs with invalid ObjectId format
    if (err.name === "castError") {
      const message = "Resource not found";
      error = new Error(message);
      error.statusCode = 404;
    }

    // Handle MongoDB duplicate key error (E11000) - occurs when unique constraint is violated
    if (err.code === 11000) {
      const message = "Duplicate field value entered";
      error = new Error(message);
      error.statusCode = 400;
    }

    // Handle Mongoose validation errors - occurs when data doesn't meet schema requirements
    if (err.name === "validationError") {
      // Extract all validation error messages and combine them
      const message = Object.values(err.errors).map((val) => val.message);
      error = new Error(message.join(", "));
      error.statusCode = 400;
    }

    // Send standardized error response to client
    res
      .status(error.statusCode || 500)
      .json({ success: false, error: error.message || "Server Error" });
  } catch (error) {
    // If error processing fails, pass to next error handler
    next(error);
  }
};

export default errorMiddleware;
