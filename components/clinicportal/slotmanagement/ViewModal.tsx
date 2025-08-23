import React from 'react';
import { X } from 'lucide-react';
import { Slot } from '@/types/common';

interface ViewModalProps {
  showViewModal: boolean;
  setShowViewModal: (show: boolean) => void;
  viewingSlot: Slot | null;
  getServiceName: (serviceId: string) => string;
}

const ViewModal: React.FC<ViewModalProps> = ({
  showViewModal,
  setShowViewModal,
  viewingSlot,
  getServiceName
}) => {
  const formatDateTime = (dateTime: string) => {
    return new Date(dateTime).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  if (!showViewModal || !viewingSlot) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md max-h-[95vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Slot Details</h2>
            <button
              onClick={() => setShowViewModal(false)}
              className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
        <div className="p-6 space-y-4">
          <div><span className="font-bold">Service:</span> {getServiceName(viewingSlot.clinic_service)}</div>
          <div><span className="font-bold">Start Time:</span> {formatDateTime(viewingSlot.start_time)}</div>
          <div><span className="font-bold">End Time:</span> {formatDateTime(viewingSlot.end_time)}</div>
          <div><span className="font-bold">Max Bookings:</span> {viewingSlot.max_bookings}</div>
          <div><span className="font-bold">Available Slots:</span> {viewingSlot.available_slots}</div>
          <div><span className="font-bold">Status:</span> {viewingSlot.status}</div>
          {viewingSlot.reason_for_rejection && (
            <div><span className="font-bold">Reason for Rejection:</span> {viewingSlot.reason_for_rejection}</div>
          )}
        </div>
        <div className="p-6 border-t border-gray-200 flex space-x-3">
          <button
            onClick={() => setShowViewModal(false)}
            className="flex-1 px-4 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 font-medium transition-colors duration-200"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewModal;