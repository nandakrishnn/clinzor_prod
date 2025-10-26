"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Video,
  Calendar,
  Clock,
  Users,
  Play,
  ChevronLeft,
  ChevronRight,
  Phone,
  Mail,
  Map
} from "lucide-react";
import {
  GetAllExpertBooking,
  GetAExpertBookingDetails,
} from "@/service/expert/bookingMangementService";
import { convertTo12HourFormat } from "@/utils/formatters";
import { useSession } from "next-auth/react";

interface VideoCall {
  uuid: string;
  room_id: string;
  title: string;
  participants: string[];
  startTime: string;
  endTime: string;
  booking_status:
  | "SCHEDULED"
  | "ACTIVE"
  | "COMPLETED"
  | "CANCELLED"
  | "NOT_CONDUCTED";
  bookingId?: string;
  userType: "expert" | "customer" | "clinic";
  expert_meeting_link?: string;
  hmsToken?: string;
  patient_name?: string;
  patient_mobile?: string;
  patient_email?: string;
  patient_address?: string;
  booking_charge?: string;
}

interface PaginationInfo {
  current_page: number;
  total_pages: number;
  total_items: number;
  next: string | null;
  previous: string | null;
}

function VideoCallPortalContent() {
  const searchParams = useSearchParams();
  const [videoCalls, setVideoCalls] = useState<VideoCall[]>([]);
  const [selectedCall, setSelectedCall] = useState<VideoCall | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);
  const [pagination, setPagination] = useState<PaginationInfo>({
    current_page: 1,
    total_pages: 1,
    total_items: 0,
    next: null,
    previous: null
  });
  const userName = searchParams.get("userName") || "Expert User";
  const router = useRouter()

  const { data: session, status }: any = useSession();

  const convertUTCTimeToLocal = (utcDateString: string) => {
    const utcDate = new Date(utcDateString);
    return new Date(utcDate.getTime() + utcDate.getTimezoneOffset() * 60000);
  };

  const isWithin10Minutes = (startTime: string) => {
    const now = new Date();
    const start = convertUTCTimeToLocal(startTime); // Convert UTC to local time
    const diffInMinutes = (start.getTime() - now.getTime()) / (1000 * 60);
    return diffInMinutes <= 10 && diffInMinutes >= 0;
  };

  const isWithin5Minutes = (startTime: string) => {
    const now = new Date();
    const start = convertUTCTimeToLocal(startTime); // Convert UTC to local time
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
    if (!booking.expert_meeting_link && isWithin5Minutes(booking.startTime)) {
      const details = await fetchBookingDetails(booking.uuid);
      if (details) {
        return {
          ...booking,
          room_id: details.room_id || booking.room_id,
          expert_meeting_link:
            details.expert_meeting_link || booking.expert_meeting_link
        };
      }
    }
    return booking;
  };

  const fetchAllBookings = async (page: number = 1) => {
    try {
      const params = {
        expert: session?.user?.uuid,
        page: page.toString()
      }
      const response = await GetAllExpertBooking(params);
      let bookings = response.data || [];
      const paginationInfo = {
        current_page: response?.current_page,
        total_pages: response?.total_pages,
        total_items: response?.total_items,
        next: response?.next,
        previous: response?.previous
      };

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      bookings = bookings
        .map((booking: any) => ({
          uuid: booking.uuid,
          room_id: booking.room_id,
          title: `Consultation with ${booking.customer_name || "Patient"}`,
          participants: [userName, booking.customer_name || "Patient"],
          startTime: booking.start_time || new Date().toISOString(),
          endTime:
            booking.end_time ||
            new Date(new Date().getTime() + 30 * 60 * 1000).toISOString(),
          booking_status: booking.booking_status,
          expert_meeting_link: booking.expert_meeting_link,
          patient_name: booking.customer_name,
          patient_mobile: booking.customer_phone_number,
          patient_email: booking.customer_email,
          patient_address: booking.customer_addresss,
          booking_charge: booking.booking_charge,
          bookingDate: booking.start_time
            ? new Date(booking.start_time)
            : new Date()
        }))
        .filter((booking: any) => booking.bookingDate >= today);

      const updatedBookings = await Promise.all(
        bookings.map(async (booking: VideoCall) => {
          return await updateBookingWithRoomDetails(booking);
        })
      );

      setVideoCalls(updatedBookings);
      setPagination(paginationInfo);
      setIsLoading(false);

      const activeCall = updatedBookings.find(
        (call) => call.booking_status === "ACTIVE"
      );
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
    fetchAllBookings(1);

    const interval = setInterval(() => fetchAllBookings(pagination.current_page), 60000);
    return () => clearInterval(interval);
  }, [session]);

  // Handle page change
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= pagination.total_pages) {
      setIsLoading(true);
      fetchAllBookings(page);
    }
  };

  const handleJoinCall = async (videoCall: VideoCall) => {
    console.log(videoCall, 'get the clicking call')
    if (videoCall.expert_meeting_link) {
      // Open meeting link in new tab
      router.push(`/expert/videocall/user-connect?meetingUrl=${encodeURIComponent(videoCall.expert_meeting_link)}&bookingId=${videoCall?.uuid}`)
      // window.open(videoCall.expert_meeting_link, '_blank', 'noopener,noreferrer');
    }
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return {
          color: "bg-green-50 text-green-700 border-green-200",
          dot: "bg-green-500",
          label: "Live"
        };
      case "SCHEDULED":
        return {
          color: "bg-blue-50 text-blue-700 border-blue-200",
          dot: "bg-blue-500",
          label: "Upcoming"
        };
      case "COMPLETED":
        return {
          color: "bg-gray-50 text-gray-600 border-gray-200",
          dot: "bg-gray-400",
          label: "Completed"
        };
      case "CANCELLED":
        return {
          color: "bg-red-50 text-red-700 border-red-200",
          dot: "bg-red-500",
          label: "Cancelled"
        };
      case "NOT_CONDUCTED":
        return {
          color: "bg-gray-50 text-gray-600 border-gray-200",
          dot: "bg-gray-400",
          label: "Not Conducted"
        };
      default:
        return {
          color: "bg-gray-50 text-gray-600 border-gray-200",
          dot: "bg-gray-400",
          label: "Unknown"
        };
    }
  };

  const formatDateTime = (startTime: string, endTime: string) => {
    const start = new Date(startTime);

    const date = start.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric"
    });

    const time = `${convertTo12HourFormat(startTime)} – ${convertTo12HourFormat(endTime)}`;

    return { date, time };
  };

  // Pagination Component
  const Pagination = () => {
    if (pagination.total_pages <= 1) return null;

    return (
      <div className="flex items-center justify-center space-x-2 mt-8 ">
        <button
          onClick={() => handlePageChange(pagination.current_page - 1)}
          disabled={pagination.current_page === 1}
          className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${pagination.current_page === 1
            ? "text-gray-400 cursor-not-allowed"
            : "text-gray-700 hover:bg-gray-100"
            }`}
        >
          <ChevronLeft size={16} className="mr-1" />
          Previous
        </button>

        <div className="flex items-center space-x-1">
          {Array.from({ length: pagination.total_pages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${page === pagination.current_page
                ? "bg-blue-600 text-white"
                : "text-gray-700 hover:bg-gray-100"
                }`}
            >
              {page}
            </button>
          ))}
        </div>

        <button
          onClick={() => handlePageChange(pagination.current_page + 1)}
          disabled={pagination.current_page === pagination.total_pages}
          className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${pagination.current_page === pagination.total_pages
            ? "text-gray-400 cursor-not-allowed"
            : "text-gray-700 hover:bg-gray-100"
            }`}
        >
          Next
          <ChevronRight size={16} className="ml-1" />
        </button>
      </div>
    );
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

  const availableCalls = videoCalls.filter(
    (call) =>
      (call?.booking_status === "ACTIVE" ||
        call?.booking_status === "SCHEDULED") &&
      call?.expert_meeting_link
  );

  return (
    <div className="min-h-screen bg-gray-50 p-3">

      <div className="px-4 py-4 sm:pt-5 ">
        <div className="flex items-center justify-between ">
          <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between ">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                Expert Video Call
              </h1>
              <p className="text-sm sm:text-base text-gray-600">
                Manage and track all your Expert Calls
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="transition-all duration-300 ">
        <div className="mx-auto px-4 pb-10 md:pb-20">
          {/* Pagination Info */}
          <div className="flex justify-between items-center mb-4">
            <div className="text-sm text-gray-600">
              {/* Showing {availableCalls.length} of {pagination.total_items} meetings */}
            </div>
            <div className="text-sm text-gray-600">
              Page {pagination.current_page} of {pagination.total_pages}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {availableCalls.map((videoCall: any) => {
              const { date, time } = formatDateTime(
                videoCall.startTime,
                videoCall.endTime
              );
              const statusConfig = getStatusConfig(
                videoCall.booking_status
              );
              const isSelected = selectedCall?.uuid === videoCall.uuid;
              const canJoin = videoCall.booking_status === "ACTIVE" ||
                (videoCall.booking_status === "SCHEDULED" &&
                  isWithin10Minutes(videoCall.startTime));

              return (
                <div
                  key={videoCall.uuid}
                  className={`bg-white rounded-2xl shadow-sm border transition-all duration-300 cursor-pointer ${isSelected
                    ? "border-blue-600 shadow-lg shadow-blue-600/10 ring-1 ring-blue-600/20"
                    : "border-gray-200 hover:border-gray-300 hover:shadow-md hover:shadow-gray-500/5"
                    } hover:scale-[1.01]`}
                >
                  <div className="p-5">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-semibold text-gray-900 truncate mb-1">
                          {videoCall.title}
                        </h3>
                        <p className="text-xs text-gray-500 font-mono bg-gray-50 px-2 py-1 rounded-md inline-block">
                          {videoCall.room_id}
                        </p>
                      </div>
                      <div
                        className={`ml-3 flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${statusConfig.color}`}
                      >
                        <div
                          className={`w-1.5 h-1.5 rounded-full mr-1.5 ${statusConfig.dot}`}
                        ></div>
                        {statusConfig.label}
                      </div>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-xs text-gray-600">
                        <Calendar
                          size={12}
                          className="mr-2 text-gray-400"
                        />
                        {date}
                      </div>
                      <div className="flex items-center text-xs text-gray-600">
                        <Clock size={12} className="mr-2 text-gray-400" />
                        {time}
                      </div>
                      <div className="flex items-center text-xs text-gray-600">
                        <Users size={12} className="mr-2 text-gray-400" />
                        {videoCall?.patient_name} ,{videoCall?.patient_email}
                      </div>
                      <div className="flex items-center text-xs text-gray-600">
                        <Phone size={12} className="mr-2 text-gray-400" />
                        {videoCall?.patient_mobile} 
                      </div>
                      <div className="flex items-center text-xs text-gray-600">
                        <Map size={12} className="mr-2 text-gray-400" />
                        {videoCall?.patient_address}
                      </div>
                    </div>

                    <div className="mb-4">
                      <div className="flex -space-x-1">
                        {videoCall.participants
                          .slice(0, 2)
                          .map((participant: any, pIndex: any) => (
                            <div
                              key={pIndex}
                              className="w-6 h-6 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-xs font-medium border-2 border-white shadow-sm"
                            >
                              {participant
                                .split(" ")
                                .map((n: any) => n[0])
                                .join("")}
                            </div>
                          ))}
                        {videoCall.participants.length > 2 && (
                          <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 text-xs font-medium border-2 border-white shadow-sm">
                            +{videoCall.participants.length - 2}
                          </div>
                        )}
                      </div>
                    </div>

                    {canJoin && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleJoinCall(videoCall);
                        }}
                        className={`w-full px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center justify-center space-x-2 shadow-sm ${videoCall.booking_status === "ACTIVE"
                          ? "bg-green-600 hover:bg-green-700 text-white shadow-green-600/20"
                          : "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-600/20"
                          } hover:scale-105 hover:shadow-lg`}
                      >
                        <Play size={12} />
                        <span>Join Meeting</span>
                      </button>
                    )}

                    {videoCall.booking_status === "SCHEDULED" && !canJoin && (
                      <button
                        disabled
                        className="w-full px-4 py-2.5 rounded-xl text-sm font-semibold bg-gray-400 text-white cursor-not-allowed flex items-center justify-center space-x-2"
                      >
                        <Clock size={12} />
                        <span>Meeting Starts Soon</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination Controls */}
          <Pagination />

          {availableCalls.length === 0 && (
            <div className="text-center py-12">
              <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-6 mx-auto">
                <Video size={32} className="text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No Available Meetings
              </h3>
              <p className="text-gray-600 text-sm">
                There are no active or upcoming meetings at the moment.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function VideoCallPortal() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="w-8 h-8 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin" />
        </div>
      }
    >
      <VideoCallPortalContent />
    </Suspense>
  );
}

export const dynamic = "force-dynamic";