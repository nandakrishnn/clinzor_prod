import React from "react";
import {
  Clock,
  Users,
  Stethoscope,
  Edit,
  Trash2,
  Eye,
  AlertCircle,
  Calendar
} from "lucide-react";
import { Slot } from "@/types/common";

interface SlotsGridProps {
  slots: Slot[];
  loading: boolean;
  getServiceName: (serviceId: string) => string;
  handleEdit: (slot: Slot) => void;
  handleDelete: (uuid: string) => void;
  handleView: (slot: Slot) => void;
}

const SlotsGrid: React.FC<SlotsGridProps> = ({
  slots,
  loading,
  handleEdit,
  handleDelete,
  handleView
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "APPROVED":
        return "bg-green-50 text-green-700 border-green-200";
      case "PENDING":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "REJECTED":
        return "bg-red-50 text-red-700 border-red-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const getAvailabilityColor = (available: number, max: number) => {
    const ratio = available / max;
    if (ratio === 1) return "text-green-600";
    if (ratio > 0.5) return "text-blue-600";
    if (ratio > 0) return "text-amber-600";
    return "text-red-600";
  };

  const formatDate = (dateTime: string) => {
    return new Date(dateTime).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric"
    });
  };

  const convertTo12HourFormat = (utcDateString: string) => {
    const date = new Date(utcDateString);

    // Use UTC methods to get the original UTC time components
    let hours = date.getUTCHours();
    const minutes = date.getUTCMinutes();

    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'

    const hh = String(hours).padStart(2, "0");
    const mm = String(minutes).padStart(2, "0");

    return `${hh}:${mm} ${ampm}`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (slots.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 p-8 sm:p-12 text-center">
        <Calendar className="w-10 h-10 sm:w-12 sm:h-12 text-gray-300 mx-auto mb-4" />
        <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">
          No slots found
        </h3>
        <p className="text-gray-500 mb-4 sm:mb-6 text-sm sm:text-base">
          Try adjusting your search or filter criteria
        </p>
      </div>
    );
  }

  console.log(slots);
  return (
    <div className="grid gap-3 sm:gap-4">
      {slots.map((slot) => (
        <div
          key={slot.uuid}
          className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-6 hover:shadow-md transition-shadow duration-200"
        >
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 md:gap-0">
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-6 w-full">
              <div className="flex items-center space-x-3 w-full sm:w-auto">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                  <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900 text-sm sm:text-base">
                    {formatDate(slot.start_time)}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-500">
                    {convertTo12HourFormat(slot.start_time)} -{" "}
                    {convertTo12HourFormat(slot.end_time)}
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-3 w-full sm:w-auto">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-50 rounded-xl flex items-center justify-center">
                  <Stethoscope className="w-5 h-5 sm:w-6 sm:h-6 text-purple-500" />
                </div>
                <div>
                  <div className="font-medium text-gray-900 text-sm sm:text-base">
                    {slot.slot_type}
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-3 w-full sm:w-auto">
                <div
                  className={`font-semibold ${getAvailabilityColor(
                    slot.available_slots,
                    slot.max_bookings
                  )} text-sm sm:text-base`}
                >
                  {slot.available_slots}/{slot.max_bookings}
                </div>
                <div className="text-xs sm:text-sm text-gray-500">
                  Available
                </div>
              </div>

              <div>
                <span
                  className={`inline-flex px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium border ${getStatusColor(
                    slot.status
                  )}`}
                >
                  {slot.status}
                </span>
                {slot.reason_for_rejection && (
                  <div className="flex items-center space-x-1 mt-1">
                    <AlertCircle className="w-3 h-3 text-red-500" />
                    <span className="text-xs text-red-600">
                      {slot.reason_for_rejection}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-1 sm:space-x-2 mt-2 md:mt-0">
              <button
                onClick={() => handleEdit(slot)}
                className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center text-blue-600 hover:bg-blue-50 rounded-xl transition-colors duration-200"
              >
                <Edit className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDelete(slot.uuid)}
                className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center text-red-600 hover:bg-red-50 rounded-xl transition-colors duration-200"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleView(slot)}
                className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center text-blue-600 hover:bg-blue-50 rounded-xl transition-colors duration-200"
              >
                <Eye className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SlotsGrid;
