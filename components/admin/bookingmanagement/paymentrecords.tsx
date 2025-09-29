import React, { useState, useMemo, useEffect } from 'react';
import {
  CreditCard,
  Search,
  Download,
  Eye,
  RefreshCw,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  Receipt,
  ChevronDown,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { getAllTransactions } from '@/service/admin/bookingManagementService';
import DataPlaceholder from '@/components/common/DataPlaceholder';

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
  payment_type: 'ALL' | 'DUE' | 'PAID' | string;
  transaction_type?: 'ALL' | 'DUE' | 'PAID' | string;
  payment_id: string | null;
  patient_name: string;
  service_name: string;
  clinic_service_name: string | null;
  clinic_name: string;
  paymentDate?: string; // Adding optional field for date handling
  created_at?: string; // Adding optional field for date handling
};

interface PaginationData {
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
  const [transactionType, setTransactionType] = useState<'ALL' | 'DUE' | 'PAID' | string>('ALL');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState<'transaction_id' | 'amount' | 'patient_name'>('transaction_id');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedRecord, setSelectedRecord] = useState<PaymentRecord | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
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
        transaction_type: transactionType !== 'ALL' ? transactionType : undefined,
        from_date: fromDate || undefined,
        to_date: toDate || undefined,
      };

      // Make API call
      const response = await getAllTransactions(params);

      // Process response data
      const recordsWithDates = response.data;

      // Update state
      setPayment(recordsWithDates);
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
  }, [transactionType, fromDate, toDate, sortBy, sortOrder, currentPage]);

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

  const getStatusColor = (status: PaymentRecord['transaction_type']) => {
    switch (status) {
      case 'COMPLETED': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'PENDING':
      case 'CREATED': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'FAILED': return 'bg-red-50 text-red-700 border-red-200';
      case 'REFUNDED': return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'PAID': return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'DUE': return 'bg-purple-50 text-purple-700 border-purple-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getStatusIcon = (status: PaymentRecord['transaction_type']) => {
    switch (status) {
      case 'COMPLETED': return <CheckCircle className="w-4 h-4" />;
      case 'PAID': return <CheckCircle className="w-4 h-4" />;
      case 'DUE':
      case 'CREATED': return <Clock className="w-4 h-4" />;
      case 'FAILED': return <XCircle className="w-4 h-4" />;
      case 'REFUNDED': return <RefreshCw className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  const handleExportData = () => {
    const csvContent = [
      ['Transaction ID', 'Payment Date', 'Time', 'Patient Name', 'Service', 'Amount', 'Status', 'Payment Type', 'Clinic'],
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

  return (
    <div className="min-h-screen  p-4">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Header */}
        <div className="bg-white/80  border-white/20">
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
                className="flex items-center gap-2 px-4 py-2 bg-primaryColor text-white rounded-lg hover:bg-primaryColor transition-colors"
              >
                <Download size={16} />
                Export Data
              </button>
              <button
                onClick={() => fetchPayments(currentPage, searchTerm)}
                className="flex items-center gap-2 px-4 py-2 text-gray-600 bg-white/80 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <RefreshCw size={16} />
                Refresh
              </button>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative ">
              <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search transactions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none "
              />
            </div>

            {/* Status Filter */}
            <div className="relative">
              <select
                value={transactionType}
                onChange={(e) => setTransactionType(e.target.value as any)}
                className="w-full appearance-none bg-white border border-gray-200 rounded-xl px-4 py-3 pr-8 focus:outline-none"
              >
                <option value="ALL">All Type</option>
                <option value="PAID">Paid</option>
                <option value="DUE">Due</option>
              </select>
              <ChevronDown size={16} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>

            {/* Date Range */}
            <div className="lg:col-span-2 grid grid-cols-2 gap-2">
              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="w-full px-3 py-3 border border-gray-200 rounded-xl focus:outline-none "
              />
              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="w-full px-3 py-3 border border-gray-200 rounded-xl focus:outline-none "
              />
            </div>
          </div>
        </div>

        {/* Results Summary */}
        <div className="flex items-center justify-between">
          <p className="text-gray-600">
            Showing {((paginationData.current_page - 1) * 10) + 1}-{Math.min(paginationData.current_page * 10, paginationData.total_items)} of {paginationData.total_items} records
          </p>
        </div>

        {/* Payment Records Table */}
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 overflow-hidden">
          <div className="overflow-x-auto">
            {isLoading ?
              (
                <div className="min-h-[40vh] flex items-center justify-center w-full ">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              )
              : (payment?.length === 0 ? (
                <div className='w-full  item-center justify-center'>
                  <DataPlaceholder />
                </div>
              ) : (
                <table className="w-full min-h-[50vh] relative">
                  <thead className="bg-gray-50/80">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {payment.map((record) => (
                      <tr key={record?.uuid} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex flex-col">
                            <div className="text-sm font-medium text-gray-900">{record?.patient_name || "No Name"}</div>
                            {/* <div className="text-xs text-gray-500">{record.user}</div> */}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <div className="flex flex-col">
                              <div className="text-sm font-medium text-gray-900">{record?.service_name}</div>
                              <div className="text-xs text-gray-500">{record?.clinic_name}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex flex-col">
                            <div className="text-sm font-bold text-gray-900">{formatCurrency(record.amount)}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(record?.transaction_type)}`}>
                            {getStatusIcon(record?.transaction_type)}
                            {record?.transaction_type}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(record?.created_at || '')}
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
                      </tr>))
                    }
                  </tbody>
                </table>
              ))
            }
          </div>
        </div>

        {/* Pagination */}
        {paginationData.total_pages > 1 && (
          <div className="flex items-center justify-between bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 p-4">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
                disabled={currentPage === 1}
                className={`px-3 py-1 rounded-lg border ${currentPage === 1
                  ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                  : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                  }`}
              >
                <ChevronLeft size={16} />
              </button>
              {Array.from({ length: Math.min(5, paginationData.total_pages) }, (_, i) => {
                // Show first pages, current page with neighbors, and last pages
                let pageNum: number;
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
                    className={`px-3 py-1 rounded-lg border ${currentPage === pageNum
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
                  className={`px-3 py-1 rounded-lg border ${currentPage === paginationData.total_pages
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
                className={`px-3 py-1 rounded-lg border ${currentPage === paginationData.total_pages
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
          <div className="fixed inset-0 -top-10 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full mx-4 max-h-screen overflow-y-auto">
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
                    <p className="text-base font-semibold text-gray-900">{selectedRecord?.uuid}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Booking ID</p>
                    <p className="text-base font-semibold text-gray-900">{selectedRecord?.booking}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Patient Name</p>
                    <p className="text-base font-semibold text-gray-900">{selectedRecord?.patient_name}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Clinic ID</p>
                    <p className="text-base font-semibold text-gray-900">{selectedRecord?.clinic}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Service</p>
                    <p className="text-base font-semibold text-gray-900">{selectedRecord?.service_name}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Clinic</p>
                    <p className="text-base font-semibold text-gray-900">{selectedRecord?.clinic_name || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Amount</p>
                    <p className="text-base font-semibold text-gray-900">{formatCurrency(selectedRecord?.amount)}</p>
                  </div>
                  {/* <div>
                    <p className="text-sm font-medium text-gray-500">Currency</p>
                    <p className="text-base font-semibold text-gray-900">{selectedRecord?.currency}</p>
                  </div> */}
                  {/* <div>
                    <p className="text-sm font-medium text-gray-500">Payment Type</p>
                    <p className="text-base font-semibold text-gray-900">{selectedRecord?.payment_type}</p>
                  </div> */}
                  {/* <div>
                    <p className="text-sm font-medium text-gray-500">Payment ID</p>
                    <p className="text-base font-semibold text-gray-900">{selectedRecord?.payment_id || 'N/A'}</p>
                  </div> */}
                  <div>
                    <p className="text-sm font-medium text-gray-500">Status</p>
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(selectedRecord?.transaction_type)}`}>
                      {getStatusIcon(selectedRecord?.transaction_type)}
                      {selectedRecord?.transaction_type}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Date</p>
                    <p className="text-base font-semibold text-gray-900">{formatDate(selectedRecord?.created_at || '')}</p>
                  </div>
                </div>
                {selectedRecord?.notes && (
                  <div>
                    <p className="text-sm font-medium text-gray-500">Notes</p>
                    <p className="text-base text-gray-900 mt-1">{selectedRecord?.notes}</p>
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