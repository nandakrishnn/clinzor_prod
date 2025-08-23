import React from 'react';
import { X, Save, Clock } from 'lucide-react';
import { ClinicService, Slot } from '@/types/common';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

interface EditModalProps {
  showEditModal: boolean;
  setShowEditModal: (show: boolean) => void;
  editingSlot: Slot | null;
  setEditingSlot: (slot: Slot | null) => void;
  handleSaveEdit: () => void;
  clinicServices: ClinicService[];
}

const EditModal: React.FC<EditModalProps> = ({
  showEditModal,
  setShowEditModal,
  editingSlot,
  setEditingSlot,
  handleSaveEdit,
  clinicServices
}) => {
  if (!showEditModal || !editingSlot) return null;

  // Helper function to update editingSlot
  const updateEditingSlot = (updates: Partial<Slot>) => {
    if (editingSlot) {
      setEditingSlot({ ...editingSlot, ...updates });
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md max-h-[95vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Edit Slot</h2>
            <button
              onClick={() => setShowEditModal(false)}
              className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Clinic Service</label>
            <select
              value={editingSlot.clinic_service}
              onChange={(e) => updateEditingSlot({ clinic_service: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {clinicServices.map(service => (
                <option key={service.id} value={service.id}>{service.name}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Start Time</label>
            <div className="relative">
              <div
                className="absolute left-3 top-1/2 transform -translate-y-1/2 cursor-pointer z-10"
                onClick={() => document.getElementById('editStartTimePicker')?.focus()}
              >
                <Clock className="w-5 h-5 text-gray-400" />
              </div>
              <DatePicker
                id="editStartTimePicker"
                selected={editingSlot.start_time ? new Date(editingSlot.start_time) : null}
                onChange={(date: Date | null) => updateEditingSlot({ 
                  start_time: date?.toISOString() || '' 
                })}
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={15}
                dateFormat="yyyy-MM-dd HH:mm"
                placeholderText="Select start time"
                className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                wrapperClassName="w-full"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">End Time</label>
            <div className="relative">
              <div
                className="absolute left-3 top-1/2 transform -translate-y-1/2 cursor-pointer z-10"
                onClick={() => document.getElementById('editEndTimePicker')?.focus()}
              >
                <Clock className="w-5 h-5 text-gray-400" />
              </div>
              <DatePicker
                id="editEndTimePicker"
                selected={editingSlot.end_time ? new Date(editingSlot.end_time) : null}
                onChange={(date: Date | null) => updateEditingSlot({ 
                  end_time: date?.toISOString() || '' 
                })}
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={15}
                dateFormat="yyyy-MM-dd HH:mm"
                placeholderText="Select end time"
                className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                wrapperClassName="w-full"
              />
            </div>
          </div>
          
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
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Available Slots</label>
            <input
              type="number"
              value={editingSlot.available_slots}
              onChange={(e) => updateEditingSlot({ 
                available_slots: parseInt(e.target.value) || 0 
              })}
              min="0"
              max={editingSlot.max_bookings}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              value={editingSlot.status}
              onChange={(e) => updateEditingSlot({ status: e.target.value as Slot['status'] })}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="APPROVED">Approved</option>
              <option value="PENDING">Pending</option>
              <option value="REJECTED">Rejected</option>
            </select>
          </div>

          {editingSlot.status === 'REJECTED' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Reason for Rejection</label>
              <textarea
                value={editingSlot.reason_for_rejection || ''}
                onChange={(e) => updateEditingSlot({ 
                  reason_for_rejection: e.target.value 
                })}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                placeholder="Enter reason for rejection..."
              />
            </div>
          )}
        </div>

        <div className="p-6 border-t border-gray-200 flex space-x-3">
          <button
            onClick={() => setShowEditModal(false)}
            className="flex-1 px-4 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 font-medium transition-colors duration-200"
          >
            Cancel
          </button>
          <button
            onClick={handleSaveEdit}
            className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-4 py-3 rounded-xl font-medium transition-colors duration-200 flex items-center justify-center space-x-2"
          >
            <Save className="w-4 h-4" />
            <span>Save Changes</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditModal;