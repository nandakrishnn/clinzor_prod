"use client";

import React, { useState, useEffect } from 'react';
import { ArrowLeft, Phone, PhoneOff, MessageSquare, Monitor, Settings, Users } from 'lucide-react';

interface VideoCallPageProps {
  params: {
    roomId: string;
  };
}

const VideoCallPage: React.FC<VideoCallPageProps> = ({ params }) => {
  const [videoCallUrl, setVideoCallUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [isCallActive, setIsCallActive] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [showParticipants, setShowParticipants] = useState(false);
  const [isClient, setIsClient] = useState(false);

  // Extract room ID from the URL parameter
  const extractRoomId = (roomIdParam: string): string => {
    // If it's a full path like "/expert/videocall/room_123", extract just "room_123"
    if (roomIdParam.includes('/')) {
      const parts = roomIdParam.split('/');
      return parts[parts.length - 1]; // Get the last part
    }
    // If it's already just a room ID, return as is
    return roomIdParam;
  };

  // Fix hydration by ensuring component only renders on client
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient) {
      const fetchVideoCallUrl = async () => {
        try {
          setIsLoading(true);
          setError('');
          
          const actualRoomId = extractRoomId(params.roomId);
          
          // Fetch the video call URL from backend
          const response = await fetch(`/api/expert/videocall/url?roomId=${actualRoomId}&userName=Expert`);
          
          if (!response.ok) {
            throw new Error('Failed to get video call URL');
          }
          
          const data = await response.json();
          setVideoCallUrl(data.videoCallUrl);
          setIsCallActive(true);
        } catch (err) {
          console.error('Error fetching video call URL:', err);
          setError('Failed to load video call. Please try again.');
        } finally {
          setIsLoading(false);
        }
      };

      fetchVideoCallUrl();
    }
  }, [params.roomId, isClient]);

  const handleEndCall = () => {
    setIsCallActive(false);
    // You can add any cleanup logic here
    window.close(); // Close the tab/window
  };

  // Don't render until client-side
  if (!isClient) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading video call...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-600 rounded-full p-4 mx-auto mb-4 w-16 h-16 flex items-center justify-center">
            <PhoneOff className="text-white" size={24} />
          </div>
          <h2 className="text-white text-xl font-semibold mb-2">Connection Failed</h2>
          <p className="text-gray-300 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 relative">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-10 bg-black bg-opacity-50 backdrop-blur-sm">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => window.history.back()}
              className="text-white hover:text-gray-300 transition-colors"
            >
              <ArrowLeft size={24} />
            </button>
            <div>
              <h1 className="text-white font-semibold">Video Call</h1>
              <p className="text-gray-300 text-sm">Room: {extractRoomId(params.roomId)}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowParticipants(!showParticipants)}
              className="p-2 text-white hover:bg-white hover:bg-opacity-10 rounded-lg transition-colors"
              title="Participants"
            >
              <Users size={20} />
            </button>
            <button
              onClick={() => setShowChat(!showChat)}
              className="p-2 text-white hover:bg-white hover:bg-opacity-10 rounded-lg transition-colors"
              title="Chat"
            >
              <MessageSquare size={20} />
            </button>
            <button
              className="p-2 text-white hover:bg-white hover:bg-opacity-10 rounded-lg transition-colors"
              title="Settings"
            >
              <Settings size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Main Video Call Area */}
      <div className="pt-20 h-screen">
        {videoCallUrl ? (
          <iframe
            src={videoCallUrl}
            className="w-full h-full border-0"
            allow="camera; microphone; fullscreen; speaker; display-capture"
            allowFullScreen
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
              <p className="text-white text-lg">Connecting to video call...</p>
            </div>
          </div>
        )}
      </div>

      {/* Call Controls */}
      <div className="absolute bottom-0 left-0 right-0 z-10 bg-black bg-opacity-50 backdrop-blur-sm">
        <div className="flex items-center justify-center p-6 space-x-4">
          <button
            onClick={handleEndCall}
            className="bg-red-600 text-white p-4 rounded-full hover:bg-red-700 transition-colors"
            title="End Call"
          >
            <PhoneOff size={24} />
          </button>
        </div>
      </div>

      {/* Chat Panel */}
      {showChat && (
        <div className="fixed right-4 top-20 bottom-20 w-80 bg-white rounded-lg shadow-xl z-20 flex flex-col">
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            <h3 className="font-semibold text-gray-900">Chat</h3>
            <button
              onClick={() => setShowChat(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              ×
            </button>
          </div>
          <div className="flex-1 p-4 overflow-y-auto">
            <p className="text-gray-500 text-center text-sm">Chat functionality will be handled by the video call provider</p>
          </div>
        </div>
      )}

      {/* Participants Panel */}
      {showParticipants && (
        <div className="fixed right-4 top-20 bottom-20 w-80 bg-white rounded-lg shadow-xl z-20 flex flex-col">
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            <h3 className="font-semibold text-gray-900">Participants</h3>
            <button
              onClick={() => setShowParticipants(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              ×
            </button>
          </div>
          <div className="flex-1 p-4 overflow-y-auto">
            <p className="text-gray-500 text-center text-sm">Participant list will be handled by the video call provider</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoCallPage; 