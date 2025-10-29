import React, { useState } from 'react';
import { X, Save, Loader, Calendar } from 'lucide-react';
import { Slot } from '@/types/common';
import { editClinicSlot } from '@/service/clinic/slotManagementService';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

interface EditModalProps {
  showEditModal: boolean;
  setShowEditModal: (show: boolean) => void;
  editingSlot: Slot | null;
  setEditingSlot: (slot: Slot | null) => void;
  showNotification: (type: "success" | "error" | "warning", message: string) => void;
  fetchSlots: () => void;
}

const EditModal: React.FC<EditModalProps> = ({
  showEditModal,
  setShowEditModal,
  editingSlot,
  setEditingSlot,
  showNotification,
  fetchSlots
}) => {
  const [isLoading, setIsLoading] = useState(false);

  if (!showEditModal || !editingSlot) return null;

  // Helper function to update editingSlot
  const updateEditingSlot = (updates: Partial<Slot>) => {
    if (editingSlot) {
      setEditingSlot({ ...editingSlot, ...updates });
    }
  };

  // Convert UTC time from backend to local Date object for DatePicker
  const convertUTCToLocal = (utcString: string) => {
    if (!utcString) return null;
    const date = new Date(utcString);
    // Create a new date with local timezone but same UTC time
    return new Date(date.getTime() + date.getTimezoneOffset() * 60000);
  };

  // Convert local Date object back to UTC string for backend
  const convertLocalToUTC = (localDate: Date | null) => {
    if (!localDate) return '';
    // Convert local date to UTC string in the required format
    const utcDate = new Date(localDate.getTime() - localDate.getTimezoneOffset() * 60000);
    return utcDate.toISOString();
  };

  const handleSave = async () => {
    if (!editingSlot || !editingSlot.uuid) return;

    setIsLoading(true);
    try {
      // Prepare the data for API call based on the required body structure
      const slotData = {
        start_time: editingSlot.start_time,
        end_time: editingSlot.end_time,
        slot_type: editingSlot.slot_type,
        max_bookings: editingSlot.max_bookings,
        female_doctor_count: editingSlot.female_doctor_count || 0
      };

      await editClinicSlot(editingSlot.uuid, slotData);

      showNotification('success', 'Slot updated successfully');
      fetchSlots(); // Refresh the slots list
      setShowEditModal(false);
      setEditingSlot(null);
    } catch (error: any) {
      console.error('Failed to update slot:', error);
      const errorMessage = error.response?.data?.message || 'Failed to update slot';
      showNotification('error', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Custom input component for better styling
  const CustomDateTimeInput = ({ value, onClick, onChange, placeholder }: any) => (
    <div className="relative">
      <input
        type="text"
        className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
        value={value}
        onClick={onClick}
        onChange={onChange}
        placeholder={placeholder}
        readOnly
      />
      <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
        <Calendar className="w-4 h-4 text-gray-400" />
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md max-h-[95vh] overflow-y-auto hide-scrollbar">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Edit Slot</h2>
            <button
              onClick={() => setShowEditModal(false)}
              className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 rounded-lg"
              disabled={isLoading}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Start Time</label>
            <DatePicker
              selected={convertUTCToLocal(editingSlot.start_time)}
              onChange={(date: Date | null) => updateEditingSlot({
                start_time: convertLocalToUTC(date)
              })}
              showTimeSelect
              timeFormat="h:mm aa"
              timeIntervals={15}
              dateFormat="MMMM d, yyyy h:mm aa"
              placeholderText="Select start date and time"
              customInput={<CustomDateTimeInput placeholder="Select start date and time" />}
              wrapperClassName="w-full"
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">End Time</label>
            <DatePicker
              selected={convertUTCToLocal(editingSlot.end_time)}
              onChange={(date: Date | null) => updateEditingSlot({
                end_time: convertLocalToUTC(date)
              })}
              showTimeSelect
              timeFormat="h:mm aa"
              timeIntervals={15}
              dateFormat="MMMM d, yyyy h:mm aa"
              placeholderText="Select end date and time"
              customInput={<CustomDateTimeInput placeholder="Select end date and time" />}
              wrapperClassName="w-full"
              disabled={isLoading}
            />
          </div>

          {/* Commented out slot type field for now - will use backend value */}
          {/* <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Slot Type</label>
            <select
              value={editingSlot.slot_type || 'PHYSICAL_OR_VIDEO'}
              onChange={(e) => updateEditingSlot({ 
                slot_type: e.target.value as 'HOME_VISIT' | 'PHYSICAL_OR_VIDEO' 
              })}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={isLoading}
            >
              <option value="PHYSICAL_OR_VIDEO">Physical or Video</option>
              <option value="HOME_VISIT">Home Visit</option>
            </select>
          </div> */}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Max Bookings</label>
            <input
              type="number"
              value={editingSlot.max_bookings}
              onChange={(e) => updateEditingSlot({
                max_bookings: parseInt(e.target.value) || 0
              })}
              min="1"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Female Doctor Count</label>
            <input
              type="number"
              value={editingSlot.female_doctor_count || 0}
              onChange={(e) => updateEditingSlot({
                female_doctor_count: parseInt(e.target.value) || 0
              })}
              min="0"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={isLoading}
            />
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 flex space-x-3">
          <button
            onClick={() => setShowEditModal(false)}
            className="flex-1 px-4 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 font-medium transition-colors duration-200"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isLoading}
            className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-4 py-3 rounded-xl font-medium transition-colors duration-200 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <Loader className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            <span>{isLoading ? 'Saving...' : 'Save Changes'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditModal;