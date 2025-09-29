"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar, Clock, Search, ChevronDown, User,
  Phone, Mail, Video, MapPin, Eye, X,
  RefreshCw, CreditCard, CheckCircle, XCircle,
  AlertCircle, Monitor, Building,
  FileText,
  Link2,
  Wallet
} from 'lucide-react';
import Link from 'next/link';
import { getClinicBookings, getExpertBookings } from '@/service/admin/bookingManagementService';
import { GetAExpertAdmin } from '@/service/admin/expertManagementService';

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
  expert?: string
};
interface PaginationData {
  current_page: number;
  total_pages: number;
  total_items: number;
  next: string | null;
  previous: string | null;
}

const Notification = ({ type, message, onClose }: {
  type: 'success' | 'error' | 'warning';
  message: string;
  onClose: () => void
}) => (
  <motion.div
    initial={{ opacity: 0, y: -50, x: '-50%' }}
    animate={{ opacity: 1, y: 0, x: '-50%' }}
    exit={{ opacity: 0, y: -50, x: '-50%' }}
    className={`fixed top-4 left-1/2 transform z-50 px-6 py-4 rounded-lg shadow-lg ${type === 'success' ? 'bg-green-500 text-white' :
      type === 'error' ? 'bg-red-500 text-white' :
        'bg-yellow-500 text-white'
      }`}
  >
    <div className="flex items-center gap-3">
      {type === 'success' && <CheckCircle size={20} />}
      {type === 'error' && <XCircle size={20} />}
      {type === 'warning' && <AlertCircle size={20} />}
      <span className="font-medium">{message}</span>
      <button onClick={onClose} className="ml-2 hover:opacity-70">
        <X size={16} />
      </button>
    </div>
  </motion.div>
);

export const StatusBadge = ({ status }: { status: Booking['booking_status'] }) => {
  const getStatusColor = (status: Booking['booking_status']) => {
    switch (status) {
      case 'COMPLETED': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'SCHEDULED': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'PENDING': return 'bg-amber-50 text-amber-700 border-amber-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(status)}`}>
      {status}
    </span>
  );
};

export const RescheduledBadge = () => (
  <span className="px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
    Rescheduled
  </span>
);

export const PaymentStatusBadge = ({ status }: { status: Booking['payment_status'] }) => (
  <span className={`px-2 py-1 rounded-full text-xs font-medium ${status === 'COMPLETED' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
    }`}>
    {status === 'COMPLETED' ? 'Paid' : 'Pending'}
  </span>
);

export default function BookingManagement() {
  const [bookings, setBookings] = useState<any>();
  const [bookingsClinics, setClinicBookings] = useState<any>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<Booking['booking_status'] | 'ALL'>('ALL');
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState<Booking['payment_status'] | 'ALL'>('ALL');
  const [activeTab, setActiveTab] = useState<'VIDEO_CALL' | 'PHYSICAL_VISIT'>('VIDEO_CALL');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isExpertViewModal, setIsExpertViewModal] = useState(false);
  const [expertData, setExpertData] = useState<any>()
  const [paginationData, setPaginationData] = useState<PaginationData>({
    current_page: 1,
    total_pages: 1,
    total_items: 0,
    next: null,
    previous: null
  });
  const [notification, setNotification] = useState<{
    type: 'success' | 'error' | 'warning';
    message: string;
  } | null>(null);

  const fetchBookings = async (page = 1) => {
    setIsLoading(true);
    try {
      const params: any = {
        page,
        page_size: itemsPerPage,
      };

      if (searchQuery) params.search = searchQuery;
      if (selectedStatus !== 'ALL') params.booking_status = selectedStatus;
      if (selectedPaymentStatus !== 'ALL') params.payment_status = selectedPaymentStatus;

      const [expertBookingRes, clinicBookingRes] = await Promise.all([getExpertBookings(params), getClinicBookings(params)])

      console.log(expertBookingRes, clinicBookingRes)
      setBookings(expertBookingRes);
      setClinicBookings(clinicBookingRes);

      if (activeTab === 'VIDEO_CALL') {
        setPaginationData({
          current_page: expertBookingRes?.current_page,
          total_pages: expertBookingRes?.total_pages,
          total_items: expertBookingRes?.total_items,
          next: expertBookingRes?.next,
          previous: expertBookingRes?.previous,
        });
      } else {
        setPaginationData({
          current_page: clinicBookingRes?.current_page,
          total_pages: clinicBookingRes?.total_pages,
          total_items: clinicBookingRes?.total_items,
          next: clinicBookingRes?.next,
          previous: clinicBookingRes?.previous,
        });
      }

    } catch (err) {
      setNotification({ type: 'error', message: 'Failed to load bookings' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      setCurrentPage(1);
      fetchBookings(1);
    }
  };

  useEffect(() => {
    fetchBookings(
      currentPage
    );
  }, [currentPage, selectedStatus, activeTab]);

  const getAExpertDetailed = async () => {
    try {
      if (selectedBooking) {
        const res = await GetAExpertAdmin(selectedBooking?.expert)
        console.log(res, 'this from the expert detailed view call');
        setExpertData(res?.data)
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getAExpertDetailed()
  }, [selectedBooking])

  // Pagination handlers
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= paginationData.total_pages) {
      setCurrentPage(newPage);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleView = (booking: Booking) => {
    setSelectedBooking(booking);
    setIsViewModalOpen(true);
  };

  const BookingCard = ({ booking }: { booking: Booking }) => (
    <motion.div
      className="bg-white rounded-xl shadow-xl border p-6 hover:shadow-2xl transition-shadow"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Booking Info */}
        <div className="flex-1 space-y-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${booking.booking_type === 'VIDEO_CALL' ? 'bg-blue-100' : 'bg-green-100'
                }`}>
                {booking.booking_type === 'VIDEO_CALL' ? (
                  <Video className={`w-6 h-6 ${booking.booking_type === 'VIDEO_CALL' ? 'text-blue-600' : 'text-green-600'}`} />
                ) : (
                  <MapPin className="w-6 h-6 text-green-600" />
                )}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{booking.patient_name}</h3>
                <p className="text-sm text-gray-600">{booking.session_type}</p>
              </div>
            </div>
            <div className=''>
              <StatusBadge status={booking.booking_status} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2 text-gray-600">
              <Mail size={14} />
              <span>{booking.patient_email}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Phone size={14} />
              <span>{booking.patient_mobile}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Clock size={14} />
              <span>{formatDate(booking.start_time)}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <CreditCard size={14} />
              <span>₹{booking.booking_charge}</span>
            </div>
          </div>

          {/* Clinic and Service Info */}
          <div className="flex flex-wrap items-center gap-4 pt-2 border-t border-gray-100">
            <div className="flex items-center gap-2">
              <Building size={14} className="text-blue-600" />
              <Link
                href={`/admin/allclinics/${booking.clinic_id}`}
                className="text-blue-600 hover:text-blue-800 hover:underline font-medium text-sm transition-colors"
              >
                {booking.clinic_name}
              </Link>
            </div>
            <span className="text-gray-400">•</span>
            <span className="text-emerald-700 font-medium text-sm bg-emerald-50 px-2 py-1 rounded-full">
              {booking.service_type}
            </span>
            <span className="text-gray-400">•</span>
            <PaymentStatusBadge status={booking.payment_status} />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 flex-wrap mt-4 lg:mt-0">
          <button
            onClick={() => handleView(booking)}
            className="flex items-center gap-2 px-4 py-2 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors font-medium"
          >
            <Eye size={16} />
            <span className="hidden sm:inline">View Details</span>
          </button>
        </div>
      </div>
    </motion.div>
  );

  const ExpertBookingDetails = ({ expert, booking, onClose }: { expert: any; booking: any; onClose: () => void }) => (

    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" >
      <motion.div
        className="bg-white rounded-xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <div className="flex justify-between items-start mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Expert Booking Details</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>

        <div className="space-y-6">
          {/* Patient Information */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <User size={20} />
              Patient Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Full Name</label>
                <p className="text-gray-900">{booking?.customer_name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Email</label>
                <p className="text-gray-900">{booking.customer_email}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Mobile</label>
                <p className="text-gray-900">{booking?.customer_email}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Address</label>
                <p className="text-gray-900">{booking?.customer_addresss}</p>
              </div>
              {/* <div/> */}
            </div>
          </div>

          {/* Booking Information */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Calendar size={20} />
              Booking Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Start Time</label>
                <p className="text-gray-900">{formatDate(booking?.start_time)}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">End Time</label>
                <p className="text-gray-900">{formatDate(booking?.end_time)}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Duration</label>
                <p className="text-gray-900">
                  {Math.round((new Date(booking?.end_time).getTime() - new Date(booking?.start_time).getTime()) / (1000 * 60))} minutes
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Session Type</label>
                <p className="text-gray-900">{booking?.booking_type}</p>
              </div>
            </div>
          </div>

          {/* Clinic & Service Information */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Building size={20} />
              Expert Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Expert Name</label>
                <p className="text-gray-900">{expert?.full_name || expert?.name }</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Phone Number</label>
                <p className="text-gray-900">{expert?.phone_number}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Address</label>
                <p className="text-gray-900">{expert?.address}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Email</label>
                <p className="text-gray-900 font-mono text-sm">{expert?.email}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">gender</label>
                <p className="text-gray-900 font-mono text-sm">{expert?.gender}</p>
              </div>
            </div>
          </div>

          {/* Meeting & Payment Information */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Video size={20} />
              Meeting & Payment Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Room ID</label>
                <p className="text-gray-900 font-mono text-sm">{booking.room_id}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Payment Mode</label>
                <p className="text-gray-900">{booking.payment_mode}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Booking Charge</label>
                <p className="text-gray-900 font-semibold">₹{booking.booking_charge}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Bill Number</label>
                <p className="text-gray-900">{booking.bill_no}</p>
              </div>
              {booking.customer_meeting_link && (
                <div className="md:col-span-2">
                  <label className="text-sm font-medium text-gray-500">Customer Meeting Link</label>
                  <p className="text-blue-600 break-all">{booking.customer_meeting_link}</p>
                </div>
              )}
              {booking.clinic_meeting_link && (
                <div className="md:col-span-2">
                  <label className="text-sm font-medium text-gray-500">Clinic Meeting Link</label>
                  <p className="text-blue-600 break-all">{booking.clinic_meeting_link}</p>
                </div>
              )}
            </div>
          </div>

          {/* Status Information */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <label className="text-sm font-medium text-gray-500">Booking Status</label>
              <div className="mt-2">
                <StatusBadge status={booking.booking_status} />
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <label className="text-sm font-medium text-gray-500">Payment Status</label>
              <div className="mt-2">
                <PaymentStatusBadge status={booking.payment_status} />
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <label className="text-sm font-medium text-gray-500">Rescheduled</label>
              <div className="mt-2">
                {booking.is_rescheduled ? (
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700">Yes</span>
                ) : (
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">No</span>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-end gap-4">
          {booking.invoice_url && (
            <button className="flex items-center gap-2 px-4 py-2 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
              <FileText size={16} />
              Download Invoice
            </button>
          )}
          <button
            onClick={onClose}
            className="px-6 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Close
          </button>
        </div>
      </motion.div>
    </div>
  );

  const ExpertBookingCard = ({ booking }: { booking: any }) => (
    <motion.div
      className="bg-white rounded-xl shadow-xl border p-6 hover:shadow-2xl transition-shadow"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Booking Info */}
        <div className="flex-1 space-y-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-blue-100">
                <Video className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-semibold text-gray-900 capitalize">{booking?.customer_name}</h3>
                  {/* Remove rescheduled badge since we don't have this data */}
                </div>
                <p className="text-sm text-gray-600 capitalize">
                  {booking.booking_type.toLowerCase().replace('_', ' ')}
                </p>
                <p className="text-xs text-gray-500">Customer: {booking.customer.slice(0, 8)}...</p>
              </div>
            </div>
            <StatusBadge status={booking.booking_status} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2 text-gray-600">
              <Phone size={14} />
              <span>Starts: {booking?.customer_phone_number}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Clock size={14} />
              <span>Ends: {formatDate(booking?.start_time)}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <CreditCard size={14} />
              <span>₹{booking.booking_charge}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Wallet size={14} />
              <span>{booking.payment_mode}</span>
            </div>
          </div>

          {/* Additional Info */}
          <div className="flex flex-wrap items-center gap-4 pt-2 border-t border-gray-100">
            <div className="flex items-center gap-2">
              <Video size={14} className="text-blue-600" />
              <span className="text-blue-600 font-medium text-sm capitalize">
                {booking?.booking_type?.toLowerCase().replace('_', ' ')}
              </span>
            </div>
            <span className="text-gray-400">•</span>
            <PaymentStatusBadge status={booking?.payment_status} />
            <span className="text-gray-400">•</span>
            <span className="text-gray-600 text-sm">Slot: {booking?.slot?.slice(0, 8)}...</span>
          </div>

          {/* Expert Meeting Link */}
          {booking.expert_meeting_link && (
            <div className="flex items-center gap-2 pt-2">
              <Link2 size={14} className="text-green-600" />
              <a
                href={booking.expert_meeting_link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-600 text-sm hover:underline"
              >
                Join Meeting
              </a>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 flex-wrap mt-4 lg:mt-0">
          <button
            onClick={() => (setIsExpertViewModal(true), setSelectedBooking(booking))}
            className="flex items-center gap-2 px-4 py-2 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors font-medium"
          >
            <Eye size={16} />
            <span className="hidden sm:inline">View Details</span>
          </button>
        </div>
      </div>
    </motion.div >
  );

  const statusHandler = (status: any) => {
    console.log(status)
    setPaginationData(prev => (
      {
        ...prev,
        current_page: 1
      }
    ))
    setSelectedStatus(status)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen  flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading ...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen  p-2 sm:p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          className="flex flex-col md:flex-row md:items-center justify-between mb-5 bg-white rounded-xl "
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <Calendar className="mr-3 text-blue-600" size={32} />
              Booking Management
            </h1>
            <p className="text-gray-600 mt-1">Manage expert calls and clinic slot bookings</p>
          </div>

          <div className="flex items-center gap-4 mt-4 md:mt-0">
            <button
              onClick={() => fetchBookings(currentPage)}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <RefreshCw size={16} />
              Refresh
            </button>
          </div>
        </motion.div>

        {/* Booking Tabs */}
        <motion.div
          className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex space-x-4">
            <button
              onClick={() => {
                setActiveTab('VIDEO_CALL');
                setCurrentPage(1);
                fetchBookings(1);
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${activeTab === 'VIDEO_CALL'
                ? 'bg-purple-50 text-purple-600 font-medium'
                : 'text-gray-600 hover:bg-gray-50'
                }`}
            >
              <Monitor size={20} />
              <span>Expert Calls ({bookings?.total_items})</span>
            </button>
            <button
              onClick={() => {
                setActiveTab('PHYSICAL_VISIT');
                setCurrentPage(1);
                fetchBookings(1);
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${activeTab === 'PHYSICAL_VISIT'
                ? 'bg-green-50 text-green-600 font-medium'
                : 'text-gray-600 hover:bg-gray-50'
                }`}
            >
              <Building size={20} />
              <span>Clinic Slots ({bookingsClinics?.total_items})</span>
            </button>
          </div>
        </motion.div>

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
                placeholder="Search by patient, clinic, service type..."
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearchKeyDown}
                value={searchQuery}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none "
              />
            </div>

            {/* Status Filter */}
            <div className="relative">
              <select
                value={selectedStatus}
                onChange={(e) => statusHandler(e.target.value)}
                className="appearance-none bg-white border border-gray-200 rounded-lg px-4 py-3 pr-8 focus:outline-none "
              >
                <option value="ALL">All Status</option>
                <option value="PENDING">Pending</option>
                <option value="SCHEDULED">Scheduled</option>
                <option value="COMPLETED">Completed</option>
              </select>
              <ChevronDown size={16} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>

            {/* Payment Status Filter */}
            {/* <div className="relative">
              <select
                value={selectedPaymentStatus}
                onChange={(e) => setSelectedPaymentStatus(e.target.value as Booking['payment_status'] | 'ALL')}
                className="appearance-none bg-white border border-gray-200 rounded-lg px-4 py-3 pr-8 focus:outline-none "
              >
                <option value="ALL">All Payments</option>
                <option value="PENDING">Payment Pending</option>
                <option value="COMPLETED">Payment Completed</option>
              </select>
              <ChevronDown size={16} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div> */}
          </div>
        </motion.div>

        {/* Bookings List */}
        <div className="space-y-4 mb-8">
          {activeTab === 'VIDEO_CALL' ? bookings?.data?.map((booking: any) => (
            <ExpertBookingCard key={booking?.uuid} booking={booking} />
          )) : bookingsClinics?.data?.map((booking: any) => (
            <BookingCard key={booking?.uuid} booking={booking} />
          ))}
        </div>

        {/* Pagination Controls */}
        {paginationData.total_pages > 1 && (
          <motion.div
            className="flex items-center justify-between bg-white p-4 rounded-xl shadow-sm border border-gray-100"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${currentPage === 1
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
                  }`}
              >
                Previous
              </button>
              <span className="text-sm text-gray-600">
                Page {currentPage} of {paginationData.total_pages}
              </span>
              <button
                type="button"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === paginationData.total_pages}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${currentPage === paginationData.total_pages
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
                  }`}
              >
                Next
              </button>
            </div>
            <div className="text-sm text-gray-500">
              Showing {(paginationData.current_page - 1) * itemsPerPage + 1}-
              {Math.min(paginationData.current_page * itemsPerPage, paginationData.total_items)} of{" "}
              {paginationData.total_items} bookings
            </div>
          </motion.div>
        )}

        {/* View Modal */}
        {isViewModalOpen && selectedBooking && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <motion.div
              className="bg-white rounded-xl p-6 max-w-2xl w-full mx-4"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Booking Details</h2>
                <button
                  onClick={() => setIsViewModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Patient Information</h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <User size={16} className="text-gray-400" />
                        <span className="text-gray-900">{selectedBooking.patient_name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail size={16} className="text-gray-400" />
                        <span className="text-gray-900">{selectedBooking.patient_email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone size={16} className="text-gray-400" />
                        <span className="text-gray-900">{selectedBooking.patient_mobile}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Booking Information</h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Calendar size={16} className="text-gray-400" />
                        <span className="text-gray-900">{formatDate(selectedBooking.start_time)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock size={16} className="text-gray-400" />
                        <span className="text-gray-900">
                          Duration: {new Date(selectedBooking.end_time).getHours() - new Date(selectedBooking.start_time).getHours()} hours
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Building size={16} className="text-gray-400" />
                        <span className="text-gray-900">{selectedBooking.clinic_name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-500">Service Type:</span>
                        <span className="text-emerald-700 font-medium text-sm bg-emerald-50 px-2 py-1 rounded-full">{selectedBooking.service_type}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-2">Booking Type</h3>
                      <div className="flex items-center gap-2">
                        {selectedBooking.booking_type === 'VIDEO_CALL' ? (
                          <Video size={16} className="text-blue-600" />
                        ) : (
                          <MapPin size={16} className="text-green-600" />
                        )}
                        <span className="text-gray-900">{selectedBooking.booking_type.replace('_', ' ')}</span>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-2">Status</h3>
                      <StatusBadge status={selectedBooking.booking_status} />
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-2">Payment</h3>
                      <div className="flex items-center gap-4">
                        <PaymentStatusBadge status={selectedBooking.payment_status} />
                        <span className="text-gray-900 font-medium">₹{selectedBooking.booking_charge}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex justify-end">
                <button
                  onClick={() => setIsViewModalOpen(false)}
                  className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {
          isExpertViewModal && <ExpertBookingDetails expert={expertData} booking={selectedBooking} onClose={() => setIsExpertViewModal(false)} />
        }

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
      </div>
    </div>
  );
}