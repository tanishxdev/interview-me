/**
 * Session Store (Zustand)
 * Manages session-related state
 */

import { create } from "zustand";

const useSessionStore = create((set, get) => ({
  // Active sessions list
  activeSessions: [],

  // Recent sessions (user's history)
  recentSessions: [],

  // Current session (when in session room)
  currentSession: null,

  // Loading states
  isLoadingSessions: false,
  isLoadingCurrentSession: false,

  // Error states
  sessionsError: null,
  currentSessionError: null,

  /**
   * Set active sessions
   */
  setActiveSessions: (sessions) =>
    set({
      activeSessions: sessions,
      sessionsError: null,
    }),

  /**
   * Set recent sessions
   */
  setRecentSessions: (sessions) =>
    set({
      recentSessions: sessions,
      sessionsError: null,
    }),

  /**
   * Set current session
   */
  setCurrentSession: (session) =>
    set({
      currentSession: session,
      currentSessionError: null,
    }),

  /**
   * Add new session to active list
   */
  addSession: (session) =>
    set((state) => ({
      activeSessions: [session, ...state.activeSessions],
    })),

  /**
   * Remove session from active list
   */
  removeSession: (sessionId) =>
    set((state) => ({
      activeSessions: state.activeSessions.filter((s) => s._id !== sessionId),
    })),

  /**
   * Update session in active list
   */
  updateSession: (sessionId, updates) =>
    set((state) => ({
      activeSessions: state.activeSessions.map((s) =>
        s._id === sessionId ? { ...s, ...updates } : s
      ),
    })),

  /**
   * Loading state setters
   */
  setLoadingSessions: (isLoading) => set({ isLoadingSessions: isLoading }),
  setLoadingCurrentSession: (isLoading) =>
    set({ isLoadingCurrentSession: isLoading }),

  /**
   * Error state setters
   */
  setSessionsError: (error) => set({ sessionsError: error }),
  setCurrentSessionError: (error) => set({ currentSessionError: error }),

  /**
   * Clear current session
   */
  clearCurrentSession: () =>
    set({
      currentSession: null,
      currentSessionError: null,
    }),

  /**
   * Reset store
   */
  reset: () =>
    set({
      activeSessions: [],
      recentSessions: [],
      currentSession: null,
      isLoadingSessions: false,
      isLoadingCurrentSession: false,
      sessionsError: null,
      currentSessionError: null,
    }),
}));

export default useSessionStore;
