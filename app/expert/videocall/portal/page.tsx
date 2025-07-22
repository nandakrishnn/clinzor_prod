'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { 
  ArrowLeft, PhoneOff, Video, Calendar, Clock, Users, 
  ChevronLeft, ChevronRight, Play, Mic, MicOff, VideoOff,
  Phone, Settings, Maximize2, Minimize2
} from 'lucide-react';

interface VideoCall {
  id: string;
  roomId: string;
  title: string;
  participants: string[];
  startTime: string;
  endTime: string;
  status: 'upcoming' | 'active' | 'completed' | 'cancelled' | 'not conducted';
  bookingId?: string;
  userType: 'expert' | 'customer' | 'clinic';
  hmsRoomCode?: string;
  hmsToken?: string;
  hmsRoomUrl?: string;
  patient_name?: string;
  patient_mobile?: string;
  patient_email?: string;
  patient_address?: string;
}

interface LocalMediaVideoCallProps {
  userName: string;
  onLeave: () => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
}

// Real local media preview video call
const LocalMediaVideoCall: React.FC<LocalMediaVideoCallProps> = ({
  userName,
  onLeave,
  isFullscreen,
  onToggleFullscreen
}) => {
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const videoCallRef = useRef<HTMLDivElement>(null);

  // Get user media on mount
  useEffect(() => {
    let stream: MediaStream;
    (async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        setMediaStream(stream);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        setMediaStream(null);
      }
    })();
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // Attach stream to video element
  useEffect(() => {
    if (videoRef.current && mediaStream) {
      videoRef.current.srcObject = mediaStream;
    }
  }, [mediaStream]);

  // Fullscreen API logic
  useEffect(() => {
    if (isFullscreen && videoCallRef.current) {
      if (document.fullscreenElement !== videoCallRef.current) {
        videoCallRef.current.requestFullscreen?.();
      }
    } else if (!isFullscreen && document.fullscreenElement) {
      if (document.fullscreenElement === videoCallRef.current) {
        document.exitFullscreen?.();
      }
    }
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement && isFullscreen) {
        onToggleFullscreen();
      }
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, [isFullscreen, onToggleFullscreen]);

  // Toggle video track
  const toggleVideo = () => {
    if (mediaStream) {
      mediaStream.getVideoTracks().forEach(track => {
        track.enabled = !isVideoEnabled;
      });
    }
    setIsVideoEnabled(v => !v);
  };

  // Toggle audio track
  const toggleAudio = () => {
    if (mediaStream) {
      mediaStream.getAudioTracks().forEach(track => {
        track.enabled = !isAudioEnabled;
      });
    }
    setIsAudioEnabled(a => !a);
  };

  return (
    <div
      ref={videoCallRef}
      className={`relative bg-gray-900 rounded-2xl overflow-hidden ${isFullscreen ? 'fixed inset-4 z-50' : 'w-full h-full'}`}
      style={isFullscreen ? { width: 'auto', height: 'auto' } : {}}
    >
      {/* Video Preview */}
      <div className="relative w-full h-full flex items-center justify-center" style={{ minHeight: 400 }}>
        {mediaStream ? (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover rounded-2xl bg-black"
            style={{ minHeight: 400, maxHeight: isFullscreen ? '90vh' : 400 }}
          />
        ) : (
          <div className="flex flex-col items-center justify-center w-full h-full text-white">
            <VideoOff size={48} className="mb-4 text-white/60" />
            <p className="text-lg font-medium">Camera or mic not available</p>
          </div>
        )}
        {/* Controls */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2">
          <div className="bg-black/70 backdrop-blur-md rounded-2xl px-6 py-4 flex items-center space-x-4">
            <button
              onClick={toggleAudio}
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                isAudioEnabled 
                  ? 'bg-gray-600 hover:bg-gray-500 text-white' 
                  : 'bg-red-500 hover:bg-red-600 text-white'
              }`}
            >
              {isAudioEnabled ? <Mic size={20} /> : <MicOff size={20} />}
            </button>
            <button
              onClick={toggleVideo}
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                isVideoEnabled 
                  ? 'bg-gray-600 hover:bg-gray-500 text-white' 
                  : 'bg-red-500 hover:bg-red-600 text-white'
              }`}
            >
              {isVideoEnabled ? <Video size={20} /> : <VideoOff size={20} />}
            </button>
            <button
              onClick={onLeave}
              className="w-12 h-12 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center transition-all"
            >
              <Phone size={20} />
            </button>
            <button
              onClick={onToggleFullscreen}
              className="w-12 h-12 rounded-full bg-gray-600 hover:bg-gray-500 text-white flex items-center justify-center transition-all"
            >
              {isFullscreen ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
            </button>
          </div>
        </div>
      </div>
      {/* Fullscreen overlay close button */}
      {isFullscreen && (
        <button
          onClick={onToggleFullscreen}
          className="absolute top-4 right-4 w-10 h-10 bg-black/50 backdrop-blur-sm rounded-full text-white flex items-center justify-center hover:bg-black/70 transition-all z-10"
        >
          <Minimize2 size={18} />
        </button>
      )}
    </div>
  );
};

function VideoCallPortalContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [videoCalls, setVideoCalls] = useState<VideoCall[]>([]);
  const [selectedCall, setSelectedCall] = useState<VideoCall | null>(null);
  const [currentCarouselIndex, setCurrentCarouselIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  const [joinedCallId, setJoinedCallId] = useState<string | null>(null);
  const [isInCall, setIsInCall] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const [expandedPatientId, setExpandedPatientId] = useState<string | null>(null);

  const userType = searchParams.get('userType') || 'expert';
  const userName = searchParams.get('userName') || 'Expert User';

  // Sample data with 100ms integration
  const sampleVideoCalls: VideoCall[] = [
    {
      id: '1',
      roomId: 'room_123',
      title: 'Cardiology Consultation',
      participants: ['Dr. Sarah Johnson', 'John Smith'],
      startTime: '2024-03-20T10:00:00Z',
      endTime: '2024-03-20T10:30:00Z',
      status: 'active',
      bookingId: 'BK0001',
      userType: 'expert',
      hmsRoomCode: 'cardio-room-123',
      hmsToken: 'hms_token_123',
      hmsRoomUrl: 'https://100ms.live/meeting/room-123',
      patient_name: 'John Smith',
      patient_mobile: '1234567890',
      patient_email: 'john.smith@email.com',
      patient_address: '123 Main St, Springfield',
    },
    {
      id: '2',
      roomId: 'room_124',
      title: 'Dermatology Session',
      participants: ['Dr. Michael Brown', 'Emma Wilson'],
      startTime: '2024-03-20T11:00:00Z',
      endTime: '2024-03-20T11:30:00Z',
      status: 'upcoming',
      bookingId: 'BK0002',
      userType: 'expert',
      hmsRoomCode: 'derma-room-124',
      hmsToken: 'hms_token_124',
      hmsRoomUrl: 'https://100ms.live/meeting/room-124',
      patient_name: 'Emma Wilson',
      patient_mobile: '9876543210',
      patient_email: 'emma.wilson@email.com',
      patient_address: '456 Oak Ave, Metropolis',
    },
    {
      id: '3',
      roomId: 'room_125',
      title: 'Pediatric Checkup',
      participants: ['Dr. Lisa Davis', 'Tommy Johnson'],
      startTime: '2024-03-20T14:00:00Z',
      endTime: '2024-03-20T14:30:00Z',
      status: 'upcoming',
      bookingId: 'BK0003',
      userType: 'expert',
      hmsRoomCode: 'pediatric-room-125',
      hmsToken: 'hms_token_125',
      hmsRoomUrl: 'https://100ms.live/meeting/room-125',
      patient_name: 'Tommy Johnson',
      patient_mobile: '5551234567',
      patient_email: 'tommy.johnson@email.com',
      patient_address: '789 Pine Rd, Gotham',
    },
    {
      id: '4',
      roomId: 'room_129',
      title: 'ENT Follow-up',
      participants: ['Dr. Priya Menon', 'Amit Kumar'],
      startTime: '2024-03-21T12:00:00Z',
      endTime: '2024-03-21T12:30:00Z',
      status: 'upcoming',
      bookingId: 'BK0007',
      userType: 'expert',
      hmsRoomCode: 'ent-room-129',
      hmsToken: 'hms_token_129',
      hmsRoomUrl: 'https://100ms.live/meeting/room-129',
      patient_name: 'Amit Kumar',
      patient_mobile: '8889990000',
      patient_email: 'amit.kumar@email.com',
      patient_address: '22 MG Road, Mumbai',
    },
    {
      id: '5',
      roomId: 'room_130',
      title: 'General Medicine',
      participants: ['Dr. Anil Kapoor', 'Riya Sen', 'Suresh Iyer'],
      startTime: '2024-03-21T13:00:00Z',
      endTime: '2024-03-21T13:45:00Z',
      status: 'active',
      bookingId: 'BK0008',
      userType: 'expert',
      hmsRoomCode: 'genmed-room-130',
      hmsToken: 'hms_token_130',
      hmsRoomUrl: 'https://100ms.live/meeting/room-130',
      patient_name: 'Riya Sen',
      patient_mobile: '7778889999',
      patient_email: 'riya.sen@email.com',
      patient_address: '11 Park St, Kolkata',
    },
    {
      id: '6',
      roomId: 'room_131',
      title: 'Diabetes Management',
      participants: ['Dr. Kavita Rao', 'Manoj Pillai'],
      startTime: '2024-03-21T14:00:00Z',
      endTime: '2024-03-21T14:30:00Z',
      status: 'upcoming',
      bookingId: 'BK0009',
      userType: 'expert',
      hmsRoomCode: 'diabetes-room-131',
      hmsToken: 'hms_token_131',
      hmsRoomUrl: 'https://100ms.live/meeting/room-131',
      patient_name: 'Manoj Pillai',
      patient_mobile: '6667778888',
      patient_email: 'manoj.pillai@email.com',
      patient_address: '55 Lake View, Kochi',
    },
    {
      id: '7',
      roomId: 'room_132',
      title: 'Orthopedic Review',
      participants: ['Dr. Rajesh Sharma', 'Meera Nair', 'Vikram Singh', 'Asha Thomas'],
      startTime: '2024-03-21T15:00:00Z',
      endTime: '2024-03-21T15:45:00Z',
      status: 'active',
      bookingId: 'BK0010',
      userType: 'expert',
      hmsRoomCode: 'ortho-room-132',
      hmsToken: 'hms_token_132',
      hmsRoomUrl: 'https://100ms.live/meeting/room-132',
      patient_name: 'Asha Thomas',
      patient_mobile: '9990001111',
      patient_email: 'asha.thomas@email.com',
      patient_address: '88 Residency Rd, Bangalore',
    }
  ];

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient) {
      const timer = setTimeout(() => {
        setVideoCalls(sampleVideoCalls);
        const activeCall = sampleVideoCalls.find(call => call.status === 'active');
        if (activeCall) {
          setSelectedCall(activeCall);
        }
        setIsLoading(false);
      }, 800);

      return () => clearTimeout(timer);
    }
  }, [isClient]);

  const handleGoBack = () => {
    if (isInCall) {
      setIsInCall(false);
      setIsFullscreen(false);
    } else {
      router.back();
    }
  };

  const handleSelectCall = (videoCall: VideoCall) => {
    if (!isInCall) {
      setSelectedCall(videoCall);
    }
  };

  const handleJoinCall = async (videoCall: VideoCall) => {
    setIsJoining(true);
    setJoinedCallId(videoCall.id);
    
    // Simulate joining process
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setSelectedCall(videoCall);
    setIsJoining(false);
    setIsInCall(true);
    
    setTimeout(() => {
      videoContainerRef.current?.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
      });
    }, 300);
  };

  const handleLeaveCall = () => {
    setIsInCall(false);
    setIsFullscreen(false);
    setJoinedCallId(null);
  };

  const handleToggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'active':
        return { color: 'bg-green-50 text-green-700 border-green-200', dot: 'bg-green-500', label: 'Live' };
      case 'upcoming':
        return { color: 'bg-blue-50 text-blue-700 border-blue-200', dot: 'bg-blue-500', label: 'Upcoming' };
      case 'completed':
        return { color: 'bg-gray-50 text-gray-600 border-gray-200', dot: 'bg-gray-400', label: 'Completed' };
      case 'cancelled':
        return { color: 'bg-red-50 text-red-700 border-red-200', dot: 'bg-red-500', label: 'Cancelled' };
      case 'not conducted':
        return { color: 'bg-gray-50 text-gray-600 border-gray-200', dot: 'bg-gray-400', label: 'Not Conducted' };
      default:
        return { color: 'bg-gray-50 text-gray-600 border-gray-200', dot: 'bg-gray-400', label: 'Unknown' };
    }
  };

  const formatDateTime = (startTime: string, endTime: string) => {
    const start = new Date(startTime);
    const end = new Date(endTime);
    
    const date = start.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
    
    const time = `${start.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit' 
    })} – ${end.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit' 
    })}`;
    
    return { date, time };
  };

  const getVisibleCalls = () => {
    const cardsToShow = 3;
    const result = [];
    
    for (let i = 0; i < cardsToShow; i++) {
      const index = (currentCarouselIndex + i) % videoCalls.length;
      result.push(videoCalls[index]);
    }
    
    return result;
  };

  const nextCarousel = () => {
    if (!isInCall) {
      setCurrentCarouselIndex((prev) => (prev + 1) % videoCalls.length);
    }
  };

  const prevCarousel = () => {
    if (!isInCall) {
      setCurrentCarouselIndex((prev) => (prev - 1 + videoCalls.length) % videoCalls.length);
    }
  };

  if (!isClient) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-6 h-6 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-sm font-medium">Loading meetings</p>
        </div>
      </div>
    );
  }

  const visibleCalls = getVisibleCalls().filter(
    (call) =>
      (call.status === 'active' || call.status === 'upcoming') &&
      call.hmsRoomUrl
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Joining Overlay */}
      {isJoining && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-8 shadow-2xl text-center max-w-sm mx-4 border border-gray-100">
            <div className="w-16 h-16 mx-auto bg-blue-600 rounded-3xl flex items-center justify-center mb-4 relative">
              <Video className="w-8 h-8 text-white" />
              <div className="absolute inset-0 bg-blue-600 rounded-3xl animate-ping opacity-20"></div>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Joining meeting</h3>
            <p className="text-gray-600 text-sm mb-4">Connecting to 100ms room...</p>
            <div className="w-full bg-gray-100 rounded-full h-1">
              <div className="bg-blue-600 h-1 rounded-full transition-all duration-1000" style={{ width: '80%' }}></div>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className={`bg-white/80 backdrop-blur-xl border-b border-gray-200 sticky top-0 z-40 transition-all duration-300 ${isJoining ? 'blur-sm' : ''}`}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              {/* Hide back button while in call */}
              {!isInCall && (
                <button
                  onClick={handleGoBack}
                  className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-all duration-200"
                >
                  <ArrowLeft size={20} />
                </button>
              )}
              <div>
                <h1 className="text-lg font-semibold text-gray-900">
                  {isInCall ? 'In Meeting' : 'Video Calls'}
                </h1>
                {isInCall && selectedCall && (
                  <p className="text-sm text-gray-500">{selectedCall.title}</p>
                )}
              </div>
            </div>
            {isInCall && (
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-2 bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span>Live</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Meeting Cards - Only show when not in call */}
      {!isInCall ? (
        <div className={`py-6 transition-all duration-300 ${isJoining ? 'blur-sm' : ''}`}>
          <div className="max-w-7xl mx-auto px-6">
            <div className="relative">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {visibleCalls.map((videoCall, index) => {
                  const { date, time } = formatDateTime(videoCall.startTime, videoCall.endTime);
                  const statusConfig = getStatusConfig(videoCall.status);
                  const isSelected = selectedCall?.id === videoCall.id;
                  const isJoiningThis = joinedCallId === videoCall.id;
                  
                  return (
                    <div 
                      key={videoCall.id}
                      className={`bg-white rounded-2xl shadow-sm border transition-all duration-300 cursor-pointer ${
                        isSelected 
                          ? 'border-blue-600 shadow-lg shadow-blue-600/10 ring-1 ring-blue-600/20' 
                          : 'border-gray-200 hover:border-gray-300 hover:shadow-md hover:shadow-gray-500/5'
                      } ${isJoiningThis ? 'ring-2 ring-blue-600/30 scale-[1.02]' : 'hover:scale-[1.01]'}`}
                      onClick={() => !isJoining && handleSelectCall(videoCall)}
                    >
                      <div className="p-5">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1 min-w-0">
                            <h3 className="text-sm font-semibold text-gray-900 truncate mb-1">{videoCall.title}</h3>
                            <p className="text-xs text-gray-500 font-mono bg-gray-50 px-2 py-1 rounded-md inline-block">
                              {videoCall.hmsRoomCode}
                            </p>
                            {videoCall.hmsRoomUrl && (
                              <a
                                href={videoCall.hmsRoomUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-2 inline-flex items-center px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 text-xs font-semibold shadow-sm hover:bg-blue-100 transition-colors border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
                                title="Open 100ms Meeting Link"
                              >
                                <Video className="w-4 h-4 mr-1 text-blue-500" />
                                <span>Open Meeting Link</span>
                              </a>
                            )}
                          </div>
                          <div className={`ml-3 flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${statusConfig.color}`}>
                            <div className={`w-1.5 h-1.5 rounded-full mr-1.5 ${statusConfig.dot}`}></div>
                            {statusConfig.label}
                          </div>
                        </div>

                        <div className="space-y-2 mb-4">
                          <div className="flex items-center text-xs text-gray-600">
                            <Calendar size={12} className="mr-2 text-gray-400" />
                            {date}
                          </div>
                          <div className="flex items-center text-xs text-gray-600">
                            <Clock size={12} className="mr-2 text-gray-400" />
                            {time}
                          </div>
                          <div className="flex items-center text-xs text-gray-600">
                            <Users size={12} className="mr-2 text-gray-400" />
                            {videoCall.participants.length} participants
                          </div>
                        </div>

                        {/* Participants Preview */}
                        <div className="mb-4">
                          <div className="flex -space-x-1">
                            {videoCall.participants.slice(0, 2).map((participant, pIndex) => (
                              <div key={pIndex} className="w-6 h-6 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-xs font-medium border-2 border-white shadow-sm">
                                {participant.split(' ').map(n => n[0]).join('')}
                              </div>
                            ))}
                            {videoCall.participants.length > 2 && (
                              <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 text-xs font-medium border-2 border-white shadow-sm">
                                +{videoCall.participants.length - 2}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Action Button */}
                        {(videoCall.status === 'active' || videoCall.status === 'upcoming') && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              if (!isJoining) {
                                handleJoinCall(videoCall);
                              }
                            }}
                            disabled={isJoining}
                            className={`w-full px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center justify-center space-x-2 shadow-sm ${
                              videoCall.status === 'active' 
                                ? 'bg-green-600 hover:bg-green-700 text-white shadow-green-600/20' 
                                : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-600/20'
                            } ${
                              isJoiningThis 
                                ? 'scale-105 shadow-lg' 
                                : isJoining 
                                  ? 'opacity-50 cursor-not-allowed' 
                                  : 'hover:scale-105 hover:shadow-lg'
                            }`}
                          >
                            {isJoiningThis ? (
                              <>
                                <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                <span>Joining 100ms</span>
                              </>
                            ) : (
                              <>
                                <Play size={12} />
                                <span>{videoCall.status === 'active' ? 'Join Now' : 'Join Early'}</span>
                              </>
                            )}
                          </button>
                        )}

                        <button
                          onClick={() => setExpandedPatientId(videoCall.id === expandedPatientId ? null : videoCall.id)}
                          className="mt-2 px-3 py-1.5 rounded bg-blue-100 text-blue-700 text-xs font-semibold hover:bg-blue-200 transition"
                          aria-label={videoCall.id === expandedPatientId ? 'Close Patient Details' : 'Open Patient Details'}
                          title={videoCall.id === expandedPatientId ? 'Close Patient Details' : 'Open Patient Details'}
                        >
                          {videoCall.id === expandedPatientId ? 'Close' : 'Open'} Patient Details
                        </button>
                        {videoCall.id === expandedPatientId && (
                          <div className="mt-3 p-3 rounded bg-gray-50 border text-xs text-gray-700">
                            <div><strong>Name:</strong> {videoCall.patient_name}</div>
                            <div><strong>Phone:</strong> {videoCall.patient_mobile}</div>
                            <div><strong>Email:</strong> {videoCall.patient_email}</div>
                            <div><strong>Address:</strong> {videoCall.patient_address}</div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Navigation */}
              {videoCalls.length > 3 && (
                <>
                  <button
                    onClick={prevCarousel}
                    disabled={isJoining}
                    className={`absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-full p-2.5 shadow-lg transition-all duration-200 ${
                      isJoining ? 'opacity-50 cursor-not-allowed' : 'hover:bg-white hover:scale-110 hover:shadow-xl'
                    }`}
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <button
                    onClick={nextCarousel}
                    disabled={isJoining}
                    className={`absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-full p-2.5 shadow-lg transition-all duration-200 ${
                      isJoining ? 'opacity-50 cursor-not-allowed' : 'hover:bg-white hover:scale-110 hover:shadow-xl'
                    }`}
                  >
                    <ChevronRight size={16} />
                  </button>
                </>
              )}
            </div>

            {/* Indicators */}
            {videoCalls.length > 3 && (
              <div className="flex justify-center mt-6 space-x-2">
                {Array.from({ length: videoCalls.length }, (_, index) => (
                  <button
                    key={index}
                    onClick={() => !isJoining && setCurrentCarouselIndex(index)}
                    disabled={isJoining}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      index === currentCarouselIndex ? 'bg-blue-600 scale-125' : 'bg-gray-300'
                    } ${isJoining ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-500 hover:scale-110'}`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      ) : null}

      {/* Video Call Window */}
      <div className={`${isInCall ? 'min-h-[calc(100vh-80px)]' : 'min-h-[60vh]'} bg-white border-t border-gray-200`} ref={videoContainerRef}>
        <div className="max-w-7xl mx-auto px-6 py-8">
          {selectedCall && isInCall ? (
            <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-200">
              <div className="h-[70vh]">
                <LocalMediaVideoCall
                  userName={userName}
                  onLeave={handleLeaveCall}
                  isFullscreen={isFullscreen}
                  onToggleFullscreen={handleToggleFullscreen}
                />
              </div>
            </div>
          ) : (
            <div className="h-[60vh] flex flex-col items-center justify-center text-center">
              <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-6">
                <Video className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Meeting Selected</h3>
              <p className="text-gray-600 text-sm">Select a meeting from the list above to join a video call.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function VideoCallPortal() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-gray-50"><div className="w-8 h-8 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin" /></div>}>
      <VideoCallPortalContent />
    </Suspense>
  );
}

export const dynamic = 'force-dynamic';
