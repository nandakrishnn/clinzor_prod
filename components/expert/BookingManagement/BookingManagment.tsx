import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Search, Filter, RefreshCw, Calendar, CheckCircle, XCircle,
  AlertCircle, Eye, ChevronLeft, ChevronRight, Clock, X
} from 'lucide-react';
import { GetAllExpertBooking } from '@/service/expert/bookingMangementService';

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

// Add new interface for Slot
interface Slot {
  uuid: string;
  expert: string;
  created_by: string | null;
  start_time: string;
  end_time: string;
  status: string;
  is_booked: boolean;
  reason_for_rejection: string | null;
}

// Add missing type definitions
interface ChatMessage {
  id: number;
  text: string;
  sender: string;
  timestamp: string;
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

// Add type definitions for status configs
type StatusConfig = {
  color: string;
  icon: string;
};

type StatusConfigs = {
  [key: string]: StatusConfig;
};

interface Filters {
  booking_status: string;
  payment_status: string;
  booking_type: string;
  payment_mode: string;
  from_date: string;
  to_date: string;
  sort_by: string;
  quick_date: string;
}

const ExpertBookingManager: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [totalItemsCount, setTotalItemsCount] = useState(0);
  const [selectedBooking, setSelectedBooking] = useState<any | null>(null);
  const [modalType, setModalType] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState<Notification | null>(null);
  const [editData, setEditData] = useState<Partial<Booking>>({});


  // Filter states
  const [filters, setFilters] = useState<Filters>({
    booking_status: 'ALL',
    payment_status: 'ALL',
    booking_type: 'ALL',
    payment_mode: 'ALL',
    from_date: '',
    to_date: '',
    sort_by: 'date_desc',
    quick_date: 'ALL'
  });
  const bookingStatuses = ['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELED'];
  const paymentStatuses = ['PENDING', 'COMPLETED', 'FAILED', 'REFUNDED'];

  // Add a counter for booking numbers
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  // Add quick date options
  const quickDateOptions = [
    { value: 'ALL', label: 'All Time' },
    { value: 'TODAY', label: 'Today' },
    { value: 'TOMORROW', label: 'Tomorrow' },
    { value: 'THIS_WEEK', label: 'This Week' },
    { value: 'NEXT_WEEK', label: 'Next Week' },
    { value: 'THIS_MONTH', label: 'This Month' }
  ];

  // Add sorting options
  const sortOptions = [
    { value: 'date_desc', label: 'Date (Newest First)' },
    { value: 'date_asc', label: 'Date (Oldest First)' },
    { value: 'status_asc', label: 'Status (A-Z)' },
    { value: 'status_desc', label: 'Status (Z-A)' }
  ];
  // Debounce search term
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500); // 500ms delay

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  const fetchBooking = async (page = 1, search = '', filters: Filters) => {
    try {
      setIsLoading(true);

      // Prepare query parameters
      const params: any = {
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
      if (filters.booking_type !== 'ALL') {
        params.booking_type = filters.booking_type;
      }
      if (filters.payment_mode !== 'ALL') {
        params.payment_mode = filters.payment_mode;
      }
      if (filters.from_date) {
        params.from_date = filters.from_date;
      }
      if (filters.to_date) {
        params.to_date = filters.to_date;
      }
      if (filters.sort_by) {
        params.sort_by = filters.sort_by;
      }
      if (filters.quick_date && filters.quick_date !== 'ALL') {
        params.quick_date = filters.quick_date;
      }

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

  // Fetch data when filters change
  useEffect(() => {
    fetchBooking(currentPage, debouncedSearchTerm, filters);
  }, [currentPage, debouncedSearchTerm, filters]);

  console.log("Bookings fetched:", bookings);

  const filteredBookings = bookings;
  // Memoize pagination calculations
  const paginationData = useMemo(() => {
    const totalItems = totalItemsCount;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const paginatedBookings = bookings; // API already returns paginated data

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
    const pending = filteredBookings.filter(b => b.booking_status === 'PENDING').length;
    const confirmed = filteredBookings.filter(b => b.booking_status === 'CONFIRMED').length;
    const completed = filteredBookings.filter(b => b.booking_status === 'COMPLETED').length;
    const canceled = filteredBookings.filter(b => b.booking_status === 'CANCELED').length;

    return { total, pending, confirmed, completed, canceled };
  }, [filteredBookings]);

  // Update the status configs with proper typing
  const statusConfigs = useMemo(() => ({
    booking: {
      'PENDING': { color: 'bg-yellow-100 text-yellow-800', icon: '⏳' },
      'CONFIRMED': { color: 'bg-blue-100 text-blue-800', icon: '✅' },
      'COMPLETED': { color: 'bg-green-100 text-green-800', icon: '✅' },
      'CANCELED': { color: 'bg-red-100 text-red-800', icon: '❌' }
    } as StatusConfigs,
    payment: {
      'PENDING': { color: 'bg-yellow-100 text-yellow-800', icon: '⏳' },
      'COMPLETED': { color: 'bg-green-100 text-green-800', icon: '✅' },
      'FAILED': { color: 'bg-red-100 text-red-800', icon: '❌' },
      'REFUNDED': { color: 'bg-orange-100 text-orange-800', icon: '↩️' }
    } as StatusConfigs
  }), []);

  // Update the utility functions with proper typing
  const getStatusConfig = useCallback((status: string): StatusConfig => {
    return statusConfigs.booking[status] || { color: 'bg-gray-100 text-gray-800', icon: '❓' };
  }, [statusConfigs]);

  const formatDateTime = useCallback((startTime: string, endTime: string) => {
    const start = new Date(startTime);
    const end = new Date(endTime);

    const date = start.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });

    const time = `${start.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    })} - ${end.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    })}`;

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
      booking_type: 'ALL',
      from_date: '',
      to_date: '',
      payment_mode: 'ALL',
      sort_by: 'date_desc',
      quick_date: 'ALL'
    });
    setSearchTerm('');
    setCurrentPage(1);
  };

  const handleView = useCallback((booking: Booking) => {
    setSelectedBooking(booking);
    setModalType('view');
  }, []);

  const handleComplete = useCallback((booking: Booking) => {
    setSelectedBooking(booking);
    setModalType('complete');
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

  // Update the chatMessages state with proper typing
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);

  // Update the newMessage state with proper typing
  const [newMessage, setNewMessage] = useState('');

  // Update the showChat state with proper typing
  const [showChat, setShowChat] = useState(false);

  // Update the isCallActive state with proper typing
  const [isCallActive, setIsCallActive] = useState(false);

  // Event handler for sending a message
  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    // Simulate sending a message
    const message: ChatMessage = {
      id: Date.now(),
      text: newMessage,
      sender: 'expert',
      timestamp: new Date().toISOString()
    };
    setChatMessages(prev => [...prev, message]);
    setNewMessage('');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-3">
      {/* Notification */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-xl shadow-lg transform transition-all duration-300 ease-in-out ${notification?.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' :
            notification?.type === 'error' ? 'bg-red-50 text-red-800 border border-red-200' :
              'bg-amber-50 text-amber-800 border border-amber-200'
          }`}>
          <div className="flex items-center space-x-2">
            {notification?.type === 'success' ? <CheckCircle size={20} className="text-emerald-600" /> :
              notification?.type === 'error' ? <XCircle size={20} className="text-red-600" /> :
                <AlertCircle size={20} className="text-amber-600" />}
            <span className="font-medium">{notification?.message}</span>
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
              onClick={() => window.location.reload()}
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
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search by booking ID, customer, expert, or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 text-base border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
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

                {/* Existing filters with improved styling */}
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

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">From Date</label>
                  <input
                    type="date"
                    value={filters.from_date}
                    onChange={(e) => setFilters({ ...filters, from_date: e.target.value, quick_date: 'ALL' })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white transition-all duration-200"
                  />
                </div>

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
                {paginationData?.paginatedBookings.map((booking, index) => {
                  const { date, time } = formatDateTime(booking?.start_time, booking?.end_time);
                  const statusConfig = getStatusConfig(booking?.booking_status);
                  return (
                    <tr key={booking.uuid} className="hover:bg-gray-50 transition-colors duration-200">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {paginationData.startIndex + index}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {booking?.customer_name}
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
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium`}>
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
                            <button
                              onClick={() => handleComplete(booking)}
                              className="flex items-center space-x-2 px-3 py-2 text-green-600 hover:text-green-900 bg-green-50 hover:bg-green-100 rounded-lg transition-all duration-200"
                              title="Mark Booking as Complete"
                            >
                              <CheckCircle size={16} />
                              <span>Complete</span>
                            </button>
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
                    <div className="text-sm font-semibold text-gray-900">{date}</div>
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
                      <button
                        onClick={() => handleComplete(booking)}
                        className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 text-green-600 hover:text-green-900 bg-green-50 hover:bg-green-100 rounded-lg transition-all duration-200 text-xs"
                        title="Mark Booking as Complete"
                      >
                        <CheckCircle size={14} />
                        <span>Complete</span>
                      </button>
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
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-gray-50 p-4 rounded-xl">
                <h3 className="text-sm font-medium text-gray-500">Customer Name</h3>
                <p className="mt-1 text-sm text-gray-900 capitalize">{selectedBooking?.customer_name}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-xl">
                <h3 className="text-sm font-medium text-gray-500">Customer Phone Number</h3>
                <p className="mt-1 text-sm text-gray-900 capitalize">{selectedBooking?.customer_phone_number}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-xl">
                <h3 className="text-sm font-medium text-gray-500">Booking Number</h3>
                <p className="mt-1 text-sm text-gray-900">{selectedBooking?.uuid}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-xl">
                <h3 className="text-sm font-medium text-gray-500">Date & Time</h3>
                <p className="mt-1 text-sm text-gray-900">
                  {formatDateTime(selectedBooking?.start_time || '', selectedBooking?.end_time || '').date}
                  <br />
                  {formatDateTime(selectedBooking?.start_time || '', selectedBooking?.end_time || '').time}
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-xl">
                <h3 className="text-sm font-medium text-gray-500">Status</h3>
                <p className="mt-1 text-sm text-gray-900">{selectedBooking?.booking_status}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-xl">
                <h3 className="text-sm font-medium text-gray-500">Payment Status</h3>
                <p className="mt-1 text-sm text-gray-900">{selectedBooking?.payment_status}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-xl">
                <h3 className="text-sm font-medium text-gray-500">Booking Type</h3>
                <p className="mt-1 text-sm text-gray-900">{selectedBooking?.booking_type}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-xl">
                <h3 className="text-sm font-medium text-gray-500">Payment Mode</h3>
                <p className="mt-1 text-sm text-gray-900">{selectedBooking?.payment_mode}</p>
              </div>
            </div>
          </div>
        )}
      </Modal>

      <Modal
        isOpen={modalType === 'edit'}
        onClose={closeModal}
        title="Edit Booking"
      >
        {selectedBooking && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Booking Status</label>
              <select
                value={editData.booking_status || selectedBooking.booking_status}
                onChange={(e) => setEditData({ ...editData, booking_status: e.target.value })}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              >
                {bookingStatuses.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Payment Status</label>
              <select
                value={editData.payment_status || selectedBooking.payment_status}
                onChange={(e) => setEditData({ ...editData, payment_status: e.target.value })}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              >
                {paymentStatuses.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={closeModal}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setIsLoading(true);
                  setTimeout(() => {
                    setBookings(prev => prev.map(b =>
                      b.uuid === selectedBooking.uuid ? { ...b, ...editData } : b
                    ));
                    setIsLoading(false);
                    closeModal();
                    showNotification('Booking updated successfully!');
                  }, 1000);
                }}
                disabled={isLoading}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {isLoading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        )}
      </Modal>

      <Modal
        isOpen={modalType === 'delete'}
        onClose={closeModal}
        title="Delete Booking"
      >
        {selectedBooking && (
          <div className="space-y-4">
            <p className="text-sm text-gray-500">
              Are you sure you want to delete this booking? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={closeModal}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setIsLoading(true);
                  setTimeout(() => {
                    setBookings(prev => prev.filter(b => b.uuid !== selectedBooking.uuid));
                    setIsLoading(false);
                    closeModal();
                    showNotification('Booking deleted successfully!');
                  }, 1000);
                }}
                disabled={isLoading}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
              >
                {isLoading ? 'Deleting...' : 'Delete'}
              </button>
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
                onClick={() => {
                  setIsLoading(true);
                  setTimeout(() => {
                    setBookings(prev => prev.map(b =>
                      b.uuid === selectedBooking.uuid ? { ...b, booking_status: 'COMPLETED' } : b
                    ));
                    setIsLoading(false);
                    closeModal();
                    showNotification('Booking marked as completed!');
                  }, 1000);
                }}
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

      {/* Chat Panel */}
      {showChat && isCallActive && (
        <div className="fixed right-4 top-4 bottom-4 w-80 bg-white rounded-2xl shadow-2xl border border-gray-200 z-40 flex flex-col">
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            <h3 className="font-semibold text-gray-900">Chat</h3>
            <button
              onClick={() => setShowChat(false)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X size={16} />
            </button>
          </div>

          <div className="flex-1 p-4 overflow-y-auto space-y-3">
            {chatMessages.length === 0 ? (
              <p className="text-gray-500 text-center text-sm">No messages yet</p>
            ) : (
              chatMessages.map((message) => (
                <div key={message.id} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-gray-700">{message.sender}</span>
                    <span className="text-xs text-gray-500">{message.timestamp}</span>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-900">
                    {message.text}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Add chat input form */}
          <form onSubmit={sendMessage} className="p-4 border-t border-gray-200">
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                type="submit"
                disabled={!newMessage.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Send
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default ExpertBookingManager;