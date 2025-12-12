import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";

import Dashboard from "../pages/Dashboard.jsx";
import Sessions from "../pages/Sessions.jsx";
import Profile from "../pages/Profile.jsx";
import SessionRoom from "../pages/SessionRoom/index.jsx";

function ProtectedRoute({ children }) {
  const { isLoaded, isSignedIn } = useAuth();

  if (!isLoaded) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="w-10 h-10 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isSignedIn) {
    return <Navigate to="/" replace />;
  }

  return children;
}

function NotFound() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-20 text-center">
      <h1 className="text-6xl font-bold text-gray-900">404</h1>
      <p className="mt-4 text-2xl text-gray-600">Page not found</p>
      <a
        href="/dashboard"
        className="mt-8 inline-block px-8 py-4 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl transition text-lg shadow-lg"
      >
        ← Back to Dashboard
      </a>
    </div>
  );
}

export default function AppRoutes() {
  return (
    <Routes>
      {/* Redirect root to dashboard when signed in */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/sessions"
        element={
          <ProtectedRoute>
            <Sessions />
          </ProtectedRoute>
        }
      />

      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />

      <Route
        path="/session/:id"
        element={
          <ProtectedRoute>
            <SessionRoom />
          </ProtectedRoute>
        }
      />

      {/* Catch-all route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
