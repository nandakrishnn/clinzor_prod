import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Search, Filter, RefreshCw, Calendar, CheckCircle, XCircle,
  AlertCircle, Eye, ChevronLeft, ChevronRight, Clock, X
} from 'lucide-react';
import { GetAllExpertBooking } from '@/service/expert/bookingMangementService';
import { convertTo12HourFormat } from '@/utils/formatters';
import { useSession } from 'next-auth/react';

// Types
interface Booking {
  uuid: string;
  created_by: string;
  payment_mode: string;
  start_time: string;
  end_time: string;
  payment_status: string;
  booking_status: string;
  room_id: string | null;
  expert_meeting_link: string | null;
  booking_charge: string;
  booking_type: string;
  customer: string;
  slot: string;
  expert: string;
  customer_name?: string;
  customer_phone_number?: string;
}

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

interface Notification {
  message: string;
  type: 'success' | 'error' | 'warning';
}

interface Filters {
  booking_status: string;
  payment_status: string;
  from_date: string;
  to_date: string;
  sort_by: string;
  quick_date: string;
}

// Modal Component
const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, size = 'md' }) => {
  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl'
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className={`bg-white rounded-xl shadow-xl ${sizeClasses[size]} w-full max-h-[90vh] overflow-y-auto`}>
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <XCircle size={20} />
          </button>
        </div>
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

const ExpertBookingManager: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [totalItemsCount, setTotalItemsCount] = useState(0);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [modalType, setModalType] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState<Notification | null>(null);
  const [editData, setEditData] = useState<Partial<Booking>>({});
  const { data: session, status }: any = useSession();

  // Filter states
  const [filters, setFilters] = useState<Filters>({
    booking_status: 'ALL',
    payment_status: 'ALL',
    from_date: '',
    to_date: '',
    sort_by: 'date_desc',
    quick_date: 'ALL'
  });

  const bookingStatuses = ['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELED'];
  const paymentStatuses = ['PENDING', 'COMPLETED', 'FAILED', 'REFUNDED'];

  // Quick date options
  const quickDateOptions = [
    { value: 'ALL', label: 'All Time' },
    { value: 'TODAY', label: 'Today' },
    { value: 'TOMORROW', label: 'Tomorrow' },
    { value: 'THIS_WEEK', label: 'This Week' },
    { value: 'NEXT_WEEK', label: 'Next Week' },
    { value: 'THIS_MONTH', label: 'This Month' }
  ];

  // Sort options
  const sortOptions = [
    { value: 'date_desc', label: 'Date (Newest First)' },
    { value: 'date_asc', label: 'Date (Oldest First)' },
    { value: 'status_asc', label: 'Status (A-Z)' },
    { value: 'status_desc', label: 'Status (Z-A)' }
  ];

  // Status configs
  const statusConfigs = useMemo((): { booking: any; payment: any } => ({
    booking: {
      'PENDING': { color: 'bg-yellow-100 text-yellow-800', icon: '⏳' },
      'CONFIRMED': { color: 'bg-blue-100 text-blue-800', icon: '✅' },
      'COMPLETED': { color: 'bg-green-100 text-green-800', icon: '✅' },
      'CANCELED': { color: 'bg-red-100 text-red-800', icon: '❌' }
    },
    payment: {
      'PENDING': { color: 'bg-yellow-100 text-yellow-800', icon: '⏳' },
      'COMPLETED': { color: 'bg-green-100 text-green-800', icon: '✅' },
      'FAILED': { color: 'bg-red-100 text-red-800', icon: '❌' },
      'REFUNDED': { color: 'bg-orange-100 text-orange-800', icon: '↩️' }
    }
  }), []);

  // Function to format date for API (YYYY-MM-DDTHH:mm:ss)
  const formatDateForAPI = (dateString: string, isStartDate: boolean = true): string => {
    if (!dateString) return '';

    const date = new Date(dateString);
    if (isStartDate) {
      // For from_date: set time to 00:00:00
      date.setHours(0, 0, 0, 0);
    } else {
      // For to_date: set time to 23:59:59
      date.setHours(23, 59, 59, 999);
    }

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
  };

  const fetchBooking = async (page = 1, search = '', filters: Filters) => {
    try {
      setIsLoading(true);

      // Prepare query parameters
      const params: any = {
        expert: session?.user?.uuid,
        page: page
      };

      // Add search parameter if provided
      if (search) {
        params.search = search;
      }

      // Add filter parameters if provided and not 'ALL'
      if (filters.booking_status !== 'ALL') {
        params.booking_status = filters.booking_status;
      }
      if (filters.payment_status !== 'ALL') {
        params.payment_status = filters.payment_status;
      }
      if (filters.from_date) {
        // Format from_date with time 00:00:00
        params.from_date = formatDateForAPI(filters.from_date, true);
      }
      if (filters.to_date) {
        // Format to_date with time 23:59:59
        params.to_date = formatDateForAPI(filters.to_date, false);
      }
      if (filters.sort_by) {
        params.sort_by = filters.sort_by;
      }
      if (filters.quick_date && filters.quick_date !== 'ALL') {
        params.quick_date = filters.quick_date;
      }

      console.log('API Params:', params); // For debugging

      const data = await GetAllExpertBooking(params);
      setBookings(data.data);
      setTotalItemsCount(data.total_items);
    } catch (error) {
      console.error("Error fetching bookings:", error);
      setNotification({ message: 'Failed to fetch bookings', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  }

  // Fetch data when filters change or page changes
  useEffect(() => {
    if (session?.user?.uuid) {
      fetchBooking(currentPage, searchTerm, filters);
    }
  }, [currentPage, filters, session]);

  // Handle search submission (both button click and enter key)
  const handleSearch = () => {
    setCurrentPage(1); // Reset to page 1 when searching
    fetchBooking(1, searchTerm, filters);
  };

  // Handle enter key in search input
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // Memoize pagination calculations
  const paginationData = useMemo(() => {
    const totalItems = totalItemsCount;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const paginatedBookings = bookings;

    return {
      totalItems,
      totalPages,
      paginatedBookings,
      startIndex: (currentPage - 1) * itemsPerPage + 1,
      endIndex: Math.min(currentPage * itemsPerPage, totalItems)
    };
  }, [bookings, currentPage, itemsPerPage, totalItemsCount]);

  // Memoize statistics calculations
  const stats = useMemo(() => {
    const total = totalItemsCount;
    const pending = bookings.filter(b => b.booking_status === 'PENDING').length;
    const confirmed = bookings.filter(b => b.booking_status === 'CONFIRMED').length;
    const completed = bookings.filter(b => b.booking_status === 'COMPLETED').length;
    const canceled = bookings.filter(b => b.booking_status === 'CANCELED').length;

    return { total, pending, confirmed, completed, canceled };
  }, [bookings]);

  // Utility functions
  const getStatusConfig = useCallback((status: string): any => {
    return statusConfigs.booking[status] || { color: 'bg-gray-100 text-gray-800', icon: '❓' };
  }, [statusConfigs]);

  const formatDateTime = useCallback((startTime: string, endTime: string) => {
    const start = new Date(startTime);

    const date = start.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric"
    });

    const time = `${convertTo12HourFormat(startTime)} – ${convertTo12HourFormat(endTime)}`;

    return { date, time };
  }, []);

  // Event handlers
  const showNotification = (message: string, type: 'success' | 'error' | 'warning' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const clearFilters = () => {
    setFilters({
      booking_status: 'ALL',
      payment_status: 'ALL',
      from_date: '',
      to_date: '',
      sort_by: 'date_desc',
      quick_date: 'ALL'
    });
    setSearchTerm('');
    setCurrentPage(1);
    fetchBooking(1, '', {
      booking_status: 'ALL',
      payment_status: 'ALL',
      from_date: '',
      to_date: '',
      sort_by: 'date_desc',
      quick_date: 'ALL'
    });
  };

  const handleView = useCallback((booking: Booking) => {
    setSelectedBooking(booking);
    setModalType('view');
  }, []);

  const handleComplete = useCallback((booking: Booking) => {
    setSelectedBooking(booking);
    setModalType('complete');
  }, []);

  const handleCancel = useCallback((booking: Booking) => {
    setSelectedBooking(booking);
    setModalType('cancel');
  }, []);

  const closeModal = useCallback(() => {
    setModalType('');
    setSelectedBooking(null);
    setEditData({});
  }, []);

  const handleCancelConfirm = () => {
    if (!selectedBooking) return;

    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setBookings(prev => prev.map(b =>
        b.uuid === selectedBooking.uuid
          ? { ...b, booking_status: 'CANCELED' }
          : b
      ));
      setIsLoading(false);
      closeModal();
      showNotification('Booking canceled successfully!');
    }, 1000);
  };

  const handleCompleteConfirm = () => {
    if (!selectedBooking) return;

    setIsLoading(true);
    setTimeout(() => {
      setBookings(prev => prev.map(b =>
        b.uuid === selectedBooking.uuid
          ? { ...b, booking_status: 'COMPLETED' }
          : b
      ));
      setIsLoading(false);
      closeModal();
      showNotification('Booking marked as completed!');
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-3">
      {/* Notification */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-xl shadow-lg transform transition-all duration-300 ease-in-out ${notification.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' :
          notification.type === 'error' ? 'bg-red-50 text-red-800 border border-red-200' :
            'bg-amber-50 text-amber-800 border border-amber-200'
          }`}>
          <div className="flex items-center space-x-2">
            {notification.type === 'success' ? <CheckCircle size={20} className="text-emerald-600" /> :
              notification.type === 'error' ? <XCircle size={20} className="text-red-600" /> :
                <AlertCircle size={20} className="text-amber-600" />}
            <span className="font-medium">{notification.message}</span>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-6 sm:py-10">
        {/* Header Section */}
        <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between mb-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">Expert Bookings</h1>
            <p className="text-base sm:text-lg text-gray-600">Manage and track all expert bookings with advanced filtering</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => fetchBooking(currentPage, searchTerm, filters)}
              className="flex-1 sm:flex-none flex items-center justify-center space-x-2 px-5 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-200 shadow-sm hover:shadow-md"
            >
              <RefreshCw size={18} className="animate-spin-slow" />
              <span className="text-sm sm:text-base font-medium">Refresh</span>
            </button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6 mb-4">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stats.total}</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-xl">
                <Calendar className="text-blue-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-3xl font-bold text-yellow-600 mt-1">{stats.pending}</p>
              </div>
              <div className="p-3 bg-yellow-50 rounded-xl">
                <Clock className="text-yellow-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Confirmed</p>
                <p className="text-3xl font-bold text-blue-600 mt-1">{stats.confirmed}</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-xl">
                <CheckCircle className="text-blue-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-3xl font-bold text-emerald-600 mt-1">{stats.completed}</p>
              </div>
              <div className="p-3 bg-emerald-50 rounded-xl">
                <CheckCircle className="text-emerald-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Canceled</p>
                <p className="text-3xl font-bold text-red-600 mt-1">{stats.canceled}</p>
              </div>
              <div className="p-3 bg-red-50 rounded-xl">
                <XCircle className="text-red-600" size={24} />
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-4">
          <div className="flex flex-col space-y-4">
            <div className="w-full">
              <div className="relative flex items-center">
                <Search className="absolute left-4 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search by booking ID, customer, expert, or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="w-full pl-12 pr-24 py-3 text-base border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
                <button
                  onClick={handleSearch}
                  className="absolute right-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm font-medium"
                >
                  Search
                </button>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center space-x-2 px-5 py-3 rounded-xl transition-all duration-200 ${showFilters ? 'bg-blue-100 text-blue-700 shadow-sm' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
              >
                <Filter size={18} />
                <span className="text-base font-medium">Advanced Filters</span>
              </button>

              {(Object.values(filters).some(f => f !== 'ALL' && f !== '') || searchTerm) && (
                <button
                  onClick={clearFilters}
                  className="px-5 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200 text-base font-medium"
                >
                  Clear All Filters
                </button>
              )}
            </div>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="mt-6 pt-6 border-t border-gray-100">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {/* Quick Date Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Quick Date Filter</label>
                  <select
                    value={filters.quick_date}
                    onChange={(e) => setFilters({ ...filters, quick_date: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white transition-all duration-200"
                  >
                    {quickDateOptions.map(option => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </div>

                {/* Sort By */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
                  <select
                    value={filters.sort_by}
                    onChange={(e) => setFilters({ ...filters, sort_by: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white transition-all duration-200"
                  >
                    {sortOptions.map(option => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </div>

                {/* Booking Status */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Booking Status</label>
                  <select
                    value={filters.booking_status}
                    onChange={(e) => setFilters({ ...filters, booking_status: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white transition-all duration-200"
                  >
                    <option value="ALL">All Status</option>
                    {bookingStatuses.map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </div>

                {/* Payment Status */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Payment Status</label>
                  <select
                    value={filters.payment_status}
                    onChange={(e) => setFilters({ ...filters, payment_status: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white transition-all duration-200"
                  >
                    <option value="ALL">All Payments</option>
                    {paymentStatuses.map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </div>

                {/* From Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">From Date</label>
                  <input
                    type="date"
                    value={filters.from_date}
                    onChange={(e) => setFilters({ ...filters, from_date: e.target.value, quick_date: 'ALL' })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white transition-all duration-200"
                  />
                </div>

                {/* To Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">To Date</label>
                  <input
                    type="date"
                    value={filters.to_date}
                    onChange={(e) => setFilters({ ...filters, to_date: e.target.value, quick_date: 'ALL' })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white transition-all duration-200"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Results Summary */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="text-sm text-gray-600">
              Showing <span className="font-medium text-gray-900">{paginationData.startIndex}</span> to <span className="font-medium text-gray-900">{paginationData.endIndex}</span> of <span className="font-medium text-gray-900">{paginationData.totalItems}</span> bookings
              {(Object.values(filters).some(f => f !== 'ALL' && f !== '') || searchTerm) && (
                <span className="ml-2 text-blue-600">
                  (filtered)
                </span>
              )}
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-sm text-gray-600">Page {currentPage} of {paginationData.totalPages}</span>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="p-2 rounded-xl border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, paginationData.totalPages))}
                  disabled={currentPage === paginationData.totalPages}
                  className="p-2 rounded-xl border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bookings Table (Desktop) */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Desktop Table: hidden on mobile */}
          <div className="overflow-x-auto w-full hidden sm:block">
            <table className="w-full min-w-[600px]">
              <thead>
                <tr className="bg-gray-100 border-b border-gray-100">
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">#</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Customer Name</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date & Time</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Payment Mode</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {paginationData.paginatedBookings.map((booking, index) => {
                  const { date, time } = formatDateTime(booking.start_time, booking.end_time);
                  const statusConfig = getStatusConfig(booking.booking_status);
                  return (
                    <tr key={booking.uuid} className="hover:bg-gray-50 transition-colors duration-200">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {paginationData.startIndex + index}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {booking.customer_name || 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{date}</div>
                        <div className="text-sm text-gray-500">{time}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${statusConfig.color}`}>
                          {statusConfig.icon} {booking.booking_status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          {booking.payment_mode}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-3">
                          <button
                            onClick={() => handleView(booking)}
                            className="flex items-center space-x-2 px-3 py-2 text-blue-600 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 rounded-lg transition-all duration-200"
                            title="View Booking Details"
                          >
                            <Eye size={16} />
                            <span>View</span>
                          </button>
                          {booking.booking_status === 'PENDING' && (
                            <>
                              <button
                                onClick={() => handleComplete(booking)}
                                className="flex items-center space-x-2 px-3 py-2 text-green-600 hover:text-green-900 bg-green-50 hover:bg-green-100 rounded-lg transition-all duration-200"
                                title="Mark Booking as Complete"
                              >
                                <CheckCircle size={16} />
                                <span>Complete</span>
                              </button>
                              <button
                                onClick={() => handleCancel(booking)}
                                className="flex items-center space-x-2 px-3 py-2 text-red-600 hover:text-red-900 bg-red-50 hover:bg-red-100 rounded-lg transition-all duration-200"
                                title="Cancel Booking"
                              >
                                <XCircle size={16} />
                                <span>Cancel</span>
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Card/List View: only on mobile */}
          <div className="sm:hidden p-2 space-y-4">
            {paginationData.paginatedBookings.map((booking, index) => {
              const { date, time } = formatDateTime(booking.start_time, booking.end_time);
              const statusConfig = getStatusConfig(booking.booking_status);
              return (
                <div key={booking.uuid} className="bg-gray-50 rounded-xl shadow-sm border border-gray-100 p-4 flex flex-col space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">#{paginationData.startIndex + index}</span>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${statusConfig.color}`}>{statusConfig.icon} {booking.booking_status}</span>
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-gray-900">{booking.customer_name || 'N/A'}</div>
                    <div className="text-sm text-gray-900">{date}</div>
                    <div className="text-xs text-gray-500">{time}</div>
                  </div>
                  <div className="flex space-x-2 pt-2">
                    <button
                      onClick={() => handleView(booking)}
                      className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 text-blue-600 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 rounded-lg transition-all duration-200 text-xs"
                      title="View Booking Details"
                    >
                      <Eye size={14} />
                      <span>View</span>
                    </button>
                    {booking.booking_status === 'PENDING' && (
                      <>
                        <button
                          onClick={() => handleComplete(booking)}
                          className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 text-green-600 hover:text-green-900 bg-green-50 hover:bg-green-100 rounded-lg transition-all duration-200 text-xs"
                          title="Mark Booking as Complete"
                        >
                          <CheckCircle size={14} />
                          <span>Complete</span>
                        </button>
                        <button
                          onClick={() => handleCancel(booking)}
                          className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 text-red-600 hover:text-red-900 bg-red-50 hover:bg-red-100 rounded-lg transition-all duration-200 text-xs"
                          title="Cancel Booking"
                        >
                          <XCircle size={14} />
                          <span>Cancel</span>
                        </button>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Modals */}
      <Modal
        isOpen={modalType === 'view'}
        onClose={closeModal}
        title="Booking Details"
        size="lg"
      >
        {selectedBooking && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="bg-gray-50 p-4 rounded-xl">
                <h3 className="text-sm font-medium text-gray-500">Customer Name</h3>
                <p className="mt-1 text-sm text-gray-900 capitalize">{selectedBooking.customer_name || 'N/A'}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-xl">
                <h3 className="text-sm font-medium text-gray-500">Customer Phone Number</h3>
                <p className="mt-1 text-sm text-gray-900 capitalize">{selectedBooking.customer_phone_number || 'N/A'}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-xl">
                <h3 className="text-sm font-medium text-gray-500">Booking Number</h3>
                <p className="mt-1 text-sm text-gray-900">{selectedBooking.uuid}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-xl">
                <h3 className="text-sm font-medium text-gray-500">Date & Time</h3>
                <p className="mt-1 text-sm text-gray-900">
                  {formatDateTime(selectedBooking.start_time, selectedBooking.end_time).date}
                  <br />
                  {formatDateTime(selectedBooking.start_time, selectedBooking.end_time).time}
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-xl">
                <h3 className="text-sm font-medium text-gray-500">Status</h3>
                <p className="mt-1 text-sm text-gray-900">{selectedBooking.booking_status}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-xl">
                <h3 className="text-sm font-medium text-gray-500">Payment Status</h3>
                <p className="mt-1 text-sm text-gray-900">{selectedBooking.payment_status}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-xl">
                <h3 className="text-sm font-medium text-gray-500">Booking Type</h3>
                <p className="mt-1 text-sm text-gray-900">{selectedBooking.booking_type}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-xl">
                <h3 className="text-sm font-medium text-gray-500">Payment Mode</h3>
                <p className="mt-1 text-sm text-gray-900">{selectedBooking.payment_mode}</p>
              </div>
            </div>
          </div>
        )}
      </Modal>

      <Modal
        isOpen={modalType === 'complete'}
        onClose={closeModal}
        title="Complete Booking"
      >
        {selectedBooking && (
          <div className="space-y-4">
            <p className="text-sm text-gray-500">
              Are you sure you want to mark this booking as complete?
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={closeModal}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                onClick={handleCompleteConfirm}
                disabled={isLoading}
                className="px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
              >
                {isLoading ? 'Completing...' : 'Mark as Complete'}
              </button>
            </div>
          </div>
        )}
      </Modal>

      <Modal
        isOpen={modalType === 'cancel'}
        onClose={closeModal}
        title="Cancel Booking"
      >
        {selectedBooking && (
          <div className="space-y-4">
            <p className="text-sm text-gray-500">
              Are you sure you want to cancel this booking? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={closeModal}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                No, Keep Booking
              </button>
              <button
                onClick={handleCancelConfirm}
                disabled={isLoading}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
              >
                {isLoading ? 'Canceling...' : 'Yes, Cancel Booking'}
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ExpertBookingManager;