import React, { useState, useRef } from 'react';
import { Clock, Users, Calendar, Check, X, Filter, Search, ChevronLeft, ChevronRight, AlertCircle, CheckCircle2, XCircle, Eye, EyeOff, Plus, Building2, MapPin, User, Activity, Settings, RefreshCw, Download, Upload } from 'lucide-react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

// Slot type definition
interface Slot {
  id: string;
  clinic_service: string;
  start_time: string;
  end_time: string;
  created_by: string;
  max_bookings: number;
  available_slots: number;
  status: 'APPROVED' | 'PENDING' | 'REJECTED';
  reason_for_rejection: string | null;
}

const PAGE_SIZE = 6;

const SlotManager = () => {
  // Sample data based on the provided JSON
  const [slots, setSlots] = useState<Slot[]>([
    {
      id: "8178e6bc-d723-4df8-bc49-f03e72a5dbf0",
      clinic_service: "159e3627-65eb-40b2-b535-37cbb6535ab8",
      start_time: "2025-06-22T17:25:00Z",
      end_time: "2025-06-22T18:21:00Z",
      created_by: "admin@gmail.com",
      max_bookings: 6,
      available_slots: 6,
      status: "APPROVED",
      reason_for_rejection: null
    },
    {
      id: "6562ab44-a657-4a30-a7ff-5583341b97ce",
      clinic_service: "159e3627-65eb-40b2-b535-37cbb6535ab8",
      start_time: "2025-06-21T19:01:00Z",
      end_time: "2025-06-21T19:21:00Z",
      created_by: "admin@gmail.com",
      max_bookings: 6,
      available_slots: 5,
      status: "APPROVED",
      reason_for_rejection: null
    },
    {
      id: "4cb6a934-e653-4c12-8734-ba099b73a2e3",
      clinic_service: "159e3627-65eb-40b2-b535-37cbb6535ab8",
      start_time: "2025-06-21T19:00:00Z",
      end_time: "2025-06-21T19:21:00Z",
      created_by: "admin@gmail.com",
      max_bookings: 6,
      available_slots: 7,
      status: "PENDING",
      reason_for_rejection: null
    },
    {
      id: "85b0bbb4-f963-43ad-a500-3ab30b4a563e",
      clinic_service: "159e3627-65eb-40b2-b535-37cbb6535ab8",
      start_time: "2025-06-21T18:59:00Z",
      end_time: "2025-06-21T19:21:00Z",
      created_by: "admin@gmail.com",
      max_bookings: 6,
      available_slots: 6,
      status: "PENDING",
      reason_for_rejection: null
    },
    {
      id: "c319afcc-4348-444b-a8e6-187164baa3e2",
      clinic_service: "159e3627-65eb-40b2-b535-37cbb6535ab8",
      start_time: "2025-06-21T18:58:00Z",
      end_time: "2025-06-21T19:21:00Z",
      created_by: "admin@gmail.com",
      max_bookings: 6,
      available_slots: 6,
      status: "REJECTED",
      reason_for_rejection: "Double booking conflict"
    }
  ]);

  const [selectedSlots, setSelectedSlots] = useState<string[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [fromDate, setFromDate] = useState<string>('');
  const [toDate, setToDate] = useState<string>('');
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [actionFeedback, setActionFeedback] = useState<{type: 'success' | 'error', message: string} | null>(null);
  const [viewSlot, setViewSlot] = useState<Slot | null>(null);
  const [clinicNameSearch, setClinicNameSearch] = useState('');

  // Sample clinic services for the dropdown
  const clinicServices = [
    { id: '159e3627-65eb-40b2-b535-37cbb6535ab8', name: 'General Consultation' },
    { id: '259e3627-65eb-40b2-b535-37cbb6535ab9', name: 'Dental Checkup' },
    { id: '359e3627-65eb-40b2-b535-37cbb6535ac0', name: 'Eye Examination' },
    { id: '459e3627-65eb-40b2-b535-37cbb6535ac1', name: 'Physical Therapy' },
    { id: '559e3627-65eb-40b2-b535-37cbb6535ac2', name: 'Blood Test' }
  ];

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
      time: date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      }),
    };
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return {
          color: 'bg-emerald-100 text-emerald-800 border-emerald-200',
          icon: CheckCircle2,
          label: 'Active & Approved',
          description: 'This slot is live and accepting bookings'
        };
      case 'PENDING':
        return {
          color: 'bg-amber-100 text-amber-800 border-amber-200',
          icon: AlertCircle,
          label: 'Awaiting Review',
          description: 'This slot requires administrator approval before going live'
        };
      case 'REJECTED':
        return {
          color: 'bg-red-100 text-red-800 border-red-200',
          icon: XCircle,
          label: 'Rejected',
          description: 'This slot has been declined and will not be available for booking'
        };
      default:
        return {
          color: 'bg-gray-100 text-gray-800 border-gray-200',
          icon: AlertCircle,
          label: 'Unknown Status',
          description: 'Status could not be determined'
        };
    }
  };

  const showFeedback = (type: 'success' | 'error', message: string) => {
    setActionFeedback({ type, message });
    setTimeout(() => setActionFeedback(null), 4000);
  };

  const handleApprove = (slotId: string) => {
    setSlots(slots.map(slot =>
      slot.id === slotId
        ? { ...slot, status: 'APPROVED', reason_for_rejection: null }
        : slot
    ));
    showFeedback('success', 'Slot approved successfully and is now available for booking!');
  };

  const handleReject = (slotId: string, reason?: string) => {
    const rejectionReason = reason || prompt('Please provide a detailed reason for rejection:');
    if (rejectionReason) {
      setSlots(slots.map(slot =>
        slot.id === slotId
          ? { ...slot, status: 'REJECTED', reason_for_rejection: rejectionReason }
          : slot
      ));
      showFeedback('success', 'Slot rejected and removed from available bookings.');
    }
  };

  const handleBulkApprove = () => {
    const count = selectedSlots.length;
    setSlots(slots.map(slot =>
      selectedSlots.includes(slot.id)
        ? { ...slot, status: 'APPROVED', reason_for_rejection: null }
        : slot
    ));
    setSelectedSlots([]);
    showFeedback('success', `${count} slot${count > 1 ? 's' : ''} approved and now available for booking!`);
  };

  const handleBulkReject = () => {
    const reason = prompt('Please provide a reason for rejecting these slots:');
    if (reason) {
      const count = selectedSlots.length;
      setSlots(slots.map(slot =>
        selectedSlots.includes(slot.id)
          ? { ...slot, status: 'REJECTED', reason_for_rejection: reason }
          : slot
      ));
      setSelectedSlots([]);
      showFeedback('success', `${count} slot${count > 1 ? 's' : ''} rejected and removed from booking availability.`);
    }
  };

  const toggleSlotSelection = (slotId: string) => {
    setSelectedSlots(prev =>
      prev.includes(slotId)
        ? prev.filter(id => id !== slotId)
        : [...prev, slotId]
    );
  };

  const selectAllVisible = () => {
    const visibleIds = paginatedSlots.map(slot => slot.id);
    setSelectedSlots(prev => {
      const newSelected = [...prev];
      visibleIds.forEach(id => {
        if (!newSelected.includes(id)) {
          newSelected.push(id);
        }
      });
      return newSelected;
    });
  };

  const clearSelection = () => {
    setSelectedSlots([]);
  };

  const clearAllFilters = () => {
    setStatusFilter('ALL');
    setSearchTerm('');
    setFromDate('');
    setToDate('');
    setCurrentPage(1);
  };

  // Sample clinics and clinic services (copy from servicelist.tsx)
  const sampleClinics = [
    { uuid: "5a1f8f39-ca38-464c-93c5-ea8edbd6c03f", name: "City General Hospital", location: "Downtown Medical District" },
    { uuid: "b2c8f4d1-4a5b-4c7d-8e9f-1a2b3c4d5e6f", name: "Metro Medical Center", location: "Central Business District" },
    { uuid: "c3d9f5e2-5b6c-5d8e-9f0g-2b3c4d5e6f7g", name: "Downtown Clinic", location: "Main Street" }
  ];

  const sampleClinicServices = [
    {
      uuid: "159e3627-65eb-40b2-b535-37cbb6535ab8",
      service: "d7afe788-af8b-4fd4-b65b-bab700df841a",
      clinic: "5a1f8f39-ca38-464c-93c5-ea8edbd6c03f",
      service_name: "Cardiology Consultation",
      created_by: "admin@gmail.com",
      clinic_provided_name: "Advanced Cardiology Care",
      rank: 1,
      consultation_charge_video_call: "400.00",
      consultation_charge_physical_visit: "200.00",
      consultation_charge_home_visit: "200.00",
      treatment_charge_video_call: "600.00",
      treatment_charge_physical_visit: "500.00",
      treatment_charge_home_visit: "800.00",
      status: "APPROVED",
      is_video_call: true,
      is_home_visit: false,
      is_physical_visit: true,
      image: null,
      description: "Premium cardiology services with experienced specialists",
      reason_for_rejection: null
    },
    {
      uuid: "269f4738-76fc-51c3-c646-48dcc7646cb9",
      service: "661d42bc-4393-49a3-ab8f-c24b6ab17c38",
      clinic: "b2c8f4d1-4a5b-4c7d-8e9f-1a2b3c4d5e6f",
      service_name: "Heart Specialist Consultation",
      created_by: "admin@gmail.com",
      clinic_provided_name: null,
      rank: 2,
      consultation_charge_video_call: "350.00",
      consultation_charge_physical_visit: "180.00",
      consultation_charge_home_visit: "250.00",
      treatment_charge_video_call: "550.00",
      treatment_charge_physical_visit: "450.00",
      treatment_charge_home_visit: "700.00",
      status: "PENDING",
      is_video_call: true,
      is_home_visit: true,
      is_physical_visit: true,
      image: null,
      description: null,
      reason_for_rejection: null
    }
  ];

  const getClinicNameByService = (clinic_service_id: string) => {
    const svc = sampleClinicServices.find(s => s.uuid === clinic_service_id);
    if (!svc) return 'Unknown Clinic';
    const clinic = sampleClinics.find(c => c.uuid === svc.clinic);
    return clinic ? clinic.name : 'Unknown Clinic';
  };

  const getServiceDetailsByService = (clinic_service_id: string) => {
    const svc = sampleClinicServices.find(s => s.uuid === clinic_service_id);
    if (!svc) return { name: 'Unknown Service', clinic: 'Unknown Clinic', location: 'Unknown Location' };
    const clinic = sampleClinics.find(c => c.uuid === svc.clinic);
    return {
      name: svc.clinic_provided_name || svc.service_name,
      clinic: clinic ? clinic.name : 'Unknown Clinic',
      location: clinic ? clinic.location : 'Unknown Location'
    };
  };

  // Filtering logic
  const filteredSlots = slots.filter(slot => {
    const matchesStatus = statusFilter === 'ALL' || slot.status === statusFilter;
    const clinicName = (getClinicNameByService(slot.clinic_service) || '').toLowerCase();
    const matchesClinicName = clinicName.includes(clinicNameSearch.toLowerCase());
    let matchesFromDate = true;
    let matchesToDate = true;
    if (fromDate) {
      matchesFromDate = new Date(slot.start_time) >= new Date(fromDate);
    }
    if (toDate) {
      const toDateObj = new Date(toDate);
      toDateObj.setDate(toDateObj.getDate() + 1);
      matchesToDate = new Date(slot.start_time) < toDateObj;
    }
    return matchesStatus && matchesClinicName && matchesFromDate && matchesToDate;
  });

  // Pagination logic
  const totalItems = filteredSlots.length;
  const totalPages = Math.ceil(totalItems / PAGE_SIZE);
  const paginatedSlots = filteredSlots.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  // Reset page if filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter, fromDate, toDate]);

  // Get counts for quick stats
  const statusCounts = slots.reduce((acc, slot) => {
    acc[slot.status] = (acc[slot.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Calculate additional metrics
  const totalBookableSlots = slots.filter(s => s.status === 'APPROVED').reduce((sum, slot) => sum + slot.available_slots, 0);
  const totalMaxCapacity = slots.filter(s => s.status === 'APPROVED').reduce((sum, slot) => sum + slot.max_bookings, 0);
  const utilizationRate = totalMaxCapacity > 0 ? Math.round(((totalMaxCapacity - totalBookableSlots) / totalMaxCapacity) * 100) : 0;

  // Simulate fetching slot by UUID (in real app, replace with API call)
  const handleViewSlot = (uuid: string) => {
    const slot = slots.find((s) => s.id === uuid);
    if (slot) setViewSlot(slot);
  };

  const closeViewSlot = () => setViewSlot(null);

  // Remove refs for native date pickers
  // Add state for DatePicker (convert string to Date and vice versa)
  const [fromDateObj, setFromDateObj] = useState<Date | null>(fromDate ? new Date(fromDate) : null);
  const [toDateObj, setToDateObj] = useState<Date | null>(toDate ? new Date(toDate) : null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-2 sm:p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto w-full">
        {/* Action Feedback */}
        {actionFeedback && (
          <div className={`fixed top-4 right-4 z-50 p-4 rounded-xl shadow-2xl border-l-4 ${
            actionFeedback.type === 'success' 
              ? 'bg-emerald-50 border-emerald-500 text-emerald-800' 
              : 'bg-red-50 border-red-500 text-red-800'
          } transition-all duration-500 transform translate-x-0`}>
            <div className="flex items-center gap-3">
              {actionFeedback.type === 'success' ? (
                <CheckCircle2 className="h-6 w-6 text-emerald-600" />
              ) : (
                <XCircle className="h-6 w-6 text-red-600" />
              )}
              <div>
                <p className="font-semibold text-sm">
                  {actionFeedback.type === 'success' ? 'Success!' : 'Error!'}
                </p>
                <p className="text-sm opacity-90">{actionFeedback.message}</p>
              </div>
            </div>
          </div>
        )}

        {/* Enhanced Header Section */}
        <div className="mb-8">
          <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg border border-gray-100">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-blue-100 rounded-xl">
                    <Calendar className="h-8 w-8 text-blue-600" />
                  </div>
                  <div>
                    <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-1">
                      Appointment Slot Management
                    </h1>
                    <p className="text-gray-600 text-lg">
                      Review, approve, and manage healthcare appointment slots across all clinics
                    </p>
                  </div>
                </div>
                
                {/* Key Metrics Dashboard */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
                  <div className="bg-gradient-to-r from-amber-50 to-amber-100 border border-amber-200 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertCircle className="h-5 w-5 text-amber-600" />
                      <span className="text-amber-700 font-semibold text-sm">Pending Approval</span>
                    </div>
                    <div className="text-amber-800 font-bold text-2xl">{statusCounts.PENDING || 0}</div>
                    <div className="text-amber-600 text-xs mt-1">Requires your review</div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-emerald-50 to-emerald-100 border border-emerald-200 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                      <span className="text-emerald-700 font-semibold text-sm">Active Slots</span>
                    </div>
                    <div className="text-emerald-800 font-bold text-2xl">{statusCounts.APPROVED || 0}</div>
                    <div className="text-emerald-600 text-xs mt-1">Available for booking</div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Users className="h-5 w-5 text-blue-600" />
                      <span className="text-blue-700 font-semibold text-sm">Available Spots</span>
                    </div>
                    <div className="text-blue-800 font-bold text-2xl">{totalBookableSlots}</div>
                    <div className="text-blue-600 text-xs mt-1">Open appointments</div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-purple-50 to-purple-100 border border-purple-200 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Activity className="h-5 w-5 text-purple-600" />
                      <span className="text-purple-700 font-semibold text-sm">Utilization</span>
                    </div>
                    <div className="text-purple-800 font-bold text-2xl">{utilizationRate}%</div>
                    <div className="text-purple-600 text-xs mt-1">Booking efficiency</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Filters Section */}
        <div className="mb-6">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
            <div className="p-4 sm:p-6 border-b border-gray-100">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Filter className="h-5 w-5 text-gray-600" />
                    <h3 className="font-bold text-gray-900 text-lg">Search & Filter Slots</h3>
                  </div>
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-all duration-200"
                  >
                    {showFilters ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    <span className="text-sm font-medium">{showFilters ? 'Hide' : 'Show'} Advanced Filters</span>
                  </button>
                </div>
                {(statusFilter !== 'ALL' || fromDate || toDate || clinicNameSearch) && (
                  <button
                    onClick={clearAllFilters}
                    className="flex items-center gap-2 px-4 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all duration-200 text-sm font-medium"
                  >
                    <X className="h-4 w-4" />
                    Clear All Filters
                  </button>
                )}
              </div>
            </div>
            
            <div className="p-4 sm:p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Building2 className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search by clinic name..."
                    value={clinicNameSearch}
                    onChange={(e) => setClinicNameSearch(e.target.value)}
                    className="pl-10 w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="ALL">All Statuses</option>
                  <option value="APPROVED">Approved</option>
                  <option value="PENDING">Pending</option>
                  <option value="REJECTED">Rejected</option>
                </select>
                
                <div className="flex gap-2">
                  {/* From Date Picker */}
                  <div className="flex-1">
                    <DatePicker
                      selected={fromDateObj}
                      onChange={date => {
                        setFromDateObj(date);
                        setFromDate(date ? date.toISOString().slice(0, 10) : '');
                      }}
                      dateFormat="yyyy-MM-dd"
                      placeholderText="From Date"
                      className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white cursor-pointer"
                      isClearable
                    />
                  </div>
                  {/* To Date Picker */}
                  <div className="flex-1">
                    <DatePicker
                      selected={toDateObj}
                      onChange={date => {
                        setToDateObj(date);
                        setToDate(date ? date.toISOString().slice(0, 10) : '');
                      }}
                      dateFormat="yyyy-MM-dd"
                      placeholderText="To Date"
                      className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white cursor-pointer"
                      isClearable
                    />
                  </div>
                </div>
              </div>
              
              {showFilters && (
                <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center gap-3 bg-blue-50 p-4 rounded-xl">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Clock className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Time Range</p>
                      <p className="text-xs text-gray-500">Filter slots within date range</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 bg-amber-50 p-4 rounded-xl">
                    <div className="p-2 bg-amber-100 rounded-lg">
                      <AlertCircle className="h-5 w-5 text-amber-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Pending Review</p>
                      <p className="text-xs text-gray-500">{statusCounts.PENDING || 0} slots awaiting approval</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 bg-emerald-50 p-4 rounded-xl">
                    <div className="p-2 bg-emerald-100 rounded-lg">
                      <Check className="h-5 w-5 text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Approved Slots</p>
                      <p className="text-xs text-gray-500">{statusCounts.APPROVED || 0} active slots</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Slots Table */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 sm:p-6 border-b border-gray-100">
            <h3 className="font-bold text-xl text-gray-900">
              Appointment Slots ({filteredSlots.length})
            </h3>
            <div className="flex items-center gap-3">
              {selectedSlots.length > 0 && (
                <>
                  <button
                    onClick={handleBulkApprove}
                    className="flex items-center gap-2 px-4 py-2 bg-emerald-100 text-emerald-800 rounded-lg hover:bg-emerald-200 transition-colors"
                  >
                    <Check className="h-4 w-4" />
                    <span>Approve Selected</span>
                  </button>
                  <button
                    onClick={handleBulkReject}
                    className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-800 rounded-lg hover:bg-red-200 transition-colors"
                  >
                    <X className="h-4 w-4" />
                    <span>Reject Selected</span>
                  </button>
                  <button
                    onClick={clearSelection}
                    className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="h-4 w-4" />
                    <span>Clear Selection</span>
                  </button>
                </>
              )}
              <button
                onClick={selectAllVisible}
                className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
              >
                <Check className="h-4 w-4" />
                <span>Select Visible</span>
              </button>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-12">
                    <input
                      type="checkbox"
                      checked={selectedSlots.length === paginatedSlots.length && paginatedSlots.length > 0}
                      onChange={() => {
                        if (selectedSlots.length === paginatedSlots.length) {
                          clearSelection();
                        } else {
                          selectAllVisible();
                        }
                      }}
                      className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                    />
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Clinic & Service
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date & Time
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Availability
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedSlots.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                      <div className="flex flex-col items-center justify-center gap-3">
                        <Calendar className="h-12 w-12 text-gray-300" />
                        <p className="text-lg font-medium text-gray-700">No appointment slots found</p>
                        <p className="text-gray-500">Try adjusting your filters.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  paginatedSlots.map((slot) => {
                    const { date, time } = formatDateTime(slot.start_time);
                    const statusConfig = getStatusConfig(slot.status);
                    const serviceDetails = getServiceDetailsByService(slot.clinic_service);
                    
                    return (
                      <tr key={slot.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input
                            type="checkbox"
                            checked={selectedSlots.includes(slot.id)}
                            onChange={() => toggleSlotSelection(slot.id)}
                            className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                          />
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="bg-indigo-100 p-2 rounded-lg">
                              <Activity className="h-5 w-5 text-indigo-600" />
                            </div>
                            <div>
                              <div className="font-medium text-gray-900">{serviceDetails.name}</div>
                              <div className="text-sm text-gray-500 flex items-center gap-1">
                                <Building2 className="h-4 w-4" />
                                {serviceDetails.clinic}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-medium text-gray-900">{date}</div>
                          <div className="text-sm text-gray-500 flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {time}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                              <div
                                className="bg-blue-600 h-2.5 rounded-full"
                                style={{
                                  width: `${((slot.max_bookings - slot.available_slots) / slot.max_bookings * 100)}%`
                                }}
                              ></div>
                            </div>
                            <div className="text-sm font-medium text-gray-700">
                              {slot.available_slots}/{slot.max_bookings}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${statusConfig.color}`}>
                            <statusConfig.icon className="h-4 w-4" />
                            {statusConfig.label}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center gap-3">
                            {slot.status === 'PENDING' && (
                              <>
                                <button
                                  onClick={() => handleApprove(slot.id)}
                                  className="text-emerald-600 hover:text-emerald-900 flex items-center gap-1"
                                >
                                  <Check className="h-4 w-4" />
                                  Approve
                                </button>
                                <button
                                  onClick={() => handleReject(slot.id)}
                                  className="text-red-600 hover:text-red-900 flex items-center gap-1"
                                >
                                  <X className="h-4 w-4" />
                                  Reject
                                </button>
                              </>
                            )}
                            <button
                              onClick={() => handleViewSlot(slot.id)}
                              className="text-blue-600 hover:text-blue-900 flex items-center gap-1"
                            >
                              <Eye className="h-4 w-4" />
                              View
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          {paginatedSlots.length > 0 && (
            <div className="border-t border-gray-200 px-4 py-3 sm:px-6">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-sm text-gray-700">
                  Showing <span className="font-medium">{(currentPage - 1) * PAGE_SIZE + 1}</span> to{' '}
                  <span className="font-medium">{Math.min(currentPage * PAGE_SIZE, totalItems)}</span> of{' '}
                  <span className="font-medium">{totalItems}</span> slots
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                      currentPage === 1 
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                        : 'bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <ChevronLeft className="h-5 w-5" />
                    Previous
                  </button>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum: number;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }
                      
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                            currentPage === pageNum
                              ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                              : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>
                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                      currentPage === totalPages
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    Next
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* View Slot Modal */}
      {viewSlot && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900">Slot Details</h3>
                <button
                  onClick={closeViewSlot}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>
            <div className="p-6 space-y-6">
              <div className="flex items-center gap-4">
                <div className="bg-blue-100 p-3 rounded-xl">
                  <Activity className="h-8 w-8 text-blue-600" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-900">
                    {getServiceDetailsByService(viewSlot.clinic_service).name}
                  </h4>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Building2 className="h-4 w-4" />
                    {getServiceDetailsByService(viewSlot.clinic_service).clinic}
                  </div>
                </div>
              </div>

              {/* Clinic Service Details Section */}
              {(() => {
                const svc = sampleClinicServices.find(s => s.uuid === viewSlot.clinic_service);
                if (!svc) return null;
                return (
                  <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                    <h5 className="text-md font-bold text-blue-800 mb-2">Clinic Service Details</h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <div className="mb-2">
                          <span className="font-medium text-gray-700">Service Name: </span>
                          <span>{svc.service_name}</span>
                        </div>
                        {svc.clinic_provided_name && (
                          <div className="mb-2">
                            <span className="font-medium text-gray-700">Clinic Provided Name: </span>
                            <span>{svc.clinic_provided_name}</span>
                          </div>
                        )}
                        {svc.description && (
                          <div className="mb-2">
                            <span className="font-medium text-gray-700">Description: </span>
                            <span>{svc.description}</span>
                          </div>
                        )}
                        <div className="mb-2">
                          <span className="font-medium text-gray-700">Status: </span>
                          <span>{svc.status}</span>
                        </div>
                      </div>
                      <div>
                        <div className="mb-2">
                          <span className="font-medium text-gray-700">Consultation Charges: </span>
                          <span>Video: ₹{svc.consultation_charge_video_call}, Physical: ₹{svc.consultation_charge_physical_visit}, Home: ₹{svc.consultation_charge_home_visit}</span>
                        </div>
                        <div className="mb-2">
                          <span className="font-medium text-gray-700">Treatment Charges: </span>
                          <span>Video: ₹{svc.treatment_charge_video_call}, Physical: ₹{svc.treatment_charge_physical_visit}, Home: ₹{svc.treatment_charge_home_visit}</span>
                        </div>
                        <div className="mb-2">
                          <span className="font-medium text-gray-700">Service Types: </span>
                          <span>
                            {svc.is_video_call && 'Video Call'}
                            {svc.is_video_call && (svc.is_home_visit || svc.is_physical_visit) ? ', ' : ''}
                            {svc.is_home_visit && 'Home Visit'}
                            {svc.is_home_visit && svc.is_physical_visit ? ', ' : ''}
                            {svc.is_physical_visit && 'Physical Visit'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })()}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500">Start Time</p>
                    <p className="font-medium">
                      {formatDateTime(viewSlot.start_time).date}
                    </p>
                    <p className="text-gray-600">
                      {formatDateTime(viewSlot.start_time).time}
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500">End Time</p>
                    <p className="font-medium">
                      {formatDateTime(viewSlot.end_time).date}
                    </p>
                    <p className="text-gray-600">
                      {formatDateTime(viewSlot.end_time).time}
                    </p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500">Availability</p>
                    <div className="flex items-center gap-3">
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                          className="bg-blue-600 h-2.5 rounded-full"
                          style={{
                            width: `${((viewSlot.max_bookings - viewSlot.available_slots) / viewSlot.max_bookings * 100)}%`
                          }}
                        ></div>
                      </div>
                      <div className="text-lg font-medium text-gray-700">
                        {viewSlot.available_slots}/{viewSlot.max_bookings}
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500">Status</p>
                    <div className="mt-1">
                      {(() => {
                        const config = getStatusConfig(viewSlot.status);
                        return (
                          <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${config.color}`}>
                            <config.icon className="h-4 w-4" />
                            {config.label}
                          </div>
                        );
                      })()}
                    </div>
                  </div>
                  
                  {viewSlot.status === 'REJECTED' && viewSlot.reason_for_rejection && (
                    <div>
                      <p className="text-sm text-gray-500">Reason for Rejection</p>
                      <p className="mt-1 text-gray-700 bg-red-50 p-3 rounded-lg">
                        {viewSlot.reason_for_rejection}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-gray-200">
              <div className="flex justify-end">
                <button
                  onClick={closeViewSlot}
                  className="px-6 py-3 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SlotManager;