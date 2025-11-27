import dotenv from "dotenv";
import { z } from "zod";

// Load environment variables from .env file into process.env
dotenv.config();

// Temporary logger (to avoid circular dependency with logger.js)
const log = (...args) => console.error(...args);

// Zod schema defining required and optional env vars
const envSchema = z.object({
  SERVER_PORT: z.string().default("5000"),
  NODE_ENV: z.enum(["development", "production"]).default("development"),
  API_PREFIX: z.string().default("/api/v1"),

  CLIENT_URL_DEV: z.string().url(),
  CLIENT_URL_PROD: z.string().url().optional(),

  DB_URL: z.string().min(1),

  CLERK_SECRET_KEY: z.string().min(1),
  CLERK_PUBLISHABLE_KEY: z.string().min(1),

  STREAM_API_KEY: z.string().min(1),
  STREAM_API_SECRET: z.string().min(1),

  INNGEST_EVENT_KEY: z.string().min(1),
  INNGEST_SIGNING_KEY: z.string().min(1),
});

const parsed = envSchema.safeParse(process.env);

// If validation fails, log detailed errors and stop the server immediately
if (!parsed.success) {
  log("ENV VALIDATION FAILED\n");

  const errors = parsed.error.flatten().fieldErrors;

  for (const key in errors) {
    log(`- ${key}: ${errors[key].join(", ")}`);
  }

  process.exit(1);
}

// Conditional safety: ensure production client URL exists
if (
  parsed.data.NODE_ENV === "production" &&
  !parsed.data.CLIENT_URL_PROD
) {
  log("CLIENT_URL_PROD is required in production environment");
  process.exit(1);
}

// Export structured ENV object (safe to use everywhere)
export const ENV = {
  SERVER_PORT: Number(parsed.data.SERVER_PORT),
  NODE_ENV: parsed.data.NODE_ENV,
  API_PREFIX: parsed.data.API_PREFIX,

  CLIENT_URL:
    parsed.data.NODE_ENV === "production"
      ? parsed.data.CLIENT_URL_PROD
      : parsed.data.CLIENT_URL_DEV,

  DB_URL: parsed.data.DB_URL,
  CLERK_SECRET_KEY: parsed.data.CLERK_SECRET_KEY,
  CLERK_PUBLISHABLE_KEY: parsed.data.CLERK_PUBLISHABLE_KEY,
  STREAM_API_KEY: parsed.data.STREAM_API_KEY,
  STREAM_API_SECRET: parsed.data.STREAM_API_SECRET,
  INNGEST_EVENT_KEY: parsed.data.INNGEST_EVENT_KEY,
  INNGEST_SIGNING_KEY: parsed.data.INNGEST_SIGNING_KEY,
};
