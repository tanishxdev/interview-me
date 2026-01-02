/**
 * useDarkMode Hook
 * Manages theme state and system preference detection
 */

import { useEffect } from "react";
import useUIStore from "../store/ui.store";

const useDarkMode = () => {
  const { theme, isDarkMode, setTheme, toggleTheme } = useUIStore();

  // Initialize theme on mount
  useEffect(() => {
    // Apply initial theme
    setTheme(theme);

    // Listen for system theme changes when theme is 'system'
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const handleSystemThemeChange = (e) => {
      if (theme === "system") {
        const root = window.document.documentElement;
        root.classList.toggle("dark", e.matches);
        useUIStore.setState({ isDarkMode: e.matches });
      }
    };

    mediaQuery.addEventListener("change", handleSystemThemeChange);

    return () => {
      mediaQuery.removeEventListener("change", handleSystemThemeChange);
    };
  }, [theme, setTheme]);

  return {
    theme,
    isDarkMode,
    setTheme,
    toggleTheme,
  };
};

export default useDarkMode;
