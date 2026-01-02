/**
 * Dashboard Page
 * Main dashboard with session overview and quick actions
 */


import { useUser } from '@clerk/clerk-react';
import { CalendarIcon, ClockIcon, PlusIcon } from '@heroicons/react/24/outline';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Button from '../components/common/Button';
import Loader from '../components/common/Loader';
import Footer from '../components/layout/Footer';
import TopNav from '../components/layout/TopNav';
import CreateSessionModal from '../components/modals/CreateSessionModal';
import SessionCard from "../components/Sessions.jsx";

import { getActiveSessions, getMyRecentSessions } from '../services/session.service';
import useSessionStore from '../store/session.store';
import useUIStore from '../store/ui.store';
import { ROUTES } from '../utils/constants';



const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const { openCreateSessionModal } = useUIStore();
  const {
    activeSessions,
    recentSessions,
    setActiveSessions,
    setRecentSessions,
    isLoadingSessions,
    setLoadingSessions,
  } = useSessionStore();

  const [stats, setStats] = useState({
    totalSessions: 0,
    activeSessions: 0,
    completedSessions: 0,
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoadingSessions(true);

      // Fetch both active and recent sessions in parallel
      const [activeData, recentData] = await Promise.all([
        getActiveSessions(),
        getMyRecentSessions(),
      ]);

      setActiveSessions(activeData.sessions || []);
      setRecentSessions(recentData.sessions || []);

      // Calculate stats
      setStats({
        totalSessions: (activeData.sessions?.length || 0) + (recentData.sessions?.length || 0),
        activeSessions: activeData.sessions?.length || 0,
        completedSessions: recentData.sessions?.length || 0,
      });
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoadingSessions(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 dark:bg-slate-900">
      <TopNav />

      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
              Welcome back, {user?.firstName || 'there'}! 👋
            </h1>
            <p className="mt-2 text-slate-600 dark:text-slate-400">
              Here's what's happening with your interview practice sessions.
            </p>
          </div>

          {/* Stats Cards */}
          <div className="mb-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                    Total Sessions
                  </p>
                  <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-slate-100">
                    {stats.totalSessions}
                  </p>
                </div>
                <div className="rounded-lg bg-blue-100 p-3 dark:bg-blue-900/30">
                  <CalendarIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                    Active Now
                  </p>
                  <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-slate-100">
                    {stats.activeSessions}
                  </p>
                </div>
                <div className="rounded-lg bg-green-100 p-3 dark:bg-green-900/30">
                  <ClockIcon className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                    Completed
                  </p>
                  <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-slate-100">
                    {stats.completedSessions}
                  </p>
                </div>
                <div className="rounded-lg bg-purple-100 p-3 dark:bg-purple-900/30">
                  <CalendarIcon className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mb-8 flex flex-wrap gap-4">
            <Button
              variant="primary"
              size="md"
              onClick={openCreateSessionModal}
            >
              <PlusIcon className="mr-2 h-5 w-5" />
              Create New Session
            </Button>
            <Button
              variant="outline"
              size="md"
              onClick={() => navigate(ROUTES.SESSIONS)}
            >
              Browse All Sessions
            </Button>
          </div>

          {/* Loading State */}
          {isLoadingSessions ? (
            <div className="flex justify-center py-12">
              <Loader size="lg" message="Loading sessions..." />
            </div>
          ) : (
            <>
              {/* Active Sessions */}
              <section className="mb-12">
                <h2 className="mb-4 text-2xl font-bold text-slate-900 dark:text-slate-100">
                  Active Sessions
                </h2>
                {activeSessions.length > 0 ? (
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {activeSessions.slice(0, 3).map((session) => (
                      <SessionCard key={session._id} session={session} />
                    ))}
                  </div>
                ) : (
                  <div className="rounded-xl border border-slate-200 bg-white p-12 text-center dark:border-slate-700 dark:bg-slate-800">
                    <p className="text-slate-600 dark:text-slate-400">
                      No active sessions right now. Create one to get started!
                    </p>
                  </div>
                )}
              </section>

              {/* Recent Sessions */}
              <section>
                <h2 className="mb-4 text-2xl font-bold text-slate-900 dark:text-slate-100">
                  Recent Activity
                </h2>
                {recentSessions.length > 0 ? (
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {recentSessions.slice(0, 3).map((session) => (
                      <SessionCard key={session._id} session={session} />
                    ))}
                  </div>
                ) : (
                  <div className="rounded-xl border border-slate-200 bg-white p-12 text-center dark:border-slate-700 dark:bg-slate-800">
                    <p className="text-slate-600 dark:text-slate-400">
                      No recent sessions yet.
                    </p>
                  </div>
                )}
              </section>
            </>
          )}
        </div>
      </main>

      <Footer />
      <CreateSessionModal />
    </div>
  );
};

export default Dashboard;