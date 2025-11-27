import { ENV } from "../lib/env.js";
import { logger } from "../lib/logger.js";

/**
 * Global Error Handling Middleware
 * Central point for all thrown/forwarded errors
 */
export const globalErrorHandler = (err, req, res, next) => {

  // Normalize error values
  const statusCode = err.statusCode || 500;
  const status = err.status || "error";

  const response = {
    status,
    message: err.isOperational
      ? err.message
      : "Internal server error",
  };

  // Attach detailed errors if present (like validation errors)
  if (err.errors) {
    response.errors = err.errors;
  }

  // Stack trace only for development responses
  if (ENV.NODE_ENV === "development") {
    response.stack = err.stack;
  }

  // Structured logging (always log real error details)
  logger.error(
    {
      method: req.method,
      url: req.originalUrl,
      statusCode,
      message: err.message,
      stack: err.stack,
    },
    "Unhandled application error"
  );

  res.status(statusCode).json(response);
};
