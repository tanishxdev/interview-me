import { useState, useEffect } from "react";
import api from "../services/api.js";

export default function useStreamToken() {
  const [tokenData, setTokenData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const res = await api.get("/chat/token");
        setTokenData(res.data.data);
      } catch (err) {
        setError("Failed to load Stream token");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchToken();
  }, []);

  return { tokenData, loading, error };
}
