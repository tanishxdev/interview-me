import swaggerJSDoc from "swagger-jsdoc";
import { ENV } from "../lib/env.js";

/**
 * Swagger Configuration
 * Generates OpenAPI specification from JSDoc comments
 */
export const swaggerSpec = swaggerJSDoc({
  definition: {
    openapi: "3.0.0",

    info: {
      title: "Interview.me Backend API",
      version: "1.0.0",
      description: "Official API documentation for Interview.me backend",
    },

    servers: [
      {
        url: `${ENV.NODE_ENV === "production"
          ? ENV.CLIENT_URL
          : `http://localhost:${ENV.SERVER_PORT}`
        }${ENV.API_PREFIX}`,
        description:
          ENV.NODE_ENV === "production"
            ? "Production server"
            : "Development server",
      },
    ],

    // Global security rule (can be overridden per route)
    security: [
      {
        ClerkAuth: [],
      },
    ],

    components: {
      securitySchemes: {
        ClerkAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "Clerk authentication using Bearer token",
        },
      },

      // Reusable response schemas
      schemas: {
        SuccessResponse: {
          type: "object",
          properties: {
            status: { type: "string", example: "success" },
            data: { type: "object" },
          },
        },

        ErrorResponse: {
          type: "object",
          properties: {
            status: { type: "string", example: "fail" },
            message: { type: "string" },
            errors: { type: "array", items: { type: "object" } },
          },
        },
      },
    },

    tags: [
      {
        name: "Chat",
        description: "Chat & Stream related operations",
      },
      {
        name: "Sessions",
        description: "Interview session management",
      },
    ],
  },

  apis: ["./src/routes/*.js"],
});
