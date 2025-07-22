import React, { useState, useEffect, FormEvent } from 'react';
import { 
  CreditCard, 
  DollarSign, 
  AlertCircle, 
  CheckCircle, 
  Clock, 
  Plus, 
  Eye, 
  Calendar, 
  TrendingUp, 
  TrendingDown,
  Receipt,
  Search,
  Filter,
  Download,
  RefreshCw,
  X,
  IndianRupee,
  Wallet,
  PiggyBank,
  Users,
  Building
} from 'lucide-react';

// Types
interface DuesSummary {
  total_dues: number;
  total_paid: number;
  remaining_dues: number;
}

interface PaymentOrder {
  amount: number;
  amount_due: number;
  amount_paid: number;
  attempts: number;
  created_at: number;
  currency: string;
  entity: string;
  id: string;
  notes: any[];
  offer_id: string | null;
  receipt: string | null;
  status: string;
}

interface Transaction {
  id: string;
  clinic_id: string;
  clinic_name: string;
  amount: number;
  status: 'CREATED' | 'COMPLETED' | 'FAILED' | 'PENDING';
  created_at: string;
  updated_at: string;
  payment_order?: PaymentOrder;
  description: string;
  type: 'PAYMENT' | 'DUE' | 'REFUND';
}

interface Clinic {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  current_dues: number;
  total_paid: number;
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
}

// Simulated bookings data
interface Booking {
  id: string;
  clinic_id: string;
  clinic_name: string;
  patient_name: string;
  date: string;
  amount_due: number;
  total_cost: number;
  service_details: string;
  mode_of_consultation: 'Online' | 'In-Clinic';
  status: 'NEW' | 'COMPLETED' | 'CANCELLED';
  is_past_due?: boolean;
}

// Sample data
const sampleClinics: Clinic[] = [
  {
    id: "5a1f8f39-ca38-464c-93c5-ea8edbd6c03f",
    name: "MediCare Clinic",
    email: "admin@medicare.com",
    phone: "9876543210",
    address: "123 Health Street, Medical District",
    current_dues: 2500,
    total_paid: 7500,
    status: "ACTIVE"
  },
  {
    id: "7b2e9e4a-db49-575d-a4c6-fb9fced7d14g",
    name: "City Health Center",
    email: "contact@cityhealth.com",
    phone: "9876543211",
    address: "456 Care Avenue, Downtown",
    current_dues: 1800,
    total_paid: 12000,
    status: "ACTIVE"
  },
  {
    id: "8c3f0f5b-ec5a-686e-b5d7-gca0ged8e25h",
    name: "Family Wellness Clinic",
    email: "info@familywellness.com",
    phone: "9876543212",
    address: "789 Wellness Road, Suburbs",
    current_dues: 600,
    total_paid: 5400,
    status: "ACTIVE"
  }
];

const sampleTransactions: Transaction[] = [
  {
    id: "txn_001",
    clinic_id: "5a1f8f39-ca38-464c-93c5-ea8edbd6c03f",
    clinic_name: "MediCare Clinic",
    amount: 2000,
    status: "COMPLETED",
    created_at: "2025-01-15T10:30:00Z",
    updated_at: "2025-01-15T10:35:00Z",
    description: "Monthly subscription payment",
    type: "PAYMENT"
  },
  {
    id: "txn_002",
    clinic_id: "7b2e9e4a-db49-575d-a4c6-fb9fced7d14g",
    clinic_name: "City Health Center",
    amount: 1500,
    status: "PENDING",
    created_at: "2025-01-14T15:20:00Z",
    updated_at: "2025-01-14T15:20:00Z",
    description: "Service charges",
    type: "DUE"
  },
  {
    id: "txn_003",
    clinic_id: "8c3f0f5b-ec5a-686e-b5d7-gca0ged8e25h",
    clinic_name: "Family Wellness Clinic",
    amount: 800,
    status: "FAILED",
    created_at: "2025-01-13T09:15:00Z",
    updated_at: "2025-01-13T09:18:00Z",
    description: "Platform fees",
    type: "PAYMENT"
  }
];

export const sampleBookings: Booking[] = [
  {
    id: 'bk_001',
    clinic_id: '5a1f8f39-ca38-464c-93c5-ea8edbd6c03f',
    clinic_name: 'MediCare Clinic',
    patient_name: 'John Doe',
    date: '2025-01-16T09:00:00Z',
    amount_due: 500,
    total_cost: 1200,
    service_details: 'General Consultation',
    mode_of_consultation: 'Online',
    status: 'NEW',
  },
  {
    id: 'bk_002',
    clinic_id: '7b2e9e4a-db49-575d-a4c6-fb9fced7d14g',
    clinic_name: 'City Health Center',
    patient_name: 'Jane Smith',
    date: '2025-01-16T10:30:00Z',
    amount_due: 700,
    total_cost: 1500,
    service_details: 'Dental Checkup',
    mode_of_consultation: 'In-Clinic',
    status: 'NEW',
  },
  {
    id: 'bk_003',
    clinic_id: '8c3f0f5b-ec5a-686e-b5d7-gca0ged8e25h',
    clinic_name: 'Family Wellness Clinic',
    patient_name: 'Alice Brown',
    date: '2025-01-15T14:00:00Z',
    amount_due: 300,
    total_cost: 900,
    service_details: 'Pediatric Consultation',
    mode_of_consultation: 'Online',
    status: 'COMPLETED',
  },
  // Past due bookings
  {
    id: 'bk_004',
    clinic_id: '5a1f8f39-ca38-464c-93c5-ea8edbd6c03f',
    clinic_name: 'MediCare Clinic',
    patient_name: 'Robert Wilson',
    date: '2025-01-10T11:00:00Z',
    amount_due: 800,
    total_cost: 1600,
    service_details: 'Cardiology Consultation',
    mode_of_consultation: 'In-Clinic',
    status: 'COMPLETED',
    is_past_due: true,
  },
  {
    id: 'bk_005',
    clinic_id: '7b2e9e4a-db49-575d-a4c6-fb9fced7d14g',
    clinic_name: 'City Health Center',
    patient_name: 'Sarah Johnson',
    date: '2025-01-08T13:30:00Z',
    amount_due: 1200,
    total_cost: 2000,
    service_details: 'Orthopedic Surgery',
    mode_of_consultation: 'In-Clinic',
    status: 'COMPLETED',
    is_past_due: true,
  },
  {
    id: 'bk_006',
    clinic_id: '8c3f0f5b-ec5a-686e-b5d7-gca0ged8e25h',
    clinic_name: 'Family Wellness Clinic',
    patient_name: 'Michael Davis',
    date: '2025-01-05T09:15:00Z',
    amount_due: 450,
    total_cost: 950,
    service_details: 'Dermatology Consultation',
    mode_of_consultation: 'Online',
    status: 'COMPLETED',
    is_past_due: true,
  },
  {
    id: 'bk_007',
    clinic_id: '5a1f8f39-ca38-464c-93c5-ea8edbd6c03f',
    clinic_name: 'MediCare Clinic',
    patient_name: 'Emily Chen',
    date: '2025-01-03T16:45:00Z',
    amount_due: 650,
    total_cost: 1300,
    service_details: 'Neurology Consultation',
    mode_of_consultation: 'In-Clinic',
    status: 'COMPLETED',
    is_past_due: true,
  },
  {
    id: 'bk_008',
    clinic_id: '7b2e9e4a-db49-575d-a4c6-fb9fced7d14g',
    clinic_name: 'City Health Center',
    patient_name: 'David Thompson',
    date: '2025-01-01T10:00:00Z',
    amount_due: 950,
    total_cost: 1800,
    service_details: 'Gastroenterology Consultation',
    mode_of_consultation: 'Online',
    status: 'COMPLETED',
    is_past_due: true,
  },
];

const DuesManagement: React.FC = () => {
  // State management
  const [duesSummary, setDuesSummary] = useState<DuesSummary>({
    total_dues: 5500,
    total_paid: 600,
    remaining_dues: 4900
  });
  
  const [clinics, setClinics] = useState<Clinic[]>(sampleClinics);
  const [transactions, setTransactions] = useState<Transaction[]>(sampleTransactions);
  const [selectedClinic, setSelectedClinic] = useState<Clinic | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [bookings, setBookings] = useState<Booking[]>(sampleBookings);
  const [showPaymentHistoryModal, setShowPaymentHistoryModal] = useState(false);
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [clinicFilter, setClinicFilter] = useState('');
  const [dateRange, setDateRange] = useState('all');
  
  // Payment form state
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentDescription, setPaymentDescription] = useState('');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  // Payment History modal enhancements
  const [paymentHistorySearch, setPaymentHistorySearch] = useState('');
  const [paymentHistoryStatus, setPaymentHistoryStatus] = useState('');

  // Filtered payment transactions for modal
  const filteredPaymentTransactions = transactions.filter((transaction) => {
    const matchesSearch =
      transaction.clinic_name.toLowerCase().includes(paymentHistorySearch.toLowerCase()) ||
      transaction.id.toLowerCase().includes(paymentHistorySearch.toLowerCase());
    const matchesStatus = paymentHistoryStatus ? transaction.status === paymentHistoryStatus : true;
    return matchesSearch && matchesStatus;
  });

  // Export to CSV
  const exportPaymentHistoryToCSV = () => {
    const headers = ['Transaction ID', 'Clinic', 'Amount', 'Status', 'Date', 'Description'];
    const rows = filteredPaymentTransactions.map((t) => [
      t.id,
      t.clinic_name,
      t.amount,
      t.status,
      formatDate(t.created_at),
      t.description
    ]);
    let csvContent = headers.join(',') + '\n' + rows.map(r => r.map(x => '"' + String(x).replace(/"/g, '""') + '"').join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'payment_history.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  // Helper functions
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'COMPLETED': return {
        color: 'bg-emerald-500/10 text-emerald-700 border-emerald-500/20',
        dot: 'bg-emerald-500',
        icon: CheckCircle
      };
      case 'PENDING': case 'CREATED': return {
        color: 'bg-amber-500/10 text-amber-700 border-amber-500/20',
        dot: 'bg-amber-500',
        icon: Clock
      };
      case 'FAILED': return {
        color: 'bg-red-500/10 text-red-700 border-red-500/20',
        dot: 'bg-red-500',
        icon: AlertCircle
      };
      case 'ACTIVE': return {
        color: 'bg-emerald-500/10 text-emerald-700 border-emerald-500/20',
        dot: 'bg-emerald-500',
        icon: CheckCircle
      };
      case 'INACTIVE': return {
        color: 'bg-slate-500/10 text-slate-700 border-slate-500/20',
        dot: 'bg-slate-500',
        icon: Clock
      };
      case 'SUSPENDED': return {
        color: 'bg-red-500/10 text-red-700 border-red-500/20',
        dot: 'bg-red-500',
        icon: AlertCircle
      };
      default: return {
        color: 'bg-slate-500/10 text-slate-700 border-slate-500/20',
        dot: 'bg-slate-500',
        icon: AlertCircle
      };
    }
  };

  // API simulation functions
  const initiatePayment = async (clinicId: string, amount: number) => {
    setIsProcessingPayment(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const newTransaction: Transaction = {
      id: `txn_${Date.now()}`,
      clinic_id: clinicId,
      clinic_name: clinics.find(c => c.id === clinicId)?.name || 'Unknown Clinic',
      amount: amount,
      status: 'CREATED',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      description: paymentDescription || 'Manual payment',
      type: 'PAYMENT',
      payment_order: {
        amount: amount * 100, // Convert to paise
        amount_due: amount * 100,
        amount_paid: 0,
        attempts: 0,
        created_at: Math.floor(Date.now() / 1000),
        currency: "INR",
        entity: "order",
        id: `order_${Math.random().toString(36).substr(2, 9)}`,
        notes: [],
        offer_id: null,
        receipt: null,
        status: "created"
      }
    };
    
    setTransactions([newTransaction, ...transactions]);
    setIsProcessingPayment(false);
    setShowPaymentModal(false);
    setPaymentAmount('');
    setPaymentDescription('');
    setSelectedClinic(null);
  };

  const refreshDuesSummary = async () => {
    // Simulate API call to refresh dues summary
    const totalDues = clinics.reduce((sum, clinic) => sum + clinic.current_dues, 0);
    const totalPaid = clinics.reduce((sum, clinic) => sum + clinic.total_paid, 0);
    
    setDuesSummary({
      total_dues: totalDues,
      total_paid: totalPaid,
      remaining_dues: totalDues
    });
  };

  // Filter transactions
  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.clinic_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter ? transaction.status === statusFilter : true;
    const matchesClinic = clinicFilter ? transaction.clinic_id === clinicFilter : true;
    
    return matchesSearch && matchesStatus && matchesClinic;
  });

  // Filter bookings for new bookings with dues
  const newBookingsWithDues = bookings.filter(
    (b) => b.status === 'NEW' && b.amount_due > 0
  );

  // Pagination logic
  const [currentBookingPage, setCurrentBookingPage] = useState(1);
  const [currentPastDuePage, setCurrentPastDuePage] = useState(1);
  const bookingsPerPage = 3;
  const allBookingsWithDues = bookings.filter((b) => b.amount_due > 0 && !b.is_past_due);
  const allPastDueBookings = bookings.filter((b) => b.amount_due > 0 && b.is_past_due);
  const totalBookingPages = Math.ceil(allBookingsWithDues.length / bookingsPerPage);
  const totalPastDuePages = Math.ceil(allPastDueBookings.length / bookingsPerPage);
  const paginatedBookings = allBookingsWithDues.slice(
    (currentBookingPage - 1) * bookingsPerPage,
    currentBookingPage * bookingsPerPage
  );
  const paginatedPastDueBookings = allPastDueBookings.slice(
    (currentPastDuePage - 1) * bookingsPerPage,
    currentPastDuePage * bookingsPerPage
  );

  useEffect(() => {
    refreshDuesSummary();
  }, [clinics]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      {/* Header */}
      <div className="backdrop-blur-xl bg-white/80 border-b border-slate-200/60 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center space-x-8">
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 via-slate-800 to-slate-600 bg-clip-text text-transparent">
                  Dues Management
                </h1>
                <p className="text-sm text-slate-500 mt-1">Track payments and manage clinic dues</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 sm:space-x-4 mt-2 sm:mt-0">
              <button
                onClick={refreshDuesSummary}
                className="p-3 sm:p-4 rounded-2xl bg-gradient-to-r from-slate-100 to-slate-200 hover:from-slate-200 hover:to-slate-300 text-slate-700 transition-all duration-200 shadow-sm hover:shadow-md"
              >
                <RefreshCw className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 py-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mb-8 sm:mb-12">
          {/* Total Due amount to Clinzor */}
          <div className="group bg-white/90 backdrop-blur-xl rounded-3xl border border-slate-200/60 p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between mb-6">
              <div className="p-4 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                <DollarSign className="w-7 h-7 text-white" />
              </div>
              <div className="text-right">
                <p className="text-sm sm:text-base text-slate-600 font-semibold mb-1">Total Due to Clinzor</p>
                <p className="text-2xl sm:text-3xl font-bold text-slate-900">{formatCurrency(duesSummary.total_dues)}</p>
              </div>
            </div>
            <div className="flex items-center">
              <TrendingUp className="w-5 h-5 text-blue-500 mr-2" />
              <span className="text-sm sm:text-base text-blue-600 font-semibold">Outstanding</span>
            </div>
          </div>
          {/* Total Bookings Made */}
          <div className="group bg-white/90 backdrop-blur-xl rounded-3xl border border-slate-200/60 p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between mb-6">
              <div className="p-4 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                <Calendar className="w-7 h-7 text-white" />
              </div>
              <div className="text-right">
                <p className="text-sm sm:text-base text-slate-600 font-semibold mb-1">Total Bookings</p>
                <p className="text-2xl sm:text-3xl font-bold text-slate-900">{bookings.length}</p>
              </div>
            </div>
            <div className="flex items-center">
              <TrendingUp className="w-5 h-5 text-green-500 mr-2" />
              <span className="text-sm sm:text-base text-green-600 font-semibold">Bookings</span>
            </div>
          </div>
          {/* Total Amount Paid to Clinzor */}
          <div className="group bg-white/90 backdrop-blur-xl rounded-3xl border border-slate-200/60 p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between mb-6">
              <div className="p-4 bg-gradient-to-r from-emerald-500 to-green-600 rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                <CheckCircle className="w-7 h-7 text-white" />
              </div>
              <div className="text-right">
                <p className="text-sm sm:text-base text-slate-600 font-semibold mb-1">Total Paid to Clinzor</p>
                <p className="text-2xl sm:text-3xl font-bold text-slate-900">{formatCurrency(duesSummary.total_paid)}</p>
              </div>
            </div>
            <div className="flex items-center">
              <TrendingUp className="w-5 h-5 text-emerald-500 mr-2" />
              <span className="text-sm sm:text-base text-emerald-600 font-semibold">Collected</span>
            </div>
          </div>
          {/* Payment History */}
          <div className="group bg-white/90 backdrop-blur-xl rounded-3xl border border-slate-200/60 p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 cursor-pointer" onClick={() => setShowPaymentHistoryModal(true)}>
            <div className="flex items-center justify-between mb-6">
              <div className="p-4 bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                <Receipt className="w-7 h-7 text-white" />
              </div>
              <div className="text-right">
                <p className="text-sm sm:text-base text-slate-600 font-semibold mb-1">Payment History</p>
                <p className="text-2xl sm:text-3xl font-bold text-slate-900">View</p>
              </div>
            </div>
            <div className="flex items-center">
              <TrendingUp className="w-5 h-5 text-purple-500 mr-2" />
              <span className="text-sm sm:text-base text-purple-600 font-semibold">History</span>
            </div>
          </div>
        </div>

        {/* Filters Section - match DoctorManagement style */}
        <div className="bg-white/80 border border-slate-200 rounded-2xl shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-4">
            {/* Search Bar */}
            <div className="xl:col-span-2">
              <label className="text-xs font-semibold text-slate-600 mb-1 ml-1 block">Search</label>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search transactions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-white/80 backdrop-blur-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all duration-200 text-slate-700 placeholder-slate-400"
                />
              </div>
            </div>
            {/* Status Filter */}
            <div>
              <label className="text-xs font-semibold text-slate-600 mb-1 ml-1 block">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white/80 text-slate-700 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all duration-200"
              >
                <option value="">All Status</option>
                <option value="COMPLETED">Completed</option>
                <option value="PENDING">Pending</option>
                <option value="CREATED">Created</option>
                <option value="FAILED">Failed</option>
              </select>
            </div>
            {/* Clinic Filter */}
            <div>
              <label className="text-xs font-semibold text-slate-600 mb-1 ml-1 block">Clinic</label>
              <select
                value={clinicFilter}
                onChange={(e) => setClinicFilter(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white/80 text-slate-700 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all duration-200"
              >
                <option value="">All Clinics</option>
                {clinics.map(clinic => (
                  <option key={clinic.id} value={clinic.id}>{clinic.name}</option>
                ))}
              </select>
            </div>
            {/* Date Range Filter */}
            <div>
              <label className="text-xs font-semibold text-slate-600 mb-1 ml-1 block">Date Range</label>
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white/80 text-slate-700 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all duration-200"
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
              </select>
            </div>
          </div>
        </div>

        {/* New Bookings with Dues to Clinzor */}
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl border border-slate-200/60 p-6 sm:p-8 mb-8 sm:mb-12 shadow-xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 sm:mb-8 gap-4 sm:gap-0">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl shadow-lg">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900">New Bookings with Dues to Clinzor</h2>
                <p className="text-sm text-slate-600 mt-1">Recent bookings requiring payment</p>
              </div>
            </div>
          </div>
          <div className="space-y-6 sm:space-y-8">
            {paginatedBookings.length === 0 ? (
              <div className="text-center py-16 sm:py-20">
                <div className="w-20 h-20 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
                  <Calendar className="w-10 h-10 text-blue-500" />
                </div>
                <h3 className="text-xl sm:text-2xl font-semibold text-slate-900 mb-3">No bookings with dues</h3>
                <p className="text-slate-600 text-base">All bookings are settled</p>
              </div>
            ) : (
              paginatedBookings.map((booking, index) => {
                const activeDue = booking.amount_due > 0 && booking.status === 'NEW';
                return (
                  <div 
                    key={booking.id} 
                    className="group flex flex-col sm:flex-row items-start sm:items-center justify-between p-6 sm:p-8 bg-gradient-to-br from-blue-50 via-white to-indigo-50 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 gap-6 sm:gap-0 border border-slate-200/70 hover:-translate-y-1"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="flex items-center space-x-6 sm:space-x-8">
                      <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <Calendar className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900 text-lg sm:text-xl mb-1">{booking.patient_name}</h3>
                        <p className="text-sm sm:text-base text-slate-600 font-semibold mb-2">{booking.clinic_name}</p>
                        <p className="text-sm text-slate-500 mb-1">{booking.service_details}</p>
                        <p className="text-sm text-slate-500 font-medium">{formatDate(booking.date)}</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center space-x-8 sm:space-x-12 mt-4 sm:mt-0">
                      <div className="text-right">
                        <p className="text-sm text-slate-600 font-medium mb-1">Total Cost</p>
                        <p className="font-bold text-slate-800 text-lg sm:text-xl">{formatCurrency(booking.total_cost)}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-slate-600 font-medium mb-1">Due to Clinzor</p>
                        <p className="font-bold text-red-600 text-lg sm:text-xl">{formatCurrency(booking.amount_due)}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-slate-600 font-medium mb-1">Mode</p>
                        <p className="font-bold text-blue-600 text-lg sm:text-xl">{booking.mode_of_consultation}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-slate-600 font-medium mb-1">Active Due</p>
                        <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-bold border shadow-sm ${activeDue ? 'bg-amber-500/10 text-amber-700 border-amber-500/20' : 'bg-emerald-500/10 text-emerald-700 border-emerald-500/20'}`}>
                          {activeDue ? 'Yes' : 'No'}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
          {/* Pagination Controls */}
          {totalBookingPages > 1 && (
            <div className="flex justify-center items-center mt-10 space-x-3">
              <button
                onClick={() => setCurrentBookingPage((p) => Math.max(1, p - 1))}
                disabled={currentBookingPage === 1}
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-slate-100 to-slate-200 hover:from-slate-200 hover:to-slate-300 text-slate-700 font-semibold disabled:opacity-50 transition-all duration-200 shadow-sm hover:shadow-md"
              >
                Previous
              </button>
              <span className="px-6 py-3 text-slate-700 font-semibold bg-white rounded-2xl shadow-sm">Page {currentBookingPage} of {totalBookingPages}</span>
              <button
                onClick={() => setCurrentBookingPage((p) => Math.min(totalBookingPages, p + 1))}
                disabled={currentBookingPage === totalBookingPages}
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-slate-100 to-slate-200 hover:from-slate-200 hover:to-slate-300 text-slate-700 font-semibold disabled:opacity-50 transition-all duration-200 shadow-sm hover:shadow-md"
              >
                Next
              </button>
            </div>
          )}
        </div>

        {/* Past Due Bookings */}
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl border border-slate-200/60 p-6 sm:p-8 mb-8 sm:mb-12 shadow-xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 sm:mb-8 gap-4 sm:gap-0">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-r from-red-500 to-orange-600 rounded-2xl shadow-lg">
                <AlertCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Past Due Bookings</h2>
                <p className="text-sm text-slate-600 mt-1">Overdue payments requiring attention</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-4 h-4 bg-red-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-red-600 font-semibold">Overdue Payments</span>
            </div>
          </div>
          <div className="space-y-6 sm:space-y-8">
            {paginatedPastDueBookings.length === 0 ? (
              <div className="text-center py-16 sm:py-20">
                <div className="w-20 h-20 bg-gradient-to-r from-green-100 to-emerald-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-10 h-10 text-green-500" />
                </div>
                <h3 className="text-xl sm:text-2xl font-semibold text-slate-900 mb-3">No past due bookings</h3>
                <p className="text-slate-600 text-base">All payments are up to date</p>
              </div>
            ) : (
              paginatedPastDueBookings.map((booking, index) => {
                const daysOverdue = Math.floor((Date.now() - new Date(booking.date).getTime()) / (1000 * 60 * 60 * 24));
                return (
                  <div 
                    key={booking.id} 
                    className="group flex flex-col sm:flex-row items-start sm:items-center justify-between p-6 sm:p-8 bg-gradient-to-br from-red-50 via-white to-orange-50 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 gap-6 sm:gap-0 border border-red-200/70 hover:-translate-y-1"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="flex items-center space-x-6 sm:space-x-8">
                      <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <AlertCircle className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900 text-lg sm:text-xl mb-1">{booking.patient_name}</h3>
                        <p className="text-sm sm:text-base text-slate-600 font-semibold mb-2">{booking.clinic_name}</p>
                        <p className="text-sm text-slate-500 mb-1">{booking.service_details}</p>
                        <p className="text-sm text-red-600 font-semibold">{formatDate(booking.date)} • {daysOverdue} days overdue</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center space-x-8 sm:space-x-12 mt-4 sm:mt-0">
                      <div className="text-right">
                        <p className="text-sm text-slate-600 font-medium mb-1">Total Cost</p>
                        <p className="font-bold text-slate-800 text-lg sm:text-xl">{formatCurrency(booking.total_cost)}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-slate-600 font-medium mb-1">Overdue Amount</p>
                        <p className="font-bold text-red-600 text-lg sm:text-xl">{formatCurrency(booking.amount_due)}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-slate-600 font-medium mb-1">Mode</p>
                        <p className="font-bold text-blue-600 text-lg sm:text-xl">{booking.mode_of_consultation}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-slate-600 font-medium mb-1">Status</p>
                        <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-bold border shadow-sm bg-red-500/10 text-red-700 border-red-500/20">
                          <AlertCircle className="w-3 h-3 mr-1" />
                          Past Due
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
          {/* Pagination Controls for Past Due */}
          {totalPastDuePages > 1 && (
            <div className="flex justify-center items-center mt-10 space-x-3">
              <button
                onClick={() => setCurrentPastDuePage((p) => Math.max(1, p - 1))}
                disabled={currentPastDuePage === 1}
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-slate-100 to-slate-200 hover:from-slate-200 hover:to-slate-300 text-slate-700 font-semibold disabled:opacity-50 transition-all duration-200 shadow-sm hover:shadow-md"
              >
                Previous
              </button>
              <span className="px-6 py-3 text-slate-700 font-semibold bg-white rounded-2xl shadow-sm">Page {currentPastDuePage} of {totalPastDuePages}</span>
              <button
                onClick={() => setCurrentPastDuePage((p) => Math.min(totalPastDuePages, p + 1))}
                disabled={currentPastDuePage === totalPastDuePages}
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-slate-100 to-slate-200 hover:from-slate-200 hover:to-slate-300 text-slate-700 font-semibold disabled:opacity-50 transition-all duration-200 shadow-sm hover:shadow-md"
              >
                Next
              </button>
            </div>
          )}
        </div>

        {/* Clinics Overview */}
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl border border-slate-200/60 p-6 sm:p-8 mb-8 sm:mb-12 shadow-xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 sm:mb-8 gap-4 sm:gap-0">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl shadow-lg">
                <Building className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Service Overview</h2>
                <p className="text-sm text-slate-600 mt-1">Clinic performance and payment status</p>
              </div>
            </div>
            <button className="px-4 py-2 rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 shadow-sm hover:shadow-md">
              View All
            </button>
          </div>
          <div className="space-y-4 sm:space-y-6">
            {clinics.slice(0, 3).map((clinic, index) => {
              const statusConfig = getStatusConfig(clinic.status);
              const StatusIcon = statusConfig.icon;
              
              return (
                <div 
                  key={clinic.id} 
                  className="group flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 sm:p-6 bg-gradient-to-r from-slate-50 to-slate-100 rounded-2xl hover:from-slate-100 hover:to-slate-200 transition-all duration-300 gap-4 sm:gap-0 border border-slate-200/50 hover:shadow-lg"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-center space-x-4 sm:space-x-6">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <Building className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-base sm:text-lg mb-1">{clinic.name}</h3>
                      <p className="text-sm text-slate-600 font-medium">{clinic.email}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center space-x-6 sm:space-x-8 mt-3 sm:mt-0">
                    <div className="text-right">
                      <p className="text-sm text-slate-600 font-medium mb-1">Current Dues</p>
                      <p className="font-bold text-red-600 text-base sm:text-lg">{formatCurrency(clinic.current_dues)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-slate-600 font-medium mb-1">Total Paid</p>
                      <p className="font-bold text-emerald-600 text-base sm:text-lg">{formatCurrency(clinic.total_paid)}</p>
                    </div>
                    <span className={`inline-flex items-center px-3 py-2 rounded-full text-sm font-bold border shadow-sm ${statusConfig.color}`}>
                      <StatusIcon className="w-4 h-4 mr-1" />
                      {clinic.status}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Transactions List */}
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl border border-slate-200 shadow-xl overflow-x-auto">
          <div className="p-6 sm:p-8 border-b border-slate-200">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl shadow-lg">
                  <Receipt className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Recent Transactions</h2>
                  <p className="text-sm text-slate-600 mt-1">Payment and transaction history</p>
                </div>
              </div>
              <div className="flex items-center space-x-2 sm:space-x-3">
                <button className="p-3 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-2xl transition-all duration-200 shadow-sm hover:shadow-md">
                  <Download className="w-5 h-5" />
                </button>
                <button className="p-3 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-2xl transition-all duration-200 shadow-sm hover:shadow-md">
                  <Filter className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px] sm:min-w-full text-sm sm:text-base">
              <thead className="bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200">
                <tr>
                  <th className="text-left py-4 sm:py-6 px-4 sm:px-8 text-sm font-bold text-slate-700 uppercase tracking-wider">Transaction</th>
                  <th className="text-left py-4 sm:py-6 px-4 sm:px-8 text-sm font-bold text-slate-700 uppercase tracking-wider">Service</th>
                  <th className="text-left py-4 sm:py-6 px-4 sm:px-8 text-sm font-bold text-slate-700 uppercase tracking-wider">Amount</th>
                  <th className="text-left py-4 sm:py-6 px-4 sm:px-8 text-sm font-bold text-slate-700 uppercase tracking-wider">Status</th>
                  <th className="text-left py-4 sm:py-6 px-4 sm:px-8 text-sm font-bold text-slate-700 uppercase tracking-wider">Date</th>
                  <th className="text-left py-4 sm:py-6 px-4 sm:px-8 text-sm font-bold text-slate-700 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredTransactions.map((transaction, index) => {
                  const statusConfig = getStatusConfig(transaction.status);
                  const StatusIcon = statusConfig.icon;
                  
                  return (
                    <tr key={transaction.id} className="hover:bg-slate-50 transition-all duration-200 group">
                      <td className="py-4 sm:py-6 px-4 sm:px-8">
                        <div className="flex items-center space-x-3 sm:space-x-4">
                          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300">
                            <Receipt className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 text-sm sm:text-base">{transaction.id}</p>
                            <p className="text-sm text-slate-600 font-medium">{transaction.description}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 sm:py-6 px-4 sm:px-8">
                        <p className="font-semibold text-slate-900 text-sm sm:text-base">{transaction.clinic_name}</p>
                        <p className="text-sm text-slate-600 capitalize font-medium">{transaction.type.toLowerCase()}</p>
                      </td>
                      <td className="py-4 sm:py-6 px-4 sm:px-8">
                        <p className="font-bold text-slate-900 text-lg sm:text-xl">{formatCurrency(transaction.amount)}</p>
                      </td>
                      <td className="py-4 sm:py-6 px-4 sm:px-8">
                        <span className={`inline-flex items-center px-3 py-2 rounded-full text-sm font-bold border shadow-sm ${statusConfig.color}`}>
                          <StatusIcon className="w-4 h-4 mr-1" />
                          {transaction.status}
                        </span>
                      </td>
                      <td className="py-4 sm:py-6 px-4 sm:px-8">
                        <p className="text-sm text-slate-600 font-medium">{formatDate(transaction.created_at)}</p>
                      </td>
                      <td className="py-4 sm:py-6 px-4 sm:px-8">
                        <button
                          onClick={() => {
                            setSelectedTransaction(transaction);
                            setShowTransactionModal(true);
                          }}
                          className="p-3 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-2xl transition-all duration-200 shadow-sm hover:shadow-md"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {filteredTransactions.length === 0 && (
            <div className="text-center py-12 sm:py-16">
              <div className="w-20 h-20 bg-gradient-to-r from-slate-100 to-slate-200 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <Receipt className="w-10 h-10 text-slate-400" />
              </div>
              <h3 className="text-xl sm:text-2xl font-semibold text-slate-900 mb-3">No transactions found</h3>
              <p className="text-slate-600 text-base">Try adjusting your search criteria</p>
            </div>
          )}
        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 z-50">
          <div className="bg-white/95 backdrop-blur-xl rounded-3xl w-full max-w-sm sm:max-w-md border border-white/20 shadow-2xl relative">
            <button
              onClick={() => {
                setShowPaymentModal(false);
                setSelectedClinic(null);
                setPaymentAmount('');
                setPaymentDescription('');
              }}
              className="absolute top-3 right-3 sm:top-4 sm:right-4 p-2 rounded-full hover:bg-slate-100 text-slate-500 hover:text-slate-900 transition"
            >
              <X className="w-6 h-6" />
            </button>
            
            <div className="p-4 sm:p-8">
              <div className="text-center mb-6 sm:mb-8">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <CreditCard className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-1 sm:mb-2">Initiate Payment</h2>
                <p className="text-slate-500 text-xs sm:text-sm">Create a new payment transaction</p>
              </div>

              <form onSubmit={(e: FormEvent<HTMLFormElement>) => {
                e.preventDefault();
                if (!selectedClinic) return;
                if (!paymentAmount || isNaN(Number(paymentAmount)) || Number(paymentAmount) <= 0) return;
                initiatePayment(selectedClinic.id, Number(paymentAmount));
              }}>
                <div className="mb-3 sm:mb-4">
                  <label className="block text-xs sm:text-sm font-medium text-slate-700 mb-1">Clinic</label>
                  <input
                    type="text"
                    value={selectedClinic ? selectedClinic.name : ''}
                    disabled
                    className="w-full px-3 sm:px-4 py-2 bg-slate-100 border border-slate-200 rounded-lg text-slate-700 text-xs sm:text-sm"
                  />
                </div>
                <div className="mb-3 sm:mb-4">
                  <label className="block text-xs sm:text-sm font-medium text-slate-700 mb-1">Amount (INR)</label>
                  <input
                    type="number"
                    min="1"
                    value={paymentAmount}
                    onChange={e => setPaymentAmount(e.target.value)}
                    required
                    className="w-full px-3 sm:px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 text-xs sm:text-sm"
                  />
                </div>
                <div className="mb-4 sm:mb-6">
                  <label className="block text-xs sm:text-sm font-medium text-slate-700 mb-1">Description</label>
                  <input
                    type="text"
                    value={paymentDescription}
                    onChange={e => setPaymentDescription(e.target.value)}
                    placeholder="Payment for..."
                    className="w-full px-3 sm:px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 text-xs sm:text-sm"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isProcessingPayment}
                  className={`w-full py-2.5 sm:py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg ${isProcessingPayment ? 'opacity-60 cursor-not-allowed' : ''}`}
                >
                  {isProcessingPayment ? 'Processing...' : 'Initiate Payment'}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Transaction Modal */}
      {showTransactionModal && selectedTransaction && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 z-50">
          <div className="bg-white/95 backdrop-blur-xl rounded-3xl w-full max-w-sm sm:max-w-md border border-white/20 shadow-2xl relative">
            <button
              onClick={() => {
                setShowTransactionModal(false);
                setSelectedTransaction(null);
              }}
              className="absolute top-3 right-3 sm:top-4 sm:right-4 p-2 rounded-full hover:bg-slate-100 text-slate-500 hover:text-slate-900 transition"
            >
              <X className="w-6 h-6" />
            </button>
            <div className="p-4 sm:p-8">
              <div className="text-center mb-6 sm:mb-8">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <Receipt className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-1 sm:mb-2">Transaction Details</h2>
                <p className="text-slate-500 text-xs sm:text-sm">Review the transaction information</p>
              </div>
              <div className="space-y-3 sm:space-y-4">
                <div>
                  <span className="block text-xs text-slate-500 font-medium mb-1">Transaction ID</span>
                  <span className="font-mono text-xs sm:text-sm text-slate-900">{selectedTransaction.id}</span>
                </div>
                <div>
                  <span className="block text-xs text-slate-500 font-medium mb-1">Clinic</span>
                  <span className="text-xs sm:text-sm text-slate-900">{selectedTransaction.clinic_name}</span>
                </div>
                <div>
                  <span className="block text-xs text-slate-500 font-medium mb-1">Amount</span>
                  <span className="text-xs sm:text-sm text-slate-900">{formatCurrency(selectedTransaction.amount)}</span>
                </div>
                <div>
                  <span className="block text-xs text-slate-500 font-medium mb-1">Status</span>
                  <span className="text-xs sm:text-sm text-slate-900">{selectedTransaction.status}</span>
                </div>
                <div>
                  <span className="block text-xs text-slate-500 font-medium mb-1">Date</span>
                  <span className="text-xs sm:text-sm text-slate-900">{formatDate(selectedTransaction.created_at)}</span>
                </div>
                <div>
                  <span className="block text-xs text-slate-500 font-medium mb-1">Description</span>
                  <span className="text-xs sm:text-sm text-slate-900">{selectedTransaction.description}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Payment History Modal */}
      {showPaymentHistoryModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 z-50">
          <div className="bg-white/95 backdrop-blur-xl rounded-3xl w-full max-w-4xl border border-white/20 shadow-2xl relative flex flex-col max-h-[90vh]">
            <button
              onClick={() => setShowPaymentHistoryModal(false)}
              className="absolute top-3 right-3 sm:top-4 sm:right-4 p-2 rounded-full hover:bg-slate-100 text-slate-500 hover:text-slate-900 transition"
            >
              <X className="w-6 h-6" />
            </button>
            <div className="p-2 sm:p-6 flex-1 flex flex-col overflow-hidden">
              <div className="text-center mb-6 sm:mb-8">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <Receipt className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-1 sm:mb-2">Payment History</h2>
                <p className="text-slate-500 text-xs sm:text-sm">All payment transactions</p>
              </div>
              {/* Search and Filter Controls */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-4 w-full">
                <input
                  type="text"
                  placeholder="Search by clinic or transaction ID..."
                  value={paymentHistorySearch}
                  onChange={e => setPaymentHistorySearch(e.target.value)}
                  className="w-full sm:w-1/2 px-3 py-2 border border-slate-200 rounded-lg text-xs sm:text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
                />
                <select
                  value={paymentHistoryStatus}
                  onChange={e => setPaymentHistoryStatus(e.target.value)}
                  className="w-full sm:w-1/4 px-3 py-2 border border-slate-200 rounded-lg text-xs sm:text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
                >
                  <option value="">All Status</option>
                  <option value="COMPLETED">Completed</option>
                  <option value="PENDING">Pending</option>
                  <option value="CREATED">Created</option>
                  <option value="FAILED">Failed</option>
                </select>
              </div>
              <div className="flex-1 overflow-auto w-full">
                <table className="w-full min-w-[700px] text-xs sm:text-sm">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="text-left py-2 sm:py-4 px-2 sm:px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Transaction</th>
                      <th className="text-left py-2 sm:py-4 px-2 sm:px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Service</th>
                      <th className="text-left py-2 sm:py-4 px-2 sm:px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Amount</th>
                      <th className="text-left py-2 sm:py-4 px-2 sm:px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Status</th>
                      <th className="text-left py-2 sm:py-4 px-2 sm:px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Date</th>
                      <th className="text-left py-2 sm:py-4 px-2 sm:px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Description</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {filteredPaymentTransactions.map((transaction) => {
                      const statusConfig = getStatusConfig(transaction.status);
                      const StatusIcon = statusConfig.icon;
                      return (
                        <tr key={transaction.id} className="hover:bg-slate-50 transition-colors">
                          <td className="py-2 sm:py-4 px-2 sm:px-4">
                            <div className="flex items-center space-x-2 sm:space-x-3">
                              <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center">
                                <Receipt className="w-4 h-4 text-white" />
                              </div>
                              <div>
                                <p className="font-semibold text-slate-900 text-xs sm:text-sm">{transaction.id}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-2 sm:py-4 px-2 sm:px-4">
                            <p className="font-medium text-slate-900 text-xs sm:text-sm">{transaction.clinic_name}</p>
                            <p className="text-xs sm:text-sm text-slate-600 capitalize">{transaction.type.toLowerCase()}</p>
                          </td>
                          <td className="py-2 sm:py-4 px-2 sm:px-4">
                            <p className="font-bold text-slate-900 text-xs sm:text-sm">{formatCurrency(transaction.amount)}</p>
                          </td>
                          <td className="py-2 sm:py-4 px-2 sm:px-4">
                            <span className={`inline-flex items-center px-2 sm:px-3 py-1.5 rounded-full text-xs font-bold border ${statusConfig.color}`}>
                              <StatusIcon className="w-3 h-3 mr-1" />
                              {transaction.status}
                            </span>
                          </td>
                          <td className="py-2 sm:py-4 px-2 sm:px-4">
                            <p className="text-xs sm:text-sm text-slate-600">{formatDate(transaction.created_at)}</p>
                          </td>
                          <td className="py-2 sm:py-4 px-2 sm:px-4">
                            <p className="text-xs sm:text-sm text-slate-600">{transaction.description}</p>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                {filteredPaymentTransactions.length === 0 && (
                  <div className="text-center py-8 sm:py-12">
                    <Receipt className="w-10 h-10 sm:w-12 sm:h-12 text-slate-400 mx-auto mb-4" />
                    <h3 className="text-base sm:text-lg font-semibold text-slate-900 mb-2">No payment transactions found</h3>
                    <p className="text-slate-500 text-xs sm:text-sm">No payments have been made yet</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DuesManagement;