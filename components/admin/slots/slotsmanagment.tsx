import React, { useState, useEffect } from 'react';
import { Clock, Users, Calendar, Check, X, Filter, Search, ChevronLeft, ChevronRight, AlertCircle, CheckCircle2, XCircle, Eye, EyeOff, Plus, Building2, MapPin, User, Activity, Settings, RefreshCw, Download, Upload } from 'lucide-react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { approveSlot, bulkApproveSlots, getAllSlots, rejectSlot } from '@/service/admin/bookingManagementService';

interface Slot {
  uuid: string;
  clinic: string;
  start_time: string;
  end_time: string;
  created_by: string;
  max_bookings: number;
  available_slots: number;
  status: 'APPROVED' | 'DRAFT' | 'REJECTED';
  reason_for_rejection: string | null;
  is_video_call: boolean;
  is_home_visit: boolean;
  is_physical_visit: boolean;
  slot_type: string;
  female_doctor_count: number;
  clinic_name: string;
}

const PAGE_SIZE = 6;

interface PaginationData {
  current_page: number;
  total_pages: number;
  total_items: number;
  next: string | null;
  previous: string | null;
}

const SlotManager = () => {
  const [slots, setSlots] = useState<Slot[]>([]);
  const [selectedSlots, setSelectedSlots] = useState<string[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [fromDate, setFromDate] = useState<string>('');
  const [toDate, setToDate] = useState<string>('');
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [actionFeedback, setActionFeedback] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  const [viewSlot, setViewSlot] = useState<Slot | null>(null);
  const [clinicNameSearch, setClinicNameSearch] = useState('');
  const [fromDateObj, setFromDateObj] = useState<Date | null>(null);
  const [toDateObj, setToDateObj] = useState<Date | null>(null);
  const [paginationData, setPaginationData] = useState<PaginationData>({
    current_page: 1,
    total_pages: 1,
    total_items: 0,
    next: null,
    previous: null
  });
  const [isLoading, setIsLoading] = useState(false);
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');

  // Debounce search query
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchQuery(clinicNameSearch);
    }, 500); // 500ms debounce

    return () => {
      clearTimeout(handler);
    };
  }, [clinicNameSearch]);

  const fetchSlots = async (page = 1, search = '', status = 'ALL', fromDate = '', toDate = '') => {
    setIsLoading(true);
    try {
      // Prepare query parameters
      const params: any = {
        page: page
      };

      // Add search parameter if provided
      if (search) {
        params.search = search;
      }

      // Add status filter if provided and not 'ALL'
      if (status !== 'ALL') {
        params.status = status;
      }

      // Add date filters if provided
      if (fromDate) {
        params.from_date = fromDate;
      }

      if (toDate) {
        params.to_date = toDate;
      }

      const response = await getAllSlots(params);

      setSlots(response.data);
      setPaginationData({
        current_page: response.current_page,
        total_pages: response.total_pages,
        total_items: response.total_items,
        next: response.next,
        previous: response.previous
      });
    } catch (error) {
      console.error(error);
      showFeedback('error', 'Failed to fetch slots. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch slots when any filter changes
  useEffect(() => {
    // Reset to first page when filters change
    setCurrentPage(1);
    fetchSlots(1, debouncedSearchQuery, statusFilter, fromDate, toDate);
  }, [debouncedSearchQuery, statusFilter, fromDate, toDate]);

  // Fetch slots when page changes (but keep filters)
  useEffect(() => {
    fetchSlots(currentPage, debouncedSearchQuery, statusFilter, fromDate, toDate);
  }, [currentPage]);;

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
      case 'DRAFT':
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

  const handleApprove = async (slotId: string) => {
    try {
      // Call your API to approve the slot
      await approveSlot(slotId);
      setSlots(slots.map(slot =>
        slot.uuid === slotId
          ? { ...slot, status: 'APPROVED', reason_for_rejection: null }
          : slot
      ));
      showFeedback('success', 'Slot approved successfully and is now available for booking!');
    } catch (error) {
      showFeedback('error', 'Failed to approve slot. Please try again.');
    }
  };

  const handleReject = async (slotId: string, reason?: string) => {
    const rejectionReason = reason || prompt('Please provide a detailed reason for rejection:');
    if (rejectionReason) {
      try {
        // Call your API to reject the slot
        await rejectSlot(slotId, rejectionReason);
        setSlots(slots.map(slot =>
          slot.uuid === slotId
            ? { ...slot, status: 'REJECTED', reason_for_rejection: rejectionReason }
            : slot
        ));
        showFeedback('success', 'Slot rejected and removed from available bookings.');
      } catch (error) {
        showFeedback('error', 'Failed to reject slot. Please try again.');
      }
    }
  };

  const handleBulkApprove = async () => {
    const count = selectedSlots.length;
    if (count === 0) {
      showFeedback('error', 'No slots selected for approval');
      return;
    }

    try {
      // Assuming you want to approve as "NORMAL" type
      // You could make this configurable if needed
      await bulkApproveSlots("NORMAL", selectedSlots);

      // Update local state
      setSlots(slots.map(slot =>
        selectedSlots.includes(slot.uuid)
          ? { ...slot, status: 'APPROVED', reason_for_rejection: null }
          : slot
      ));
      setSelectedSlots([]);

      showFeedback('success', `${count} slot${count > 1 ? 's' : ''} approved successfully!`);
    } catch (error) {
      showFeedback('error', 'Failed to approve slots. Please try again.');
    }
  };

  const handleBulkReject = async () => {
    const reason = prompt('Please provide a reason for rejecting these slots:');
    if (reason) {
      const count = selectedSlots.length;
      try {
        // Call your API to bulk reject slots
        // await bulkRejectSlots(selectedSlots, reason);
        setSlots(slots.map(slot =>
          selectedSlots.includes(slot.uuid)
            ? { ...slot, status: 'REJECTED', reason_for_rejection: reason }
            : slot
        ));
        setSelectedSlots([]);
        showFeedback('success', `${count} slot${count > 1 ? 's' : ''} rejected and removed from booking availability.`);
      } catch (error) {
        showFeedback('error', 'Failed to reject slots. Please try again.');
      }
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
    const visibleIds = slots.map(slot => slot.uuid);
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
    setClinicNameSearch('');
    setFromDate('');
    setToDate('');
    setFromDateObj(null);
    setToDateObj(null);
    setCurrentPage(1);
  };

  const getSlotTypeDisplay = (slot: Slot) => {
    if (slot.slot_type === 'PHYSICAL_OR_VIDEO') {
      return 'Physical/Video';
    } else if (slot.slot_type === 'HOME_VISIT') {
      return 'Home Visit';
    }
    return slot.slot_type;
  };

  const getVisitTypeBadges = (slot: Slot) => {
    return (
      <div className="flex gap-1 flex-wrap">
        {slot.is_video_call && (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
            Video
          </span>
        )}
        {slot.is_physical_visit && (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
            Physical
          </span>
        )}
        {slot.is_home_visit && (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800">
            Home
          </span>
        )}
      </div>
    );
  };

  // Get counts for quick stats
  const statusCounts = slots.reduce((acc, slot) => {
    acc[slot.status] = (acc[slot.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Calculate additional metrics
  const totalBookableSlots = slots.filter(s => s.status === 'APPROVED').reduce((sum, slot) => sum + slot.available_slots, 0);
  const totalMaxCapacity = slots.filter(s => s.status === 'APPROVED').reduce((sum, slot) => sum + slot.max_bookings, 0);
  const utilizationRate = totalMaxCapacity > 0 ? Math.round(((totalMaxCapacity - totalBookableSlots) / totalMaxCapacity) * 100) : 0;

  const handleViewSlot = (uuid: string) => {
    const slot = slots.find((s) => s.uuid === uuid);
    if (slot) setViewSlot(slot);
  };

  const closeViewSlot = () => setViewSlot(null);

  return (
    <div className="min-h-screen p-2 sm:p-4 md:p-6">
      <div className="max-w-7xl mx-auto w-full">
        {/* Action Feedback */}
        {actionFeedback && (
          <div className={`fixed top-4 right-4 z-50 p-4 rounded-xl shadow-2xl border-l-4 ${actionFeedback.type === 'success'
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

        {/* Header Section */}
        <div className="mb-5">
          <div className="bg-white rounded-2xl">
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

        {/* Filters Section */}
        <div className="mb-4">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
            <div className="p-4 sm:px-6 border-b border-gray-100">
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
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative w-full">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Building2 className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search by clinic name..."
                    value={clinicNameSearch}
                    onChange={(e) => setClinicNameSearch(e.target.value)}
                    className="pl-10 w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none"
                  />
                </div>

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="rounded-xl border border-gray-300 px-4 py-3 focus:outline-none "
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
                      className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none bg-white cursor-pointer"
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
                      className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none bg-white cursor-pointer"
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
              Appointment Slots ({paginationData.total_items})
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
                      checked={selectedSlots.length === slots.length && slots.length > 0}
                      onChange={() => {
                        if (selectedSlots.length === slots.length) {
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
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center">
                      <div className="flex justify-center">
                        <RefreshCw className="h-8 w-8 text-blue-500 animate-spin" />
                      </div>
                    </td>
                  </tr>
                ) : slots.length === 0 ? (
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
                  slots.map((slot) => {
                    const { date, time } = formatDateTime(slot.start_time);
                    const statusConfig = getStatusConfig(slot.status);

                    return (
                      <tr key={slot.uuid} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input
                            type="checkbox"
                            checked={selectedSlots.includes(slot.uuid)}
                            onChange={() => toggleSlotSelection(slot.uuid)}
                            className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                          />
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="bg-indigo-100 p-2 rounded-lg">
                              <Activity className="h-5 w-5 text-indigo-600" />
                            </div>
                            <div>
                              <div className="font-medium text-gray-900">{slot.clinic_name}</div>
                              <div className="text-sm text-gray-500 flex items-center gap-1">
                                <Building2 className="h-4 w-4" />
                                {slot.clinic_name}
                              </div>
                              <div className="text-xs text-gray-400 mt-1">
                                Type: {getSlotTypeDisplay(slot)} |
                                Female doctors: {slot.female_doctor_count}
                              </div>
                              {getVisitTypeBadges(slot)}
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
                            {slot.status === 'DRAFT' && (
                              <>
                                <button
                                  onClick={() => handleApprove(slot.uuid)}
                                  className="text-emerald-600 hover:text-emerald-900 flex items-center gap-1"
                                >
                                  <Check className="h-4 w-4" />
                                  Approve
                                </button>
                                <button
                                  onClick={() => handleReject(slot.uuid)}
                                  className="text-red-600 hover:text-red-900 flex items-center gap-1"
                                >
                                  <X className="h-4 w-4" />
                                  Reject
                                </button>
                              </>
                            )}
                            <button
                              onClick={() => handleViewSlot(slot.uuid)}
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
          {slots.length > 0 && (
            <div className="border-t border-gray-200 px-4 py-3 sm:px-6">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-sm text-gray-700">
                  Showing <span className="font-medium">{(paginationData.current_page - 1) * PAGE_SIZE + 1}</span> to{' '}
                  <span className="font-medium">{Math.min(paginationData.current_page * PAGE_SIZE, paginationData.total_items)}</span> of{' '}
                  <span className="font-medium">{paginationData.total_items}</span> slots
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage(paginationData.current_page - 1)}
                    disabled={!paginationData.previous}
                    className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${!paginationData.previous
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-white text-gray-700 hover:bg-gray-50'
                      }`}
                  >
                    <ChevronLeft className="h-5 w-5" />
                    Previous
                  </button>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(5, paginationData.total_pages) }, (_, i) => {
                      let pageNum: number;
                      if (paginationData.total_pages <= 5) {
                        pageNum = i + 1;
                      } else if (paginationData.current_page <= 3) {
                        pageNum = i + 1;
                      } else if (paginationData.current_page >= paginationData.total_pages - 2) {
                        pageNum = paginationData.total_pages - 4 + i;
                      } else {
                        pageNum = paginationData.current_page - 2 + i;
                      }

                      return (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${paginationData.current_page === pageNum
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
                    onClick={() => setCurrentPage(paginationData.current_page + 1)}
                    disabled={!paginationData.next}
                    className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${!paginationData.next
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
                    {viewSlot.clinic_name}
                  </h4>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Building2 className="h-4 w-4" />
                    {viewSlot.clinic_name}
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    <span className="font-medium">Slot Type:</span> {getSlotTypeDisplay(viewSlot)} |
                    <span className="font-medium ml-2">Female Doctors:</span> {viewSlot.female_doctor_count}
                  </div>
                </div>
              </div>

              {/* Visit Type Section */}
              <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                <h5 className="text-md font-bold text-blue-800 mb-2">Visit Type</h5>
                <div className="flex gap-2">
                  {viewSlot.is_video_call && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                      Video Call
                    </span>
                  )}
                  {viewSlot.is_physical_visit && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                      Physical Visit
                    </span>
                  )}
                  {viewSlot.is_home_visit && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                      Home Visit
                    </span>
                  )}
                </div>
              </div>

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