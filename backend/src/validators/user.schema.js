import { z } from "zod";

/*
=================================
USER VALIDATION SCHEMAS
=================================
*/

/**
 * Schema for updating user profile
 * (prepared for future user profile routes)
 */
export const updateUserSchema = z.object({
  body: z
    .object({
      name: z.string().trim().min(2).max(100).optional(),
      profileImage: z.string().url().optional(),
    })
    .strict(),
});
