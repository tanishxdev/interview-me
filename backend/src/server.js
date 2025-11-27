import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import rateLimit from "express-rate-limit";
import { serve } from "inngest/express";
import { clerkMiddleware } from "@clerk/express";
import pinoHttp from "pino-http";

import { ENV } from "./lib/env.js";
import { connectDB } from "./lib/db.js";
import { inngest, functions } from "./events/inngest.js";
import { logger } from "./lib/logger.js";

import chatRoutes from "./routes/chatRoutes.js";
import sessionRoutes from "./routes/sessionRoute.js";
import { globalErrorHandler } from "./middleware/errorHandler.js";

import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./config/swagger.js";

// ---------------------------------------------------
// PROCESS LEVEL SAFETY (PREVENT SILENT CRASHES)
// ---------------------------------------------------

// Handles synchronous crashes like undefined access, logic bugs, etc.
process.on("uncaughtException", (error) => {
  logger.fatal("Uncaught Exception", error);
  process.exit(1);
});

// Handles rejected promises not caught by try/catch
process.on("unhandledRejection", (reason) => {
  logger.fatal("Unhandled Promise Rejection", reason);
  process.exit(1);
});

// ---------------------------------------------------
// APP INITIALIZATION
// ---------------------------------------------------

const app = express();

// ---------------------------------------------------
// SECURITY + PERFORMANCE MIDDLEWARE
// ---------------------------------------------------

// Adds secure HTTP headers (XSS, clickjacking, etc.)
app.use(helmet());

// Compresses response bodies to improve performance
app.use(compression());

// Structured HTTP logger for incoming requests
app.use(
  pinoHttp({
    logger,
    customLogLevel: (res) => {
      if (res.statusCode >= 500) return "error";
      if (res.statusCode >= 400) return "warn";
      return "info";
    },
    serializers: {
      req(req) {
        return {
          method: req.method,
          url: req.url,
        };
      },
    },
  })
);

// Rate limiter configuration
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes window
  max: 100, // max 100 requests per IP
  standardHeaders: true,
  legacyHeaders: false,
});

// ---------------------------------------------------
// CORE MIDDLEWARE
// ---------------------------------------------------

// JSON parser with payload size protection
app.use(express.json({ limit: "10kb" }));

// Cross-Origin configuration
app.use(
  cors({
    origin: ENV.CLIENT_URL,
    credentials: true,
  })
);

// ---------------------------------------------------
// PUBLIC ROUTES
// ---------------------------------------------------

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "Backend operational",
    environment: ENV.NODE_ENV,
    timestamp: new Date().toISOString(),
  });
});

// Swagger docs (Open API UI)
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Inngest webhook endpoint (must stay public)
app.use(`${ENV.API_PREFIX}/inngest`, serve({ client: inngest, functions }));

// ---------------------------------------------------
// PROTECTED ROUTES (AUTH + RATE LIMIT APPLIED)
// ---------------------------------------------------

// Clerk authentication middleware
app.use(clerkMiddleware());

// Only apply rate limit in production to avoid dev frustration
if (ENV.NODE_ENV === "production") {
  app.use(apiLimiter);
}

app.use(`${ENV.API_PREFIX}/chat`, chatRoutes);
app.use(`${ENV.API_PREFIX}/sessions`, sessionRoutes);

// ---------------------------------------------------
// 404 HANDLER (AFTER ALL ROUTES)
// ---------------------------------------------------

app.use((req, res) => {
  res.status(404).json({
    status: "fail",
    message: "Route not found",
  });
});

// ---------------------------------------------------
// GLOBAL ERROR HANDLER (MUST BE LAST)
// ---------------------------------------------------

app.use(globalErrorHandler);

// ---------------------------------------------------
// SERVER BOOTSTRAP
// ---------------------------------------------------

let server;

const startServer = async () => {
  try {
    await connectDB();

    server = app.listen(ENV.SERVER_PORT, () => {
      logger.info("Backend running", {
        port: ENV.SERVER_PORT,
        env: ENV.NODE_ENV,
        apiPrefix: ENV.API_PREFIX,
        client: ENV.CLIENT_URL,
      });
    });
  } catch (error) {
    logger.error("Server boot failure", error);
    process.exit(1);
  }
};

startServer();

// ---------------------------------------------------
// GRACEFUL SHUTDOWN (SERVER CLOSE HANDLING)
// ---------------------------------------------------

process.on("SIGTERM", () => {
  logger.info("SIGTERM received. Shutting down server...");
  server.close(() => {
    process.exit(0);
  });
});

process.on("SIGINT", () => {
  logger.info("SIGINT received. Shutting down server...");
  server.close(() => {
    process.exit(0);
  });
});
