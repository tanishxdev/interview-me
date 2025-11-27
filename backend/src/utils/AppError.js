/**
 * Custom Application Error Class
 * Used to create controlled, operational errors
 */
export class AppError extends Error {

  /**
   * @param {string} message   - Human readable error message
   * @param {number} statusCode - HTTP status code
   * @param {Array|Object|null} errors - Extra error details (validation, etc)
   * @param {string|null} code  - Optional machine-readable error code
   */
  constructor(message, statusCode = 500, errors = null, code = null) {
    super(message || "An unexpected error occurred");

    // HTTP status code (e.g. 400, 404, 500)
    this.statusCode = statusCode;

    // fail → client errors, error → server failures
    this.status =
      statusCode >= 400 && statusCode < 500 ? "fail" : "error";

    // Marks this as controlled error (vs system crash)
    this.isOperational = true;

    // Optional machine-readable code for frontend handling
    this.code = code;

    // Detailed error data (validation errors, field errors etc)
    this.errors = errors;

    // Helpful for logging/debugging
    this.timestamp = new Date().toISOString();

    // Maintain proper stack trace
    Error.captureStackTrace(this, this.constructor);
  }

  /**
   * Convert error into clean JSON object
   * Used by response handlers if needed
   */
  toJSON() {
    return {
      status: this.status,
      message: this.message,
      code: this.code,
      errors: this.errors,
      timestamp: this.timestamp,
    };
  }
}
