"use client";

import React, { useState, useEffect, useRef } from 'react';
import { 
  Building2, 
  Search, 
  Filter, 
  MoreVertical, 
  Eye, 
  Edit, 
  Mail, 
  Phone, 
  Calendar, 
  Download, 
  Plus,
  MapPin,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  DollarSign,
  RefreshCw,
  Settings,
  X,
  ChevronDown,
  ExternalLink,
  Globe,
  Building,
  Lock,
  Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { sampleBookings } from '../dues/dueslist';

interface Clinic {
  id: number;
  name: string;
  address: string;
  city: string;
  pincode: string;
  status: 'Approved' | 'Draft' | 'Pending' | 'Rejected';
  paymentStatus: 'Paid' | 'Pending' | 'No Dues' | 'Overdue';
  dueAmount: string;
  hours: string;
  workingDays: string[];
  phone: string;
  email: string;
  isActive: boolean;
  mapLink?: string;
  gpsCoordinates?: string;
  openingTime?: string;
  closingTime?: string;
  submissionDate: string;
  documents: string[];
}

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

type ModernModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  size?: 'sm' | 'lg';
  children: React.ReactNode;
};

const ModernModal = ({ isOpen, onClose, title, size = "lg", children }: ModernModalProps) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className={`bg-white rounded-2xl shadow-2xl ${size === 'lg' ? 'max-w-4xl w-full' : 'max-w-md w-full'} max-h-[90vh] overflow-y-auto`}>
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

type TimePickerProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

const TimePicker = ({ value, onChange, placeholder = "Select time" }: TimePickerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const generateTimeOptions = () => {
    const times = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute of [0, 30]) {
        const time24 = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        const hour12 = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const time12 = `${hour12}:${minute.toString().padStart(2, '0')} ${ampm}`;
        times.push({ value: time24, label: time12 });
      }
    }
    return times;
  };
  const timeOptions = generateTimeOptions();
  const selectedTime = timeOptions.find(t => t.value === value);
  return (
    <div className="relative">
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer hover:border-blue-400 transition-all bg-white"
      >
        <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
        <span className={selectedTime ? "text-gray-900" : "text-gray-400"}>
          {selectedTime ? selectedTime.label : placeholder}
        </span>
      </div>
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-50 max-h-60 overflow-y-auto">
          {timeOptions.map((time) => (
            <div
              key={time.value}
              onClick={() => {
                onChange(time.value);
                setIsOpen(false);
              }}
              className={`px-4 py-2 cursor-pointer hover:bg-blue-50 transition-colors ${
                value === time.value ? 'bg-blue-100 text-blue-800 font-medium' : 'text-gray-700'
              }`}
            >
              {time.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

type InputFieldProps = {
  label: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
  error?: string;
  icon?: React.ElementType;
};

function InputField({ label, type = "text", value, onChange, placeholder, required = false, error, icon: Icon }: InputFieldProps) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        {Icon && <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />}
        <input
          type={type}
          value={value}
          onChange={onChange}
          className={`w-full ${Icon ? 'pl-10' : 'pl-4'} pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
            error ? 'border-red-300 focus:ring-red-500' : 'border-gray-200'
          }`}
          placeholder={placeholder}
          required={required}
        />
      </div>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}

const Notification = ({ type, message, onClose }: NotificationProps) => {
  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-400" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-red-400" />;
      case 'warning':
        return <AlertCircle className="h-5 w-5 text-yellow-400" />;
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

const StatusBadge = ({ status }: { status: Clinic['status'] }) => {
  const statusConfig = {
    Approved: { color: 'bg-green-100 text-green-700', icon: CheckCircle },
    Draft: { color: 'bg-gray-100 text-gray-700', icon: Edit },
    Pending: { color: 'bg-yellow-100 text-yellow-700', icon: Clock },
    Rejected: { color: 'bg-red-100 text-red-700', icon: XCircle }
  };
  
  const config = statusConfig[status];
  const Icon = config.icon;
  
  return (
    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
      <Icon size={12} className="mr-1" />
      {status}
    </span>
  );
};

const PaymentStatusBadge = ({ status }: { status: Clinic['paymentStatus'] }) => {
  const statusConfig = {
    'Paid': { color: 'bg-green-100 text-green-700' },
    'Pending': { color: 'bg-yellow-100 text-yellow-700' },
    'No Dues': { color: 'bg-blue-100 text-blue-700' },
    'Overdue': { color: 'bg-red-100 text-red-700' }
  };
  
  const config = statusConfig[status];
  
  return (
    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
      {status}
    </span>
  );
};

// Mock data array similar to PendingClinics
const allClinicsMockData: Clinic[] = [
  {
    id: 1,
    name: 'Greater Kailash Hospital',
    address: 'Old Palasia, AB Road, Indore, Madhya Pradesh 452001',
    city: 'Indore',
    pincode: '452001',
    status: 'Approved',
    paymentStatus: 'No Dues',
    dueAmount: '₹0',
    hours: '10:00 AM - 5:00 PM',
    workingDays: ['Mon', 'Wed', 'Fri'],
    phone: '+91 98765 43210',
    email: 'contact@greaterkailash.com',
    isActive: false,
    mapLink: 'https://www.google.com/maps/place/Greater+Kailash+Hospital',
    openingTime: '10:00',
    closingTime: '17:00',
    submissionDate: '2025-06-28',
    documents: ['doc1.pdf', 'doc2.pdf']
  },
  {
    id: 2,
    name: 'Getwell Medical Center',
    address: 'Post Office Rd, Dr. Ambedkar Nagar, Indore',
    city: 'Indore',
    pincode: '453331',
    status: 'Draft',
    paymentStatus: 'No Dues',
    dueAmount: '₹0',
    hours: '10:00 AM - 6:30 PM',
    workingDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Sun'],
    phone: '+91 98765 43211',
    email: 'contact@getwell.com',
    isActive: false,
    openingTime: '10:00',
    closingTime: '18:30',
    submissionDate: '2025-06-27',
    documents: ['doc3.pdf']
  },
  {
    id: 3,
    name: 'Sunshine Healthcare',
    address: 'MG Road, Vijay Nagar, Indore',
    city: 'Indore',
    pincode: '452010',
    status: 'Approved',
    paymentStatus: 'Paid',
    dueAmount: '₹0',
    hours: '9:00 AM - 8:00 PM',
    workingDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    phone: '+91 98765 43212',
    email: 'info@sunshine.com',
    isActive: true,
    openingTime: '09:00',
    closingTime: '20:00',
    submissionDate: '2025-06-26',
    documents: []
  },
  {
    id: 4,
    name: 'City Care Clinic',
    address: 'Palasia Square, Indore',
    city: 'Indore',
    pincode: '452001',
    status: 'Pending',
    paymentStatus: 'Pending',
    dueAmount: '₹2,500',
    hours: '10:00 AM - 7:00 PM',
    workingDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    phone: '+91 98765 43213',
    email: 'admin@citycare.com',
    isActive: false,
    openingTime: '10:00',
    closingTime: '19:00',
    submissionDate: '2025-06-25',
    documents: ['doc4.pdf']
  },
  {
    id: 5,
    name: 'Apollo Clinic',
    address: 'MG Road, Mumbai',
    city: 'Mumbai',
    pincode: '400001',
    status: 'Approved',
    paymentStatus: 'Paid',
    dueAmount: '₹0',
    hours: '8:00 AM - 4:00 PM',
    workingDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    phone: '+91 90000 11111',
    email: 'info@apollomumbai.com',
    isActive: true,
    openingTime: '08:00',
    closingTime: '16:00',
    submissionDate: '2025-06-24',
    documents: []
  },
  {
    id: 6,
    name: 'Fortis Health',
    address: 'Sector 62, Noida',
    city: 'Noida',
    pincode: '201301',
    status: 'Rejected',
    paymentStatus: 'Overdue',
    dueAmount: '₹5,000',
    hours: '9:00 AM - 5:00 PM',
    workingDays: ['Mon', 'Wed', 'Fri'],
    phone: '+91 90000 22222',
    email: 'contact@fortisnoida.com',
    isActive: false,
    openingTime: '09:00',
    closingTime: '17:00',
    submissionDate: '2025-06-23',
    documents: ['doc5.pdf']
  },
  {
    id: 7,
    name: 'Care Plus Clinic',
    address: 'Park Street, Kolkata',
    city: 'Kolkata',
    pincode: '700016',
    status: 'Draft',
    paymentStatus: 'Pending',
    dueAmount: '₹1,200',
    hours: '11:00 AM - 7:00 PM',
    workingDays: ['Tue', 'Thu', 'Sat'],
    phone: '+91 90000 33333',
    email: 'careplus@kolkata.com',
    isActive: false,
    openingTime: '11:00',
    closingTime: '19:00',
    submissionDate: '2025-06-22',
    documents: []
  },
  {
    id: 8,
    name: 'Medicover Hospitals',
    address: 'Banjara Hills, Hyderabad',
    city: 'Hyderabad',
    pincode: '500034',
    status: 'Pending',
    paymentStatus: 'No Dues',
    dueAmount: '₹0',
    hours: '7:00 AM - 3:00 PM',
    workingDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    phone: '+91 90000 44444',
    email: 'info@medicoverhyd.com',
    isActive: false,
    openingTime: '07:00',
    closingTime: '15:00',
    submissionDate: '2025-06-21',
    documents: ['doc6.pdf']
  },
  {
    id: 9,
    name: 'Rainbow Children Hospital',
    address: 'Jayanagar, Bangalore',
    city: 'Bangalore',
    pincode: '560041',
    status: 'Approved',
    paymentStatus: 'Paid',
    dueAmount: '₹0',
    hours: '6:00 AM - 2:00 PM',
    workingDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    phone: '+91 90000 55555',
    email: 'contact@rainbowblr.com',
    isActive: true,
    openingTime: '06:00',
    closingTime: '14:00',
    submissionDate: '2025-06-20',
    documents: []
  },
  {
    id: 10,
    name: 'Aster Clinic',
    address: 'Ernakulam, Kochi',
    city: 'Kochi',
    pincode: '682016',
    status: 'Draft',
    paymentStatus: 'No Dues',
    dueAmount: '₹0',
    hours: '10:00 AM - 6:00 PM',
    workingDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    phone: '+91 90000 66666',
    email: 'aster@kochi.com',
    isActive: false,
    openingTime: '10:00',
    closingTime: '18:00',
    submissionDate: '2025-06-19',
    documents: []
  }
];

export default function ClinicManagement() {
  const router = useRouter();
  const [clinics, setClinics] = useState<Clinic[]>(allClinicsMockData);

  const [filteredClinics, setFilteredClinics] = useState<Clinic[]>(clinics);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<Clinic['status'] | 'ALL'>('ALL');
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState<Clinic['paymentStatus'] | 'ALL'>('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  
  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedClinic, setSelectedClinic] = useState<Clinic | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  
  const [notification, setNotification] = useState<{
    type: 'success' | 'error' | 'warning';
    message: string;
  } | null>(null);

  // Add Clinic Form State
  const [newClinic, setNewClinic] = useState({
    name: '',
    city: '',
    email: '',
    password: '',
    address: '',
    mapLink: '',
    gpsCoordinates: '',
    openingTime: '',
    closingTime: '',
    workingDays: [] as string[]
  });

  // Add state for confirmation modals
  const [confirmModal, setConfirmModal] = useState<{ type: 'active' | 'inactive' | 'delete'; clinic: Clinic | null } | null>(null);

  const workingDayOptions = [
    { value: 'Mon', label: 'Monday' },
    { value: 'Tue', label: 'Tuesday' },
    { value: 'Wed', label: 'Wednesday' },
    { value: 'Thu', label: 'Thursday' },
    { value: 'Fri', label: 'Friday' },
    { value: 'Sat', label: 'Saturday' },
    { value: 'Sun', label: 'Sunday' }
  ];

  const clinicsListRef = useRef<HTMLDivElement>(null);

  const [showDeactivated, setShowDeactivated] = useState(false);

  const [selectedHeader, setSelectedHeader] = useState<'ALL' | 'Approved' | 'Pending' | 'Active' | 'Deactivated'>('Approved');

  // Filter clinics
  useEffect(() => {
    let filtered = [...clinics];
    
    if (searchQuery) {
      filtered = filtered.filter(clinic => 
        clinic.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        clinic.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        clinic.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        clinic.phone.includes(searchQuery)
      );
    }
    
    if (selectedStatus !== 'ALL') {
      filtered = filtered.filter(clinic => clinic.status === selectedStatus);
    }
    
    if (selectedPaymentStatus !== 'ALL') {
      filtered = filtered.filter(clinic => clinic.paymentStatus === selectedPaymentStatus);
    }
    
    setFilteredClinics(filtered);
    setCurrentPage(1);
  }, [clinics, searchQuery, selectedStatus, selectedPaymentStatus]);

  // Filter for header selection
  let clinicsToShow = filteredClinics;
  if (selectedHeader === 'Approved') clinicsToShow = filteredClinics.filter(c => c.status === 'Approved');
  else if (selectedHeader === 'Pending') clinicsToShow = filteredClinics.filter(c => c.status === 'Pending');
  else if (selectedHeader === 'Active') clinicsToShow = filteredClinics.filter(c => c.isActive);
  else if (selectedHeader === 'Deactivated') clinicsToShow = filteredClinics.filter(c => !c.isActive);
  // Pagination
  const totalPages = Math.ceil(clinicsToShow.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  clinicsToShow = clinicsToShow.slice(startIndex, startIndex + itemsPerPage);

  const handleView = (clinic: Clinic) => {
    setSelectedClinic(clinic);
    setIsViewModalOpen(true);
  };

  const handleWorkingDayToggle = (day: string) => {
    setNewClinic(prev => ({
      ...prev,
      workingDays: prev.workingDays.includes(day)
        ? prev.workingDays.filter(d => d !== day)
        : [...prev.workingDays, day]
    }));
  };

  const handleSelectAllDays = () => {
    setNewClinic(prev => ({
      ...prev,
      workingDays: workingDayOptions.map(day => day.value)
    }));
  };

  const handleSelectWeekdays = () => {
    setNewClinic(prev => ({
      ...prev,
      workingDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']
    }));
  };

  const handleClearAllDays = () => {
    setNewClinic(prev => ({
      ...prev,
      workingDays: []
    }));
  };

  const handleAddClinic = () => {
    if (!newClinic.name || !newClinic.city || !newClinic.email || !newClinic.password) {
      setNotification({
        type: 'error',
        message: 'Please fill in all required fields'
      });
      return;
    }

    if (newClinic.workingDays.length === 0) {
      setNotification({
        type: 'error',
        message: 'Please select at least one working day'
      });
      return;
    }

    const openingTime = newClinic.openingTime ? 
      new Date(`2000-01-01T${newClinic.openingTime}`).toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit', 
        hour12: true 
      }) : '';
    
    const closingTime = newClinic.closingTime ? 
      new Date(`2000-01-01T${newClinic.closingTime}`).toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit', 
        hour12: true 
      }) : '';

    const clinic: Clinic = {
      id: Date.now(),
      name: newClinic.name,
      address: newClinic.address || `${newClinic.city}, India`,
      city: newClinic.city,
      pincode: '000000',
      status: 'Draft',
      paymentStatus: 'No Dues',
      dueAmount: '₹0',
      hours: openingTime && closingTime ? `${openingTime} - ${closingTime}` : '',
      workingDays: newClinic.workingDays,
      phone: '+91 00000 00000',
      email: newClinic.email,
      isActive: false,
      mapLink: newClinic.mapLink,
      gpsCoordinates: newClinic.gpsCoordinates,
      openingTime: newClinic.openingTime,
      closingTime: newClinic.closingTime,
      submissionDate: new Date().toISOString().split('T')[0],
      documents: []
    };

    setClinics(prev => [...prev, clinic]);
    setNewClinic({
      name: '',
      city: '',
      email: '',
      password: '',
      address: '',
      mapLink: '',
      gpsCoordinates: '',
      openingTime: '',
      closingTime: '',
      workingDays: []
    });
    setIsAddModalOpen(false);
    setNotification({
      type: 'success',
      message: 'Clinic added successfully'
    });
  };

  const stats = {
    total: clinics.length,
    approved: clinics.filter(c => c.status === 'Approved').length,
    pending: clinics.filter(c => c.status === 'Pending').length,
    active: clinics.filter(c => c.isActive).length,
    deactivated: clinics.filter(c => !c.isActive).length
  };

  function handleApprove(clinic: Clinic) {
    setClinics(prev => prev.map(c => c.id === clinic.id ? { ...c, status: 'Approved' } : c));
    setNotification({ type: 'success', message: `Clinic "${clinic.name}" approved!` });
  }

  function handleReject(clinic: Clinic) {
    setClinics(prev => prev.map(c => c.id === clinic.id ? { ...c, status: 'Rejected' } : c));
    setNotification({ type: 'error', message: `Clinic "${clinic.name}" rejected.` });
  }

  function handleToggleActive(clinic: Clinic) {
    setClinics(prev => prev.map(c => c.id === clinic.id ? { ...c, isActive: !c.isActive } : c));
    setNotification({ type: 'success', message: `Clinic "${clinic.name}" is now ${clinic.isActive ? 'inactive' : 'active'}.` });
  }

  function handleDeleteClinic(clinic: Clinic) {
    setClinics(prev => prev.filter(c => c.id !== clinic.id));
    setNotification({ type: 'success', message: `Clinic "${clinic.name}" deleted.` });
  }

  // Calculate bookings per clinic (by name)
  const getBookingCount = (clinicName: string) => {
    return sampleBookings.filter((b: any) => b.clinic_name === clinicName).length;
  };

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
              <Building2 className="mr-3 text-blue-600" size={32} />
              Clinic Management
            </h1>
            <p className="text-gray-600 mt-1">Manage and monitor clinic registrations</p>
          </div>
          
          <div className="flex items-center gap-4 mt-4 md:mt-0">
            <button 
              onClick={() => window.location.reload()}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <RefreshCw size={16} />
              Refresh
            </button>
            <button 
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus size={16} />
              Add New Clinic
            </button>
          </div>
        </motion.div>
        
        {/* Deactivated Clinics Header/Toggle */}
        <div className="flex items-center gap-4 mb-4">
          <h2 className="text-2xl font-bold text-gray-800">All Clinics</h2>
          <button
            className={`px-4 py-2 rounded-lg font-medium transition ${showDeactivated ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
            onClick={() => setShowDeactivated(!showDeactivated)}
          >
            Deactivated Clinics
          </button>
          {showDeactivated && (
            <button
              className="px-4 py-2 rounded-lg font-medium bg-gray-200 text-gray-700 transition"
              onClick={() => setShowDeactivated(false)}
            >
              Show All
            </button>
          )}
        </div>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 sm:gap-6 mb-8">
          <motion.div 
            className={`bg-white p-6 rounded-xl shadow-lg border border-gray-100 cursor-pointer transition ${selectedHeader === 'ALL' ? 'ring-2 ring-blue-500' : ''}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={() => { setSelectedHeader('ALL'); setSelectedStatus('ALL'); setShowDeactivated(false); }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Clinics</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <Building2 size={24} className="text-blue-600" />
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            className={`bg-white p-6 rounded-xl shadow-lg border border-gray-100 cursor-pointer transition ${selectedHeader === 'Approved' ? 'ring-2 ring-blue-500' : ''}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            onClick={() => { setSelectedHeader('Approved'); setSelectedStatus('ALL'); setShowDeactivated(false); }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Approved</p>
                <p className="text-2xl font-bold text-gray-900">{stats.approved}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <CheckCircle size={24} className="text-green-600" />
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            className={`bg-white p-6 rounded-xl shadow-lg border border-gray-100 cursor-pointer transition ${selectedHeader === 'Pending' ? 'ring-2 ring-blue-500' : ''}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            onClick={() => { router.push('/admin/pending'); }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-lg">
                <Clock size={24} className="text-yellow-600" />
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            className={`bg-white p-6 rounded-xl shadow-lg border border-gray-100 cursor-pointer transition ${selectedHeader === 'Active' ? 'ring-2 ring-blue-500' : ''}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            onClick={() => { setSelectedHeader('Active'); setSelectedStatus('ALL'); setShowDeactivated(false); }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active</p>
                <p className="text-2xl font-bold text-gray-900">{stats.active}</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <CheckCircle size={24} className="text-purple-600" />
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            className={`bg-white p-6 rounded-xl shadow-lg border border-gray-100 cursor-pointer transition ${selectedHeader === 'Deactivated' ? 'ring-2 ring-blue-500' : ''}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            onClick={() => { setSelectedHeader('Deactivated'); setSelectedStatus('ALL'); setShowDeactivated(true); setTimeout(() => { clinicsListRef.current?.scrollIntoView({ behavior: 'smooth' }); }, 100); }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Deactivated</p>
                <p className="text-2xl font-bold text-gray-900">{stats.deactivated}</p>
              </div>
              <div className="p-3 bg-gray-100 rounded-lg">
                <XCircle size={24} className="text-gray-500" />
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
                placeholder="Search by name, city, email, or phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            {/* Status Filter */}
            <div className="relative">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value as Clinic['status'] | 'ALL')}
                className="appearance-none bg-white border border-gray-200 rounded-lg px-4 py-3 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="ALL">All Status</option>
                <option value="Approved">Approved</option>
                <option value="Draft">Draft</option>
                <option value="Pending">Pending</option>
                <option value="Rejected">Rejected</option>
              </select>
              <ChevronDown size={16} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
            
            {/* Payment Status Filter */}
            <div className="relative">
              <select
                value={selectedPaymentStatus}
                onChange={(e) => setSelectedPaymentStatus(e.target.value as Clinic['paymentStatus'] | 'ALL')}
                className="appearance-none bg-white border border-gray-200 rounded-lg px-4 py-3 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="ALL">All Payments</option>
                <option value="Paid">Paid</option>
                <option value="Pending">Pending</option>
                <option value="No Dues">No Dues</option>
                <option value="Overdue">Overdue</option>
              </select>
              <ChevronDown size={16} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </motion.div>

        {/* Results Count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-600">
            Showing {((currentPage - 1) * itemsPerPage) + 1}-{Math.min(currentPage * itemsPerPage, filteredClinics.length)} of {filteredClinics.length} clinics
          </p>
        </div>

        {/* Clinics List - Card Style for All Screens */}
        <div ref={clinicsListRef} className="mb-8 space-y-4">
          {clinicsToShow.map((clinic, index) => (
            <motion.div
              key={clinic.id}
              className="bg-white rounded-xl shadow-xl border border-gray-100 p-6 hover:shadow-2xl transition-shadow cursor-pointer"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => window.location.href = `/admin/allclinics/${clinic.id}`}
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                {/* Clinic Info */}
                <div className="flex-1 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                        {clinic.name}
                        <span className="ml-2 px-2 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-semibold border border-blue-100">
                          {getBookingCount(clinic.name)} Bookings
                        </span>
                      </h3>
                      <p className="text-sm text-gray-600 flex items-center gap-1">
                        <MapPin size={14} />
                        {clinic.address}, {clinic.city} - {clinic.pincode}
                      </p>
                    </div>
                    <StatusBadge status={clinic.status} />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Mail size={14} />
                      <span>{clinic.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Phone size={14} />
                      <span>{clinic.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Clock size={14} />
                      <span>{clinic.hours}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Calendar size={14} />
                      <span>{clinic.workingDays.join(', ')}</span>
                    </div>
                  </div>
                  {clinic.submissionDate && (
                    <div className="text-xs text-gray-500">
                      Submitted on: {new Date(clinic.submissionDate).toLocaleDateString()}
                    </div>
                  )}
                  <div className="flex flex-wrap gap-2 text-xs text-gray-700 mt-2">
                    <PaymentStatusBadge status={clinic.paymentStatus} />
                    {clinic.dueAmount !== '₹0' && <span className="text-rose-600">Due: {clinic.dueAmount}</span>}
                  </div>
                </div>
                {/* Actions */}
                <div className="flex items-center gap-3 flex-wrap mt-4 lg:mt-0">
                  <Link href={`/admin/allclinics/${clinic.id}`} legacyBehavior>
                    <a
                      className="flex items-center gap-2 px-4 py-2 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors font-medium"
                      aria-label="Review details"
                      onClick={e => e.stopPropagation()}
                    >
                      <Eye size={16} />
                      <span className="hidden sm:inline">Review</span>
                    </a>
                  </Link>
                  {clinic.status !== 'Approved' && (
                    <button
                      onClick={() => handleApprove(clinic)}
                      className="flex items-center gap-2 px-4 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors font-medium"
                    >
                      <Check size={16} />
                      <span className="hidden sm:inline">Approve</span>
                    </button>
                  )}
                  {clinic.status !== 'Rejected' && clinic.status !== 'Approved' && (
                    <button
                      onClick={() => handleReject(clinic)}
                      className="flex items-center gap-2 px-4 py-2 text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors font-medium"
                    >
                      <X size={16} />
                      <span className="hidden sm:inline">Reject</span>
                    </button>
                  )}
                  {clinic.isActive ? (
                    <button
                      onClick={() => setConfirmModal({ type: 'inactive', clinic })}
                      className="flex items-center gap-2 px-4 py-2 text-yellow-700 bg-yellow-100 rounded-lg hover:bg-yellow-200 transition-colors font-medium"
                    >
                      <XCircle size={16} />
                      <span className="hidden sm:inline">Deactivate</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => setConfirmModal({ type: 'active', clinic })}
                      className="flex items-center gap-2 px-4 py-2 text-emerald-700 bg-emerald-100 rounded-lg hover:bg-emerald-200 transition-colors font-medium"
                    >
                      <CheckCircle size={16} />
                      <span className="hidden sm:inline">Activate</span>
                    </button>
                  )}
                  <button
                    onClick={() => setConfirmModal({ type: 'delete', clinic })}
                    className="flex items-center gap-2 px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors font-medium"
                  >
                    <X size={16} />
                    <span className="hidden sm:inline">Delete</span>
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
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
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  currentPage === totalPages
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                }`}
              >
                Next
              </button>
            </div>
            <div className="text-sm text-gray-500">
              Showing {((currentPage - 1) * itemsPerPage) + 1}-{Math.min(currentPage * itemsPerPage, filteredClinics.length)} of {filteredClinics.length} clinics
            </div>
          </motion.div>
        )}

        {/* Add Clinic Modal */}
        {isAddModalOpen && (
          <ModernModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Add New Clinic" size="lg">
            <form
              onSubmit={e => {
                e.preventDefault();
                handleAddClinic();
              }}
              className="space-y-6"
            >
              <div className="bg-gray-50 p-4 rounded-xl">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <Building className="w-5 h-5" />
                  Basic Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InputField
                    label="Clinic Name"
                    value={newClinic.name}
                    onChange={e => setNewClinic({ ...newClinic, name: e.target.value })}
                    placeholder="Enter clinic name"
                    required
                    icon={Building}
                  />
                  <InputField
                    label="City"
                    value={newClinic.city}
                    onChange={e => setNewClinic({ ...newClinic, city: e.target.value })}
                    placeholder="Enter city"
                    required
                    icon={MapPin}
                  />
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded-xl">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <Mail className="w-5 h-5" />
                  Contact & Access
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InputField
                    label="Email"
                    type="email"
                    value={newClinic.email}
                    onChange={e => setNewClinic({ ...newClinic, email: e.target.value })}
                    placeholder="Enter clinic email"
                    required
                    icon={Mail}
                  />
                  <InputField
                    label="Temporary Password"
                    type="password"
                    value={newClinic.password}
                    onChange={e => setNewClinic({ ...newClinic, password: e.target.value })}
                    placeholder="Enter temporary password (min 6 chars)"
                    required
                    icon={Lock}
                  />
                </div>
                <span className="text-xs text-gray-500 block mt-2">This email and password will be used as the clinic's login credentials.</span>
              </div>
              <div className="bg-gray-50 p-4 rounded-xl">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Location Details
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Address</label>
                    <textarea
                      value={newClinic.address}
                      onChange={e => setNewClinic({ ...newClinic, address: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      rows={3}
                      placeholder="Enter full address"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputField
                      label="Google Maps Link"
                      type="url"
                      value={newClinic.mapLink}
                      onChange={e => setNewClinic({ ...newClinic, mapLink: e.target.value })}
                      placeholder="https://maps.google.com/..."
                    />
                    <InputField
                      label="Coordinates"
                      value={newClinic.gpsCoordinates}
                      onChange={e => setNewClinic({ ...newClinic, gpsCoordinates: e.target.value })}
                      placeholder="POINT(longitude latitude)"
                    />
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded-xl">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Working Hours
                </h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Opening Time <span className="text-red-500">*</span>
                      </label>
                      <TimePicker
                        value={newClinic.openingTime}
                        onChange={value => setNewClinic({ ...newClinic, openingTime: value })}
                        placeholder="Select opening time"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Closing Time <span className="text-red-500">*</span>
                      </label>
                      <TimePicker
                        value={newClinic.closingTime}
                        onChange={value => setNewClinic({ ...newClinic, closingTime: value })}
                        placeholder="Select closing time"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Working Days <span className="text-red-500">*</span>
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {workingDayOptions.map(day => (
                        <label key={day.value} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={newClinic.workingDays.includes(day.value)}
                            onChange={() => handleWorkingDayToggle(day.value)}
                            className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                          />
                          <span className="text-sm text-gray-700">{day.label}</span>
                        </label>
                      ))}
                    </div>
                    <div className="flex gap-2 mt-2">
                      <button type="button" className="text-xs text-blue-600 underline" onClick={handleSelectAllDays}>All</button>
                      <button type="button" className="text-xs text-blue-600 underline" onClick={handleSelectWeekdays}>Weekdays</button>
                      <button type="button" className="text-xs text-blue-600 underline" onClick={handleClearAllDays}>Clear</button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all font-semibold"
                >
                  Add Clinic
                </button>
              </div>
            </form>
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

        {/* Confirmation Modal */}
        {confirmModal && confirmModal.clinic && (
          <ModernModal
            isOpen={!!confirmModal}
            onClose={() => setConfirmModal(null)}
            title={
              confirmModal.type === 'delete'
                ? 'Delete Clinic'
                : confirmModal.type === 'active'
                ? 'Activate Clinic'
                : 'Deactivate Clinic'
            }
            size="sm"
          >
            <div className="space-y-4">
              <p className="text-gray-700 text-base">
                {confirmModal.type === 'delete' && `Are you sure you want to delete "${confirmModal.clinic.name}"? This action cannot be undone.`}
                {confirmModal.type === 'active' && `Are you sure you want to activate "${confirmModal.clinic.name}"?`}
                {confirmModal.type === 'inactive' && `Are you sure you want to deactivate "${confirmModal.clinic.name}"?`}
              </p>
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  onClick={() => setConfirmModal(null)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-all"
                >Cancel</button>
                {confirmModal.type === 'delete' && (
                  <button
                    onClick={() => { handleDeleteClinic(confirmModal.clinic!); setConfirmModal(null); }}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all"
                  >Delete</button>
                )}
                {confirmModal.type === 'active' && (
                  <button
                    onClick={() => { handleToggleActive(confirmModal.clinic!); setConfirmModal(null); }}
                    className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-all"
                  >Activate</button>
                )}
                {confirmModal.type === 'inactive' && (
                  <button
                    onClick={() => { handleToggleActive(confirmModal.clinic!); setConfirmModal(null); }}
                    className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-all"
                  >Deactivate</button>
                )}
              </div>
            </div>
          </ModernModal>
        )}
      </div>
    </div>
  );
}
