import React, { useState, useEffect } from 'react';
import { GetAllClinicSlot, deleteClinicSlot } from '@/service/clinic/slotManagementService';
import { FilterState, Slot } from '@/types/common';

import Header from './Header';
import FilterSection from './FilterSection';
import SlotsGrid from './SlotsGrid';
import BulkCreationModal from './BulkCreationModal';
import EditModal from './EditModal';
import ViewModal from './ViewModal';
import Pagination from './Pagination';

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
      />

      <EditModal
        showEditModal={showEditModal}
        setShowEditModal={setShowEditModal}
        editingSlot={editingSlot}
        setEditingSlot={setEditingSlot}
        handleSaveEdit={handleSaveEdit}
        clinicServices={clinicServices}
      />

      <ViewModal
        showViewModal={showViewModal}
        setShowViewModal={setShowViewModal}
        viewingSlot={viewingSlot}
        getServiceName={getServiceName}
      />
    </div>
  );
};

export default SlotManagementSystem;