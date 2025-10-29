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
import { AlertCircle, CheckCircle, X, XCircle } from 'lucide-react';
import Pagination from '@/components/common/Pagination';

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
  const [showBulkForm, setShowBulkForm] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingSlot, setEditingSlot] = useState<Slot | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalSlot, setTotalSlot] = useState(1);
  const [loading, setLoading] = useState(false);
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
    serviceType: '',
  });

  const showNotification = (type: "success" | "error" | "warning", message: string) => {
    setNotification({ type, message });
    // Auto-hide after 5 seconds
    setTimeout(() => {
      setNotification(null);
    }, 5000);
  };

  const fetchSlots = async (page = 1,) => {
    try {
      setLoading(true);
      const data = await GetAllClinicSlot(page, filters);
      setSlots(data.data);
      setTotalPages(data.total_pages || 1);
      setTotalSlot(data.total_items || 1);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSlots(currentPage);
  }, [currentPage, filters]);

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
      serviceType: '',
    });
    setCurrentPage(1);
    fetchSlots(1);
  };

  const handleEdit = (slot: Slot) => {
    setEditingSlot({ ...slot });
    setShowEditModal(true);
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

  console.log(filters, 'filter data')

  return (
    <div className="min-h-screen ">
      <Header setShowBulkForm={setShowBulkForm} />

      <div className="max-w-7xl mx-auto  py-4 sm:py-6">
        <FilterSection
          filters={filters}
          handleFilterChange={handleFilterChange}
          clearFilters={clearFilters}
          totalSlot={totalSlot}
        />

        <SlotsGrid
          slots={slots}
          loading={loading}
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
        showNotification={showNotification}
      />

      <EditModal
        showEditModal={showEditModal}
        setShowEditModal={setShowEditModal}
        editingSlot={editingSlot}
        setEditingSlot={setEditingSlot}
        showNotification={showNotification}
        fetchSlots={() => fetchSlots(currentPage)}
      />

      <ViewModal
        showViewModal={showViewModal}
        setShowViewModal={setShowViewModal}
        viewingSlot={viewingSlot}
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