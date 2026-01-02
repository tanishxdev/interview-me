/**
 * useStreamToken Hook
 * Fetches and manages Stream SDK token
 */

import { useUser } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import { getStreamToken } from "../services/chat.service";

const useStreamToken = () => {
  const { user, isLoaded } = useUser();
  const [streamToken, setStreamToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchToken = async () => {
      // Wait for Clerk user to be loaded
      if (!isLoaded || !user) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        const tokenData = await getStreamToken();
        setStreamToken(tokenData);
      } catch (err) {
        setError(err.message || "Failed to fetch Stream token");
      } finally {
        setIsLoading(false);
      }
    };

    fetchToken();
  }, [user, isLoaded]);

  return {
    streamToken,
    isLoading,
    error,
  };
};

export default useStreamToken;
