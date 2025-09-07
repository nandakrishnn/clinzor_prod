import React, { useState, useEffect } from 'react';
import { GetAllClinicSlot, deleteClinicSlot } from '@/service/clinic/slotManagementService';
import { FilterState, Slot } from '@/types/common';
import { motion, AnimatePresence } from "framer-motion";
import Header from './Header';
import FilterSection from './FilterSection';
import SlotsGrid from './SlotsGrid';
import BulkCreationModal from './BulkCreationModal';
import EditModal from './EditModal';
import ViewModal from './ViewModal';
import Pagination from './Pagination';
import { AlertCircle, CheckCircle, X, XCircle } from 'lucide-react';

interface NotificationProps {
  type: "success" | "error" | "warning";
  message: string;
  onClose: () => void;
}


const Notification = ({ type, message, onClose }: NotificationProps) => {
  const getIcon = () => {
    switch (type) {
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-400" />;
      case "error":
        return <XCircle className="h-5 w-5 text-red-400" />;
      case "warning":
        return <AlertCircle className="h-5 w-5 text-yellow-400" />;
    }
  };

  const getBgColor = () => {
    switch (type) {
      case "success":
        return "bg-green-50";
      case "error":
        return "bg-red-50";
      case "warning":
        return "bg-yellow-50";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg ${getBgColor()} border border-gray-200`}
    >
      <div className="flex items-center">
        {getIcon()}
        <p className="ml-3 text-sm font-medium text-gray-900">{message}</p>
        <button
          onClick={onClose}
          className="ml-4 text-gray-400 hover:text-gray-500"
        >
          <X size={16} />
        </button>
      </div>
    </motion.div>
  );
};
const SlotManagementSystem = () => {
  const [slots, setSlots] = useState<Slot[]>([]);
  const [filteredSlots, setFilteredSlots] = useState<Slot[]>([]);
  const [showBulkForm, setShowBulkForm] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingSlot, setEditingSlot] = useState<Slot | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewingSlot, setViewingSlot] = useState<Slot | null>(null);
  const [notification, setNotification] = useState<{
    type: "success" | "error" | "warning";
    message: string;
  } | null>(null);
  
  const [filters, setFilters] = useState<FilterState>({
    fromDate: null,
    toDate: null,
    status: '',
    clinicService: '',
    timeRange: '',
    capacity: '',
    availability: ''
  });

  const clinicServices = [
    { id: "159e3627-65eb-40b2-b535-37cbb6535ab8", name: "General Consultation" },
    { id: "259e3627-65eb-40b2-b535-37cbb6535ab9", name: "Cardiology" },
    { id: "359e3627-65eb-40b2-b535-37cbb6535ac0", name: "Dermatology" },
    { id: "459e3627-65eb-40b2-b535-37cbb6535ac1", name: "Pediatrics" }
  ];

  const showNotification = (type: "success" | "error" | "warning", message: string) => {
    setNotification({ type, message });
    // Auto-hide after 5 seconds
    setTimeout(() => {
      setNotification(null);
    }, 5000);
  };

  const fetchSlots = async (page = 1) => {
    try {
      setLoading(true);
      const data = await GetAllClinicSlot(page);
      setSlots(data.data);
      setFilteredSlots(data.data);
      setTotalPages(data.total_pages || 1);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSlots(currentPage);
  }, [currentPage]);

  useEffect(() => {
    let filtered = slots;

    if (searchTerm) {
      filtered = filtered.filter(slot => {
        const serviceName = getServiceName(slot.clinic_service);
        return serviceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          slot.created_by.toLowerCase().includes(searchTerm.toLowerCase());
      });
    }

    if (filters.fromDate) {
      filtered = filtered.filter(slot =>
        filters.fromDate && new Date(slot.start_time) >= filters.fromDate
      );
    }

    if (filters.toDate) {
      filtered = filtered.filter(slot =>
        filters.toDate && new Date(slot.start_time) <= filters.toDate
      );
    }

    if (filters.status) {
      filtered = filtered.filter(slot => slot.status === filters.status);
    }

    if (filters.clinicService) {
      filtered = filtered.filter(slot => slot.clinic_service === filters.clinicService);
    }

    if (filters.timeRange) {
      filtered = filtered.filter(slot => {
        const hour = new Date(slot.start_time).getHours();
        switch (filters.timeRange) {
          case 'morning': return hour >= 6 && hour < 12;
          case 'afternoon': return hour >= 12 && hour < 17;
          case 'evening': return hour >= 17 && hour < 24;
          default: return true;
        }
      });
    }

    if (filters.capacity) {
      filtered = filtered.filter(slot => {
        switch (filters.capacity) {
          case 'low': return slot.max_bookings <= 4;
          case 'medium': return slot.max_bookings > 4 && slot.max_bookings <= 8;
          case 'high': return slot.max_bookings > 8;
          default: return true;
        }
      });
    }

    if (filters.availability) {
      filtered = filtered.filter(slot => {
        const availabilityRatio = slot.available_slots / slot.max_bookings;
        switch (filters.availability) {
          case 'full': return availabilityRatio === 1;
          case 'available': return availabilityRatio > 0.5;
          case 'limited': return availabilityRatio > 0 && availabilityRatio <= 0.5;
          case 'booked': return availabilityRatio === 0;
          default: return true;
        }
      });
    }

    setFilteredSlots(filtered);
  }, [filters, slots, searchTerm]);

  const getServiceName = (serviceId: string) => {
    const service = clinicServices.find(s => s.id === serviceId);
    return service ? service.name : 'Unknown Service';
  };

  const handleFilterChange = (key: keyof FilterState, value: any) => {
    setFilters((prev: FilterState) => ({
      ...prev,
      [key]: value
    }));
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setFilters({
      fromDate: null,
      toDate: null,
      status: '',
      clinicService: '',
      timeRange: '',
      capacity: '',
      availability: ''
    });
    setSearchTerm('');
    setCurrentPage(1);
    fetchSlots(1);
  };

  const handleEdit = (slot: Slot) => {
    setEditingSlot({ ...slot });
    setShowEditModal(true);
  };

  const handleSaveEdit = () => {
    if (!editingSlot) return;
    setSlots(prev => prev.map(slot =>
      slot.uuid === editingSlot.uuid ? editingSlot : slot
    ));
    setShowEditModal(false);
    setEditingSlot(null);
  };

  const handleDelete = async (uuid: string) => {
    if (window.confirm('Are you sure you want to delete this slot?')) {
      try {
        await deleteClinicSlot(uuid);
        setSlots(prev => prev.filter(slot => slot.uuid !== uuid));
        showNotification("success", "Slot deleted successfully");
        fetchSlots(currentPage);
      } catch (error) {
        console.error('Failed to delete slot:', error);
      }
    }
  };

  const handleView = (slot: Slot) => {
    setViewingSlot(slot);
    setShowViewModal(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header setShowBulkForm={setShowBulkForm} />

      <div className="max-w-7xl mx-auto px-2 sm:px-6 py-4 sm:py-6">
        <FilterSection
          filters={filters}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          handleFilterChange={handleFilterChange}
          clearFilters={clearFilters}
          filteredSlots={filteredSlots}
          clinicServices={clinicServices}
        />

        <SlotsGrid
          slots={filteredSlots}
          loading={loading}
          getServiceName={getServiceName}
          handleEdit={handleEdit}
          handleDelete={handleDelete}
          handleView={handleView}
        />

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          setCurrentPage={setCurrentPage}
        />
      </div>

      <BulkCreationModal
        showBulkForm={showBulkForm}
        setShowBulkForm={setShowBulkForm}
        currentPage={currentPage}
        fetchSlots={fetchSlots}
        clinicServices={clinicServices}
        showNotification={showNotification}
      />

      <EditModal
        showEditModal={showEditModal}
        setShowEditModal={setShowEditModal}
        editingSlot={editingSlot}
        setEditingSlot={setEditingSlot}
        handleSaveEdit={handleSaveEdit}
        clinicServices={clinicServices}
        showNotification={showNotification}
        fetchSlots={() => fetchSlots(currentPage)}
      />

      <ViewModal
        showViewModal={showViewModal}
        setShowViewModal={setShowViewModal}
        viewingSlot={viewingSlot}
        getServiceName={getServiceName}
      />
      {/* Notification */}
      <AnimatePresence>
        {notification && (
          <Notification
            type={notification.type}
            message={notification.message}
            onClose={() => setNotification(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default SlotManagementSystem;