import React, { useState, useEffect } from 'react';
import { Search, Filter, ArrowUpRight, TrendingUp, TrendingDown, DollarSign, Building2, Calendar, MoreHorizontal, X, ChevronsLeft, ChevronsRight, ChevronLeft, ChevronRight, Clock, CheckCircle, AlertCircle, CreditCard, Eye } from 'lucide-react';
import { GetAllDues } from '@/service/admin/dueManagementService';
import * as XLSX from 'xlsx';

// Modal component with Apple-style design
const Modal = ({ isOpen, onClose, title, children, size = 'md' }: { isOpen: boolean; onClose: () => void; title: string; children: React.ReactNode; size?: 'sm' | 'md' | 'lg' }) => {
  if (!isOpen) return null;
  const sizeClasses: { sm: string; md: string; lg: string } = {
    sm: 'max-w-md',
    md: 'max-w-2xl',
    lg: 'max-w-4xl',
  };
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity bg-black/30 backdrop-blur-md" onClick={onClose}></div>
        <div className={`inline-block w-full ${sizeClasses[size || 'md']} p-0 my-8 overflow-hidden text-left align-middle transition-all transform bg-white/95 backdrop-blur-xl shadow-2xl rounded-3xl border border-white/20`}>
          <div className="flex items-center justify-between p-6 border-b border-gray-100">
            <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-all duration-200 group" aria-label="Close modal">
              <X className="w-5 h-5 text-gray-500 group-hover:text-gray-700" />
            </button>
          </div>
          <div className="p-6">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

// Pagination component with cleaner Apple styling
const Pagination = ({ currentPage, totalPages, onPageChange, totalItems, itemsPerPage }: { currentPage: number; totalPages: number; onPageChange: (page: number) => void; totalItems: number; itemsPerPage: number }) => {
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      const start = Math.max(1, currentPage - 2);
      const end = Math.min(totalPages, start + maxVisiblePages - 1);
      for (let i = start; i <= end; i++) pages.push(i);
    }
    return pages;
  };
  if (totalPages <= 1) return null;
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 pt-6 border-t border-gray-200">
      <div className="text-sm text-gray-600 font-medium">
        Showing {startItem}–{endItem} of {totalItems}
      </div>
      <div className="flex items-center gap-1 mx-2">
        <button onClick={() => onPageChange(1)} disabled={currentPage === 1} className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200" title="First page"><ChevronsLeft className="w-4 h-4" /></button>
        <button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1} className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200" title="Previous page"><ChevronLeft className="w-4 h-4" /></button>
        <div className="flex items-center gap-1 mx-2">
          {getPageNumbers().map((page) => (
            <button key={page} onClick={() => onPageChange(page)} className={`min-w-[40px] h-10 rounded-xl font-medium transition-all duration-200 ${currentPage === page ? 'bg-blue-600 text-white shadow-lg' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>{page}</button>
          ))}
        </div>
        <button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages} className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200" title="Next page"><ChevronRight className="w-4 h-4" /></button>
        <button onClick={() => onPageChange(totalPages)} disabled={currentPage === totalPages} className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200" title="Last page"><ChevronsRight className="w-4 h-4" /></button>
      </div>
    </div>
  );
};

// Booking type
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

// PaymentRecord type
type PaymentRecord = {
  transactionId: string;
  bookingId: string;
  paymentDate: string;
  amount: number;
  currency: string;
  paymentStatus: 'COMPLETED' | 'PENDING' | 'FAILED' | 'REFUNDED';
  paymentMethod: 'CARD' | 'UPI' | 'NET_BANKING' | 'WALLET' | 'CASH';
  serviceType: 'VIDEO_CALL' | 'PHYSICAL_VISIT';
  patientName: string;
  patientEmail: string;
  patientMobile: string;
  clinicName: string;
  clinicId: string;
  serviceName: string;
  sessionDuration: number;
  doctorName: string;
  bookingDate: string;
  processingFee: number;
  platformFee: number;
  netAmount: number;
  refundAmount?: number;
  refundDate?: string;
  gatewayTransactionId: string;
  paymentGateway: 'RAZORPAY' | 'STRIPE' | 'PAYU' | 'CASHFREE';
  remarks?: string;
};

// Clinic type matching API response
type Clinic = {
  clinic_detail: {
    uuid: string;
    created_by: string;
    name: string;
    address: string;
    pincode: number;
    landmark: string | null;
    map_link: string;
    coordinates: string;
    is_active: boolean;
    status: string;
    city: string;
    images: string | null;
    email: string | null;
    gst_no: string | null;
    registration_certificate: string | null;
    about_clinic: string | null;
    reason_for_rejection: string | null;
    founded_on: string | null;
    languages: string[];
    contact_number: string;
    country_code: string;
    user: string;
    total_bookings_completed: number;
  };
  due_detail: {
    total_dues: number;
    total_paid: number;
    remaining_dues: number;
  };
};

// Sample bookings data
const sampleBookings: Booking[] = [
  // ... (keep your existing sample bookings data)
];

const samplePaymentRecords: PaymentRecord[] = [
  // ... (keep your existing sample payment records data)
];

const DueManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [animateCards, setAnimateCards] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedClinic, setSelectedClinic] = useState<Clinic | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;
  const [dueTypeFilter, setDueTypeFilter] = useState('ALL');
  const [activeTab, setActiveTab] = useState('DUES');
  const [sortBy, setSortBy] = useState<'default' | 'highest' | 'lowest'>('default');
  const [modalBookingFilter, setModalBookingFilter] = useState<'ALL' | 'SERVICE' | 'SESSION'>('ALL');
  const [duesData, setDuesData] = useState<Clinic[]>([]);
  const [notification, setNotification] = useState<{
    type: 'success' | 'error' | 'warning';
    message: string;
  } | null>(null);

  const fetchDuesData = async () => {
    try {
      const response = await GetAllDues();
      setDuesData(response);
    } catch (error) {
      console.error("Error fetching dues data:", error);
      setNotification({
        type: 'error',
        message: 'Failed to fetch dues data'
      });
    }
  };

  useEffect(() => {
    fetchDuesData();
    setTimeout(() => setAnimateCards(true), 100);
  }, []);
  console.log(duesData ,"due data ")

  // Calculate totals
  const totalDues = duesData?.reduce((sum, clinic) => sum + clinic.due_detail.total_dues, 0);
  const totalPaid = duesData?.reduce((sum, clinic) => sum + clinic.due_detail.total_paid, 0);
  const totalRemaining = duesData?.reduce((sum, clinic) => sum + clinic.due_detail.remaining_dues, 0);

  // Filter and search logic
  const filteredClinics = duesData?.filter(clinic => {
    const matchesSearch = clinic.clinic_detail.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (selectedFilter === 'all') return matchesSearch;
    if (selectedFilter === 'outstanding') return matchesSearch && clinic.due_detail.remaining_dues > 0;
    if (selectedFilter === 'paid') return matchesSearch && clinic.due_detail.remaining_dues === 0 && clinic.due_detail.total_paid > 0;
    if (selectedFilter === 'credit') return matchesSearch && clinic.due_detail.remaining_dues < 0;
    
    return matchesSearch;
  });

  // Sorting logic for clinics
  const sortedClinics = (() => {
    if (sortBy === 'highest') {
      return [...filteredClinics].sort((a, b) => b.due_detail.remaining_dues - a.due_detail.remaining_dues);
    } else if (sortBy === 'lowest') {
      return [...filteredClinics].sort((a, b) => a.due_detail.remaining_dues - b.due_detail.remaining_dues);
    }
    return filteredClinics;
  })();

  // Pagination logic
  const totalPages = Math.ceil(sortedClinics?.length / itemsPerPage);
  const paginatedClinics = sortedClinics.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const getStatusInfo = (remaining: number) => {
    if (remaining > 0) return { 
      text: 'Outstanding', 
      color: 'bg-red-50 text-red-700 border-red-200',
      icon: <AlertCircle className="w-3 h-3" />
    };
    if (remaining < 0) return { 
      text: 'Credit', 
      color: 'bg-green-50 text-green-700 border-green-200',
      icon: <CheckCircle className="w-3 h-3" />
    };
    return { 
      text: 'Settled', 
      color: 'bg-gray-50 text-gray-600 border-gray-200',
      icon: <CheckCircle className="w-3 h-3" />
    };
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(Math.abs(amount));
  };

  const handleViewDetails = (clinic: Clinic) => {
    if (clinic.due_detail.remaining_dues > 0) {
      setDueTypeFilter('SERVICE');
    } else if (clinic.due_detail.remaining_dues < 0) {
      setDueTypeFilter('CREDIT');
    } else {
      setDueTypeFilter('ALL');
    }
    setSelectedClinic(clinic);
    setViewModalOpen(true);
  };

  const handleCloseModal = () => {
    setViewModalOpen(false);
    setSelectedClinic(null);
  };

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Find clinics with overdue payments
  const now = new Date();
  const overdueClinics = duesData.filter(clinic => {
    const bookings = sampleBookings.filter(b => b.clinic_id === clinic.clinic_detail.uuid && b.payment_status === 'PENDING');
    return bookings.some(b => {
      const bookingDate = new Date(b.start_time);
      const diffDays = (now.getTime() - bookingDate.getTime()) / (1000 * 60 * 60 * 24);
      return diffDays > 7;
    });
  });

  const clinicIds = duesData.map(c => c.clinic_detail.uuid);
  const filteredPaymentRecords = samplePaymentRecords.filter(r => clinicIds.includes(r.clinicId));

  // Helper to get bookings for a clinic (with modal filter)
  const getClinicBookings = (clinicId: string) => {
    let filtered = sampleBookings.filter(b => b.clinic_id === clinicId);
    if (modalBookingFilter === 'SERVICE') filtered = filtered.filter(b => b.session_type !== 'SESSION');
    if (modalBookingFilter === 'SESSION') filtered = filtered.filter(b => b.session_type === 'SESSION');
    return filtered;
  };

  const handleExport = () => {
  try {
    // Create a new workbook
    const wb = XLSX.utils.book_new();

    // 1. Export Dues Management data
    const duesData = sortedClinics.map(clinic => ({
      'Clinic Name': clinic.clinic_detail.name,
      'City': clinic.clinic_detail.city,
      'Contact': `+${clinic.clinic_detail.country_code} ${clinic.clinic_detail.contact_number}`,
      'Total Dues': clinic.due_detail.total_dues,
      'Total Paid': clinic.due_detail.total_paid,
      'Remaining Dues': clinic.due_detail.remaining_dues,
      'Status': clinic.due_detail.remaining_dues > 0 ? 'Outstanding' : 
               clinic.due_detail.remaining_dues < 0 ? 'Credit' : 'Settled'
    }));
    const duesWS = XLSX.utils.json_to_sheet(duesData);
    XLSX.utils.book_append_sheet(wb, duesWS, "Dues Management");

    // 2. Export Payment History data (if activeTab is PAYMENT_HISTORY)
    if (activeTab === 'PAYMENT_HISTORY') {
      const paymentData = filteredPaymentRecords.map(record => ({
        'Transaction ID': record.transactionId,
        'Payment Date': new Date(record.paymentDate).toLocaleDateString(),
        'Amount': record.amount,
        'Status': record.paymentStatus,
        'Method': record.paymentMethod,
        'Patient': record.patientName,
        'Clinic': record.clinicName,
        'Service': record.serviceName
      }));
      const paymentWS = XLSX.utils.json_to_sheet(paymentData);
      XLSX.utils.book_append_sheet(wb, paymentWS, "Payment History");
    }

    // Generate Excel file and trigger download
    const date = new Date().toISOString().split('T')[0];
    XLSX.writeFile(wb, `Due_Management_Report_${date}.xlsx`);

    setNotification({
      type: 'success',
      message: 'Report exported successfully'
    });
  } catch (error) {
    console.error('Export error:', error);
    setNotification({
      type: 'error',
      message: 'Failed to export report'
    });
  }
};
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-2xl border-b border-gray-200/50 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Due Management
              </h1>
              <p className="text-gray-600 font-medium">Monitor clinic payments and outstanding dues</p>
            </div>
            
            {/* Tab Navigation */}
            <div className="flex items-center bg-gray-100 rounded-2xl p-1">
              <button 
                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                  activeTab === 'DUES' 
                    ? 'bg-white text-blue-600 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-800'
                }`} 
                onClick={() => setActiveTab('DUES')}
              >
                Dues Management
              </button>
              <button 
                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                  activeTab === 'PAYMENT_HISTORY' 
                    ? 'bg-white text-blue-600 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-800'
                }`} 
                onClick={() => setActiveTab('PAYMENT_HISTORY')}
              >
                Payment History
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {activeTab === 'DUES' && (
          <>
            {/* Overdue Alert */}
            {overdueClinics.length > 0 && (
              <div className="mb-8 p-6 bg-red-50 border border-red-200 rounded-2xl">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-red-100 rounded-xl">
                    <Clock className="w-5 h-5 text-red-600" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-red-800">Overdue Payments</h2>
                    <p className="text-red-600 text-sm">{overdueClinics.length} clinic(s) have payments pending for more than a week</p>
                  </div>
                </div>
                <div className="grid gap-3">
                  {overdueClinics.slice(0, 3).map(clinic => (
                    <div key={clinic.clinic_detail.uuid} className="p-4 bg-white rounded-xl border border-red-100">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-semibold text-gray-900">{clinic.clinic_detail.name}</div>
                          <div className="text-sm text-red-600">Outstanding: {formatCurrency(clinic.due_detail.remaining_dues)}</div>
                        </div>
                        <button 
                          onClick={() => handleViewDetails(clinic)}
                          className="px-4 py-2 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 transition-colors duration-200"
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className={`bg-white rounded-2xl p-6 border border-gray-200 shadow-sm transform transition-all duration-700 ${animateCards ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-blue-50 rounded-xl">
                    <DollarSign className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalDues)}</p>
                    <p className="text-blue-600 font-medium text-sm">Total Dues</p>
                  </div>
                </div>
              </div>

              <div className={`bg-white rounded-2xl p-6 border border-gray-200 shadow-sm transform transition-all duration-700 delay-100 ${animateCards ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-green-50 rounded-xl">
                    <TrendingUp className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalPaid)}</p>
                    <p className="text-green-600 font-medium text-sm">Total Paid</p>
                  </div>
                </div>
              </div>

              <div className={`bg-white rounded-2xl p-6 border border-gray-200 shadow-sm transform transition-all duration-700 delay-200 ${animateCards ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-orange-50 rounded-xl">
                    <TrendingDown className="w-6 h-6 text-orange-600" />
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalRemaining)}</p>
                    <p className="text-orange-600 font-medium text-sm">Outstanding</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Search and Filter */}
            <div className="bg-white rounded-2xl p-6 mb-8 border border-gray-200 shadow-sm">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="relative flex-1 max-w-lg">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search clinics..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                  />
                </div>
                <div className="flex items-center gap-4">
                  <select
                    value={selectedFilter}
                    onChange={(e) => setSelectedFilter(e.target.value)}
                    className="px-4 py-3 bg-gray-50 border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 font-medium"
                  >
                    <option value="all">All Clinics</option>
                    <option value="outstanding">Outstanding</option>
                    <option value="paid">Settled</option>
                    <option value="credit">Credit Balance</option>
                  </select>
                  {/* Sorting dropdown */}
                  <select
                    value={sortBy}
                    onChange={e => setSortBy(e.target.value as any)}
                    className="px-4 py-3 bg-gray-50 border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 font-medium"
                  >
                    <option value="default">Sort: Default</option>
                    <option value="highest">Sort: Highest Due</option>
                    <option value="lowest">Sort: Lowest Due</option>
                  </select>
                  <button 
                   onClick={handleExport}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                    Export Report
                  </button>
                </div>
              </div>
            </div>

            {/* Clinics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {paginatedClinics.map((clinic, index) => {
                const statusInfo = getStatusInfo(clinic.due_detail.remaining_dues);
                const isSelected = selectedClinic && selectedClinic.clinic_detail.uuid === clinic.clinic_detail.uuid && viewModalOpen;
                return (
                  <div
                    key={clinic.clinic_detail.uuid}
                    className={`bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 transform ${animateCards ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'} ${isSelected ? 'ring-2 ring-blue-500' : ''}`}
                    style={{ transitionDelay: `${index * 50}ms` }}
                    onClick={e => {
                      if (selectedClinic && selectedClinic.clinic_detail.uuid === clinic.clinic_detail.uuid && viewModalOpen) {
                        setViewModalOpen(false);
                        setSelectedClinic(null);
                      } else {
                        handleViewDetails(clinic);
                      }
                      e.stopPropagation();
                    }}
                    tabIndex={0}
                    role="button"
                    aria-pressed={!!isSelected}
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex items-center gap-3">
                        <div className="p-3 bg-blue-50 rounded-xl">
                          <Building2 className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 text-lg leading-tight">{clinic.clinic_detail.name}</h3>
                          <p className="text-sm text-gray-500">{clinic.clinic_detail.city}</p>
                        </div>
                      </div>
                      <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border ${statusInfo.color}`}>
                        {statusInfo.icon}
                        {statusInfo.text}
                      </div>
                    </div>

                    {/* Financial Details */}
                    <div className="space-y-4 mb-6">
                      <div className="flex justify-between items-center py-2">
                        <span className="text-gray-600 font-medium">Total Dues</span>
                        <span className="font-semibold text-gray-900">{formatCurrency(clinic.due_detail.total_dues)}</span>
                      </div>
                      
                      <div className="flex justify-between items-center py-2">
                        <span className="text-gray-600 font-medium">Paid</span>
                        <span className="font-semibold text-green-600">{formatCurrency(clinic.due_detail.total_paid)}</span>
                      </div>
                      
                      <div className="border-t border-gray-100 pt-4">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-900 font-semibold">Balance</span>
                          <span className={`font-bold text-lg ${
                            clinic.due_detail.remaining_dues > 0 ? 'text-red-600' : 
                            clinic.due_detail.remaining_dues < 0 ? 'text-green-600' : 'text-gray-600'
                          }`}>
                            {clinic.due_detail.remaining_dues < 0 ? '−' : ''}{formatCurrency(clinic.due_detail.remaining_dues)}
                          </span>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      {clinic.due_detail.total_dues > 0 && (
                        <div className="pt-2">
                          <div className="flex justify-between text-xs text-gray-500 mb-2">
                            <span>Payment Progress</span>
                            <span>{Math.round((clinic.due_detail.total_paid / clinic.due_detail.total_dues) * 100)}%</span>
                          </div>
                          <div className="w-full bg-gray-100 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full transition-all duration-700"
                              style={{ width: `${Math.min((clinic.due_detail.total_paid / clinic.due_detail.total_dues) * 100, 100)}%` }}
                            ></div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <button 
                        className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-4 rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
                        tabIndex={-1}
                        type="button"
                      >
                        <Eye className="w-4 h-4" />
                        <span>View Details</span>
                      </button>
                      {clinic.due_detail.remaining_dues > 0 && (
                        <button className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-4 rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer" tabIndex={-1} type="button">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span>Mark as Paid</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination */}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              totalItems={sortedClinics.length}
              itemsPerPage={itemsPerPage}
            />
          </>
        )}
      </div>

      {/* Clinic Details Modal */}
      <Modal isOpen={viewModalOpen} onClose={handleCloseModal} title={selectedClinic?.clinic_detail.name || 'Clinic Details'} size="lg">
        {selectedClinic && (
          <div className="space-y-6">
            {/* Clinic Info Section */}
            <div className="bg-white/90 border border-gray-100 rounded-2xl p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <Building2 className="w-5 h-5 text-blue-500" />
                <span className="font-semibold text-gray-900 text-lg">Clinic Information</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Address</p>
                  <p className="font-medium">{selectedClinic.clinic_detail.address}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Contact</p>
                  <p className="font-medium">+{selectedClinic.clinic_detail.country_code} {selectedClinic.clinic_detail.contact_number}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">City</p>
                  <p className="font-medium">{selectedClinic.clinic_detail.city}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Pincode</p>
                  <p className="font-medium">{selectedClinic.clinic_detail.pincode}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <p className="font-medium capitalize">{selectedClinic.clinic_detail.status.toLowerCase()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Bookings</p>
                  <p className="font-medium">{selectedClinic.clinic_detail.total_bookings_completed}</p>
                </div>
              </div>
            </div>

            {/* Financial Summary Section */}
            <div className="bg-white/90 border border-gray-100 rounded-2xl p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <DollarSign className="w-5 h-5 text-blue-500" />
                <span className="font-semibold text-gray-900 text-lg">Financial Summary</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-blue-50 rounded-xl p-4 flex flex-col items-center">
                  <div className="text-gray-600 text-xs mb-1">Total Dues</div>
                  <div className="font-bold text-lg text-blue-700">{formatCurrency(selectedClinic.due_detail.total_dues)}</div>
                </div>
                <div className="bg-green-50 rounded-xl p-4 flex flex-col items-center">
                  <div className="text-gray-600 text-xs mb-1">Total Paid</div>
                  <div className="font-bold text-lg text-green-700">{formatCurrency(selectedClinic.due_detail.total_paid)}</div>
                </div>
                <div className="bg-orange-50 rounded-xl p-4 flex flex-col items-center">
                  <div className="text-gray-600 text-xs mb-1">Remaining Dues</div>
                  <div className={`font-bold text-lg ${selectedClinic.due_detail.remaining_dues > 0 ? 'text-red-600' : selectedClinic.due_detail.remaining_dues < 0 ? 'text-green-600' : 'text-gray-600'}`}>
                    {selectedClinic.due_detail.remaining_dues < 0 ? '-' : ''}{formatCurrency(selectedClinic.due_detail.remaining_dues)}
                  </div>
                </div>
              </div>
            </div>

            {/* Bookings Section */}
            <div className="bg-white/90 border border-gray-100 rounded-2xl p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <Calendar className="w-5 h-5 text-purple-500" />
                <span className="font-semibold text-gray-900 text-lg">Bookings</span>
                <select
                  value={modalBookingFilter}
                  onChange={e => setModalBookingFilter(e.target.value as any)}
                  className="ml-auto px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-medium"
                >
                  <option value="ALL">All</option>
                  <option value="SERVICE">Service</option>
                  <option value="SESSION">Session</option>
                </select>
              </div>
              <div className="border-t border-dashed border-gray-200 my-2"></div>
              {getClinicBookings(selectedClinic.clinic_detail.uuid).length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm border rounded-xl bg-white">
                    <thead>
                      <tr className="bg-gray-50 text-gray-700">
                        <th className="p-3 text-left font-semibold">Patient</th>
                        <th className="p-3 text-left font-semibold">Service</th>
                        <th className="p-3 text-left font-semibold">Session</th>
                        <th className="p-3 text-left font-semibold">Date</th>
                        <th className="p-3 text-left font-semibold">Status</th>
                        <th className="p-3 text-left font-semibold">Amount</th>
                        <th className="p-3 text-left font-semibold">Due</th>
                      </tr>
                    </thead>
                    <tbody>
                      {getClinicBookings(selectedClinic.clinic_detail.uuid).map(b => (
                        <tr key={b.uuid} className="border-t hover:bg-blue-50/40 transition">
                          <td className="p-3 font-medium text-gray-900">{b.patient_name}</td>
                          <td className="p-3">{b.service_type}</td>
                          <td className="p-3">{b.session_type}</td>
                          <td className="p-3">{new Date(b.start_time).toLocaleDateString()}</td>
                          <td className="p-3">
                            {b.payment_status === 'PENDING' ? (
                              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-red-100 text-red-700 text-xs font-semibold">Due</span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold">Paid</span>
                            )}
                          </td>
                          <td className="p-3">{formatCurrency(Number(b.booking_charge))}</td>
                          <td className="p-3">
                            {b.payment_status === 'PENDING' ? (
                              <AlertCircle className="w-4 h-4 text-red-500 inline" />
                            ) : (
                              <CheckCircle className="w-4 h-4 text-green-500 inline" />
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-gray-500 text-sm py-4">No bookings found for this clinic.</div>
              )}
            </div>

            {/* Payment History Section */}
            <div className="bg-white/90 border border-gray-100 rounded-2xl p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <CreditCard className="w-5 h-5 text-teal-500" />
                <span className="font-semibold text-gray-900 text-lg">Payment History</span>
              </div>
              <div className="border-t border-dashed border-gray-200 my-2"></div>
              {samplePaymentRecords.filter(r => r.clinicId === selectedClinic.clinic_detail.uuid).length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm border rounded-xl bg-white">
                    <thead>
                      <tr className="bg-gray-50 text-gray-700">
                        <th className="p-3 text-left font-semibold">Payment Date</th>
                        <th className="p-3 text-left font-semibold">Amount</th>
                        <th className="p-3 text-left font-semibold">Status</th>
                        <th className="p-3 text-left font-semibold">Transaction ID</th>
                        <th className="p-3 text-left font-semibold">Payment Method</th>
                        <th className="p-3 text-left font-semibold">Gateway</th>
                      </tr>
                    </thead>
                    <tbody>
                      {samplePaymentRecords.filter(r => r.clinicId === selectedClinic.clinic_detail.uuid).map(r => (
                        <tr key={r.transactionId} className="border-t hover:bg-teal-50/40 transition">
                          <td className="p-3">{new Date(r.paymentDate).toLocaleDateString()}</td>
                          <td className="p-3">{formatCurrency(r.amount)}</td>
                          <td className="p-3">
                            {r.paymentStatus === 'COMPLETED' ? (
                              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold">Completed</span>
                            ) : r.paymentStatus === 'PENDING' ? (
                              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-yellow-100 text-yellow-700 text-xs font-semibold">Pending</span>
                            ) : r.paymentStatus === 'FAILED' ? (
                              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-red-100 text-red-700 text-xs font-semibold">Failed</span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-gray-100 text-gray-700 text-xs font-semibold">Refunded</span>
                            )}
                          </td>
                          <td className="p-3">{r.transactionId}</td>
                          <td className="p-3">{r.paymentMethod}</td>
                          <td className="p-3">{r.paymentGateway}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-gray-500 text-sm py-4">No payment records found for this clinic.</div>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default DueManagement;