import React, { useState, useEffect } from 'react';
import { Search, Filter, ArrowUpRight, TrendingUp, TrendingDown, DollarSign, Building2, Calendar, MoreHorizontal, X, ChevronsLeft, ChevronsRight, ChevronLeft, ChevronRight, Clock, CheckCircle, AlertCircle, CreditCard, Eye } from 'lucide-react';

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

// Add Clinic type for selectedClinic
type Clinic = {
  clinic_uuid: string;
  clinic_name: string;
  due_detail: {
    total_dues: number;
    total_paid: number;
    remaining_dues: number;
  };
};

// Sample data
const sampleBookings: Booking[] = [
  {
    uuid: "1d56bfba-4407-41e5-b067-e55439db9607",
    created_by: "fake@exampl.com",
    booking_type: "VIDEO_CALL",
    booking_status: "PENDING",
    start_time: "2025-05-31T16:31:00Z",
    end_time: "2025-05-31T18:00:00Z",
    payment_status: "PENDING",
    session_type: "CONSULTATION",
    patient_name: "patient 1",
    patient_mobile: "1234567890",
    patient_email: "patient@email.com",
    booking_charge: "160.00",
    clinic_name: "Sunrise Clinic",
    clinic_id: "clinic-1",
    service_type: "Dermatology"
  },
  {
    uuid: "d9a5c17d-277d-4fa9-88dd-285a588834a6",
    created_by: "fake@exampl.com",
    booking_type: "VIDEO_CALL",
    booking_status: "SCHEDULED",
    start_time: "2025-06-10T17:31:00Z",
    end_time: "2025-06-10T19:00:00Z",
    payment_status: "COMPLETED",
    session_type: "SESSION",
    patient_name: "patient 2",
    patient_mobile: "1234567891",
    patient_email: "patient2@email.com",
    booking_charge: "200.00",
    clinic_name: "Sunrise Clinic",
    clinic_id: "clinic-1",
    service_type: "Dermatology"
  },
  {
    uuid: "mock-uuid-001",
    created_by: "mockuser@clinzor.com",
    booking_type: "VIDEO_CALL",
    booking_status: "PENDING",
    start_time: "2025-07-10T10:00:00Z",
    end_time: "2025-07-10T10:30:00Z",
    payment_status: "PENDING",
    session_type: "CONSULTATION",
    patient_name: "John Doe",
    patient_mobile: "9876543210",
    patient_email: "johndoe@email.com",
    booking_charge: "500.00",
    clinic_name: "Getwell Hospital",
    clinic_id: "8c16ae4e-bb2a-48d3-90bf-7cb84d9a3a03",
    service_type: "General Medicine"
  },
  {
    uuid: "mock-uuid-002",
    created_by: "mockuser@clinzor.com",
    booking_type: "PHYSICAL_VISIT",
    booking_status: "PENDING",
    start_time: "2025-07-11T11:00:00Z",
    end_time: "2025-07-11T11:30:00Z",
    payment_status: "PENDING",
    session_type: "CONSULTATION",
    patient_name: "Alice Smith",
    patient_mobile: "9876543211",
    patient_email: "alice@email.com",
    booking_charge: "600.00",
    clinic_name: "Aurbindo Medical Center",
    clinic_id: "7b420213-bdba-487f-a5f5-553ab55a81e8",
    service_type: "Cardiology"
  },
  {
    uuid: "mock-uuid-003",
    created_by: "mockuser@clinzor.com",
    booking_type: "VIDEO_CALL",
    booking_status: "PENDING",
    start_time: "2025-07-12T12:00:00Z",
    end_time: "2025-07-12T12:30:00Z",
    payment_status: "PENDING",
    session_type: "SESSION",
    patient_name: "Bob Lee",
    patient_mobile: "9876543212",
    patient_email: "bob@email.com",
    booking_charge: "700.00",
    clinic_name: "Greater Kailash Hospital",
    clinic_id: "be080dc7-ba7e-4e44-ae49-5a8a5c604a62",
    service_type: "Orthopedics"
  },
  {
    uuid: "mock-uuid-004",
    created_by: "mockuser@clinzor.com",
    booking_type: "PHYSICAL_VISIT",
    booking_status: "PENDING",
    start_time: "2025-07-13T13:00:00Z",
    end_time: "2025-07-13T13:30:00Z",
    payment_status: "PENDING",
    session_type: "CONSULTATION",
    patient_name: "Carol King",
    patient_mobile: "9876543213",
    patient_email: "carol@email.com",
    booking_charge: "800.00",
    clinic_name: "Harmony Health Hub",
    clinic_id: "d7204f42-d700-40b9-b29f-045dcd023e4a",
    service_type: "Dermatology"
  },
  {
    uuid: "mock-uuid-005",
    created_by: "mockuser@clinzor.com",
    booking_type: "VIDEO_CALL",
    booking_status: "PENDING",
    start_time: "2025-07-14T14:00:00Z",
    end_time: "2025-07-14T14:30:00Z",
    payment_status: "PENDING",
    session_type: "SESSION",
    patient_name: "David Kim",
    patient_mobile: "9876543214",
    patient_email: "david@email.com",
    booking_charge: "900.00",
    clinic_name: "Sunrise Dental Clinic",
    clinic_id: "5a1f8f39-ca38-464c-93c5-ea8edbd6c03f",
    service_type: "Dental Care"
  },
  {
    uuid: "mock-uuid-006",
    created_by: "mockuser@clinzor.com",
    booking_type: "PHYSICAL_VISIT",
    booking_status: "PENDING",
    start_time: "2025-07-15T15:00:00Z",
    end_time: "2025-07-15T15:30:00Z",
    payment_status: "PENDING",
    session_type: "CONSULTATION",
    patient_name: "Eva Green",
    patient_mobile: "9876543215",
    patient_email: "eva@email.com",
    booking_charge: "1000.00",
    clinic_name: "City Care Clinic",
    clinic_id: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    service_type: "Pediatrics"
  },
  {
    uuid: "mock-uuid-007",
    created_by: "mockuser@clinzor.com",
    booking_type: "VIDEO_CALL",
    booking_status: "PENDING",
    start_time: "2025-07-16T16:00:00Z",
    end_time: "2025-07-16T16:30:00Z",
    payment_status: "PENDING",
    session_type: "SESSION",
    patient_name: "Frank Moore",
    patient_mobile: "9876543216",
    patient_email: "frank@email.com",
    booking_charge: "1100.00",
    clinic_name: "Wellness Point",
    clinic_id: "b2c3d4e5-f6a7-8901-bcde-fa2345678901",
    service_type: "General Checkup"
  },
  {
    uuid: "mock-uuid-008",
    created_by: "mockuser@clinzor.com",
    booking_type: "PHYSICAL_VISIT",
    booking_status: "PENDING",
    start_time: "2025-07-17T17:00:00Z",
    end_time: "2025-07-17T17:30:00Z",
    payment_status: "PENDING",
    session_type: "CONSULTATION",
    patient_name: "Grace Hall",
    patient_mobile: "9876543217",
    patient_email: "grace@email.com",
    booking_charge: "1200.00",
    clinic_name: "Family Health Center",
    clinic_id: "c3d4e5f6-a7b8-9012-cdef-ab3456789012",
    service_type: "ENT"
  },
  {
    uuid: "mock-uuid-009",
    created_by: "mockuser@clinzor.com",
    booking_type: "VIDEO_CALL",
    booking_status: "PENDING",
    start_time: "2025-07-18T18:00:00Z",
    end_time: "2025-07-18T18:30:00Z",
    payment_status: "PENDING",
    session_type: "SESSION",
    patient_name: "Henry Young",
    patient_mobile: "9876543218",
    patient_email: "henry@email.com",
    booking_charge: "1300.00",
    clinic_name: "Prime Medicals",
    clinic_id: "d4e5f6a7-b8c9-0123-defa-bc4567890123",
    service_type: "Neurology"
  }
];

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
    paymentDate: "2025-07-01T14:45:00Z",
    amount: 200.00,
    currency: "INR",
    paymentStatus: "PENDING",
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
    bookingId: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    paymentDate: "2025-07-02T09:20:00Z",
    amount: 500.00,
    currency: "INR",
    paymentStatus: "COMPLETED",
    paymentMethod: "NET_BANKING",
    serviceType: "PHYSICAL_VISIT",
    patientName: "patient 3",
    patientEmail: "patient3@email.com",
    patientMobile: "1234567892",
    clinicName: "City Care Clinic",
    clinicId: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    serviceName: "Cardiology Consultation",
    sessionDuration: 60,
    doctorName: "Dr. Anjali Gupta",
    bookingDate: "2025-07-01T10:00:00Z",
    processingFee: 10.00,
    platformFee: 20.00,
    netAmount: 470.00,
    gatewayTransactionId: "nb_1234567890",
    paymentGateway: "PAYU"
  },
  {
    transactionId: "TXN004",
    bookingId: "b2c3d4e5-f6a7-8901-bcde-fa2345678901",
    paymentDate: "2025-07-03T11:15:00Z",
    amount: 900.00,
    currency: "INR",
    paymentStatus: "FAILED",
    paymentMethod: "CASH",
    serviceType: "PHYSICAL_VISIT",
    patientName: "patient 4",
    patientEmail: "patient4@email.com",
    patientMobile: "1234567893",
    clinicName: "Wellness Point",
    clinicId: "b2c3d4e5-f6a7-8901-bcde-fa2345678901",
    serviceName: "General Checkup",
    sessionDuration: 30,
    doctorName: "Dr. Vikram Singh",
    bookingDate: "2025-07-02T12:00:00Z",
    processingFee: 0.00,
    platformFee: 0.00,
    netAmount: 900.00,
    gatewayTransactionId: "cash_1234567890",
    paymentGateway: "CASHFREE"
  },
  {
    transactionId: "TXN005",
    bookingId: "c3d4e5f6-a7b8-9012-cdef-ab3456789012",
    paymentDate: "2025-07-04T16:00:00Z",
    amount: 300.00,
    currency: "INR",
    paymentStatus: "COMPLETED",
    paymentMethod: "UPI",
    serviceType: "VIDEO_CALL",
    patientName: "patient 5",
    patientEmail: "patient5@email.com",
    patientMobile: "1234567894",
    clinicName: "Family Health Center",
    clinicId: "c3d4e5f6-a7b8-9012-cdef-ab3456789012",
    serviceName: "Orthopedics Session",
    sessionDuration: 30,
    doctorName: "Dr. Meera Patel",
    bookingDate: "2025-07-03T14:00:00Z",
    processingFee: 5.00,
    platformFee: 10.00,
    netAmount: 285.00,
    gatewayTransactionId: "upi_1234567890",
    paymentGateway: "RAZORPAY"
  }
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

  // Sample clinic data
  const clinicsData = [
    {
      clinic_uuid: "7b420213-bdba-487f-a5f5-553ab55a81e8",
      clinic_name: "Aurbindo Medical Center",
      due_detail: { total_dues: 0, total_paid: 0, remaining_dues: 0 }
    },
    {
      clinic_uuid: "8c16ae4e-bb2a-48d3-90bf-7cb84d9a3a03",
      clinic_name: "Getwell Hospital",
      due_detail: { total_dues: 550, total_paid: 200, remaining_dues: 350 }
    },
    {
      clinic_uuid: "be080dc7-ba7e-4e44-ae49-5a8a5c604a62",
      clinic_name: "Greater Kailash Hospital",
      due_detail: { total_dues: 0, total_paid: 0, remaining_dues: 0 }
    },
    {
      clinic_uuid: "d7204f42-d700-40b9-b29f-045dcd023e4a",
      clinic_name: "Harmony Health Hub",
      due_detail: { total_dues: 0, total_paid: 0, remaining_dues: 0 }
    },
    {
      clinic_uuid: "5a1f8f39-ca38-464c-93c5-ea8edbd6c03f",
      clinic_name: "Sunrise Dental Clinic",
      due_detail: { total_dues: -200, total_paid: 0, remaining_dues: -200 }
    },
    {
      clinic_uuid: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
      clinic_name: "City Care Clinic",
      due_detail: { total_dues: 1200, total_paid: 800, remaining_dues: 400 }
    },
    {
      clinic_uuid: "b2c3d4e5-f6a7-8901-bcde-fa2345678901",
      clinic_name: "Wellness Point",
      due_detail: { total_dues: 900, total_paid: 900, remaining_dues: 0 }
    },
    {
      clinic_uuid: "c3d4e5f6-a7b8-9012-cdef-ab3456789012",
      clinic_name: "Family Health Center",
      due_detail: { total_dues: 300, total_paid: 0, remaining_dues: 300 }
    },
    {
      clinic_uuid: "d4e5f6a7-b8c9-0123-defa-bc4567890123",
      clinic_name: "Prime Medicals",
      due_detail: { total_dues: 0, total_paid: 100, remaining_dues: -100 }
    }
  ];

  useEffect(() => {
    setTimeout(() => setAnimateCards(true), 100);
  }, []);

  // Calculate totals
  const totalDues = clinicsData.reduce((sum, clinic) => sum + clinic.due_detail.total_dues, 0);
  const totalPaid = clinicsData.reduce((sum, clinic) => sum + clinic.due_detail.total_paid, 0);
  const totalRemaining = clinicsData.reduce((sum, clinic) => sum + clinic.due_detail.remaining_dues, 0);

  // Filter and search logic
  const filteredClinics = clinicsData.filter(clinic => {
    const matchesSearch = clinic.clinic_name.toLowerCase().includes(searchTerm.toLowerCase());
    
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
  const totalPages = Math.ceil(sortedClinics.length / itemsPerPage);
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
      setDueTypeFilter('SERVICE'); // or 'SESSION' if you want session dues
    } else if (clinic.due_detail.remaining_dues < 0) {
      setDueTypeFilter('CREDIT'); // If you want to support a credit filter, otherwise use 'ALL'
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
  const overdueClinics = clinicsData.filter(clinic => {
    const bookings = sampleBookings.filter(b => b.clinic_id === clinic.clinic_uuid && b.payment_status === 'PENDING');
    return bookings.some(b => {
      const bookingDate = new Date(b.start_time);
      const diffDays = (now.getTime() - bookingDate.getTime()) / (1000 * 60 * 60 * 24);
      return diffDays > 7;
    });
  });

  const clinicIds = clinicsData.map(c => c.clinic_uuid);
  const filteredPaymentRecords = samplePaymentRecords.filter(r => clinicIds.includes(r.clinicId));

  // Helper to get bookings for a clinic (with modal filter)
  const getClinicBookings = (clinicId: string) => {
    let filtered = sampleBookings.filter(b => b.clinic_id === clinicId);
    if (modalBookingFilter === 'SERVICE') filtered = filtered.filter(b => b.session_type !== 'SESSION');
    if (modalBookingFilter === 'SESSION') filtered = filtered.filter(b => b.session_type === 'SESSION');
    return filtered;
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
                    <div key={clinic.clinic_uuid} className="p-4 bg-white rounded-xl border border-red-100">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-semibold text-gray-900">{clinic.clinic_name}</div>
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
                  <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                    Export Report
                  </button>
                </div>
              </div>
            </div>

            {/* Clinics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {paginatedClinics.map((clinic, index) => {
                const statusInfo = getStatusInfo(clinic.due_detail.remaining_dues);
                const isSelected = selectedClinic && selectedClinic.clinic_uuid === clinic.clinic_uuid && viewModalOpen;
                return (
                  <div
                    key={clinic.clinic_uuid}
                    className={`bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 transform ${animateCards ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'} ${isSelected ? 'ring-2 ring-blue-500' : ''}`}
                    style={{ transitionDelay: `${index * 50}ms` }}
                    onClick={e => {
                      if (selectedClinic && selectedClinic.clinic_uuid === clinic.clinic_uuid && viewModalOpen) {
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
                          <h3 className="font-semibold text-gray-900 text-lg leading-tight">{clinic.clinic_name}</h3>
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

      <Modal isOpen={viewModalOpen} onClose={handleCloseModal} title={selectedClinic?.clinic_name || 'Clinic Details'} size="md">
        <div onClick={e => e.stopPropagation()} className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-2 sm:p-4">
          {selectedClinic ? (
            <div className="space-y-6">
              {/* Outstanding Amount Section */}
              <div className="flex items-center gap-4 bg-white/90 border border-red-100 rounded-2xl p-5 shadow-sm">
                <div className="flex items-center gap-3">
                  <DollarSign className="w-7 h-7 text-red-600" />
                  <div>
                    <div className="text-xs text-red-700 font-semibold uppercase tracking-wide">Outstanding Amount</div>
                    <div className="text-3xl font-extrabold text-red-700 flex items-center gap-2">
                      {formatCurrency(selectedClinic.due_detail.remaining_dues)}
                      <span className="bg-red-100 text-red-700 text-xs font-bold px-2 py-1 rounded-full ml-2">DUE</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Clinic Financial Summary */}
              <div className="bg-white/90 border border-gray-100 rounded-2xl p-5 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <Building2 className="w-5 h-5 text-blue-500" />
                  <span className="font-semibold text-gray-900 text-lg">Clinic Financial Summary</span>
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
                    <div className={`font-bold text-lg ${selectedClinic.due_detail.remaining_dues > 0 ? 'text-red-600' : selectedClinic.due_detail.remaining_dues < 0 ? 'text-green-600' : 'text-gray-600'}`}>{selectedClinic.due_detail.remaining_dues < 0 ? '-' : ''}{formatCurrency(selectedClinic.due_detail.remaining_dues)}</div>
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
                {getClinicBookings(selectedClinic.clinic_uuid).length > 0 ? (
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
                        {getClinicBookings(selectedClinic.clinic_uuid).map(b => (
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
                {samplePaymentRecords.filter(r => r.clinicId === selectedClinic.clinic_uuid).length > 0 ? (
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
                        {samplePaymentRecords.filter(r => r.clinicId === selectedClinic.clinic_uuid).map(r => (
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
          ) : null}
        </div>
      </Modal>
    </div>
  );
};

export default DueManagement;
export { sampleBookings };