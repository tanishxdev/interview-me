import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  StreamVideo,
  StreamVideoClient,
  StreamCall,
  SpeakerLayout,
  CallControls,
  StreamTheme,
} from "@stream-io/video-react-sdk";
import {
  Chat,
  Channel,
  ChannelHeader,
  MessageList,
  MessageInput,
  Thread,
  Window,
} from "stream-chat-react";
import { StreamChat } from "stream-chat";
import "@stream-io/video-react-sdk/dist/css/styles.css";
import "stream-chat-react/dist/css/v2/index.css";

import useStreamToken from "../../hooks/useStreamToken.js";
import api from "../../services/api.js";

const API_KEY = import.meta.env.VITE_STREAM_API_KEY;

export default function SessionRoom() {
  const { id: callId } = useParams();
  const navigate = useNavigate();

  const { tokenData, loading: tokenLoading } = useStreamToken();
  const [videoClient, setVideoClient] = useState(null);
  const [chatClient, setChatClient] = useState(null);
  const [call, setCall] = useState(null);

  useEffect(() => {
    if (!tokenData || !API_KEY) return;

    // === VIDEO CLIENT ===
    const vClient = new StreamVideoClient({
      apiKey: API_KEY,
      user: {
        id: tokenData.userId,
        name: tokenData.userName,
        image: tokenData.userImage,
      },
      token: tokenData.token,
    });

    const vCall = vClient.call("default", callId);
    vCall.join({ create: true }).catch(console.error);

    setVideoClient(vClient);
    setCall(vCall);

    // === CHAT CLIENT ===
    const cClient = StreamChat.getInstance(API_KEY);
    cClient
      .connectUser(
        {
          id: tokenData.userId,
          name: tokenData.userName,
          image: tokenData.userImage,
        },
        tokenData.token
      )
      .then(() => {
        setChatClient(cClient);
      });

    // Cleanup
    return () => {
      vCall?.leave();
      vClient?.disconnectUser();
      cClient?.disconnectUser();
    };
  }, [tokenData, callId]);

  const handleEndSession = async () => {
    try {
      await api.post(`/sessions/${callId}/end`);
      navigate("/dashboard");
    } catch (err) {
      alert("Failed to end session");
    }
  };

  if (tokenLoading)
    return (
      <div className="flex min-h-screen items-center justify-center text-xl">
        Loading room...
      </div>
    );
  if (!tokenData)
    return (
      <div className="text-red-600 text-center py-20">
        Failed to authenticate with Stream
      </div>
    );
  if (!videoClient || !chatClient || !call)
    return (
      <div className="flex min-h-screen items-center justify-center">
        Connecting...
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col lg:flex-row">
      {/* VIDEO SECTION */}
      <div className="flex-1">
        <StreamVideo client={videoClient}>
          <StreamCall call={call}>
            <StreamTheme className="p-4">
              <SpeakerLayout participantsBarPosition="bottom" />
              <div className="mt-6 flex justify-center gap-4">
                <CallControls />
              </div>
            </StreamTheme>
          </StreamCall>
        </StreamVideo>

        <div className="p-6 text-center">
          <button
            onClick={handleEndSession}
            className="px-8 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition shadow-lg"
          >
            End Session (Host Only)
          </button>
        </div>
      </div>

      {/* CHAT SECTION */}
      <div className="w-full lg:w-96 border-t lg:border-t-0 lg:border-l border-gray-300 bg-white flex flex-col h-screen lg:h-auto">
        <Chat client={chatClient} theme="messaging light">
          <Channel
            channel={chatClient.channel("messaging", callId, {
              name: "Interview Chat",
            })}
          >
            <Window>
              <ChannelHeader title="Session Chat" />
              <MessageList />
              <MessageInput placeholder="Type a message..." />
            </Window>
            <Thread />
          </Channel>
        </Chat>
      </div>
    </div>
  );
}
