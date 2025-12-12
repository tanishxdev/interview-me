import { useUser } from "@clerk/clerk-react";
import { useState, useEffect } from "react";
import { Plus, Users, Clock, Star, PlayCircle } from "lucide-react";
import CreateSessionModal from "../components/modals/CreateSessionModal.jsx";
import SessionCard from "../components/SessionCard.jsx";
import api from "../services/api.js";

export default function Dashboard() {
  const { user } = useUser();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [activeSessions, setActiveSessions] = useState([]);
  const [recentSessions, setRecentSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      const [activeRes, recentRes] = await Promise.all([
        api.get("/sessions/active"),
        api.get("/sessions/my-recent"),
      ]);
      setActiveSessions(activeRes.data.data.sessions || []);
      setRecentSessions(recentRes.data.data.sessions || []);
    } catch (err) {
      console.error("Failed to load sessions", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Hero Welcome */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900">
            Welcome back, {user?.firstName || "Interviewer"}!
          </h1>
          <p className="mt-3 text-lg text-gray-600">
            Ready to level up your interview skills today?
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <button
            onClick={() => setShowCreateModal(true)}
            className="group flex items-center justify-center space-x-4 bg-primary-600 hover:bg-primary-700 text-white rounded-2xl p-10 transition-all transform hover:scale-105 shadow-lg"
          >
            <Plus className="w-12 h-12" />
            <div className="text-left">
              <div className="text-2xl font-bold">Create Session</div>
              <div className="text-primary-100">Host a new mock interview</div>
            </div>
          </button>

          <div className="flex items-center justify-center space-x-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-2xl p-10 shadow-lg">
            <Users className="w-12 h-12" />
            <div className="text-left">
              <div className="text-2xl font-bold">Join Session</div>
              <div className="text-green-100">
                {activeSessions.length > 0
                  ? `${activeSessions.length} session${
                      activeSessions.length > 1 ? "s" : ""
                    } waiting`
                  : "No active sessions right now"}
              </div>
            </div>
          </div>
        </div>

        {/* Active Sessions */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              <PlayCircle className="w-8 h-8 text-green-600" />
              Active Sessions ({activeSessions.length})
            </h2>
          </div>

          {loading ? (
            <p>Loading sessions...</p>
          ) : activeSessions.length === 0 ? (
            <p className="text-gray-500 text-center py-12 bg-gray-50 rounded-xl">
              No active sessions right now. Create one or check back soon!
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeSessions.map((session) => (
                <SessionCard
                  key={session._id}
                  session={session}
                  onJoin={fetchSessions}
                />
              ))}
            </div>
          )}
        </section>

        {/* Recent Sessions */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <Clock className="w-8 h-8 text-primary-600" />
            Your Recent Sessions
          </h2>

          {recentSessions.length === 0 ? (
            <p className="text-gray-500">
              No past sessions yet. Time to start practicing!
            </p>
          ) : (
            <div className="space-y-4">
              {recentSessions.slice(0, 5).map((session) => (
                <div
                  key={session._id}
                  className="card flex items-center justify-between"
                >
                  <div>
                    <h3 className="font-semibold">{session.problem}</h3>
                    <p className="text-sm text-gray-600">
                      {new Date(session.createdAt).toLocaleDateString()} •{" "}
                      {session.duration
                        ? `${session.duration} mins`
                        : "Ongoing"}
                    </p>
                  </div>
                  {session.rating && (
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-5 h-5 ${
                            i < session.rating
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* Modal */}
      <CreateSessionModal
        isOpen={showCreateModal}
        onClose={() => {
          setShowCreateModal(false);
          fetchSessions();
        }}
      />
    </>
  );
}
