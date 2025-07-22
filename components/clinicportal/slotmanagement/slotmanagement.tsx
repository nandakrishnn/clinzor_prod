import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Users, Plus, Search, Filter, Edit, Trash2, Eye, Save, X, ChevronDown, CalendarDays, MapPin, Stethoscope, AlertCircle, Layers, RotateCcw, Home, Video } from 'lucide-react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

// Slot type definition
interface Slot {
  uuid: string;
  clinic: string;
  clinic_service: string;
  slot_type: string;
  start_time: string;
  end_time: string;
  created_by: string;
  max_bookings: number;
  available_slots: number;
  status: string;
  reason_for_rejection: string | null;
  is_video_call: boolean;
  is_home_visit: boolean;
  is_physical_visit: boolean;
}

const SlotManagementSystem = () => {
  const [slots, setSlots] = useState<Slot[]>([]);
  const [filteredSlots, setFilteredSlots] = useState<Slot[]>([]);
  const [showBulkForm, setShowBulkForm] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [editingSlot, setEditingSlot] = useState<Slot | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Filter states with advanced options
  const [filters, setFilters] = useState({
    fromDate: null as Date | null,
    toDate: null as Date | null,
    status: '',
    clinicService: '',
    timeRange: '',
    capacity: '',
    availability: ''
  });

  // Bulk creation states
  const [bulkModalType, setBulkModalType] = useState<'' | 'PHYSICAL_OR_VIDEO' | 'HOME_VISIT'>('');

  // Physical/Video bulk form state
  const [physicalVideoSlots, setPhysicalVideoSlots] = useState([
    { start_time: '', end_time: '', max_bookings: 6, is_video_call: true, is_physical_visit: true }
  ]);

  // Home Visit bulk form state
  const [homeVisitTemplate, setHomeVisitTemplate] = useState({
    startDate: '',
    endDate: '',
    weekdays: [1, 2, 3, 4, 5], // Mon-Fri
    timeSlots: ['09:00'],
    max_bookings: 1
  });
  const [homeVisitPreview, setHomeVisitPreview] = useState<{ start_time: string }[]>([]);

  // View modal state
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewingSlot, setViewingSlot] = useState<Slot | null>(null);

  // Mock clinic services for dropdown
  const clinicServices = [
    { id: "159e3627-65eb-40b2-b535-37cbb6535ab8", name: "General Consultation" },
    { id: "259e3627-65eb-40b2-b535-37cbb6535ab9", name: "Cardiology" },
    { id: "359e3627-65eb-40b2-b535-37cbb6535ac0", name: "Dermatology" },
    { id: "459e3627-65eb-40b2-b535-37cbb6535ac1", name: "Pediatrics" }
  ];

  // Mock data initialization
  useEffect(() => {
    const mockSlots = [
      {
        uuid: "6562ab44-a657-4a30-a7ff-5583341b97ce",
        clinic: "mock-clinic-id",
        clinic_service: "159e3627-65eb-40b2-b535-37cbb6535ab8",
        slot_type: "HOME_VISIT",
        start_time: "2025-06-27T09:00:00Z",
        end_time: "2025-06-27T09:30:00Z",
        created_by: "admin@gmail.com",
        max_bookings: 6,
        available_slots: 5,
        status: "APPROVED",
        reason_for_rejection: null,
        is_video_call: false,
        is_home_visit: true,
        is_physical_visit: false
      },
      {
        uuid: "4cb6a934-e653-4c12-8734-ba099b73a2e3",
        clinic: "mock-clinic-id",
        clinic_service: "259e3627-65eb-40b2-b535-37cbb6535ab9",
        slot_type: "PHYSICAL_VISIT",
        start_time: "2025-06-27T10:00:00Z",
        end_time: "2025-06-27T10:30:00Z",
        created_by: "admin@gmail.com",
        max_bookings: 4,
        available_slots: 4,
        status: "PENDING",
        reason_for_rejection: null,
        is_video_call: false,
        is_home_visit: false,
        is_physical_visit: true
      },
      {
        uuid: "85b0bbb4-f963-43ad-a500-3ab30b4a563e",
        clinic: "mock-clinic-id",
        clinic_service: "359e3627-65eb-40b2-b535-37cbb6535ac0",
        slot_type: "VIDEO_CALL",
        start_time: "2025-06-27T14:00:00Z",
        end_time: "2025-06-27T14:30:00Z",
        created_by: "admin@gmail.com",
        max_bookings: 8,
        available_slots: 2,
        status: "REJECTED",
        reason_for_rejection: "Overlapping slots",
        is_video_call: true,
        is_home_visit: false,
        is_physical_visit: false
      },
      {
        uuid: "95b0bbb4-f963-43ad-a500-3ab30b4a563f",
        clinic: "mock-clinic-id",
        clinic_service: "459e3627-65eb-40b2-b535-37cbb6535ac1",
        slot_type: "HOME_VISIT",
        start_time: "2025-06-28T11:00:00Z",
        end_time: "2025-06-28T11:30:00Z",
        created_by: "doctor@gmail.com",
        max_bookings: 6,
        available_slots: 6,
        status: "APPROVED",
        reason_for_rejection: null,
        is_video_call: false,
        is_home_visit: true,
        is_physical_visit: false
      }
    ];
    setSlots(mockSlots);
    setFilteredSlots(mockSlots);
    setTotalPages(1);
  }, []);

  // Advanced filtering logic
  useEffect(() => {
    let filtered = slots;

    // Search term filter
    if (searchTerm) {
      filtered = filtered.filter(slot => {
        const serviceName = getServiceName(slot.clinic_service);
        return serviceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
               slot.created_by.toLowerCase().includes(searchTerm.toLowerCase());
      });
    }

    // Date range filters
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

    // Status filter
    if (filters.status) {
      filtered = filtered.filter(slot => slot.status === filters.status);
    }

    // Service filter
    if (filters.clinicService) {
      filtered = filtered.filter(slot => slot.clinic_service === filters.clinicService);
    }

    // Time range filter
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

    // Capacity filter
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

    // Availability filter
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

  const handleFilterChange = (key: string, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
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

  const handleDelete = (uuid: string) => {
    if (window.confirm('Are you sure you want to delete this slot?')) {
      setSlots(prev => prev.filter(slot => slot.uuid !== uuid));
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'APPROVED': return 'bg-green-50 text-green-700 border-green-200';
      case 'PENDING': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'REJECTED': return 'bg-red-50 text-red-700 border-red-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getAvailabilityColor = (available: number, max: number) => {
    const ratio = available / max;
    if (ratio === 1) return 'text-green-600';
    if (ratio > 0.5) return 'text-blue-600';
    if (ratio > 0) return 'text-amber-600';
    return 'text-red-600';
  };

  const formatDateTime = (dateTime: string) => {
    return new Date(dateTime).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const formatDate = (dateTime: string) => {
    return new Date(dateTime).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (dateTime: string) => {
    return new Date(dateTime).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const handleView = (slot: Slot) => {
    setViewingSlot(slot);
    setShowViewModal(true);
  };

  const SLOTS_PER_PAGE = 5;

  // Pagination logic
  useEffect(() => {
    setCurrentPage(1); // Reset to first page on filter/search change
  }, [filteredSlots.length]);

  const paginatedSlots = filteredSlots.slice(
    (currentPage - 1) * SLOTS_PER_PAGE,
    currentPage * SLOTS_PER_PAGE
  );

  useEffect(() => {
    setTotalPages(Math.max(1, Math.ceil(filteredSlots.length / SLOTS_PER_PAGE)));
  }, [filteredSlots.length]);

  // Generate home visit slots from template
  const generateHomeVisitSlots = () => {
    const { startDate, endDate, weekdays, timeSlots, max_bookings } = homeVisitTemplate;
    if (!startDate || !endDate || weekdays.length === 0 || timeSlots.length === 0) {
      return;
    }
    const start = new Date(startDate);
    const end = new Date(endDate);
    const slots: { start_time: string }[] = [];
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      const dayNum = d.getDay() === 0 ? 7 : d.getDay();
      if (weekdays.includes(dayNum)) {
        timeSlots.forEach(time => {
          const [h, m] = time.split(':');
          const slotDate = new Date(d);
          slotDate.setHours(parseInt(h), parseInt(m), 0, 0);
          slots.push({ start_time: slotDate.toISOString() });
        });
      }
    }
    setHomeVisitPreview(slots);
  };

  // Handle bulk slot creation submission
  const submitBulkSlots = () => {
    let payload;
    if (bulkModalType === 'PHYSICAL_OR_VIDEO') {
      payload = {
        clinic: "5a1f8f39-ca38-464c-93c5-ea8edbd6c03f",
        slot_type: "PHYSICAL_OR_VIDEO",
        slot_list: physicalVideoSlots.map(slot => ({
          start_time: slot.start_time,
          end_time: slot.end_time,
          max_bookings: slot.max_bookings,
          is_video_call: slot.is_video_call,
          is_home_visit: false,
          is_physical_visit: slot.is_physical_visit
        }))
      };
    } else {
      payload = {
        clinic: "5a1f8f39-ca38-464c-93c5-ea8edbd6c03f",
        slot_type: "HOME_VISIT",
        slot_list: homeVisitPreview.map(slot => ({
          start_time: slot.start_time,
          max_bookings: homeVisitTemplate.max_bookings,
          is_video_call: false,
          is_home_visit: true,
          is_physical_visit: false
        }))
      };
    }
    console.log("Bulk Slot Payload:", payload);
    // Submit to API here
    setShowBulkForm(false);
    setBulkModalType('');
  };

  // Restore handleBulkFormChange for bulk slot editing
  const handleBulkFormChange = (idx: number, key: string, value: any) => {
    setPhysicalVideoSlots(prev => prev.map((slot, i) =>
      i === idx ? { ...slot, [key]: value } : slot
    ));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 py-3 sm:py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0">
            <div className="flex items-center space-x-3 sm:space-x-4">
              <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">Slots</h1>
                <p className="text-xs sm:text-sm text-gray-500">Manage your appointment slots</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-3 mt-2 sm:mt-0">
              <button
                onClick={() => setShowBulkForm(true)}
                className="bg-gray-900 hover:bg-gray-800 text-white px-3 sm:px-4 py-2 rounded-xl font-medium transition-colors duration-200 flex items-center space-x-2 text-sm sm:text-base"
              >
                <CalendarDays className="w-4 h-4" />
                <span>Bulk Create</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-2 sm:px-6 py-4 sm:py-6">
        {/* Advanced Filtering Section */}
        <div className="bg-gradient-to-br from-white via-slate-50 to-slate-100 border border-slate-200 rounded-2xl shadow-lg p-3 sm:p-6 mb-6 sm:mb-8 relative overflow-visible">
          <div className="flex flex-col gap-3">
            {/* Main filter row */}
            <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-5">
              {/* Search Bar */}
              <div className="flex flex-col justify-center h-full">
                <label htmlFor="slot-search" className="text-xs font-semibold text-slate-600 mb-1 ml-1 block">Search</label>
                <div className="relative flex items-center">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    id="slot-search"
                    type="text"
                    placeholder="Search slots..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-2 sm:py-3 bg-white/80 backdrop-blur-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all duration-200 text-slate-700 placeholder-slate-400 text-sm sm:text-base shadow-sm h-12 sm:h-14"
                  />
                </div>
              </div>
              {/* Service Dropdown */}
              <div className="flex flex-col justify-center h-full">
                <label htmlFor="service-filter" className="text-xs font-semibold text-slate-600 mb-1 ml-1 block">Service</label>
                <select
                  id="service-filter"
                  value={filters.clinicService}
                  onChange={e => handleFilterChange('clinicService', e.target.value)}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-xl border border-slate-200 bg-white/80 text-slate-700 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all duration-200 text-sm shadow-sm h-12 sm:h-14"
                >
                  <option value="">All Services</option>
                  {clinicServices.map(service => (
                    <option key={service.id} value={service.id}>{service.name}</option>
                  ))}
                </select>
              </div>
              {/* Status Dropdown */}
              <div className="flex flex-col justify-center h-full">
                <label htmlFor="status-filter" className="text-xs font-semibold text-slate-600 mb-1 ml-1 block">Status</label>
                <select
                  id="status-filter"
                  value={filters.status}
                  onChange={e => handleFilterChange('status', e.target.value)}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-xl border border-slate-200 bg-white/80 text-slate-700 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all duration-200 text-sm shadow-sm h-12 sm:h-14"
                >
                  <option value="">All Status</option>
                  <option value="APPROVED">Approved</option>
                  <option value="PENDING">Pending</option>
                  <option value="REJECTED">Rejected</option>
                </select>
              </div>
              {/* Time Range Dropdown */}
              <div className="flex flex-col justify-center h-full">
                <label htmlFor="time-range-filter" className="text-xs font-semibold text-slate-600 mb-1 ml-1 block">Time Range</label>
                <select
                  id="time-range-filter"
                  value={filters.timeRange}
                  onChange={e => handleFilterChange('timeRange', e.target.value)}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-xl border border-slate-200 bg-white/80 text-slate-700 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all duration-200 text-sm shadow-sm h-12 sm:h-14"
                >
                  <option value="">All Times</option>
                  <option value="morning">Morning (6 AM - 12 PM)</option>
                  <option value="afternoon">Afternoon (12 PM - 5 PM)</option>
                  <option value="evening">Evening (5 PM - 12 AM)</option>
                </select>
              </div>
            </div>

            {/* Divider */}
            <div className="w-full flex items-center my-2">
              <div className="flex-1 border-t border-slate-200"></div>
              <span className="mx-2 text-xs text-slate-400">Advanced</span>
              <div className="flex-1 border-t border-slate-200"></div>
            </div>

            {/* Advanced filter row */}
            <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-5">
              {/* From Date */}
              <div className="flex flex-col justify-center h-full">
                <label className="text-xs font-semibold text-slate-600 mb-1 ml-1" htmlFor="fromDatePicker">From</label>
                <DatePicker
                  id="fromDatePicker"
                  selected={filters.fromDate}
                  onChange={(date: Date | null) => handleFilterChange('fromDate', date)}
                  dateFormat="yyyy-MM-dd"
                  placeholderText="From"
                  className="px-3 sm:px-4 py-2 sm:py-3 rounded-xl border border-slate-200 bg-white/80 text-slate-700 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all duration-200 w-full text-sm sm:text-base shadow-sm h-12 sm:h-14"
                  isClearable
                />
              </div>
              {/* To Date */}
              <div className="flex flex-col justify-center h-full">
                <label className="text-xs font-semibold text-slate-600 mb-1 ml-1" htmlFor="toDatePicker">To</label>
                <DatePicker
                  id="toDatePicker"
                  selected={filters.toDate}
                  onChange={(date: Date | null) => handleFilterChange('toDate', date)}
                  dateFormat="yyyy-MM-dd"
                  placeholderText="To"
                  className="px-3 sm:px-4 py-2 sm:py-3 rounded-xl border border-slate-200 bg-white/80 text-slate-700 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all duration-200 w-full text-sm sm:text-base shadow-sm h-12 sm:h-14"
                  isClearable
                />
              </div>
              {/* Capacity Dropdown */}
              <div className="flex flex-col justify-center h-full">
                <label htmlFor="capacity-filter" className="text-xs font-semibold text-slate-600 mb-1 ml-1 block">Capacity</label>
                <select
                  id="capacity-filter"
                  value={filters.capacity}
                  onChange={e => handleFilterChange('capacity', e.target.value)}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-xl border border-slate-200 bg-white/80 text-slate-700 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all duration-200 text-sm shadow-sm h-12 sm:h-14"
                >
                  <option value="">All Capacities</option>
                  <option value="low">Low (≤4)</option>
                  <option value="medium">Medium (5-8)</option>
                  <option value="high">High (&gt;8)</option>
                </select>
              </div>
              {/* Availability Dropdown */}
              <div className="flex flex-col justify-center h-full">
                <label htmlFor="availability-filter" className="text-xs font-semibold text-slate-600 mb-1 ml-1 block">Availability</label>
                <select
                  id="availability-filter"
                  value={filters.availability}
                  onChange={e => handleFilterChange('availability', e.target.value)}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-xl border border-slate-200 bg-white/80 text-slate-700 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all duration-200 text-sm shadow-sm h-12 sm:h-14"
                >
                  <option value="">All</option>
                  <option value="full">Fully Available</option>
                  <option value="available">Available (&gt;50%)</option>
                  <option value="limited">Limited (≤50%)</option>
                  <option value="booked">Fully Booked</option>
                </select>
              </div>
            </div>

            {/* Reset and info row */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 mt-3">
              <div className="flex-1 flex items-center sm:justify-start justify-center">
                <button
                  onClick={clearFilters}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-blue-100 to-blue-300 text-blue-800 font-semibold border border-blue-300 hover:from-blue-200 hover:to-blue-400 transition-all duration-200 shadow-sm text-sm sm:text-base w-full sm:w-auto"
                >
                  Reset Filters
                </button>
              </div>
              <div className="flex-1 flex items-center sm:justify-end justify-center">
                <div className="text-xs sm:text-sm text-slate-600 mt-2 sm:mt-0 text-center sm:text-right w-full">
                  {filteredSlots.length} slots found{' '}
                  {(Object.values(filters).some(f => f) || searchTerm) && (
                    <span className="text-blue-600">(Filters applied)</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Slots Grid */}
        <div className="grid gap-3 sm:gap-4">
          {paginatedSlots.map((slot) => (
            <div key={slot.uuid} className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-6 hover:shadow-md transition-shadow duration-200">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 md:gap-0">
                <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-6 w-full">
                  {/* Date & Time */}
                  <div className="flex items-center space-x-3 w-full sm:w-auto">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                      <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900 text-sm sm:text-base">{formatDate(slot.start_time)}</div>
                      <div className="text-xs sm:text-sm text-gray-500">
                        {formatTime(slot.start_time)} - {formatTime(slot.end_time)}
                      </div>
                    </div>
                  </div>
                  {/* Service */}
                  <div className="flex items-center space-x-3 w-full sm:w-auto">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-50 rounded-xl flex items-center justify-center">
                      <Stethoscope className="w-5 h-5 sm:w-6 sm:h-6 text-purple-500" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900 text-sm sm:text-base">{getServiceName(slot.clinic_service)}</div>
                    </div>
                  </div>
                  {/* Capacity */}
                  <div className="flex items-center space-x-3 w-full sm:w-auto">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-50 rounded-xl flex items-center justify-center">
                      <Users className="w-5 h-5 sm:w-6 sm:h-6 text-green-500" />
                    </div>
                    <div>
                      <div className={`font-semibold ${getAvailabilityColor(slot.available_slots, slot.max_bookings)} text-sm sm:text-base`}>
                        {slot.available_slots}/{slot.max_bookings}
                      </div>
                      <div className="text-xs sm:text-sm text-gray-500">Available</div>
                    </div>
                  </div>
                  {/* Status */}
                  <div>
                    <span className={`inline-flex px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium border ${getStatusColor(slot.status)}`}>
                      {slot.status}
                    </span>
                    {slot.reason_for_rejection && (
                      <div className="flex items-center space-x-1 mt-1">
                        <AlertCircle className="w-3 h-3 text-red-500" />
                        <span className="text-xs text-red-600">{slot.reason_for_rejection}</span>
                      </div>
                    )}
                  </div>
                </div>
                {/* Actions */}
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

          {filteredSlots.length === 0 && (
            <div className="bg-white rounded-2xl border border-gray-200 p-8 sm:p-12 text-center">
              <Calendar className="w-10 h-10 sm:w-12 sm:h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">No slots found</h3>
              <p className="text-gray-500 mb-4 sm:mb-6 text-sm sm:text-base">Try adjusting your search or filter criteria</p>
            </div>
          )}
        </div>

        {/* Pagination Controls */}
        {filteredSlots.length > SLOTS_PER_PAGE && (
          <div className="flex justify-center items-center mt-4 gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 font-medium disabled:opacity-50 text-sm"
            >
              Prev
            </button>
            {[...Array(totalPages)].map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentPage(idx + 1)}
                className={`px-3 py-2 rounded-lg border font-medium text-sm ${currentPage === idx + 1 ? 'bg-blue-500 text-white border-blue-500' : 'bg-white text-gray-700 border-gray-300'}`}
              >
                {idx + 1}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 font-medium disabled:opacity-50 text-sm"
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* Bulk Creation Modal */}
      {showBulkForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[95vh] overflow-y-auto flex flex-col">
            <div className="flex justify-between items-center p-4 sm:p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900">Bulk Create Slots</h2>
              <button
                onClick={() => setShowBulkForm(false)}
                className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-8 flex-1 flex flex-col">
              {/* Slot Type Selection */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Slot Type</label>
                <select
                  value={bulkModalType}
                  onChange={e => setBulkModalType(e.target.value as '' | 'PHYSICAL_OR_VIDEO' | 'HOME_VISIT')}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select type</option>
                  <option value="PHYSICAL_OR_VIDEO">Physical or Video</option>
                  <option value="HOME_VISIT">Home Visit</option>
                </select>
              </div>
              {/* Slot Generator Card */}
              {bulkModalType === 'PHYSICAL_OR_VIDEO' && (
                <SlotPatternGenerator clinicServices={clinicServices} />
              )}
              {bulkModalType === 'HOME_VISIT' && (
                <>
                  <div className="space-y-4 mb-6">
                    <label className="text-sm font-semibold text-gray-700">Time Slots</label>
                    {homeVisitTemplate.timeSlots.map((time, idx) => (
                      <div key={idx} className="flex items-center gap-3">
                        <input
                          type="time"
                          value={time}
                          onChange={(e) => setHomeVisitTemplate(t => { const ts = [...t.timeSlots]; ts[idx]=e.target.value; return { ...t, timeSlots: ts }; })}
                          className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                        <button
                          onClick={e => { e.preventDefault(); setHomeVisitTemplate(t => ({ ...t, timeSlots: t.timeSlots.filter((_,i2)=>i2!==idx) })); }}
                          className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-xl transition-colors"
                        ><Trash2 size={16}/></button>
                      </div>
                    ))}
                    <button
                      onClick={e => { e.preventDefault(); setHomeVisitTemplate(t => ({ ...t, timeSlots: [...t.timeSlots, '09:00'] })); }}
                      className="w-full px-4 py-3 border-2 border-dashed border-emerald-300 rounded-xl text-emerald-600 hover:bg-emerald-50 transition-colors flex items-center justify-center gap-2"
                    ><Plus className="w-4 h-4"/> Add Time Slot</button>
                  </div>
                  {/* Preview Section */}
                  <div className="mt-4">
                    <h4 className="text-base font-semibold mb-2">Preview</h4>
                    <div className="max-h-48 overflow-y-auto border border-gray-200 rounded-xl p-2 bg-gray-50">
                      {homeVisitPreview.map((slot, idx) => (
                        <div key={idx} className="flex gap-4 items-center text-sm py-1 border-b border-gray-100 last:border-b-0">
                          <span>{slot.start_time.replace('T',' ')}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
                <button
                  onClick={() => setShowBulkForm(false)}
                  className="px-6 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors font-semibold"
                >
                  Cancel
                </button>
                <button
                  onClick={submitBulkSlots}
                  disabled={bulkModalType === ''}
                  className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white rounded-xl transition-all flex items-center gap-2 disabled:opacity-50 font-semibold shadow-lg hover:shadow-xl"
                >
                  <Save className="w-4 h-4" />
                  Create {bulkModalType === 'PHYSICAL_OR_VIDEO' ? physicalVideoSlots.length : homeVisitPreview.length} Slots
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && editingSlot && (
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
                  onChange={(e) => setEditingSlot(prev => prev ? {
                    ...prev,
                    clinic_service: e.target.value
                  } : prev)}
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
                    onChange={(date: Date | null) => setEditingSlot(prev => prev ? {
                      ...prev,
                      start_time: date?.toISOString() || ''
                    } : prev)}
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
                    onChange={(date: Date | null) => setEditingSlot(prev => prev ? {
                      ...prev,
                      end_time: date?.toISOString() || ''
                    } : prev)}
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
                  onChange={(e) => setEditingSlot(prev => prev ? {
                    ...prev,
                    max_bookings: parseInt(e.target.value)
                  } : prev)}
                  min="1"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Available Slots</label>
                <input
                  type="number"
                  value={editingSlot.available_slots}
                  onChange={(e) => setEditingSlot(prev => prev ? {
                    ...prev,
                    available_slots: parseInt(e.target.value)
                  } : prev)}
                  min="0"
                  max={editingSlot.max_bookings}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  value={editingSlot.status}
                  onChange={(e) => setEditingSlot(prev => prev ? {
                    ...prev,
                    status: e.target.value
                  } : prev)}
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
                    onChange={(e) => setEditingSlot(prev => prev ? {
                      ...prev,
                      reason_for_rejection: e.target.value
                    } : prev)}
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
      )}

      {/* View Modal */}
      {showViewModal && viewingSlot && (
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
      )}
    </div>
  );
};

function CombinedDateTimePicker({ value, onChange, label, error, minDateTime }: { value: Date | null, onChange: (date: Date | null) => void, label: string, error?: string, minDateTime?: Date | string | null | undefined }) {
  const [dateValue, setDateValue] = useState<Date | null>(value);
  const [timeValue, setTimeValue] = useState(() => {
    if (!value) return '09:00';
    const date = value;
    return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
  });
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

  useEffect(() => {
    setDateValue(value);
    if (value) {
      setTimeValue(`${String(value.getHours()).padStart(2, '0')}:${String(value.getMinutes()).padStart(2, '0')}`);
    }
  }, [value]);

  const handleDateChange = (date: Date | null) => {
    setDateValue(date);
    if (date && timeValue) {
      const [hours, minutes] = timeValue.split(':').map(Number);
      const newDate = new Date(date);
      newDate.setHours(hours, minutes, 0, 0);
      onChange(newDate);
    } else {
      onChange(null);
    }
    setIsDatePickerOpen(false);
  };

  const handleTimeChange = (newTime: string) => {
    setTimeValue(newTime);
    if (dateValue && newTime) {
      const [hours, minutes] = newTime.split(':').map(Number);
      const newDate = new Date(dateValue);
      newDate.setHours(hours, minutes, 0, 0);
      onChange(newDate);
    }
  };

  // Ensure minDate is a Date object or undefined
  let minDate: Date | undefined = undefined;
  if (minDateTime) {
    if (minDateTime instanceof Date) {
      minDate = minDateTime;
    } else if (typeof minDateTime === 'string') {
      const d = new Date(minDateTime);
      if (!isNaN(d.getTime())) minDate = d;
    }
  }

  return (
    <div className="space-y-4">
      <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
        <CalendarDays className="w-4 h-4" />
        {label}
      </label>
      <div className="flex gap-3">
        <div
          onClick={() => setIsDatePickerOpen(true)}
          className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white shadow-sm hover:shadow-md cursor-pointer ${
            error ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300'
          }`}
        >
          {dateValue ? dateValue.toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            year: 'numeric'
          }) : 'Select date...'}
        </div>
        <input
          type="time"
          value={timeValue}
          onChange={(e) => handleTimeChange(e.target.value)}
          className={`w-36 px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white shadow-sm hover:shadow-md ${
            error ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300'
          }`}
        />
      </div>
      {isDatePickerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setIsDatePickerOpen(false)}>
          <div className="fixed inset-0 bg-black/60 backdrop-blur-md transition-opacity duration-300" />
          <div className="relative bg-white rounded-3xl shadow-2xl p-6 max-w-md w-full mx-4 transform transition-all duration-300 scale-100" onClick={e => e.stopPropagation()}>
            <div className="absolute top-4 right-4 z-10">
              <button
                onClick={() => setIsDatePickerOpen(false)}
                className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors duration-200"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>
            <div className="mt-4">
              <DatePicker
                selected={dateValue}
                onChange={handleDateChange}
                minDate={minDate}
                inline
                className="w-full p-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 text-lg"
                calendarClassName="!bg-white !border-2 !border-gray-200 !rounded-2xl !shadow-lg"
                wrapperClassName="w-full"
              />
            </div>
          </div>
        </div>
      )}
      {error && <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700 font-medium">{error}</div>}
    </div>
  );
}

function SlotPatternGenerator({ onPatternSave, clinicServices }: { onPatternSave?: (pattern: any) => void, clinicServices: { id: string, name: string }[] }) {
  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const [selectedDayIdx, setSelectedDayIdx] = useState(0);
  const [slotsByDay, setSlotsByDay] = useState<{ [day: string]: { [time: string]: number } }>({});
  const [showSlotModal, setShowSlotModal] = useState<{ time: string, count: number } | null>(null);
  const [averageServiceTime, setAverageServiceTime] = useState(45);
  const [offDays, setOffDays] = useState<string[]>([]);
  const [patternSaveOption, setPatternSaveOption] = useState<'all' | 'week' | 'month' | null>(null);
  const [notification, setNotification] = useState<string | null>(null);
  const [selectedService, setSelectedService] = useState(clinicServices[0]?.id || '');

  // Generate time slots from 8:00 AM to 9:00 PM, 30 min interval
  const timeSlots = [];
  for (let h = 8; h < 21; h++) {
    timeSlots.push(`${h.toString().padStart(2, '0')}:00`);
    timeSlots.push(`${h.toString().padStart(2, '0')}:30`);
  }
  timeSlots.push('21:00');

  const selectedDay = daysOfWeek[selectedDayIdx];
  const slotsForDay = slotsByDay[selectedDay] || {};
  const isOffDay = offDays.includes(selectedDay);

  // Notification helper
  const showNotif = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 2000);
  };

  const handleSlotClick = (time: string) => {
    setShowSlotModal({ time, count: slotsForDay[time] || 1 });
  };

  const handleSlotModalSubmit = () => {
    if (!showSlotModal) return;
    setSlotsByDay(prev => ({
      ...prev,
      [selectedDay]: {
        ...prev[selectedDay],
        [showSlotModal.time]: showSlotModal.count
      }
    }));
    setShowSlotModal(null);
    showNotif(`Slot for ${showSlotModal.time} set (${showSlotModal.count}x) for ${selectedDay} [${getServiceName(selectedService)}]`);
  };

  const handleOffDayChange = (checked: boolean) => {
    setOffDays(prev => checked ? [...prev, selectedDay] : prev.filter(d => d !== selectedDay));
  };

  // Service name helper
  function getServiceName(id: string) {
    return clinicServices.find(s => s.id === id)?.name || 'Unknown';
  }

  // Save pattern handlers
  const handlePatternSave = (option: 'all' | 'week' | 'month') => {
    setPatternSaveOption(option);
    let newSlotsByDay = { ...slotsByDay };
    let newOffDays = [...offDays];
    if (option === 'all' || option === 'month') {
      // Copy current day's pattern to all days
      daysOfWeek.forEach(day => {
        newSlotsByDay[day] = { ...slotsForDay };
        if (isOffDay) {
          if (!newOffDays.includes(day)) newOffDays.push(day);
        } else {
          newOffDays = newOffDays.filter(d => d !== day);
        }
      });
      showNotif(`Pattern saved for all days [${getServiceName(selectedService)}]`);
    } else if (option === 'week') {
      // Copy current day's pattern to Mon-Fri
      daysOfWeek.slice(0, 5).forEach(day => {
        newSlotsByDay[day] = { ...slotsForDay };
        if (isOffDay) {
          if (!newOffDays.includes(day)) newOffDays.push(day);
        } else {
          newOffDays = newOffDays.filter(d => d !== day);
        }
      });
      showNotif(`Pattern saved for week (Mon-Fri) [${getServiceName(selectedService)}]`);
    }
    setSlotsByDay(newSlotsByDay);
    setOffDays(newOffDays);
    if (onPatternSave) onPatternSave({ slotsByDay: newSlotsByDay, averageServiceTime, offDays: newOffDays, option, selectedService });
  };

  return (
    <div className="space-y-8">
      {/* Notification */}
      {notification && (
        <div className="w-full bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-xl px-2 py-2 sm:px-4 sm:py-2 font-semibold text-center mb-4 animate-fade-in text-base shadow">
          {notification}
        </div>
      )}
      {/* Service Selector */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 mb-4">
        <label className="text-base font-semibold min-w-max">Select Service:</label>
        <select
          value={selectedService}
          onChange={e => setSelectedService(e.target.value)}
          className="flex-1 px-3 py-2 sm:px-4 sm:py-2 border rounded-xl text-sm sm:text-base bg-white shadow-sm focus:ring-2 focus:ring-blue-200 focus:border-blue-400 min-w-[120px]"
        >
          {clinicServices.map(service => (
            <option key={service.id} value={service.id}>{service.name}</option>
          ))}
        </select>
      </div>
      {/* Day Selector */}
      <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-6 overflow-x-auto">
        <button onClick={() => setSelectedDayIdx((selectedDayIdx + 6) % 7)} className="px-2 py-2 sm:px-3 sm:py-2 rounded-full bg-gray-100 hover:bg-gray-200 text-lg font-bold shadow-sm min-w-[44px]">&#8592;</button>
        {daysOfWeek.map((day, idx) => (
          <button
            key={day}
            onClick={() => setSelectedDayIdx(idx)}
            className={`px-2 py-2 sm:px-4 sm:py-2 rounded-full font-semibold text-sm sm:text-base mx-0.5 sm:mx-1 transition-all duration-150 shadow-sm min-w-[44px] ${selectedDayIdx === idx ? 'bg-blue-600 text-white scale-105' : 'bg-white text-gray-700 border border-gray-200 hover:bg-blue-50'}`}
          >
            {day.slice(0, 3)}
          </button>
        ))}
        <button onClick={() => setSelectedDayIdx((selectedDayIdx + 1) % 7)} className="px-2 py-2 sm:px-3 sm:py-2 rounded-full bg-gray-100 hover:bg-gray-200 text-lg font-bold shadow-sm min-w-[44px]">&#8594;</button>
      </div>
      {/* Off Day Checkbox */}
      <div className="flex items-center gap-2 sm:gap-3 mb-4">
        <input type="checkbox" checked={isOffDay} onChange={e => handleOffDayChange(e.target.checked)} id="offday" className="w-5 h-5 rounded border-gray-300 focus:ring-blue-500" />
        <label htmlFor="offday" className="text-sm sm:text-base font-medium">Is it an off day?</label>
      </div>
      {/* Time Slot Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2 sm:gap-3 mb-6">
        {timeSlots.map(time => (
          <button
            key={time}
            disabled={isOffDay}
            onClick={() => handleSlotClick(time)}
            className={`h-12 w-full sm:h-14 sm:w-24 rounded-2xl border text-sm sm:text-base font-semibold flex flex-col items-center justify-center transition-all duration-150 shadow-sm
              ${isOffDay ? 'bg-gray-100 text-gray-400 border-gray-100 cursor-not-allowed' :
                slotsForDay[time] ? 'bg-emerald-500 text-white border-emerald-600 scale-105' : 'bg-white text-gray-700 border-gray-200 hover:bg-blue-50 active:scale-95'}`}
            style={{ fontFamily: 'SF Pro Display, Inter, Arial, sans-serif', minHeight: 44 }}
          >
            {time}
            {slotsForDay[time] && <span className="text-xs font-bold mt-1">{slotsForDay[time]}x</span>}
          </button>
        ))}
      </div>
      {/* Slot Modal */}
      {showSlotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-2 sm:px-0">
          <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-xs sm:max-w-md md:w-96 px-4 py-6 sm:px-8 sm:py-8 flex flex-col items-center border border-gray-100" style={{ fontFamily: 'SF Pro Display, Inter, Arial, sans-serif' }}>
            <button onClick={() => setShowSlotModal(null)} className="absolute top-3 right-3 p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 text-xl shadow-sm" aria-label="Close">
              <span style={{ fontWeight: 700, fontSize: 22 }}>&times;</span>
            </button>
            <h3 className="text-xl sm:text-2xl font-bold mb-6 text-gray-900 text-center tracking-tight">{showSlotModal.time}</h3>
            <div className="flex items-center gap-4 sm:gap-6 mb-8">
              <button onClick={() => setShowSlotModal(s => s && { ...s, count: Math.max(1, s.count - 1) })} className="px-4 py-3 sm:px-5 sm:py-3 rounded-full bg-gray-100 hover:bg-gray-200 text-2xl font-bold shadow min-w-[44px]">-</button>
              <span className="text-3xl sm:text-4xl font-bold w-12 sm:w-16 text-center text-gray-800 select-none">{showSlotModal.count}</span>
              <button onClick={() => setShowSlotModal(s => s && { ...s, count: s.count + 1 })} className="px-4 py-3 sm:px-5 sm:py-3 rounded-full bg-gray-100 hover:bg-gray-200 text-2xl font-bold shadow min-w-[44px]">+</button>
            </div>
            <button onClick={handleSlotModalSubmit} className="w-full bg-blue-600 text-white py-3 rounded-2xl font-semibold text-lg hover:bg-blue-700 transition mb-2 shadow">Submit</button>
            <button onClick={() => setShowSlotModal(null)} className="w-full text-gray-500 py-3 rounded-2xl hover:bg-gray-100 transition text-base">Cancel</button>
          </div>
        </div>
      )}
      {/* Average Service Time */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-4 mb-4">
        <label className="text-base font-medium min-w-max">Enter average service time:</label>
        <input
          type="number"
          min={1}
          value={averageServiceTime}
          onChange={e => setAverageServiceTime(Number(e.target.value))}
          className="w-full sm:w-24 px-3 py-2 border rounded-xl text-base shadow-sm"
        />
        <span className="text-base text-gray-500">min</span>
      </div>
      {/* Pattern Save Buttons */}
      <div className="flex flex-col sm:flex-row flex-wrap gap-2 sm:gap-3 mt-4">
        {['all', 'week', 'month'].map(option => (
          <button
            key={option}
            onClick={() => handlePatternSave(option as 'all' | 'week' | 'month')}
            className={`w-full sm:w-auto px-4 sm:px-6 py-3 rounded-2xl font-semibold border transition-all duration-150 flex items-center gap-2 text-base shadow-sm
              ${patternSaveOption === option ?
                option === 'all' ? 'bg-blue-600 text-white border-blue-700' :
                option === 'week' ? 'bg-emerald-600 text-white border-emerald-700' :
                'bg-purple-600 text-white border-purple-700'
                :
                option === 'all' ? 'bg-blue-100 text-blue-800 border-blue-300 hover:bg-blue-200' :
                option === 'week' ? 'bg-emerald-100 text-emerald-800 border-emerald-300 hover:bg-emerald-200' :
                'bg-purple-100 text-purple-800 border-purple-300 hover:bg-purple-200'}
            `}
          >
            {patternSaveOption === option && <span className="text-lg font-bold">✓</span>}
            {option === 'all' ? 'Save for all days' : option === 'week' ? 'Save for week' : 'Save for month'}
          </button>
        ))}
      </div>
    </div>
  );
}

export default SlotManagementSystem;