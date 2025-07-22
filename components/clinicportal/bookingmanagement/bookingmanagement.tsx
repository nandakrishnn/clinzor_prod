import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Calendar, Clock, User, Phone, Mail, Video, MapPin, Filter, Search, ChevronLeft, ChevronRight, Eye, MoreHorizontal, Info } from 'lucide-react';
import { format, isToday, parseISO, addDays, subDays } from 'date-fns';

// TypeScript types for safety
interface Booking {
  id: number;
  status: 'CANCELED' | 'COMPLETED' | 'SCHEDULED' | 'IN_PROGRESS';
  type: 'ONLINE' | 'OFFLINE';
  scheduledTime: string;
  endTime: string;
  consultationType: string;
  patientName: string;
  patientLocation: string;
  patientPhone: string;
  patientEmail: string;
  amount: number;
  callType: string;
  gender: string;
  bookingId: string;
}

const BookingManagement = () => {
  // Sample booking data (parsed from your provided data)
  const [bookings] = useState<Booking[]>([
    {
      id: 1,
      status: 'CANCELED',
      type: 'ONLINE',
      scheduledTime: '2025-06-21T18:57:00Z',
      endTime: '2025-06-21T19:21:00Z',
      consultationType: 'CONSULTATION',
      patientName: 'patient 1',
      patientLocation: 'somewhere',
      patientPhone: '1234567890',
      patientEmail: 'patient@email.com',
      amount: 400.00,
      callType: 'VIDEO_CALL',
      gender: 'MALE',
      bookingId: 'csn-rphd-qbp'
    },
    {
      id: 2,
      status: 'CANCELED',
      type: 'ONLINE',
      scheduledTime: '2025-06-21T18:56:00Z',
      endTime: '2025-06-21T19:21:00Z',
      consultationType: 'CONSULTATION',
      patientName: 'patient 1',
      patientLocation: 'somewhere',
      patientPhone: '1234567890',
      patientEmail: 'patient@email.com',
      amount: 400.00,
      callType: 'VIDEO_CALL',
      gender: 'MALE',
      bookingId: 'csn-rphd-qbp'
    },
    {
      id: 3,
      status: 'COMPLETED',
      type: 'ONLINE',
      scheduledTime: '2025-06-21T18:55:00Z',
      endTime: '2025-06-21T19:21:00Z',
      consultationType: 'CONSULTATION',
      patientName: 'patient 1',
      patientLocation: 'somewhere',
      patientPhone: '1234567890',
      patientEmail: 'patient@email.com',
      amount: 400.00,
      callType: 'VIDEO_CALL',
      gender: 'MALE',
      bookingId: 'csn-rphd-qbp'
    },
    {
      id: 4,
      status: 'SCHEDULED',
      type: 'ONLINE',
      scheduledTime: '2025-06-21T17:55:00Z',
      endTime: '2025-06-21T18:21:00Z',
      consultationType: 'CONSULTATION',
      patientName: 'patient 1',
      patientLocation: 'somewhere',
      patientPhone: '1234567890',
      patientEmail: 'patient@email.com',
      amount: 400.00,
      callType: 'VIDEO_CALL',
      gender: 'MALE',
      bookingId: 'csn-rphd-qbp'
    },
    {
      id: 5,
      status: 'IN_PROGRESS',
      type: 'ONLINE',
      scheduledTime: '2025-06-21T17:25:00Z',
      endTime: '2025-06-21T18:21:00Z',
      consultationType: 'CONSULTATION',
      patientName: 'patient 1',
      patientLocation: 'somewhere',
      patientPhone: '1234567890',
      patientEmail: 'patient@email.com',
      amount: 400.00,
      callType: 'VIDEO_CALL',
      gender: 'MALE',
      bookingId: 'csn-rphd-qbp'
    },
    {
      id: 6,
      status: 'CANCELED',
      type: 'OFFLINE',
      scheduledTime: '2025-06-21T16:40:00Z',
      endTime: '2025-06-21T17:21:00Z',
      consultationType: 'CONSULTATION',
      patientName: 'patient 1',
      patientLocation: 'somewhere',
      patientPhone: '1234567890',
      patientEmail: 'patient@email.com',
      amount: 400.00,
      callType: 'IN_PERSON',
      gender: 'FEMALE',
      bookingId: 'csn-rphd-qbp'
    },
    {
      id: 7,
      status: 'SCHEDULED',
      type: 'ONLINE',
      scheduledTime: new Date().toISOString(),
      endTime: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
      consultationType: 'CONSULTATION',
      patientName: 'Today Patient 1',
      patientLocation: 'City Center',
      patientPhone: '9876543210',
      patientEmail: 'today1@email.com',
      amount: 500.00,
      callType: 'VIDEO_CALL',
      gender: 'FEMALE',
      bookingId: 'csn-today-1'
    },
    {
      id: 8,
      status: 'IN_PROGRESS',
      type: 'OFFLINE',
      scheduledTime: new Date().toISOString(),
      endTime: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
      consultationType: 'FOLLOW_UP',
      patientName: 'Today Patient 2',
      patientLocation: 'Uptown',
      patientPhone: '5551234567',
      patientEmail: 'today2@email.com',
      amount: 300.00,
      callType: 'IN_PERSON',
      gender: 'MALE',
      bookingId: 'csn-today-2'
    },
    {
      id: 9,
      status: 'COMPLETED',
      type: 'ONLINE',
      scheduledTime: new Date().toISOString(),
      endTime: new Date(Date.now() + 45 * 60 * 1000).toISOString(),
      consultationType: 'DIAGNOSTICS',
      patientName: 'Today Patient 3',
      patientLocation: 'Suburb',
      patientPhone: '4445556666',
      patientEmail: 'today3@email.com',
      amount: 700.00,
      callType: 'VIDEO_CALL',
      gender: 'FEMALE',
      bookingId: 'csn-today-3'
    }
  ]);

  // Filter and pagination states
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [showActionMenu, setShowActionMenu] = useState<number | null>(null);
  const [dateFilter, setDateFilter] = useState<string>(() => format(new Date(), 'yyyy-MM-dd'));
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const dateObj = useMemo(() => new Date(dateFilter), [dateFilter]);
  const isDateToday = useMemo(() => isToday(dateObj), [dateObj]);
  
  const itemsPerPage = 5;

  // Status configuration
  const getStatusConfig = (status: 'CANCELED' | 'COMPLETED' | 'SCHEDULED' | 'IN_PROGRESS') => {
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

  // Format date
  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      time: date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })
    };
  };

  // Filter bookings by date (default: today)
  const filteredBookings = useMemo(() => {
    return bookings.filter(booking => {
      const matchesSearch = booking.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.patientEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.bookingId.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter ? booking.status === statusFilter : true;
      const matchesType = typeFilter ? booking.type === typeFilter : true;
      // Date filter: show only bookings for selected date
      const matchesDate = dateFilter ? format(parseISO(booking.scheduledTime), 'yyyy-MM-dd') === dateFilter : true;
      return matchesSearch && matchesStatus && matchesType && matchesDate;
    });
  }, [bookings, searchTerm, statusFilter, typeFilter, dateFilter]);

  // For 'Show all' option
  const [showAll, setShowAll] = useState(false);
  const bookingsToShow = showAll ? bookings : filteredBookings;
  const totalPages = Math.ceil(bookingsToShow.length / itemsPerPage);
  const paginatedBookings = bookingsToShow.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Reset pagination when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, typeFilter]);

  // Header stats
  const stats = useMemo(() => {
    const total = bookings.length;
    const completed = bookings.filter(b => b.status === 'COMPLETED').length;
    const scheduled = bookings.filter(b => b.status === 'SCHEDULED').length;
    const canceled = bookings.filter(b => b.status === 'CANCELED').length;
    const totalAmount = bookings.reduce((sum, b) => sum + (b.status === 'COMPLETED' ? b.amount : 0), 0);
    // Most booked service
    const serviceCount: Record<string, number> = {};
    bookings.forEach(b => {
      serviceCount[b.consultationType] = (serviceCount[b.consultationType] || 0) + 1;
    });
    const mostBookedServiceEntry = Object.entries(serviceCount).sort((a, b) => b[1] - a[1])[0];
    const mostBookedService = mostBookedServiceEntry ? mostBookedServiceEntry[0] : '-';
    const mostBookedServiceCount = mostBookedServiceEntry ? mostBookedServiceEntry[1] : 0;
    return { total, completed, scheduled, canceled, totalAmount, mostBookedService, mostBookedServiceCount };
  }, [bookings]);

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Sticky Header */}
      <div className="backdrop-blur-xl bg-white/80 border-b border-slate-200/60 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
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
      </div>
      {/* Filters Section */}
      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 py-8">
        <div className="bg-white/80 border border-slate-200 rounded-2xl shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mb-4">
            {/* Date Filter */}
            <div>
              <label className="text-xs font-semibold text-slate-600 mb-2 block">Date</label>
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => setDateFilter(format(subDays(dateObj, 1), 'yyyy-MM-dd'))}
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
                  onClick={() => setDateFilter(format(addDays(dateObj, 1), 'yyyy-MM-dd'))}
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
                onChange={e => { setDateFilter(e.target.value); setDatePickerOpen(false); }}
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
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-white/80 backdrop-blur-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all duration-200 text-slate-700 placeholder-slate-400"
                />
              </div>
            </div>
            {/* Status Filter */}
            <div>
              <label className="text-xs font-semibold text-slate-600 mb-2 block">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
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
                onChange={(e) => setTypeFilter(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white/80 text-slate-700 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all duration-200"
              >
                <option value="">All Types</option>
                <option value="ONLINE">Online</option>
                <option value="OFFLINE">Offline</option>
              </select>
            </div>
            {/* Reset Button */}
            <div className="flex items-end">
              <button
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('');
                  setTypeFilter('');
                }}
                className="px-6 py-3 bg-gradient-to-r from-slate-200 to-slate-100 text-slate-700 rounded-xl font-medium border border-slate-300 hover:from-slate-300 hover:to-slate-200 transition-all duration-200"
              >
                Reset
              </button>
            </div>
          </div>
        </div>
        {/* Table (Responsive) */}
        <div className="w-full overflow-x-auto rounded-2xl border border-slate-200/60 shadow-lg bg-white/80 backdrop-blur-xl relative hidden sm:block">
          <table className="min-w-[900px] w-full text-xs sm:text-sm md:text-base align-middle">
            <thead className="sticky top-0 bg-white/90 z-10">
              <tr className="bg-slate-50/80 border-b border-slate-200/60">
                <th className="text-left px-2 py-2 sm:px-4 md:px-6 text-xs font-bold text-slate-600 uppercase tracking-wider align-middle">Patient</th>
                <th className="hidden md:table-cell text-left px-2 py-2 sm:px-4 md:px-6 text-xs font-bold text-slate-600 uppercase tracking-wider align-middle">Booking Details</th>
                <th className="text-left px-2 py-2 sm:px-4 md:px-6 text-xs font-bold text-slate-600 uppercase tracking-wider align-middle">Schedule</th>
                <th className="text-left px-2 py-2 sm:px-4 md:px-6 text-xs font-bold text-slate-600 uppercase tracking-wider align-middle">Type</th>
                <th className="text-left px-2 py-2 sm:px-4 md:px-6 text-xs font-bold text-slate-600 uppercase tracking-wider align-middle">Status</th>
                <th className="hidden sm:table-cell text-left px-2 py-2 sm:px-4 md:px-6 text-xs font-bold text-slate-600 uppercase tracking-wider align-middle">Amount</th>
                <th className="hidden sm:table-cell text-center px-2 py-2 sm:px-4 md:px-6 text-xs font-bold text-slate-600 uppercase tracking-wider align-middle">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/60">
              {paginatedBookings.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-16 text-center text-slate-400 text-lg">
                    <span className="inline-block mb-2 text-4xl">😕</span><br/>
                    No bookings found matching your filters.
                  </td>
                </tr>
              ) : (
                paginatedBookings.map((booking) => {
                  const statusConfig = getStatusConfig(booking.status);
                  const scheduledDateTime = formatDateTime(booking.scheduledTime);
                  return (
                    <tr key={booking.id} className="hover:bg-slate-50/70 transition-colors duration-150 align-middle">
                      {/* Patient Info */}
                      <td className="px-2 py-2 sm:px-4 md:px-6 md:py-4 align-middle">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center shadow-md">
                            <span className="text-white font-bold text-lg" aria-label={`Avatar for ${booking.patientName}`}>{getInitials(booking.patientName)}</span>
                          </div>
                          <div className="flex flex-col justify-center">
                            <div className="font-semibold text-slate-900 leading-tight">{booking.patientName}</div>
                            <div className="text-xs text-slate-500 flex flex-col sm:flex-row sm:items-center sm:space-x-4 leading-tight">
                              <span className="flex items-center">
                                <Mail className="w-3 h-3 mr-1" />
                                {booking.patientEmail}
                              </span>
                              <span className="flex items-center">
                                <Phone className="w-3 h-3 mr-1" />
                                {booking.patientPhone}
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>
                      {/* Booking Details */}
                      <td className="hidden md:table-cell px-2 py-2 sm:px-4 md:px-6 md:py-4 align-middle">
                        <div className="flex flex-col justify-center gap-1">
                          <div className="font-medium text-slate-900 leading-tight">#{booking.bookingId}</div>
                          <div className="text-xs text-slate-500 leading-tight">{booking.consultationType}</div>
                          {booking.patientLocation && (
                            <div className="text-xs text-slate-500 flex items-center leading-tight">
                              <MapPin className="w-3 h-3 mr-1" />
                              {booking.patientLocation}
                            </div>
                          )}
                        </div>
                      </td>
                      {/* Schedule */}
                      <td className="px-2 py-2 sm:px-4 md:px-6 md:py-4 align-middle">
                        <div className="flex flex-col justify-center gap-1">
                          <div className="font-medium text-slate-900 leading-tight">{scheduledDateTime.date}</div>
                          <div className="text-xs text-slate-500 leading-tight">{scheduledDateTime.time}</div>
                        </div>
                      </td>
                      {/* Type */}
                      <td className="px-2 py-2 sm:px-4 md:px-6 md:py-4 align-middle">
                        <div className="flex items-center space-x-2">
                          {booking.type === 'ONLINE' ? (
                            <div className="flex items-center space-x-2">
                              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                <Video className="w-4 h-4 text-blue-600" />
                              </div>
                              <div className="flex flex-col justify-center">
                                <div className="text-xs font-medium text-slate-900 leading-tight">Online</div>
                                <div className="text-xs text-slate-500 leading-tight">{booking.callType.replace('_', ' ')}</div>
                              </div>
                            </div>
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
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${statusConfig.color}`}>
                          <div className={`w-1.5 h-1.5 ${statusConfig.dot} rounded-full mr-2`}></div>
                          {booking.status.replace('_', ' ')}
                        </span>
                      </td>
                      {/* Amount */}
                      <td className="hidden sm:table-cell px-2 py-2 sm:px-4 md:px-6 md:py-4 align-middle">
                        <div className="font-semibold text-slate-900 leading-tight">${booking.amount.toFixed(2)}</div>
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
                            onClick={() => setShowActionMenu(showActionMenu === booking.id ? null : booking.id)}
                            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-300"
                            title="More Actions"
                            aria-label="More Actions"
                          >
                            <MoreHorizontal className="w-4 h-4" />
                          </button>
                          {/* Action Menu with transition */}
                          <div
                            className={`absolute right-0 top-12 w-40 bg-white border border-slate-200 rounded-xl shadow-xl z-50 transition-all duration-200 ${showActionMenu === booking.id ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-95 pointer-events-none'}`}
                            tabIndex={-1}
                            aria-label="Action Menu"
                          >
                            <button className="w-full text-left px-4 py-2 hover:bg-slate-50 text-slate-700 rounded-t-xl" tabIndex={showActionMenu === booking.id ? 0 : -1}>
                              View Details
                            </button>
                            <button className="w-full text-left px-4 py-2 hover:bg-slate-50 text-slate-700" tabIndex={showActionMenu === booking.id ? 0 : -1}>
                              Send Message
                            </button>
                            <button className="w-full text-left px-4 py-2 hover:bg-red-50 text-red-600 rounded-b-xl" tabIndex={showActionMenu === booking.id ? 0 : -1}>
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
          {paginatedBookings.length === 0 ? (
            <div className="py-16 text-center text-slate-400 text-lg bg-white/80 rounded-2xl shadow-lg">
              <span className="inline-block mb-2 text-4xl">😕</span><br/>
              No bookings found matching your filters.
            </div>
          ) : (
            paginatedBookings.map((booking) => {
              const statusConfig = getStatusConfig(booking.status);
              const scheduledDateTime = formatDateTime(booking.scheduledTime);
              return (
                <div key={booking.id} className="bg-white/90 rounded-2xl shadow-lg border border-slate-200 p-4 flex flex-col gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center shadow-md">
                      <span className="text-white font-bold text-lg" aria-label={`Avatar for ${booking.patientName}`}>{getInitials(booking.patientName)}</span>
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-slate-900 leading-tight">{booking.patientName}</div>
                      <div className="text-xs text-slate-500">{booking.patientEmail}</div>
                    </div>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold border ${statusConfig.color}`}>{booking.status.replace('_', ' ')}</span>
                  </div>
                  <div className="flex flex-col gap-1 text-sm">
                    <div className="flex items-center gap-2"><span className="font-medium">Booking ID:</span> #{booking.bookingId}</div>
                    <div className="flex items-center gap-2"><span className="font-medium">Type:</span> {booking.type === 'ONLINE' ? 'Online' : 'In-Person'}</div>
                    <div className="flex items-center gap-2"><span className="font-medium">Consultation:</span> {booking.consultationType}</div>
                    <div className="flex items-center gap-2"><span className="font-medium">Amount:</span> ${booking.amount.toFixed(2)}</div>
                    <div className="flex items-center gap-2"><span className="font-medium">Schedule:</span> {scheduledDateTime.date}, {scheduledDateTime.time}</div>
                  </div>
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => setSelectedBooking(booking)}
                      className="flex-1 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg font-medium hover:bg-blue-100 transition"
                    >
                      View Details
                    </button>
                    <button
                      onClick={() => setShowActionMenu(showActionMenu === booking.id ? null : booking.id)}
                      className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg font-medium hover:bg-slate-200 transition"
                    >
                      More
                    </button>
                  </div>
                  {/* Action Menu (mobile) */}
                  {showActionMenu === booking.id && (
                    <div className="mt-2 bg-white border border-slate-200 rounded-xl shadow-lg z-50">
                      <button className="w-full text-left px-4 py-2 hover:bg-slate-50 text-slate-700 rounded-t-xl">View Details</button>
                      <button className="w-full text-left px-4 py-2 hover:bg-slate-50 text-slate-700">Send Message</button>
                      <button className="w-full text-left px-4 py-2 hover:bg-red-50 text-red-600 rounded-b-xl">Cancel Booking</button>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="bg-slate-50/50 px-2 sm:px-6 py-3 border-t border-slate-200/60 flex flex-col sm:flex-row items-center justify-between gap-2 sticky bottom-0 z-30 mt-4">
            <div className="text-xs sm:text-sm text-slate-500">
              Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredBookings.length)} of {filteredBookings.length} bookings
            </div>
            <div className="flex items-center space-x-1 sm:space-x-2">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-2 sm:p-2.5 text-slate-400 hover:text-slate-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                aria-label="Previous Page"
              >
                <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
              <div className="flex items-center space-x-0.5 sm:space-x-1">
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
                      className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                        currentPage === pageNum
                          ? 'bg-blue-600 text-white'
                          : 'text-slate-600 hover:bg-slate-100'
                      }`}
                      aria-current={currentPage === pageNum ? 'page' : undefined}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-2 sm:p-2.5 text-slate-400 hover:text-slate-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                aria-label="Next Page"
              >
                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
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
                      <div><span className="font-medium">Name:</span> {selectedBooking.patientName}</div>
                      <div><span className="font-medium">Email:</span> {selectedBooking.patientEmail}</div>
                      <div><span className="font-medium">Phone:</span> {selectedBooking.patientPhone}</div>
                      <div><span className="font-medium">Gender:</span> {selectedBooking.gender}</div>
                      <div><span className="font-medium">Location:</span> {selectedBooking.patientLocation}</div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-2">Booking Information</h3>
                    <div className="space-y-2 text-sm">
                      <div><span className="font-medium">Booking ID:</span> {selectedBooking.bookingId}</div>
                      <div><span className="font-medium">Type:</span> {selectedBooking.type}</div>
                      <div><span className="font-medium">Status:</span> {selectedBooking.status}</div>
                      <div><span className="font-medium">Consultation:</span> {selectedBooking.consultationType}</div>
                      <div><span className="font-medium">Amount:</span> ${selectedBooking.amount.toFixed(2)}</div>
                    </div>
                  </div>
                </div>
                
                <div className="md:col-span-2">
                  <h3 className="font-semibold text-slate-900 mb-2">Schedule</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 text-sm">
                    <div>
                      <span className="font-medium">Start:</span> {formatDateTime(selectedBooking.scheduledTime).date} at {formatDateTime(selectedBooking.scheduledTime).time}
                    </div>
                    <div>
                      <span className="font-medium">End:</span> {formatDateTime(selectedBooking.endTime).date} at {formatDateTime(selectedBooking.endTime).time}
                    </div>
                  </div>
                </div>
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