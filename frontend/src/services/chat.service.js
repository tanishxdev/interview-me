/**
 * Chat Service
 * Handles Stream Chat/Video token generation
 */

import api from "./api";
import { ENDPOINTS } from "../utils/constants";

/**
 * Get Stream token for authenticated user
 * Used for both Stream Chat and Video SDK
 * @returns {Promise<Object>} { token, userId, userName, userImage }
 */
export const getStreamToken = async () => {
  try {
    const response = await api.get(ENDPOINTS.CHAT_TOKEN);
    return response;
  } catch (error) {
    throw error;
  }
};
