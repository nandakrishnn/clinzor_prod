import React, { useState, useEffect } from 'react';
import { 
  UserX, 
  Search, 
  Filter, 
  MoreVertical, 
  Eye, 
  UserCheck, 
  Mail, 
  Phone, 
  Calendar, 
  Download, 
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
  AlertTriangle,
  Ban,
  Unlock
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
  blocked_at: string;
  blocked_by: string;
  blocked_reason: string;
  last_login: string | null;
  created_by: string | null;
  created_at: string;
  profile_image: string;
}

interface RoleBadgeProps {
  role: User['role'];
}

interface BlockedUserCardProps {
  user: User;
  onView: (user: User) => void;
  onUnblock: (user: User) => void;
}

interface BlockedUserRowProps extends BlockedUserCardProps {}

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

// Mock data for blocked users
const generateMockBlockedUsers = (): User[] => {
  const roles: User['role'][] = ['CUSTOMER', 'EXPERT', 'CLINIC_ADMIN', 'SUPER_ADMIN'];
  const countries = ['91', '1', '44', '61', '49'];
  const names = [
    'Gaurav Sahu', 'Priya Sharma', 'Rajesh Kumar', 'Anita Nair', 'Mohammed Ali',
    'Lakshmi Pillai', 'Arjun Menon', 'Meera Joseph', 'Suresh Nair', 'Ravi Kumar',
    'Deepika Singh', 'Vikram Reddy', 'Sonia Gupta', 'Amit Patel', 'Kavya Iyer',
    'Rohit Joshi', 'Sneha Desai', 'Kiran Rao', 'Pooja Agarwal', 'Nikhil Varma'
  ];

  const blockReasons = [
    'Violation of terms of service',
    'Inappropriate behavior',
    'Spam activity',
    'Security breach',
    'Multiple policy violations',
    'Fraudulent activity',
    'Harassment reported',
    'Account compromise suspected'
  ];

  const blockedBy = ['admin', 'system', 'moderator', 'security_team'];
  
  return Array.from({ length: 45 }, (_, index) => ({
    uuid: `blocked-user-${index + 1}-${Math.random().toString(36).substr(2, 9)}`,
    email: `blocked${index + 1}@example.com`,
    full_name: names[index % names.length],
    phone_number: `${Math.floor(Math.random() * 9000000000) + 1000000000}`,
    country_code: countries[Math.floor(Math.random() * countries.length)],
    role: roles[Math.floor(Math.random() * roles.length)],
    is_active: false,
    is_staff: Math.random() > 0.8,
    is_superuser: Math.random() > 0.95,
    is_blocked: true,
    blocked_at: new Date(Date.now() - Math.random() * 60 * 24 * 60 * 60 * 1000).toISOString(),
    blocked_by: blockedBy[Math.floor(Math.random() * blockedBy.length)],
    blocked_reason: blockReasons[Math.floor(Math.random() * blockReasons.length)],
    last_login: Math.random() > 0.3 ? new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString() : null,
    created_by: Math.random() > 0.5 ? 'system' : null,
    created_at: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
    profile_image: `https://images.unsplash.com/photo-${1500000000000 + index}?auto=format&fit=crop&w=64&h=64&q=80`
  }));
};

const RoleBadge = ({ role }: RoleBadgeProps) => {
  const roleConfig = {
    CUSTOMER: { color: 'bg-blue-100 text-blue-700', text: 'Customer' },
    EXPERT: { color: 'bg-green-100 text-green-700', text: 'Expert' },
    CLINIC_ADMIN: { color: 'bg-orange-100 text-orange-700', text: 'Clinic Admin' },
    SUPER_ADMIN: { color: 'bg-purple-100 text-purple-700', text: 'Super Admin' }
  } as const;
  
  const config = roleConfig[role] || { color: 'bg-gray-100 text-gray-700', text: role };
  
  return (
    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
      {config.text}
    </span>
  );
};

const BlockedUserCard = ({ user, onView, onUnblock }: BlockedUserCardProps) => (
  <motion.div 
    className="bg-white p-6 rounded-xl shadow-sm border border-red-200 hover:shadow-md transition-all duration-200"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    whileHover={{ y: -2 }}
  >
    <div className="flex items-start justify-between mb-4">
      <div className="flex items-center">
        <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center text-white font-semibold text-lg mr-4">
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
      
      <div className="flex items-center gap-2">
        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
          <Ban size={10} />
          Blocked
        </span>
      </div>
    </div>
    
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-600">Role:</span>
        <RoleBadge role={user.role} />
      </div>
      
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-600">Blocked Date:</span>
        <span className="text-sm text-gray-900">
          {new Date(user.blocked_at).toLocaleDateString()}
        </span>
      </div>
      
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-600">Blocked By:</span>
        <span className="text-sm text-gray-900 capitalize">{user.blocked_by}</span>
      </div>
      
      <div className="flex items-start justify-between">
        <span className="text-sm text-gray-600">Reason:</span>
        <span className="text-sm text-gray-900 text-right max-w-[200px]">
          {user.blocked_reason}
        </span>
      </div>
      
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-600">Last Login:</span>
        <span className="text-sm text-gray-900">
          {user.last_login ? new Date(user.last_login).toLocaleDateString() : 'Never'}
        </span>
      </div>
    </div>
    
    <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100">
      <button 
        onClick={() => onView(user)}
        className="flex-1 py-2 px-3 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium"
      >
        View Details
      </button>
      <button 
        onClick={() => onUnblock(user)}
        className="flex-1 py-2 px-3 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors text-sm font-medium"
      >
        Unblock User
      </button>
    </div>
  </motion.div>
);

const BlockedUserRow = ({ user, onView, onUnblock }: BlockedUserRowProps) => (
  <motion.tr 
    className="hover:bg-red-50 transition-colors"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    whileHover={{ backgroundColor: 'rgb(254, 242, 242)' }}
  >
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="flex items-center">
        <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center text-white font-semibold text-sm mr-3">
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
      <RoleBadge role={user.role} />
    </td>
    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
      {new Date(user.blocked_at).toLocaleDateString()}
    </td>
    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
      {user.blocked_by}
    </td>
    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 max-w-[200px] truncate">
      {user.blocked_reason}
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
          onClick={() => onUnblock(user)}
          className="text-green-600 hover:text-green-900 p-1 hover:bg-green-50 rounded transition-all"
        >
          <Unlock size={16} />
        </button>
      </div>
    </td>
  </motion.tr>
);

export default function BlockedUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState<User['role'] | 'ALL'>('ALL');
  const [dateFilter, setDateFilter] = useState('ALL');
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const [sortBy, setSortBy] = useState<keyof User>('blocked_at');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  
  // Modal states
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isUnblockModalOpen, setIsUnblockModalOpen] = useState(false);
  
  const [notification, setNotification] = useState<{
    type: 'success' | 'error' | 'warning';
    message: string;
  } | null>(null);
  
  const isMobile = useMedia('(max-width: 640px)');
  
  // Load blocked users on component mount
  useEffect(() => {
    const loadUsers = async () => {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      const mockUsers = generateMockBlockedUsers();
      setUsers(mockUsers);
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
        user.phone_number.includes(searchQuery) ||
        user.blocked_reason.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Role filter
    if (selectedRole !== 'ALL') {
      filtered = filtered.filter(user => user.role === selectedRole);
    }
    
    // Date filter
    if (dateFilter === 'LAST_7_DAYS') {
      const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      filtered = filtered.filter(user => new Date(user.blocked_at) > sevenDaysAgo);
    } else if (dateFilter === 'LAST_30_DAYS') {
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      filtered = filtered.filter(user => new Date(user.blocked_at) > thirtyDaysAgo);
    } else if (dateFilter === 'LAST_90_DAYS') {
      const ninetyDaysAgo = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
      filtered = filtered.filter(user => new Date(user.blocked_at) > ninetyDaysAgo);
    }
    
    // Sort
    filtered.sort((a, b) => {
      const aValue = a[sortBy];
      const bValue = b[sortBy];
      
      if (sortBy === 'created_at' || sortBy === 'blocked_at' || sortBy === 'last_login') {
        const aDate = aValue ? new Date(aValue as string).getTime() : 0;
        const bDate = bValue ? new Date(bValue as string).getTime() : 0;
        return sortOrder === 'asc' ? aDate - bDate : bDate - aDate;
      }
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortOrder === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
      
      return 0;
    });
    
    setFilteredUsers(filtered);
    setCurrentPage(1);
  }, [users, searchQuery, selectedRole, dateFilter, sortBy, sortOrder]);
  
  // Pagination
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedUsers = filteredUsers.slice(startIndex, startIndex + itemsPerPage);
  
  // Action handlers
  const handleView = (user: User) => {
    setSelectedUser(user);
    setIsViewModalOpen(true);
  };
  
  const handleUnblock = (user: User) => {
    setSelectedUser(user);
    setIsUnblockModalOpen(true);
  };

  const handleUnblockConfirm = () => {
    if (selectedUser) {
      setUsers(prev => prev.filter(u => u.uuid !== selectedUser.uuid));
      setIsUnblockModalOpen(false);
      setSelectedUser(null);
      setNotification({
        type: 'success',
        message: 'User unblocked successfully'
      });
    }
  };
  
  const handleExport = () => {
    console.log('Export blocked users');
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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading blocked users...</p>
        </div>
      </div>
    );
  }
  
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
              <UserX className="mr-3 text-red-600" size={32} />
              Blocked Users
            </h1>
            <p className="text-gray-600 mt-1">Manage and review blocked user accounts</p>
          </div>
          
          <div className="flex items-center gap-4 mt-4 md:mt-0">
            <button 
              onClick={handleRefresh}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <RefreshCw size={16} />
              Refresh
            </button>
            <button 
              onClick={handleExport}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Download size={16} />
              Export
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
                <p className="text-sm font-medium text-gray-600">Total Blocked</p>
                <p className="text-2xl font-bold text-gray-900">{users.length}</p>
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
            transition={{ delay: 0.1 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Blocked Today</p>
                <p className="text-2xl font-bold text-gray-900">
                  {users.filter(u => new Date(u.blocked_at) > new Date(Date.now() - 24 * 60 * 60 * 1000)).length}
                </p>
              </div>
              <div className="p-3 bg-orange-100 rounded-lg">
                <Clock size={24} className="text-orange-600" />
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
                <p className="text-sm font-medium text-gray-600">This Week</p>
                <p className="text-2xl font-bold text-gray-900">
                  {users.filter(u => new Date(u.blocked_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length}
                </p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-lg">
                <Calendar size={24} className="text-yellow-600" />
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
                <p className="text-sm font-medium text-gray-600">This Month</p>
                <p className="text-2xl font-bold text-gray-900">
                  {users.filter(u => new Date(u.blocked_at) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)).length}
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <AlertCircle size={24} className="text-purple-600" />
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
                placeholder="Search by name, email, phone, or block reason..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
            
            {/* Role Filter */}
            <div className="relative">
              <select
                value={selectedRole}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedRole(e.target.value as User['role'] | 'ALL')}
                className="appearance-none bg-white border border-gray-200 rounded-lg px-4 py-3 pr-8 focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <option value="ALL">All Roles</option>
                <option value="CUSTOMER">Customer</option>
                <option value="EXPERT">Expert</option>
                <option value="CLINIC_ADMIN">Clinic Admin</option>
                <option value="SUPER_ADMIN">Super Admin</option>
              </select>
              <ChevronDown size={16} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
            
            {/* Date Filter */}
            <div className="relative">
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="appearance-none bg-white border border-gray-200 rounded-lg px-4 py-3 pr-8 focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <option value="ALL">All Time</option>
                <option value="LAST_7_DAYS">Last 7 Days</option>
                <option value="LAST_30_DAYS">Last 30 Days</option>
                <option value="LAST_90_DAYS">Last 90 Days</option>
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
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-600">
            Showing {((currentPage - 1) * itemsPerPage) + 1}-{Math.min(currentPage * itemsPerPage, filteredUsers.length)} of {filteredUsers.length} blocked users
          </p>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as keyof User)}
              className="text-sm bg-white border border-gray-200 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="full_name">Name</option>
              <option value="blocked_at">Date Blocked</option>
              <option value="last_login">Last Login</option>
              <option value="role">Role</option>
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
              <BlockedUserCard
                key={user.uuid}
                user={user}
                onView={handleView}
                onUnblock={handleUnblock}
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
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Blocked Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Blocked By
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Reason
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {paginatedUsers.map((user) => (
                    <BlockedUserRow
                      key={user.uuid}
                      user={user}
                      onView={handleView}
                      onUnblock={handleUnblock}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* Pagination */}
        {Math.ceil(filteredUsers.length / itemsPerPage) > 1 && (
          <motion.div 
            className="flex items-center justify-between bg-white p-4 rounded-xl shadow-sm border border-gray-100"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  currentPage === 1 
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                    : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                }`}
              >
                Previous
              </button>
              <span className="text-sm text-gray-600">
                Page {currentPage} of {Math.ceil(filteredUsers.length / itemsPerPage)}
              </span>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(filteredUsers.length / itemsPerPage)))}
                disabled={currentPage === Math.ceil(filteredUsers.length / itemsPerPage)}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  currentPage === Math.ceil(filteredUsers.length / itemsPerPage)
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
                className="text-sm bg-white border border-gray-200 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <option value={12}>12</option>
                <option value={24}>24</option>
                <option value={48}>48</option>
                <option value={96}>96</option>
              </select>
            </div>
          </motion.div>
        )}

        {/* View Modal */}
        <Modal
          isOpen={isViewModalOpen}
          onClose={() => {
            setIsViewModalOpen(false);
            setSelectedUser(null);
          }}
          title="Blocked User Details"
        >
          {selectedUser && (
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center text-white font-semibold text-xl">
                  {selectedUser.full_name.split(' ').map(n => n[0]).join('').toUpperCase()}
                </div>
                <div>
                  <h4 className="text-lg font-semibold">{selectedUser.full_name}</h4>
                  <p className="text-gray-600">{selectedUser.email}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="font-medium">+{selectedUser.country_code} {selectedUser.phone_number}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Role</p>
                  <RoleBadge role={selectedUser.role} />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Blocked Date</p>
                  <p className="font-medium">{new Date(selectedUser.blocked_at).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Blocked By</p>
                  <p className="font-medium capitalize">{selectedUser.blocked_by}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-gray-500">Block Reason</p>
                  <p className="font-medium">{selectedUser.blocked_reason}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Last Login</p>
                  <p className="font-medium">
                    {selectedUser.last_login 
                      ? new Date(selectedUser.last_login).toLocaleDateString()
                      : 'Never'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Account Created</p>
                  <p className="font-medium">{new Date(selectedUser.created_at).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setIsViewModalOpen(false);
                    setSelectedUser(null);
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    setIsViewModalOpen(false);
                    handleUnblock(selectedUser);
                  }}
                  className="px-4 py-2 bg-green-600 text-white rounded-md text-sm font-medium hover:bg-green-700"
                >
                  Unblock User
                </button>
              </div>
            </div>
          )}
        </Modal>

        {/* Unblock Modal */}
        <Modal
          isOpen={isUnblockModalOpen}
          onClose={() => {
            setIsUnblockModalOpen(false);
            setSelectedUser(null);
          }}
          title="Unblock User"
        >
          {selectedUser && (
            <div className="space-y-4">
              <p className="text-gray-600">
                Are you sure you want to unblock {selectedUser.full_name}? This will restore their access to the platform.
              </p>
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setIsUnblockModalOpen(false);
                    setSelectedUser(null);
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUnblockConfirm}
                  className="px-4 py-2 bg-green-600 text-white rounded-md text-sm font-medium hover:bg-green-700"
                >
                  Unblock User
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
    </div>
  );
}