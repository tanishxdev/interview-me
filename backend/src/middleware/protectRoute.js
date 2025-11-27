import { requireAuth } from "@clerk/express";
import User from "../models/User.js";
import { AppError } from "../utils/AppError.js";

/**
 * protectRoute
 * This middleware ensures:
 * 1. Request has valid Clerk token
 * 2. Corresponding user exists in DB
 * 3. User object is attached to req for further usage
 */
export const protectRoute = [
  requireAuth(),

  async (req, res, next) => {
    try {
      // Clerk middleware injects auth object
      const clerkId = req.auth()?.userId;

      if (!clerkId) {
        return next(
          new AppError("Unauthorized: Invalid token", 401)
        );
      }

      // Fetch user from database
      const user = await User.findOne({ clerkId })
        .select("-__v")
        .lean();

      if (!user) {
        return next(
          new AppError("User not found", 404)
        );
      }

      // Attach user to request object
      req.user = user;

      next();

    } catch (error) {
      next(error);
    }
  },
];
