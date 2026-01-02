/**
 * Session Room Page
 * Live video interview session with Stream Video SDK
 */

import { useUser } from '@clerk/clerk-react';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import {
  CallControls,
  CallParticipantsList,
  SpeakerLayout,
  StreamCall,
  StreamVideo,
  StreamVideoClient,
} from '@stream-io/video-react-sdk';
import '@stream-io/video-react-sdk/dist/css/styles.css';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ROUTES, STREAM_API_KEY } from '../utils/constants';
import { default as Button, default as TopNav } from '../components/common/Button';
import Loader from '../components/common/Loader';
import useStreamToken from '../hooks/useStreamToken';
import { endSession, getSessionById } from '../services/session.service';
import useSessionStore from '../store/session.store';
import useUIStore from '../store/ui.store';



const SessionRoom = () => {
  const { id: sessionId } = useParams();
  const navigate = useNavigate();
  const { user } = useUser();
  const { streamToken, isLoading: isLoadingToken } = useStreamToken();
  const { currentSession, setCurrentSession, clearCurrentSession } = useSessionStore();
  const { showNotification } = useUIStore();

  const [client, setClient] = useState(null);
  const [call, setCall] = useState(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [isEndingSession, setIsEndingSession] = useState(false);

  // Fetch session data
  useEffect(() => {
    const fetchSession = async () => {
      try {
        const sessionData = await getSessionById(sessionId);
        setCurrentSession(sessionData);
      } catch (error) {
        showNotification('error', 'Failed to load session');
        navigate(ROUTES.DASHBOARD);
      }
    };

    fetchSession();

    return () => {
      clearCurrentSession();
    };
  }, [sessionId]);

  // Initialize Stream Video Client and Call
  useEffect(() => {
    if (!streamToken || !user || !sessionId) return;

    const initializeStream = async () => {
      try {
        setIsInitializing(true);

        // Create Stream Video Client
        const videoClient = new StreamVideoClient({
          apiKey: STREAM_API_KEY,
          user: {
            id: streamToken.userId,
            name: streamToken.userName,
            image: streamToken.userImage,
          },
          token: streamToken.token,
        });

        setClient(videoClient);

        // Create or join call
        const videoCall = videoClient.call('default', sessionId);
        
        await videoCall.join({ create: true });
        
        setCall(videoCall);
      } catch (error) {
        console.error('Failed to initialize Stream:', error);
        showNotification('error', 'Failed to join video session');
      } finally {
        setIsInitializing(false);
      }
    };

    initializeStream();

    // Cleanup on unmount
    return () => {
      if (call) {
        call.leave().catch(console.error);
      }
      if (client) {
        client.disconnectUser().catch(console.error);
      }
    };
  }, [streamToken, user, sessionId]);

  // Handle ending session
  const handleEndSession = async () => {
    if (!currentSession) return;

    // Check if user is the host
    const isHost = currentSession.host?.clerkId === user?.id;
    
    if (!isHost) {
      showNotification('error', 'Only the host can end this session');
      return;
    }

    try {
      setIsEndingSession(true);
      
      await endSession(sessionId);
      
      showNotification('success', 'Session ended successfully');
      
      // Leave call
      if (call) {
        await call.leave();
      }
      
      navigate(ROUTES.DASHBOARD);
    } catch (error) {
      showNotification('error', 'Failed to end session');
    } finally {
      setIsEndingSession(false);
    }
  };

  const handleLeaveSession = async () => {
    try {
      if (call) {
        await call.leave();
      }
      navigate(ROUTES.DASHBOARD);
    } catch (error) {
      console.error('Failed to leave session:', error);
      navigate(ROUTES.DASHBOARD);
    }
  };

  // Loading states
  if (isLoadingToken || isInitializing || !currentSession) {
    return (
      <div className="flex min-h-screen flex-col bg-slate-900">
        <TopNav />
        <div className="flex flex-1 items-center justify-center">
          <Loader size="xl" message="Joining session..." />
        </div>
      </div>
    );
  }

  // Error state - no client or call
  if (!client || !call) {
    return (
      <div className="flex min-h-screen flex-col bg-slate-900">
        <TopNav />
        <div className="flex flex-1 items-center justify-center">
          <div className="text-center">
            <p className="text-lg text-slate-300">Failed to join video session</p>
            <Button
              variant="primary"
              size="md"
              onClick={() => navigate(ROUTES.DASHBOARD)}
              className="mt-4"
            >
              Return to Dashboard
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const isHost = currentSession.host?.clerkId === user?.id;

  return (
    <StreamVideo client={client}>
      <StreamCall call={call}>
        <div className="flex min-h-screen flex-col bg-slate-900">
          {/* Header */}
          <div className="border-b border-slate-700 bg-slate-800 px-4 py-3">
            <div className="mx-auto flex max-w-7xl items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLeaveSession}
                >
                  <ArrowLeftIcon className="mr-2 h-4 w-4" />
                  Leave
                </Button>
                <div>
                  <h1 className="text-lg font-semibold text-slate-100">
                    {currentSession.problem}
                  </h1>
                  <p className="text-sm text-slate-400">
                    {currentSession.difficulty} • {currentSession.participants?.length || 0} / 2 participants
                  </p>
                </div>
              </div>
              {isHost && (
                <Button
                  variant="danger"
                  size="sm"
                  onClick={handleEndSession}
                  loading={isEndingSession}
                >
                  End Session
                </Button>
              )}
            </div>
          </div>

          {/* Video Layout */}
          <div className="flex flex-1 overflow-hidden">
            {/* Main Video Area */}
            <div className="flex-1 p-4">
              <SpeakerLayout />
            </div>

            {/* Sidebar - Participants */}
            <div className="w-80 border-l border-slate-700 bg-slate-800 p-4">
              <h3 className="mb-4 text-sm font-semibold uppercase text-slate-400">
                Participants
              </h3>
              <CallParticipantsList onClose={() => {}} />
            </div>
          </div>

          {/* Call Controls */}
          <div className="border-t border-slate-700 bg-slate-800 py-4">
            <CallControls />
          </div>
        </div>
      </StreamCall>
    </StreamVideo>
  );
};

export default SessionRoom;