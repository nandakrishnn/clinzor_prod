'use client';

import React, { useState, useEffect } from 'react';
import { 
  Mic, MicOff, Video, VideoOff, Phone, PhoneOff, MessageSquare, 
  Users, Settings, Monitor, Share, MoreVertical, X, Send, Maximize2, Minimize2
} from 'lucide-react';

interface VideoCallCardProps {
  videoCallUrl: string;
  title?: string;
  subtitle?: string;
  onClose?: () => void;
  isFullScreen?: boolean;
  onToggleFullScreen?: () => void;
  className?: string;
}

const VideoCallCard: React.FC<VideoCallCardProps> = ({
  videoCallUrl,
  title = "Video Call",
  subtitle = "Live consultation",
  onClose,
  isFullScreen = false,
  onToggleFullScreen,
  className = ""
}) => {
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [showParticipants, setShowParticipants] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { id: 1, sender: 'Patient', message: 'Hello doctor, can you hear me?', time: '10:30 AM' },
    { id: 2, sender: 'Expert', message: 'Yes, I can hear you clearly. How are you feeling today?', time: '10:31 AM' },
    { id: 3, sender: 'Patient', message: 'I have been experiencing some symptoms...', time: '10:32 AM' }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [participants] = useState([
    { id: 1, name: 'Dr. Sarah Johnson', role: 'Expert', isSpeaking: true, isVideoOn: true },
    { id: 2, name: 'John Smith', role: 'Patient', isSpeaking: false, isVideoOn: true }
  ]);

  // Fix hydration by ensuring component only renders on client
  useEffect(() => {
    setIsClient(true);
  }, []);

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const message = {
      id: Date.now(),
      sender: 'You',
      message: newMessage,
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    };
    setChatMessages(prev => [...prev, message]);
    setNewMessage('');
  };

  const handleEndCall = () => {
    if (onClose) {
      onClose();
    } else {
      window.close();
    }
  };

  // Don't render until client-side
  if (!isClient) {
    return (
      <div className={`bg-white rounded-2xl shadow-xl border border-gray-200 ${className}`}>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
            <p className="text-gray-600 text-sm">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  // If it's a real video call URL (not mock), show iframe
  if (videoCallUrl.startsWith('http') && !videoCallUrl.includes('mock-videocall')) {
    return (
      <div className={`bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden ${className}`}>
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-red-500 w-2 h-2 rounded-full animate-pulse"></div>
            <div>
              <h3 className="text-white font-semibold">{title}</h3>
              <p className="text-blue-100 text-sm">{subtitle}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {onToggleFullScreen && (
              <button
                onClick={onToggleFullScreen}
                className="p-2 text-white hover:bg-white hover:bg-opacity-10 rounded-lg transition-colors"
                title={isFullScreen ? "Exit fullscreen" : "Fullscreen"}
              >
                {isFullScreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
              </button>
            )}
            {onClose && (
              <button
                onClick={onClose}
                className="p-2 text-white hover:bg-white hover:bg-opacity-10 rounded-lg transition-colors"
                title="Close"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>
        
        {/* Video Call iframe */}
        <div className="relative">
          <iframe
            src={videoCallUrl}
            className="w-full h-96 border-0"
            allow="camera; microphone; fullscreen; speaker; display-capture"
            allowFullScreen
          />
        </div>

        {/* Controls */}
        <div className="bg-gray-50 p-4 border-t border-gray-200">
          <div className="flex items-center justify-center space-x-3">
            <button
              onClick={() => setIsMuted(!isMuted)}
              className={`p-3 rounded-full transition-colors ${
                isMuted ? 'bg-red-600 text-white' : 'bg-gray-700 text-white hover:bg-gray-600'
              }`}
              title={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? <MicOff size={18} /> : <Mic size={18} />}
            </button>

            <button
              onClick={() => setIsVideoOff(!isVideoOff)}
              className={`p-3 rounded-full transition-colors ${
                isVideoOff ? 'bg-red-600 text-white' : 'bg-gray-700 text-white hover:bg-gray-600'
              }`}
              title={isVideoOff ? 'Turn on video' : 'Turn off video'}
            >
              {isVideoOff ? <VideoOff size={18} /> : <Video size={18} />}
            </button>

            <button
              onClick={() => setIsScreenSharing(!isScreenSharing)}
              className={`p-3 rounded-full transition-colors ${
                isScreenSharing ? 'bg-blue-600 text-white' : 'bg-gray-700 text-white hover:bg-gray-600'
              }`}
              title={isScreenSharing ? 'Stop sharing' : 'Share screen'}
            >
              <Monitor size={18} />
            </button>

            <button
              onClick={() => setShowChat(!showChat)}
              className={`p-3 rounded-full transition-colors ${
                showChat ? 'bg-blue-600 text-white' : 'bg-gray-700 text-white hover:bg-gray-600'
              }`}
              title="Chat"
            >
              <MessageSquare size={18} />
            </button>

            <button
              onClick={handleEndCall}
              className="p-3 rounded-full bg-red-600 text-white hover:bg-red-700 transition-colors"
              title="End call"
            >
              <PhoneOff size={18} />
            </button>
          </div>
        </div>

        {/* Chat Panel */}
        {showChat && (
          <div className="border-t border-gray-200 h-64 flex flex-col">
            <div className="p-3 border-b border-gray-200 flex items-center justify-between bg-gray-50">
              <h4 className="font-semibold text-gray-900 text-sm">Chat</h4>
              <button
                onClick={() => setShowChat(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={16} />
              </button>
            </div>
            <div className="flex-1 p-3 overflow-y-auto space-y-2">
              {chatMessages.map((msg) => (
                <div key={msg.id} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-gray-700">{msg.sender}</span>
                    <span className="text-xs text-gray-500">{msg.time}</span>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-2 text-xs text-gray-900">
                    {msg.message}
                  </div>
                </div>
              ))}
            </div>
            <form onSubmit={sendMessage} className="p-3 border-t border-gray-200">
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
                <button
                  type="submit"
                  disabled={!newMessage.trim()}
                  className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
                >
                  <Send size={14} />
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    );
  }

  // Mock video call interface (for testing)
  return (
    <div className={`bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden ${className}`}>
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="bg-red-500 w-2 h-2 rounded-full animate-pulse"></div>
          <div>
            <h3 className="text-white font-semibold">{title}</h3>
            <p className="text-blue-100 text-sm">{subtitle}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {onToggleFullScreen && (
            <button
              onClick={onToggleFullScreen}
              className="p-2 text-white hover:bg-white hover:bg-opacity-10 rounded-lg transition-colors"
              title={isFullScreen ? "Exit fullscreen" : "Fullscreen"}
            >
              {isFullScreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
            </button>
          )}
          {onClose && (
            <button
              onClick={onClose}
              className="p-2 text-white hover:bg-white hover:bg-opacity-10 rounded-lg transition-colors"
              title="Close"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Mock Video Area */}
      <div className="relative h-96 bg-gradient-to-br from-blue-900 to-purple-900">
        {/* Main Video (Patient) */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white">
            <div className="w-24 h-24 bg-gray-700 rounded-full mx-auto mb-3 flex items-center justify-center">
              <span className="text-xl">👤</span>
            </div>
            <h4 className="text-lg font-semibold">John Smith</h4>
            <p className="text-gray-300 text-sm">Patient</p>
            {participants[1].isSpeaking && (
              <div className="mt-2 flex items-center justify-center space-x-1">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs text-green-400">Speaking</span>
              </div>
            )}
          </div>
        </div>

        {/* Expert Video (Small) */}
        <div className="absolute top-3 right-3 w-32 h-24 bg-gray-800 rounded-lg border-2 border-white overflow-hidden">
          <div className="w-full h-full bg-gradient-to-br from-green-800 to-blue-800 flex items-center justify-center">
            <div className="text-center text-white">
              <div className="w-12 h-12 bg-gray-600 rounded-full mx-auto mb-1 flex items-center justify-center">
                <span className="text-sm">👩‍⚕️</span>
              </div>
              <h5 className="text-xs font-medium">Dr. Sarah Johnson</h5>
              <p className="text-xs text-gray-300">Expert</p>
            </div>
          </div>
        </div>

        {/* Connection Status */}
        <div className="absolute top-3 left-3 bg-black bg-opacity-50 text-white px-2 py-1 rounded-full text-xs">
          <div className="flex items-center space-x-1">
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
            <span>Connected</span>
          </div>
        </div>

        {/* Recording Indicator */}
        <div className="absolute top-3 left-1/2 transform -translate-x-1/2 bg-red-600 text-white px-2 py-1 rounded-full text-xs flex items-center space-x-1">
          <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
          <span>REC</span>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-gray-50 p-4 border-t border-gray-200">
        <div className="flex items-center justify-center space-x-3">
          <button
            onClick={() => setIsMuted(!isMuted)}
            className={`p-3 rounded-full transition-colors ${
              isMuted ? 'bg-red-600 text-white' : 'bg-gray-700 text-white hover:bg-gray-600'
            }`}
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? <MicOff size={18} /> : <Mic size={18} />}
          </button>

          <button
            onClick={() => setIsVideoOff(!isVideoOff)}
            className={`p-3 rounded-full transition-colors ${
              isVideoOff ? 'bg-red-600 text-white' : 'bg-gray-700 text-white hover:bg-gray-600'
            }`}
            title={isVideoOff ? 'Turn on video' : 'Turn off video'}
          >
            {isVideoOff ? <VideoOff size={18} /> : <Video size={18} />}
          </button>

          <button
            onClick={() => setIsScreenSharing(!isScreenSharing)}
            className={`p-3 rounded-full transition-colors ${
              isScreenSharing ? 'bg-blue-600 text-white' : 'bg-gray-700 text-white hover:bg-gray-600'
            }`}
            title={isScreenSharing ? 'Stop sharing' : 'Share screen'}
          >
            <Monitor size={18} />
          </button>

          <button
            onClick={() => setShowChat(!showChat)}
            className={`p-3 rounded-full transition-colors ${
              showChat ? 'bg-blue-600 text-white' : 'bg-gray-700 text-white hover:bg-gray-600'
            }`}
            title="Chat"
          >
            <MessageSquare size={18} />
          </button>

          <button
            onClick={handleEndCall}
            className="p-3 rounded-full bg-red-600 text-white hover:bg-red-700 transition-colors"
            title="End call"
          >
            <PhoneOff size={18} />
          </button>
        </div>
      </div>

      {/* Chat Panel */}
      {showChat && (
        <div className="border-t border-gray-200 h-64 flex flex-col">
          <div className="p-3 border-b border-gray-200 flex items-center justify-between bg-gray-50">
            <h4 className="font-semibold text-gray-900 text-sm">Chat</h4>
            <button
              onClick={() => setShowChat(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <X size={16} />
            </button>
          </div>
          <div className="flex-1 p-3 overflow-y-auto space-y-2">
            {chatMessages.map((msg) => (
              <div key={msg.id} className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-gray-700">{msg.sender}</span>
                  <span className="text-xs text-gray-500">{msg.time}</span>
                </div>
                <div className="bg-gray-50 rounded-lg p-2 text-xs text-gray-900">
                  {msg.message}
                </div>
              </div>
            ))}
          </div>
          <form onSubmit={sendMessage} className="p-3 border-t border-gray-200">
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
              <button
                type="submit"
                disabled={!newMessage.trim()}
                className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
              >
                <Send size={14} />
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default VideoCallCard; 