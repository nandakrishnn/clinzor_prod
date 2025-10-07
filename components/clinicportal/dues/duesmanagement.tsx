// DuesManagement.tsx
import React, { useState, useEffect } from 'react';
import { GetAllClinicTransactions, GetClinicDues } from '@/service/clinic/dueManagementService';
import useClinicByUser from '@/hooks/cilincHook/useClinicByUser';

// Import components
import Header from './Header';
import SummaryCards from './SummaryCards';
import FiltersSection from './FiltersSection';
import PaymentModal from './PaymentModal';
import TransactionModal from './TransactionModal';

// Import types
import {
  DuesSummary,
  Clinic,
  Transaction,
  Booking,
  PaginationData,
  FiltersState
} from './types';
import { sampleClinics } from './data/sampleData';
import BookingsWithDues from './BookingsWithDues';
import TransactionsList from './TransactionsList';

const DuesManagement: React.FC = () => {
  // State management
  const [activeTab, setActiveTab] = useState<'overview' | 'transactions'>('overview');
  const [duesSummary, setDuesSummary] = useState<DuesSummary>({
    total_dues: 0,
    total_paid: 0,
    remaining_dues: 0
  });

  const [clinics, setClinics] = useState<Clinic[]>(sampleClinics);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [selectedClinic, setSelectedClinic] = useState<Clinic | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

  const [paginationData, setPaginationData] = useState<PaginationData>({
    current_page: 1,
    total_pages: 1,
    total_items: 0,
    next: null,
    previous: null
  });

  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null);

  // Filter states
  const [filters, setFilters] = useState<FiltersState>({
    searchTerm: '',
    statusFilter: '',
    dateRange: {
      fromDate: '',
      toDate: ''
    },
    transactionType: ''
  });

  // Payment form state
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentDescription, setPaymentDescription] = useState('');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  // Clinic hook
  const { clinic, loading: clinicLoading } = useClinicByUser() as { clinic: Clinic | null; loading: boolean };

  const fetchTransactions = async (
    page: number = 1,
    search: string = filters.searchTerm,
    status: string = filters.statusFilter,
    fromDate: string = filters.dateRange.fromDate,
    toDate: string = filters.dateRange.toDate,
    transactionType: string
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
        fromDate,
        toDate,
        transactionType
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
      fetchTransactions(
        1,
        filters.searchTerm,
        filters.statusFilter,
        filters.dateRange.fromDate,
        filters.dateRange.toDate,
        activeTab == "overview" ? "DUE" : "PAID"
      );
    }
  }, [clinic, filters, activeTab]);

  const handleSearchChange = (term: string) => {
    setFilters(prev => ({ ...prev, searchTerm: term }));

    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    const timeoutId = setTimeout(() => {
      if (clinic && clinic?.uuid) {
        fetchTransactions(1, term, filters.statusFilter, filters.dateRange.fromDate, filters.dateRange.toDate, filters.transactionType);
      }
    }, 500);

    setSearchTimeout(timeoutId);
  };

  const handleStatusFilterChange = (status: string) => {
    setFilters(prev => ({ ...prev, statusFilter: status }));
  };

  const handleDateRangeChange = (fromDate: string, toDate: string) => {
    setFilters(prev => ({
      ...prev,
      dateRange: { fromDate, toDate }
    }));
  };

  const handleTransactionTypeChange = (type: string) => {
    setFilters(prev => ({ ...prev, transactionType: type }));
  };

  const clearFilters = () => {
    setFilters({
      searchTerm: '',
      statusFilter: '',
      dateRange: {
        fromDate: '',
        toDate: ''
      },
      transactionType: 'ALL'
    });
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
      amount: amount.toString(),
      status: 'CREATED',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      description: paymentDescription || 'Manual payment',
      transaction_type: 'PAYMENT',
      discount_amount: "0.00",
      final_amount: amount.toString(),
      booking: "",
      clinic: clinicId,
      service_name: "Manual Payment",
      clinic_service_name: "",
      patient_name: "Manual Entry"
    };

    setTransactions([newTransaction, ...transactions]);
    setIsProcessingPayment(false);
    setShowPaymentModal(false);
    setPaymentAmount('');
    setPaymentDescription('');
    setSelectedClinic(null);
  };

  const DuesSummaryData = async (id: string) => {
    const res = await GetClinicDues(id)
    if (res?.status === 200) {
      const data = res?.data?.data
      setDuesSummary({
        total_dues: data?.total_dues,
        total_paid: data?.total_paid,
        remaining_dues: data?.remaining_dues
      });
    }
  };

  useEffect(() => {
    if (clinic?.uuid) {
      DuesSummaryData(clinic?.uuid);
    }
  }, [clinic?.uuid]);

  console.log(selectedTransaction, 'selected transactions')

  // Render active tab content
  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <>
            <BookingsWithDues
              transactions={transactions}
              paginationData={paginationData}
              onTransactionClick={(transaction) => {
                setSelectedTransaction(transaction);
                setShowTransactionModal(true);
              }}
              onPageChange={(page) => fetchTransactions(page,
                filters.searchTerm,
                filters.statusFilter,
                filters.dateRange.fromDate,
                filters.dateRange.toDate,
                activeTab == "overview" ? "DUE" : "PAID")}
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
            onPageChange={(page) => fetchTransactions(
              page,
              filters.searchTerm,
              filters.statusFilter,
              filters.dateRange.fromDate,
              filters.dateRange.toDate,
              filters.transactionType
            )}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen">
      <Header
        onRefresh={DuesSummaryData}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      <div className="max-w-7xl mx-auto">
        <SummaryCards
          onTabChange={setActiveTab}
          duesSummary={duesSummary}
        />

        <FiltersSection
          filters={filters}
          onSearchChange={handleSearchChange}
          onStatusFilterChange={handleStatusFilterChange}
          onDateRangeChange={handleDateRangeChange}
          onTransactionTypeChange={handleTransactionTypeChange}
          onClearFilters={clearFilters}
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
    </div>
  );
};

export default DuesManagement;