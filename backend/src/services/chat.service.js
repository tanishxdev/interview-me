import { chatClient } from "../lib/stream.js";
import { AppError } from "../utils/AppError.js";
import { logger } from "../lib/logger.js";

/**
 * generateStreamToken
 * Creates Stream Chat authentication token for a user
 * This token is used by frontend to connect to Stream SDK
 */
export async function generateStreamToken(user) {

  // Safety validation: ensure user object exists
  if (!user || !user.clerkId) {
    throw new AppError("User not authenticated", 401);
  }

  try {
    // Generate Stream token using unique Clerk ID
    const token = chatClient.createToken(String(user.clerkId));

    return {
      token,
      userId: user.clerkId,
      userName: user.name || "User",
      userImage: user.profileImage || "",
    };

  } catch (error) {

    // Internal error logging for debugging
    logger.error(
      {
        userId: user?.clerkId,
        error: error.message,
      },
      "Stream token generation failed"
    );

    throw new AppError("Failed to generate Stream token", 500);
  }
}
