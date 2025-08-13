import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  Plus,
  Search,
  ChevronDown,
  Eye,
  RefreshCw,
  User,
  Mail,
  Phone,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  UserCheck,
  UserX,
  Trash2,
  Settings,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { approveOrRejectExpert, createExpert, deleteExpert, GetAllExpert } from '@/service/admin/expertManagementService';
import { getAllBookings, getAllSlots } from '@/service/admin/bookingManagementService';
import { getAllClinic } from '@/service/admin/clinicManagentService';
import { GetAllClinicService } from '@/service/admin/clinicServiceManagentService';

// Types
type Expert = {
  uuid: string;
  name: string;
  email: string;
  phone_number: string;
  gender: 'MALE' | 'FEMALE';
  enabled: boolean;
  status: 'APPROVED' | 'PENDING' | 'REJECTED' | 'DRAFT';
  specializaton?: string;
  experience?: string;
  rating?: number;
  totalBookings?: number;
  joinedDate?: string;
  clinic_service?: string;
  education?: string;
};

type Booking = {
  uuid: string;
  patientName: string;
  patientEmail: string;
  date: string;
  time: string;
  status: 'CONFIRMED' | 'PENDING' | 'CANCELLED' | 'CANCELED';
  type: 'CONSULTATION' | 'FOLLOW_UP' | 'EMERGENCY' | string;
  booking_type?: string;
  session_type?: string;
  clinic_name?: string;
};

type Slot = {
  uuid: string;
  start_time: string;
  end_time: string;
  available_slots: number;
  max_bookings: number;
  status: string;
  clinic_name: string;
  slot_type: string;
};

interface PaginationData {
  current_page: number;
  total_pages: number;
  total_items: number;
  next: string | null;
  previous: string | null;
}

// Components
const StatusBadge = ({ enabled }: { enabled: 'APPROVED' | 'PENDING' | 'REJECTED' | 'DRAFT' }) => {
  const statusConfig = {
    APPROVED: {
      text: 'Approved',
      bg: 'bg-green-100',
      textColor: 'text-green-800',
      border: 'border-green-200'
    },
    PENDING: {
      text: 'Pending',
      bg: 'bg-yellow-100',
      textColor: 'text-yellow-800',
      border: 'border-yellow-200'
    },
    REJECTED: {
      text: 'Rejected',
      bg: 'bg-red-100',
      textColor: 'text-red-800',
      border: 'border-red-200'
    },
    DRAFT: {
      text: 'Draft',
      bg: 'bg-gray-100',
      textColor: 'text-gray-800',
      border: 'border-gray-200'
    }
  };

  const config = statusConfig[enabled];

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${config?.bg} ${config.textColor} ${config.border}`}>
      {config.text}
    </span>
  );
};

const GenderBadge = ({ gender }: { gender: string }) => (
  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${gender === 'MALE'
    ? 'bg-blue-100 text-blue-800'
    : 'bg-pink-100 text-pink-800'
    }`}>
    {gender}
  </span>
);

const BookingStatusBadge = ({ status }: { status: string }) => {
  const colors = {
    CONFIRMED: 'bg-green-100 text-green-800 border-green-200',
    PENDING: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    CANCELLED: 'bg-red-100 text-red-800 border-red-200'
  };

  return (
    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${colors[status as keyof typeof colors]}`}>
      {status}
    </span>
  );
};

const Notification = ({ type, message, onClose }: {
  type: 'success' | 'error' | 'warning';
  message: string;
  onClose: () => void;
}) => (
  <motion.div
    initial={{ opacity: 0, y: -50, scale: 0.9 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    exit={{ opacity: 0, y: -50, scale: 0.9 }}
    className={`fixed top-4 right-4 z-50 p-4 rounded-xl shadow-lg border max-w-sm ${type === 'success' ? 'bg-green-50 border-green-200 text-green-800' :
      type === 'error' ? 'bg-red-50 border-red-200 text-red-800' :
        'bg-yellow-50 border-yellow-200 text-yellow-800'
      }`}
  >
    <div className="flex items-center justify-between">
      <p className="font-medium">{message}</p>
      <button
        onClick={onClose}
        className="ml-4 text-gray-400 hover:text-gray-600"
      >
        ×
      </button>
    </div>
  </motion.div>
);

const ModernModal = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md'
}: {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}) => {
  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-2xl',
    lg: 'max-w-4xl',
    xl: 'max-w-6xl'
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className={`bg-white rounded-2xl shadow-xl w-full ${sizeClasses[size]} max-h-[90vh] overflow-hidden`}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            ×
          </button>
        </div>
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-88px)]">
          {children}
        </div>
      </motion.div>
    </motion.div>
  );
};

const InputField = ({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  required = false,
  error = '',
  icon: Icon
}: {
  label: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
  error?: string;
  icon?: any;
}) => (
  <div>
    <label className="block text-sm font-semibold text-gray-700 mb-2">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <div className="relative">
      {Icon && <Icon size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full ${Icon ? 'pl-10' : 'pl-4'} pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${error ? 'border-red-300' : 'border-gray-200'
          }`}
        required={required}
      />
    </div>
    {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
  </div>
);

export default function ExpertManagement() {
  // State
  const [experts, setExperts] = useState<Expert[]>([]);
  const [slots, setSlots] = useState<{ [expertUuid: string]: { date: string; slots: { time: string; booked: boolean }[] }[] }>({});
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filteredExperts, setFilteredExperts] = useState<Expert[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<'ALL' | 'ENABLED' | 'DISABLED'>('ALL');
  const [selectedGender, setSelectedGender] = useState<'ALL' | 'MALE' | 'FEMALE'>('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const [paginationData, setPaginationData] = useState<PaginationData>({
    current_page: 1,
    total_pages: 1,
    total_items: 0,
    next: null,
    previous: null
  });
  const [loading, setLoading] = useState(false);

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedExpert, setSelectedExpert] = useState<Expert | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isBookingsModalOpen, setIsBookingsModalOpen] = useState(false);
  const [expertBookings, setExpertBookings] = useState<Booking[]>([]);
  type ClinicService = { uuid: string; clinic_name: string };
  const [clinicServices, setClinicServices] = useState<ClinicService[]>([]);
  const [notification, setNotification] = useState<{
    type: 'success' | 'error' | 'warning';
    message: string;
  } | null>(null);

  // Add Expert Form State
  const [newExpert, setNewExpert] = useState({
    name: '',
    email: '',
    password: '',
    phone_number: '',
    gender: 'MALE' as 'MALE' | 'FEMALE',
    specialization: '',
    experience: '',
    clinic_service: "",
    education: '',
    specializaton: "",
  });
const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState({
    name: '',
    email: '',
    password: '',
    phone_number: '',
    specialization: '',
    clinic_service: "",
    education: '',
    specializaton: "",
  });

  // Confirmation modal state
  const [confirmModal, setConfirmModal] = useState<{
    type: 'enable' | 'disable' | 'delete';
    expert: Expert | null
  } | null>(null);

  // Fetch data with pagination
  const fetchExperts = async (page = 1) => {
    setLoading(true);
    try {
      const expertsResponse = await GetAllExpert(page);
      
      setExperts(expertsResponse.data);
      setPaginationData({
        current_page: expertsResponse.current_page,
        total_pages: expertsResponse.total_pages,
        total_items: expertsResponse.total_items,
        next: expertsResponse.next,
        previous: expertsResponse.previous
      });

      console.log(expertsResponse, "doctors res");
    } catch (error) {
      console.error("Failed to fetch experts:", error);
      setNotification({
        type: 'error',
        message: 'Failed to fetch experts data'
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchAdditionalData = async () => {
    try {
      const [slotsResponse, bookingsResponse, clinicServiceResponse] = await Promise.all([
        getAllSlots(),
        getAllBookings(),
        GetAllClinicService()
      ]);

      setClinicServices(clinicServiceResponse);
      // Transform and set other data as needed
    } catch (error) {
      console.error("Failed to fetch additional data:", error);
    }
  };

  useEffect(() => {
    fetchExperts(currentPage);
  }, [currentPage]);

  useEffect(() => {
    fetchAdditionalData();
  }, []);

  console.log("Experts:", experts);
  console.log("clinicServices:", clinicServices);

  // Add state and filter logic for bookings modal
  const [bookingFilter, setBookingFilter] = useState<'upcoming' | 'past' | 'all'>('upcoming');
  const today = new Date();
  const filteredBookings = expertBookings.filter((booking) => {
    if (bookingFilter === 'all') return true;
    const bookingDate = new Date(booking.date);
    if (bookingFilter === 'upcoming') return bookingDate >= today;
    if (bookingFilter === 'past') return bookingDate < today;
    return true;
  });

  // Client-side filtering for display (server-side pagination handles the main data)
  useEffect(() => {
    let filtered = [...experts];

    if (searchQuery) {
      filtered = filtered.filter(expert =>
        expert.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        expert?.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        expert.phone_number.includes(searchQuery) ||
        expert.specializaton?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedStatus !== 'ALL') {
      filtered = filtered.filter(expert =>
        selectedStatus === 'ENABLED' ? expert.enabled : !expert.enabled
      );
    }

    if (selectedGender !== 'ALL') {
      filtered = filtered.filter(expert => expert.gender === selectedGender);
    }

    setFilteredExperts(filtered);
  }, [experts, searchQuery, selectedStatus, selectedGender]);

  // Handle page change
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= paginationData.total_pages) {
      setCurrentPage(newPage);
    }
  };

  // Reset to page 1 when filters change
  useEffect(() => {
    if (currentPage !== 1) {
      setCurrentPage(1);
    }
  }, [searchQuery, selectedStatus, selectedGender]);

  // Generate page numbers for pagination display
  const generatePageNumbers = () => {
    const pages = [];
    const totalPages = paginationData.total_pages;
    const current = paginationData.current_page;
    
    // Always show first page
    if (totalPages > 0) {
      pages.push(1);
    }
    
    // Add ellipsis if needed
    if (current > 3) {
      pages.push('...');
    }
    
    // Add pages around current page
    for (let i = Math.max(2, current - 1); i <= Math.min(totalPages - 1, current + 1); i++) {
      if (!pages.includes(i)) {
        pages.push(i);
      }
    }
    
    // Add ellipsis if needed
    if (current < totalPages - 2) {
      pages.push('...');
    }
    
    // Always show last page
    if (totalPages > 1) {
      pages.push(totalPages);
    }
    
    return pages;
  };

  const stats = {
    total: paginationData.total_items,
    enabled: experts.filter(e => e.status === 'APPROVED').length,
    disabled: experts.filter(e => e.status !== 'APPROVED').length,
    male: experts.filter(e => e.gender === 'MALE').length,
    female: experts.filter(e => e.gender === 'FEMALE').length
  };

  const handleView = (expert: Expert) => {
    setSelectedExpert(expert);
    setIsViewModalOpen(true);
  };

  const handleViewBookings = (expert: Expert) => {
    setSelectedExpert(expert);
    setExpertBookings(bookings.filter(b => b.uuid === expert?.uuid));
    setIsBookingsModalOpen(true);
  };

  const validateForm = () => {
    let valid = true;
    const errors = { name: '', email: '', password: '', phone_number: '', specialization: '', clinic_service: '', education: '', specializaton: '' };

    if (!newExpert.name.trim()) {
      errors.name = 'Name is required';
      valid = false;
    }

    if (!newExpert.email.match(/^\S+@\S+\.\S+$/)) {
      errors.email = 'Please enter a valid email address';
      valid = false;
    }

    if (newExpert.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
      valid = false;
    }

    if (!newExpert.phone_number.match(/^\d{10}$/)) {
      errors.phone_number = 'Phone number must be 10 digits';
      valid = false;
    }

    if (!newExpert.specialization.trim()) {
      errors.specialization = 'Specialization is required';
      valid = false;
    }

    setFormErrors(errors);
    return valid;
  };

  const handleAddExpert = async () => {
    if (!validateForm()) {
      setNotification({
        type: 'error',
        message: 'Please fix the form errors'
      });
      return;
    }

    try {
      const expertData = {
        name: newExpert.name,
        email: newExpert.email,
        phone_number: newExpert.phone_number,
        gender: newExpert.gender,
        specializaton: newExpert.specialization,
        experience: newExpert.experience || '0 years',
        clinic_service: newExpert.clinic_service,
        education: newExpert.education,
        enabled: true,
        status: 'PENDING' as 'PENDING',
      };

      // Call API to create expert
      const createdExpert = await createExpert(expertData);

      // Refresh the current page to get updated data
      fetchExperts(currentPage);

      // Reset form
      setNewExpert({
        name: '',
        email: '',
        password: '',
        phone_number: '',
        gender: 'MALE',
        specialization: '',
        experience: '',
        clinic_service: "",
        education: '',
        specializaton: "",
      });
      setFormErrors({ name: '', email: '', password: '', phone_number: '', specialization: '', clinic_service: '', education: '', specializaton: '' });
      setIsAddModalOpen(false);

      setNotification({
        type: 'success',
        message: 'Expert added successfully'
      });
    } catch (error) {
      setNotification({
        type: 'error',
        message: 'Failed to add expert. Please try again.'
      });
      console.error('Error adding expert:', error);
    }
  };

  const handleToggleExpert = async (expert: Expert) => {
    try {
      const newStatus = expert.status === "APPROVED" ? "REJECTED" : "APPROVED";

      // Update backend
      await approveOrRejectExpert(expert.uuid, { status: newStatus });

      // Refresh current page data
      fetchExperts(currentPage);

      setNotification({
        type: 'success',
        message: `Expert "${expert.name}" ${newStatus === "APPROVED" ? 'approved' : 'rejected'} successfully`
      });
    } catch (error) {
      setNotification({
        type: 'error',
        message: `Failed to update expert status`
      });
    }
  };

const handleDeleteExpert = async (expert: Expert) => {
  if (!window.confirm(`Are you sure you want to delete expert "${expert.name}"?`)) {
    return;
  }

  setIsDeleting(expert.uuid);
  try {
    await deleteExpert(expert.uuid);
    // Only remove from state if API call succeeds
    setExperts(prev => prev.filter(e => e.uuid !== expert.uuid));
    setNotification({
      type: 'success',
      message: `Expert "${expert.name}" deleted successfully`
    });
  } catch (error) {
    console.error("Error deleting expert:", error);
    setNotification({
      type: 'error',
      message: `Failed to delete expert "${expert.name}". Please try again.`
    });
  } finally {
    setIsDeleting(null);
  }
};
  return (
    <div className="min-h-screen bg-gray-50 p-2 sm:p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          className="flex flex-col md:flex-row md:items-center justify-between mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <Users className="mr-3 text-blue-600" size={32} />
              Expert Management
            </h1>
            <p className="text-gray-600 mt-1">Manage and monitor medical experts</p>
          </div>

          <div className="flex items-center gap-4 mt-4 md:mt-0">
            <button
              onClick={() => fetchExperts(currentPage)}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
              Refresh
            </button>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus size={16} />
              Add New Expert
            </button>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 sm:gap-6 mb-8">
          <motion.div
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Experts</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <Users size={24} className="text-blue-600" />
              </div>
            </div>
          </motion.div>

          <motion.div
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Enabled</p>
                <p className="text-2xl font-bold text-gray-900">{stats.enabled}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <UserCheck size={24} className="text-green-600" />
              </div>
            </div>
          </motion.div>

          <motion.div
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Disabled</p>
                <p className="text-2xl font-bold text-gray-900">{stats.disabled}</p>
              </div>
              <div className="p-3 bg-red-100 rounded-lg">
                <UserX size={24} className="text-red-600" />
              </div>
            </div>
          </motion.div>

          <motion.div
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Male</p>
                <p className="text-2xl font-bold text-gray-900">{stats.male}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <User size={24} className="text-blue-600" />
              </div>
            </div>
          </motion.div>

          <motion.div
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Female</p>
                <p className="text-2xl font-bold text-gray-900">{stats.female}</p>
              </div>
              <div className="p-3 bg-pink-100 rounded-lg">
                <User size={24} className="text-pink-600" />
              </div>
            </div>
          </motion.div>
        </div>

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
                placeholder="Search by name, email, phone, or specialization..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
              />
            </div>

            {/* Status Filter */}
            <div className="relative">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value as 'ALL' | 'ENABLED' | 'DISABLED')}
                className="appearance-none bg-white border border-gray-200 rounded-lg px-4 py-3 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="ALL">All Status</option>
                <option value="ENABLED">Enabled</option>
                <option value="DISABLED">Disabled</option>
              </select>
              <ChevronDown size={16} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>

            {/* Gender Filter */}
            <div className="relative">
              <select
                value={selectedGender}
                onChange={(e) => setSelectedGender(e.target.value as 'ALL' | 'MALE' | 'FEMALE')}
                className="appearance-none bg-white border border-gray-200 rounded-lg px-4 py-3 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="ALL">All Genders</option>
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
              </select>
              <ChevronDown size={16} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </motion.div>

        {/* Results Count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-600">
            Showing page {paginationData.current_page} of {paginationData.total_pages} ({paginationData.total_items} total experts)
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-gray-600">Loading experts...</span>
          </div>
        )}

        {/* Experts Grid */}
        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
            {filteredExperts.map((expert) => (
              <motion.div
                key={expert.uuid}
                className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{expert.name}</h3>
                    <p className="text-sm text-gray-600 mb-2">{expert.specializaton}</p>
                    <div className="flex items-center gap-2 mb-2">
                      <StatusBadge enabled={expert.status} />
                      <GenderBadge gender={expert.gender} />
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleView(expert)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="View Details"
                    >
                      <Eye size={16} />
                    </button>
                    <button
                      onClick={() => handleViewBookings(expert)}
                      className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                      title="View Bookings"
                    >
                      <Calendar size={16} />
                    </button>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <Mail size={14} className="mr-2" />
                    {expert.email}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Phone size={14} className="mr-2" />
                    {expert.phone_number}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <User size={14} className="mr-2" />
                    {expert.experience} experience
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">{expert.totalBookings || 0}</span> bookings
                  </div>

                  <div className="flex gap-2">
                    {expert.status === "APPROVED" ? (
                      <button
                        onClick={() => setConfirmModal({ type: 'disable', expert })}
                        className="px-3 py-1 bg-red-100 text-red-700 rounded-lg text-xs font-medium hover:bg-red-200 transition-colors"
                      >
                        Disable
                      </button>
                    ) : (
                      <button
                        onClick={() => setConfirmModal({ type: 'enable', expert })}
                        className="px-3 py-1 bg-green-100 text-green-700 rounded-lg text-xs font-medium hover:bg-green-200 transition-colors"
                      >
                        Enable
                      </button>
                    )}
                    <button
                      onClick={() => setConfirmModal({ type: 'delete', expert })}
                      className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-xs font-medium hover:bg-gray-200 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredExperts.length === 0 && (
          <div className="text-center py-8 sm:py-16">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
              <Users className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400" />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
              No experts found
            </h3>
            <p className="text-gray-500 mb-4 sm:mb-6">
              Try adjusting your search criteria or filters
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedStatus('ALL');
                setSelectedGender('ALL');
              }}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Clear filters
            </button>
          </div>
        )}

        {/* Server-side Pagination */}
        {paginationData.total_pages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between bg-white px-4 sm:px-6 py-2 sm:py-4 rounded-xl border border-gray-200 gap-2 sm:gap-0 mb-8">
            <div className="flex items-center text-xs sm:text-sm text-gray-500 mb-2 sm:mb-0">
              <span>
                Showing page {paginationData.current_page} of {paginationData.total_pages} ({paginationData.total_items} total items)
              </span>
            </div>
            <div className="flex items-center space-x-1 sm:space-x-2">
              <button
                onClick={() => handlePageChange(paginationData.current_page - 1)}
                disabled={!paginationData.previous || loading}
                className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <div className="flex space-x-0.5 sm:space-x-1">
                {generatePageNumbers().map((page, index) => {
                  if (page === '...') {
                    return <span key={index} className="px-1 sm:px-2 text-gray-400">...</span>;
                  }
                  return (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page as number)}
                      disabled={loading}
                      className={`px-2 sm:px-3 py-1 sm:py-2 text-xs sm:text-sm rounded-lg transition-colors ${
                        paginationData.current_page === page
                          ? 'bg-blue-600 text-white'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      {page}
                    </button>
                  );
                })}
              </div>
              <button
                onClick={() => handlePageChange(paginationData.current_page + 1)}
                disabled={!paginationData.next || loading}
                className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Add Expert Modal */}
      <ModernModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Expert"
        size="lg"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField
            label="Full Name"
            value={newExpert.name}
            onChange={(e) => setNewExpert({ ...newExpert, name: e.target.value })}
            placeholder="Enter full name"
            required
            error={formErrors.name}
            icon={User}
          />
          <InputField
            label="Email"
            type="email"
            value={newExpert.email}
            onChange={(e) => setNewExpert({ ...newExpert, email: e.target.value })}
            placeholder="Enter email address"
            required
            error={formErrors.email}
            icon={Mail}
          />
          <InputField
            label="Password"
            type="password"
            value={newExpert.password}
            onChange={(e) => setNewExpert({ ...newExpert, password: e.target.value })}
            placeholder="Enter password"
            required
            error={formErrors.password}
          />
          <InputField
            label="Phone Number"
            value={newExpert.phone_number}
            onChange={(e) => setNewExpert({ ...newExpert, phone_number: e.target.value })}
            placeholder="Enter phone number"
            required
            error={formErrors.phone_number}
            icon={Phone}
          />
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Gender <span className="text-red-500">*</span>
            </label>
            <select
              value={newExpert.gender}
              onChange={(e) => setNewExpert({ ...newExpert, gender: e.target.value as 'MALE' | 'FEMALE' })}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Clinic Service <span className="text-red-500">*</span>
            </label>
            <select
              value={newExpert.clinic_service}
              onChange={(e) => setNewExpert({ ...newExpert, clinic_service: e.target.value })}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="">Select a service</option>
              {clinicServices.map((service) => (
                <option key={service.uuid} value={service.uuid}>
                  {service.clinic_name}
                </option>
              ))}
            </select>
            {formErrors.clinic_service && (
              <p className="mt-1 text-sm text-red-500">{formErrors.clinic_service}</p>
            )}
          </div>
          <InputField
            label="Education"
            value={newExpert.education}
            onChange={(e) => setNewExpert({ ...newExpert, education: e.target.value })}
            placeholder="Enter education"
            required
            error={formErrors.education}
          />
          <InputField
            label="Specialization"
            value={newExpert.specialization}
            onChange={(e) => setNewExpert({ ...newExpert, specialization: e.target.value })}
            placeholder="Enter specialization"
            required
            error={formErrors.specialization}
          />
          <InputField
            label="Experience"
            value={newExpert.experience}
            onChange={(e) => setNewExpert({ ...newExpert, experience: e.target.value })}
            placeholder="Enter years of experience"
          />
        </div>
        <div className="mt-8 flex justify-end gap-4">
          <button
            onClick={() => setIsAddModalOpen(false)}
            className="px-6 py-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleAddExpert}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Add Expert
          </button>
        </div>
      </ModernModal>

      {/* View Expert Modal */}
      <ModernModal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        title="Expert Details"
        size="lg"
      >
        {selectedExpert && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-medium text-gray-500">Full Name</h4>
                <p className="mt-1 text-lg">{selectedExpert.name}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500">Email</h4>
                <p className="mt-1 text-lg">{selectedExpert.email}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500">Phone Number</h4>
                <p className="mt-1 text-lg">{selectedExpert.phone_number}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500">Gender</h4>
                <p className="mt-1 text-lg">{selectedExpert.gender}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500">Specialization</h4>
                <p className="mt-1 text-lg">{selectedExpert.specializaton}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500">Experience</h4>
                <p className="mt-1 text-lg">{selectedExpert.experience}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500">Total Bookings</h4>
                <p className="mt-1 text-lg">{selectedExpert.totalBookings || 0}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500">Rating</h4>
                <p className="mt-1 text-lg">{selectedExpert.rating || 'N/A'}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500">Joined Date</h4>
                <p className="mt-1 text-lg">{selectedExpert.joinedDate || 'N/A'}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500">Status</h4>
                <StatusBadge enabled={selectedExpert.status} />
              </div>
            </div>
          </div>
        )}
      </ModernModal>

      {/* View Bookings Modal */}
      <ModernModal
        isOpen={isBookingsModalOpen}
        onClose={() => setIsBookingsModalOpen(false)}
        title={`Bookings & Slots - ${selectedExpert?.name}`}
        size="xl"
      >
        <div className="space-y-6">
          {/* Booking Filters */}
          <div className="flex gap-4 mb-4">
            <button
              className={`px-4 py-2 rounded-lg text-sm font-medium border ${bookingFilter === 'upcoming' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-200'}`}
              onClick={() => setBookingFilter('upcoming')}
            >
              Upcoming
            </button>
            <button
              className={`px-4 py-2 rounded-lg text-sm font-medium border ${bookingFilter === 'past' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-200'}`}
              onClick={() => setBookingFilter('past')}
            >
              Past
            </button>
            <button
              className={`px-4 py-2 rounded-lg text-sm font-medium border ${bookingFilter === 'all' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-200'}`}
              onClick={() => setBookingFilter('all')}
            >
              All
            </button>
          </div>
          {/* Bookings List */}
          <div className="space-y-4">
            {filteredBookings.length === 0 ? (
              <p className="text-gray-600 text-center py-8">No bookings found for this expert.</p>
            ) : (
              filteredBookings.map((booking) => (
                <div
                  key={booking.uuid}
                  className="bg-white border border-gray-100 rounded-xl p-6"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Patient Name</h4>
                      <p className="mt-1">{booking.patientName}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Patient Email</h4>
                      <p className="mt-1">{booking.patientEmail}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Date & Time</h4>
                      <p className="mt-1">{booking.date} at {booking.time}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Status</h4>
                      <div className="mt-1">
                        <BookingStatusBadge status={booking.status} />
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Type</h4>
                      <p className="mt-1">{booking.type}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
          {/* Day-wise Slot Details */}
          <div className="mt-8">
            <h3 className="text-lg font-semibold mb-4">Day-wise Slot Details</h3>
            {selectedExpert && slots[selectedExpert.uuid] ? (
              <div className="space-y-4">
                {slots[selectedExpert.uuid].map((slotDay) => (
                  <div key={slotDay.date} className="bg-gray-50 border border-gray-100 rounded-xl p-4">
                    <div className="font-medium text-gray-700 mb-2">{slotDay.date}</div>
                    <div className="flex flex-wrap gap-2">
                      {slotDay.slots.map((slot, idx) => (
                        <span
                          key={idx}
                          className={`px-3 py-1 rounded-lg text-xs font-medium border ${slot.booked ? 'bg-red-100 text-red-700 border-red-200' : 'bg-green-100 text-green-700 border-green-200'}`}
                        >
                          {slot.time} {slot.booked ? '(Booked)' : '(Available)'}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No slot data available for this expert.</p>
            )}
          </div>
        </div>
      </ModernModal>

      {/* Confirmation Modal */}
      {confirmModal && (
        <ModernModal
          isOpen={true}
          onClose={() => setConfirmModal(null)}
          title={`${confirmModal.type === 'enable'
            ? 'Enable'
            : confirmModal.type === 'disable'
              ? 'Disable'
              : 'Delete'
            } Expert`}
          size="sm"
        >
          <div className="space-y-4">
            <p className="text-gray-600">
              Are you sure you want to {confirmModal.type}{' '}
              <span className="font-semibold">{confirmModal.expert?.name}</span>?
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setConfirmModal(null)}
                className="px-4 py-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (confirmModal.expert) {
                    if (confirmModal.type === 'delete') {
                      handleDeleteExpert(confirmModal.expert);
                    } else {
                      handleToggleExpert(confirmModal.expert);
                    }
                  }
                  setConfirmModal(null);
                }}
                className={`px-4 py-2 rounded-lg text-white transition-colors ${confirmModal.type === 'delete'
                  ? 'bg-red-600 hover:bg-red-700'
                  : confirmModal.type === 'enable'
                    ? 'bg-green-600 hover:bg-green-700'
                    : 'bg-red-600 hover:bg-red-700'
                  }`}
              >
                Confirm
              </button>
            </div>
          </div>
        </ModernModal>
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
  );
}