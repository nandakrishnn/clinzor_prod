import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  MoreVertical, 
  Eye, 
  Edit, 
  Trash2, 
  UserX, 
  UserCheck, 
  Mail, 
  Phone, 
  Calendar, 
  Download, 
  Plus,
  Shield,
  ShieldCheck,
  AlertCircle,
  CheckCircle,
  XCircle,
  Clock,
  Globe,
  ChevronDown,
  RefreshCw,
  Settings,
  X,
  AlertTriangle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import useMedia from '../../../src/hooks/useMedia';

interface User {
  uuid: string;
  email: string;
  full_name: string;
  phone_number: string;
  country_code: string;
  role: 'CUSTOMER' | 'EXPERT' | 'CLINIC_ADMIN' | 'SUPER_ADMIN';
  is_active: boolean;
  is_staff: boolean;
  is_superuser: boolean;
  is_blocked: boolean;
  last_login: string | null;
  created_by: string | null;
  created_at: string;
  profile_image: string;
}

interface StatusBadgeProps {
  status: boolean;
  type: 'active' | 'blocked' | 'staff' | 'superuser';
}

interface UserCardProps {
  user: User;
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
  onBlock: (user: User) => void;
  onView: (user: User) => void;
}

interface UserRowProps extends UserCardProps {}

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

interface NotificationProps {
  type: 'success' | 'error' | 'warning';
  message: string;
  onClose: () => void;
}

// --- Add Booking type for mock bookings (from PatientBookings) ---
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

// --- Generate mock users and bookings together ---
const clinicNames = [
  'Sunrise Clinic',
  'MedCare Center',
  'City Health Center',
  'Family Wellness Clinic',
  'Wellness Point',
  'Care & Cure',
  'HealthFirst',
  'LifeSpring',
  'Prime Health',
  'CureWell Hospital'
];
const serviceTypes = [
  'Dermatology',
  'Cardiology',
  'ENT',
  'Orthopedics',
  'General Medicine',
  'Pediatrics',
  'Neurology',
  'Gynecology',
  'Ophthalmology',
  'Dentistry'
];
const sessionTypes = ['CONSULTATION', 'SESSION', 'FOLLOWUP'];
const bookingTypes = ['VIDEO_CALL', 'PHYSICAL_VISIT'];
const bookingStatuses = ['PENDING', 'SCHEDULED', 'COMPLETED'];
const paymentStatuses = ['PENDING', 'COMPLETED'];

function randomFromArray<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

const generateMockUsersAndBookings = () => {
  const users: User[] = [];
  const bookings: Booking[] = [];
  const countries = ['91', '1', '44', '61', '49'];
  const names = [
    'Gaurav Sahu', 'Priya Sharma', 'Rajesh Kumar', 'Anita Nair', 'Mohammed Ali',
    'Lakshmi Pillai', 'Arjun Menon', 'Meera Joseph', 'Suresh Nair', 'Ravi Kumar',
    'Deepika Singh', 'Vikram Reddy', 'Sonia Gupta', 'Amit Patel', 'Kavya Iyer',
    'Rohit Joshi', 'Sneha Desai', 'Kiran Rao', 'Pooja Agarwal', 'Nikhil Varma'
  ];
  for (let index = 0; index < 150; index++) {
    const name = names[index % names.length];
    const email = `user${index + 1}@example.com`;
    const user: User = {
      uuid: `user-${index + 1}-${Math.random().toString(36).substr(2, 9)}`,
      email,
      full_name: name,
      phone_number: `${Math.floor(Math.random() * 9000000000) + 1000000000}`,
      country_code: countries[Math.floor(Math.random() * countries.length)],
      role: 'CUSTOMER',
      is_active: Math.random() > 0.1,
      is_staff: false,
      is_superuser: false,
      is_blocked: Math.random() > 0.9,
      last_login: Math.random() > 0.3 ? new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString() : null,
      created_by: Math.random() > 0.5 ? 'system' : null,
      created_at: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
      profile_image: `https://images.unsplash.com/photo-${1500000000000 + index}?auto=format&fit=crop&w=64&h=64&q=80`
    };
    users.push(user);
    // Generate 2-5 bookings per user
    const bookingCount = Math.floor(Math.random() * 4) + 2;
    for (let b = 0; b < bookingCount; b++) {
      const clinicIdx = Math.floor(Math.random() * clinicNames.length);
      const serviceIdx = Math.floor(Math.random() * serviceTypes.length);
      const daysAgo = Math.floor(Math.random() * 180);
      const startHour = 9 + Math.floor(Math.random() * 8); // 9am to 5pm
      const startMinute = Math.random() > 0.5 ? 0 : 30;
      const start = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000);
      start.setHours(startHour, startMinute, 0, 0);
      const end = new Date(start.getTime() + 30 * 60 * 1000);
      bookings.push({
        uuid: `b-${user.uuid}-${b}`,
        created_by: 'admin@clinzor.com',
        booking_type: randomFromArray(bookingTypes) as 'VIDEO_CALL' | 'PHYSICAL_VISIT',
        booking_status: randomFromArray(bookingStatuses) as 'PENDING' | 'SCHEDULED' | 'COMPLETED',
        start_time: start.toISOString(),
        end_time: end.toISOString(),
        payment_status: randomFromArray(paymentStatuses) as 'PENDING' | 'COMPLETED',
        session_type: randomFromArray(sessionTypes),
        patient_name: name,
        patient_mobile: user.phone_number,
        patient_email: email,
        booking_charge: (Math.floor(Math.random() * 900) + 100).toFixed(2),
        clinic_name: clinicNames[clinicIdx],
        clinic_id: `clinic-${clinicIdx + 1}`,
        service_type: serviceTypes[serviceIdx],
      });
    }
  }
  return { users, bookings };
};

const Modal = ({ isOpen, onClose, title, children }: ModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">{title}</h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-500 focus:outline-none"
              >
                <X size={24} />
              </button>
            </div>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

const Notification = ({ type, message, onClose }: NotificationProps) => {
  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-400" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-red-400" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-400" />;
    }
  };

  const getBgColor = () => {
    switch (type) {
      case 'success':
        return 'bg-green-50';
      case 'error':
        return 'bg-red-50';
      case 'warning':
        return 'bg-yellow-50';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg ${getBgColor()} border border-gray-200`}
    >
      <div className="flex items-center">
        {getIcon()}
        <p className="ml-3 text-sm font-medium text-gray-900">{message}</p>
        <button
          onClick={onClose}
          className="ml-4 text-gray-400 hover:text-gray-500"
        >
          <X size={16} />
        </button>
      </div>
    </motion.div>
  );
};

const StatusBadge = ({ status, type }: StatusBadgeProps) => {
  const getStatusConfig = () => {
    if (type === 'active') {
      return status ? 
        { color: 'bg-green-100 text-green-700', icon: <CheckCircle size={12} />, text: 'Active' } :
        { color: 'bg-red-100 text-red-700', icon: <XCircle size={12} />, text: 'Inactive' };
    }
    if (type === 'blocked') {
      return status ? 
        { color: 'bg-red-100 text-red-700', icon: <UserX size={12} />, text: 'Blocked' } :
        { color: 'bg-green-100 text-green-700', icon: <UserCheck size={12} />, text: 'Unblocked' };
    }
    if (type === 'staff') {
      return status ? 
        { color: 'bg-blue-100 text-blue-700', icon: <Shield size={12} />, text: 'Staff' } :
        { color: 'bg-gray-100 text-gray-700', icon: <Users size={12} />, text: 'User' };
    }
    if (type === 'superuser') {
      return status ? 
        { color: 'bg-purple-100 text-purple-700', icon: <ShieldCheck size={12} />, text: 'Super Admin' } :
        { color: 'bg-gray-100 text-gray-700', icon: <Users size={12} />, text: 'Regular' };
    }
    return { color: 'bg-gray-100 text-gray-700', icon: <Users size={12} />, text: 'Unknown' };
  };
  
  const config = getStatusConfig();
  
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
      {config.icon}
      {config.text}
    </span>
  );
};

const UserCard = ({ user, onEdit, onDelete, onBlock, onView }: UserCardProps) => (
  <motion.div 
    className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    whileHover={{ y: -2 }}
  >
    <div className="flex items-start justify-between mb-4">
      <div className="flex items-center">
        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold text-lg mr-4">
          {user.full_name.split(' ').map(n => n[0]).join('').toUpperCase()}
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">{user.full_name}</h3>
          <p className="text-sm text-gray-600">{user.email}</p>
          <div className="flex items-center text-xs text-gray-500 mt-1">
            <Phone size={10} className="mr-1" />
            +{user.country_code} {user.phone_number}
          </div>
        </div>
      </div>
      
      <div className="relative">
        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <MoreVertical size={16} className="text-gray-500" />
        </button>
      </div>
    </div>
    
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-600">Status:</span>
        <div className="flex gap-2">
          <StatusBadge status={user.is_active} type="active" />
          {user.is_blocked && <StatusBadge status={user.is_blocked} type="blocked" />}
        </div>
      </div>
      
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-600">Last Login:</span>
        <span className="text-sm text-gray-900">
          {user.last_login ? new Date(user.last_login).toLocaleDateString() : 'Never'}
        </span>
      </div>
      
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-600">Joined:</span>
        <span className="text-sm text-gray-900">
          {new Date(user.created_at).toLocaleDateString()}
        </span>
      </div>
    </div>
    
    <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100">
      <button 
        onClick={() => onView(user)}
        className="flex-1 py-2 px-3 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium"
      >
        View
      </button>
      <button 
        onClick={() => onEdit(user)}
        className="flex-1 py-2 px-3 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors text-sm font-medium"
      >
        Edit
      </button>
      <button 
        onClick={() => onBlock(user)}
        className={`flex-1 py-2 px-3 rounded-lg transition-colors text-sm font-medium ${
          user.is_blocked 
            ? 'bg-green-50 text-green-600 hover:bg-green-100' 
            : 'bg-red-50 text-red-600 hover:bg-red-100'
        }`}
      >
        {user.is_blocked ? 'Unblock' : 'Block'}
      </button>
    </div>
  </motion.div>
);

const UserRow = ({ user, onEdit, onDelete, onBlock, onView }: UserRowProps) => (
  <motion.tr 
    className="hover:bg-gray-50 transition-colors"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    whileHover={{ backgroundColor: 'rgb(249, 250, 251)' }}
  >
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="flex items-center">
        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold text-sm mr-3">
          {user.full_name.split(' ').map(n => n[0]).join('').toUpperCase()}
        </div>
        <div>
          <div className="text-sm font-medium text-gray-900">{user.full_name}</div>
          <div className="text-sm text-gray-500">{user.email}</div>
        </div>
      </div>
    </td>
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="text-sm text-gray-900">+{user.country_code} {user.phone_number}</div>
    </td>
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="flex gap-1">
        <StatusBadge status={user.is_active} type="active" />
        {user.is_blocked && <StatusBadge status={user.is_blocked} type="blocked" />}
      </div>
    </td>
    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
      {user.last_login ? new Date(user.last_login).toLocaleDateString() : 'Never'}
    </td>
    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
      {new Date(user.created_at).toLocaleDateString()}
    </td>
    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
      <div className="flex items-center justify-end gap-2">
        <button 
          onClick={() => onView(user)}
          className="text-blue-600 hover:text-blue-900 p-1 hover:bg-blue-50 rounded transition-all"
        >
          <Eye size={16} />
        </button>
        <button 
          onClick={() => onEdit(user)}
          className="text-gray-600 hover:text-gray-900 p-1 hover:bg-gray-50 rounded transition-all"
        >
          <Edit size={16} />
        </button>
        <button 
          onClick={() => onBlock(user)}
          className={`p-1 rounded transition-all ${
            user.is_blocked 
              ? 'text-green-600 hover:text-green-900 hover:bg-green-50' 
              : 'text-red-600 hover:text-red-900 hover:bg-red-50'
          }`}
        >
          {user.is_blocked ? <UserCheck size={16} /> : <UserX size={16} />}
        </button>
        <button 
          onClick={() => onDelete(user)}
          className="text-red-600 hover:text-red-900 p-1 hover:bg-red-50 rounded transition-all"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </td>
  </motion.tr>
);

export default function AllUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const [sortBy, setSortBy] = useState<keyof User>('created_at');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  
  // Modal states
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isBlockModalOpen, setIsBlockModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState<Partial<User>>({});
  
  const [notification, setNotification] = useState<{
    type: 'success' | 'error' | 'warning';
    message: string;
  } | null>(null);
  
  const isMobile = useMedia('(max-width: 640px)');
  
  // Load users on component mount
  useEffect(() => {
    const loadUsers = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      const { users: mockUsers, bookings: mockBookings } = generateMockUsersAndBookings();
      setUsers(mockUsers);
      setBookings(mockBookings);
      setFilteredUsers(mockUsers);
      setLoading(false);
    };
    loadUsers();
  }, []);
  
  // Filter and search users
  useEffect(() => {
    let filtered = [...users];
    
    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(user => 
        user.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.phone_number.includes(searchQuery)
      );
    }
    
    // Status filter
    if (statusFilter === 'ACTIVE') {
      filtered = filtered.filter(user => user.is_active && !user.is_blocked);
    } else if (statusFilter === 'INACTIVE') {
      filtered = filtered.filter(user => !user.is_active);
    } else if (statusFilter === 'BLOCKED') {
      filtered = filtered.filter(user => user.is_blocked);
    }
    
    // Sort
    filtered.sort((a, b) => {
      const aValue = a[sortBy];
      const bValue = b[sortBy];
      
      if (sortBy === 'created_at' || sortBy === 'last_login') {
        const aDate = aValue ? new Date(aValue as string).getTime() : 0;
        const bDate = bValue ? new Date(bValue as string).getTime() : 0;
        return sortOrder === 'asc' ? aDate - bDate : bDate - aDate;
      }
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortOrder === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
      
      if (typeof aValue === 'boolean' && typeof bValue === 'boolean') {
        return sortOrder === 'asc'
          ? (aValue === bValue ? 0 : aValue ? 1 : -1)
          : (aValue === bValue ? 0 : aValue ? -1 : 1);
      }
      
      return 0;
    });
    
    setFilteredUsers(filtered);
    setCurrentPage(1);
  }, [users, searchQuery, statusFilter, sortBy, sortOrder]);
  
  // Pagination
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedUsers = filteredUsers.slice(startIndex, startIndex + itemsPerPage);
  
  // Action handlers
  const handleView = (user: User) => {
    setSelectedUser(user);
    setIsViewModalOpen(true);
  };
  
  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setEditFormData({
      full_name: user.full_name,
      email: user.email,
      phone_number: user.phone_number,
      country_code: user.country_code,
      is_active: user.is_active,
      is_staff: user.is_staff,
      is_superuser: user.is_superuser
    });
    setIsEditModalOpen(true);
  };
  
  const handleDelete = (user: User) => {
    setSelectedUser(user);
    setIsDeleteModalOpen(true);
  };
  
  const handleBlock = (user: User) => {
    setSelectedUser(user);
    setIsBlockModalOpen(true);
  };

  const validateEditForm = (data: Partial<User>): string | null => {
    if (!data.full_name?.trim()) {
      return 'Full name is required';
    }
    if (!data.email?.trim()) {
      return 'Email is required';
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      return 'Invalid email format';
    }
    if (!data.phone_number?.trim()) {
      return 'Phone number is required';
    }
    if (!/^\d{10}$/.test(data.phone_number)) {
      return 'Phone number must be 10 digits';
    }
    if (!data.country_code?.trim()) {
      return 'Country code is required';
    }
    if (!/^\d{1,3}$/.test(data.country_code)) {
      return 'Invalid country code';
    }
    return null;
  };

  const handleEditSubmit = () => {
    const validationError = validateEditForm(editFormData);
    if (validationError) {
      setNotification({
        type: 'error',
        message: validationError
      });
      return;
    }

    if (selectedUser && editFormData) {
      setUsers(prev => prev.map(u => 
        u.uuid === selectedUser.uuid ? { ...u, ...editFormData } : u
      ));
      setIsEditModalOpen(false);
      setSelectedUser(null);
      setEditFormData({});
      setNotification({
        type: 'success',
        message: 'User updated successfully'
      });
    }
  };

  const handleDeleteConfirm = () => {
    if (selectedUser) {
      setUsers(prev => prev.filter(u => u.uuid !== selectedUser.uuid));
      setIsDeleteModalOpen(false);
      setSelectedUser(null);
      setNotification({
        type: 'success',
        message: 'User deleted successfully'
      });
    }
  };

  const handleBlockConfirm = () => {
    if (selectedUser) {
      setUsers(prev => prev.map(u => 
        u.uuid === selectedUser.uuid ? { ...u, is_blocked: !u.is_blocked } : u
      ));
      setIsBlockModalOpen(false);
      setSelectedUser(null);
      setNotification({
        type: 'success',
        message: selectedUser.is_blocked 
          ? 'User unblocked successfully'
          : 'User blocked successfully'
      });
    }
  };
  
  const handleExport = () => {
    console.log('Export users');
  };
  
  const handleRefresh = () => {
    window.location.reload();
  };
  
  // Users Display mode: force grid on mobile
  const effectiveViewMode = isMobile ? 'grid' : viewMode;
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading users...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50 p-2 sm:p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div 
          className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center">
              <Users className="mr-2 sm:mr-3 text-blue-600" size={28} />
              All Users
            </h1>
            <p className="text-gray-600 mt-1 text-sm sm:text-base">Manage and monitor all platform users</p>
          </div>
          <div className="flex items-center gap-2 sm:gap-4 mt-2 md:mt-0 w-full md:w-auto">
            <button 
              onClick={handleRefresh}
              className="flex items-center justify-center gap-2 px-3 py-2 sm:px-4 sm:py-2 text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors w-full md:w-auto"
            >
              <RefreshCw size={16} />
              <span className="hidden sm:inline">Refresh</span>
            </button>
          </div>
        </motion.div>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-8">
          <motion.div 
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-gray-900">{users.length}</p>
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
                <p className="text-sm font-medium text-gray-600">Active Users</p>
                <p className="text-2xl font-bold text-gray-900">
                  {users.filter(u => u.is_active && !u.is_blocked).length}
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <CheckCircle size={24} className="text-green-600" />
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
                <p className="text-sm font-medium text-gray-600">Blocked Users</p>
                <p className="text-2xl font-bold text-gray-900">
                  {users.filter(u => u.is_blocked).length}
                </p>
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
                <p className="text-sm font-medium text-gray-600">New This Month</p>
                <p className="text-2xl font-bold text-gray-900">
                  {users.filter(u => new Date(u.created_at) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)).length}
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <Calendar size={24} className="text-purple-600" />
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
            <div className="flex-1 relative w-full">
              <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search users by name, email, or phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 sm:py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
              />
            </div>
            
            {/* Status Filter */}
            <div className="relative w-full md:w-auto">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="appearance-none bg-white border border-gray-200 rounded-lg px-4 py-2 sm:py-3 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full md:w-auto text-sm sm:text-base"
              >
                <option value="ALL">All Status</option>
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
                <option value="BLOCKED">Blocked</option>
              </select>
              <ChevronDown size={16} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
            
            {/* View Mode Toggle: hide on mobile */}
            {!isMobile && (
              <div className="flex bg-gray-100 rounded-lg p-1 w-full md:w-auto">
                <button
                  onClick={() => setViewMode('table')}
                  className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    viewMode === 'table' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600'
                  }`}
                >
                  Table
                </button>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    viewMode === 'grid' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600'
                  }`}
                >
                  Grid
                </button>
              </div>
            )}
          </div>
        </motion.div>
        
        {/* Results Count */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-2">
          <p className="text-gray-600 text-sm sm:text-base">
            Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredUsers.length)} of {filteredUsers.length} users
          </p>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSortBy(e.target.value as keyof User)}
              className="text-sm bg-white border border-gray-200 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="full_name">Name</option>
              <option value="created_at">Date Joined</option>
              <option value="last_login">Last Login</option>
            </select>
            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="px-2 py-1 text-sm bg-white border border-gray-200 rounded hover:bg-gray-50 transition-colors"
            >
              {sortOrder === 'asc' ? '↑' : '↓'}
            </button>
          </div>
        </div>
        
        {/* Users Display */}
        {effectiveViewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8">
            {paginatedUsers.map((user) => (
              <UserCard
                key={user.uuid}
                user={user}
                onView={handleView}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onBlock={handleBlock}
              />
            ))}
          </div>
        ) : (
          <motion.div 
            className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-x-auto mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="min-w-[600px] sm:min-w-full overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 text-xs sm:text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Phone
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Last Login
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Joined
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {paginatedUsers.map((user) => (
                    <UserRow
                      key={user.uuid}
                      user={user}
                      onView={handleView}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                      onBlock={handleBlock}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
        
        {/* Pagination */}
        {totalPages > 1 && (
          <motion.div 
            className="flex flex-col sm:flex-row items-center justify-between bg-white p-3 sm:p-4 rounded-xl shadow-sm border border-gray-100 gap-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-start">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors w-1/2 sm:w-auto ${
                  currentPage === 1 
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                    : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                }`}
              >
                Previous
              </button>
              <span className="text-sm text-gray-600">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors w-1/2 sm:w-auto ${
                  currentPage === totalPages 
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                    : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                }`}
              >
                Next
              </button>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Items per page:</span>
              <select
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="text-sm bg-white border border-gray-200 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value={12}>12</option>
                <option value={24}>24</option>
                <option value={48}>48</option>
                <option value={96}>96</option>
              </select>
            </div>
          </motion.div>
        )}
      </div>

      {/* View Modal */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false);
          setSelectedUser(null);
        }}
        title="User Details"
      >
        {selectedUser && (
          <div className="space-y-6 max-h-[80vh] overflow-y-auto">
            {/* Profile Section */}
            <div className="flex items-center gap-4 pb-4 border-b border-gray-100">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-3xl shadow">
                {selectedUser.full_name.split(' ').map(n => n[0]).join('').toUpperCase()}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="text-2xl font-bold text-gray-900">{selectedUser.full_name}</h4>
                </div>
                <div className="flex items-center gap-2 text-gray-600 text-sm">
                  <Mail size={16} />
                  <span>{selectedUser.email}</span>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <StatusBadge status={selectedUser.is_active} type="active" />
                  {selectedUser.is_blocked && <StatusBadge status={selectedUser.is_blocked} type="blocked" />}
                </div>
              </div>
            </div>
            {/* User Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm pb-4 border-b border-gray-100">
              <div className="flex items-center gap-2 bg-blue-50 rounded-lg p-3">
                <Calendar size={18} className="text-blue-600" />
                <div>
                  <div className="text-xs text-gray-500">Joined</div>
                  <div className="font-medium text-gray-900">{new Date(selectedUser.created_at).toLocaleDateString()}</div>
                </div>
              </div>
              <div className="flex items-center gap-2 bg-purple-50 rounded-lg p-3">
                <Clock size={18} className="text-purple-600" />
                <div>
                  <div className="text-xs text-gray-500">Last Login</div>
                  <div className="font-medium text-gray-900">{selectedUser.last_login ? new Date(selectedUser.last_login).toLocaleDateString() : 'Never'}</div>
                </div>
              </div>
              <div className="flex items-center gap-2 bg-green-50 rounded-lg p-3">
                <Users size={18} className="text-green-600" />
                <div>
                  <div className="text-xs text-gray-500">Total Bookings</div>
                  <div className="font-medium text-gray-900">{bookings.filter(b => b.patient_email === selectedUser.email).length}</div>
                </div>
              </div>
              <div className="flex items-center gap-2 bg-yellow-50 rounded-lg p-3">
                <UserCheck size={18} className="text-yellow-600" />
                <div>
                  <div className="text-xs text-gray-500">Active</div>
                  <div className="font-medium text-gray-900">{selectedUser.is_active ? 'Yes' : 'No'}</div>
                </div>
              </div>
              <div className="flex items-center gap-2 bg-red-50 rounded-lg p-3">
                <UserX size={18} className="text-red-600" />
                <div>
                  <div className="text-xs text-gray-500">Blocked</div>
                  <div className="font-medium text-gray-900">{selectedUser.is_blocked ? 'Yes' : 'No'}</div>
                </div>
              </div>
            </div>
            {/* Bookings Table - show directly in modal */}
            <div className="pt-2">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Bookings</h3>
              {(() => {
                const userBookings = bookings.filter(b => b.patient_email === selectedUser.email);
                if (userBookings.length === 0) {
                  return <div className="text-gray-500 text-center py-4">No bookings found for this user.</div>;
                }
                return (
                  <div className="overflow-x-auto">
                    <table className="min-w-[600px] w-full divide-y divide-gray-200 text-xs sm:text-sm">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-2 sm:px-4 py-2 text-left font-medium text-gray-500 whitespace-nowrap">Clinic</th>
                          <th className="px-2 sm:px-4 py-2 text-left font-medium text-gray-500 whitespace-nowrap">Service</th>
                          <th className="px-2 sm:px-4 py-2 text-left font-medium text-gray-500 whitespace-nowrap">Date</th>
                          <th className="px-2 sm:px-4 py-2 text-left font-medium text-gray-500 whitespace-nowrap">Time</th>
                          <th className="px-2 sm:px-4 py-2 text-left font-medium text-gray-500 whitespace-nowrap">Slot</th>
                          <th className="px-2 sm:px-4 py-2 text-left font-medium text-gray-500 whitespace-nowrap">Type</th>
                          <th className="px-2 sm:px-4 py-2 text-left font-medium text-gray-500 whitespace-nowrap">Status</th>
                          <th className="px-2 sm:px-4 py-2 text-left font-medium text-gray-500 whitespace-nowrap">Payment</th>
                          <th className="px-2 sm:px-4 py-2 text-left font-medium text-gray-500 whitespace-nowrap">Charge</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {userBookings.map((b: Booking) => {
                          const date = new Date(b.start_time);
                          const end = new Date(b.end_time);
                          return (
                            <tr key={b.uuid}>
                              <td className="px-2 sm:px-4 py-2 font-medium text-blue-700 whitespace-nowrap">{b.clinic_name}</td>
                              <td className="px-2 sm:px-4 py-2 whitespace-nowrap">{b.service_type}</td>
                              <td className="px-2 sm:px-4 py-2 whitespace-nowrap">{date.toLocaleDateString()}</td>
                              <td className="px-2 sm:px-4 py-2 whitespace-nowrap">{date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                              <td className="px-2 sm:px-4 py-2 whitespace-nowrap">
                                <span className="inline-block bg-gray-100 rounded px-2 py-1 text-xs">
                                  {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                              </td>
                              <td className="px-2 sm:px-4 py-2 whitespace-nowrap">
                                <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${b.booking_type === 'VIDEO_CALL' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>
                                  {b.booking_type === 'VIDEO_CALL' ? 'Video Call' : 'Clinic Visit'}
                                </span>
                                <span className="ml-2 inline-block bg-gray-50 rounded px-2 py-1 text-xs text-gray-500">{b.session_type}</span>
                              </td>
                              <td className="px-2 sm:px-4 py-2 whitespace-nowrap">
                                <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium
                                  ${b.booking_status === 'COMPLETED' ? 'bg-green-100 text-green-700' : b.booking_status === 'SCHEDULED' ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-700'}`}
                                >
                                  {b.booking_status}
                                </span>
                              </td>
                              <td className="px-2 sm:px-4 py-2 whitespace-nowrap">
                                <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium
                                  ${b.payment_status === 'COMPLETED' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}
                                >
                                  {b.payment_status === 'COMPLETED' ? 'Paid' : 'Pending'}
                                </span>
                              </td>
                              <td className="px-2 sm:px-4 py-2 font-semibold text-right whitespace-nowrap">₹{parseFloat(b.booking_charge).toLocaleString()}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                );
              })()}
            </div>
          </div>
        )}
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedUser(null);
          setEditFormData({});
        }}
        title="Edit User"
      >
        {selectedUser && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Full Name</label>
              <input
                type="text"
                value={editFormData.full_name || ''}
                onChange={(e) => setEditFormData(prev => ({ ...prev, full_name: e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Enter full name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                value={editFormData.email || ''}
                onChange={(e) => setEditFormData(prev => ({ ...prev, email: e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Enter email address"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Country Code</label>
                <input
                  type="text"
                  value={editFormData.country_code || ''}
                  onChange={(e) => setEditFormData(prev => ({ ...prev, country_code: e.target.value }))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="e.g., 91"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                <input
                  type="text"
                  value={editFormData.phone_number || ''}
                  onChange={(e) => setEditFormData(prev => ({ ...prev, phone_number: e.target.value }))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Enter 10-digit number"
                />
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={editFormData.is_active || false}
                  onChange={(e) => setEditFormData(prev => ({ ...prev, is_active: e.target.checked }))}
                  className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">Active</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={editFormData.is_blocked || false}
                  onChange={(e) => setEditFormData(prev => ({ ...prev, is_blocked: e.target.checked }))}
                  className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">Blocked</span>
              </label>
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => {
                  setIsEditModalOpen(false);
                  setSelectedUser(null);
                  setEditFormData({});
                }}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleEditSubmit}
                className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700"
              >
                Save Changes
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedUser(null);
        }}
        title="Delete User"
      >
        {selectedUser && (
          <div className="space-y-4">
            <p className="text-gray-600">
              Are you sure you want to delete {selectedUser.full_name}? This action cannot be undone.
            </p>
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setSelectedUser(null);
                }}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-4 py-2 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Block Modal */}
      <Modal
        isOpen={isBlockModalOpen}
        onClose={() => {
          setIsBlockModalOpen(false);
          setSelectedUser(null);
        }}
        title={selectedUser?.is_blocked ? "Unblock User" : "Block User"}
      >
        {selectedUser && (
          <div className="space-y-4">
            <p className="text-gray-600">
              {selectedUser.is_blocked
                ? `Are you sure you want to unblock ${selectedUser.full_name}?`
                : `Are you sure you want to block ${selectedUser.full_name}? This will prevent them from accessing the platform.`}
            </p>
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => {
                  setIsBlockModalOpen(false);
                  setSelectedUser(null);
                }}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleBlockConfirm}
                className={`px-4 py-2 rounded-md text-sm font-medium ${
                  selectedUser.is_blocked
                    ? 'bg-green-600 text-white hover:bg-green-700'
                    : 'bg-red-600 text-white hover:bg-red-700'
                }`}
              >
                {selectedUser.is_blocked ? 'Unblock' : 'Block'}
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Notifications */}
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