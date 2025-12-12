import { useEffect, useState } from "react";
import SessionCard from "../components/SessionCard.jsx";
import api from "../services/api.js";

export default function Sessions() {
  const [activeSessions, setActiveSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchActiveSessions();
  }, []);

  const fetchActiveSessions = async () => {
    try {
      const res = await api.get("/sessions/active");
      setActiveSessions(res.data.data.sessions || []);
    } catch (err) {
      console.error("Failed to load active sessions", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-gray-900">Active Sessions</h1>
        <p className="mt-3 text-lg text-gray-600">
          Join an ongoing mock interview or wait for someone to join yours.
        </p>
      </div>

      {loading ? (
        <div className="text-center py-20">
          <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading sessions...</p>
        </div>
      ) : activeSessions.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-2xl">
          <p className="text-2xl text-gray-600">No active sessions right now</p>
          <p className="mt-4 text-gray-500">
            Create one from the Dashboard to get started!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {activeSessions.map((session) => (
            <SessionCard
              key={session._id}
              session={session}
              onJoin={fetchActiveSessions}
            />
          ))}
        </div>
      )}
    </div>
  );
}
