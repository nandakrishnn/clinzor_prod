"use client";

import {
  Calendar,
  Clock,
  MapPin,
  Eye,
  X,
  CreditCard,
  User,
  Laptop
} from "lucide-react";
import { useEffect, useState } from "react";
import {
  cancelBookingService,
  getBookingService
} from "@/service/user/profileService";
import type { Booking } from "@/types/user";
import BookingDetailsModal from "./BookingDetailsModal";
import { BookingsSkeleton } from "../skeltons/user/LoadingSkeleton";
import { toast } from "sonner";
import { ConfirmationModal } from "../common/ConfirmationModal";
import { convertTo12HourFormat, formatLocalDate } from "@/utils/formatters";
import { Money } from "@mui/icons-material";
import { IconCash } from "@tabler/icons-react";

interface defaultProps {
  defaultTab?: "PENDING" | "SCHEDULED" | "COMPLETED";
}

export default function MyBookings({ defaultTab = "SCHEDULED" }: defaultProps) {
  const [activeTab, setActiveTab] = useState<
    "PENDING" | "SCHEDULED" | "COMPLETED"
  >(defaultTab);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bookings, setBookings] = useState<any[]>([]);
  const [isLoading, setLoading] = useState(true);
  const [cancelingId, setCancelingId] = useState<string | null>(null); // track cancel loading
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState("");

  const [currentTime, setCurrentTime] = useState(new Date());

  const formatDate = (isoDate: string) => {
    if (!isoDate) return "-";
    return new Date(isoDate).toLocaleString("en-IN", {
      dateStyle: "medium"
    });
  };

  const getBookings = async () => {
    try {
      setLoading(true);
      const res = await getBookingService(activeTab);
      if (res.status === 200) {
        setBookings(res?.data?.data || []);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const cancelBooking = async (id: string) => {
    setIsConfirming(true);

    try {
      setCancelingId(id);
      const status = "CANCELED";
      const res = await cancelBookingService(id, status);
      if (res.status === 200) {
        setBookings((prev) => prev.filter((b) => b.uuid !== id));
        toast(res?.message || "Successfully Cancelled The Booking");
      }
    } catch (error: any) {
      toast(
        error?.response?.data?.message ||
          "Currently we unable to cancel please try again later."
      );
      console.log(error);
    } finally {
      setCancelingId(null); // reset loading state
      setIsConfirming(false);
      setShowConfirmModal(false);
    }
  };

  useEffect(() => {
    getBookings();
  }, [activeTab]);

  const handleViewDetails = (booking: Booking) => {
    setSelectedBooking(booking);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedBooking(null);
  };

  const handleConfirmBooking = (id: any) => {
    setShowConfirmModal(true);
    setSelectedBookingId(id);
  };

  // Function to check if join button should be shown
  const shouldShowJoinButton = (booking: any) => {
    const startTime = new Date(booking.start_time);
    const endTime = new Date(booking.end_time);

    // Show button 5 minutes before start time until end time
    const fiveMinutesBeforeStart = new Date(startTime.getTime() - 5 * 60000);

    return currentTime >= fiveMinutesBeforeStart && currentTime <= endTime;
  };

  if (isLoading) return <BookingsSkeleton />;
  return (
    <section>
      <div className="bg-card rounded-xl shadow-sm border border-border p-5 md:p-8">
        <h2 className="text-2xl font-bold text-foreground mb-5">My Bookings</h2>

        {/* Tabs */}
        <div className="flex flex-wrap gap-1 mb-4 bg-background/50 p-1 rounded-lg border border-border">
          {["PENDING", "SCHEDULED", "COMPLETED"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                activeTab === tab
                  ? "bg-primaryColor text-white shadow-sm border border-border"
                  : "text-muted-foreground hover:text-foreground hover:bg-background/80"
              }`}
            >
              {tab === "PENDING"
                ? "Incomplete"
                : tab === "SCHEDULED"
                ? "Upcoming"
                : "Completed"}
            </button>
          ))}
        </div>

        {/* Bookings */}
        <div className="space-y-6">
          {bookings?.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-muted-foreground text-lg mb-2 uppercase">
                No {activeTab} bookings
              </div>
              <p className="text-sm text-muted-foreground">
                {activeTab === "COMPLETED" &&
                  "All your bookings are confirmed or completed."}
                {activeTab === "SCHEDULED" &&
                  "You don't have any upcoming bookings."}
                {activeTab === "PENDING" &&
                  "You haven't completed any bookings yet."}
              </p>
            </div>
          ) : (
            bookings.map((booking) => (
              <div
                key={booking.uuid}
                className="bg-background/50 border border-border rounded-lg p-6 hover:shadow-md transition-all duration-200"
              >
                {/* Header: Clinic + Status */}
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div className="flex-1 space-y-2">
                    <h3 className="font-semibold text-foreground text-lg">
                      {booking?.clinic_name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Service:{" "}
                      {booking?.service_default_name || "Not specified"}
                    </p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <User size={14} />
                      <span>{booking?.patient_name}</span>
                    </div>
                  </div>

                  <span
                    className={`px-3 py-1.5 rounded-full text-xs font-medium self-start ${
                      booking?.booking_status === "COMPLETED"
                        ? "bg-accent/20 text-accent border border-accent/30"
                        : booking?.booking_status === "PENDING"
                        ? "bg-secondary/20 text-secondary border border-secondary/30"
                        : "bg-primary/20 text-primary border border-primary/30"
                    }`}
                  >
                    {booking?.booking_status}
                  </span>
                </div>

                {/* Info Section */}
                <div className="mt-4 flex flex-wrap items-center gap-5 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Calendar size={16} />
                    <span>{`${formatDate(
                      booking?.start_time
                    )}, ${convertTo12HourFormat(booking?.start_time)}`}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock size={16} />
                    <span>{`${formatDate(
                      booking?.end_time
                    )}, ${convertTo12HourFormat(booking?.end_time)}`}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin size={16} />
                    <span>{booking?.session_type}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <IconCash size={18} />
                    Payment Status :
                    <span
                      className={
                        booking?.payment_status === "FAILED"
                          ? "text-destructive"
                          : "text-green-600"
                      }
                    >
                      {booking?.payment_status}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                {/* Actions */}
<div className="flex flex-col md:flex-row justify-between items-center">
  <div className="mt-4 flex flex-wrap gap-3">
    <div className="space-y-3">
      {/* Embedded Map */}
      <iframe
        className="w-full h-64 rounded-lg border hidden"
        loading="lazy"
        allowFullScreen
        referrerPolicy="no-referrer-when-downgrade"
        src={booking?.clinic_map_link || ""}
      />

      {/* Link - Convert embed URL to regular maps URL */}
      
       <a className="inline-flex items-center gap-2 text-primary text-sm font-medium hover:text-primary/80 transition-colors"
        href={booking?.clinic_map_link?.replace('/maps/embed', '/maps') || ""}
        target="_blank"
        rel="noopener noreferrer"
      >
        <MapPin size={16} />
        View Clinic Location
      </a>
    </div>
    
    <button
      onClick={() => handleViewDetails(booking)}
      className="inline-flex items-center gap-2 text-primary text-sm font-medium hover:text-primary/80 transition-colors"
    >
      <Eye size={14} />
      View Details
    </button>
    
    {activeTab === "SCHEDULED" && (
      <button
        onClick={() => handleConfirmBooking(booking?.uuid)}
        disabled={cancelingId === booking?.uuid}
        className="inline-flex items-center gap-2 bg-red-500 rounded text-white px-4 p-2 text-destructive text-sm font-medium hover:text-destructive/80 transition-colors disabled:opacity-50"
      >
        {cancelingId === booking?.uuid ? (
          <>
            <span className="animate-spin border-2 border-destructive border-t-transparent rounded-full w-4 h-4" />
            Canceling...
          </>
        ) : (
          <>
            <X size={14} />
            Cancel Booking
          </>
        )}
      </button>
    )}
  </div>
  
  {/* Conditional Join Button */}
  {booking.booking_type === "VIDEO_CALL" &&
    booking.booking_status === "SCHEDULED" &&
    shouldShowJoinButton(booking) && (
      
      <a  href={`${booking?.customer_meeting_link}`}
        target="_blank"
        className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium hover:bg-primary/90 transition-colors mt-4"
      >
        <Laptop size={14} />
        Join Now
      </a>
    )}
</div>
              </div>
            ))
          )}
        </div>
      </div>

      <BookingDetailsModal
        booking={selectedBooking}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />

      <ConfirmationModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={() => cancelBooking(selectedBookingId)}
        title="Cancel Booking"
        message="Are you sure you want to cancel this booking? This action cannot be undone."
        confirmText="Cancel Booking"
        isLoading={isConfirming}
      />
    </section>
  );
}
