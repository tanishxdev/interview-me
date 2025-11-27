import { AppError } from "../utils/AppError.js";

/**
 * validate(schema)
 * Generic request validator using Zod
 * Ensures clean and safe data before reaching controller
 */
export const validate = (schema) => (req, res, next) => {
  try {
    const data = {
      body: req.body,
      params: req.params,
      query: req.query,
    };

    const result = schema.safeParse(data);

    // Validation failed
    if (!result.success) {

      // Map Zod errors to readable format
      const errors = result.error.errors.map((e) => ({
        field: e.path.join("."),
        message: e.message,
      }));

      return next(
        new AppError("Validation failed", 400, errors)
      );
    }

    // Replace original data with validated & sanitized data
    req.body = result.data.body;
    req.params = result.data.params;
    req.query = result.data.query;

    next();

  } catch (error) {
    next(error);
  }
};
