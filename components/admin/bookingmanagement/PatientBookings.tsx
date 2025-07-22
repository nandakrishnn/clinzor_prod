import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, 
  Clock, 
  Search, 
  Filter,
  ChevronDown, 
  User, 
  Phone, 
  Mail, 
  Video, 
  MapPin, 
  Eye,
  Check,
  X,
  RefreshCw,
  CreditCard,
  CheckCircle,
  XCircle,
  AlertCircle,
  Users,
  Monitor,
  Building
} from 'lucide-react';
import Link from 'next/link';

type Booking = {
  uuid: string;
  created_by: string;
  booking_type: 'VIDEO_CALL' | 'PHYSICAL_VISIT';
  booking_status: 'PENDING' | 'SCHEDULED' | 'COMPLETED';
  start_time: string;
  end_time: string;
  payment_status: 'PENDING' | 'COMPLETED';
  session_type: string;
  patient_name: string;
  patient_mobile: string;
  patient_email: string;
  booking_charge: string;
  clinic_name: string;
  clinic_id: string;
  service_type: string;
};

const Notification = ({ type, message, onClose }: { type: 'success' | 'error' | 'warning'; message: string; onClose: () => void }) => (
  <motion.div
    initial={{ opacity: 0, y: -50, x: '-50%' }}
    animate={{ opacity: 1, y: 0, x: '-50%' }}
    exit={{ opacity: 0, y: -50, x: '-50%' }}
    className={`fixed top-4 left-1/2 transform z-50 px-6 py-4 rounded-lg shadow-lg ${
      type === 'success' ? 'bg-green-500 text-white' :
      type === 'error' ? 'bg-red-500 text-white' :
      'bg-yellow-500 text-white'
    }`}
  >
    <div className="flex items-center gap-3">
      {type === 'success' && <CheckCircle size={20} />}
      {type === 'error' && <XCircle size={20} />}
      {type === 'warning' && <AlertCircle size={20} />}
      <span className="font-medium">{message}</span>
      <button onClick={onClose} className="ml-2 hover:opacity-70">
        <X size={16} />
      </button>
    </div>
  </motion.div>
);

const StatusBadge = ({ status }: { status: Booking['booking_status'] }) => {
  const getStatusColor = (status: Booking['booking_status']) => {
    switch (status) {
      case 'COMPLETED': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'SCHEDULED': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'PENDING': return 'bg-amber-50 text-amber-700 border-amber-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(status)}`}>
      {status}
    </span>
  );
};

const PaymentStatusBadge = ({ status }: { status: Booking['payment_status'] }) => (
  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
    status === 'COMPLETED' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
  }`}>
    {status === 'COMPLETED' ? 'Paid' : 'Pending'}
  </span>
);

export default function BookingManagement() {
  // Sample data
  const sampleBookings: Booking[] = [
    {
      uuid: 'b1',
      created_by: 'system',
      booking_type: 'VIDEO_CALL',
      booking_status: 'COMPLETED',
      start_time: '2025-07-01T10:00:00Z',
      end_time: '2025-07-01T10:30:00Z',
      payment_status: 'COMPLETED',
      session_type: 'CONSULTATION',
      patient_name: 'Gaurav Sahu',
      patient_mobile: '1234567890',
      patient_email: 'user1@example.com',
      booking_charge: '500.00',
      clinic_name: 'Sunrise Clinic',
      clinic_id: 'clinic-1',
      service_type: 'Dermatology',
    },
    {
      uuid: 'b2',
      created_by: 'system',
      booking_type: 'PHYSICAL_VISIT',
      booking_status: 'SCHEDULED',
      start_time: '2025-07-02T11:00:00Z',
      end_time: '2025-07-02T11:30:00Z',
      payment_status: 'PENDING',
      session_type: 'SESSION',
      patient_name: 'Priya Sharma',
      patient_mobile: '1234567891',
      patient_email: 'user2@example.com',
      booking_charge: '600.00',
      clinic_name: 'MedCare Center',
      clinic_id: 'clinic-2',
      service_type: 'Cardiology',
    },
    {
      uuid: 'b3',
      created_by: 'system',
      booking_type: 'VIDEO_CALL',
      booking_status: 'PENDING',
      start_time: '2025-07-03T12:00:00Z',
      end_time: '2025-07-03T12:30:00Z',
      payment_status: 'PENDING',
      session_type: 'FOLLOWUP',
      patient_name: 'Deepika Singh',
      patient_mobile: '1234567892',
      patient_email: 'user3@example.com',
      booking_charge: '300.00',
      clinic_name: 'Family Wellness Clinic',
      clinic_id: 'clinic-4',
      service_type: 'Pediatrics',
    },
    {
      uuid: 'b4',
      created_by: 'system',
      booking_type: 'PHYSICAL_VISIT',
      booking_status: 'COMPLETED',
      start_time: '2025-07-04T13:00:00Z',
      end_time: '2025-07-04T13:45:00Z',
      payment_status: 'COMPLETED',
      session_type: 'CONSULTATION',
      patient_name: 'Ravi Kumar',
      patient_mobile: '1234567893',
      patient_email: 'user4@example.com',
      booking_charge: '800.00',
      clinic_name: 'City Health Center',
      clinic_id: 'clinic-3',
      service_type: 'Orthopedics',
    },
    {
      uuid: 'b5',
      created_by: 'system',
      booking_type: 'VIDEO_CALL',
      booking_status: 'SCHEDULED',
      start_time: '2025-07-05T14:00:00Z',
      end_time: '2025-07-05T14:30:00Z',
      payment_status: 'PENDING',
      session_type: 'CONSULTATION',
      patient_name: 'Meera Joseph',
      patient_mobile: '1234567894',
      patient_email: 'user5@example.com',
      booking_charge: '400.00',
      clinic_name: 'Sunrise Clinic',
      clinic_id: 'clinic-1',
      service_type: 'General Medicine',
    },
  ];

  const [bookings] = useState<Booking[]>(sampleBookings);
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>(bookings);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<Booking['booking_status'] | 'ALL'>('ALL');
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState<Booking['payment_status'] | 'ALL'>('ALL');
  const [selectedBookingType, setSelectedBookingType] = useState<Booking['booking_type'] | 'ALL'>('ALL');
  const [activeTab, setActiveTab] = useState<'ALL' | 'VIDEO_CALL' | 'PHYSICAL_VISIT'>('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  
  const [notification, setNotification] = useState<{
    type: 'success' | 'error' | 'warning';
    message: string;
  } | null>(null);

  // Filter bookings
  useEffect(() => {
    let filtered = [...bookings];
    
    if (searchQuery) {
      filtered = filtered.filter(booking => 
        booking.patient_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        booking.patient_email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        booking.clinic_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        booking.service_type.toLowerCase().includes(searchQuery.toLowerCase()) ||
        booking.patient_mobile.includes(searchQuery)
      );
    }
    
    if (selectedStatus !== 'ALL') {
      filtered = filtered.filter(booking => booking.booking_status === selectedStatus);
    }
    
    if (selectedPaymentStatus !== 'ALL') {
      filtered = filtered.filter(booking => booking.payment_status === selectedPaymentStatus);
    }

    if (selectedBookingType !== 'ALL') {
      filtered = filtered.filter(booking => booking.booking_type === selectedBookingType);
    }
    
    setFilteredBookings(filtered);
    setCurrentPage(1);
  }, [bookings, searchQuery, selectedStatus, selectedPaymentStatus, selectedBookingType]);

  // Separate bookings by type
  const expertCallBookings = useMemo(() => {
    return filteredBookings.filter(b => b.booking_type === 'VIDEO_CALL');
  }, [filteredBookings]);

  const clinicSlotBookings = useMemo(() => {
    return filteredBookings.filter(b => b.booking_type === 'PHYSICAL_VISIT');
  }, [filteredBookings]);

  // Pagination for combined view
  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedBookings = filteredBookings.slice(startIndex, startIndex + itemsPerPage);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleView = (booking: Booking) => {
    setSelectedBooking(booking);
    setIsViewModalOpen(true);
  };

  const stats = {
    total: bookings.length,
    expertCalls: bookings.filter(b => b.booking_type === 'VIDEO_CALL').length,
    clinicSlots: bookings.filter(b => b.booking_type === 'PHYSICAL_VISIT').length,
    completed: bookings.filter(b => b.booking_status === 'COMPLETED').length,
    pending: bookings.filter(b => b.booking_status === 'PENDING').length,
    scheduled: bookings.filter(b => b.booking_status === 'SCHEDULED').length
  };

  const BookingCard = ({ booking }: { booking: Booking }) => (
    <motion.div
      className="bg-white rounded-xl shadow-xl border border-gray-100 p-6 hover:shadow-2xl transition-shadow"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Booking Info */}
        <div className="flex-1 space-y-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                booking.booking_type === 'VIDEO_CALL' ? 'bg-blue-100' : 'bg-green-100'
              }`}>
                {booking.booking_type === 'VIDEO_CALL' ? (
                  <Video className={`w-6 h-6 ${booking.booking_type === 'VIDEO_CALL' ? 'text-blue-600' : 'text-green-600'}`} />
                ) : (
                  <MapPin className="w-6 h-6 text-green-600" />
                )}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{booking.patient_name}</h3>
                <p className="text-sm text-gray-600">{booking.session_type}</p>
              </div>
            </div>
            <StatusBadge status={booking.booking_status} />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2 text-gray-600">
              <Mail size={14} />
              <span>{booking.patient_email}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Phone size={14} />
              <span>{booking.patient_mobile}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Clock size={14} />
              <span>{formatDate(booking.start_time)}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <CreditCard size={14} />
              <span>₹{booking.booking_charge}</span>
            </div>
          </div>

          {/* Clinic and Service Info */}
          <div className="flex flex-wrap items-center gap-4 pt-2 border-t border-gray-100">
            <div className="flex items-center gap-2">
              <Building size={14} className="text-blue-600" />
              <Link
                href={`/admin/allclinics/${booking.clinic_id}`}
                className="text-blue-600 hover:text-blue-800 hover:underline font-medium text-sm transition-colors"
              >
                {booking.clinic_name}
              </Link>
            </div>
            <span className="text-gray-400">•</span>
            <span className="text-emerald-700 font-medium text-sm bg-emerald-50 px-2 py-1 rounded-full">
              {booking.service_type}
            </span>
            <span className="text-gray-400">•</span>
            <PaymentStatusBadge status={booking.payment_status} />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 flex-wrap mt-4 lg:mt-0">
          <button
            onClick={() => handleView(booking)}
            className="flex items-center gap-2 px-4 py-2 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors font-medium"
          >
            <Eye size={16} />
            <span className="hidden sm:inline">View Details</span>
          </button>
        </div>
      </div>
    </motion.div>
  );

  const SectionHeader = ({ title, count, icon }: { title: string; count: number; icon: React.ReactNode }) => (
    <div className="flex items-center gap-3 mb-6">
      <div className="p-2 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg">
        {icon}
      </div>
      <div>
        <h2 className="text-xl font-bold text-gray-900">{title}</h2>
        <p className="text-gray-600 text-sm">{count} booking{count !== 1 ? 's' : ''}</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-2 sm:p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div 
          className="flex flex-col md:flex-row md:items-center justify-between mb-8 bg-white rounded-xl shadow-lg p-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <Calendar className="mr-3 text-blue-600" size={32} />
              Booking Management
            </h1>
            <p className="text-gray-600 mt-1">Manage expert calls and clinic slot bookings</p>
          </div>
          
          <div className="flex items-center gap-4 mt-4 md:mt-0">
            <button 
              onClick={() => window.location.reload()}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <RefreshCw size={16} />
              Refresh
            </button>
          </div>
        </motion.div>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6 mb-8">
          <motion.div 
            className="bg-white p-6 rounded-xl shadow-lg border border-gray-100"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <Calendar size={24} className="text-blue-600" />
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            className="bg-white p-6 rounded-xl shadow-lg border border-gray-100"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Expert Calls</p>
                <p className="text-2xl font-bold text-gray-900">{stats.expertCalls}</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <Monitor size={24} className="text-purple-600" />
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            className="bg-white p-6 rounded-xl shadow-lg border border-gray-100"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Clinic Slots</p>
                <p className="text-2xl font-bold text-gray-900">{stats.clinicSlots}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <Building size={24} className="text-green-600" />
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            className="bg-white p-6 rounded-xl shadow-lg border border-gray-100"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-gray-900">{stats.completed}</p>
              </div>
              <div className="p-3 bg-emerald-100 rounded-lg">
                <CheckCircle size={24} className="text-emerald-600" />
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            className="bg-white p-6 rounded-xl shadow-lg border border-gray-100"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
              </div>
              <div className="p-3 bg-amber-100 rounded-lg">
                <Clock size={24} className="text-amber-600" />
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            className="bg-white p-6 rounded-xl shadow-lg border border-gray-100"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Scheduled</p>
                <p className="text-2xl font-bold text-gray-900">{stats.scheduled}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <Calendar size={24} className="text-blue-600" />
              </div>
            </div>
          </motion.div>
        </div>
        
        {/* Booking Tabs */}
        <motion.div 
          className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex space-x-4">
            <button
              onClick={() => {
                setActiveTab('VIDEO_CALL');
                setSelectedBookingType('VIDEO_CALL');
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                activeTab === 'VIDEO_CALL'
                  ? 'bg-purple-50 text-purple-600 font-medium'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Monitor size={20} />
              <span>Expert Calls ({expertCallBookings.length})</span>
            </button>
            <button
              onClick={() => {
                setActiveTab('PHYSICAL_VISIT');
                setSelectedBookingType('PHYSICAL_VISIT');
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                activeTab === 'PHYSICAL_VISIT'
                  ? 'bg-green-50 text-green-600 font-medium'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Building size={20} />
              <span>Clinic Slots ({clinicSlotBookings.length})</span>
            </button>
          </div>
        </motion.div>

        {/* Filters and Search */}
        <motion.div 
          className="bg-white p-3 sm:p-6 rounded-xl shadow-sm border border-gray-100 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex flex-col md:flex-row md:items-center gap-2 sm:gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by patient, clinic, service type..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            {/* Booking Type Filter */}
            <div className="relative">
              <select
                value={selectedBookingType}
                onChange={(e) => setSelectedBookingType(e.target.value as Booking['booking_type'] | 'ALL')}
                className="appearance-none bg-white border border-gray-200 rounded-lg px-4 py-3 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="ALL">All Types</option>
                <option value="VIDEO_CALL">Expert Calls</option>
                <option value="PHYSICAL_VISIT">Clinic Slots</option>
              </select>
              <ChevronDown size={16} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
            
            {/* Status Filter */}
            <div className="relative">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value as Booking['booking_status'] | 'ALL')}
                className="appearance-none bg-white border border-gray-200 rounded-lg px-4 py-3 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="ALL">All Status</option>
                <option value="PENDING">Pending</option>
                <option value="SCHEDULED">Scheduled</option>
                <option value="COMPLETED">Completed</option>
              </select>
              <ChevronDown size={16} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
            
            {/* Payment Status Filter */}
            <div className="relative">
              <select
                value={selectedPaymentStatus}
                onChange={(e) => setSelectedPaymentStatus(e.target.value as Booking['payment_status'] | 'ALL')}
                className="appearance-none bg-white border border-gray-200 rounded-lg px-4 py-3 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="ALL">All Payments</option>
                <option value="PENDING">Payment Pending</option>
                <option value="COMPLETED">Payment Completed</option>
              </select>
              <ChevronDown size={16} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </motion.div>

        {/* Expert Call Bookings Section */}
        {(selectedBookingType === 'ALL' || selectedBookingType === 'VIDEO_CALL') && expertCallBookings.length > 0 && (
          <motion.div 
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <SectionHeader 
                title="Expert Call Bookings" 
                count={expertCallBookings.length} 
                icon={<Monitor className="w-6 h-6 text-blue-600" />} 
              />
              <div className="space-y-4">
                {expertCallBookings.slice(0, 4).map((booking) => (
                  <BookingCard key={booking.uuid} booking={booking} />
                ))}
              </div>
              {expertCallBookings.length > 4 && (
                <div className="mt-4 text-center">
                  <button className="text-blue-600 hover:text-blue-800 font-medium">
                    View all {expertCallBookings.length} expert call bookings
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Clinic Slot Bookings Section */}
        {(selectedBookingType === 'ALL' || selectedBookingType === 'PHYSICAL_VISIT') && clinicSlotBookings.length > 0 && (
          <motion.div 
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <SectionHeader 
                title="Clinic Slot Bookings" 
                count={clinicSlotBookings.length} 
                icon={<Building className="w-6 h-6 text-green-600" />} 
              />
              <div className="space-y-4">
                {clinicSlotBookings.slice(0, 4).map((booking) => (
                  <BookingCard key={booking.uuid} booking={booking} />
                ))}
              </div>
              {clinicSlotBookings.length > 4 && (
                <div className="mt-4 text-center">
                  <button className="text-blue-600 hover:text-blue-800 font-medium">
                    View all {clinicSlotBookings.length} clinic slot bookings
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* View Modal */}
        {isViewModalOpen && selectedBooking && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <motion.div 
              className="bg-white rounded-xl p-6 max-w-2xl w-full mx-4"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Booking Details</h2>
                <button 
                  onClick={() => setIsViewModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Patient Information</h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <User size={16} className="text-gray-400" />
                        <span className="text-gray-900">{selectedBooking.patient_name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail size={16} className="text-gray-400" />
                        <span className="text-gray-900">{selectedBooking.patient_email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone size={16} className="text-gray-400" />
                        <span className="text-gray-900">{selectedBooking.patient_mobile}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Booking Information</h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Calendar size={16} className="text-gray-400" />
                        <span className="text-gray-900">{formatDate(selectedBooking.start_time)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock size={16} className="text-gray-400" />
                        <span className="text-gray-900">
                          Duration: {new Date(selectedBooking.end_time).getHours() - new Date(selectedBooking.start_time).getHours()} hours
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Building size={16} className="text-gray-400" />
                        <span className="text-gray-900">{selectedBooking.clinic_name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-500">Service Type:</span>
                        <span className="text-emerald-700 font-medium text-sm bg-emerald-50 px-2 py-1 rounded-full">{selectedBooking.service_type}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-2">Booking Type</h3>
                      <div className="flex items-center gap-2">
                        {selectedBooking.booking_type === 'VIDEO_CALL' ? (
                          <Video size={16} className="text-blue-600" />
                        ) : (
                          <MapPin size={16} className="text-green-600" />
                        )}
                        <span className="text-gray-900">{selectedBooking.booking_type.replace('_', ' ')}</span>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-2">Status</h3>
                      <StatusBadge status={selectedBooking.booking_status} />
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-2">Payment</h3>
                      <div className="flex items-center gap-4">
                        <PaymentStatusBadge status={selectedBooking.payment_status} />
                        <span className="text-gray-900 font-medium">₹{selectedBooking.booking_charge}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex justify-end">
                <button
                  onClick={() => setIsViewModalOpen(false)}
                  className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}

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
    </div>
  );
}