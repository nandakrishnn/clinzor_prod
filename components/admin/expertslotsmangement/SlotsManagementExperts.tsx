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
  ChevronRight,
  Home,
  EyeIcon,
  EyeOffIcon
} from 'lucide-react';
import { approveExpertSlot, approveOrRejectExpert, blockExpert, createExpert, deleteExpert, getAllBookingForAExpert, getAllBookingforExpret, GetAllClinicServiceforDoc, GetAllExpert, getAllSlotsforExpret, GetStatsAdminExpertService, getStatsAdminExpertService, rejectExpertSlot } from '@/service/admin/expertManagementService';

// Types
type Expert = {
  uuid: string;
  name: string;
  email: string;
  phone_number: string;
  gender: 'MALE' | 'FEMALE';
  enabled: boolean;
  is_blocked: boolean;
  status: 'APPROVED' | 'PENDING' | 'REJECTED' | 'DRAFT';
  specializaton?: string;
  experience?: string;
  rating?: number;
  totalBookings?: number;
  joinedDate?: string;
  clinic_service?: string;
  education?: string;
  address?: string;
  dob?: string;
  user?: string;
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
  is_booked: boolean;
  expert?: string;
};

interface PaginationData {
  current_page: number;
  total_pages: number;
  total_items: number;
  next: string | null;
  previous: string | null;
}

interface BookingsPaginationData {
  current_page: number;
  total_pages: number;
  total_items: number;
  next: string | null;
  previous: string | null;
}

interface SlotsPaginationData {
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
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${config?.bg} ${config?.textColor} ${config?.border}`}>
      {config?.text}
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
    CANCELLED: 'bg-red-100 text-red-800 border-red-200',
    CANCELED: 'bg-red-100 text-red-800 border-red-200',
    SCHEDULED: 'bg-blue-100 text-blue-800 border-blue-200'
  };

  return (
    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800 border-gray-200'}`}>
      {status}
    </span>
  );
};

const SlotStatusBadge = ({ is_booked }: { is_booked: boolean }) => (
  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${is_booked
    ? 'bg-red-100 text-red-800 border-red-200'
    : 'bg-green-100 text-green-800 border-green-200'
    }`}>
    {is_booked ? 'Booked' : 'Available'}
  </span>
);

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

// Pagination Component
const Pagination = ({
  paginationData,
  onPageChange,
  loading
}: {
  paginationData: PaginationData;
  onPageChange: (page: number) => void;
  loading: boolean;
}) => {
  const generatePageNumbers = () => {
    const pages: any[] = [];
    const totalPages = paginationData.total_pages;
    const current = paginationData.current_page;

    if (totalPages <= 0) return pages;

    // Always show first page
    pages.push(1);

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

    // Always show last page if different from first
    if (totalPages > 1) {
      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between bg-white px-4 sm:px-6 py-2 sm:py-4 rounded-xl border border-gray-200 gap-2 sm:gap-0">
      <div className="flex items-center text-xs sm:text-sm text-gray-500 mb-2 sm:mb-0">
        <span>
          Showing page {paginationData.current_page} of {paginationData.total_pages} ({paginationData.total_items} total items)
        </span>
      </div>
      <div className="flex items-center space-x-1 sm:space-x-2">
        <button
          onClick={() => onPageChange(paginationData.current_page - 1)}
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
                onClick={() => onPageChange(page as number)}
                disabled={loading}
                className={`px-2 sm:px-3 py-1 sm:py-2 text-xs sm:text-sm rounded-lg transition-colors ${paginationData.current_page === page
                  ? 'bg-primaryColor text-white'
                  : 'text-gray-600 hover:bg-gray-100'
                  }`}
              >
                {page}
              </button>
            );
          })}
        </div>
        <button
          onClick={() => onPageChange(paginationData.current_page + 1)}
          disabled={!paginationData.next || loading}
          className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default function ExpertManagement() {
  // State
  const [experts, setExperts] = useState<Expert[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [tempSearchQuery, setTempSearchQuery] = useState('');
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

  // Add state for slots and bookings data with pagination
  const [expertSlots, setExpertSlots] = useState<{ [expertUuid: string]: Slot[] }>({});
  const [expertBookings, setExpertBookings] = useState<{ [expertUuid: string]: any[] }>({});
  const [loadingSlots, setLoadingSlots] = useState<{ [expertUuid: string]: boolean }>({});
  const [loadingBookings, setLoadingBookings] = useState<{ [expertUuid: string]: boolean }>({});

  // Pagination states for bookings and slots
  const [bookingsPagination, setBookingsPagination] = useState<{ [expertUuid: string]: BookingsPaginationData }>({});
  const [slotsPagination, setSlotsPagination] = useState<{ [expertUuid: string]: SlotsPaginationData }>({});
  const [bookingsCurrentPage, setBookingsCurrentPage] = useState<{ [expertUuid: string]: number }>({});
  const [slotsCurrentPage, setSlotsCurrentPage] = useState<{ [expertUuid: string]: number }>({});

  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [isSlotActionModalOpen, setIsSlotActionModalOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [slotActionType, setSlotActionType] = useState<'approve' | 'reject' | null>(null);
  const [loadingSlotAction, setLoadingSlotAction] = useState(false);
  const [dashData, setDashData] = useState<any>({})
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
    dob: '',
    addresss: "",
  });

  const [formErrors, setFormErrors] = useState({
    name: '',
    email: '',
    password: '',
    phone_number: '',
    dob: '',
    addresss: "",
  });

  // Confirmation modal state
  const [confirmModal, setConfirmModal] = useState<{
    type: 'enable' | 'disable';
    expert: Expert | null
  } | null>(null);

  // Booking filter state
  const [bookingFilter, setBookingFilter] = useState<'upcoming' | 'past' | 'all'>('upcoming');
  const [activeStatFilter, setActiveStatFilter] = useState<string | null>(null);
  const [passView, setPassView] = useState(false)
  const [activeTab, setActiveTab] = useState<'bookings' | 'slots'>('bookings');

  // Fetch data with pagination
  const fetchExperts = async (page = 1, search = '', status = 'ALL', gender = 'ALL') => {
    setLoading(true);
    try {
      // Prepare filter parameters
      const statusParam = status !== 'ALL' ? status : undefined;
      const genderParam = gender !== 'ALL' ? gender : undefined;

      const expertsResponse = await GetAllExpert(
        page,
        search || undefined,
        statusParam,
        genderParam
      );
      console.log(expertsResponse, 'from the expert data')

      setExperts(expertsResponse?.data?.data);
      setPaginationData({
        current_page: expertsResponse?.data?.current_page,
        total_pages: expertsResponse?.data?.total_pages,
        total_items: expertsResponse?.data?.total_items,
        next: expertsResponse?.data?.next,
        previous: expertsResponse?.data?.previous
      });
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

  // Fetch data when filters change
  useEffect(() => {
    fetchExperts(currentPage, searchQuery, selectedStatus, selectedGender);
  }, [currentPage, searchQuery, selectedStatus, selectedGender]);

  // Function to fetch slots for a specific expert with pagination
  const fetchExpertSlots = async (expertUuid: string, page = 1) => {
    setLoadingSlots(prev => ({ ...prev, [expertUuid]: true }));
    try {
      const params = {
        expert: expertUuid,
        page: page,
        page_size: 10 // Adjust page size as needed
      };
      const slotsResponse = await getAllSlotsforExpret(params);

      console.log(slotsResponse, 'from the expert slots')
      // Transform the API response to match our Slot type
      const transformedSlots = slotsResponse.data.map((slot: any) => ({
        uuid: slot.uuid,
        start_time: slot.start_time,
        end_time: slot.end_time,
        available_slots: slot.available_slots || 1,
        max_bookings: slot.max_bookings || 1,
        status: slot.status,
        clinic_name: slot.clinic_name || 'N/A',
        slot_type: slot.slot_type || 'REGULAR',
        is_booked: slot.is_booked || false,
        expert: slot.expert
      }));

      setExpertSlots(prev => ({ ...prev, [expertUuid]: transformedSlots }));

      // Update slots pagination data
      setSlotsPagination(prev => ({
        ...prev,
        [expertUuid]: {
          current_page: slotsResponse.current_page || page,
          total_pages: slotsResponse.total_pages || 1,
          total_items: slotsResponse.total_items || transformedSlots.length,
          next: slotsResponse.next || null,
          previous: slotsResponse.previous || null
        }
      }));

      // Update current page for slots
      setSlotsCurrentPage(prev => ({
        ...prev,
        [expertUuid]: page
      }));

    } catch (error) {
      console.error("Failed to fetch expert slots:", error);
      setNotification({
        type: 'error',
        message: 'Failed to fetch expert slots'
      });
    } finally {
      setLoadingSlots(prev => ({ ...prev, [expertUuid]: false }));
    }
  };

  // Function to fetch bookings for a specific expert with pagination
  const fetchExpertBookings = async (expertUuid: string, page = 1) => {
    setLoadingBookings(prev => ({ ...prev, [expertUuid]: true }));
    try {
      const params = {
        expert: expertUuid,
        page: page,
        page_size: 10 // Adjust page size as needed
      };
      const bookingsResponse = await getAllBookingForAExpert(params);
      console.log(bookingsResponse, 'from the expert bookings')

      setExpertBookings(prev => ({ ...prev, [expertUuid]: bookingsResponse?.data || [] }));

      // Update bookings pagination data
      setBookingsPagination(prev => ({
        ...prev,
        [expertUuid]: {
          current_page: bookingsResponse.current_page || page,
          total_pages: bookingsResponse.total_pages || 1,
          total_items: bookingsResponse.total_items || (bookingsResponse?.data?.length || 0),
          next: bookingsResponse.next || null,
          previous: bookingsResponse.previous || null
        }
      }));

      // Update current page for bookings
      setBookingsCurrentPage(prev => ({
        ...prev,
        [expertUuid]: page
      }));

    } catch (error) {
      console.error("Failed to fetch expert bookings:", error);
      setNotification({
        type: 'error',
        message: 'Failed to fetch expert bookings'
      });
    } finally {
      setLoadingBookings(prev => ({ ...prev, [expertUuid]: false }));
    }
  };

  const fetchAdditionalData = async () => {
    try {
      const clinicServiceResponse = await GetAllClinicServiceforDoc(1);
      setClinicServices(clinicServiceResponse.data);
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

  // Handle page change for experts
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= paginationData.total_pages) {
      setCurrentPage(newPage);
    }
  };

  // Handle page change for bookings
  const handleBookingsPageChange = (expertUuid: string, newPage: number) => {
    if (selectedExpert && newPage >= 1 && newPage <= (bookingsPagination[expertUuid]?.total_pages || 1)) {
      fetchExpertBookings(expertUuid, newPage);
    }
  };

  // Handle page change for slots
  const handleSlotsPageChange = (expertUuid: string, newPage: number) => {
    if (selectedExpert && newPage >= 1 && newPage <= (slotsPagination[expertUuid]?.total_pages || 1)) {
      fetchExpertSlots(expertUuid, newPage);
    }
  };

  // Reset to page 1 when filters change
  useEffect(() => {
    if (currentPage !== 1) {
      setCurrentPage(1);
    }
  }, [searchQuery, selectedStatus, selectedGender]);

  const getStatsAdminExpert = async () => {
    try {
      const res = await GetStatsAdminExpertService()
      console.log(res, 'data from the expert stat')
      if (res.status === 200) {
        setDashData(res?.data)
      }
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    getStatsAdminExpert()
  }, [])

  const handleView = (expert: Expert) => {
    console.log(expert, 'selected expert')
    setSelectedExpert(expert);
    setIsViewModalOpen(true);
  };

  const handleViewBookings = async (expert: Expert) => {
    setSelectedExpert(expert);
    setActiveTab('bookings');

    // Fetch slots and bookings for this expert with initial page
    await Promise.all([
      fetchExpertSlots(expert.uuid, 1),
      fetchExpertBookings(expert.uuid, 1)
    ]);

    setIsBookingsModalOpen(true);
  };

  const validateForm = () => {
    let valid = true;
    const errors = { name: '', email: '', password: '', phone_number: '', dob: '', addresss: "" };

    // Name validation
    if (!newExpert.name.trim()) {
      errors.name = 'Name is required';
      valid = false;
    } else if (newExpert.name.trim().length < 2) {
      errors.name = 'Name must be at least 2 characters long';
      valid = false;
    }

    // Email validation
    if (!newExpert.email.match(/^\S+@\S+\.\S+$/)) {
      errors.email = 'Please enter a valid email address';
      valid = false;
    }

    // Password validation - Strong password requirements
    if (newExpert.password.length < 8) {
      errors.password = 'Password must be at least 8 characters long';
      valid = false;
    } else {
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/;
      if (!passwordRegex.test(newExpert.password)) {
        errors.password = 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&)';
        valid = false;
      }
    }

    // Phone number validation
    if (!newExpert.phone_number.match(/^\d{10}$/)) {
      errors.phone_number = 'Phone number must be exactly 10 digits';
      valid = false;
    }

    // Date of Birth validation
    if (!newExpert.dob) {
      errors.dob = 'Date of birth is required';
      valid = false;
    } else {
      const dobDate = new Date(newExpert.dob);
      const today = new Date();
      const minAgeDate = new Date();
      minAgeDate.setFullYear(today.getFullYear() - 18); // Minimum 18 years old

      if (dobDate > minAgeDate) {
        errors.dob = 'Expert must be at least 18 years old';
        valid = false;
      }
    }

    // Address validation
    if (!newExpert.addresss.trim()) {
      errors.addresss = 'Address is required';
      valid = false;
    } else if (newExpert.addresss.trim().length < 10) {
      errors.addresss = 'Address must be at least 10 characters long';
      valid = false;
    }

    setFormErrors(errors);
    return valid;
  };

  // Check if form is completely filled
  const isFormComplete = () => {
    return (
      newExpert.name.trim() &&
      newExpert.email.trim() &&
      newExpert.password.trim() &&
      newExpert.phone_number.trim() &&
      newExpert.dob.trim() &&
      newExpert.addresss.trim()
    );
  };

  // Check if form is valid (no errors and all fields filled)
  const isFormValid = () => {
    return (
      isFormComplete() &&
      Object.values(formErrors).every(error => !error) &&
      getPasswordStrength(newExpert.password).strength >= 4 // At least "Strong" password
    );
  };


  // Add this function to check password strength
  const getPasswordStrength = (password: string) => {
    if (password.length === 0) return { strength: 0, text: '', color: '' };

    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[@$!%*?&]/.test(password)) strength++;

    const strengthConfig = {
      1: { text: 'Very Weak', color: 'bg-red-500' },
      2: { text: 'Weak', color: 'bg-orange-500' },
      3: { text: 'Medium', color: 'bg-yellow-500' },
      4: { text: 'Strong', color: 'bg-green-500' },
      5: { text: 'Very Strong', color: 'bg-green-600' }
    };

    return {
      strength,
      ...(strengthConfig[strength as keyof typeof strengthConfig] || { text: '', color: '' })
    };
  };

  // In the password field section, add this after the input field:
  const passwordStrength = getPasswordStrength(newExpert.password);

  const handleAddExpert = async () => {
    if (!validateForm()) {
      setNotification({
        type: 'error',
        message: 'Please fix the form errors'
      });
      return;
    }

    try {
      setLoading(true);
      const expertData = {
        full_name: newExpert.name,
        email: newExpert.email,
        phone_number: newExpert.phone_number,
        gender: newExpert.gender,
        dob: newExpert.dob,
        address: newExpert.addresss,
        password: newExpert.password,
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
        dob: '',
        addresss: '',
      });
      setFormErrors({ name: '', email: '', password: '', phone_number: '', dob: '', addresss: "", });
      setIsAddModalOpen(false);
      getStatsAdminExpert()

      setNotification({
        type: 'success',
        message: 'Expert added successfully'
      });
    } catch (error: any) {
      const errorData = error?.response?.data;

      if (errorData && typeof errorData === "object") {
        // Get first error message (or combine them)
        const messages = Object.values(errorData).flat();
        setNotification({
          type: "error",
          message: errorData?.message || "Failed to add expert. Please try again."
        });
      } else {
        setNotification({
          type: "error",
          message: errorData?.message ||  "Failed to add expert. Please try again."
        });
      }
      console.error('Error adding expert:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleExpert = async (expert: Expert) => {
    try {
      const newStatus = expert.status === "APPROVED" ? "REJECTED" : "APPROVED";

      // Update backend
      await blockExpert(expert?.user, { is_blocked: !expert?.is_blocked });

      // Refresh current page data
      fetchExperts(currentPage);
      getStatsAdminExpert()
      setNotification({
        type: 'success',
        message: `Expert "${expert.name}" ${newStatus === "APPROVED" ? 'approved' : 'rejected'} successfully`
      });
    } catch (error: any) {
      console.log(error)
      setNotification({
        type: 'error',
        message: `${error?.response?.data?.detail || error?.response?.data?.message} please try again later ` || `Failed to update expert status`
      });
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  // Format time for display
  const formatTime = (dateString: string) => {
  return new Date(dateString).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'UTC'
  });
  };

  const handleApproveSlot = async (slot: Slot) => {
    setSelectedSlot(slot);
    setSlotActionType('approve');
    setIsSlotActionModalOpen(true);
  };

  const handleRejectSlot = async (slot: Slot) => {
    setSelectedSlot(slot);
    setSlotActionType('reject');
    setRejectionReason('');
    setIsSlotActionModalOpen(true);
  };

  const confirmSlotAction = async () => {
    if (!selectedSlot || !slotActionType) return;

    setLoadingSlotAction(true);
    try {
      if (slotActionType === 'approve') {
        await approveExpertSlot(selectedSlot.uuid);
        setNotification({
          type: 'success',
          message: 'Slot approved successfully'
        });
      } else {
        if (!rejectionReason.trim()) {
          setNotification({
            type: 'error',
            message: 'Please provide a reason for rejection'
          });
          return;
        }
        await rejectExpertSlot(selectedSlot.uuid, rejectionReason);
        setNotification({
          type: 'success',
          message: 'Slot rejected successfully'
        });
      }

      // Refresh the slots data
      if (selectedExpert) {
        await fetchExpertSlots(selectedExpert.uuid, slotsCurrentPage[selectedExpert.uuid] || 1);
      }

      setIsSlotActionModalOpen(false);
      setSelectedSlot(null);
      setSlotActionType(null);
      setRejectionReason('');

    } catch (error: any) {
      setNotification({
        type: 'error',
        message: error.response?.data?.message || `Failed to ${slotActionType} slot`
      });
    } finally {
      setLoadingSlotAction(false);
    }
  };

  const handleSearch = async () => {
    setSearchQuery(tempSearchQuery)
  }
  return (
    <div className="min-h-screen  p-2 sm:p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          className="flex flex-col md:flex-row md:items-center justify-between mb-5"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <Users className="mr-3 text-primaryColor" size={32} />
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
              className="flex items-center gap-2 px-4 py-2 bg-primaryColor text-white rounded-lg hover:bg-primaryColor transition-colors"
            >
              <Plus size={16} />
              Add New Expert
            </button>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 sm:gap-6 mb-4">
          <motion.div
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -2 }}
            onClick={() => {
              const newFilter = activeStatFilter === 'ALL' ? null : 'ALL';
              setActiveStatFilter(newFilter);
              setSelectedStatus('ALL');
              setSelectedGender('ALL');
              setCurrentPage(1);
              fetchExperts(1, 'ALL', 'ALL');
            }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Experts</p>
                <p className="text-2xl font-bold text-gray-900">{dashData?.total_expert_user}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <Users size={24} className="text-primaryColor" />
              </div>
            </div>
          </motion.div>

          <motion.div
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            whileHover={{ y: -2 }}
            onClick={() => {
              const newFilter = activeStatFilter === 'ENABLED' ? null : 'ENABLED';
              setActiveStatFilter(newFilter);
              setSelectedStatus('ENABLED');
              setCurrentPage(1);
              fetchExperts(1, 'ENABLED', selectedGender);
            }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Enabled</p>
                <p className="text-2xl font-bold text-gray-900">{dashData?.enabled_experts_count}</p>
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
            whileHover={{ y: -2 }}
            onClick={() => {
              const newFilter = activeStatFilter === 'DISABLED' ? null : 'DISABLED';
              setActiveStatFilter(newFilter);
              setSelectedStatus('DISABLED');
              setCurrentPage(1);
              fetchExperts(1, 'DISABLED', selectedGender);
            }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Disabled</p>
                <p className="text-2xl font-bold text-gray-900">{dashData?.disabled_experts_count}</p>
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
            whileHover={{ y: -2 }}
            onClick={() => {
              const newFilter = activeStatFilter === 'MALE' ? null : 'MALE';
              setActiveStatFilter(newFilter);
              setSelectedGender('MALE');
              setCurrentPage(1);
              fetchExperts(1, selectedStatus, 'MALE');
            }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Male</p>
                <p className="text-2xl font-bold text-gray-900">{dashData?.male_experts_count}</p>
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
            whileHover={{ y: -2 }}
            onClick={() => {
              const newFilter = activeStatFilter === 'FEMALE' ? null : 'FEMALE';
              setActiveStatFilter(newFilter);
              setSelectedGender('FEMALE');
              setCurrentPage(1);
              fetchExperts(1, selectedStatus, 'FEMALE');
            }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Female</p>
                <p className="text-2xl font-bold text-gray-900">{dashData?.female_experts_count}</p>
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
            <div className="flex relative w-full gap-3">
              <Search onClick={() => handleSearch()} size={20} className="cursor-pointer absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, email, phone, or specialization..."
                value={tempSearchQuery}
                onChange={(e) => setTempSearchQuery(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { handleSearch() } }}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none  shadow-sm"
              />
              <button onClick={() => handleSearch()} className='bg-primaryColor text-white rounded-lg px-5 cursor-pointer'>Search</button>
            </div>

            {/* Status Filter */}
            <div className="relative">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value as 'ALL' | 'ENABLED' | 'DISABLED')}
                className="appearance-none bg-white border border-gray-200 rounded-lg px-4 py-3 pr-8 focus:outline-none "
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
                className="appearance-none bg-white border border-gray-200 rounded-lg px-4 py-3 pr-8 focus:outline-none "
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
            {experts.map((expert) => (
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
                      {expert.status && (
                        <StatusBadge enabled={expert.status} />
                      )}
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
                    <Home size={14} className="mr-2" />
                    {expert.address || 'N/A'}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Phone size={14} className="mr-2" />
                    {expert.phone_number || 'N/A'}
                  </div>
                  {expert.experience && (
                    <div className="flex items-center text-sm text-gray-600">
                      <User size={14} className="mr-2" />
                      {expert.experience} experience
                    </div>)}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100">

                  <div className="flex gap-2">
                    {expert?.is_blocked === true ? (
                      <button
                        onClick={() => setConfirmModal({ type: 'disable', expert })}
                        className="px-3 py-1 bg-red-100 text-red-700 rounded-lg text-xs font-medium hover:bg-red-200 transition-colors"
                      >
                        Blocked
                      </button>
                    ) : (
                      <button
                        onClick={() => setConfirmModal({ type: 'enable', expert })}
                        className="px-3 py-1 bg-green-100 text-green-700 rounded-lg text-xs font-medium hover:bg-green-200 transition-colors"
                      >
                        UnBlocked
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && experts.length === 0 && (
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
          <Pagination
            paginationData={paginationData}
            onPageChange={handlePageChange}
            loading={loading}
          />
        )}
      </div>

      {/* Add Expert Modal */}
      <ModernModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setNewExpert({
            name: '',
            email: '',
            password: '',
            phone_number: '',
            gender: 'MALE',
            dob: '',
            addresss: '',
          });
          setFormErrors({ name: '', email: '', password: '', phone_number: '', dob: '', addresss: "" });
        }}
        title="Add New Expert"
        size="lg"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Name Field */}
          <div>
            <InputField
              label="Full Name"
              value={newExpert.name}
              onChange={(e) => {
                const value = e.target.value;
                setNewExpert({ ...newExpert, name: value });
                // Real-time validation
                if (!value.trim()) {
                  setFormErrors(prev => ({ ...prev, name: 'Name is required' }));
                } else if (value.trim().length < 2) {
                  setFormErrors(prev => ({ ...prev, name: 'Name must be at least 2 characters long' }));
                } else {
                  setFormErrors(prev => ({ ...prev, name: '' }));
                }
              }}
              placeholder="Enter full name"
              required
              error={formErrors.name}
              icon={User}
            />
            {newExpert.name && !formErrors.name && (
              <div className="flex items-center mt-1 text-green-600 text-xs">
                <CheckCircle size={12} className="mr-1" />
                Valid name
              </div>
            )}
          </div>

          {/* Email Field */}
          <div>
            <InputField
              label="Email"
              type="email"
              value={newExpert.email}
              onChange={(e) => {
                const value = e.target.value;
                setNewExpert({ ...newExpert, email: value });
                // Real-time validation
                if (!value.match(/^\S+@\S+\.\S+$/)) {
                  setFormErrors(prev => ({ ...prev, email: 'Please enter a valid email address' }));
                } else {
                  setFormErrors(prev => ({ ...prev, email: '' }));
                }
              }}
              placeholder="Enter email address"
              required
              error={formErrors.email}
              icon={Mail}
            />
            {newExpert.email && !formErrors.email && (
              <div className="flex items-center mt-1 text-green-600 text-xs">
                <CheckCircle size={12} className="mr-1" />
                Valid email
              </div>
            )}
          </div>

          {/* Password Field */}
          <div className="relative">
            <InputField
              label="Password"
              type={passView ? "text" : "password"}
              value={newExpert.password}
              onChange={(e) => {
                const value = e.target.value;
                setNewExpert({ ...newExpert, password: value });
                // Real-time validation
                if (value.length < 8) {
                  setFormErrors(prev => ({ ...prev, password: 'Password must be at least 8 characters long' }));
                } else {
                  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/;
                  if (!passwordRegex.test(value)) {
                    setFormErrors(prev => ({ ...prev, password: 'Missing required character types' }));
                  } else {
                    setFormErrors(prev => ({ ...prev, password: '' }));
                  }
                }
              }}
              placeholder="Enter strong password"
              required
              error={formErrors.password}
            />
            <div className='absolute right-3 top-10 flex items-center justify-center'>
              {passView ?
                <EyeIcon size={20} onClick={() => setPassView(false)} className='cursor-pointer' /> :
                <EyeOffIcon size={20} onClick={() => setPassView(true)} className='cursor-pointer' />
              }
            </div>

            {/* Password strength indicator */}
            {newExpert.password && (
              <div className="mt-2">
                <div className="flex justify-between text-xs text-gray-600 mb-1">
                  <span>Password strength:</span>
                  <span className={`font-medium ${passwordStrength.text === 'Very Weak' ? 'text-red-600' :
                    passwordStrength.text === 'Weak' ? 'text-orange-600' :
                      passwordStrength.text === 'Medium' ? 'text-yellow-600' :
                        'text-green-600'
                    }`}>
                    {passwordStrength.text}
                  </span>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-gray-200 rounded-full h-1.5 mb-2">
                  <div
                    className={`h-1.5 rounded-full transition-all duration-300 ${passwordStrength.color
                      }`}
                    style={{
                      width: `${(passwordStrength.strength / 5) * 100}%`
                    }}
                  ></div>
                </div>

                {/* Requirements checklist */}
                <div className="grid grid-cols-2 gap-1 text-xs">
                  <div className="flex items-center">
                    {newExpert.password.length >= 8 ? (
                      <CheckCircle size={12} className="text-green-600 mr-1" />
                    ) : (
                      <XCircle size={12} className="text-gray-400 mr-1" />
                    )}
                    <span className={newExpert.password.length >= 8 ? 'text-green-600' : 'text-gray-500'}>
                      8+ characters
                    </span>
                  </div>
                  <div className="flex items-center">
                    {/[a-z]/.test(newExpert.password) ? (
                      <CheckCircle size={12} className="text-green-600 mr-1" />
                    ) : (
                      <XCircle size={12} className="text-gray-400 mr-1" />
                    )}
                    <span className={/[a-z]/.test(newExpert.password) ? 'text-green-600' : 'text-gray-500'}>
                      Lowercase letter
                    </span>
                  </div>
                  <div className="flex items-center">
                    {/[A-Z]/.test(newExpert.password) ? (
                      <CheckCircle size={12} className="text-green-600 mr-1" />
                    ) : (
                      <XCircle size={12} className="text-gray-400 mr-1" />
                    )}
                    <span className={/[A-Z]/.test(newExpert.password) ? 'text-green-600' : 'text-gray-500'}>
                      Uppercase letter
                    </span>
                  </div>
                  <div className="flex items-center">
                    {/\d/.test(newExpert.password) ? (
                      <CheckCircle size={12} className="text-green-600 mr-1" />
                    ) : (
                      <XCircle size={12} className="text-gray-400 mr-1" />
                    )}
                    <span className={/\d/.test(newExpert.password) ? 'text-green-600' : 'text-gray-500'}>
                      Number
                    </span>
                  </div>
                  <div className="flex items-center">
                    {/[@$!%*?&]/.test(newExpert.password) ? (
                      <CheckCircle size={12} className="text-green-600 mr-1" />
                    ) : (
                      <XCircle size={12} className="text-gray-400 mr-1" />
                    )}
                    <span className={/[@$!%*?&]/.test(newExpert.password) ? 'text-green-600' : 'text-gray-500'}>
                      Special character
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Phone Number Field */}
          <div>
            <InputField
              label="Phone Number"
              value={newExpert.phone_number}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, ''); // Remove non-digits
                setNewExpert({ ...newExpert, phone_number: value });
                // Real-time validation
                if (!value.match(/^\d{10}$/)) {
                  setFormErrors(prev => ({ ...prev, phone_number: 'Phone number must be exactly 10 digits' }));
                } else {
                  setFormErrors(prev => ({ ...prev, phone_number: '' }));
                }
              }}
              placeholder="Enter 10-digit phone number"
              required
              error={formErrors.phone_number}
              icon={Phone}
            />
            {newExpert.phone_number && !formErrors.phone_number && (
              <div className="flex items-center mt-1 text-green-600 text-xs">
                <CheckCircle size={12} className="mr-1" />
                Valid phone number
              </div>
            )}
          </div>

          {/* Gender Field */}
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

          {/* Date of Birth Field */}
          <div>
            <InputField
              label="Date of Birth"
              type="date"
              value={newExpert.dob}
              onChange={(e) => {
                const value = e.target.value;
                setNewExpert({ ...newExpert, dob: value });
                // Real-time validation
                if (!value) {
                  setFormErrors(prev => ({ ...prev, dob: 'Date of birth is required' }));
                } else {
                  const dobDate = new Date(value);
                  const today = new Date();
                  const minAgeDate = new Date();
                  minAgeDate.setFullYear(today.getFullYear() - 18);

                  if (dobDate > minAgeDate) {
                    setFormErrors(prev => ({ ...prev, dob: 'Expert must be at least 18 years old' }));
                  } else {
                    setFormErrors(prev => ({ ...prev, dob: '' }));
                  }
                }
              }}
              placeholder=""
              required
              error={formErrors.dob}
            />
            {newExpert.dob && !formErrors.dob && (
              <div className="flex items-center mt-1 text-green-600 text-xs">
                <CheckCircle size={12} className="mr-1" />
                Valid date of birth
              </div>
            )}
          </div>

          {/* Address Field */}
          <div className="md:col-span-2">
            <InputField
              label="Address"
              value={newExpert.addresss}
              onChange={(e) => {
                const value = e.target.value;
                setNewExpert({ ...newExpert, addresss: value });
                // Real-time validation
                if (!value.trim()) {
                  setFormErrors(prev => ({ ...prev, addresss: 'Address is required' }));
                } else if (value.trim().length < 10) {
                  setFormErrors(prev => ({ ...prev, addresss: 'Address must be at least 10 characters long' }));
                } else {
                  setFormErrors(prev => ({ ...prev, addresss: '' }));
                }
              }}
              placeholder="Enter complete address (minimum 10 characters)"
              required
              error={formErrors.addresss}
            />
            {newExpert.addresss && !formErrors.addresss && (
              <div className="flex items-center mt-1 text-green-600 text-xs">
                <CheckCircle size={12} className="mr-1" />
                Valid address
              </div>
            )}
            {newExpert.addresss && (
              <div className="text-xs text-gray-500 mt-1">
                {newExpert.addresss.length}/10 characters minimum
              </div>
            )}
          </div>
        </div>

        {/* Form Validation Summary */}
        {(Object.values(formErrors).some(error => error) || !isFormComplete()) && (
          <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-yellow-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <h4 className="text-sm font-medium text-yellow-800">
                Please fix the following issues to continue:
              </h4>
            </div>
            <ul className="mt-2 text-sm text-yellow-700 list-disc list-inside">
              {formErrors.name && <li>{formErrors.name}</li>}
              {formErrors.email && <li>{formErrors.email}</li>}
              {formErrors.password && <li>{formErrors.password}</li>}
              {formErrors.phone_number && <li>{formErrors.phone_number}</li>}
              {formErrors.dob && <li>{formErrors.dob}</li>}
              {formErrors.addresss && <li>{formErrors.addresss}</li>}
              {!isFormComplete() && Object.values(formErrors).every(error => !error) && (
                <li>All fields are required</li>
              )}
            </ul>
          </div>
        )}

        <div className="mt-8 flex justify-end gap-4">
          <button
            onClick={() => {
              setIsAddModalOpen(false);
              setNewExpert({
                name: '',
                email: '',
                password: '',
                phone_number: '',
                gender: 'MALE',
                dob: '',
                addresss: '',
              });
              setFormErrors({ name: '', email: '', password: '', phone_number: '', dob: '', addresss: "" });
            }}
            className="px-6 py-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleAddExpert}
            disabled={loading || !isFormValid()}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Adding...' : 'Add Expert'}
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
        title={`${selectedExpert?.name} - Details`}
        size="xl"
      >
        <div className="space-y-6">
          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('bookings')}
                className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${activeTab === 'bookings'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
              >
                <Calendar size={16} className="inline mr-2" />
                Bookings
                {selectedExpert && expertBookings[selectedExpert.uuid]?.length > 0 && (
                  <span className="ml-2 bg-blue-100 text-blue-600 text-xs py-0.5 px-2 rounded-full">
                    {bookingsPagination[selectedExpert.uuid]?.total_items || expertBookings[selectedExpert.uuid]?.length}
                  </span>
                )}
              </button>
              <button
                onClick={() => setActiveTab('slots')}
                className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${activeTab === 'slots'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
              >
                <Clock size={16} className="inline mr-2" />
                Time Slots
                {selectedExpert && expertSlots[selectedExpert.uuid]?.length > 0 && (
                  <span className="ml-2 bg-blue-100 text-blue-600 text-xs py-0.5 px-2 rounded-full">
                    {slotsPagination[selectedExpert.uuid]?.total_items || expertSlots[selectedExpert.uuid]?.length}
                  </span>
                )}
              </button>
            </nav>
          </div>

          {/* Bookings Tab Content */}
          {activeTab === 'bookings' && (
            <div className="space-y-4">
              {selectedExpert && loadingBookings[selectedExpert.uuid] ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                  <span className="ml-2 text-gray-600">Loading bookings...</span>
                </div>
              ) : selectedExpert && expertBookings[selectedExpert.uuid]?.length > 0 ? (
                <>
                  <div className="space-y-4 max-h-full ">
                    {expertBookings[selectedExpert.uuid]?.map((booking: any) => (
                      <div
                        key={booking.uuid}
                        className="bg-white border border-gray-100 rounded-xl p-4 hover:shadow-md transition-shadow"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                          <div>
                            <h4 className="text-sm font-medium text-gray-500">Patient Name</h4>
                            <p className="mt-1 font-medium">{booking?.customer_name}</p>
                          </div>
                          <div>
                            <h4 className="text-sm font-medium text-gray-500">Patient Email</h4>
                            <p className="mt-1 text-sm">{booking?.customer_email}</p>
                          </div>
                          <div>
                            <h4 className="text-sm font-medium text-gray-500">Phone Number</h4>
                            <p className="mt-1">{booking?.customer_phone_number}</p>
                          </div>
                          <div>
                            <h4 className="text-sm font-medium text-gray-500">Date & Time</h4>
                            <p className="mt-1 text-sm">
                              {formatDate(booking?.start_time)}<br />
                              {formatTime(booking?.end_time)}
                            </p>
                          </div>
                          <div>
                            <h4 className="text-sm font-medium text-gray-500">Status</h4>
                            <div className="mt-1">
                              <BookingStatusBadge status={booking?.booking_status} />
                            </div>
                          </div>
                          <div>
                            <h4 className="text-sm font-medium text-gray-500">Payment Mode</h4>
                            <p className="mt-1 text-sm">{booking?.payment_mode}</p>
                          </div>
                          <div>
                            <h4 className="text-sm font-medium text-gray-500">Booking Type</h4>
                            <p className="mt-1 text-sm">{booking.booking_type || 'N/A'}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Bookings Pagination */}
                  {bookingsPagination[selectedExpert.uuid]?.total_pages > 1 && (
                    <Pagination
                      paginationData={bookingsPagination[selectedExpert.uuid]}
                      onPageChange={(page) => handleBookingsPageChange(selectedExpert.uuid, page)}
                      loading={loadingBookings[selectedExpert.uuid]}
                    />
                  )}
                </>
              ) : (
                <div className="text-center py-8 bg-gray-50 rounded-lg">
                  <Calendar className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No bookings</h3>
                  <p className="mt-1 text-sm text-gray-500">No bookings found for this expert.</p>
                </div>
              )}
            </div>
          )}

          {/* Slots Tab Content */}
          {activeTab === 'slots' && (
            <div className="space-y-4">
              {selectedExpert && loadingSlots[selectedExpert.uuid] ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                  <span className="ml-2 text-gray-600">Loading slots...</span>
                </div>
              ) : selectedExpert && expertSlots[selectedExpert.uuid]?.length > 0 ? (
                <>
                  <div className="bg-white border border-gray-100 rounded-xl overflow-hidden">
                    <div className="grid grid-cols-1 md:grid-cols-6 gap-4 p-4 bg-gray-50 font-medium text-sm">
                      <div>Date</div>
                      <div>Start Time</div>
                      <div>End Time</div>
                      <div>Status</div>
                      <div>Type</div>
                      <div>Actions</div>
                    </div>
                    <div className="divide-y divide-gray-100 max-h-full ">
                      {expertSlots[selectedExpert.uuid].map((slot) => (
                        <div key={slot.uuid} className="grid grid-cols-1 md:grid-cols-6 gap-4 p-4 items-center text-sm">
                          <div className="font-medium">{formatDate(slot.start_time)}</div>
                          <div>{formatTime(slot.start_time)}</div>
                          <div>{formatTime(slot.end_time)}</div>
                          <div>
                            <div className="flex flex-col gap-1">
                              <SlotStatusBadge is_booked={slot.is_booked} />
                              {slot.status === 'PENDING' && (
                                <span className="text-yellow-600 text-xs">Pending Approval</span>
                              )}
                              {slot.status === 'REJECTED' && (
                                <span className="text-red-600 text-xs">Rejected</span>
                              )}
                            </div>
                          </div>
                          <div>
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${slot.slot_type === 'REGULAR'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-purple-100 text-purple-800'
                              }`}>
                              {slot.slot_type}
                            </span>
                          </div>
                          <div className="flex gap-2">
                            {slot.status === 'DRAFT' && (
                              <>
                                <button
                                  onClick={() => handleApproveSlot(slot)}
                                  className="p-1 text-green-600 hover:bg-green-50 rounded transition-colors"
                                  title="Approve Slot"
                                >
                                  <CheckCircle size={16} />
                                </button>
                                <button
                                  onClick={() => handleRejectSlot(slot)}
                                  className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                                  title="Reject Slot"
                                >
                                  <XCircle size={16} />
                                </button>
                              </>
                            )}
                            {slot.status === 'APPROVED' && (
                              <span className="text-sm text-green-600 font-medium">Approved</span>
                            )}
                            {slot.status === 'REJECTED' && (
                              <span className="text-sm text-red-600 font-medium">Rejected</span>
                            )}
                            {slot.status === 'DRAFT' && (
                              <span className="text-sm text-yellow-600 font-medium">Draft</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Slots Pagination */}
                  {slotsPagination[selectedExpert.uuid]?.total_pages > 1 && (
                    <Pagination
                      paginationData={slotsPagination[selectedExpert.uuid]}
                      onPageChange={(page) => handleSlotsPageChange(selectedExpert.uuid, page)}
                      loading={loadingSlots[selectedExpert.uuid]}
                    />
                  )}
                </>
              ) : (
                <div className="text-center py-8 bg-gray-50 rounded-lg">
                  <Clock className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No slots</h3>
                  <p className="mt-1 text-sm text-gray-500">No slot data available for this expert.</p>
                </div>
              )}
            </div>
          )}
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
              {confirmModal.type === 'enable'
                ? 'Are you sure you want to block the expert'
                : 'Are you sure you want to unBlock the expert'} {" "}
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
                    handleToggleExpert(confirmModal.expert);
                  }
                  setConfirmModal(null);
                }}
                className={`px-4 py-2 rounded-lg text-white transition-colors ${confirmModal.type === 'enable'
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

      {/* Slot Action Modal */}
      <ModernModal
        isOpen={isSlotActionModalOpen}
        onClose={() => {
          setIsSlotActionModalOpen(false);
          setSelectedSlot(null);
          setSlotActionType(null);
          setRejectionReason('');
        }}
        title={`${slotActionType === 'approve' ? 'Approve' : 'Reject'} Slot`}
        size="md"
      >
        {selectedSlot && (
          <div className="space-y-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-900">Slot Details</h4>
              <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-gray-600">Date:</span> {formatDate(selectedSlot.start_time)}
                </div>
                <div>
                  <span className="text-gray-600">Time:</span> {formatTime(selectedSlot.start_time)} - {formatTime(selectedSlot.end_time)}
                </div>
                <div>
                  <span className="text-gray-600">Clinic:</span> {selectedSlot.clinic_name}
                </div>
                <div>
                  <span className="text-gray-600">Type:</span> {selectedSlot.slot_type}
                </div>
              </div>
            </div>

            {slotActionType === 'reject' && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Reason for Rejection <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="Please provide a reason for rejecting this slot..."
                  className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[100px]"
                  required
                />
              </div>
            )}

            <div className="flex justify-end gap-4">
              <button
                onClick={() => {
                  setIsSlotActionModalOpen(false);
                  setSelectedSlot(null);
                  setSlotActionType(null);
                  setRejectionReason('');
                }}
                className="px-4 py-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
                disabled={loadingSlotAction}
              >
                Cancel
              </button>
              <button
                onClick={confirmSlotAction}
                className={`px-4 py-2 rounded-lg text-white transition-colors ${slotActionType === 'approve'
                  ? 'bg-green-600 hover:bg-green-700'
                  : 'bg-red-600 hover:bg-red-700'
                  } disabled:opacity-50`}
                disabled={loadingSlotAction || (slotActionType === 'reject' && !rejectionReason.trim())}
              >
                {loadingSlotAction ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    {slotActionType === 'approve' ? 'Approving...' : 'Rejecting...'}
                  </div>
                ) : (
                  slotActionType === 'approve' ? 'Approve Slot' : 'Reject Slot'
                )}
              </button>
            </div>
          </div>
        )}
      </ModernModal>

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