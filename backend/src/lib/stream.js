import { StreamChat } from "stream-chat";
import { StreamClient } from "@stream-io/node-sdk";
import { ENV } from "./env.js";
import { logger } from "./logger.js";

// Extract API credentials from ENV
const apiKey = ENV.STREAM_API_KEY;
const apiSecret = ENV.STREAM_API_SECRET;

/**
 * Validate Stream credentials early
 * Prevents runtime failures when SDK methods are used
 */
if (!apiKey || !apiSecret) {
  logger.fatal("Stream API credentials are missing");
  process.exit(1);
}

/*
chatClient   → Used for text-based chat functionality
streamClient → Used for video/audio calls
*/
export const chatClient = StreamChat.getInstance(apiKey, apiSecret);
export const streamClient = new StreamClient(apiKey, apiSecret);

// ----------------------------------------------------
// STREAM USER HELPERS
// ----------------------------------------------------

/**
 * Creates or updates a user inside Stream system
 * This should be called when:
 * - User signs up
 * - User updates profile
 */
export const upsertStreamUser = async (userData) => {
  try {
    await chatClient.upsertUser(userData);

    logger.info("Stream user upserted", {
      userId: userData.id,
    });

    return true;
  } catch (error) {
    logger.error("Error upserting Stream user", {
      userId: userData?.id,
      error: error.message,
    });

    return false;
  }
};

/**
 * Deletes a Stream user
 * This should be called when:
 * - User account is removed
 */
export const deleteStreamUser = async (userId) => {
  try {
    await chatClient.deleteUser(userId);

    logger.info("Stream user deleted", { userId });

    return true;
  } catch (error) {
    logger.error("Error deleting Stream user", {
      userId,
      error: error.message,
    });

    return false;
  }
};
