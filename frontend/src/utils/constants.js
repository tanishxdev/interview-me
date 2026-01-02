/**
 * Application Constants
 * Centralized configuration and constants
 */

// API Configuration
export const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;
export const API_PREFIX = import.meta.env.VITE_API_PREFIX || "/api/v1";
export const API_URL = `${API_BASE_URL}${API_PREFIX}`;

// Clerk Configuration
export const CLERK_PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

// Stream Configuration
export const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;

// Session Difficulty Levels
export const DIFFICULTY_LEVELS = {
  EASY: "easy",
  MEDIUM: "medium",
  HARD: "hard",
};

// Session Status
export const SESSION_STATUS = {
  ACTIVE: "active",
  ENDED: "ended",
  PENDING: "pending",
};

// Difficulty Colors (for UI)
export const DIFFICULTY_COLORS = {
  easy: "text-green-600 bg-green-50 dark:text-green-400 dark:bg-green-900/30",
  medium:
    "text-yellow-600 bg-yellow-50 dark:text-yellow-400 dark:bg-yellow-900/30",
  hard: "text-red-600 bg-red-50 dark:text-red-400 dark:bg-red-900/30",
};

// Storage Keys
export const STORAGE_KEYS = {
  THEME: "interview-me-theme",
  USER_PREFERENCES: "interview-me-user-prefs",
};

// Routes
export const ROUTES = {
  HOME: "/",
  DASHBOARD: "/dashboard",
  SESSIONS: "/sessions",
  SESSION_ROOM: "/session/:id",
  PROFILE: "/profile",
  SIGN_IN: "/sign-in",
  SIGN_UP: "/sign-up",
};

// API Endpoints
export const ENDPOINTS = {
  SESSIONS: "/sessions",
  SESSION_BY_ID: (id) => `/sessions/${id}`,
  SESSION_JOIN: (id) => `/sessions/${id}/join`,
  SESSION_END: (id) => `/sessions/${id}/end`,
  ACTIVE_SESSIONS: "/sessions/active",
  MY_RECENT_SESSIONS: "/sessions/my-recent",
  CHAT_TOKEN: "/chat/token",
};
