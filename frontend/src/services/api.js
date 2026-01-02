/**
 * Axios API Instance
 * Centralized HTTP client with request/response interceptors
 */

import axios from "axios";
import { API_URL } from "../utils/constants";

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000, // 30 seconds
});

/**
 * Request Interceptor
 * Attaches Clerk auth token to every request
 */
api.interceptors.request.use(
  async (config) => {
    try {
      // Get Clerk session token
      // Note: This will be injected by Clerk's useAuth hook in components
      const token = window.__CLERK_SESSION_TOKEN__;

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      return config;
    } catch (error) {
      return Promise.reject(error);
    }
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Response Interceptor
 * Handles common error responses
 */
api.interceptors.response.use(
  (response) => {
    // Return response data directly
    return response.data;
  },
  (error) => {
    // Handle different error scenarios
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;

      switch (status) {
        case 401:
          // Unauthorized - redirect to sign in
          window.location.href = "/sign-in";
          break;
        case 403:
          // Forbidden
          throw new Error(data?.message || "Access denied");
        case 404:
          throw new Error(data?.message || "Resource not found");
        case 409:
          // Conflict (e.g., session full)
          throw new Error(data?.message || "Conflict occurred");
        case 500:
          throw new Error("Server error. Please try again later.");
        default:
          throw new Error(data?.message || "An error occurred");
      }
    } else if (error.request) {
      // Request made but no response
      throw new Error("Network error. Please check your connection.");
    } else {
      // Something else happened
      throw new Error(error.message || "An unexpected error occurred");
    }

    return Promise.reject(error);
  }
);

/**
 * Helper function to set auth token
 * Called from Clerk auth context
 */
export const setAuthToken = (token) => {
  if (token) {
    window.__CLERK_SESSION_TOKEN__ = token;
  } else {
    delete window.__CLERK_SESSION_TOKEN__;
  }
};

export default api;
