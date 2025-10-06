import React from 'react';
import { X, Clock, MapPin, Video, Home, User, CheckCircle, AlertTriangle } from 'lucide-react';
import { Slot } from '@/types/common';

interface ViewModalProps {
  showViewModal: boolean;
  setShowViewModal: (show: boolean) => void;
  viewingSlot: Slot | null;
}

const ViewModal: React.FC<ViewModalProps> = ({
  showViewModal,
  setShowViewModal,
  viewingSlot,
}) => {
  if (!showViewModal || !viewingSlot) return null;

  // 📅 Date Formatter
  const formatDate = (dateTime: string) => {
    return new Date(dateTime).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  // ⏰ Time Formatter
  const convertTo12HourFormat = (utcDateString: string) => {
    const date = new Date(utcDateString);
    let hours = date.getUTCHours();
    const minutes = date.getUTCMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;

    const hh = String(hours).padStart(2, '0');
    const mm = String(minutes).padStart(2, '0');
    return `${hh}:${mm} ${ampm}`;
  };

  // 🎨 Status Badge Style
  const getStatusBadge = (status: string) => {
    const base = 'px-3 py-1 rounded-full text-xs font-semibold';
    switch (status) {
      case 'APPROVED':
        return `${base} bg-green-100 text-green-700`;
      case 'PENDING':
        return `${base} bg-yellow-100 text-yellow-700`;
      case 'REJECTED':
        return `${base} bg-red-100 text-red-700`;
      default:
        return `${base} bg-gray-100 text-gray-700`;
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-fadeIn">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h2 className="text-xl font-semibold text-gray-800">Slot Details</h2>
          <button
            onClick={() => setShowViewModal(false)}
            className="w-9 h-9 flex items-center justify-center text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          {/* Clinic & Status */}
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900">{viewingSlot.clinic_name}</h3>
            <span className={getStatusBadge(viewingSlot.status)}>{viewingSlot.status}</span>
          </div>

          {/* Slot Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-blue-500" />
              <div>
                <p className="text-xs text-gray-500">Start</p>
                <p className="font-medium text-gray-800 text-sm">
                  {formatDate(viewingSlot.start_time)}, {convertTo12HourFormat(viewingSlot.start_time)}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-red-500" />
              <div>
                <p className="text-xs text-gray-500">End</p>
                <p className="font-medium text-gray-800 text-sm">
                  {formatDate(viewingSlot.end_time)}, {convertTo12HourFormat(viewingSlot.end_time)}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <User className="w-5 h-5 text-purple-500" />
              <div>
                <p className="text-xs text-gray-500">Max Bookings</p>
                <p className="font-medium text-gray-800">{viewingSlot.max_bookings}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <User className="w-5 h-5 text-green-500" />
              <div>
                <p className="text-xs text-gray-500">Available Slots</p>
                <p className="font-medium text-gray-800">{viewingSlot.available_slots}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <User className="w-5 h-5 text-pink-500" />
              <div>
                <p className="text-xs text-gray-500">Female Doctors</p>
                <p className="font-medium text-gray-800">{viewingSlot.female_doctor_count}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <User className="w-5 h-5 text-gray-600" />
              <div>
                <p className="text-xs text-gray-500">Created By</p>
                <p className="font-medium text-gray-800 text-sm">{viewingSlot.created_by}</p>
              </div>
            </div>
          </div>

          {/* Visit Types */}
          <div>
            <p className="text-xs text-gray-500 mb-2">Visit Types</p>
            <div className="flex flex-wrap gap-3">
              {viewingSlot.is_physical_visit && (
                <span className="flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm">
                  <MapPin className="w-4 h-4" /> Physical Visit
                </span>
              )}
              {viewingSlot.is_video_call && (
                <span className="flex items-center gap-2 px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm">
                  <Video className="w-4 h-4" /> Video Call
                </span>
              )}
              {viewingSlot.is_home_visit && (
                <span className="flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-sm">
                  <Home className="w-4 h-4" /> Home Visit
                </span>
              )}
            </div>
          </div>

          {/* Rejection Reason */}
          {viewingSlot.reason_for_rejection && (
            <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-100 rounded-xl">
              <AlertTriangle className="w-5 h-5 text-red-500 mt-1" />
              <div>
                <p className="text-sm font-semibold text-red-700">Reason for Rejection</p>
                <p className="text-sm text-red-600">{viewingSlot.reason_for_rejection}</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end">
          <button
            onClick={() => setShowViewModal(false)}
            className="px-5 py-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-100 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewModal;
