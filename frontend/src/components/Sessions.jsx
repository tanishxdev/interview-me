/**
 * Sessions Page
 * Browse and filter all active interview sessions
 */

import { useEffect, useState } from "react";
import { PlusIcon, FunnelIcon } from "@heroicons/react/24/outline";

import TopNav from "../components/layout/TopNav";
import Footer from "../components/layout/Footer";
import Button from "../components/common/Button";
import Loader from "../components/common/Loader";
import CreateSessionModal from "../components/modals/CreateSessionModal";

// ✅ this file EXISTS
import SessionCard from "../components/Sessions.jsx";

import useUIStore from "../store/ui.store";
import useSessionStore from "../store/session.store";
import {
  getActiveSessions,
  joinSession as joinSessionAPI,
} from "../services/session.service";
import { DIFFICULTY_LEVELS } from "../utils/constants";


const Sessions = () => {
  const { openCreateSessionModal, showNotification } = useUIStore();
  const {
    activeSessions,
    setActiveSessions,
    isLoadingSessions,
    setLoadingSessions,
    updateSession,
  } = useSessionStore();

  const [filter, setFilter] = useState('all'); // 'all' | 'easy' | 'medium' | 'hard'
  const [joiningSessionId, setJoiningSessionId] = useState(null);

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      setLoadingSessions(true);
      const data = await getActiveSessions();
      setActiveSessions(data.sessions || []);
    } catch (error) {
      showNotification('error', 'Failed to load sessions');
    } finally {
      setLoadingSessions(false);
    }
  };

  const handleJoinSession = async (sessionId) => {
    try {
      setJoiningSessionId(sessionId);
      
      const updatedSession = await joinSessionAPI(sessionId);
      
      updateSession(sessionId, updatedSession);
      showNotification('success', 'Successfully joined session!');
      
      // Navigate handled by SessionCard component
    } catch (error) {
      showNotification('error', error.message || 'Failed to join session');
    } finally {
      setJoiningSessionId(null);
    }
  };

  const filteredSessions = filter === 'all'
    ? activeSessions
    : activeSessions.filter((session) => session.difficulty === filter);

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 dark:bg-slate-900">
      <TopNav />

      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
              Active Interview Sessions
            </h1>
            <p className="mt-2 text-slate-600 dark:text-slate-400">
              Browse and join ongoing interview practice sessions
            </p>
          </div>

          {/* Actions Bar */}
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            {/* Filter Buttons */}
            <div className="flex flex-wrap gap-2">
              <Button
                variant={filter === 'all' ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => setFilter('all')}
              >
                All
              </Button>
              <Button
                variant={filter === DIFFICULTY_LEVELS.EASY ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => setFilter(DIFFICULTY_LEVELS.EASY)}
              >
                Easy
              </Button>
              <Button
                variant={filter === DIFFICULTY_LEVELS.MEDIUM ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => setFilter(DIFFICULTY_LEVELS.MEDIUM)}
              >
                Medium
              </Button>
              <Button
                variant={filter === DIFFICULTY_LEVELS.HARD ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => setFilter(DIFFICULTY_LEVELS.HARD)}
              >
                Hard
              </Button>
            </div>

            {/* Create Button */}
            <Button
              variant="primary"
              size="sm"
              onClick={openCreateSessionModal}
            >
              <PlusIcon className="mr-2 h-5 w-5" />
              Create Session
            </Button>
          </div>

          {/* Results Info */}
          <div className="mb-4 flex items-center text-sm text-slate-600 dark:text-slate-400">
            <FunnelIcon className="mr-2 h-4 w-4" />
            <span>
              Showing {filteredSessions.length} {filter !== 'all' ? filter : ''} session(s)
            </span>
          </div>

          {/* Loading State */}
          {isLoadingSessions ? (
            <div className="flex justify-center py-12">
              <Loader size="lg" message="Loading sessions..." />
            </div>
          ) : (
            <>
              {/* Sessions Grid */}
              {filteredSessions.length > 0 ? (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {filteredSessions.map((session) => (
                    <SessionCard
                      key={session._id}
                      session={session}
                      onJoin={handleJoinSession}
                      isJoining={joiningSessionId === session._id}
                    />
                  ))}
                </div>
              ) : (
                <div className="rounded-xl border border-slate-200 bg-white p-12 text-center dark:border-slate-700 dark:bg-slate-800">
                  <p className="text-lg text-slate-600 dark:text-slate-400">
                    {filter === 'all'
                      ? 'No active sessions at the moment.'
                      : `No ${filter} sessions available.`}
                  </p>
                  <Button
                    variant="primary"
                    size="md"
                    onClick={openCreateSessionModal}
                    className="mt-6"
                  >
                    Create Your Own Session
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      <Footer />
      <CreateSessionModal />
    </div>
  );
};

export default Sessions;