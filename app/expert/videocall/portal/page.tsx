'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  ArrowLeft, PhoneOff, Video, Calendar, Clock, Users,
  ChevronLeft, ChevronRight, Play, Mic, MicOff, VideoOff,
  Phone, Settings, Maximize2, Minimize2, ExternalLink,
  Check
} from 'lucide-react';
import { GetAllExpertBooking, GetAExpertBookingDetails, addSuggestion } from '@/service/expert/bookingMangementService';
import { GetAllServiceForClinic } from '@/service/clinic/serviceManagementService';

interface VideoCall {
  uuid: string;
  room_id: string;
  title: string;
  participants: string[];
  startTime: string;
  endTime: string;
  booking_status: 'SCHEDULED' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED' | 'NOT_CONDUCTED';
  bookingId?: string;
  userType: 'expert' | 'customer' | 'clinic';
  expert_meeting_link?: string;
  hmsToken?: string;
  patient_name?: string;
  patient_mobile?: string;
  patient_email?: string;
  patient_address?: string;
  booking_charge?: string;
}



interface LocalMediaVideoCallProps {
  userName: string;
  onLeave: () => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  expertMeetingLink?: string;
  callTitle?: string;
  bookingId?: string; // Add bookingId to props
}
interface Service {
  uuid: string;
  name: string;
  description: string;
  price: string;
  duration: string;
}
const LocalMediaVideoCall: React.FC<LocalMediaVideoCallProps> = ({
  userName,
  onLeave,
  isFullscreen,
  onToggleFullscreen,
  expertMeetingLink,
  callTitle,
  bookingId
}) => {
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [showMeetingFrame, setShowMeetingFrame] = useState(false);
  const [services, setServices] = useState<Service[]>([]);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [isLoadingServices, setIsLoadingServices] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const videoCallRef = useRef<HTMLDivElement>(null);

  // Automatically show meeting frame if expertMeetingLink exists
  useEffect(() => {
    if (expertMeetingLink) {
      setShowMeetingFrame(true);
    }
  }, [expertMeetingLink]);

  // Load services when component mounts
  useEffect(() => {
    const fetchServices = async () => {
      setIsLoadingServices(true);
      try {
        const response = await GetAllServiceForClinic();
        setServices(response.data || []);
      } catch (error) {
        console.error("Error fetching services:", error);
      } finally {
        setIsLoadingServices(false);
      }
    };

    fetchServices();
  }, []);

  // Initialize media stream
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
        console.error("Error accessing media devices:", err);
        setMediaStream(null);
      }
    })();
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // Handle service selection
  const handleServiceSelect = (serviceId: string) => {
    setSelectedServices(prev => 
      prev.includes(serviceId) 
        ? prev.filter(id => id !== serviceId) 
        : [...prev, serviceId]
    );
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!bookingId || selectedServices.length === 0) return;
    
    setIsSubmitting(true);
    try {
      const body = {
        services: selectedServices
      };
      await addSuggestion(bookingId, body);
      setSubmitSuccess(true);
      setTimeout(() => setSubmitSuccess(false), 3000);
    } catch (error) {
      console.error("Error submitting services:", error);
    } finally {
      setIsSubmitting(false);
    }
  };
  const toggleVideo = () => {
    if (mediaStream) {
      mediaStream.getVideoTracks().forEach(track => {
        track.enabled = !isVideoEnabled;
      });
    }
    setIsVideoEnabled(v => !v);
  };

  const toggleAudio = () => {
    if (mediaStream) {
      mediaStream.getAudioTracks().forEach(track => {
        track.enabled = !isAudioEnabled;
      });
    }
    setIsAudioEnabled(a => !a);
  };

  const handleCloseMeetingFrame = () => {
    setShowMeetingFrame(false);
  };
  // ... rest of your existing useEffect hooks and functions ...

  return (
    <div
      ref={videoCallRef}
      className={`relative overflow-hidden ${isFullscreen ? 'fixed inset-4 z-50' : 'w-full h-full'}`}
      style={isFullscreen ? { width: 'auto', height: 'auto' } : {}}
    >
      <div className="flex h-full gap-5">
        {/* Video/Meeting Container (Left Side) */}
        <div className={`${showMeetingFrame && expertMeetingLink ? 'w-2/3' : 'w-full'} relative`}>
          {/* Meeting Link Iframe - Full overlay when active */}
          {showMeetingFrame && expertMeetingLink && (
            <div className="absolute inset-0 z-30 bg-white  overflow-hidden">
              {/* Iframe Header */}
              <div className="bg-gray-900 text-white p-3 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Video size={16} className="text-blue-400" />
                  <span className="text-sm font-medium truncate">{callTitle}</span>
                </div>
                <button
                  onClick={() => setShowMeetingFrame(false)}
                  className="p-1.5 hover:bg-gray-700 rounded-lg transition-colors"
                  title="Close Meeting"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>

              {/* Iframe Content */}
              <iframe
                src={expertMeetingLink}
                className="w-full h-full border-0"
                style={{ height: 'calc(100% - 48px)' }}
                allow="camera; microphone; fullscreen; speaker; display-capture"
                allowFullScreen
                title="Expert Meeting"
              />
            </div>
          )}

          {/* Local Video Feed */}
          <div className="relative w-full h-full flex items-center justify-center bg-black">
            {mediaStream && !showMeetingFrame ? (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
            ) : !showMeetingFrame ? (
              <div className="flex flex-col items-center justify-center w-full h-full text-white">
                <VideoOff size={48} className="mb-4 text-white/60" />
                <p className="text-lg font-medium">Camera or mic not available</p>
              </div>
            ) : null}
          </div>

          {/* Control Bar */}
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-40">
            <div className="bg-black/70 backdrop-blur-md rounded-2xl px-6 py-4 flex items-center space-x-4">
              {!showMeetingFrame && (
                <>
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
                </>
              )}

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

        {/* Services Form (Right Side) - Only shown when meeting is active */}
        {showMeetingFrame && expertMeetingLink && (
          <div className="w-1/3 bg-white border-l border-gray-200 flex flex-col">
            <div className="p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800">Suggested Services</h3>
              <p className="text-sm text-gray-500">Select services to recommend to the patient</p>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              {isLoadingServices ? (
                <div className="flex items-center justify-center h-full">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                </div>
              ) : services.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                  No services available
                </div>
              ) : (
                <div className="space-y-5">
                  {services.map(service => (
                    <div 
                      key={service.uuid}
                      className={`p-3 rounded-lg border cursor-pointer transition-all ${
                        selectedServices.includes(service.uuid)
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-blue-300'
                      }`}
                      onClick={() => handleServiceSelect(service.uuid)}
                    >
                      <div className="flex items-start">
                        <div className={`w-5 h-5 rounded border flex items-center justify-center mr-3 mt-0.5 flex-shrink-0 ${
                          selectedServices.includes(service.uuid)
                            ? 'bg-blue-500 border-blue-500'
                            : 'bg-white border-gray-300'
                        }`}>
                          {selectedServices.includes(service.uuid) && (
                            <Check size={14} className="text-white" />
                          )}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-800">{service.name}</h4>
                          <p className="text-sm text-gray-600 mt-1">{service.description}</p>
                          <div className="flex justify-between items-center mt-2">
                            <span className="text-sm font-medium text-blue-600">
                              ₹{service.price}
                            </span>
                            <span className="text-xs text-gray-500">
                              {service.duration} mins
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="p-4 border-t border-gray-200">
              <button
                onClick={handleSubmit}
                disabled={selectedServices.length === 0 || isSubmitting}
                className={`w-full py-2 px-4 rounded-lg flex items-center justify-center ${
                  selectedServices.length === 0
                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                } transition-colors`}
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Submitting...
                  </>
                ) : submitSuccess ? (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    Submitted Successfully
                  </>
                ) : (
                  <>
                    <ChevronRight className="w-4 h-4 mr-2" />
                    Submit Suggestions ({selectedServices.length})
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Fullscreen Exit Button */}
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
  const [refreshInterval, setRefreshInterval] = useState<NodeJS.Timeout | null>(null);

  const userType = searchParams.get('userType') || 'expert';
  const userName = searchParams.get('userName') || 'Expert User';

  // Updated function to check if within 10 minutes of start time for join button
  const isWithin10Minutes = (startTime: string) => {
    const now = new Date();
    const start = new Date(startTime);
    const diffInMinutes = (start.getTime() - now.getTime()) / (1000 * 60);
    return diffInMinutes <= 10 && diffInMinutes >= 0;
  };

  // Updated function to check if within 5 minutes of start time for API fetching
  const isWithin5Minutes = (startTime: string) => {
    const now = new Date();
    const start = new Date(startTime);
    const diffInMinutes = (start.getTime() - now.getTime()) / (1000 * 60);
    return diffInMinutes <= 5 && diffInMinutes >= 0;
  };

  const fetchBookingDetails = async (bookingId: string) => {
    try {
      const response = await GetAExpertBookingDetails(bookingId);
      return response.data;
    } catch (error) {
      console.error("Error fetching booking details:", error);
      return null;
    }
  };

  const updateBookingWithRoomDetails = async (booking: VideoCall) => {
    // Only fetch meeting link if within 5 minutes of start time
    if (!booking.expert_meeting_link && isWithin5Minutes(booking.startTime)) {
      const details = await fetchBookingDetails(booking.uuid);
      if (details) {
        return {
          ...booking,
          room_id: details.room_id || booking.room_id,
          expert_meeting_link: details.expert_meeting_link || booking.expert_meeting_link
        };
      }
    }
    return booking;
  };

  // const fetchAllBookings = async () => {
  //   try {
  //     const response = await GetAllExpertBooking();
  //     let bookings = response.data || [];
  //     console.log(bookings, "Fetched bookings data");

  //     // Get current date and time for testing
  //     const now = new Date();

  //     bookings = bookings.map((booking: any, index: number) => ({
  //       uuid: booking.uuid,
  //       room_id: booking.room_id,
  //       title: `Consultation with ${booking.patient_name || 'Patient'}`,
  //       participants: [
  //         userName,
  //         booking.patient_name || 'Patient'
  //       ],
  //       // Set test times: one meeting starting now, one in 2 minutes, one in 15 minutes
  //       startTime: index === 0 
  //         ? now.toISOString() // Meeting starting now (ACTIVE)
  //         : index === 1 
  //           ? new Date(now.getTime() + 2 * 60 * 1000).toISOString() // Meeting in 2 minutes (SCHEDULED, within 10 min)
  //           : new Date(now.getTime() + 15 * 60 * 1000).toISOString(), // Meeting in 15 minutes (SCHEDULED, outside 10 min)
  //       endTime: index === 0
  //         ? new Date(now.getTime() + 30 * 60 * 1000).toISOString() // 30 minutes from now
  //         : index === 1
  //           ? new Date(now.getTime() + 32 * 60 * 1000).toISOString() // 32 minutes from now
  //           : new Date(now.getTime() + 45 * 60 * 1000).toISOString(), // 45 minutes from now
  //       booking_status: index === 0 ? 'ACTIVE' : 'SCHEDULED', // First meeting is active, others scheduled
  //       expert_meeting_link: booking.expert_meeting_link || `https://example.com/meeting/${booking.uuid}`, // Add test meeting link
  //       patient_name: booking.patient_name,
  //       patient_mobile: booking.patient_mobile,
  //       patient_email: booking.patient_email,
  //       patient_address: booking.patient_address,
  //       booking_charge: booking.booking_charge
  //     }));

  //     const updatedBookings = await Promise.all(
  //       bookings.map(async (booking: VideoCall) => {
  //         return await updateBookingWithRoomDetails(booking);
  //       })
  //     );

  //     setVideoCalls(updatedBookings);
  //     setIsLoading(false);

  //     const activeCall = updatedBookings.find(call => call.booking_status === 'ACTIVE');
  //     if (activeCall) {
  //       setSelectedCall(activeCall);
  //     }
  //   } catch (error) {
  //     console.error("Error fetching bookings:", error);
  //     setIsLoading(false);
  //   }
  // };

const fetchAllBookings = async () => {
  try {
    const response = await GetAllExpertBooking();
    let bookings = response.data || [];
    console.log(bookings, "Fetched bookings data");
    
    // Get current date (set time to 00:00:00 for accurate comparison)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    bookings = bookings
      .map((booking: any) => ({
        uuid: booking.uuid,
        room_id: booking.room_id,
        title: `Consultation with ${booking.patient_name || 'Patient'}`,
        participants: [
          userName,
          booking.patient_name || 'Patient'
        ],
        startTime: booking.start_time || new Date().toISOString(),
        endTime: booking.end_time || new Date(new Date().getTime() + 30 * 60 * 1000).toISOString(),
        booking_status: booking.booking_status,
        expert_meeting_link: booking.expert_meeting_link,
        patient_name: booking.patient_name,
        patient_mobile: booking.patient_mobile,
        patient_email: booking.patient_email,
        patient_address: booking.patient_address,
        booking_charge: booking.booking_charge,
        // Convert booking start time to Date object for comparison
        bookingDate: booking.start_time ? new Date(booking.start_time) : new Date()
      }))
      // Filter to keep only today's and future bookings
      .filter((booking: any) => booking.bookingDate >= today);

    const updatedBookings = await Promise.all(
      bookings.map(async (booking: VideoCall) => {
        return await updateBookingWithRoomDetails(booking);
      })
    );

    setVideoCalls(updatedBookings);
    setIsLoading(false);

    const activeCall = updatedBookings.find(call => call.booking_status === 'ACTIVE');
    if (activeCall) {
      setSelectedCall(activeCall);
    }
  } catch (error) {
    console.error("Error fetching bookings:", error);
    setIsLoading(false);
  }
};

  useEffect(() => {
    setIsClient(true);
    fetchAllBookings();

    const interval = setInterval(fetchAllBookings, 60000);
    setRefreshInterval(interval);

    return () => {
      if (refreshInterval) clearInterval(refreshInterval);
    };
  }, []);

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
    setJoinedCallId(videoCall.uuid);

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
      case 'ACTIVE':
        return { color: 'bg-green-50 text-green-700 border-green-200', dot: 'bg-green-500', label: 'Live' };
      case 'SCHEDULED':
        return { color: 'bg-blue-50 text-blue-700 border-blue-200', dot: 'bg-blue-500', label: 'Upcoming' };
      case 'COMPLETED':
        return { color: 'bg-gray-50 text-gray-600 border-gray-200', dot: 'bg-gray-400', label: 'Completed' };
      case 'CANCELLED':
        return { color: 'bg-red-50 text-red-700 border-red-200', dot: 'bg-red-500', label: 'Cancelled' };
      case 'NOT_CONDUCTED':
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
  };

  const visibleCalls = getVisibleCalls().filter(
    (call) =>
      (call?.booking_status === 'ACTIVE' || call?.booking_status === 'SCHEDULED') &&
      call?.expert_meeting_link
  );

  return (
    <div className="min-h-screen bg-gray-50">
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

      <div className={`bg-white/80 backdrop-blur-xl border-b border-gray-200 sticky top-0 z-40 transition-all duration-300 ${isJoining ? 'blur-sm' : ''}`}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
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

      {!isInCall ? (
        <div className={`py-6 transition-all duration-300 ${isJoining ? 'blur-sm' : ''}`}>
          <div className="max-w-7xl mx-auto px-6">
            <div className="relative">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {visibleCalls.map((videoCall, index) => {
                  const { date, time } = formatDateTime(videoCall.startTime, videoCall.endTime);
                  const statusConfig = getStatusConfig(videoCall.booking_status);
                  const isSelected = selectedCall?.uuid === videoCall.uuid;
                  const isJoiningThis = joinedCallId === videoCall.uuid;

                  return (
                    <div
                      key={videoCall.uuid}
                      className={`bg-white rounded-2xl shadow-sm border transition-all duration-300 cursor-pointer ${isSelected
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
                              {videoCall.room_id}
                            </p>
                            {videoCall.expert_meeting_link && (
                              <a
                                href={videoCall.expert_meeting_link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-2 inline-flex items-center px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 text-xs font-semibold shadow-sm hover:bg-blue-100 transition-colors border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
                                title="Open Meeting Link"
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

                        {videoCall.booking_status === 'ACTIVE' || videoCall.booking_status === 'SCHEDULED' ? (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              if (!isJoining && (videoCall.booking_status === 'ACTIVE' || isWithin10Minutes(videoCall.startTime))) {
                                handleJoinCall(videoCall);
                              }
                            }}
                            disabled={isJoining || (videoCall.booking_status === 'SCHEDULED' && !isWithin10Minutes(videoCall.startTime))}
                            className={`w-full px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center justify-center space-x-2 shadow-sm ${videoCall.booking_status === 'ACTIVE' || (videoCall.booking_status === 'SCHEDULED' && isWithin10Minutes(videoCall.startTime))
                                ? videoCall.booking_status === 'ACTIVE'
                                  ? 'bg-green-600 hover:bg-green-700 text-white shadow-green-600/20'
                                  : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-600/20'
                                : 'bg-gray-400 text-white cursor-not-allowed'
                              } ${isJoiningThis
                                ? 'scale-105 shadow-lg'
                                : isJoining || (videoCall.booking_status === 'SCHEDULED' && !isWithin10Minutes(videoCall.startTime))
                                  ? 'opacity-70 cursor-not-allowed'
                                  : 'hover:scale-105 hover:shadow-lg'
                              }`}
                          >
                            {isJoiningThis ? (
                              <>
                                <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                <span>Joining</span>
                              </>
                            ) : videoCall.booking_status === 'ACTIVE' || (videoCall.booking_status === 'SCHEDULED' && isWithin10Minutes(videoCall.startTime)) ? (
                              <>
                                <Play size={12} />
                                <span>Join Now</span>
                              </>
                            ) : (
                              <>
                                <Clock size={12} />
                                <span>Meet Start Soon</span>
                              </>
                            )}
                          </button>
                        ) : null}

                        <button
                          onClick={() => setExpandedPatientId(videoCall.uuid === expandedPatientId ? null : videoCall.uuid)}
                          className="mt-2 px-3 py-1.5 rounded bg-blue-100 text-blue-700 text-xs font-semibold hover:bg-blue-200 transition"
                          aria-label={videoCall.uuid === expandedPatientId ? 'Close Patient Details' : 'Open Patient Details'}
                          title={videoCall.uuid === expandedPatientId ? 'Close Patient Details' : 'Open Patient Details'}
                        >
                          {videoCall.uuid === expandedPatientId ? 'Close' : 'Open'} Patient Details
                        </button>
                        {videoCall.uuid === expandedPatientId && (
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

              {videoCalls.length > 3 && (
                <>
                  <button
                    onClick={prevCarousel}
                    disabled={isJoining}
                    className={`absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-full p-2.5 shadow-lg transition-all duration-200 ${isJoining ? 'opacity-50 cursor-not-allowed' : 'hover:bg-white hover:scale-110 hover:shadow-xl'
                      }`}
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <button
                    onClick={nextCarousel}
                    disabled={isJoining}
                    className={`absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-full p-2.5 shadow-lg transition-all duration-200 ${isJoining ? 'opacity-50 cursor-not-allowed' : 'hover:bg-white hover:scale-110 hover:shadow-xl'
                      }`}
                  >
                    <ChevronRight size={16} />
                  </button>
                </>
              )}
            </div>

            {videoCalls.length > 3 && (
              <div className="flex justify-center mt-6 space-x-2">
                {Array.from({ length: videoCalls.length }, (_, index) => (
                  <button
                    key={index}
                    onClick={() => !isJoining && setCurrentCarouselIndex(index)}
                    disabled={isJoining}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${index === currentCarouselIndex ? 'bg-blue-600 scale-125' : 'bg-gray-300'
                      } ${isJoining ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-500 hover:scale-110'}`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      ) : null}

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
                  expertMeetingLink={selectedCall.expert_meeting_link}
                  callTitle={selectedCall.title}
                   bookingId={selectedCall?.uuid}
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