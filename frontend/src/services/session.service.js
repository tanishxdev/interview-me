/**
 * Session Service
 * Handles all session-related API operations
 */

import api from "./api";
import { ENDPOINTS } from "../utils/constants";

/**
 * Create a new interview session
 * @param {Object} data - { problem: string, difficulty: 'easy' | 'medium' | 'hard' }
 * @returns {Promise<Object>} Created session
 */
export const createSession = async (data) => {
  try {
    const response = await api.post(ENDPOINTS.SESSIONS, data);
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * Get all active sessions
 * @returns {Promise<Array>} List of active sessions
 */
export const getActiveSessions = async () => {
  try {
    const response = await api.get(ENDPOINTS.ACTIVE_SESSIONS);
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * Get user's recent completed sessions
 * @returns {Promise<Array>} List of recent sessions
 */
export const getMyRecentSessions = async () => {
  try {
    const response = await api.get(ENDPOINTS.MY_RECENT_SESSIONS);
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * Get session by ID
 * @param {string} sessionId - Session ID
 * @returns {Promise<Object>} Session details
 */
export const getSessionById = async (sessionId) => {
  try {
    const response = await api.get(ENDPOINTS.SESSION_BY_ID(sessionId));
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * Join an active session
 * @param {string} sessionId - Session ID to join
 * @returns {Promise<Object>} Updated session with join confirmation
 */
export const joinSession = async (sessionId) => {
  try {
    const response = await api.post(ENDPOINTS.SESSION_JOIN(sessionId));
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * End a session (host only)
 * @param {string} sessionId - Session ID to end
 * @returns {Promise<Object>} Ended session confirmation
 */
export const endSession = async (sessionId) => {
  try {
    const response = await api.post(ENDPOINTS.SESSION_END(sessionId));
    return response;
  } catch (error) {
    throw error;
  }
};
