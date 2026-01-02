/**
 * ProtectedRoute Component
 * Wrapper for routes that require authentication
 */

import { useEffect } from "react";
import { useAuth } from "@clerk/clerk-react";
import { Navigate, useLocation } from "react-router-dom";
import { setAuthToken } from "../services/api";
import Loader from "../components/common/Loader";
import { ROUTES } from "../utils/constants";

const ProtectedRoute = ({ children }) => {
  const { isLoaded, isSignedIn, getToken } = useAuth();
  const location = useLocation();

  // Set auth token when user is authenticated
  useEffect(() => {
    const updateToken = async () => {
      if (isSignedIn) {
        try {
          const token = await getToken();
          setAuthToken(token);
        } catch (error) {
          console.error("Failed to get auth token:", error);
        }
      }
    };

    updateToken();
  }, [isSignedIn, getToken]);

  // Show loader while Clerk is loading
  if (!isLoaded) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader size="lg" message="Loading..." />
      </div>
    );
  }

  // Redirect to sign-in if not authenticated
  if (!isSignedIn) {
    return <Navigate to={ROUTES.SIGN_IN} state={{ from: location }} replace />;
  }

  // Render protected content
  return children;
};

export default ProtectedRoute;
