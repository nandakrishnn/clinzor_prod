import React, { useState, useMemo } from 'react';
import { Plus, Edit3, Trash2, Calendar, Percent, Tag, FileText, X, Check, XCircle, CheckCircle, Clock, ChevronLeft, ChevronRight, Search, Filter } from 'lucide-react';

// Type definitions
type ClinicDetails = {
  name: string;
  email: string;
};

type Offer = {
  uuid: string;
  title: string;
  offer_type: 'ADMIN' | 'PROMOTIONAL' | 'SYSTEM';
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  description: string;
  valid_from: string;
  valid_to: string;
  discount_percentage: string;
  created_by: string;
  created_by_type: 'ADMIN' | 'CLINIC';
  clinic_details?: ClinicDetails;
};

type OfferFormData = {
  title: string;
  offer_type: 'ADMIN' | 'PROMOTIONAL' | 'SYSTEM';
  description: string;
  valid_from: string;
  valid_to: string;
  discount_percentage: string;
  created_by_type: 'ADMIN' | 'CLINIC';
  clinic_details?: ClinicDetails;
};

const OfferManagementTable = () => {
  const [offers, setOffers] = useState<Offer[]>([
    {
      uuid: "34447087-365d-4074-81eb-f88b00fc6c69",
      title: "50% discount",
      offer_type: "ADMIN",
      status: "PENDING",
      description: "avail rs 300 discount on all the related service",
      valid_from: "2025-05-18T14:00:00Z",
      valid_to: "2025-05-20T10:00:00Z",
      discount_percentage: "50.00",
      created_by: "admin@gmail.com",
      created_by_type: 'ADMIN',
    },
    {
      uuid: "34447087-365d-4074-81eb-f88b00fc6c70",
      title: "Summer Sale",
      offer_type: "PROMOTIONAL",
      status: "APPROVED",
      description: "Special summer discount for all services",
      valid_from: "2025-06-01T00:00:00Z",
      valid_to: "2025-06-30T23:59:59Z",
      discount_percentage: "30.00",
      created_by: "manager@gmail.com",
      created_by_type: 'ADMIN',
    },
    {
      uuid: "34447087-365d-4074-81eb-f88b00fc6c71",
      title: "New Customer Offer",
      offer_type: "SYSTEM",
      status: "REJECTED",
      description: "Welcome discount for first-time customers",
      valid_from: "2025-05-01T00:00:00Z",
      valid_to: "2025-05-31T23:59:59Z",
      discount_percentage: "25.00",
      created_by: "system@gmail.com",
      created_by_type: 'ADMIN',
    },
    {
      uuid: "34447087-365d-4074-81eb-f88b00fc6c72",
      title: "Flash Sale",
      offer_type: "ADMIN",
      status: "PENDING",
      description: "Limited time flash sale offer",
      valid_from: "2025-06-25T00:00:00Z",
      valid_to: "2025-06-26T23:59:59Z",
      discount_percentage: "70.00",
      created_by: "admin@gmail.com",
      created_by_type: 'ADMIN',
    },
    {
      uuid: "34447087-365d-4074-81eb-f88b00fc6c73",
      title: "Loyalty Reward",
      offer_type: "PROMOTIONAL",
      status: "APPROVED",
      description: "Exclusive discount for loyal customers",
      valid_from: "2025-06-01T00:00:00Z",
      valid_to: "2025-12-31T23:59:59Z",
      discount_percentage: "15.00",
      created_by: "manager@gmail.com",
      created_by_type: 'ADMIN',
    },
    // Example clinic offers
    {
      uuid: "34447087-365d-4074-81eb-f88b00fc6c74",
      title: "Clinic Special",
      offer_type: "PROMOTIONAL",
      status: "APPROVED",
      description: "Special offer from Clinic A",
      valid_from: "2025-07-01T00:00:00Z",
      valid_to: "2025-07-31T23:59:59Z",
      discount_percentage: "20.00",
      created_by: "clinicA@gmail.com",
      created_by_type: 'CLINIC',
      clinic_details: { name: 'Clinic A', email: 'clinicA@gmail.com' },
    },
    {
      uuid: "34447087-365d-4074-81eb-f88b00fc6c75",
      title: "Clinic B Monsoon",
      offer_type: "ADMIN",
      status: "PENDING",
      description: "Monsoon offer from Clinic B",
      valid_from: "2025-08-01T00:00:00Z",
      valid_to: "2025-08-15T23:59:59Z",
      discount_percentage: "10.00",
      created_by: "clinicB@gmail.com",
      created_by_type: 'CLINIC',
      clinic_details: { name: 'Clinic B', email: 'clinicB@gmail.com' },
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOffer, setEditingOffer] = useState<Offer | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [offerViewType, setOfferViewType] = useState<'ADMIN' | 'CLINIC'>('ADMIN');
  const [formData, setFormData] = useState<OfferFormData>({
    title: '',
    offer_type: 'ADMIN',
    description: '',
    valid_from: '',
    valid_to: '',
    discount_percentage: '',
    created_by_type: 'ADMIN',
    clinic_details: undefined,
  });

  // Filter and search logic
  const filteredOffers = useMemo(() => {
    return offers.filter(offer => {
      const matchesViewType = offer.created_by_type === offerViewType;
      const matchesSearch = offer.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           offer.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'ALL' || offer.status === statusFilter;
      const matchesType = typeFilter === 'ALL' || offer.offer_type === typeFilter;
      return matchesViewType && matchesSearch && matchesStatus && matchesType;
    });
  }, [offers, searchTerm, statusFilter, typeFilter, offerViewType]);

  // Pagination logic
  const totalPages = Math.ceil(filteredOffers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedOffers = filteredOffers.slice(startIndex, startIndex + itemsPerPage);

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
        created_by_type: offer.created_by_type,
        clinic_details: offer.clinic_details,
      });
    } else {
      setEditingOffer(null);
      setFormData({
        title: '',
        offer_type: 'ADMIN',
        description: '',
        valid_from: '',
        valid_to: '',
        discount_percentage: '',
        created_by_type: offerViewType,
        clinic_details: offerViewType === 'CLINIC' ? { name: '', email: '' } : undefined,
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingOffer(null);
    setFormData({
      title: '',
      offer_type: 'ADMIN',
      description: '',
      valid_from: '',
      valid_to: '',
      discount_percentage: '',
      created_by_type: 'ADMIN',
      clinic_details: undefined,
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // For clinic details in the form
  const handleClinicDetailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      clinic_details: {
        name: name === 'name' ? value : prev.clinic_details?.name || '',
        email: name === 'email' ? value : prev.clinic_details?.email || '',
      }
    }));
  };

  const handleSubmit = () => {
    if (!formData.title || !formData.description || !formData.valid_from || !formData.valid_to || !formData.discount_percentage) {
      return;
    }
    if (formData.created_by_type === 'CLINIC' && (!formData.clinic_details?.name || !formData.clinic_details?.email)) {
      return;
    }
    if (editingOffer) {
      setOffers(prev => prev.map(offer => 
        offer.uuid === editingOffer.uuid 
          ? {
              ...offer,
              ...formData,
              valid_from: new Date(formData.valid_from).toISOString(),
              valid_to: new Date(formData.valid_to).toISOString(),
            }
          : offer
      ));
    } else {
      const newOffer: Offer = {
        uuid: Date.now().toString(),
        ...formData,
        status: 'PENDING',
        created_by: formData.created_by_type === 'ADMIN' ? 'admin@gmail.com' : (formData.clinic_details?.email || ''),
        valid_from: new Date(formData.valid_from).toISOString(),
        valid_to: new Date(formData.valid_to).toISOString(),
      };
      setOffers(prev => [...prev, newOffer]);
    }
    closeModal();
  };

  const deleteOffer = (uuid: string) => {
    setOffers(prev => prev.filter(offer => offer.uuid !== uuid));
  };

  const updateOfferStatus = (uuid: string, newStatus: 'PENDING' | 'APPROVED' | 'REJECTED') => {
    setOffers(prev => prev.map(offer => 
      offer.uuid === uuid ? { ...offer, status: newStatus } : offer
    ));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'APPROVED': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'PENDING': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'REJECTED': return 'bg-red-50 text-red-700 border-red-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'ADMIN': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'PROMOTIONAL': return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'SYSTEM': return 'bg-gray-50 text-gray-700 border-gray-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const StatusIcon = ({ status }: { status: string }) => {
    switch (status) {
      case 'APPROVED': return <CheckCircle size={14} className="text-emerald-600" />;
      case 'PENDING': return <Clock size={14} className="text-amber-600" />;
      case 'REJECTED': return <XCircle size={14} className="text-red-600" />;
      default: return null;
    }
  };

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
            {offerViewType === 'ADMIN' && (
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
                <option value="PENDING">Pending</option>
                <option value="APPROVED">Approved</option>
                <option value="REJECTED">Rejected</option>
              </select>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="px-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
              >
                <option value="ALL">All Types</option>
                <option value="ADMIN">Admin</option>
                <option value="PROMOTIONAL">Promotional</option>
                <option value="SYSTEM">System</option>
              </select>
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
                  {offerViewType === 'CLINIC' && (
                    <th className="text-left py-5 px-6 font-semibold text-gray-800 text-sm tracking-wide">Clinic Details</th>
                  )}
                  <th className="text-left py-5 px-6 font-semibold text-gray-800 text-sm tracking-wide">Type</th>
                  <th className="text-left py-5 px-6 font-semibold text-gray-800 text-sm tracking-wide">Discount</th>
                  <th className="text-left py-5 px-6 font-semibold text-gray-800 text-sm tracking-wide">Valid Period</th>
                  <th className="text-left py-5 px-6 font-semibold text-gray-800 text-sm tracking-wide">Status</th>
                  <th className="text-right py-5 px-6 font-semibold text-gray-800 text-sm tracking-wide">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {paginatedOffers.length > 0 ? paginatedOffers.map((offer: Offer) => (
                  <tr key={offer.uuid} className="hover:bg-gray-50/50 transition-all duration-200 group">
                    <td className="py-5 px-6">
                      <div>
                        <h3 className="font-semibold text-gray-900 text-lg">{offer.title}</h3>
                        <p className="text-sm text-gray-500 mt-1 leading-relaxed">{offer.description}</p>
                        <p className="text-xs text-gray-400 mt-2">Created by {offer.created_by}</p>
                      </div>
                    </td>
                    {offerViewType === 'CLINIC' && (
                      <td className="py-5 px-6">
                        <div>
                          <div className="font-semibold text-gray-800">{offer.clinic_details?.name}</div>
                          <div className="text-sm text-gray-500">{offer.clinic_details?.email}</div>
                        </div>
                      </td>
                    )}
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
                        <span className="text-xl font-bold text-gray-900">{offer.discount_percentage}%</span>
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
                        {offer.created_by_type === 'CLINIC' ? (
                          offer.status === 'PENDING' && (
                            <>
                              <button
                                onClick={() => updateOfferStatus(offer.uuid, 'APPROVED')}
                                className="p-2.5 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-xl transition-all duration-200 group-hover:scale-105"
                                title="Approve"
                              >
                                <CheckCircle size={18} />
                              </button>
                              <button
                                onClick={() => updateOfferStatus(offer.uuid, 'REJECTED')}
                                className="p-2.5 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-xl transition-all duration-200 group-hover:scale-105"
                                title="Reject"
                              >
                                <XCircle size={18} />
                              </button>
                            </>
                          )
                        ) : (
                          <>
                            {offer.status === 'PENDING' && (
                              <>
                                <button
                                  onClick={() => updateOfferStatus(offer.uuid, 'APPROVED')}
                                  className="p-2.5 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-xl transition-all duration-200 group-hover:scale-105"
                                  title="Approve"
                                >
                                  <CheckCircle size={18} />
                                </button>
                                <button
                                  onClick={() => updateOfferStatus(offer.uuid, 'REJECTED')}
                                  className="p-2.5 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-xl transition-all duration-200 group-hover:scale-105"
                                  title="Reject"
                                >
                                  <XCircle size={18} />
                                </button>
                              </>
                            )}
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
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-gray-500">
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
                  Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredOffers.length)} of {filteredOffers.length} offers
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
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
                          onClick={() => setCurrentPage(page)}
                          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                            isCurrentPage
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
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
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
      {isModalOpen && offerViewType === 'ADMIN' && (
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
              {/* Clinic details fields if Clinic offer */}
              {formData.created_by_type === 'CLINIC' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Clinic Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.clinic_details?.name || ''}
                      onChange={handleClinicDetailChange}
                      className="w-full px-4 py-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white text-lg"
                      placeholder="Enter clinic name"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Clinic Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.clinic_details?.email || ''}
                      onChange={handleClinicDetailChange}
                      className="w-full px-4 py-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white text-lg"
                      placeholder="Enter clinic email"
                      required
                    />
                  </div>
                </div>
              )}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Offer Type
                </label>
                <select
                  name="offer_type"
                  value={formData.offer_type}
                  onChange={handleInputChange}
                  className="w-full px-4 py-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white text-lg"
                >
                  <option value="ADMIN">Admin</option>
                  <option value="SYSTEM">System</option>
                  <option value="PROMOTIONAL">Promotional</option>
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

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Discount Percentage
                </label>
                <div className="relative">
                  <input
                    type="number"
                    name="discount_percentage"
                    value={formData.discount_percentage}
                    onChange={handleInputChange}
                    className="w-full px-4 py-4 pr-12 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white text-lg"
                    placeholder="Enter discount percentage"
                    min="0"
                    max="100"
                    required
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                    <Percent size={24} className="text-gray-400" />
                  </div>
                </div>
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
    </div>
  );
};

export default OfferManagementTable;