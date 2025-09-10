"use client"

import { Calendar, Clock, MapPin, Eye, X } from "lucide-react"
import { useEffect, useState } from "react"
import { getBookingService } from "@/service/user/profileService"
import type { Booking } from "@/types/user"
import BookingDetailsModal from "./BookingDetailsModal"

export default function MyBookings() {
  const [activeTab, setActiveTab] = useState<"PENDING" | "SHEDULED" | "COMPLETED">("SHEDULED")
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [bookings, setBookings] = useState<any>();
  const [isLoading, setLoading] = useState(true)

  const getBookings = async () => {
    try {
      const res = await getBookingService(activeTab);
      console.log(res)
      if (res.status === 200) {
        setBookings(res?.data?.data)
      }
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getBookings()
  }, [activeTab])

  const handleViewDetails = (booking: Booking) => {
    setSelectedBooking(booking)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedBooking(null)
  }

  return (
    <>
      <div className="bg-card rounded-xl shadow-sm border border-border p-8">
        <h2 className="text-2xl font-bold text-foreground mb-5">My Bookings</h2>

        <div className="flex flex-wrap gap-1 mb-4 bg-background/50 p-1 rounded-lg border border-border">
          <button
            onClick={() => setActiveTab("PENDING")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${activeTab === "PENDING"
              ? "bg-primaryColor text-white shadow-sm border border-border"
              : "text-muted-foreground hover:text-foreground hover:bg-background/80"
              }`}
          >
            Incomplete
          </button>
          <button
            onClick={() => setActiveTab("SHEDULED")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${activeTab === "SHEDULED"
              ? "bg-primaryColor text-white shadow-sm border border-border"
              : "text-muted-foreground hover:text-foreground hover:bg-background/80"
              }`}
          >
            Upcoming
          </button>
          <button
            onClick={() => setActiveTab("COMPLETED")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${activeTab === "COMPLETED"
              ? "bg-primaryColor text-white shadow-sm border border-border"
              : "text-muted-foreground hover:text-foreground hover:bg-background/80"
              }`}
          >
            Completed
          </button>
        </div>

        <div className="space-y-6">
          {bookings?.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-muted-foreground text-lg mb-2 capitalize">No {activeTab} bookings</div>
              <p className="text-sm text-muted-foreground">
                {activeTab === "COMPLETED" && "All your bookings are confirmed or completed."}
                {activeTab === "SHEDULED" && "You don't have any upcoming bookings."}
                {activeTab === "PENDING" && "You haven't completed any bookings yet."}
              </p>
            </div>
          ) : (
            bookings?.map((booking: any) => (
              <div
                key={booking.uuid}
                className="bg-background/50 border border-border rounded-lg p-6 hover:shadow-md transition-all duration-200"
              >
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div className="flex-1 space-y-3">
                    <h3 className="font-semibold text-foreground text-lg leading-tight">{booking?.clinic_name}</h3>

                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Calendar size={16} />
                        <span>{booking?.start_time}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock size={16} />
                        <span>{booking?.start_time}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin size={16} />
                        <span>{booking?.session_type}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className={`px-3 py-1.5 rounded-full text-xs font-medium ${booking?.booking_status === "COMPLETED"
                        ? "bg-accent/20 text-accent border border-accent/30"
                        : booking?.booking_status === "PENDING"
                          ? "bg-secondary/20 text-secondary border border-secondary/30"
                          : "bg-destructive/20 text-destructive border border-destructive/30"
                        }`}
                    >
                      {booking?.booking_status}
                    </span>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-3">
                  <button
                    onClick={() => handleViewDetails(booking)}
                    className="inline-flex items-center gap-2 text-primary text-sm font-medium hover:text-primary/80 transition-colors"
                  >
                    <Eye size={14} />
                    View Details
                  </button>
                  {activeTab !== "COMPLETED" && (
                    <button className="inline-flex items-center gap-2 text-destructive text-sm font-medium hover:text-destructive/80 transition-colors">
                      <X size={14} />
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <BookingDetailsModal booking={selectedBooking} isOpen={isModalOpen} onClose={handleCloseModal} />
    </>
  )
}
