import { z } from "zod";

/*
=================================
SESSION VALIDATION SCHEMAS
=================================
*/

/**
 * Schema for creating a new interview session
 * Validates request body
 */
export const createSessionSchema = z.object({
  body: z
    .object({
      problem: z
        .string()
        .trim()
        .min(10, "Problem must be at least 10 characters")
        .max(500, "Problem too long"),

      difficulty: z.enum(["easy", "medium", "hard"]),
    })
    .strict(),
});

/**
 * Schema for validating session ID in route params
 * Ensures valid MongoDB ObjectId format
 */
export const sessionIdSchema = z.object({
  params: z.object({
    id: z
      .string()
      .regex(/^[0-9a-fA-F]{24}$/, "Invalid session ID"),
  }),
});
