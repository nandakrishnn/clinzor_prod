import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Calendar, Clock, User, Phone, Mail, Video, MapPin, Filter, Search, ChevronLeft, ChevronRight, Eye, MoreHorizontal, Info } from 'lucide-react';
import { format, isToday, parseISO, addDays, subDays } from 'date-fns';
import { cancelClinicBookings, getAllClinicBookings } from '@/service/clinic/bookingManagmentService';

// Updated TypeScript types to match the new data structure
interface Booking {
  uuid: string;
  booking_status: 'CANCELED' | 'COMPLETED' | 'SCHEDULED' | 'IN_PROGRESS';
  booking_type: 'VIDEO_CALL' | 'IN_PERSON';
  start_time: string;
  end_time: string;
  session_type: string;
  patient_name: string;
  patient_address: string;
  patient_mobile: string;
  patient_email: string;
  booking_charge: string;
  clinic_name: string;
  clinic_meeting_link: string;
  doctor_gender_preference: string;
  payment_status: string;
  service_default_name: string;
  is_rescheduled: boolean;
  offers_applied: string[];
  bill_no: string;
  room_id: string;
}

const BookingManagement = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [showActionMenu, setShowActionMenu] = useState<string | null>(null);
  const [dateFilter, setDateFilter] = useState<string>(() => format(new Date(), 'yyyy-MM-dd'));
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const dateObj = useMemo(() => new Date(dateFilter), [dateFilter]);
  const isDateToday = useMemo(() => isToday(dateObj), [dateObj]);
  const [loading, setLoading] = useState(false);
  const [paginationData, setPaginationData] = useState({
    current_page: 1,
    total_pages: 1,
    total_items: 0,
    next: null as string | null,
    previous: null as string | null
  });
  // Add state for search timeout
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null);
  const itemsPerPage = 10; // Add this line

  // Time conversion function - FIXED VERSION
  const convertTo12HourFormat = (utcDateString: string) => {
    try {
      const date = new Date(utcDateString);

      // Use local time instead of UTC to match the user's timezone
      let hours = date.getHours();
      const minutes = date.getMinutes();
      const ampm = hours >= 12 ? "PM" : "AM";
      hours = hours % 12;
      hours = hours ? hours : 12;

      // Don't pad with zeros for 12-hour format (optional)
      const hh = String(hours);
      const mm = String(minutes).padStart(2, "0");

      return `${hh}:${mm} ${ampm}`;
    } catch (error) {
      console.error('Error converting time:', error);
      return 'Invalid Time';
    }
  };

  // Improved meeting join logic
  const canJoinMeeting = (startTime: string, endTime: string): { canJoin: boolean; status: 'upcoming' | 'active' | 'past' } => {
    try {
      const now = new Date();
      const start = new Date(startTime);
      const end = new Date(endTime);

      // 5 minutes before start time
      const fiveMinutesBefore = new Date(start.getTime() - 5 * 60 * 1000);

      if (now < fiveMinutesBefore) {
        return { canJoin: false, status: 'upcoming' };
      } else if (now >= fiveMinutesBefore && now <= end) {
        return { canJoin: true, status: 'active' };
      } else {
        return { canJoin: false, status: 'past' };
      }
    } catch (error) {
      console.error('Error checking meeting time:', error);
      return { canJoin: false, status: 'past' };
    }
  };

  // Get join button text and status - IMPROVED VERSION
  const getJoinButtonInfo = (booking: Booking) => {
    // Only enable for video calls with valid meeting links
    if (booking.booking_type !== 'VIDEO_CALL' || !booking.clinic_meeting_link) {
      return {
        text: 'Not Available',
        disabled: true,
        variant: 'disabled',
        tooltip: 'Video call not available'
      };
    }

    // Don't allow joining canceled or completed bookings
    if (booking.booking_status === 'CANCELED' || booking.booking_status === 'COMPLETED') {
      return {
        text: booking.booking_status === 'CANCELED' ? 'Call Canceled' : 'Call Completed',
        disabled: true,
        variant: 'past',
        tooltip: `Booking is ${booking.booking_status.toLowerCase()}`
      };
    }

    const { canJoin, status } = canJoinMeeting(booking.start_time, booking.end_time);

    switch (status) {
      case 'upcoming':
        const timeUntil = convertTo12HourFormat(booking.start_time);
        return {
          text: `Starts at ${timeUntil}`,
          disabled: true,
          variant: 'upcoming',
          tooltip: `Meeting starts at ${timeUntil}`
        };
      case 'active':
        return {
          text: 'Join Now',
          disabled: false,
          variant: 'active',
          tooltip: 'Click to join the video call'
        };
      case 'past':
        return {
          text: 'Call Ended',
          disabled: true,
          variant: 'past',
          tooltip: 'This meeting has ended'
        };
      default:
        return {
          text: 'Not Available',
          disabled: true,
          variant: 'disabled',
          tooltip: 'Video call not available'
        };
    }
  };

  // Handle join meeting - IMPROVED VERSION
  const handleJoinMeeting = (meetingLink: string, booking: Booking) => {
    if (!meetingLink) {
      console.error('No meeting link available');
      return;
    }

    // Double-check if meeting can be joined
    const { canJoin } = canJoinMeeting(booking.start_time, booking.end_time);

    if (!canJoin) {
      console.error('Meeting cannot be joined at this time');
      return;
    }

    // Open meeting in new tab
    window.open(meetingLink, '_blank', 'noopener,noreferrer');
  };

  const fetchBookings = async (
    page: number = currentPage,
    search: string = searchTerm,
    status: string = statusFilter,
    type: string = typeFilter,
    date: string = dateFilter
  ) => {
    try {
      setLoading(true);

      // Determine if we should show today's bookings
      let showTodayParam = false;
      let dateParam = dateFilter;

      // If date filter is today, set show_today=true and clear the date parameter
      if (dateFilter === format(new Date(), 'yyyy-MM-dd')) {
        showTodayParam = true;
        dateParam = ''; // Clear date parameter since we're using show_today
      }

      const data = await getAllClinicBookings(
        page,
        10,
        search,
        status,
        type,
        dateParam,
        showTodayParam
      );

      setBookings(data.data);
      setPaginationData({
        current_page: data.current_page,
        total_pages: data.total_pages,
        total_items: data.total_items,
        next: data.next,
        previous: data.previous
      });
    } catch (error) {
      console.error("Error fetching data ", error);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch and when filters change
  useEffect(() => {
    fetchBookings(1, searchTerm, statusFilter, typeFilter, dateFilter);
    setCurrentPage(1);
  }, [searchTerm, statusFilter, typeFilter, dateFilter]);

  // In your useEffect for page changes:
  useEffect(() => {
    fetchBookings(currentPage, searchTerm, statusFilter, typeFilter, dateFilter);
  }, [currentPage]);

  // Update search handler with debounce
  const handleSearchChange = (term: string) => {
    setSearchTerm(term);

    // Clear previous timeout
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    // Set new timeout for debounced search
    const timeoutId = setTimeout(() => {
      fetchBookings(1, term, statusFilter, typeFilter, dateFilter);
    }, 500);

    setSearchTimeout(timeoutId);
  };

  // Update filter handlers to trigger API calls
  const handleStatusFilterChange = (status: string) => {
    setStatusFilter(status);
  };

  const handleTypeFilterChange = (type: string) => {
    setTypeFilter(type);
  };

  const handleDateFilterChange = (date: string) => {
    setDateFilter(date);

    // If selecting today, we might want to trigger a refresh immediately
    if (date === format(new Date(), 'yyyy-MM-dd')) {
      fetchBookings(1, searchTerm, statusFilter, typeFilter, date);
    }
  };

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }
    };
  }, [searchTimeout]);

  // Status configuration
  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return { color: 'text-emerald-700 bg-emerald-50 border-emerald-200', dot: 'bg-emerald-500' };
      case 'SCHEDULED':
        return { color: 'text-blue-700 bg-blue-50 border-blue-200', dot: 'bg-blue-500' };
      case 'IN_PROGRESS':
        return { color: 'text-amber-700 bg-amber-50 border-amber-200', dot: 'bg-amber-500' };
      case 'CANCELED':
        return { color: 'text-red-700 bg-red-50 border-red-200', dot: 'bg-red-500' };
      default:
        return { color: 'text-slate-700 bg-slate-50 border-slate-200', dot: 'bg-slate-500' };
    }
  };

  // Join button configuration
  const getJoinButtonConfig = (variant: string) => {
    switch (variant) {
      case 'active':
        return 'bg-green-600 hover:bg-green-700 text-white cursor-pointer shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200';
      case 'upcoming':
        return 'bg-blue-100 text-blue-700 border border-blue-200 cursor-not-allowed';
      case 'past':
        return 'bg-gray-100 text-gray-500 border border-gray-200 cursor-not-allowed';
      case 'disabled':
      default:
        return 'bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed';
    }
  };

  // Format date
  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      time: convertTo12HourFormat(dateString)
    };
  };

  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, typeFilter]);

  // Header stats
  const stats = useMemo(() => {
    const total = paginationData.total_items; // Use this instead of totalBookings
    const completed = bookings.filter(b => b.booking_status === 'COMPLETED').length;
    const scheduled = bookings.filter(b => b.booking_status === 'SCHEDULED').length;
    const canceled = bookings.filter(b => b.booking_status === 'CANCELED').length;
    const totalAmount = bookings.reduce((sum, b) => sum + (b.booking_status === 'COMPLETED' ? parseFloat(b.booking_charge) : 0), 0);

    // Most booked service
    const serviceCount: Record<string, number> = {};
    bookings.forEach(b => {
      serviceCount[b.service_default_name] = (serviceCount[b.service_default_name] || 0) + 1;
    });
    const mostBookedServiceEntry = Object.entries(serviceCount).sort((a, b) => b[1] - a[1])[0];
    const mostBookedService = mostBookedServiceEntry ? mostBookedServiceEntry[0] : '-';
    const mostBookedServiceCount = mostBookedServiceEntry ? mostBookedServiceEntry[1] : 0;

    return {
      total,
      completed,
      scheduled,
      canceled,
      totalAmount,
      mostBookedService,
      mostBookedServiceCount
    };
  }, [bookings, paginationData.total_items]);

  // Avatar with initials
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  // Modal focus trap
  const modalRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (selectedBooking && modalRef.current) {
      modalRef.current.focus();
    }
  }, [selectedBooking]);

  // Add this function to your component
  const handleCancelBooking = async (bookingId: string) => {
    try {
      await cancelClinicBookings(bookingId, { booking_status: 'CANCELED' });
      // Refresh bookings after successful cancellation
      await fetchBookings();
      // Close the action menu
      setShowActionMenu(null);
    } catch (error) {
      console.error("Error canceling booking:", error);
      // You might want to add error handling here (e.g., show a toast notification)
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen  justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading ...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen ">
      {/* Sticky Header */}
      <div className="max-w-7xl mx-auto ">
        <div className="flex items-center justify-between h-20">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 via-slate-800 to-slate-600 bg-clip-text text-transparent">
              Booking Management
            </h1>
            <p className="text-sm text-slate-500 mt-1">Manage your clinic bookings</p>
          </div>
          {/* Stats Cards */}
          <div className="hidden lg:flex items-center space-x-6">
            <div className="flex items-center space-x-3 px-4 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
              <div className="p-2 bg-blue-500 rounded-lg">
                <Calendar className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-xs text-blue-600 font-medium">Total Bookings</p>
                <p className="text-lg font-bold text-blue-700">{stats.total}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 px-4 py-2 bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl border border-emerald-100">
              <div className="p-2 bg-emerald-500 rounded-lg">
                <Clock className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-xs text-emerald-600 font-medium">Total Amount Received</p>
                <p className="text-lg font-bold text-emerald-700">${stats.totalAmount.toFixed(2)}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 px-4 py-2 bg-gradient-to-r from-purple-50 to-violet-50 rounded-xl border border-purple-100">
              <div className="p-2 bg-purple-500 rounded-lg">
                <Info className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-xs text-purple-600 font-medium">Most Booked Service</p>
                <p className="text-lg font-bold text-purple-700">
                  {stats.mostBookedService !== '-' ? `${stats.mostBookedService} (${stats.mostBookedServiceCount})` : '-'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>


      {/* Section */}
      <div className="max-w-7xl mx-auto mt-4">
        <div className="bg-white/80 border border-slate-200 rounded-2xl shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mb-4">
            {/* Date Filter */}
            <div>
              <label className="text-xs font-semibold text-slate-600 mb-2 block">Date</label>
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => handleDateFilterChange(format(subDays(dateObj, 1), 'yyyy-MM-dd'))}
                  className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-500 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-300"
                  aria-label="Previous Day"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setDatePickerOpen(true)}
                  className="flex-1 px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all duration-200 text-left font-medium text-slate-700"
                >
                  {isDateToday ? 'Today' : format(dateObj, 'yyyy-MM-dd')}
                </button>
                <button
                  type="button"
                  onClick={() => handleDateFilterChange(format(addDays(dateObj, 1), 'yyyy-MM-dd'))}
                  className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-500 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-300"
                  aria-label="Next Day"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
              {/* Hidden date input for picker */}
              <input
                type="date"
                value={dateFilter}
                onChange={e => { handleDateFilterChange(e.target.value); setDatePickerOpen(false); }}
                className="hidden"
                ref={el => {
                  if (datePickerOpen && el) el.showPicker && el.showPicker();
                }}
                onBlur={() => setDatePickerOpen(false)}
              />
            </div>
            {/* Search Filter */}
            <div className="xl:col-span-2">
              <label className="text-xs font-semibold text-slate-600 mb-2 block">Search</label>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by patient name, email, or booking ID..."
                  value={searchTerm}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-white/80 backdrop-blur-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all duration-200 text-slate-700 placeholder-slate-400"
                />
              </div>
            </div>
            {/* Status Filter */}
            <div>
              <label className="text-xs font-semibold text-slate-600 mb-2 block">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => handleStatusFilterChange(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white/80 text-slate-700 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all duration-200"
              >
                <option value="">All Status</option>
                <option value="SCHEDULED">Scheduled</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="COMPLETED">Completed</option>
                <option value="CANCELED">Canceled</option>
              </select>
            </div>
            {/* Type Filter */}
            <div>
              <label className="text-xs font-semibold text-slate-600 mb-2 block">Type</label>
              <select
                value={typeFilter}
                onChange={(e) => handleTypeFilterChange(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white/80 text-slate-700 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all duration-200"
              >
                <option value="">All Types</option>
                <option value="VIDEO_CALL">Video Call</option>
                <option value="IN_PERSON">In Person</option>
              </select>
            </div>
            {/* Reset Button */}
            <div className="flex items-end">
              <button
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('');
                  setTypeFilter('');
                  setDateFilter(format(new Date(), 'yyyy-MM-dd'));
                }}
                className="px-6 py-3 bg-gradient-to-r from-slate-200 to-slate-100 text-slate-700 rounded-xl font-medium border border-slate-300 hover:from-slate-300 hover:to-slate-200 transition-all duration-200"
              >
                Reset
              </button>
            </div>
          </div>
        </div>

        {/* Table (Responsive) */}
        <div className="w-full h-full overflow-x-auto rounded-2xl border border-slate-200/60 shadow-lg bg-white/80 backdrop-blur-xl relative hidden sm:block overflow-hidden">
          <table className="min-w-[900px]  w-full text-xs sm:text-sm md:text-base align-middle">
            <thead className="sticky top-0 bg-white/90 z-10">
              <tr className="bg-slate-50/80 border-b border-slate-200/60">
                <th className="text-left px-2 py-2 sm:px-4 md:px-6 text-xs font-bold text-slate-600 uppercase tracking-wider align-middle">Patient</th>
                <th className="hidden md:table-cell text-left px-2 py-2 sm:px-4 md:px-6 text-xs font-bold text-slate-600 uppercase tracking-wider align-middle">Booking Details</th>
                <th className="text-left px-2 py-2 sm:px-4 md:px-6 text-xs font-bold text-slate-600 uppercase tracking-wider align-middle">Schedule</th>
                <th className="text-left px-2 py-2 sm:px-4 md:px-6 text-xs font-bold text-slate-600 uppercase tracking-wider align-middle">Type</th>
                <th className="text-left px-2 py-2 sm:px-4 md:px-6 text-xs font-bold text-slate-600 uppercase tracking-wider align-middle">Status</th>
                <th className="hidden sm:table-cell text-left px-2 py-2 sm:px-4 md:px-6 text-xs font-bold text-slate-600 uppercase tracking-wider align-middle">Amount</th>
                <th className="hidden sm:table-cell text-center px-2 py-2 sm:px-4 md:px-6 text-xs font-bold text-slate-600 uppercase tracking-wider align-middle">Join</th>
                <th className="hidden sm:table-cell text-center px-2 py-2 sm:px-4 md:px-6 text-xs font-bold text-slate-600 uppercase tracking-wider align-middle">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/60 ">
              {bookings?.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-16 text-center text-slate-400 text-lg">
                    <span className="inline-block mb-2 text-4xl">😕</span><br />
                    No bookings found matching your filters.
                  </td>
                </tr>
              ) : (
                bookings?.map((booking) => {
                  const statusConfig = getStatusConfig(booking?.booking_status);
                  const scheduledDateTime = formatDateTime(booking?.start_time);
                  const joinButtonInfo = getJoinButtonInfo(booking);

                  return (
                    <tr key={booking?.uuid} className="hover:bg-slate-50/70 transition-colors duration-150 align-middle">
                      {/* Patient Info */}
                      <td className="px-2 py-2 sm:px-4 md:px-6 md:py-4 align-middle">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center shadow-md">
                            <span className="text-white font-bold text-lg" aria-label={`Avatar for ${booking?.patient_name}`}>{getInitials(booking?.patient_name)}</span>
                          </div>
                          <div className="flex flex-col justify-center">
                            <div className="font-semibold text-slate-900 leading-tight">{booking?.patient_name}</div>
                            <div className="text-xs text-slate-500 flex flex-col sm:items-start mt-1 leading-tight">
                              <span className="flex items-center">
                                <Mail className="w-3 h-3 mr-1" />
                                {booking?.patient_email}
                              </span>
                              <span className="flex items-center">
                                <Phone className="w-3 h-3 mr-1" />
                                {booking?.patient_mobile}
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Booking Details */}
                      <td className="hidden md:table-cell px-2 py-2 sm:px-4 md:px-6 md:py-4 align-middle">
                        <div className="flex flex-col justify-center gap-1">
                          <div className="font-medium text-sm text-slate-900 leading-tight whitespace-nowrap overflow-hidden text-ellipsis max-w-[100px]">#{booking?.uuid}</div>
                          <div className="text-xs text-slate-500 leading-tight">{booking?.session_type}</div>
                          {booking?.patient_address && (
                            <div className="text-xs text-slate-500 flex items-center leading-tight">
                              <MapPin className="w-3 h-3 mr-1" />
                              {booking.patient_address}
                            </div>
                          )}
                        </div>
                      </td>
                      {/* Schedule */}
                      <td className="px-2 py-2 sm:px-4 md:px-6 md:py-4 align-middle">
                        <div className="flex flex-col justify-center gap-1">
                          <div className="font-medium text-slate-900 leading-tight">{scheduledDateTime?.date}</div>
                          <div className="text-xs text-slate-500 leading-tight">{scheduledDateTime?.time}</div>
                        </div>
                      </td>
                      {/* Type */}
                      <td className="px-2 py-2 sm:px-4 md:px-6 md:py-4 align-middle">
                        <div className="flex items-center space-x-2">
                          {booking?.booking_type === 'VIDEO_CALL' ? (
                            <a href={booking?.clinic_meeting_link} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-2">
                              <div className="flex items-center space-x-2">
                                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                  <Video className="w-4 h-4 text-blue-600" />
                                </div>
                                <div className="flex flex-col justify-center">
                                  <div className="text-xs font-medium text-slate-900 leading-tight">Online</div>
                                  <div className="text-xs text-slate-500 leading-tight">Video Call</div>
                                </div>
                              </div>
                            </a>
                          ) : (
                            <div className="flex items-center space-x-2">
                              <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                                <MapPin className="w-4 h-4 text-emerald-600" />
                              </div>
                              <div className="flex flex-col justify-center">
                                <div className="text-xs font-medium text-slate-900 leading-tight">In-Person</div>
                                <div className="text-xs text-slate-500 leading-tight">Clinic Visit</div>
                              </div>
                            </div>
                          )}
                        </div>
                      </td>
                      {/* Status */}
                      <td className="px-2 py-2 sm:px-4 md:px-6 md:py-4 align-middle">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${statusConfig?.color}`}>
                          <div className={`w-1.5 h-1.5 ${statusConfig?.dot} rounded-full mr-2`}></div>
                          {booking.booking_status.replace('_', ' ')}
                        </span>
                      </td>
                      {/* Amount */}
                      <td className="hidden sm:table-cell px-2 py-2 sm:px-4 md:px-6 md:py-4 align-middle">
                        <div className="font-semibold text-slate-900 leading-tight">₹{parseFloat(booking?.booking_charge).toFixed(2)}</div>
                      </td>
                      {/* Join Button - FIXED VERSION */}
                      <td className="hidden sm:table-cell px-2 py-2 sm:px-4 md:px-6 md:py-4 align-middle">
                        <button
                          onClick={() => handleJoinMeeting(booking.clinic_meeting_link, booking)}
                          disabled={joinButtonInfo.disabled}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${getJoinButtonConfig(joinButtonInfo.variant)}`}
                          title={joinButtonInfo.tooltip}
                        >
                          {joinButtonInfo.text}
                        </button>
                      </td>
                      {/* Actions */}
                      <td className="hidden sm:table-cell px-2 py-2 sm:px-4 md:px-6 md:py-4 align-middle">
                        <div className="flex items-center justify-center space-x-2 relative">
                          <button
                            onClick={() => setSelectedBooking(booking)}
                            className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-300"
                            title="View Details"
                            aria-label="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setShowActionMenu(showActionMenu === booking.uuid ? null : booking?.uuid)}
                            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-300"
                            title="More Actions"
                            aria-label="More Actions"
                          >
                            <MoreHorizontal className="w-4 h-4" />
                          </button>
                          {/* Action Menu with transition */}
                          <div
                            className={`absolute right-0 top-12 w-40 bg-white border border-slate-200 rounded-xl shadow-xl z-50 transition-all duration-200 ${showActionMenu === booking.uuid ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-95 pointer-events-none'}`}
                            tabIndex={-1}
                            aria-label="Action Menu"
                          >
                            <button
                              onClick={() => setSelectedBooking(booking)}
                              className="w-full text-left px-4 py-2 hover:bg-slate-50 text-slate-700 rounded-t-xl" tabIndex={showActionMenu === booking.uuid ? 0 : -1}>
                              View Details
                            </button>
                            <button
                              onClick={() => handleCancelBooking(booking.uuid)}
                              className="w-full text-left px-4 py-2 hover:bg-red-50 text-red-600 rounded-b-xl" tabIndex={showActionMenu === booking.uuid ? 0 : -1}>
                              Cancel Booking
                            </button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Card List */}
        <div className="sm:hidden space-y-4">
          {bookings.length === 0 ? (
            <div className="py-16 text-center text-slate-400 text-lg bg-white/80 rounded-2xl shadow-lg">
              <span className="inline-block mb-2 text-4xl">😕</span><br />
              No bookings found matching your filters.
            </div>
          ) : (
            bookings.map((booking) => {
              const statusConfig = getStatusConfig(booking.booking_status);
              const scheduledDateTime = formatDateTime(booking.start_time);
              const joinButtonInfo = getJoinButtonInfo(booking);

              return (
                <div key={booking.uuid} className="bg-white/90 rounded-2xl shadow-lg border border-slate-200 p-4 flex flex-col gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center shadow-md">
                      <span className="text-white font-bold text-lg" aria-label={`Avatar for ${booking.patient_name}`}>{getInitials(booking.patient_name)}</span>
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-slate-900 leading-tight">{booking.patient_name}</div>
                      <div className="text-xs text-slate-500">{booking.patient_email}</div>
                    </div>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold border ${statusConfig.color}`}>
                      <div className={`w-1.5 h-1.5 ${statusConfig.dot} rounded-full mr-2`}></div>
                      {booking.booking_status.replace('_', ' ')}
                    </span>
                  </div>
                  <div className="flex flex-col gap-1 text-sm">
                    <div className="flex items-center gap-2"><span className="font-medium">Booking ID:</span> #{booking.uuid}</div>
                    <div className="flex items-center gap-2"><span className="font-medium">Type:</span> {booking.booking_type === 'VIDEO_CALL' ? 'Video Call' : 'In-Person'}</div>
                    <div className="flex items-center gap-2"><span className="font-medium">Consultation:</span> {booking.session_type}</div>
                    <div className="flex items-center gap-2"><span className="font-medium">Amount:</span> ₹{parseFloat(booking.booking_charge).toFixed(2)}</div>
                    <div className="flex items-center gap-2"><span className="font-medium">Schedule:</span> {scheduledDateTime.date}, {scheduledDateTime.time}</div>
                  </div>
                  {/* Join Button for Mobile - FIXED VERSION */}
                  <button
                    onClick={() => handleJoinMeeting(booking.clinic_meeting_link, booking)}
                    disabled={joinButtonInfo.disabled}
                    className={`w-full px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${getJoinButtonConfig(joinButtonInfo.variant)}`}
                    title={joinButtonInfo.tooltip}
                  >
                    {joinButtonInfo.text}
                  </button>
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => setSelectedBooking(booking)}
                      className="flex-1 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg font-medium hover:bg-blue-100 transition"
                    >
                      View Details
                    </button>
                    <button
                      onClick={() => setShowActionMenu(showActionMenu === booking.uuid ? null : booking.uuid)}
                      className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg font-medium hover:bg-slate-200 transition"
                    >
                      More
                    </button>
                  </div>
                  {/* Action Menu (mobile) */}
                  {showActionMenu === booking.uuid && (
                    <div className="mt-2 bg-white border border-slate-200 rounded-xl shadow-lg z-50">
                      <button className="w-full text-left px-4 py-2 hover:bg-slate-50 text-slate-700 rounded-t-xl">View Details</button>
                      <button
                        onClick={() => handleCancelBooking(booking.uuid)}
                        className="w-full text-left px-4 py-2 hover:bg-red-50 text-red-600 rounded-b-xl">Cancel Booking</button>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Pagination */}
        {paginationData.total_pages > 1 && (
          <div className="bg-white px-2 sm:px-6 py-3 border-t border-slate-200/60 flex flex-col sm:flex-row items-center justify-between gap-2 z-30 mt-4">
            <div className="text-xs sm:text-sm text-slate-500">
              Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, paginationData.total_items)} of {paginationData.total_items} bookings
            </div>
            <div className="flex flex-wrap justify-center items-center gap-2">
              <button
                onClick={() => {
                  const nextPage = Math.max(1, currentPage - 1);
                  if (nextPage !== currentPage) {
                    setCurrentPage(nextPage);
                  }
                }}
                disabled={currentPage === 1}
                className="px-4 py-2 rounded-lg border border-slate-200 bg-white/80 text-slate-700 font-semibold disabled:opacity-50"
              >
                Prev
              </button>
              {Array.from({ length: paginationData.total_pages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`px-3 py-2 rounded-lg border border-slate-200 font-semibold ${currentPage === i + 1 ? 'bg-blue-600 text-white' : 'bg-white/80 text-slate-700'}`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() => {
                  const nextPage = Math.min(paginationData.total_pages, currentPage + 1);
                  if (nextPage !== currentPage) {
                    setCurrentPage(nextPage);
                  }
                }}
                disabled={currentPage === paginationData.total_pages}
                className="px-4 py-2 rounded-lg border border-slate-200 bg-white/80 text-slate-700 font-semibold disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Detail Modal with transition and focus trap */}
      {selectedBooking && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 z-50 transition-all duration-300 animate-fade-in">
          <div
            className="bg-white/95 backdrop-blur-xl rounded-3xl w-full max-w-lg sm:max-w-2xl max-h-[90vh] overflow-y-auto border border-white/20 shadow-2xl focus:outline-none animate-scale-in"
            tabIndex={-1}
            ref={modalRef}
            aria-modal="true"
            role="dialog"
          >
            <div className="p-4 sm:p-8">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-8 gap-2">
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Booking Details</h2>
                <button
                  onClick={() => setSelectedBooking(null)}
                  className="self-end text-slate-400 hover:text-slate-600 text-2xl font-bold focus:outline-none focus:ring-2 focus:ring-blue-300"
                  aria-label="Close Modal"
                >
                  ×
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-2">Patient Information</h3>
                    <div className="space-y-2 text-sm">
                      <div><span className="font-medium">Name:</span> {selectedBooking.patient_name}</div>
                      <div><span className="font-medium">Email:</span> {selectedBooking.patient_email}</div>
                      <div><span className="font-medium">Phone:</span> {selectedBooking.patient_mobile}</div>
                      <div><span className="font-medium">Gender Preference:</span> {selectedBooking.doctor_gender_preference}</div>
                      <div><span className="font-medium">Location:</span> {selectedBooking.patient_address}</div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-2">Booking Information</h3>
                    <div className="space-y-2 text-sm">
                      <div><span className="font-medium">Booking ID:</span> {selectedBooking.uuid}</div>
                      <div><span className="font-medium">Type:</span> {selectedBooking.booking_type === 'VIDEO_CALL' ? 'Video Call' : 'In-Person'}</div>
                      <div><span className="font-medium">Status:</span> {selectedBooking.booking_status}</div>
                      <div><span className="font-medium">Payment Status:</span> {selectedBooking.payment_status}</div>
                      <div><span className="font-medium">Consultation:</span> {selectedBooking.session_type}</div>
                      <div><span className="font-medium">Service:</span> {selectedBooking.service_default_name}</div>
                      <div><span className="font-medium">Amount:</span> ₹{parseFloat(selectedBooking.booking_charge).toFixed(2)}</div>
                      <div><span className="font-medium">Clinic:</span> {selectedBooking.clinic_name}</div>
                      <div><span className="font-medium">Bill No:</span> {selectedBooking.bill_no}</div>
                    </div>
                  </div>
                </div>

                <div className="md:col-span-2">
                  <h3 className="font-semibold text-slate-900 mb-2">Schedule</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 text-sm">
                    <div>
                      <span className="font-medium">Start:</span> {formatDateTime(selectedBooking.start_time).date} at {convertTo12HourFormat(selectedBooking.start_time)}
                    </div>
                    <div>
                      <span className="font-medium">End:</span> {formatDateTime(selectedBooking.end_time).date} at {convertTo12HourFormat(selectedBooking.end_time)}
                    </div>
                  </div>
                </div>

                {selectedBooking.offers_applied && selectedBooking.offers_applied.length > 0 && (
                  <div className="md:col-span-2">
                    <h3 className="font-semibold text-slate-900 mb-2">Offers Applied</h3>
                    <div className="text-sm">
                      {selectedBooking.offers_applied.join(', ')}
                    </div>
                  </div>
                )}

                {/* Join Button in Modal - FIXED VERSION */}
                {selectedBooking.booking_type === 'VIDEO_CALL' && selectedBooking.clinic_meeting_link && (
                  <div className="md:col-span-2">
                    <h3 className="font-semibold text-slate-900 mb-2">Video Call</h3>
                    <div className="flex justify-center">
                      <button
                        onClick={() => handleJoinMeeting(selectedBooking.clinic_meeting_link, selectedBooking)}
                        disabled={getJoinButtonInfo(selectedBooking).disabled}
                        className={`px-6 py-3 rounded-lg text-lg font-medium transition-all duration-200 ${getJoinButtonConfig(getJoinButtonInfo(selectedBooking).variant)}`}
                        title={getJoinButtonInfo(selectedBooking).tooltip}
                      >
                        {getJoinButtonInfo(selectedBooking).text}
                      </button>
                    </div>
                  </div>
                )}
              </div>
              <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-4 mt-6 sm:mt-8">
                <button
                  onClick={() => setSelectedBooking(null)}
                  className="px-6 py-3 text-slate-600 bg-slate-100 rounded-xl hover:bg-slate-200 transition-all duration-200 font-semibold"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Animations */}
      <style jsx global>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in {
          animation: fade-in 0.2s ease;
        }
        @keyframes scale-in {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-scale-in {
          animation: scale-in 0.2s cubic-bezier(0.4,0,0.2,1);
        }
      `}</style>
    </div>
  );
};

export default BookingManagement;