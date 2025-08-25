"use client"

import type { MyBookingsProps } from "@/types/user"
import { Calendar, Clock, MapPin, Eye, X } from "lucide-react"
import { useState } from "react"

export default function MyBookings({ bookings }: MyBookingsProps) {
  const [activeTab, setActiveTab] = useState<"incomplete" | "upcoming" | "completed">("upcoming")

  const filteredBookings = bookings.filter((booking) => {
    const bookingDate = new Date(booking.date)
    const today = new Date()

    switch (activeTab) {
      case "incomplete":
        return booking.status === "Pending" || booking.status === "Cancelled"
      case "upcoming":
        return booking.status === "Confirmed" && bookingDate >= today
      case "completed":
        return booking.status === "Confirmed" && bookingDate < today
      default:
        return true
    }
  })

  return (
    <div className="bg-card rounded-xl shadow-sm border border-border p-8">
      <h2 className="text-2xl font-bold text-foreground mb-5">My Bookings</h2>

      <div className="flex flex-wrap gap-1 mb-4 bg-background/50 p-1 rounded-lg border border-border">
        <button
          onClick={() => setActiveTab("incomplete")}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
            activeTab === "incomplete"
              ? "bg-primaryColor text-white shadow-sm border border-border"
              : "text-muted-foreground hover:text-foreground hover:bg-background/80"
          }`}
        >
          Incomplete ({bookings.filter((b) => b.status === "Pending" || b.status === "Cancelled").length})
        </button>
        <button
          onClick={() => setActiveTab("upcoming")}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
            activeTab === "upcoming"
              ? "bg-primaryColor text-white shadow-sm border border-border"
              : "text-muted-foreground hover:text-foreground hover:bg-background/80"
          }`}
        >
          Upcoming ({bookings.filter((b) => b.status === "Confirmed" && new Date(b.date) >= new Date()).length})
        </button>
        <button
          onClick={() => setActiveTab("completed")}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
            activeTab === "completed"
              ? "bg-primaryColor text-white shadow-sm border border-border"
              : "text-muted-foreground hover:text-foreground hover:bg-background/80"
          }`}
        >
          Completed ({bookings.filter((b) => b.status === "Confirmed" && new Date(b.date) < new Date()).length})
        </button>
      </div>

      <div className="space-y-6">
        {filteredBookings.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-muted-foreground text-lg mb-2">No {activeTab} bookings</div>
            <p className="text-sm text-muted-foreground">
              {activeTab === "incomplete" && "All your bookings are confirmed or completed."}
              {activeTab === "upcoming" && "You don't have any upcoming bookings."}
              {activeTab === "completed" && "You haven't completed any bookings yet."}
            </p>
          </div>
        ) : (
          filteredBookings.map((booking) => (
            <div
              key={booking.id}
              className="bg-background/50 border border-border rounded-lg p-6 hover:shadow-md transition-all duration-200"
            >
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div className="flex-1 space-y-3">
                  <h3 className="font-semibold text-foreground text-lg leading-tight">{booking.title}</h3>

                  <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Calendar size={16} />
                      <span>{booking.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock size={16} />
                      <span>{booking.time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin size={16} />
                      <span>{booking.location}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={`px-3 py-1.5 rounded-full text-xs font-medium ${
                      booking.status === "Confirmed"
                        ? "bg-accent/20 text-accent border border-accent/30"
                        : booking.status === "Pending"
                          ? "bg-secondary/20 text-secondary border border-secondary/30"
                          : "bg-destructive/20 text-destructive border border-destructive/30"
                    }`}
                  >
                    {booking.status}
                  </span>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-3">
                <button className="inline-flex items-center gap-2 text-primary text-sm font-medium hover:text-primary/80 transition-colors">
                  <Eye size={14} />
                  View Details
                </button>
                {activeTab !== "completed" && (
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
  )
}
