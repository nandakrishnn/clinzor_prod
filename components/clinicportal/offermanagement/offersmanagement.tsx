import React, { useEffect, useState } from 'react';
import { Plus, Calendar, Percent, Tag, Clock, Edit3, Trash2, Eye, Search, Filter, MoreHorizontal, TrendingUp, Users, DollarSign, CheckCircle, XCircle, AlertTriangle, X, Loader } from 'lucide-react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { createClinicOffers, deleteClinicOffers, editClinicOffers, GetAllClinicOffers } from '@/service/clinic/clinicOfferManagementService';
import { Clinic_by_clinic_user, GetAllClinicService, GetAllServiceForClinic } from '@/service/clinic/serviceManagementService';
import { NotificationProps } from '@/types/user';
import { motion, AnimatePresence } from 'framer-motion';
// Type definitions for offer and status
interface Offer {
  uuid: string;
  title: string;
  offer_type: string;
  status: string;
  description: string;
  valid_from: string;
  valid_to: string;
  discount_percentage: string;
  flat_discount_amt: string;
  reason_for_rejection: string;
  clinic_service: string;
  usage_count: number;
  total_savings: number;
}
// Service type for dropdown
interface Service {
  uuid: string;
  clinic: string;
  service_name: string;
}

// Add NewOffer type for form state
interface NewOffer {
  title: string;
  description: string;
  discount_percentage: string;
  valid_from: Date | null;
  valid_to: Date | null;
  clinic_service: string;
}

// Sample services for dropdown (replace with API data as needed)
// const sampleServices: Service[] = [
//   { uuid: '1', name: 'Cardiology Consultation' },
//   { uuid: '2', name: 'Heart Surgery' },
//   { uuid: '3', name: 'Neurology Consultation' },
//   { uuid: '4', name: 'General Medicine' },
// ];
const Notification = ({ type, message, onClose }: NotificationProps) => {
  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-400" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-red-400" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-400" />;
    }
  };

  const getBgColor = () => {
    switch (type) {
      case 'success':
        return 'bg-green-50';
      case 'error':
        return 'bg-red-50';
      case 'warning':
        return 'bg-yellow-50';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg ${getBgColor()} border border-gray-200`}
    >
      <div className="flex items-center">
        {getIcon()}
        <p className="ml-3 text-sm font-medium text-gray-900">{message}</p>
        <button
          onClick={onClose}
          className="ml-4 text-gray-400 hover:text-gray-500"
        >
          <X size={16} />
        </button>
      </div>
    </motion.div>
  );
};
const ClinicOffersManager = () => {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const offersPerPage = 10;
  const [loading, setLoading] = useState(false);
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [showLiveOnly, setShowLiveOnly] = useState(false);
  const [statusFilter, setStatusFilter] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);
  const [newOffer, setNewOffer] = useState<NewOffer>({
    title: '',
    description: '',
    discount_percentage: '',
    valid_from: null,
    valid_to: null,
    clinic_service: ''
  });
  const [notification, setNotification] = useState<{
    type: 'success' | 'error' | 'warning';
    message: string;
  } | null>(null);

  // Modal state
  const [modalMode, setModalMode] = useState<'view' | 'edit' | 'delete' | null>(null);
  const [paginationData, setPaginationData] = useState({
    current_page: 1,
    total_pages: 1,
    total_items: 0,
    next: null as string | null,
    previous: null as string | null
  });
  // Dropdown state for actions menu
  const [actionMenuOfferId, setActionMenuOfferId] = useState<string | null>(null);
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null);
  const [serviceFilter, setServiceFilter] = useState('');
  const isOfferLive = (offer: Offer): boolean => {
    const now = new Date();
    const validFrom = new Date(offer.valid_from);
    const validTo = new Date(offer.valid_to);
    return now >= validFrom && now <= validTo && offer.status === 'ACTIVE';
  };

  const fetchOffers = async (
    page: number = currentPage,
    search: string = searchTerm,
    status: string = statusFilter,
    service: string = serviceFilter,
    fromDate: string = dateFrom,
    toDate: string = dateTo,
    liveOnly: boolean = showLiveOnly
  ) => {
    try {
      setLoading(true);
      const clinicUser = await Clinic_by_clinic_user();
      const clinicId = clinicUser?.uuid;

      const [serviceData, offersResponse] = await Promise.all([
        GetAllClinicService(clinicId, 'approved'),
        GetAllClinicOffers(page, offersPerPage, search, status, service, fromDate, toDate, liveOnly)
      ]);

      setOffers(offersResponse.data || []);
      setServices(serviceData.data || []);
      setPaginationData({
        current_page: offersResponse.current_page || 1,
        total_pages: offersResponse.total_pages || 1,
        total_items: offersResponse.total_items || 0,
        next: offersResponse.next || null,
        previous: offersResponse.previous || null
      });
    } catch (error) {
      console.error("Failed to fetch offers:", error);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchOffers();
  }, []);

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  
  // Format for Indian timezone without double conversion
  return date.toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
};


  // Update search handler with debounce
  const handleSearchChange = (term: string) => {
    setSearchTerm(term);

    // Clear previous timeout
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    // Set new timeout for debounced search
    const timeoutId = setTimeout(() => {
      fetchOffers(1, term, statusFilter, serviceFilter, dateFrom, dateTo, showLiveOnly);
      setCurrentPage(1); // Reset to first page when searching
    }, 500);

    setSearchTimeout(timeoutId);
  };

  // Update filter handlers to trigger API calls
  const handleStatusFilterChange = (status: string) => {
    setStatusFilter(status);
    setCurrentPage(1); // Reset to first page when filtering
    fetchOffers(1, searchTerm, status, serviceFilter, dateFrom, dateTo, showLiveOnly);
  };

  const handleServiceFilterChange = (service: string) => {
    setServiceFilter(service);
    setCurrentPage(1);
    fetchOffers(1, searchTerm, statusFilter, service, dateFrom, dateTo, showLiveOnly);
  };

  const handleLiveOnlyChange = (liveOnly: boolean) => {
    setShowLiveOnly(liveOnly);
    setCurrentPage(1);
    fetchOffers(1, searchTerm, statusFilter, serviceFilter, dateFrom, dateTo, liveOnly);
  };

  const handleDateFilterChange = (from: string, to: string) => {
    setDateFrom(from);
    setDateTo(to);
    setCurrentPage(1);
    fetchOffers(1, searchTerm, statusFilter, serviceFilter, from, to, showLiveOnly);
  };

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }
    };
  }, [searchTimeout]);

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'ACTIVE': return {
        color: 'bg-emerald-500/10 text-emerald-700 border-emerald-500/20',
        dot: 'bg-emerald-500'
      };
      case 'DRAFT': return {
        color: 'bg-amber-500/10 text-amber-700 border-amber-500/20',
        dot: 'bg-amber-500'
      };
      case 'EXPIRED': return {
        color: 'bg-red-500/10 text-red-700 border-red-500/20',
        dot: 'bg-red-500'
      };
      default: return {
        color: 'bg-slate-500/10 text-slate-700 border-slate-500/20',
        dot: 'bg-slate-500'
      };
    }
  };

  // Filtering logic
  // const filteredOffers = offers.filter(offer => {
  //   const matchesSearch = offer.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //     offer.description?.toLowerCase().includes(searchTerm.toLowerCase());
  //   const matchesFilter = showLiveOnly ? isOfferLive(offer) : true;
  //   const matchesStatus = statusFilter ? offer.status === statusFilter : true;
  //   const matchesDateFrom = dateFrom ? new Date(offer.valid_from) >= new Date(dateFrom) : true;
  //   const matchesDateTo = dateTo ? new Date(offer.valid_to) <= new Date(dateTo) : true;
  //   return matchesSearch && matchesFilter && matchesStatus && matchesDateFrom && matchesDateTo;
  // });

  // Pagination logic
  const totalPages = paginationData.total_pages || 1;
  // const paginatedOffers = filteredOffers.slice((currentPage - 1) * offersPerPage, currentPage * offersPerPage);
  const paginatedOffers = offers;

const totalActiveOffers = offers.filter(offer => offer.status === 'ACTIVE').length;
const totalUsage = offers.reduce((sum, offer) => sum + (offer.usage_count || 0), 0);
const totalSavings = offers.reduce((sum, offer) => sum + (offer.total_savings || 0), 0);
const totalUniqueUsers = offers.reduce((sum, offer) => sum + (offer.usage_count || 0), 0);

  const handleCreateOffer = async () => {
    try {
      setLoading(true);
      // Get clinic ID (you might need to fetch this from your state or context)
      const clinicUser = await Clinic_by_clinic_user();
      if (!clinicUser?.uuid) {
        throw new Error("Clinic not found");
      }

      // Prepare the offer data for the backend
      const offerData = {
        title: newOffer.title,
        offer_type: "CLINIC",
        description: newOffer.description,
        valid_from: newOffer.valid_from ? newOffer.valid_from.toISOString() : '',
        valid_to: newOffer.valid_to ? newOffer.valid_to.toISOString() : '',
        discount_percentage: newOffer.discount_percentage,
        clinic_service: newOffer.clinic_service,
        // Add required fields for NewClinicOffer type (dummy/default values, replace as needed)
        name: "",
        email: "",
        phone: "",
        type: "",
        address: "",
        city: "",
        state: "",
        country: "",
        pincode: "",
        gst_number: "",
        pan_number: "",
        website: "",
        logo: "",
        // Add missing required fields for NewClinicOffer
        postalCode: "",
        about: "",
        insuranceNetworks: [],
        specialties: [],
        location: { lat: 0, lng: 0 },
      };

      // Call the API
      const createdOffer = await createClinicOffers(offerData);
      setNotification({
        type: 'success',
        message: 'Offer saved successfully!'
      });

      // Update local state with the response from the backend
      setOffers([...offers, {
        ...createdOffer,
        uuid: createdOffer.uuid || `offer-${Date.now()}`,
        status: "DRAFT", // Or whatever status the backend returns
        usage_count: 0,
        total_savings: 0,
        discount_percentage: newOffer.discount_percentage,
        reason_for_rejection: ''
      }]);

      // Reset form and close modal
      setNewOffer({
        title: '',
        description: '',
        discount_percentage: '',
        valid_from: null,
        valid_to: null,
        clinic_service: ''
      });
      setShowCreateModal(false);
      fetchOffers();
    } catch (error: any) {
      console.error("Failed to create offer:", error);
      setNotification({
        type: 'error',
        message: `Failed to save offer. Please try again ${error.response.data.non_field_errors || error.message}`
      });
      // You might want to show an error message to the user here
    } finally {
      setLoading(false);
    }
  };

  // Modal open handlers
  const handleViewOffer = (offer: Offer) => {
    setSelectedOffer(offer);
    setModalMode('view');
  };
  const handleEditOffer = (offer: Offer) => {
    setSelectedOffer(offer);
    setNewOffer({
      title: offer.title,
      description: offer.description,
      discount_percentage: offer.discount_percentage,
      valid_from: offer.valid_from ? new Date(offer.valid_from) : null,
      valid_to: offer.valid_to ? new Date(offer.valid_to) : null,
      clinic_service: offer.clinic_service,
    });
    setModalMode('edit');
  };
  const handleDeleteOffer = (offer: Offer) => {
    setSelectedOffer(offer);
    setModalMode('delete');
  };
  const closeModal = () => {
    setShowCreateModal(false);
    setModalMode(null);
    setSelectedOffer(null);
    setNewOffer({
      title: '',
      description: '',
      discount_percentage: '',
      valid_from: null,
      valid_to: null,
      clinic_service: ''
    });
  };

  // Edit offer handler
  const handleUpdateOffer = async () => {
    if (!selectedOffer) return;

    try {
      setLoading(true);
      // Prepare the data for API call (include all required fields for NewClinicOffer)
      const offerData = {
        title: newOffer.title,
        offer_type: "CLINIC",
        description: newOffer.description,
        valid_from: newOffer.valid_from ? newOffer.valid_from.toISOString() : '',
        valid_to: newOffer.valid_to ? newOffer.valid_to.toISOString() : '',
        discount_percentage: newOffer.discount_percentage,
        clinic_service: newOffer.clinic_service,
        // Add required fields for NewClinicOffer type (dummy/default values, replace as needed)
        name: "",
        email: "",
        phone: "",
        type: "",
        address: "",
        city: "",
        state: "",
        country: "",
        pincode: "",
        gst_number: "",
        pan_number: "",
        website: "",
        logo: "",
        // Add missing required fields for NewClinicOffer
        postalCode: "",
        about: "",
        insuranceNetworks: [],
        specialties: [],
        location: { lat: 0, lng: 0 },
      };

      // Call the API to update the offer
      await editClinicOffers(selectedOffer.uuid, offerData);
      setNotification({
        type: 'success',
        message: 'Offer upadate successfully!'
      });
      // Update local state if API call succeeds
      setOffers(offers.map((o: Offer) =>
        o.uuid === selectedOffer.uuid
          ? { ...o, ...newOffer, valid_from: newOffer.valid_from ? newOffer.valid_from.toISOString() : '', valid_to: newOffer.valid_to ? newOffer.valid_to.toISOString() : '' }
          : o
      ));
      closeModal();
    } catch (error: any) {
      console.error("Failed to update offer:", error);
      setNotification({
        type: 'error',
        message: `Failed to save offer. Please try again ${error.response.data.non_field_errors || error.message}`
      });
    } finally {
      setLoading(false);
    }
  };



  // Delete offer handler
  const handleConfirmDelete = async () => {
    if (!selectedOffer) return;

    try {
      // Call the API to delete the offer
      await deleteClinicOffers(selectedOffer.uuid);
      setNotification({
        type: 'success',
        message: 'Offer delete successfully!'
      });
      // Update local state if API call succeeds
      setOffers(offers.filter((o: Offer) => o.uuid !== selectedOffer.uuid));
      closeModal();
    } catch (error: any) {
      console.error("Failed to delete offer:", error);
      setNotification({
        type: 'error',
        message: `Failed to save offer. Please try again ${error.response.data.non_field_errors || error.message}`
      });
      // You might want to show an error message to the user here
    }
  };

  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading ...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      {/* Header */}
      <div className="backdrop-blur-xl bg-white/80 border-b border-slate-200/60 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center space-x-8">
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 via-slate-800 to-slate-600 bg-clip-text text-transparent">
                  Offers
                </h1>
                <p className="text-sm text-slate-500 mt-1">Manage your clinic promotions</p>
              </div>

              {/* Stats Cards */}
              <div className="hidden lg:flex items-center space-x-6">
                <div className="flex items-center space-x-3 px-4 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                  <div className="p-2 bg-blue-500 rounded-lg">
                    <TrendingUp className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-blue-600 font-medium">Active Offers</p>
                    <p className="text-lg font-bold text-blue-700">{totalActiveOffers}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 px-4 py-2 bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl border border-emerald-100">
                  <div className="p-2 bg-emerald-500 rounded-lg">
                    <Users className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-emerald-600 font-medium">Total Usage</p>
                    <p className="text-lg font-bold text-emerald-700">{totalUsage}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 px-4 py-2 bg-gradient-to-r from-purple-50 to-violet-50 rounded-xl border border-purple-100">
                  <div className="p-2 bg-purple-500 rounded-lg">
                    <DollarSign className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-purple-600 font-medium">Savings</p>
                    <p className="text-lg font-bold text-purple-700">${totalSavings.toLocaleString()}</p>
                  </div>
                </div>
                {/* Unique Users Card */}
                <div className="flex items-center space-x-3 px-4 py-2 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-xl border border-orange-100">
                  <div className="p-2 bg-orange-500 rounded-lg">
                    <Users className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-orange-600 font-medium">Users Applied</p>
                    <p className="text-lg font-bold text-orange-700">{totalUniqueUsers}</p>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowCreateModal(true)}
              className="group relative inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl font-semibold"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-xl blur opacity-30 group-hover:opacity-50 transition-opacity"></div>
              <Plus className="w-5 h-5 mr-2 relative" />
              <span className="relative">Create Offer</span>
            </button>
          </div>
        </div>
      </div>

      {/* Advanced Filtering Section */}
      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 py-8">
        <div className="bg-white/80 border border-slate-200 rounded-2xl shadow-md p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-end gap-4 flex-wrap">
            {/* Search Bar */}
            <div className="flex-1 min-w-[180px]">
              <label htmlFor="offer-search" className="text-xs font-semibold text-slate-600 mb-1 ml-1 block">Search</label>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  id="offer-search"
                  type="text"
                  placeholder="Search offers..."
                  value={searchTerm}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-white/80 backdrop-blur-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all duration-200 text-slate-700 placeholder-slate-400"
                />
              </div>
            </div>
            {/* Service Dropdown */}
            <div className="min-w-[160px]">
              <label htmlFor="service-filter" className="text-xs font-semibold text-slate-600 mb-1 ml-1 block">Service</label>
              <select
                id="service-filter"
                value={serviceFilter}
                onChange={(e) => handleServiceFilterChange(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white/80 text-slate-700 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all duration-200 text-sm"
              >
                <option value="">All Services</option>
                {services.map(service => (
                  <option key={service.uuid} value={service.uuid}>{service.service_name}</option>
                ))}
              </select>
            </div>
            {/* Status Dropdown */}
            <div className="min-w-[140px]">
              <label htmlFor="status-filter" className="text-xs font-semibold text-slate-600 mb-1 ml-1 block">Status</label>
              <select
                id="status-filter"
                value={statusFilter}
                onChange={(e) => handleStatusFilterChange(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white/80 text-slate-700 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all duration-200"
              >
                <option value="">All Status</option>
                <option value="APPROVED">Approved</option>
                <option value="DRAFT">Draft</option>
                <option value="REJECTED">Rejected</option>
              </select>
            </div>
            {/* Live Only Switch */}
            <div className="min-w-[120px] flex flex-col">
              <label className="text-xs font-semibold text-slate-600 mb-1 ml-1 block">Live Only</label>
              <button
                onClick={() => handleLiveOnlyChange(!showLiveOnly)}
                className={`relative inline-flex items-center h-10 rounded-xl px-4 transition-all duration-200 border border-slate-200 ${showLiveOnly ? 'bg-gradient-to-r from-emerald-500 to-green-500 text-white shadow-lg shadow-emerald-500/25' : 'bg-white/80 text-slate-600 hover:bg-slate-50'}`}
                aria-pressed={showLiveOnly}
              >
                <span className={`inline-block w-4 h-4 rounded-full mr-2 transition-all duration-200 ${showLiveOnly ? 'bg-white' : 'bg-emerald-500 animate-pulse'}`} />
                {showLiveOnly ? 'Live Only' : 'All Offers'}
              </button>
            </div>
          </div>
          {/* Date Range and Reset Button Row */}
          <div className="flex flex-col sm:flex-row gap-4 mt-4 items-end">
            <div className="flex flex-col sm:flex-row gap-2 flex-1">
              <div className="flex-1 flex flex-col">
                <label className="text-xs font-semibold text-slate-600 mb-1 ml-1" htmlFor="date-from">From</label>
                <DatePicker
                  id="date-from"
                  selected={dateFrom ? new Date(dateFrom) : null}
                  onChange={date => handleDateFilterChange(date ? date.toISOString().split('T')[0] : '', dateTo)}
                  dateFormat="yyyy-MM-dd"
                  className="px-4 py-3 rounded-xl border border-slate-200 bg-white/80 text-slate-700 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all duration-200 w-full"
                  placeholderText="From"
                  isClearable
                />
              </div>
              <div className="flex items-center justify-center sm:mt-6 mt-0 mx-2 text-slate-400">-</div>
              <div className="flex-1 flex flex-col">
                <label className="text-xs font-semibold text-slate-600 mb-1 ml-1" htmlFor="date-to">To</label>
                <DatePicker
                  id="date-to"
                  selected={dateTo ? new Date(dateTo) : null}
                  onChange={date => handleDateFilterChange(dateFrom, date ? date.toISOString().split('T')[0] : '')}
                  dateFormat="yyyy-MM-dd"
                  className="px-4 py-3 rounded-xl border border-slate-200 bg-white/80 text-slate-700 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all duration-200 w-full"
                  placeholderText="To"
                  isClearable
                />
              </div>
            </div>
            <button
              onClick={() => {
                setSearchTerm('');
                setShowLiveOnly(false);
                setStatusFilter('');
                setServiceFilter('');
                setDateFrom('');
                setDateTo('');
                setCurrentPage(1);
                fetchOffers(1, '', '', '', '', '', false);
              }}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-slate-200 to-slate-100 text-slate-700 font-semibold border border-slate-300 hover:from-slate-300 hover:to-slate-200 transition-all duration-200 mt-2 sm:mt-0"
            >
              Reset Filters
            </button>
          </div>
        </div>

        {/* Offers Grid */}
        {paginatedOffers.length === 0 ? (
          <div className="text-center py-20">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-3xl"></div>
              <Tag className="relative w-16 h-16 text-slate-400 mx-auto mb-6" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-3">
              {showLiveOnly ? 'No live offers found' : 'No offers match your search'}
            </h3>
            <p className="text-slate-500 text-lg mb-8 max-w-md mx-auto">
              {showLiveOnly
                ? 'Create and activate offers to see them here'
                : 'Try adjusting your search terms or create your first offer'}
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg font-semibold"
            >
              <Plus className="w-5 h-5 mr-2" />
              Create Your First Offer
            </button>
          </div>
        ) : (
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
            {paginatedOffers.map((offer) => {
              const statusConfig = getStatusConfig(offer.status);
              const isLive = isOfferLive(offer);

              return (
                <div key={offer.uuid} className="group relative">
                  {/* Glow effect for live offers */}
                  {isLive && (
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/20 to-green-400/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
                  )}

                  <div className="relative bg-white/90 backdrop-blur-xl rounded-2xl border border-slate-200/60 hover:border-slate-300/60 transition-all duration-300 shadow-sm hover:shadow-2xl hover:shadow-slate-200/50 overflow-hidden">
                    {/* Live indicator strip */}
                    {isLive && (
                      <div className="h-1 bg-gradient-to-r from-emerald-500 to-green-500"></div>
                    )}
                    {/* Usage count badge */}
                    <div
                      className="absolute top-3 right-3 z-10 flex items-center space-x-1 px-2 py-0.5 rounded-full bg-white/80 border border-blue-200 text-blue-700 text-xs font-medium shadow-sm hover:bg-blue-50 transition-colors cursor-default group"
                      title="Times used"
                    >
                      <Users className="w-3 h-3 mr-1 text-blue-400" />
                      <span>{offer.usage_count}</span>
                    </div>
                    <div className="p-7">
                      {/* Header */}
                      <div className="flex items-start justify-between mb-6">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                              {offer.title}
                            </h3>
                            {isLive && (
                              <div className="flex items-center space-x-1">
                                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                                <span className="text-xs font-semibold text-emerald-600">LIVE</span>
                              </div>
                            )}
                          </div>
                          <p className="text-slate-600 leading-relaxed">{offer.description}</p>
                        </div>

                        <div className="flex items-center space-x-2 ml-4 relative">
                          <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold border ${statusConfig.color}`}>
                            <div className={`w-1.5 h-1.5 ${statusConfig.dot} rounded-full mr-2`}></div>
                            {offer.status}
                          </span>
                          {/* Actions Dropdown */}
                          <div>
                            <button
                              className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                              onClick={() => setActionMenuOfferId(actionMenuOfferId === offer.uuid ? null : offer.uuid)}
                              aria-label="Actions"
                            >
                              <MoreHorizontal className="w-4 h-4" />
                            </button>
                            {actionMenuOfferId === offer.uuid && (
                              <div className="absolute right-0 mt-2 w-36 bg-white border border-slate-200 rounded-xl shadow-lg z-50">
                                <button
                                  className="w-full text-left px-4 py-2 hover:bg-blue-50 text-slate-700 rounded-t-xl"
                                  onClick={() => { handleViewOffer(offer); setActionMenuOfferId(null); }}
                                >
                                  View
                                </button>
                                <button
                                  className="w-full text-left px-4 py-2 hover:bg-blue-50 text-slate-700"
                                  onClick={() => { handleEditOffer(offer); setActionMenuOfferId(null); }}
                                >
                                  Edit
                                </button>
                                <button
                                  className="w-full text-left px-4 py-2 hover:bg-red-50 text-red-600 rounded-b-xl"
                                  onClick={() => { handleDeleteOffer(offer); setActionMenuOfferId(null); }}
                                >
                                  Delete
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                          <Percent className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                          <p className="text-2xl font-bold text-blue-700">{offer.discount_percentage}%</p>
                          <p className="text-xs text-blue-600 font-medium">Discount</p>
                        </div>
                        <div className="text-center p-4 bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl border border-emerald-100">
                          <Users className="w-6 h-6 text-emerald-600 mx-auto mb-2" />
                          <p className="text-2xl font-bold text-emerald-700">{offer.usage_count || 0}</p>
                          <p className="text-xs text-emerald-600 font-medium">Used</p>
                        </div>
                      </div>

                      {/* Timeline */}
                      <div className="space-y-3 mb-6">
                        <div className="flex items-center text-sm text-slate-600">
                          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                            <Calendar className="w-4 h-4 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-semibold text-slate-900">Starts</p>
                            <p>{formatDate(offer.valid_from)}</p>
                          </div>
                        </div>

                        <div className="flex items-center text-sm text-slate-600">
                          <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center mr-3">
                            <Clock className="w-4 h-4 text-amber-600" />
                          </div>
                          <div>
                            <p className="font-semibold text-slate-900">Expires</p>
                            <p>{formatDate(offer.valid_to)}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex flex-wrap justify-center items-center gap-2 mt-8">
            <button
              onClick={() => {
                const nextPage = Math.max(1, currentPage - 1);
                if (nextPage !== currentPage) {
                  setCurrentPage(nextPage);
                  fetchOffers(nextPage, searchTerm, statusFilter, serviceFilter, dateFrom, dateTo, showLiveOnly);
                }
              }}
              disabled={currentPage === 1 || !paginationData.previous}
              className="px-4 py-2 rounded-lg border border-slate-200 bg-white/80 text-slate-700 font-semibold disabled:opacity-50"
            >
              Prev
            </button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => {
                  setCurrentPage(i + 1);
                  fetchOffers(i + 1, searchTerm, statusFilter, serviceFilter, dateFrom, dateTo, showLiveOnly);
                }}
                className={`px-3 py-2 rounded-lg border border-slate-200 font-semibold ${currentPage === i + 1 ? 'bg-blue-600 text-white' : 'bg-white/80 text-slate-700'}`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => {
                const nextPage = Math.min(totalPages, currentPage + 1);
                if (nextPage !== currentPage) {
                  setCurrentPage(nextPage);
                  fetchOffers(nextPage, searchTerm, statusFilter, serviceFilter, dateFrom, dateTo, showLiveOnly);
                }
              }}
              disabled={currentPage === totalPages || !paginationData.next}
              className="px-4 py-2 rounded-lg border border-slate-200 bg-white/80 text-slate-700 font-semibold disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* Create Offer Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white/95 backdrop-blur-xl rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto border border-white/20 shadow-2xl relative">
            {/* Close (X) Button */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 text-2xl font-bold focus:outline-none"
              aria-label="Close"
            >
              &times;
            </button>
            <div className="p-8">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Plus className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Create New Offer</h2>
                <p className="text-slate-500">Design your next promotion</p>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Offer Title</label>
                  <input
                    type="text"
                    value={newOffer.title}
                    onChange={(e) => setNewOffer({ ...newOffer, title: e.target.value })}
                    className="w-full px-4 py-3 bg-white/80 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all duration-200"
                    placeholder="Summer Wellness Special"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Description</label>
                  <textarea
                    value={newOffer.description}
                    onChange={(e) => setNewOffer({ ...newOffer, description: e.target.value })}
                    className="w-full px-4 py-3 bg-white/80 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all duration-200 resize-none"
                    rows={3}
                    placeholder="Get amazing discounts on all wellness services..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Discount Percentage</label>
                  <div className="relative">
                    <input
                      type="number"
                      value={newOffer.discount_percentage}
                      onChange={(e) => setNewOffer({ ...newOffer, discount_percentage: e.target.value })}
                      className="w-full px-4 py-3 bg-white/80 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all duration-200 pr-12"
                      placeholder="20"
                      min="0"
                      max="100"
                    />
                    <Percent className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Start Date</label>
                    <DatePicker
                      selected={newOffer.valid_from}
                      onChange={date => setNewOffer({ ...newOffer, valid_from: date })}
                      dateFormat="yyyy-MM-dd"
                      className="w-full px-4 py-3 bg-white/80 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all duration-200"
                      placeholderText="Select start date"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">End Date</label>
                    <DatePicker
                      selected={newOffer.valid_to}
                      onChange={date => setNewOffer({ ...newOffer, valid_to: date })}
                      dateFormat="yyyy-MM-dd"
                      className="w-full px-4 py-3 bg-white/80 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all duration-200"
                      placeholderText="Select end date"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Service</label>
                  <select
                    value={newOffer.clinic_service}
                    onChange={(e) => setNewOffer({ ...newOffer, clinic_service: e.target.value })}
                    className="w-full px-4 py-3 bg-white/80 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all duration-200 text-sm"
                  >
                    <option value="">Select a service</option>
                    {services.map(service => (
                      <option key={service.uuid} value={service.uuid}>{service.service_name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex space-x-4 mt-10">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-6 py-3 text-slate-600 bg-slate-100 rounded-xl hover:bg-slate-200 transition-all duration-200 font-semibold"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateOffer}
                  disabled={loading}
                  className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg font-semibold"
                >
                  {loading ? (
                    <Loader className="w-5 h-5 mr-2 animate-spin" />
                  ) : (
                    <Plus className="w-5 h-5 mr-2" />
                  )}
                  <span>Create Offer</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View/Edit/Delete Offer Modal */}
      {modalMode === 'view' && selectedOffer && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white/95 backdrop-blur-xl rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto border border-white/20 shadow-2xl relative">
            {/* Close (X) Button */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 text-2xl font-bold focus:outline-none"
              aria-label="Close"
            >
              &times;
            </button>
            <div className="p-8">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Offer Details</h2>
                <p className="text-slate-500">View all details of this offer</p>
              </div>
              <div className="space-y-4 text-left">
                <div><span className="font-bold">Title:</span> {selectedOffer.title}</div>
                <div><span className="font-bold">Description:</span> {selectedOffer.description}</div>
                <div><span className="font-bold">Discount:</span> {selectedOffer.discount_percentage}%</div>
                <div><span className="font-bold">Valid From:</span> {formatDate(selectedOffer.valid_from)}</div>
                <div><span className="font-bold">Valid To:</span> {formatDate(selectedOffer.valid_to)}</div>
                <div><span className="font-bold">Status:</span> {selectedOffer.status}</div>
                <div><span className="font-bold">Service:</span> {services.find(s => s.uuid === selectedOffer.clinic_service)?.service_name || selectedOffer.clinic_service}</div>
                <div><span className="font-bold">Usage Count:</span> {selectedOffer.usage_count}</div>
                <div><span className="font-bold">Total Savings:</span> ${selectedOffer.total_savings}</div>
              </div>
              <div className="flex space-x-4 mt-10">
                <button
                  onClick={closeModal}
                  className="flex-1 px-6 py-3 text-slate-600 bg-slate-100 rounded-xl hover:bg-slate-200 transition-all duration-200 font-semibold"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {modalMode === 'edit' && selectedOffer && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white/95 backdrop-blur-xl rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto border border-white/20 shadow-2xl relative">
            {/* Close (X) Button */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 text-2xl font-bold focus:outline-none"
              aria-label="Close"
            >
              &times;
            </button>
            <div className="p-8">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Edit Offer</h2>
                <p className="text-slate-500">Update the offer details</p>
              </div>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Offer Title</label>
                  <input
                    type="text"
                    value={newOffer.title}
                    onChange={(e) => setNewOffer({ ...newOffer, title: e.target.value })}
                    className="w-full px-4 py-3 bg-white/80 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all duration-200"
                    placeholder="Summer Wellness Special"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Description</label>
                  <textarea
                    value={newOffer.description}
                    onChange={(e) => setNewOffer({ ...newOffer, description: e.target.value })}
                    className="w-full px-4 py-3 bg-white/80 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all duration-200 resize-none"
                    rows={3}
                    placeholder="Get amazing discounts on all wellness services..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Discount Percentage</label>
                  <div className="relative">
                    <input
                      type="number"
                      value={newOffer.discount_percentage}
                      onChange={(e) => setNewOffer({ ...newOffer, discount_percentage: e.target.value })}
                      className="w-full px-4 py-3 bg-white/80 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all duration-200 pr-12"
                      placeholder="20"
                      min="0"
                      max="100"
                    />
                    <Percent className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Start Date</label>
                    <DatePicker
                      selected={newOffer.valid_from}
                      onChange={date => setNewOffer({ ...newOffer, valid_from: date })}
                      dateFormat="yyyy-MM-dd"
                      className="w-full px-4 py-3 bg-white/80 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all duration-200"
                      placeholderText="Select start date"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">End Date</label>
                    <DatePicker
                      selected={newOffer.valid_to}
                      onChange={date => setNewOffer({ ...newOffer, valid_to: date })}
                      dateFormat="yyyy-MM-dd"
                      className="w-full px-4 py-3 bg-white/80 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all duration-200"
                      placeholderText="Select end date"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Service</label>
                  <select
                    value={newOffer.clinic_service}
                    onChange={(e) => setNewOffer({ ...newOffer, clinic_service: e.target.value })}
                    className="w-full px-4 py-3 bg-white/80 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all duration-200 text-sm"
                  >
                    <option value="">Select a service</option>
                    {services.map(service => (
                      <option key={service.uuid} value={service.uuid}>{service.service_name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex space-x-4 mt-10">
                <button
                  onClick={closeModal}
                  className="flex-1 px-6 py-3 text-slate-600 bg-slate-100 rounded-xl hover:bg-slate-200 transition-all duration-200 font-semibold"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateOffer}
                  disabled={loading}
                  className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg font-semibold"
                >
                  {loading ? (
                    <Loader className="w-5 h-5 mr-2 animate-spin" />
                  ) : (
                    <Plus className="w-5 h-5 mr-2" />
                  )}
                  <span>  Update Offer</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {modalMode === 'delete' && selectedOffer && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white/95 backdrop-blur-xl rounded-3xl max-w-sm w-full max-h-[90vh] overflow-y-auto border border-white/20 shadow-2xl relative">
            {/* Close (X) Button */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 text-2xl font-bold focus:outline-none"
              aria-label="Close"
            >
              &times;
            </button>
            <div className="p-8">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Delete Offer</h2>
                <p className="text-slate-500">Are you sure you want to delete this offer?</p>
              </div>
              <div className="text-center text-slate-700 mb-8">
                <div className="font-bold mb-2">{selectedOffer.title}</div>
                <div>{selectedOffer.description}</div>
              </div>
              <div className="flex space-x-4 mt-10">
                <button
                  onClick={closeModal}
                  className="flex-1 px-6 py-3 text-slate-600 bg-slate-100 rounded-xl hover:bg-slate-200 transition-all duration-200 font-semibold"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmDelete}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-xl hover:from-red-700 hover:to-pink-700 transition-all duration-200 shadow-lg font-semibold"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Notifications */}
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
  );
};

export default ClinicOffersManager;