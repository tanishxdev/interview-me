/**
 * AppRoutes Component
 * Main routing configuration
 */

import { Routes, Route, Navigate } from "react-router-dom";
import { SignIn, SignUp } from "@clerk/clerk-react";
import ProtectedRoute from "./ProtectedRoute";
import { ROUTES } from "../utils/constants";

// Lazy load pages for better performance
import Landing from "../pages/Landing";
import Dashboard from "../pages/Dashboard";
import Sessions from "../pages/Sessions";
import SessionRoom from "../pages/SessionRoom";
import Profile from "../pages/Profile";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path={ROUTES.HOME} element={<Landing />} />

      {/* Auth Routes */}
      <Route
        path={ROUTES.SIGN_IN}
        element={
          <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-900">
            <SignIn
              routing="path"
              path={ROUTES.SIGN_IN}
              signUpUrl={ROUTES.SIGN_UP}
              afterSignInUrl={ROUTES.DASHBOARD}
            />
          </div>
        }
      />
      <Route
        path={ROUTES.SIGN_UP}
        element={
          <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-900">
            <SignUp
              routing="path"
              path={ROUTES.SIGN_UP}
              signInUrl={ROUTES.SIGN_IN}
              afterSignUpUrl={ROUTES.DASHBOARD}
            />
          </div>
        }
      />

      {/* Protected Routes */}
      <Route
        path={ROUTES.DASHBOARD}
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path={ROUTES.SESSIONS}
        element={
          <ProtectedRoute>
            <Sessions />
          </ProtectedRoute>
        }
      />
      <Route
        path={ROUTES.SESSION_ROOM}
        element={
          <ProtectedRoute>
            <SessionRoom />
          </ProtectedRoute>
        }
      />
      <Route
        path={ROUTES.PROFILE}
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />

      {/* Fallback - Redirect to home */}
      <Route path="*" element={<Navigate to={ROUTES.HOME} replace />} />
    </Routes>
  );
};

export default AppRoutes;
