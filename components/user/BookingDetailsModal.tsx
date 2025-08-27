"use client"

import { X, Calendar, Clock, MapPin, User, CreditCard, Mail, Phone, Info, Download } from "lucide-react"
import type { Booking } from "@/types/user"

interface BookingDetailsModalProps {
  booking: Booking | null
  isOpen: boolean
  onClose: () => void
}

export default function BookingDetailsModal({ booking, isOpen, onClose }: BookingDetailsModalProps) {
  if (!isOpen || !booking) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-in zoom-in-95 hide-scrollbar">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between p-6 border-b border-gray-200 bg-white rounded-t-2xl">
          <h2 className="text-2xl font-bold text-gray-900">Booking Details</h2>
          <button
            onClick={onClose}
            className="p-2 transition-colors rounded-full hover:bg-gray-100"
          >
            <X size={24} className="text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Booking Summary */}
          <div className="p-5 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Info size={18} className="text-blue-600" />
              Booking Summary
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Calendar size={20} className="text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Date</p>
                  <p className="font-medium text-gray-900">{booking.date}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Clock size={20} className="text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Time</p>
                  <p className="font-medium text-gray-900">{booking.time}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <MapPin size={20} className="text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Location</p>
                  <p className="font-medium text-gray-900">{booking.location}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <CreditCard size={20} className="text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Amount</p>
                  <p className="font-medium text-gray-900">
                    {booking.payment.currency} {booking.payment.amount.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Service Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Service Details</h3>
            <div className="p-4 border border-gray-200 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">{booking.title}</h4>
              {booking.notes && (
                <p className="text-gray-600 mt-2">
                  <span className="font-medium">Additional Notes:</span> {booking.notes}
                </p>
              )}
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
                  <p className="font-medium text-gray-900">{booking.customer.name}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Mail size={18} className="text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium text-gray-900">{booking.customer.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Phone size={18} className="text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="font-medium text-gray-900">{booking.customer.phone}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <CreditCard size={18} className="text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Payment Method</p>
                  <p className="font-medium text-gray-900">Credit Card •••• 4567</p>
                </div>
              </div>
            </div>
          </div>

          {/* Status and Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center gap-3 mb-4 sm:mb-0">
              <span className="text-sm font-medium text-gray-700">Status:</span>
              <span
                className={`px-3 py-1.5 rounded-full text-xs font-medium ${
                  booking.status === "Confirmed"
                    ? "bg-green-100 text-green-800"
                    : booking.status === "Pending"
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {booking.status}
              </span>
            </div>
            <div className="flex gap-3">
              <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                <Download size={16} />
                Download Invoice
              </button>
              {booking.status !== "Cancelled" && (
                <button className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors">
                  Cancel Booking
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}