/**
 * UI Store (Zustand)
 * Manages global UI state: theme, modals, notifications
 */

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { STORAGE_KEYS } from "../utils/constants";

const useUIStore = create(
  persist(
    (set, get) => ({
      // Theme state
      theme: "system", // 'light' | 'dark' | 'system'
      isDarkMode: false,

      // Modal states
      isCreateSessionModalOpen: false,

      // Loading states
      isLoading: false,
      loadingMessage: "",

      // Notification state
      notification: null, // { type: 'success' | 'error' | 'info', message: string }

      /**
       * Theme Actions
       */
      setTheme: (theme) => {
        set({ theme });

        // Apply theme to DOM
        const root = window.document.documentElement;

        if (theme === "system") {
          const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
            .matches
            ? "dark"
            : "light";
          root.classList.toggle("dark", systemTheme === "dark");
          set({ isDarkMode: systemTheme === "dark" });
        } else {
          root.classList.toggle("dark", theme === "dark");
          set({ isDarkMode: theme === "dark" });
        }
      },

      toggleTheme: () => {
        const { theme } = get();
        const newTheme = theme === "dark" ? "light" : "dark";
        get().setTheme(newTheme);
      },

      /**
       * Modal Actions
       */
      openCreateSessionModal: () => set({ isCreateSessionModalOpen: true }),
      closeCreateSessionModal: () => set({ isCreateSessionModalOpen: false }),

      /**
       * Loading Actions
       */
      setLoading: (isLoading, loadingMessage = "") =>
        set({ isLoading, loadingMessage }),

      /**
       * Notification Actions
       */
      showNotification: (type, message) => {
        set({ notification: { type, message } });

        // Auto-hide after 5 seconds
        setTimeout(() => {
          set({ notification: null });
        }, 5000);
      },

      clearNotification: () => set({ notification: null }),
    }),
    {
      name: STORAGE_KEYS.THEME,
      partialize: (state) => ({ theme: state.theme }), // Only persist theme
    }
  )
);

export default useUIStore;
