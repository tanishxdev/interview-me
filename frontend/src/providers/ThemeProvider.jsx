/**
 * ThemeProvider Component
 * Initializes and manages app-wide theme
 */

import { useEffect } from "react";
import useUIStore from "../store/ui.store";

const ThemeProvider = ({ children }) => {
  const { theme, setTheme } = useUIStore();

  useEffect(() => {
    // Initialize theme on mount
    setTheme(theme);
  }, []);

  return <>{children}</>;
};

export default ThemeProvider;
