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
  Map,
  CheckCircle,
  XCircle,
  AlertCircle
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
  bookingDate?: Date;
}

interface PaginationInfo {
  current_page: number;
  total_pages: number;
  total_items: number;
  next: string | null;
  previous: string | null;
}

type Tab = "upcoming" | "previous";

function VideoCallPortalContent() {
  const searchParams = useSearchParams();
  const [videoCalls, setVideoCalls] = useState<VideoCall[]>([]);
  const [previousVideoCalls, setPreviousVideoCalls] = useState<VideoCall[]>([]);
  const [selectedCall, setSelectedCall] = useState<VideoCall | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>("upcoming");

  const handleTabChange = (tab: Tab) => {
    setActiveTab(tab);
    if (pagination.current_page !== 1) {
      fetchAllBookings(1);
    }
  };
  const [pagination, setPagination] = useState<PaginationInfo>({
    current_page: 1,
    total_pages: 1,
    total_items: 0,
    next: null,
    previous: null
  });
  const userName = searchParams.get("userName") || "Expert User";
  const router = useRouter();
  const { data: session }: any = useSession();

  const convertUTCTimeToLocal = (utcDateString: string) => {
    const utcDate = new Date(utcDateString);
    return new Date(utcDate.getTime() + utcDate.getTimezoneOffset() * 60000);
  };

  const isWithin10Minutes = (startTime: string) => {
    const now = new Date();
    const start = convertUTCTimeToLocal(startTime);
    const diffInMinutes = (start.getTime() - now.getTime()) / (1000 * 60);
    return diffInMinutes <= 10 && diffInMinutes >= -15;
  };

  const isWithin5Minutes = (startTime: string) => {
    const now = new Date();
    const start = convertUTCTimeToLocal(startTime);
    const diffInMinutes = (start.getTime() - now.getTime()) / (1000 * 60);
    return diffInMinutes <= 5 && diffInMinutes >= -15;
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
          expert_meeting_link: details.expert_meeting_link || booking.expert_meeting_link
        };
      }
    }
    return booking;
  };

  const fetchAllBookings = async (page: number = 1) => {
    try {
      const params = { expert: session?.user?.uuid, page: page.toString() };
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

      const mapped = bookings.map((booking: any) => ({
        uuid: booking.uuid,
        room_id: booking.room_id,
        title: `Consultation with ${booking.customer_name || "Patient"}`,
        participants: [userName, booking.customer_name || "Patient"],
        startTime: booking.start_time || new Date().toISOString(),
        endTime: booking.end_time || new Date(new Date().getTime() + 30 * 60 * 1000).toISOString(),
        booking_status: booking.booking_status,
        expert_meeting_link: booking.expert_meeting_link,
        patient_name: booking.customer_name,
        patient_mobile: booking.customer_phone_number,
        patient_email: booking.customer_email,
        patient_address: booking.customer_addresss,
        booking_charge: booking.booking_charge,
        bookingDate: booking.start_time ? new Date(booking.start_time) : new Date()
      }));

      const upcoming = mapped.filter((b: VideoCall) => b.bookingDate! >= today);
      const previous = mapped.filter((b: VideoCall) => b.bookingDate! < today);

      const updatedUpcoming = await Promise.all(
        upcoming.map(async (booking: VideoCall) => updateBookingWithRoomDetails(booking))
      );

      setVideoCalls(updatedUpcoming);
      setPreviousVideoCalls(previous);
      setPagination(paginationInfo);
      setIsLoading(false);

      const activeCall = updatedUpcoming.find((call: VideoCall) => call.booking_status === "ACTIVE");
      if (activeCall) setSelectedCall(activeCall);
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

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= pagination.total_pages) {
      setIsLoading(true);
      fetchAllBookings(page);
    }
  };

  const handleJoinCall = async (videoCall: VideoCall) => {
    if (videoCall.expert_meeting_link) {
      router.push(
        `/expert/videocall/user-connect?meetingUrl=${encodeURIComponent(videoCall.expert_meeting_link)}&bookingId=${videoCall?.uuid}`
      );
    }
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return { color: "bg-green-50 text-green-700 border-green-200", dot: "bg-green-500", label: "Live" };
      case "SCHEDULED":
        return { color: "bg-blue-50 text-blue-700 border-blue-200", dot: "bg-blue-500", label: "Upcoming" };
      case "COMPLETED":
        return { color: "bg-gray-50 text-gray-600 border-gray-200", dot: "bg-gray-400", label: "Completed" };
      case "CANCELLED":
        return { color: "bg-red-50 text-red-700 border-red-200", dot: "bg-red-500", label: "Cancelled" };
      case "NOT_CONDUCTED":
        return { color: "bg-orange-50 text-orange-600 border-orange-200", dot: "bg-orange-400", label: "Not Conducted" };
      default:
        return { color: "bg-gray-50 text-gray-600 border-gray-200", dot: "bg-gray-400", label: "Unknown" };
    }
  };

  const formatDateTime = (startTime: string, endTime: string) => {
    const start = new Date(startTime);
    const date = start.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    const time = `${convertTo12HourFormat(startTime)} – ${convertTo12HourFormat(endTime)}`;
    return { date, time };
  };

  const Pagination = () => {
    if (pagination.total_pages <= 1) return null;
    return (
      <div className="flex items-center justify-center space-x-2 mt-8">
        <button
          onClick={() => handlePageChange(pagination.current_page - 1)}
          disabled={pagination.current_page === 1}
          className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${pagination.current_page === 1 ? "text-gray-400 cursor-not-allowed" : "text-gray-700 hover:bg-gray-100"}`}
        >
          <ChevronLeft size={16} className="mr-1" /> Previous
        </button>
        <div className="flex items-center space-x-1">
          {Array.from({ length: pagination.total_pages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${page === pagination.current_page ? "bg-blue-600 text-white" : "text-gray-700 hover:bg-gray-100"}`}
            >
              {page}
            </button>
          ))}
        </div>
        <button
          onClick={() => handlePageChange(pagination.current_page + 1)}
          disabled={pagination.current_page === pagination.total_pages}
          className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${pagination.current_page === pagination.total_pages ? "text-gray-400 cursor-not-allowed" : "text-gray-700 hover:bg-gray-100"}`}
        >
          Next <ChevronRight size={16} className="ml-1" />
        </button>
      </div>
    );
  };

  // ─── Upcoming Card ───
  const UpcomingCard = ({ videoCall }: { videoCall: VideoCall }) => {
    const { date, time } = formatDateTime(videoCall.startTime, videoCall.endTime);
    const statusConfig = getStatusConfig(videoCall.booking_status);
    const isSelected = selectedCall?.uuid === videoCall.uuid;
    const canJoin =
      videoCall.booking_status === "ACTIVE" ||
      (videoCall.booking_status === "SCHEDULED" && isWithin10Minutes(videoCall.startTime));

    return (
      <div
        className={`bg-white rounded-2xl shadow-sm border transition-all duration-300 cursor-pointer hover:scale-[1.01] ${isSelected
          ? "border-blue-600 shadow-lg shadow-blue-600/10 ring-1 ring-blue-600/20"
          : "border-gray-200 hover:border-gray-300 hover:shadow-md"
          }`}
      >
        <div className="p-5">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-semibold text-gray-900 truncate mb-1">{videoCall.title}</h3>
              <p className="text-xs text-gray-500 font-mono bg-gray-50 px-2 py-1 rounded-md inline-block">{videoCall.room_id}</p>
            </div>
            <div className={`ml-3 flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${statusConfig.color}`}>
              <div className={`w-1.5 h-1.5 rounded-full mr-1.5 ${statusConfig.dot}`}></div>
              {statusConfig.label}
            </div>
          </div>

          <div className="space-y-2 mb-4">
            <div className="flex items-center text-xs text-gray-600"><Calendar size={12} className="mr-2 text-gray-400" />{date}</div>
            <div className="flex items-center text-xs text-gray-600"><Clock size={12} className="mr-2 text-gray-400" />{time}</div>
            <div className="flex items-center text-xs text-gray-600"><Users size={12} className="mr-2 text-gray-400" />{videoCall?.patient_name}, {videoCall?.patient_email}</div>
            <div className="flex items-center text-xs text-gray-600"><Phone size={12} className="mr-2 text-gray-400" />{videoCall?.patient_mobile}</div>
            <div className="flex items-center text-xs text-gray-600"><Map size={12} className="mr-2 text-gray-400" />{videoCall?.patient_address}</div>
          </div>

          <div className="mb-4">
            <div className="flex -space-x-1">
              {videoCall.participants.slice(0, 2).map((p: any, i: any) => (
                <div key={i} className="w-6 h-6 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-xs font-medium border-2 border-white shadow-sm">
                  {p.split(" ").map((n: any) => n[0]).join("")}
                </div>
              ))}
            </div>
          </div>

          {canJoin ? (
            <button
              onClick={(e) => { e.stopPropagation(); handleJoinCall(videoCall); }}
              className={`w-full px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center justify-center space-x-2 shadow-sm hover:scale-105 hover:shadow-lg ${videoCall.booking_status === "ACTIVE"
                ? "bg-green-600 hover:bg-green-700 text-white shadow-green-600/20"
                : "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-600/20"
                }`}
            >
              <Play size={12} /><span>Join Meeting</span>
            </button>
          ) : (
            <button disabled className="w-full px-4 py-2.5 rounded-xl text-sm font-semibold bg-gray-100 text-gray-400 cursor-not-allowed flex items-center justify-center space-x-2">
              <Clock size={12} /><span>Meeting Starts Soon</span>
            </button>
          )}
        </div>
      </div>
    );
  };

  // ─── Previous Card ───
  const PreviousCard = ({ videoCall }: { videoCall: VideoCall }) => {
    const { date, time } = formatDateTime(videoCall.startTime, videoCall.endTime);
    const statusConfig = getStatusConfig(videoCall.booking_status);

    const statusIcon = () => {
      switch (videoCall.booking_status) {
        case "COMPLETED": return <CheckCircle size={13} className="text-gray-400" />;
        case "CANCELLED": return <XCircle size={13} className="text-red-400" />;
        case "NOT_CONDUCTED": return <AlertCircle size={13} className="text-orange-400" />;
        default: return <Clock size={13} className="text-gray-400" />;
      }
    };

    const statusNote = () => {
      switch (videoCall.booking_status) {
        case "COMPLETED": return "Session completed";
        case "CANCELLED": return "Booking was cancelled";
        case "NOT_CONDUCTED": return "Session not conducted";
        default: return "";
      }
    };

    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
        <div className="p-5">
          {/* Header row: status badge + room id */}
          <div className="flex items-center justify-between mb-4">
            <div className={`flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${statusConfig.color}`}>
              <div className={`w-1.5 h-1.5 rounded-full mr-1.5 ${statusConfig.dot}`}></div>
              {statusConfig.label}
            </div>
            <p className="text-xs text-gray-400 font-mono">{videoCall.room_id}</p>
          </div>

          {/* Patient info — label : value */}
          <div className="space-y-2.5 mb-4">
            <div className="flex text-xs">
              <span className="text-gray-400 w-20 shrink-0">Patient</span>
              <span className="font-medium text-gray-800">{videoCall?.patient_name || "—"}</span>
            </div>
            <div className="flex text-xs">
              <span className="text-gray-400 w-20 shrink-0">Email</span>
              <span className="text-gray-700 truncate">{videoCall?.patient_email || "—"}</span>
            </div>
            <div className="flex text-xs">
              <span className="text-gray-400 w-20 shrink-0">Phone</span>
              <span className="text-gray-700">{videoCall?.patient_mobile || "—"}</span>
            </div>
            <div className="flex text-xs">
              <span className="text-gray-400 w-20 shrink-0">Address</span>
              <span className="text-gray-700">{videoCall?.patient_address || "—"}</span>
            </div>
            <div className="flex text-xs">
              <span className="text-gray-400 w-20 shrink-0">Date</span>
              <span className="text-gray-700">{date}</span>
            </div>
            <div className="flex text-xs">
              <span className="text-gray-400 w-20 shrink-0">Time</span>
              <span className="text-gray-700">{time}</span>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center gap-1.5 pt-3 border-t border-gray-100 text-xs text-gray-400">
            {statusIcon()}
            <span>{statusNote()}</span>
          </div>
        </div>
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
      (call?.booking_status === "ACTIVE" || call?.booking_status === "SCHEDULED") &&
      call?.expert_meeting_link
  );

  return (
    <div className="min-h-screen bg-gray-50 p-3">
      {/* Page Header */}
      <div className="px-4 py-4 sm:pt-5">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">Expert Video Call</h1>
        <p className="text-sm text-gray-500">Manage and track all your Expert Calls</p>
      </div>

      <div className="mx-auto px-4 pb-10 md:pb-20">

        {/* ─── Tab Bar ─── */}
        <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl w-fit mb-6">
          <button
            onClick={() => handleTabChange("upcoming")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${activeTab === "upcoming"
              ? "bg-white text-blue-600 shadow-sm"
              : "text-gray-500 hover:text-gray-700"
              }`}
          >
            <Video size={14} />
            Upcoming
            {availableCalls.length > 0 && (
              <span className={`text-xs font-semibold px-1.5 py-0.5 rounded-full ${activeTab === "upcoming" ? "bg-blue-50 text-blue-600" : "bg-gray-200 text-gray-500"}`}>
                {availableCalls.length}
              </span>
            )}
          </button>
          <button
            onClick={() => handleTabChange("previous")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${activeTab === "previous"
              ? "bg-white text-gray-800 shadow-sm"
              : "text-gray-500 hover:text-gray-700"
              }`}
          >
            <Clock size={14} />
            Previous
            {previousVideoCalls.length > 0 && (
              <span className={`text-xs font-semibold px-1.5 py-0.5 rounded-full ${activeTab === "previous" ? "bg-gray-100 text-gray-600" : "bg-gray-200 text-gray-500"}`}>
                {previousVideoCalls.length}
              </span>
            )}
          </button>
        </div>

        {/* ─── Upcoming Tab ─── */}
        {activeTab === "upcoming" && (
          <>
            <div className="flex justify-end mb-4">
              <span className="text-xs text-gray-400">Page {pagination.current_page} of {pagination.total_pages}</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {availableCalls.map((videoCall) => (
                <UpcomingCard key={videoCall.uuid} videoCall={videoCall} />
              ))}
            </div>

            {availableCalls.length === 0 && (
              <div className="text-center py-16 bg-white rounded-2xl border border-gray-200">
                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4 mx-auto">
                  <Video size={28} className="text-gray-400" />
                </div>
                <h3 className="text-base font-semibold text-gray-900 mb-1">No Upcoming Meetings</h3>
                <p className="text-gray-400 text-sm">There are no active or upcoming meetings at the moment.</p>
              </div>
            )}

          </>
        )}

        {/* ─── Previous Tab ─── */}
        {activeTab === "previous" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {previousVideoCalls.length > 0 ? (
              previousVideoCalls.map((videoCall) => (
                <PreviousCard key={videoCall.uuid} videoCall={videoCall} />
              ))
            ) : (
              <div className="col-span-full text-center py-16 bg-white rounded-2xl border border-gray-200">
                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4 mx-auto">
                  <Clock size={28} className="text-gray-400" />
                </div>
                <h3 className="text-base font-semibold text-gray-900 mb-1">No Previous Bookings</h3>
                <p className="text-gray-400 text-sm">Your past consultations will appear here.</p>
              </div>
            )}
          </div>
        )}

        {/* ─── Pagination — shown for both tabs, only when total_pages > 1 ─── */}
        <Pagination />

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