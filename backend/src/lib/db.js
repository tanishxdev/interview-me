import mongoose from "mongoose";
import { ENV } from "./env.js";
import { logger } from "./logger.js";

/**
 * Connects to MongoDB using Mongoose
 * Handles env validation and logs connection status
 */
export const connectDB = async () => {
  try {
    if (!ENV.DB_URL) {
      throw new Error("DB_URL is missing");
    }

    await mongoose.connect(ENV.DB_URL, {
      autoIndex: ENV.NODE_ENV !== "production",
      serverSelectionTimeoutMS: 10000,
      connectTimeoutMS: 10000,
    });

    logger.info("MongoDB connection established");
  } catch (error) {
    logger.fatal("MongoDB connection failed", error);
    process.exit(1);
  }
};

/**
 * MongoDB lifecycle event monitoring
 * Helps debugging and health tracking
 */
mongoose.connection.on("connected", () => {
  logger.info("Mongoose connected");
});

mongoose.connection.on("error", (err) => {
  logger.error("Mongoose connection error", err);
});

mongoose.connection.on("disconnected", () => {
  logger.warn("Mongoose disconnected");
});

/**
 * Manual disconnect support (used by server shutdown)
 */
export const disconnectDB = async () => {
  await mongoose.connection.close();
  logger.warn("MongoDB connection closed");
};
