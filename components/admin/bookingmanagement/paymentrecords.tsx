import React, { useState, useMemo, useEffect } from 'react';
import { 
  CreditCard, 
  Calendar, 
  Filter, 
  Search, 
  Download, 
  Eye, 
  RefreshCw,
  DollarSign,
  TrendingUp,
  Users,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  Video,
  MapPin,
  Receipt,
  ArrowUpDown,
  ChevronDown,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { getAllPayment } from '@/service/admin/bookingManagementService';

// Updated Payment Record Type based on your API response
type PaymentRecord = {
  uuid: string;
  booking: string;
  expert_booking: string | null;
  clinic: string | null;
  user: string;
  created_by: string | null;
  amount: string;
  currency: string;
  transaction_id: string;
  notes: string | null;
  status: 'CREATED' | 'COMPLETED' | 'PENDING' | 'FAILED' | 'REFUNDED';
  payment_type: string;
  payment_id: string | null;
  patient_name: string;
  service_name: string;
  clinic_service_name: string | null;
  clinic_name: string;
  paymentDate?: string; // Adding optional field for date handling
};

interface PaginationData {
  current_page: number;
  total_pages: number;
  total_items: number;
  next: string | null;
  previous: string | null;
}

interface PaymentResponse {
  data: PaymentRecord[];
  current_page: number;
  total_pages: number;
  total_items: number;
  next: string | null;
  previous: string | null;
}

const PaymentRecordsDashboard = () => {
  // State management
  const [payment, setPayment] = useState<PaymentRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | PaymentRecord['status']>('ALL');
  const [paymentMethodFilter, setPaymentMethodFilter] = useState<'ALL' | string>('ALL');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState<'transaction_id' | 'amount' | 'patient_name'>('transaction_id');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedRecord, setSelectedRecord] = useState<PaymentRecord | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [totalRecords, setTotalRecords] = useState(0);
  const [paginationData, setPaginationData] = useState<PaginationData>({
    current_page: 1,
    total_pages: 1,
    total_items: 0,
    next: null,
    previous: null
  });

const fetchPayments = async (page = 1, search = '') => {
  try {
    setIsLoading(true);
    
    // Prepare query parameters
    const params = {
      page: page,
      search: search,
      status: statusFilter !== 'ALL' ? statusFilter : undefined,
      payment_type: paymentMethodFilter !== 'ALL' ? paymentMethodFilter : undefined,
      from_date: fromDate || undefined,
      to_date: toDate || undefined,
      ordering: sortOrder === 'asc' ? sortBy : `-${sortBy}`
    };

    // Make API call
    const response = await getAllPayment(params);

    // Process response data
    const recordsWithDates = response.data.map((record: PaymentRecord) => ({
      ...record,
      paymentDate: record.paymentDate || new Date().toISOString()
    }));

    // Update state
    setPayment(recordsWithDates);
    setTotalRecords(response.total_items);
    setPaginationData({
      current_page: response.current_page,
      total_pages: response.total_pages,
      total_items: response.total_items,
      next: response.next,
      previous: response.previous
    });

  } catch (error) {
    console.error("Failed to fetch payments:", error);
    // Optional: Add error state handling here
  } finally {
    setIsLoading(false);
  }
};

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentPage(1);
      fetchPayments(1, searchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Fetch data when filters or sort changes
  useEffect(() => {
    fetchPayments(currentPage, searchTerm);
  }, [statusFilter, paymentMethodFilter, fromDate, toDate, sortBy, sortOrder, currentPage]);

  // Statistics
  const stats = useMemo(() => {
    const total = payment.length;
    const completed = payment.filter(r => r.status === 'COMPLETED').length;
    const pending = payment.filter(r => r.status === 'PENDING').length;
    const failed = payment.filter(r => r.status === 'FAILED').length;
    const refunded = payment.filter(r => r.status === 'REFUNDED').length;
    const created = payment.filter(r => r.status === 'CREATED').length;
    
    const totalRevenue = payment
      .filter(r => r.status === 'COMPLETED')
      .reduce((sum, r) => sum + parseFloat(r.amount), 0);
    
    const pendingAmount = payment
      .filter(r => r.status === 'PENDING' || r.status === 'CREATED')
      .reduce((sum, r) => sum + parseFloat(r.amount), 0);

    return { total, completed, pending, failed, refunded, created, totalRevenue, pendingAmount };
  }, [payment]);

  // Utility functions
  const formatCurrency = (amount: string) => {
    const numAmount = parseFloat(amount);
    return new Intl.NumberFormat('en-IN', { 
      style: 'currency', 
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(numAmount);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: PaymentRecord['status']) => {
    switch (status) {
      case 'COMPLETED': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'PENDING': 
      case 'CREATED': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'FAILED': return 'bg-red-50 text-red-700 border-red-200';
      case 'REFUNDED': return 'bg-purple-50 text-purple-700 border-purple-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getStatusIcon = (status: PaymentRecord['status']) => {
    switch (status) {
      case 'COMPLETED': return <CheckCircle className="w-4 h-4" />;
      case 'PENDING': 
      case 'CREATED': return <Clock className="w-4 h-4" />;
      case 'FAILED': return <XCircle className="w-4 h-4" />;
      case 'REFUNDED': return <RefreshCw className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  const handleExportData = () => {
    const csvContent = [
      ['Transaction ID', 'Payment Date', 'Patient Name', 'Service', 'Amount', 'Status', 'Payment Type', 'Clinic'],
      ...payment.map(record => [
        record.transaction_id,
        formatDate(record.paymentDate || ''),
        record.patient_name,
        record.service_name,
        record.amount,
        record.status,
        record.payment_type,
        record.clinic_name
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `payment-records-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 p-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <CreditCard className="text-blue-600" size={32} />
                Payment Records
              </h1>
              <p className="text-gray-600 mt-1">Track all payment transactions and financial records</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleExportData}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors"
              >
                <Download size={16} />
                Export Data
              </button>
              <button 
                onClick={() => fetchPayments(currentPage, searchTerm)}
                className="flex items-center gap-2 px-4 py-2 text-gray-600 bg-white/80 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
              >
                <RefreshCw size={16} />
                Refresh
              </button>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Records</p>
                <p className="text-2xl font-bold text-gray-900">{paginationData.total_items}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-xl">
                <Receipt size={24} className="text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-emerald-600">{formatCurrency(stats.totalRevenue.toString())}</p>
              </div>
              <div className="p-3 bg-emerald-100 rounded-xl">
                <TrendingUp size={24} className="text-emerald-600" />
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-gray-900">{stats.completed}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-xl">
                <CheckCircle size={24} className="text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending/Created</p>
                <p className="text-2xl font-bold text-amber-600">{stats.pending + stats.created}</p>
              </div>
              <div className="p-3 bg-amber-100 rounded-xl">
                <Clock size={24} className="text-amber-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
            {/* Search */}
            <div className="lg:col-span-2">
              <div className="relative">
                <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search transactions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Status Filter */}
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="w-full appearance-none bg-white border border-gray-200 rounded-xl px-4 py-3 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="ALL">All Status</option>
                <option value="COMPLETED">Completed</option>
                <option value="CREATED">Created</option>
                <option value="PENDING">Pending</option>
                <option value="FAILED">Failed</option>
                <option value="REFUNDED">Refunded</option>
              </select>
              <ChevronDown size={16} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>

            {/* Payment Method Filter */}
            <div className="relative">
              <select
                value={paymentMethodFilter}
                onChange={(e) => setPaymentMethodFilter(e.target.value)}
                className="w-full appearance-none bg-white border border-gray-200 rounded-xl px-4 py-3 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="ALL">All Methods</option>
                <option value="NORMAL_BOOKING">Normal Booking</option>
                {/* Add other payment types if available */}
              </select>
              <ChevronDown size={16} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>

            {/* Date Range */}
            <div className="lg:col-span-2 grid grid-cols-2 gap-2">
              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="w-full px-3 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="w-full px-3 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Results Summary */}
        <div className="flex items-center justify-between">
          <p className="text-gray-600">
            Showing {((paginationData.current_page - 1) * 10) + 1}-{Math.min(paginationData.current_page * 10, paginationData.total_items)} of {paginationData.total_items} records
          </p>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Sort by:</span>
            <select
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [field, order] = e.target.value.split('-');
                setSortBy(field as any);
                setSortOrder(order as any);
                setCurrentPage(1);
              }}
              className="px-3 py-1 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="transaction_id-desc">Transaction ID (Desc)</option>
              <option value="transaction_id-asc">Transaction ID (Asc)</option>
              <option value="amount-desc">Amount (High to Low)</option>
              <option value="amount-asc">Amount (Low to High)</option>
              <option value="patient_name-asc">Patient Name (A-Z)</option>
              <option value="patient_name-desc">Patient Name (Z-A)</option>
            </select>
          </div>
        </div>

        {/* Payment Records Table */}
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50/80">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transaction</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {payment.map((record) => (
                  <tr key={record.uuid} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <div className="text-sm font-medium text-gray-900">{record.transaction_id}</div>
                        <div className="text-xs text-gray-500">{record.payment_type}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <div className="text-sm font-medium text-gray-900">{record.patient_name}</div>
                        <div className="text-xs text-gray-500">{record.user}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div className="flex flex-col">
                          <div className="text-sm font-medium text-gray-900">{record.service_name}</div>
                          <div className="text-xs text-gray-500">{record.clinic_name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <div className="text-sm font-bold text-gray-900">{formatCurrency(record.amount)}</div>
                        <div className="text-xs text-gray-500">Currency: {record.currency}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(record.status)}`}>
                        {getStatusIcon(record.status)}
                        {record.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(record.paymentDate || '')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => {
                          setSelectedRecord(record);
                          setShowDetailsModal(true);
                        }}
                        className="text-blue-600 hover:text-blue-800 font-medium text-sm flex items-center gap-1"
                      >
                        <Eye size={16} />
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        {paginationData.total_pages > 1 && (
          <div className="flex items-center justify-between bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 p-4">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
                disabled={currentPage === 1}
                className={`px-3 py-1 rounded-lg border ${
                  currentPage === 1
                    ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                    : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                }`}
              >
                <ChevronLeft size={16} />
              </button>
              {Array.from({ length: Math.min(5, paginationData.total_pages) }, (_, i) => {
                // Show first pages, current page with neighbors, and last pages
                let pageNum;
                if (paginationData.total_pages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= paginationData.total_pages - 2) {
                  pageNum = paginationData.total_pages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`px-3 py-1 rounded-lg border ${
                      currentPage === pageNum
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
              {paginationData.total_pages > 5 && currentPage < paginationData.total_pages - 2 && (
                <span className="px-2">...</span>
              )}
              {paginationData.total_pages > 5 && currentPage < paginationData.total_pages - 2 && (
                <button
                  onClick={() => setCurrentPage(paginationData.total_pages)}
                  className={`px-3 py-1 rounded-lg border ${
                    currentPage === paginationData.total_pages
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  {paginationData.total_pages}
                </button>
              )}
              <button
                onClick={() => setCurrentPage(Math.min(currentPage + 1, paginationData.total_pages))}
                disabled={currentPage === paginationData.total_pages}
                className={`px-3 py-1 rounded-lg border ${
                  currentPage === paginationData.total_pages
                    ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                    : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                }`}
              >
                <ChevronRight size={16} />
              </button>
            </div>
            <div className="text-sm text-gray-600">
              Page {currentPage} of {paginationData.total_pages}
            </div>
          </div>
        )}

        {/* Details Modal */}
        {showDetailsModal && selectedRecord && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-gray-900">Transaction Details</h3>
                  <button
                    onClick={() => setShowDetailsModal(false)}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <XCircle size={24} />
                  </button>
                </div>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Transaction ID</p>
                    <p className="text-base font-semibold text-gray-900">{selectedRecord.transaction_id}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Booking ID</p>
                    <p className="text-base font-semibold text-gray-900">{selectedRecord.booking}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Patient Name</p>
                    <p className="text-base font-semibold text-gray-900">{selectedRecord.patient_name}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">User ID</p>
                    <p className="text-base font-semibold text-gray-900">{selectedRecord.user}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Service</p>
                    <p className="text-base font-semibold text-gray-900">{selectedRecord.service_name}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Clinic</p>
                    <p className="text-base font-semibold text-gray-900">{selectedRecord.clinic_name || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Amount</p>
                    <p className="text-base font-semibold text-gray-900">{formatCurrency(selectedRecord.amount)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Currency</p>
                    <p className="text-base font-semibold text-gray-900">{selectedRecord.currency}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Payment Type</p>
                    <p className="text-base font-semibold text-gray-900">{selectedRecord.payment_type}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Payment ID</p>
                    <p className="text-base font-semibold text-gray-900">{selectedRecord.payment_id || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Status</p>
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(selectedRecord.status)}`}>
                      {getStatusIcon(selectedRecord.status)}
                      {selectedRecord.status}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Payment Date</p>
                    <p className="text-base font-semibold text-gray-900">{formatDate(selectedRecord.paymentDate || '')}</p>
                  </div>
                </div>
                {selectedRecord.notes && (
                  <div>
                    <p className="text-sm font-medium text-gray-500">Notes</p>
                    <p className="text-base text-gray-900 mt-1">{selectedRecord.notes}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentRecordsDashboard;