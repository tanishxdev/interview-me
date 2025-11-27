import pino from "pino";
import { ENV } from "./env.js";

// Detect environment
const isProduction = ENV.NODE_ENV === "production";

// Central logger config
export const logger = pino({
  level: isProduction ? "info" : "debug",

  // Base fields added to every log
  base: {
    env: ENV.NODE_ENV,
    service: "interview-me-backend",
  },

  // Normalize log level format
  formatters: {
    level(label) {
      return { level: label };
    },
  },

  serializers: {
    err: pino.stdSerializers.err,
  },

  // Pretty logging only in development
  transport: !isProduction
    ? {
        target: "pino-pretty",
        options: {
          colorize: true,
          translateTime: "SYS:standard",
          ignore: "pid,hostname",
        },
      }
    : undefined,
});
