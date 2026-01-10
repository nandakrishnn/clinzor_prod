import React, { useState, useEffect } from 'react';
import { Search, Filter, ArrowUpRight, TrendingUp, TrendingDown, DollarSign, Building2, Calendar, MoreHorizontal, X, ChevronsLeft, ChevronsRight, ChevronLeft, ChevronRight, Clock, CheckCircle, AlertCircle, CreditCard, Eye, IndianRupeeIcon } from 'lucide-react';
import { getAdminDueStaticData, GetAllDues, GetAllPayment, markDueAmount, UpdateDueAmount } from '@/service/admin/dueManagementService';

import * as XLSX from 'xlsx';
import LoadingSkeleton from '@/components/common/LoadingSkeleton';
import PaymentPopup from './PaymentPopup';
import { isNull } from 'util';

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
            <h3 className="text-xl font-semibold text-gray-900 capitalize">{title}</h3>
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
        <button
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200"
          title="First page"
        >
          <ChevronsLeft className="w-4 h-4" />
        </button>
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200"
          title="Previous page"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <div className="flex items-center gap-1 mx-2">
          {getPageNumbers().map((page) => (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`min-w-[40px] h-10 rounded-xl font-medium transition-all duration-200 ${currentPage === page
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
            >
              {page}
            </button>
          ))}
        </div>
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200"
          title="Next page"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
        <button
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
          className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200"
          title="Last page"
        >
          <ChevronsRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

// PaymentRecord type
type PaymentRecord = {
  uuid: string;
  booking: string;
  expert_booking: string | null;
  clinic: string;
  user: string;
  created_by: string | null;
  amount: string;
  currency: string;
  transaction_id: string;
  notes: string | null;
  status: string;
  payment_type: string;
  payment_id: string;
  patient_name: string;
  service_name: string;
  clinic_service_name: string | null;
  clinic_name: string;
  created_at?: string;
  updated_at?: string;
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

interface PaginationData {
  current_page: number;
  total_pages: number;
  total_items: number;
  next: string | null;
  previous: string | null;
}

const DueManagement = () => {
  const [dashData, setDashData] = useState<any>()
  const [searchTerm, setSearchTerm] = useState('');
  const [tempSearchTerm, setTempSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [animateCards, setAnimateCards] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedClinic, setSelectedClinic] = useState<Clinic | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [paymentCurrentPage, setPaymentCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [dueTypeFilter, setDueTypeFilter] = useState('CLINIC_DETAILS');
  const [activeTab, setActiveTab] = useState('DUES');
  const [sortBy, setSortBy] = useState<'default' | 'AMOUNT_DESC' | 'AMOUNT_ASC'>('default');
  const [duesData, setDuesData] = useState<Clinic[]>([]);
  const [paymentData, setPaymentData] = useState<PaymentRecord[]>([]);
  const [notification, setNotification] = useState<{
    type: 'success' | 'error' | 'warning';
    message: string;
  } | null>(null);
  const [paginationData, setPaginationData] = useState<PaginationData>({
    current_page: 1,
    total_pages: 1,
    total_items: 0,
    next: null,
    previous: null
  });
  const [paymentPaginationData, setPaymentPaginationData] = useState<PaginationData>({
    current_page: 1,
    total_pages: 1,
    total_items: 0,
    next: null,
    previous: null
  });
  const [loading, setLoading] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false)

  // New state variables for due list and edit modal
  const [dueListData, setDueListData] = useState<any[]>([]);
  const [dueListLoading, setDueListLoading] = useState(false);
  const [editDueModalOpen, setEditDueModalOpen] = useState(false);
  const [selectedDue, setSelectedDue] = useState<any>(null);
  const [editAmount, setEditAmount] = useState('');
  const [editReason, setEditReason] = useState('');
 const [markAmountModal, setMarkAmountModal] = useState<{
  clinicId: string | null;
  amount: number | null;
}>({
  clinicId: null,
  amount: null,
});


  // Fetch dues data
  const fetchDuesData = async (page = 1, search = '', filter = 'all', sort = 'default') => {
    setLoading(true);
    try {
      const response = await GetAllDues(page, search, filter, sort);
      setDuesData(response.data);
      console.log(response.data)
      setPaginationData({
        current_page: response.current_page,
        total_pages: response.total_pages,
        total_items: response.total_items,
        next: response.next,
        previous: response.previous
      });
    } catch (error) {
      console.error("Error fetching dues data:", error);
      setNotification({
        type: 'error',
        message: 'Failed to fetch dues data'
      });
    } finally {
      setLoading(false);
    }
  };

  const getDashboardStatics = async () => {
    try {
      const res = await getAdminDueStaticData();
      console.log(res, "data fromt he clinic")
      if (res?.status === 200) {
        setDashData(res?.data)
      }
    } catch (error) {
      console.log(error)
    }
  }

  // Fetch payment data
  const fetchPaymentData = async (page = 1, search = '', clinic = '', filter = 'PAID') => {
    setLoading(true);
    try {
      const response = await GetAllPayment(page, search, clinic, filter);
      setPaymentData(response.data);
      setPaymentPaginationData({
        current_page: response.current_page,
        total_pages: response.total_pages,
        total_items: response.total_items,
        next: response.next,
        previous: response.previous
      });
    } catch (error) {
      console.error("Error fetching payment data:", error);
      setNotification({
        type: 'error',
        message: 'Failed to fetch payment data'
      });
    } finally {
      setLoading(false);
    }
  };
  

  const handleOpenOrClose = (id:null|string=null,amount:number | null=null)=>{
    console.log(id);
    
    setMarkAmountModal({
  clinicId:id,
  amount: amount
})
  }
  // Fetch due list data for a specific clinic
  const fetchDueListData = async (page = 1, search = '', clinic = '', filter = 'PAID') => {
    setDueListLoading(true);
    try {
      // Replace with your actual API call
      const response = await GetAllPayment(page, search, clinic, filter);
      setDueListData(response.data);

    } catch (error) {
      console.error("Error fetching due list data:", error);
      setNotification({
        type: 'error',
        message: 'Failed to fetch due list'
      });
    } finally {
      setDueListLoading(false);
    }
  };

  // Edit due handlers
  const handleEditDue = (due: any) => {
    setSelectedDue(due);
    setEditAmount(due.adjusted_amount || due?.amount);
    setEditReason(due.reason || '');
    setEditDueModalOpen(true);
  };

  const handleSaveDue = async () => {
    setIsLoading(true)
    try {
      // Replace with your actual API call
      const body = {
        discount_amount: Number(editAmount),
        description: editReason
      }
      const response = await UpdateDueAmount(selectedDue?.uuid, body);
      console.log(response, 'from he update dur from admin ')

      setNotification({
        type: 'success',
        message: 'Due amount updated successfully'
      });
      setEditDueModalOpen(false);

      // Refresh due list data
      if (selectedClinic) {
        const page = 1
        const filter = "DUE"
        fetchDueListData(page, '', selectedClinic.clinic_detail.uuid, filter);
      }
    } catch (error) {
      console.error("Error updating due:", error);
      setNotification({
        type: 'error',
        message: 'Failed to update due amount'
      });
    } finally {
      setIsLoading(false)
    }
  };

 
  // Fetch data when filters change
  useEffect(() => {
    getDashboardStatics()

    if (activeTab === 'DUES') {
      fetchDuesData(currentPage, searchTerm, selectedFilter, sortBy);
    } else if (activeTab === 'PAYMENT_HISTORY') {
      fetchPaymentData(paymentCurrentPage, searchTerm, '', 'PAID');
    }
    setTimeout(() => setAnimateCards(true), 100);
  }, [currentPage, paymentCurrentPage, searchTerm, selectedFilter, sortBy, activeTab]);

  const searchHandler = () => {
    setSearchTerm(tempSearchTerm)
  }

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

  const formatCurrency = (amount: number | string) => {
    const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(Math.abs(numAmount));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const handleViewDetails = (clinic: Clinic) => {
    setSelectedClinic(clinic);
    setViewModalOpen(true);
    // Fetch due list data when modal opens
    const page = 1
    const filter = "DUE"
    fetchDueListData(page, '', clinic.clinic_detail.uuid, filter);
  };

  const handleCloseModal = () => {
    setViewModalOpen(false);
    setSelectedClinic(null);
    setDueTypeFilter('CLINIC_DETAILS');
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= paginationData.total_pages) {
      setCurrentPage(newPage);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePaymentPageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= paymentPaginationData.total_pages) {
      setPaymentCurrentPage(newPage);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleExport = () => {
    try {
      // Create a new workbook
      const wb = XLSX.utils.book_new();

      if (activeTab === 'DUES') {
        // 1. Export Dues Management data
        const exportDuesData: any[] = duesData.map((clinic: Clinic) => ({
          'Clinic Name': clinic.clinic_detail.name,
          'City': clinic.clinic_detail.city,
          'Contact': `+${clinic.clinic_detail.country_code} ${clinic.clinic_detail.contact_number}`,
          'Total Dues': clinic.due_detail.total_dues,
          'Total Paid': clinic.due_detail.total_paid,
          'Remaining Dues': clinic.due_detail.remaining_dues,
          'Status': clinic.due_detail.remaining_dues > 0 ? 'Outstanding' :
            clinic.due_detail.remaining_dues < 0 ? 'Credit' : 'Settled'
        }));
        const duesWS = XLSX.utils.json_to_sheet(exportDuesData);
        XLSX.utils.book_append_sheet(wb, duesWS, "Dues Management");
      } else if (activeTab === 'PAYMENT_HISTORY') {
        // 2. Export Payment History data
        const exportPaymentData: any[] = paymentData.map((record: PaymentRecord) => ({
          'Transaction ID': record.transaction_id,
          'Payment Date': record.created_at ? formatDate(record.created_at) : 'N/A',
          'Amount': record.amount,
          'Status': record.status,
          'Patient': record.patient_name || 'N/A',
          'Clinic': record.clinic_name || 'N/A',
          'Service': record.service_name || 'N/A',
          'Payment Type': record.payment_type
        }));
        const paymentWS = XLSX.utils.json_to_sheet(exportPaymentData);
        XLSX.utils.book_append_sheet(wb, paymentWS, "Payment History");
      }

      // Generate Excel file and trigger download
      const date = new Date().toISOString().split('T')[0];
      XLSX.writeFile(wb, `${activeTab === 'DUES' ? 'Due' : 'Payment'}_Management_Report_${date}.xlsx`);

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


   const onClickSaveDueAmount  = async(amount:number,description:string)=>{
      if(markAmountModal.clinicId){
         const response = await markDueAmount(markAmountModal.clinicId,amount,description)
         console.log("response",response);
         handleOpenOrClose(null)
         window.location.reload()
      }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading ...</p>
        </div>
      </div>
    );
  }

  console.log(selectedDue)

  return (
    <><div className="min-h-screen">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-2xl">
        <div className="max-w-7xl mx-auto px-6 pt-5">
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
                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${activeTab === 'DUES'
                  ? 'bg-white text-primaryColor shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
                  }`}
                onClick={() => {
                  setActiveTab('DUES');
                  setCurrentPage(1);
                }}
              >
                Dues Management
              </button>
              <button
                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${activeTab === 'PAYMENT_HISTORY'
                  ? 'bg-white text-primaryColor shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
                  }`}
                onClick={() => {
                  setActiveTab('PAYMENT_HISTORY');
                  setPaymentCurrentPage(1);
                }}
              >
                Payment History
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 pt-5">
        {activeTab === 'DUES' && (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
              <div className={`bg-white rounded-2xl p-6 border border-gray-200 shadow-sm transform transition-all duration-700 ${animateCards ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-blue-50 rounded-xl">
                    <DollarSign className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-gray-900">{dashData?.total_dues}</p>
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
                    <p className="text-2xl font-bold text-gray-900">{dashData?.total_paid}</p>
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
                    <p className="text-2xl font-bold text-gray-900">{dashData?.outstanding_amount}</p>
                    <p className="text-orange-600 font-medium text-sm">Outstanding</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Search and Filter */}
            <div className="bg-white rounded-2xl p-6 mb-8 border border-gray-200 shadow-sm">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="relative flex-1 w-full">
                  <Search onClick={searchHandler} className="cursor-pointer absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search clinics..."
                    value={tempSearchTerm}
                    onChange={(e) => setTempSearchTerm(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") { searchHandler() } }}
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border-0 rounded-xl focus:outline-none "
                  />
                </div>
                <div className="flex items-center gap-4">
                  {/* Sorting dropdown */}
                  <select
                    value={sortBy}
                    onChange={e => setSortBy(e.target.value as any)}
                    className="px-4 py-3 bg-gray-50 border-0 rounded-lg focus:outline-none transition-all duration-200 font-medium"
                  >
                    <option value="default">Sort: Default</option>
                    <option value="AMOUNT_DESC">Sort: Highest Due</option>
                    <option value="AMOUNT_ASC">Sort: Lowest Due</option>
                  </select>
                  <button
                    onClick={handleExport}
                    className="px-6 py-3 bg-primaryColor text-white rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                    Export Report
                  </button>
                </div>
              </div>
            </div>

            {/* Clinics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {duesData.map((clinic, index) => {
                const statusInfo = getStatusInfo(clinic.due_detail.remaining_dues);
                const isSelected = selectedClinic && selectedClinic.clinic_detail.uuid === clinic.clinic_detail.uuid && viewModalOpen;
                return (
                  <div
                    key={clinic.clinic_detail.uuid}
                    className={`bg-white rounded-2xl flex flex-col justify-between p-6 border border-gray-200 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 transform ${animateCards ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'} ${isSelected ? 'ring-2 ring-blue-500' : ''}`}
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
                    <div>
                      {/* Header */}
                      <div className="flex items-start justify-between mb-6">
                        <div className="flex items-center gap-3">
                          <div className="p-3 bg-blue-50 rounded-xl">
                            <Building2 className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900 text-lg leading-tight capitalize">{clinic.clinic_detail.name}</h3>
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
                            <span className={`font-bold text-lg ${clinic.due_detail.remaining_dues > 0 ? 'text-red-600' :
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
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 ">
                      <button
                        className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-4 rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
                        tabIndex={-1}
                        type="button"
                      >
                        <Eye className="w-4 h-4" />
                        <span className='text-sm truncate'>View Details</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination */}
            <Pagination
              currentPage={currentPage}
              totalPages={paginationData.total_pages}
              onPageChange={handlePageChange}
              totalItems={paginationData.total_items}
              itemsPerPage={itemsPerPage}
            />
          </>
        )}

        {activeTab === 'PAYMENT_HISTORY' && (
          <>
            {/* Search and Filter for Payment History */}
            <div className="bg-white rounded-2xl p-6 mb-5 border border-gray-200 shadow-sm">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="relative flex gap-4 w-full">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search payments..."
                    value={tempSearchTerm}
                    onChange={(e) => setTempSearchTerm(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") { searchHandler() } }}
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border-0 rounded-lg focus:outline-none  transition-all duration-200"
                  />
                  <button
                    onClick={() => searchHandler()}
                    className="px-6 py-3 bg-primaryColor text-white rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                    Search
                  </button>
                </div>
                <div className="flex items-center gap-4">
                  <button
                    onClick={handleExport}
                    className="px-6 py-3 text-nowrap bg-primaryColor text-white rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                    Export Report
                  </button>
                </div>
              </div>
            </div>

            {/* Payment History Table */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="bg-gray-50 text-gray-700">
                      <th className="p-4 text-left font-semibold">Clinic</th>
                      <th className="p-4 text-left font-semibold">Date</th>
                      <th className="p-4 text-left font-semibold">Patient</th>
                      <th className="p-4 text-left font-semibold">Service</th>
                      <th className="p-4 text-left font-semibold">Amount</th>
                      <th className="p-4 text-left font-semibold">Discount</th>
                      <th className="p-4 text-left font-semibold">Total Paid</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paymentLoading ? (
                      <tr>
                        <td colSpan={8} className="p-8 text-center text-gray-500">
                          Loading payment data...
                        </td>
                      </tr>
                    ) : paymentData.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="p-8 text-center text-gray-500">
                          No payment records found.
                        </td>
                      </tr>
                    ) : (
                      paymentData.map((payment: any) => (
                        <tr key={payment.uuid} className="border-t hover:bg-blue-50/40 transition">
                          <td className="p-4">{payment.clinic_name || 'N/A'}</td>
                          <td className="p-4">{payment.created_at ? formatDate(payment.created_at) : 'N/A'}</td>
                          <td className="p-4">{payment.patient_name || 'N/A'}</td>
                          <td className="p-4">{payment.clinic_service_name || payment.service_name || 'N/A'}</td>
                          <td className="p-4">{formatCurrency(payment.amount)}</td>
                          <td className="p-4">{payment.discount_amount || 'N/A'}</td>
                          <td className="p-4">{payment.final_amount || 'N/A'}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination for Payment History */}
              <Pagination
                currentPage={paymentCurrentPage}
                totalPages={paymentPaginationData.total_pages}
                onPageChange={handlePaymentPageChange}
                totalItems={paymentPaginationData.total_items}
                itemsPerPage={itemsPerPage}
              />
            </div>
          </>
        )}
      </div>

      {/* Clinic Details Modal */}
      <Modal isOpen={viewModalOpen} onClose={handleCloseModal} title={selectedClinic?.clinic_detail.name || 'Clinic Details'} size="lg">
        {selectedClinic && (
          <>
            {/* Tabs */}
            <div className="flex border-b border-gray-200 mb-6">
              <button
                className={`px-4 py-3 font-medium border-b-2 transition-all duration-200 ${dueTypeFilter === 'CLINIC_DETAILS'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                onClick={() => setDueTypeFilter('CLINIC_DETAILS')}
              >
                Clinic Details
              </button>
              <button
                className={`px-4 py-3 font-medium border-b-2 transition-all duration-200 ${dueTypeFilter === 'DUE_LIST'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                onClick={() => setDueTypeFilter('DUE_LIST')}
              >
                Due List
              </button>
            </div>

            {/* Tab Content */}
            {dueTypeFilter === 'CLINIC_DETAILS' && (
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
                    <IndianRupeeIcon className="w-5 h-5 text-blue-500" />
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
              </div>
            )}

            {dueTypeFilter === 'DUE_LIST' && (
              <div className="bg-white rounded-xl border border-gray-200">
                {dueListLoading ? (
                  <div className="p-8 text-center text-gray-500">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    Loading due list...
                  </div>
                ) : dueListData.length === 0 ? (
                  <div className="p-8 text-center text-gray-500">
                    <div className="bg-gray-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                      <CreditCard className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="text-lg font-medium mb-2">No dues found</p>
                    <p className="text-sm">There are no outstanding dues for this clinic.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full">
                      <thead>
                        <tr className="bg-gray-50 border-b border-gray-200">
                          <th className="p-4 text-left font-semibold text-gray-700 text-sm">Service</th>
                          <th className="p-4 text-left font-semibold text-gray-700 text-sm">Amount</th>
                          <th className="p-4 text-left font-semibold text-gray-700 text-sm">Discount</th>
                          <th className="p-4 text-left font-semibold text-gray-700 text-sm">Pay</th>
                          <th className="p-4 text-left font-semibold text-gray-700 text-sm">Patient</th>
                          <th className="p-4 text-left font-semibold text-gray-700 text-sm">Contact</th>
                          <th className="p-4 text-left font-semibold text-gray-700 text-sm">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {dueListData.map((due) => (
                          <tr key={due?.uuid} className="border-b border-gray-100 hover:bg-gray-50 transition">
                            <td className="p-4 text-sm font-medium">{due?.service_name}</td>
                            <td className="p-4 text-sm">{formatCurrency(due?.amount)}</td>
                            <td className="p-4 text-sm">{formatCurrency(due?.discount_amount) || "No Discount"}</td>
                            <td className="p-4 text-sm">{formatCurrency(due?.final_amount) || "No Discount"}</td>
                            <td className="p-4 text-sm font-medium">{due?.patient_name || "No Data"}</td>
                            <td className="p-4 text-sm text-gray-600 max-w-xs truncate">{due?.patient_mobile || "No Data"}</td>
                            <td className="p-4 space-y-2">
                              <button
                                onClick={() => handleEditDue(due)}
                                className="px-3 py-1.5 bg-primaryColor text-white text-sm rounded-lg  transition font-medium"
                              >
                                Edit Amount
                              </button>
                              <button
                                onClick={()=>handleOpenOrClose(due.clinic,due?.amount
)}
                                className="px-3 py-1.5 bg-green-500 text-white text-sm rounded-lg break-words transition font-medium"
                              >
                              Mark Amount Recieved
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </Modal>

      {/* Edit Due Modal */}
      <Modal isOpen={editDueModalOpen} onClose={() => setEditDueModalOpen(false)} title="Edit Due Amount" size="sm">
        {selectedDue && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Service
              </label>
              <p className="text-gray-900 font-medium">{selectedDue?.service_name}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Original Amount
              </label>
              <p className="text-gray-600">{formatCurrency(selectedDue?.amount)}</p>
            </div>

            <div>
              <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
                Adjusted Amount *
              </label>
              <input
                type="number"
                id="amount"
                value={editAmount}
                onChange={(e) => setEditAmount(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter adjusted amount"
              />
            </div>

            <div>
              <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-2">
                Reason for Adjustment *
              </label>
              <textarea
                id="reason"
                value={editReason}
                onChange={(e) => setEditReason(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter reason for amount adjustment"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <button
                onClick={() => setEditDueModalOpen(false)}
                className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveDue}
                disabled={!editAmount || !editReason}
                className="flex-1 w-full items-center text-center justify-center px-4 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (<>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2  border-white flex-1 items-center text-center justify-center "></div>
                </>) : ('Save Changes')}
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
    {markAmountModal.clinicId&&markAmountModal.amount&&<PaymentPopup
     amountfromdata={markAmountModal.amount}
      isOpen={markAmountModal.clinicId?true:false}
      onClose={handleOpenOrClose}
      onSubmit={onClickSaveDueAmount}

    />}
    </>
  );
};

export default DueManagement;