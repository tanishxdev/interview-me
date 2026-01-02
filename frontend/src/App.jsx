/**
 * App Component
 * Root application component with providers
 */

import { BrowserRouter } from "react-router-dom";
import { ClerkProvider } from "@clerk/clerk-react";
import ThemeProvider from "./providers/ThemeProvider";
import AppRoutes from "./routes/AppRoutes";
import { CLERK_PUBLISHABLE_KEY } from "./utils/constants";

const App = () => {
  return (
    <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY}>
      <BrowserRouter>
        <ThemeProvider>
          <AppRoutes />
        </ThemeProvider>
      </BrowserRouter>
    </ClerkProvider>
  );
};

export default App;
