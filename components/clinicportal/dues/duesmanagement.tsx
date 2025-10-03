import React, { useState, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';
import { GetAllClinicTransactions } from '@/service/clinic/dueManagementService';
import useClinicByUser from '@/hooks/cilincHook/useClinicByUser';

// Import components
import Header from './Header';
import SummaryCards from './SummaryCards';
import FiltersSection from './FiltersSection';
import PaymentModal from './PaymentModal';
import TransactionModal from './TransactionModal';
import PaymentHistoryModal from './PaymentHistoryModal';

// Import types
import {
  DuesSummary,
  Clinic,
  Transaction,
  Booking,
  PaginationData
} from './types';
import { sampleBookings, sampleClinics } from './data/sampleData';
import BookingsWithDues from './BookingsWithDues';
import PastDueBookings from './PastDueBookings';
import ClinicsOverview from './ClinicsOverview';
import TransactionsList from './TransactionsList';

// Sample data

const DuesManagement: React.FC = () => {
  // State management
  const [activeTab, setActiveTab] = useState<'overview' | 'bookings' | 'transactions' | 'clinics'>('overview');
  const [duesSummary, setDuesSummary] = useState<DuesSummary>({
    total_dues: 5500,
    total_paid: 600,
    remaining_dues: 4900
  });

  const [clinics, setClinics] = useState<Clinic[]>(sampleClinics);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [selectedClinic, setSelectedClinic] = useState<Clinic | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [bookings, setBookings] = useState<Booking[]>(sampleBookings);
  const [showPaymentHistoryModal, setShowPaymentHistoryModal] = useState(false);

  const [paginationData, setPaginationData] = useState<PaginationData>({
    current_page: 1,
    total_pages: 1,
    total_items: 0,
    next: null,
    previous: null
  });

  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null);

  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [clinicFilter, setClinicFilter] = useState('');
  const [dateRangeFilter, setDateRangeFilter] = useState('all');

  // Payment form state
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentDescription, setPaymentDescription] = useState('');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  // Payment History modal enhancements
  const [paymentHistorySearch, setPaymentHistorySearch] = useState('');
  const [paymentHistoryStatus, setPaymentHistoryStatus] = useState('');

  // Clinic hook
  const { clinic, loading: clinicLoading } = useClinicByUser() as { clinic: Clinic | null; loading: boolean };

  const fetchTransactions = async (
    page: number = 1,
    search: string = searchTerm,
    status: string = statusFilter,
    dateRange: string = dateRangeFilter
  ) => {
    if (!clinic || !clinic?.uuid) {
      console.error("Clinic ID not available");
      return;
    }

    try {
      const data = await GetAllClinicTransactions(
        clinic?.uuid,
        page,
        10,
        search,
        status,
        dateRange
      );

      setTransactions(data.data);
      setPaginationData({
        current_page: data.current_page,
        total_pages: data.total_pages,
        total_items: data.total_items,
        next: data.next,
        previous: data.previous
      });
    } catch (error) {
      console.error("Error fetching data", error);
    }
  };

  useEffect(() => {
    if (clinic && clinic?.uuid) {
      fetchTransactions(1, searchTerm, statusFilter, dateRangeFilter);
    }
  }, [clinic, searchTerm, statusFilter, dateRangeFilter]);

  const handleSearchChange = (term: string) => {
    setSearchTerm(term);

    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    const timeoutId = setTimeout(() => {
      if (clinic && clinic?.uuid) {
        fetchTransactions(1, term, statusFilter, dateRangeFilter);
      }
    }, 500);

    setSearchTimeout(timeoutId);
  };

  const handleStatusFilterChange = (status: string) => {
    setStatusFilter(status);
    if (clinic && clinic?.uuid) {
      fetchTransactions(1, searchTerm, status, dateRangeFilter);
    }
  };

  const handleDateRangeChange = (range: string) => {
    setDateRangeFilter(range);
    if (clinic && clinic?.uuid) {
      fetchTransactions(1, searchTerm, statusFilter, range);
    }
  };

  const handleClinicFilterChange = (clinicId: string) => {
    setClinicFilter(clinicId);
    if (clinic && clinic?.uuid) {
      fetchTransactions(1, searchTerm, statusFilter, dateRangeFilter);
    }
  };

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }
    };
  }, [searchTimeout]);

  const initiatePayment = async (clinicId: string, amount: number) => {
    setIsProcessingPayment(true);
    await new Promise(resolve => setTimeout(resolve, 2000));

    const newTransaction: Transaction = {
      uuid: `txn_${Date.now()}`,
      clinic_id: clinicId,
      clinic_name: clinics.find(c => c.id === clinicId)?.name || 'Unknown Clinic',
      amount: amount,
      status: 'CREATED',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      description: paymentDescription || 'Manual payment',
      transaction_type: 'PAYMENT',
      payment_order: {
        amount: amount * 100,
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
    const totalDues = clinics.reduce((sum, clinic) => sum + clinic.current_dues, 0);
    const totalPaid = clinics.reduce((sum, clinic) => sum + clinic.total_paid, 0);

    setDuesSummary({
      total_dues: totalDues,
      total_paid: totalPaid,
      remaining_dues: totalDues
    });
  };

  useEffect(() => {
    refreshDuesSummary();
  }, [clinics]);

  // Render active tab content
  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <>
            <BookingsWithDues
              bookings={bookings}
              currentPage={1}
              totalPages={1}
              onPageChange={() => { }}
            />
            <PastDueBookings
              bookings={bookings}
              currentPage={1}
              totalPages={1}
              onPageChange={() => { }}
            />
            <ClinicsOverview clinics={clinics} />
          </>
        );
      case 'bookings':
        return (
          <>
            <BookingsWithDues
              bookings={bookings}
              currentPage={1}
              totalPages={1}
              onPageChange={() => { }}
            />
            <PastDueBookings
              bookings={bookings}
              currentPage={1}
              totalPages={1}
              onPageChange={() => { }}
            />
          </>
        );
      case 'transactions':
        return (
          <TransactionsList
            transactions={transactions}
            paginationData={paginationData}
            onTransactionClick={(transaction) => {
              setSelectedTransaction(transaction);
              setShowTransactionModal(true);
            }}
            onPageChange={(page) => fetchTransactions(page)}
          />
        );
      case 'clinics':
        return <ClinicsOverview clinics={clinics} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen">
      <Header
        onRefresh={refreshDuesSummary}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      <div className="max-w-7xl mx-auto">
        <SummaryCards
          duesSummary={duesSummary}
          bookingsCount={bookings.length}
          onPaymentHistoryClick={() => setShowPaymentHistoryModal(true)}
        />

        <FiltersSection
          searchTerm={searchTerm}
          statusFilter={statusFilter}
          clinicFilter={clinicFilter}
          dateRangeFilter={dateRangeFilter}
          clinics={clinics}
          onSearchChange={handleSearchChange}
          onStatusFilterChange={handleStatusFilterChange}
          onClinicFilterChange={handleClinicFilterChange}
          onDateRangeChange={handleDateRangeChange}
        />

        {renderTabContent()}
      </div>

      {/* Modals */}
      <PaymentModal
        isOpen={showPaymentModal}
        selectedClinic={selectedClinic}
        paymentAmount={paymentAmount}
        paymentDescription={paymentDescription}
        isProcessing={isProcessingPayment}
        onClose={() => {
          setShowPaymentModal(false);
          setSelectedClinic(null);
          setPaymentAmount('');
          setPaymentDescription('');
        }}
        onPaymentAmountChange={setPaymentAmount}
        onPaymentDescriptionChange={setPaymentDescription}
        onSubmit={() => {
          if (!selectedClinic) return;
          if (!paymentAmount || isNaN(Number(paymentAmount)) || Number(paymentAmount) <= 0) return;
          initiatePayment(selectedClinic.id, Number(paymentAmount));
        }}
      />

      <TransactionModal
        isOpen={showTransactionModal}
        transaction={selectedTransaction}
        onClose={() => {
          setShowTransactionModal(false);
          setSelectedTransaction(null);
        }}
      />

      <PaymentHistoryModal
        isOpen={showPaymentHistoryModal}
        transactions={transactions}
        searchTerm={paymentHistorySearch}
        statusFilter={paymentHistoryStatus}
        onClose={() => setShowPaymentHistoryModal(false)}
        onSearchChange={setPaymentHistorySearch}
        onStatusFilterChange={setPaymentHistoryStatus}
      />
    </div>
  );
};

export default DuesManagement;