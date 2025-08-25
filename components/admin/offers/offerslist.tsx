import React, { useState, useMemo, useEffect } from 'react';
import { Plus, Edit3, Trash2, Calendar, Percent, Tag, FileText, X, Check, XCircle, CheckCircle, Clock, ChevronLeft, ChevronRight, Search, Filter, AlertTriangle } from 'lucide-react';
import { approveOrRejectOffers, createOffers, deleteOffers, editOffers, GetAllOffers } from '@/service/admin/offerManagementService';
import { motion, AnimatePresence } from 'framer-motion';
import { NotificationProps } from '@/types/user';

// Updated type definitions to match API response
type Offer = {
  uuid: string;
  created_by: string;
  title: string;
  offer_type: 'ADMIN' | 'CLINIC' | 'PROMOTIONAL' | 'SYSTEM';
  status: 'DRAFT' | 'APPROVED' | 'REJECTED';
  description: string;
  valid_from: string;
  valid_to: string;
  discount_percentage: string | null;
  flat_discount_amt: number | null;
  reason_for_rejection: string | null;
  max_use_limit: number;
  clinic_service: string | null;
  clinic: string | null;
  users: string[];
  service_name?: string | null;
  default_service_name?: string | null;
};

type OfferFormData = {
  title: string;
  offer_type: 'ADMIN' | 'CLINIC' | 'PROMOTIONAL' | 'SYSTEM';
  description: string;
  valid_from: string;
  valid_to: string;
  discount_percentage: string | null;
  flat_discount_amt: number | null;
  max_use_limit: number;
  clinic_service: string | null;
  clinic: string | null;
};

interface PaginationData {
  current_page: number;
  total_pages: number;
  total_items: number;
  next: string | null;
  previous: string | null;
}

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

const OfferManagementTable = () => {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOffer, setEditingOffer] = useState<Offer | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [rejectionReason, setRejectionReason] = useState<string>('');
  const [showRejectionModal, setShowRejectionModal] = useState<string | null>(null);
  const [offerViewType, setOfferViewType] = useState<'ADMIN' | 'CLINIC' | 'ALL'>('ALL');
  const [formData, setFormData] = useState<OfferFormData>({
    title: '',
    offer_type: 'ADMIN',
    description: '',
    valid_from: '',
    valid_to: '',
    discount_percentage: null,
    flat_discount_amt: null,
    max_use_limit: 1,
    clinic_service: null,
    clinic: null,
  });
  const [loading, setLoading] = useState(false);
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

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      fetchOffers(currentPage, {
        search: searchTerm,
        status: statusFilter,
        type: offerViewType,
      });
    }, 500); // 500ms debounce

    return () => clearTimeout(debounceTimer);
  }, [searchTerm, statusFilter, typeFilter, currentPage, offerViewType]);


  const fetchOffers = async (page = 1, filters: any = {}) => {
    try {
      setLoading(true);
      const response = await GetAllOffers(page, filters);
      setOffers(response.data);
      setPaginationData({
        current_page: response.current_page,
        total_pages: response.total_pages,
        total_items: response.total_items,
        next: response.next,
        previous: response.previous
      });
    } catch (error) {
      console.error(error);
      setNotification({
        type: 'error',
        message: 'Failed to load offers. Please try again later.'
      });
    } setLoading(false);
  };

  useEffect(() => {
    fetchOffers(currentPage);
  }, [currentPage]);

  // Filter and search logic
  // const filteredOffers = useMemo(() => {
  //   return offers.filter(offer => {
  //     const matchesViewType = offerViewType === 'ADMIN'
  //       ? offer.offer_type === 'ADMIN' || offer.offer_type === 'SYSTEM'
  //       : offer.offer_type === 'CLINIC';
  //     const matchesSearch = offer.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //       offer.description.toLowerCase().includes(searchTerm.toLowerCase());
  //     const matchesStatus = statusFilter === 'ALL' || offer.status === statusFilter;
  //     const matchesType = typeFilter === 'ALL' || offer.offer_type === typeFilter;
  //     return matchesViewType && matchesSearch && matchesStatus && matchesType;
  //   });
  // }, [offers, searchTerm, statusFilter, typeFilter, offerViewType]);

  const displayedOffers = offers;

  const totalPages = paginationData.total_pages;
  const totalItems = paginationData.total_items;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const openModal = (offer: Offer | null = null) => {
    if (offer) {
      setEditingOffer(offer);
      setFormData({
        title: offer.title,
        offer_type: offer.offer_type,
        description: offer.description,
        valid_from: new Date(offer.valid_from).toISOString().slice(0, 16),
        valid_to: new Date(offer.valid_to).toISOString().slice(0, 16),
        discount_percentage: offer.discount_percentage,
        flat_discount_amt: offer.flat_discount_amt,
        max_use_limit: offer.max_use_limit,
        clinic_service: offer.clinic_service,
        clinic: offer.clinic,
      });
    } else {
      setEditingOffer(null);
      setFormData({
        title: '',
        offer_type: offerViewType === 'ADMIN' ? 'ADMIN' : 'CLINIC',
        description: '',
        valid_from: '',
        valid_to: '',
        discount_percentage: null,
        flat_discount_amt: null,
        max_use_limit: 1,
        clinic_service: null,
        clinic: null,
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingOffer(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNumberInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value === '' ? null : Number(value)
    }));
  };

  const handleSubmit = async () => {
    // Basic validation
    if (!formData.title || !formData.description || !formData.valid_from || !formData.valid_to) {
      alert('Please fill in all required fields');
      return;
    }

    // Either percentage or flat amount must be provided
    if (!formData.discount_percentage && !formData.flat_discount_amt) {
      alert('Please provide either a discount percentage or flat amount');
      return;
    }

    try {
      // Prepare the minimal payload for the API
      const apiPayload = {
        title: formData.title,
        offer_type: formData.offer_type,
        description: formData.description,
        valid_from: new Date(formData.valid_from).toISOString(),
        valid_to: new Date(formData.valid_to).toISOString(),
        discount_percentage: formData.discount_percentage,
        max_use_limit: formData.max_use_limit,
        // Only include flat_discount_amt if discount_percentage is not provided
        ...(formData.discount_percentage ? {} : { flat_discount_amt: formData.flat_discount_amt })
      };

      if (editingOffer) {
        // Edit existing offer
        const response = await editOffers(editingOffer.uuid, apiPayload);

        // Update local state with the response from API
        setOffers(prev => prev.map(offer =>
          offer.uuid === editingOffer.uuid ? response.data : offer
        ));
      } else {
        // Create new offer
        const response = await createOffers(apiPayload);

        // Add the new offer to local state
        setOffers(prev => [...prev, response.data]);
      }

      // Close modal on success
      closeModal();
      setNotification({
        type: 'success',
        message: 'Offer saved successfully!'
      });

    } catch (error: any) {
      console.error('Error saving offer:', error);
      setNotification({
        type: 'error',
        message: `Failed to save offer. Please try again ${error.response?.data?.message || error.message}`
      });

    }
  };

  const deleteOffer = async (uuid: string) => {
    try {
      // Call the delete API
      await deleteOffers(uuid);

      // Update local state if API call succeeds
      setOffers(prev => prev.filter(offer => offer.uuid !== uuid));

      // Show success feedback
      setNotification({
        type: 'success',
        message: 'Offer deleted successfully!'
      });

    } catch (error) {
      console.error('Error deleting offer:', error);
      setNotification({
        type: 'error',
        message: 'Failed to delete offer. Please try again.'
      });

    }
  };

  const updateOfferStatus = async (uuid: string, newStatus: 'DRAFT' | 'APPROVED' | 'REJECTED' | 'DRAFT', reason?: string) => {
    // Optimistically update the UI first
    setOffers(prev => prev.map(offer =>
      offer.uuid === uuid ? {
        ...offer,
        status: newStatus,
        ...(newStatus === 'REJECTED' && reason ? { reason_for_rejection: reason } : {})
      } : offer
    ));

    try {
      // Call the API to update status
      await approveOrRejectOffers(uuid, {
        status: newStatus,
        ...(newStatus === 'REJECTED' && reason ? { reason_for_rejection: reason } : {})
      });

      // Show success notification
      setNotification({
        type: 'success',
        message: `Offer ${newStatus.toLowerCase()} successfully!`
      });
    } catch (error) {
      console.error('Error updating offer status:', error);

      // Revert the UI change if the API call fails
      setOffers(prev => prev.map(offer =>
        offer.uuid === uuid ? { ...offer, status: offer.status } : offer
      ));

      setNotification({
        type: 'error',
        message: `Failed to ${newStatus.toLowerCase()} offer. Please try again.`
      });
    }
  };

  const handleReject = (uuid: string, reason: string) => {
    updateOfferStatus(uuid, 'REJECTED', reason);
    setShowRejectionModal(null);
    setRejectionReason('');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'APPROVED': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'DRAFT': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'REJECTED': return 'bg-red-50 text-red-700 border-red-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'ADMIN': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'CLINIC': return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'PROMOTIONAL': return 'bg-green-50 text-green-700 border-green-200';
      case 'SYSTEM': return 'bg-gray-50 text-gray-700 border-gray-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const StatusIcon = ({ status }: { status: string }) => {
    switch (status) {
      case 'APPROVED': return <CheckCircle size={14} className="text-emerald-600" />;
      case 'DRAFT': return <Clock size={14} className="text-amber-600" />;
      case 'REJECTED': return <XCircle size={14} className="text-red-600" />;
      default: return null;
    }
  };

  const getDiscountDisplay = (offer: Offer) => {
    if (offer.discount_percentage) {
      return `${offer.discount_percentage}%`;
    } else if (offer.flat_discount_amt) {
      return `₹${offer.flat_discount_amt}`;
    }
    return 'N/A';
  };

  const getServiceName = (offer: Offer) => {
    return offer.service_name || offer.default_service_name || 'General';
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
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
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 mb-6 p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-semibold text-gray-900 tracking-tight">Offer Management</h1>
              <p className="text-gray-500 mt-2 text-lg">Manage your promotional offers and discounts</p>
            </div>
            {(offerViewType === 'ADMIN' || offerViewType === 'ALL') && (
              <button
                onClick={() => openModal()}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl font-medium flex items-center gap-2 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
              >
                <Plus size={20} />
                Add Offer
              </button>
            )}
          </div>
          {/* Toggle for Admin/Clinic offers */}
          <div className="mt-6 flex gap-2">
            <button
              className={`px-6 py-2 rounded-2xl font-semibold transition-all duration-200 ${offerViewType === 'ALL' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}
              onClick={() => setOfferViewType('ALL')}
            >
              ALL Offers
            </button>
            <button
              className={`px-6 py-2 rounded-2xl font-semibold transition-all duration-200 ${offerViewType === 'ADMIN' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}
              onClick={() => setOfferViewType('ADMIN')}
            >
              Admin Offers
            </button>
            <button
              className={`px-6 py-2 rounded-2xl font-semibold transition-all duration-200 ${offerViewType === 'CLINIC' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}
              onClick={() => setOfferViewType('CLINIC')}
            >
              Clinic Offers
            </button>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 mb-6 p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search offers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
              />
            </div>
            <div className="flex gap-3">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
              >
                <option value="ALL">All Status</option>
                <option value="DRAFT">Draft</option>
                {/* <option value="PENDING">Pending</option> */}
                <option value="APPROVED">Approved</option>
                <option value="REJECTED">Rejected</option>
              </select>
              {/* <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="px-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
              >
                <option value="ALL">All Types</option>
                <option value="ADMIN">Admin</option>
                <option value="CLINIC">Clinic</option>
              </select> */}
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50/50 backdrop-blur-sm border-b border-gray-100">
                <tr>
                  <th className="text-left py-5 px-6 font-semibold text-gray-800 text-sm tracking-wide">Offer Details</th>
                  <th className="text-left py-5 px-6 font-semibold text-gray-800 text-sm tracking-wide">Service</th>
                  <th className="text-left py-5 px-6 font-semibold text-gray-800 text-sm tracking-wide">Type</th>
                  <th className="text-left py-5 px-6 font-semibold text-gray-800 text-sm tracking-wide">Discount</th>
                  <th className="text-left py-5 px-6 font-semibold text-gray-800 text-sm tracking-wide">Valid Period</th>
                  <th className="text-left py-5 px-6 font-semibold text-gray-800 text-sm tracking-wide">Status</th>
                  <th className="text-right py-5 px-6 font-semibold text-gray-800 text-sm tracking-wide">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {displayedOffers.length > 0 ? displayedOffers.map((offer: Offer) => (
                  <tr key={offer.uuid} className="hover:bg-gray-50/50 transition-all duration-200 group">
                    <td className="py-5 px-6">
                      <div>
                        <h3 className="font-semibold text-gray-900 text-lg">{offer.title}</h3>
                        <p className="text-sm text-gray-500 mt-1 leading-relaxed">{offer.description}</p>
                        <p className="text-xs text-gray-400 mt-2">Created by {offer.created_by}</p>
                        <p className="text-xs text-gray-400">Max uses: {offer.max_use_limit}</p>
                        {offer.reason_for_rejection && (
                          <div className="mt-2 p-2 bg-red-50 rounded-lg">
                            <p className="text-xs text-red-600 font-medium">Rejection Reason:</p>
                            <p className="text-xs text-red-500">{offer.reason_for_rejection}</p>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="py-5 px-6">
                      <div className="text-sm text-gray-700">
                        {getServiceName(offer)}
                      </div>
                    </td>
                    <td className="py-5 px-6">
                      <span className={`inline-flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium border ${getTypeColor(offer.offer_type)}`}>
                        <Tag size={14} />
                        {offer.offer_type}
                      </span>
                    </td>
                    <td className="py-5 px-6">
                      <div className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl flex items-center justify-center">
                          <Percent size={18} className="text-white" />
                        </div>
                        <span className="text-xl font-bold text-gray-900">
                          {getDiscountDisplay(offer)}
                        </span>
                      </div>
                    </td>
                    <td className="py-5 px-6">
                      <div className="text-sm space-y-1">
                        <div className="flex items-center gap-2 text-gray-700">
                          <Calendar size={14} className="text-gray-400" />
                          <span className="font-medium">From:</span> {formatDate(offer.valid_from)}
                        </div>
                        <div className="flex items-center gap-2 text-gray-500">
                          <Calendar size={14} className="text-gray-400" />
                          <span className="font-medium">To:</span> {formatDate(offer.valid_to)}
                        </div>
                      </div>
                    </td>
                    <td className="py-5 px-6">
                      <span className={`inline-flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium border ${getStatusColor(offer.status)}`}>
                        <StatusIcon status={offer.status} />
                        {offer.status}
                      </span>
                    </td>
                    <td className="py-5 px-6">
                      <div className="flex items-center justify-end gap-2">
                        {offer.status === 'DRAFT' && (
                          <>
                            <button
                              onClick={() => updateOfferStatus(offer.uuid, 'APPROVED')}
                              className="p-2.5 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-xl transition-all duration-200 group-hover:scale-105"
                              title="Approve"
                            >
                              <CheckCircle size={18} />
                            </button>
                            <button
                              onClick={() => setShowRejectionModal(offer.uuid)}
                              className="p-2.5 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-xl transition-all duration-200 group-hover:scale-105"
                              title="Reject"
                            >
                              <XCircle size={18} />
                            </button>
                          </>
                        )}
                        {/* {offer.status === 'DRAFT' && (
                          <button
                            onClick={() => updateOfferStatus(offer.uuid, 'DRAFT')}
                            className="p-2.5 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-xl transition-all duration-200 group-hover:scale-105"
                            title="Submit for Approval"
                          >
                            <Check size={18} />
                          </button>
                        )} */}
                        <button
                          onClick={() => openModal(offer)}
                          className="p-2.5 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-xl transition-all duration-200 group-hover:scale-105"
                          title="Edit"
                        >
                          <Edit3 size={18} />
                        </button>
                        <button
                          onClick={() => deleteOffer(offer.uuid)}
                          className="p-2.5 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-xl transition-all duration-200 group-hover:scale-105"
                          title="Delete"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-gray-500">
                      <div className="flex flex-col items-center gap-3">
                        <FileText size={48} className="text-gray-300" />
                        <p className="text-lg font-medium">No offers found</p>
                        <p className="text-sm">Try adjusting your search or filters</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="border-t border-gray-100 bg-gray-50/30 px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500">
                  Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} offers
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-white rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft size={20} />
                  </button>

                  <div className="flex gap-1">
                    {[...Array(totalPages)].map((_, index) => {
                      const page = index + 1;
                      const isCurrentPage = page === currentPage;
                      const showPage = page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1);

                      if (!showPage && page === 2) {
                        return <span key={page} className="px-3 py-2 text-gray-400">...</span>;
                      }

                      if (!showPage && page === totalPages - 1) {
                        return <span key={page} className="px-3 py-2 text-gray-400">...</span>;
                      }

                      if (!showPage) return null;

                      return (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${isCurrentPage
                              ? 'bg-blue-600 text-white shadow-lg'
                              : 'text-gray-600 hover:text-gray-900 hover:bg-white'
                            }`}
                        >
                          {page}
                        </button>
                      );
                    })}
                  </div>


                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-white rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-8 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold text-gray-900">
                  {editingOffer ? 'Edit Offer' : 'Create New Offer'}
                </h2>
                <button
                  onClick={closeModal}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all duration-200"
                >
                  <X size={24} />
                </button>
              </div>
            </div>

            <div className="p-8 space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Offer Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full px-4 py-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white text-lg"
                  placeholder="Enter offer title"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Offer Type
                </label>
                <select
                  name="offer_type"
                  value={formData.offer_type}
                  onChange={handleInputChange}
                  className="w-full px-4 py-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white text-lg"
                  disabled={!!editingOffer}
                >
                  <option value="ADMIN">Admin</option>
                  <option value="CLINIC">Clinic</option>
                  <option value="PROMOTIONAL">Promotional</option>
                  <option value="SYSTEM">System</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full px-4 py-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white text-lg resize-none"
                  placeholder="Enter offer description"
                  rows={4}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Valid From
                  </label>
                  <input
                    type="datetime-local"
                    name="valid_from"
                    value={formData.valid_from}
                    onChange={handleInputChange}
                    className="w-full px-4 py-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white text-lg"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Valid To
                  </label>
                  <input
                    type="datetime-local"
                    name="valid_to"
                    value={formData.valid_to}
                    onChange={handleInputChange}
                    className="w-full px-4 py-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white text-lg"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Discount Percentage
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      name="discount_percentage"
                      value={formData.discount_percentage || ''}
                      onChange={handleNumberInputChange}
                      className="w-full px-4 py-4 pr-12 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white text-lg"
                      placeholder="Enter percentage"
                      min="0"
                      max="100"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                      <Percent size={24} className="text-gray-400" />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Flat Discount Amount
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      name="flat_discount_amt"
                      value={formData.flat_discount_amt || ''}
                      onChange={handleNumberInputChange}
                      className="w-full px-4 py-4 pr-12 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white text-lg"
                      placeholder="Enter amount"
                      min="0"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                      <span className="text-gray-400">₹</span>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Max Use Limit
                </label>
                <input
                  type="number"
                  name="max_use_limit"
                  value={formData.max_use_limit}
                  onChange={handleNumberInputChange}
                  className="w-full px-4 py-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white text-lg"
                  placeholder="Enter max uses"
                  min="1"
                  required
                />
              </div>

              <div className="flex items-center gap-4 pt-6">
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-4 px-6 rounded-2xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 text-lg"
                >
                  {editingOffer ? 'Update Offer' : 'Create Offer'}
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-6 py-4 border border-gray-300 text-gray-700 rounded-2xl font-semibold hover:bg-gray-50 transition-all duration-200 text-lg"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Rejection Modal */}
      {showRejectionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl w-full max-w-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Reject Offer</h3>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Please provide a reason for rejection..."
              className="w-full h-32 p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
            />
            <div className="flex space-x-3 mt-4">
              <button
                onClick={() => {
                  setShowRejectionModal(null);
                  setRejectionReason('');
                }}
                className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleReject(showRejectionModal, rejectionReason)}
                disabled={!rejectionReason.trim()}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Confirm Rejection
              </button>
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

export default OfferManagementTable;