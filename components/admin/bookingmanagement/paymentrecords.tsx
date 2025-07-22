import React, { useState, useMemo } from 'react';
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

// Enhanced Payment Record Type
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
  sessionDuration: number; // in minutes
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

const PaymentRecordsDashboard = () => {
  // Sample payment records data
  const samplePaymentRecords: PaymentRecord[] = [
    {
      transactionId: "TXN001",
      bookingId: "1d56bfba-4407-41e5-b067-e55439db9607",
      paymentDate: "2025-06-30T10:30:00Z",
      amount: 160.00,
      currency: "INR",
      paymentStatus: "COMPLETED",
      paymentMethod: "UPI",
      serviceType: "VIDEO_CALL",
      patientName: "patient 1",
      patientEmail: "patient@email.com",
      patientMobile: "1234567890",
      clinicName: "Sunrise Clinic",
      clinicId: "clinic-1",
      serviceName: "Dermatology Consultation",
      sessionDuration: 30,
      doctorName: "Dr. Rajesh Kumar",
      bookingDate: "2025-05-31T16:31:00Z",
      processingFee: 5.00,
      platformFee: 15.00,
      netAmount: 140.00,
      gatewayTransactionId: "rzp_live_1234567890",
      paymentGateway: "RAZORPAY",
      remarks: "Consultation for skin condition"
    },
    {
      transactionId: "TXN002",
      bookingId: "d9a5c17d-277d-4fa9-88dd-285a588834a6",
      paymentDate: "2025-06-29T14:45:00Z",
      amount: 200.00,
      currency: "INR",
      paymentStatus: "COMPLETED",
      paymentMethod: "CARD",
      serviceType: "VIDEO_CALL",
      patientName: "patient 2",
      patientEmail: "patient2@email.com",
      patientMobile: "1234567891",
      clinicName: "Sunrise Clinic",
      clinicId: "clinic-1",
      serviceName: "Dermatology Session",
      sessionDuration: 45,
      doctorName: "Dr. Priya Sharma",
      bookingDate: "2025-06-10T17:31:00Z",
      processingFee: 6.00,
      platformFee: 18.00,
      netAmount: 176.00,
      gatewayTransactionId: "rzp_live_0987654321",
      paymentGateway: "RAZORPAY"
    },
    {
      transactionId: "TXN003",
      bookingId: "0860745e-125b-408c-b614-9f47df7fa868",
      paymentDate: "2025-06-28T16:20:00Z",
      amount: 200.00,
      currency: "INR",
      paymentStatus: "COMPLETED",
      paymentMethod: "CASH",
      serviceType: "PHYSICAL_VISIT",
      patientName: "patient 3",
      patientEmail: "patient3@email.com",
      patientMobile: "1234567892",
      clinicName: "Sunrise Clinic",
      clinicId: "clinic-1",
      serviceName: "Dermatology Consultation",
      sessionDuration: 60,
      doctorName: "Dr. Anjali Gupta",
      bookingDate: "2025-06-11T20:19:00Z",
      processingFee: 0.00,
      platformFee: 20.00,
      netAmount: 180.00,
      gatewayTransactionId: "CASH_1234567890",
      paymentGateway: "CASHFREE"
    },
    {
      transactionId: "TXN004",
      bookingId: "fd336206-9759-4b15-a756-c1f643aa0d77",
      paymentDate: "2025-06-27T12:15:00Z",
      amount: 400.00,
      currency: "INR",
      paymentStatus: "PENDING",
      paymentMethod: "NET_BANKING",
      serviceType: "VIDEO_CALL",
      patientName: "patient 4",
      patientEmail: "patient4@email.com",
      patientMobile: "1234567893",
      clinicName: "Sunrise Clinic",
      clinicId: "clinic-1",
      serviceName: "Dermatology Consultation",
      sessionDuration: 30,
      doctorName: "Dr. Vikram Singh",
      bookingDate: "2025-06-18T16:50:00Z",
      processingFee: 8.00,
      platformFee: 35.00,
      netAmount: 357.00,
      gatewayTransactionId: "rzp_live_pending123",
      paymentGateway: "RAZORPAY",
      remarks: "Payment verification in progress"
    },
    {
      transactionId: "TXN005",
      bookingId: "fb7f80c1-30bd-41a4-8393-a693f37fe43c",
      paymentDate: "2025-06-26T09:30:00Z",
      amount: 400.00,
      currency: "INR",
      paymentStatus: "FAILED",
      paymentMethod: "CARD",
      serviceType: "VIDEO_CALL",
      patientName: "patient 5",
      patientEmail: "patient5@email.com",
      patientMobile: "1234567894",
      clinicName: "Sunrise Clinic",
      clinicId: "clinic-1",
      serviceName: "Dermatology Consultation",
      sessionDuration: 30,
      doctorName: "Dr. Meera Patel",
      bookingDate: "2025-06-13T20:50:00Z",
      processingFee: 8.00,
      platformFee: 35.00,
      netAmount: 357.00,
      gatewayTransactionId: "rzp_live_failed456",
      paymentGateway: "RAZORPAY",
      remarks: "Insufficient balance"
    },
    {
      transactionId: "TXN006",
      bookingId: "a1d56bfba-4407-41e5-b067-e55439db9601",
      paymentDate: "2025-06-25T11:20:00Z",
      amount: 250.00,
      currency: "INR",
      paymentStatus: "REFUNDED",
      paymentMethod: "UPI",
      serviceType: "PHYSICAL_VISIT",
      patientName: "patient 6",
      patientEmail: "patient6@email.com",
      patientMobile: "1234567895",
      clinicName: "Sunrise Clinic",
      clinicId: "clinic-1",
      serviceName: "Dermatology Session",
      sessionDuration: 60,
      doctorName: "Dr. Rahul Joshi",
      bookingDate: "2025-07-01T10:00:00Z",
      processingFee: 7.00,
      platformFee: 22.00,
      netAmount: 221.00,
      refundAmount: 250.00,
      refundDate: "2025-06-26T15:30:00Z",
      gatewayTransactionId: "rzp_live_refund789",
      paymentGateway: "RAZORPAY",
      remarks: "Appointment cancelled by patient"
    }
  ];

  // State management
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | PaymentRecord['paymentStatus']>('ALL');
  const [serviceFilter, setServiceFilter] = useState<'ALL' | PaymentRecord['serviceType']>('ALL');
  const [paymentMethodFilter, setPaymentMethodFilter] = useState<'ALL' | PaymentRecord['paymentMethod']>('ALL');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState<'paymentDate' | 'amount' | 'patientName'>('paymentDate');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedRecord, setSelectedRecord] = useState<PaymentRecord | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const pageSize = 10;

  // Filtered and sorted data
  const filteredRecords = useMemo(() => {
    let filtered = samplePaymentRecords.filter(record => {
      const matchesSearch = 
        record.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.patientEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.transactionId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.clinicName.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'ALL' || record.paymentStatus === statusFilter;
      const matchesService = serviceFilter === 'ALL' || record.serviceType === serviceFilter;
      const matchesPaymentMethod = paymentMethodFilter === 'ALL' || record.paymentMethod === paymentMethodFilter;
      
      const paymentDate = new Date(record.paymentDate);
      const matchesFromDate = !fromDate || paymentDate >= new Date(fromDate);
      const matchesToDate = !toDate || paymentDate <= new Date(toDate);
      
      return matchesSearch && matchesStatus && matchesService && matchesPaymentMethod && matchesFromDate && matchesToDate;
    });

    // Sort the filtered records
    filtered.sort((a, b) => {
      let aValue: any = a[sortBy];
      let bValue: any = b[sortBy];
      
      if (sortBy === 'paymentDate') {
        aValue = new Date(aValue).getTime();
        bValue = new Date(bValue).getTime();
      } else if (sortBy === 'amount') {
        aValue = Number(aValue);
        bValue = Number(bValue);
      } else {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [searchTerm, statusFilter, serviceFilter, paymentMethodFilter, fromDate, toDate, sortBy, sortOrder]);

  // Pagination
  const totalPages = Math.ceil(filteredRecords.length / pageSize);
  const paginatedRecords = filteredRecords.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // Statistics
  const stats = useMemo(() => {
    const total = filteredRecords.length;
    const completed = filteredRecords.filter(r => r.paymentStatus === 'COMPLETED').length;
    const pending = filteredRecords.filter(r => r.paymentStatus === 'PENDING').length;
    const failed = filteredRecords.filter(r => r.paymentStatus === 'FAILED').length;
    const refunded = filteredRecords.filter(r => r.paymentStatus === 'REFUNDED').length;
    
    const totalRevenue = filteredRecords
      .filter(r => r.paymentStatus === 'COMPLETED')
      .reduce((sum, r) => sum + r.netAmount, 0);
    
    const pendingAmount = filteredRecords
      .filter(r => r.paymentStatus === 'PENDING')
      .reduce((sum, r) => sum + r.amount, 0);

    return { total, completed, pending, failed, refunded, totalRevenue, pendingAmount };
  }, [filteredRecords]);

  // Utility functions
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', { 
      style: 'currency', 
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: PaymentRecord['paymentStatus']) => {
    switch (status) {
      case 'COMPLETED': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'PENDING': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'FAILED': return 'bg-red-50 text-red-700 border-red-200';
      case 'REFUNDED': return 'bg-purple-50 text-purple-700 border-purple-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getStatusIcon = (status: PaymentRecord['paymentStatus']) => {
    switch (status) {
      case 'COMPLETED': return <CheckCircle className="w-4 h-4" />;
      case 'PENDING': return <Clock className="w-4 h-4" />;
      case 'FAILED': return <XCircle className="w-4 h-4" />;
      case 'REFUNDED': return <RefreshCw className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  const getServiceIcon = (serviceType: PaymentRecord['serviceType']) => {
    return serviceType === 'VIDEO_CALL' ? <Video className="w-4 h-4" /> : <MapPin className="w-4 h-4" />;
  };

  const handleExportData = () => {
    const csvContent = [
      ['Transaction ID', 'Payment Date', 'Patient Name', 'Service', 'Amount', 'Status', 'Payment Method', 'Clinic'],
      ...filteredRecords.map(record => [
        record.transactionId,
        formatDate(record.paymentDate),
        record.patientName,
        record.serviceName,
        record.amount,
        record.paymentStatus,
        record.paymentMethod,
        record.clinicName
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
                onClick={() => window.location.reload()}
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
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
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
                <p className="text-2xl font-bold text-emerald-600">{formatCurrency(stats.totalRevenue)}</p>
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
                <p className="text-sm font-medium text-gray-600">Pending Amount</p>
                <p className="text-2xl font-bold text-amber-600">{formatCurrency(stats.pendingAmount)}</p>
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
                <option value="PENDING">Pending</option>
                <option value="FAILED">Failed</option>
                <option value="REFUNDED">Refunded</option>
              </select>
              <ChevronDown size={16} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>

            {/* Service Filter */}
            <div className="relative">
              <select
                value={serviceFilter}
                onChange={(e) => setServiceFilter(e.target.value as any)}
                className="w-full appearance-none bg-white border border-gray-200 rounded-xl px-4 py-3 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="ALL">All Services</option>
                <option value="VIDEO_CALL">Video Call</option>
                <option value="PHYSICAL_VISIT">Physical Visit</option>
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
            Showing {((currentPage - 1) * pageSize) + 1}-{Math.min(currentPage * pageSize, filteredRecords.length)} of {filteredRecords.length} records
          </p>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Sort by:</span>
            <select
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [field, order] = e.target.value.split('-');
                setSortBy(field as any);
                setSortOrder(order as any);
              }}
              className="px-3 py-1 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="paymentDate-desc">Date (Newest)</option>
              <option value="paymentDate-asc">Date (Oldest)</option>
              <option value="amount-desc">Amount (High to Low)</option>
              <option value="amount-asc">Amount (Low to High)</option>
              <option value="patientName-asc">Patient Name (A-Z)</option>
              <option value="patientName-desc">Patient Name (Z-A)</option>
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
                {paginatedRecords.map((record) => (
                  <tr key={record.transactionId} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <div className="text-sm font-medium text-gray-900">{record.transactionId}</div>
                        <div className="text-xs text-gray-500">{record.paymentMethod}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <div className="text-sm font-medium text-gray-900">{record.patientName}</div>
                        <div className="text-xs text-gray-500">{record.patientEmail}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        {getServiceIcon(record.serviceType)}
                        <div className="flex flex-col">
                          <div className="text-sm font-medium text-gray-900">{record.serviceName}</div>
                          <div className="text-xs text-gray-500">{record.clinicName}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <div className="text-sm font-bold text-gray-900">{formatCurrency(record.amount)}</div>
                        <div className="text-xs text-gray-500">Net: {formatCurrency(record.netAmount)}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(record.paymentStatus)}`}>
                        {getStatusIcon(record.paymentStatus)}
                        {record.paymentStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(record.paymentDate)}
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
        {totalPages > 1 && (
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
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-1 rounded-lg border ${
                    currentPage === page
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage(Math.min(currentPage + 1, totalPages))}
                disabled={currentPage === totalPages}
                className={`px-3 py-1 rounded-lg border ${
                  currentPage === totalPages
                    ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                    : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                }`}
              >
                <ChevronRight size={16} />
              </button>
            </div>
            <div className="text-sm text-gray-600">
              Page {currentPage} of {totalPages}
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
                    <p className="text-base font-semibold text-gray-900">{selectedRecord.transactionId}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Booking ID</p>
                    <p className="text-base font-semibold text-gray-900">{selectedRecord.bookingId}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Patient Name</p>
                    <p className="text-base font-semibold text-gray-900">{selectedRecord.patientName}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Patient Email</p>
                    <p className="text-base font-semibold text-gray-900">{selectedRecord.patientEmail}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Service</p>
                    <p className="text-base font-semibold text-gray-900">{selectedRecord.serviceName}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Doctor</p>
                    <p className="text-base font-semibold text-gray-900">{selectedRecord.doctorName}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Amount</p>
                    <p className="text-base font-semibold text-gray-900">{formatCurrency(selectedRecord.amount)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Net Amount</p>
                    <p className="text-base font-semibold text-gray-900">{formatCurrency(selectedRecord.netAmount)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Payment Method</p>
                    <p className="text-base font-semibold text-gray-900">{selectedRecord.paymentMethod}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Payment Gateway</p>
                    <p className="text-base font-semibold text-gray-900">{selectedRecord.paymentGateway}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Status</p>
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(selectedRecord.paymentStatus)}`}>
                      {getStatusIcon(selectedRecord.paymentStatus)}
                      {selectedRecord.paymentStatus}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Payment Date</p>
                    <p className="text-base font-semibold text-gray-900">{formatDate(selectedRecord.paymentDate)}</p>
                  </div>
                </div>
                {selectedRecord.remarks && (
                  <div>
                    <p className="text-sm font-medium text-gray-500">Remarks</p>
                    <p className="text-base text-gray-900 mt-1">{selectedRecord.remarks}</p>
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