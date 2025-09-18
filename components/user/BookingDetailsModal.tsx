"use client"

import {
  X,
  Calendar,
  Clock,
  MapPin,
  User,
  CreditCard,
  Mail,
  Phone,
  Info,
} from "lucide-react"
import type { Booking } from "@/types/user"

export default function BookingDetailsModal({ booking, isOpen, onClose }: { booking: any; isOpen: boolean; onClose: () => void }) {
  if (!isOpen || !booking) return null

  const formatDate = (isoDate: string) => {
    if (!isoDate) return "-"
    return new Date(isoDate).toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    })
  }

  const getStatusClasses = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return "bg-green-100 text-green-800"
      case "PENDING":
        return "bg-yellow-100 text-yellow-800"
      case "CANCELLED":
        return "bg-red-100 text-red-800"
      default:
        return "bg-blue-100 text-blue-800"
    }
  }

  console.log(booking)
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-in zoom-in-95 hide-scrollbar">

        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between p-6 border-b border-gray-200 bg-white rounded-t-2xl">
          <h2 className="text-2xl font-bold text-gray-900">Booking Details</h2>
          <button onClick={onClose} className="p-2 transition-colors rounded-full hover:bg-gray-100">
            <X size={24} className="text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">

          {/* Booking Summary */}
          <div className="p-5 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Info size={18} className="text-primaryColor" />
              Booking Summary
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Calendar size={20} className="text-primaryColor" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Date</p>
                  <p className="font-medium text-gray-900">{formatDate(booking?.start_time)}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Clock size={20} className="text-primaryColor" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">End Time</p>
                  <p className="font-medium text-gray-900">{formatDate(booking?.end_time)}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <MapPin size={20} className="text-primaryColor" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Session Type</p>
                  <p className="font-medium text-gray-900">{booking?.booking_type}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <CreditCard size={20} className="text-primaryColor" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Amount</p>
                  <p className="font-medium text-gray-900">₹ {booking?.booking_charge}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Service Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Service Details</h3>
            <div className="p-4 border border-gray-200 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">{booking?.clinic_name}</h4>
              <p className="text-sm text-gray-600">Service: {booking?.service_default_name}</p>
            </div>
          </div>

          {/* Customer Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Customer Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg">
                <div className="p-2 bg-green-100 rounded-lg">
                  <User size={18} className="text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Customer Name</p>
                  <p className="font-medium text-gray-900">{booking?.patient_name}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Mail size={18} className="text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium text-gray-900">{booking?.patient_email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Phone size={18} className="text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="font-medium text-gray-900">{booking?.patient_mobile}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <CreditCard size={18} className="text-primaryColor" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Payment</p>
                  <p className="font-medium text-gray-900">
                    {booking?.payment_mode} ({booking?.payment_status})
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Status and Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center gap-3 mb-4 sm:mb-0">
              <span className="text-sm font-medium text-gray-700">Status:</span>
              <span className={`px-3 py-1.5 rounded-full text-xs font-medium ${getStatusClasses(booking?.booking_status)}`}>
                {booking?.booking_status}
              </span>
            </div>
            {/* <div className="flex gap-3">
              {booking?.booking_status !== "COMPLETED" && booking?.booking_status !== "CANCELLED" && booking?.payment_status !== "FAILED" && (
                <button className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors">
                  Cancel Booking
                </button>
              )}
            </div> */}
          </div>
        </div>
      </div>
    </div>
  )
}
