import React, { useEffect, useState } from 'react';
import { Plus, Edit3, Trash2, Eye, X, Check, Search, Tag, Heart, Stethoscope, Brain, User, CheckCircle, XCircle, AlertCircle, ChevronLeft, ChevronRight, Image as ImageIcon } from 'lucide-react';
import { createService, deleteService, editService, getAdminServiceStaticData, GetAllClinicService, GetAllService } from '@/service/admin/clinicServiceManagentService';
import { uploadFiles } from '@/service/uploadService/uploadService';
import { motion, AnimatePresence } from "framer-motion";
type ServiceStatus = 'DRAFT' | 'APPROVED' | 'REJECTED' | 'DRAFT';

interface Service {
  uuid: string;
  name: string;
  description: string;
  tags: string;
  status: ServiceStatus;
  image?: string;
}

interface PaginationData {
  current_page: number;
  total_pages: number;
  total_items: number;
  next: string | null;
  previous: string | null;
}

interface NotificationProps {
  type: "success" | "error" | "warning";
  message: string;
  onClose: () => void;
}

type ModernModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  size?: "sm" | "lg" | "xl";
  children: React.ReactNode;
};

const Notification = ({ type, message, onClose }: NotificationProps) => {
  const getIcon = () => {
    switch (type) {
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-400" />;
      case "error":
        return <XCircle className="h-5 w-5 text-red-400" />;
      case "warning":
        return <AlertCircle className="h-5 w-5 text-yellow-400" />;
    }
  };

  const getBgColor = () => {
    switch (type) {
      case "success":
        return "bg-green-50";
      case "error":
        return "bg-red-50";
      case "warning":
        return "bg-yellow-50";
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

const ModernModal = ({
  isOpen,
  onClose,
  title,
  size = "lg",
  children
}: ModernModalProps) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div
        className={`bg-white rounded-2xl shadow-2xl ${size === "lg" ? "max-w-4xl w-full" :
          size === "xl" ? "max-w-5xl w-full" : "max-w-md w-full"
          } max-h-[90vh] overflow-y-auto`}
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
};
const MedicalServicesApp: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [viewingService, setViewingService] = useState<Service | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'APPROVED' | ServiceStatus>('APPROVED');
  const [currentPage, setCurrentPage] = useState(1);
  const [paginationData, setPaginationData] = useState<PaginationData>({
    current_page: 1,
    total_pages: 1,
    total_items: 0,
    next: null,
    previous: null
  });
  const [loading, setLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [formData, setFormData] = useState<{
    name: string;
    description: string;
    tags: string;
    image: File | string | null;
  }>({
    name: '',
    description: '',
    tags: '',
    image: '',
  });
  const [viewMode, setViewMode] = useState<'all' | 'approved'>('all');
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [notification, setNotification] = useState<{
    type: "success" | "error" | "warning";
    message: string;
  } | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState<Service | null>(null);

  const [dashData, setDashData] = useState<any>()
  const [statusCounts, setStatusCounts] = useState<{
    ALL: number;
    APPROVED: number;
    REJECTED: number;
    DRAFT: number;
  }>({
    ALL: 0,
    APPROVED: 0,
    REJECTED: 0,
    DRAFT: 0,
  });

  const fetchService = async (page = 1, search = '', status = 'APPROVED') => {
    setLoading(true);
    try {
      const data = await GetAllService(page, search, status);
      console.log(data, 'service data')
      setServices(data.data);
      setPaginationData({
        current_page: data.current_page,
        total_pages: data.total_pages,
        total_items: data.total_items,
        next: data.next,
        previous: data.previous
      });
      console.log("service full", data);
    } catch (error) {
      console.error("Error fetching services:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getDashboardStatics = async () => {
    try {
      const res = await getAdminServiceStaticData();
      console.log(res, "data fromt he clinic")
      if (res?.status === 200) {
        setDashData(res?.data);
        setStatusCounts({
          ALL: res?.data?.total_services,
          APPROVED: res?.data?.newly_added_service,
          REJECTED: res?.data?.rejected_service,
          DRAFT: res?.data?.requested_service,
        });
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    fetchService(currentPage, searchTerm, statusFilter);
    getDashboardStatics()
  }, [currentPage, searchTerm, statusFilter]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter]);

  console.log("service", statusFilter);

  const getServiceIcon = (name: string) => {
    const serviceLower = name?.toLowerCase();
    if (serviceLower?.includes('cardio') || serviceLower?.includes('heart')) {
      return <Heart className="w-5 h-5 text-red-500" />;
    } else if (serviceLower?.includes('neuro') || serviceLower?.includes('brain')) {
      return <Brain className="w-5 h-5 text-purple-500" />;
    } else if (serviceLower?.includes('physician') || serviceLower?.includes('doctor')) {
      return <User className="w-5 h-5 text-blue-500" />;
    } else {
      return <Stethoscope className="w-5 h-5 text-green-500" />;
    }
  };

  const getStatusColor = (status: ServiceStatus) => {
    switch (status) {
      case 'APPROVED':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'REJECTED':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'DRAFT':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const handleSubmit = async () => {
    if (!formData.name.trim() || !formData.description.trim() || !formData.tags.trim()) {
      setNotification({
        type: "error",
        message: "Please fill in all fields"
      });
      return;
    }

    setIsSubmitting(true);
    try {
      let imageUrl = '';

      // Upload image if a new file is selected
      if (selectedImageFile) {
        const imageUrls = await uploadFiles([selectedImageFile]);
        imageUrl = imageUrls[0]; // Get the first uploaded image URL
      } else if (typeof formData.image === 'string' && formData.image) {
        // Use existing image URL if editing and no new image selected
        imageUrl = formData.image;
      }

      const serviceData = {
        name: formData.name,
        description: formData.description,
        tags: formData.tags,
        image: imageUrl
      };

      if (editingService) {
        const updatedService = await editService(editingService.uuid, serviceData);
        setServices(services.map((service) =>
          service.uuid === editingService.uuid
            ? { ...service, ...updatedService }
            : service
        ));
        setNotification({
          type: 'success',
          message: 'Service updated successfully!'
        });
        fetchService(currentPage);
      } else {
        const newService = await createService(serviceData);
        fetchService(currentPage);
        setServices([...services, newService]);
        setNotification({
          type: 'success',
          message: 'Service created successfully!'
        });
      }
      resetForm();
    } catch (error: any) {
      console.error("Error saving service:", error);
      setNotification({
        type: 'error',
        message: `Failed to update user: ${error.response?.data?.message || error.message}`
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({ name: '', description: '', tags: '', image: '' });
    setIsFormOpen(false);
    setEditingService(null);
  };

  const handleEdit = (service: Service) => {
    setFormData({
      name: service.name,
      description: service.description,
      tags: service.tags,
      image: service.image || null,
    });
    setEditingService(service);
    setIsFormOpen(true);
  };

  const handleDelete = async (uuid: string) => {
    setIsDeleting(uuid);
    try {
      await deleteService(uuid);
      setServices(services.filter((service) => service.uuid !== uuid));
      setNotification({
        type: 'success',
        message: 'Service deleted successfully!'
      });
    } catch (error) {
      console.error("Error deleting service:", error);
      setNotification({
        type: 'error',
        message: 'Failed to delete service. Please try again.'
      });
    } finally {
      setIsDeleting(null);
      setDeleteModalOpen(false);
      setServiceToDelete(null);
    }
  };


  const openDeleteModal = (service: Service) => {
    setServiceToDelete(service);
    setDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setDeleteModalOpen(false);
    setServiceToDelete(null);
  };

  const handleStatusChange = (uuid: string, newStatus: ServiceStatus) => {
    setServices(services.map((service) =>
      service.uuid === uuid
        ? { ...service, status: newStatus }
        : service
    ));
  };

  const getFilteredServices = () => {
    let filtered = services.filter((service) => {
      const matchesSearch = service.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.tags?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'APPROVED' || service.status === statusFilter;
      return matchesSearch && matchesStatus;
    });

    if (viewMode === 'approved') {
      filtered = filtered.filter(service => service.status === 'APPROVED');
    }

    return filtered;
  };

  const filteredServices = getFilteredServices();

  // Handle page change
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= paginationData.total_pages) {
      setCurrentPage(newPage);
    }
  };

  // Reset to page 1 when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter]);

  const statusLabels: Record<string, string> = {
    ALL: 'Total Services',
    DRAFT: 'Requested Services',
    APPROVED: 'Newly Added Services',
    REJECTED: 'Rejected'
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'REJECTED':
        return <XCircle className="w-5 h-5 text-red-600" />;
      case 'DRAFT':
        return <AlertCircle className="w-5 h-5 text-yellow-600" />;
      default:
        return <Stethoscope className="w-5 h-5 text-blue-600" />;
    }
  };

  const handleTotalServicesClick = () => {
    setViewMode('all');
    setStatusFilter('APPROVED');
    setSearchTerm('');
  };

  const handleBackToAll = () => {
    setViewMode('all');
    setStatusFilter('APPROVED');
  };

  // Generate page numbers for pagination display
  const generatePageNumbers = () => {
    const pages = [];
    const totalPages = paginationData.total_pages;
    const current = paginationData.current_page;

    // Always show first page
    if (totalPages > 0) {
      pages.push(1);
    }

    // Add ellipsis if needed
    if (current > 3) {
      pages.push('...');
    }

    // Add pages around current page
    for (let i = Math.max(2, current - 1); i <= Math.min(totalPages - 1, current + 1); i++) {
      if (!pages.includes(i)) {
        pages.push(i);
      }
    }

    // Add ellipsis if needed
    if (current < totalPages - 2) {
      pages.push('...');
    }

    // Always show last page
    if (totalPages > 1) {
      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <div className="min-h-screen ">
      {/* Header */}
      <div className="bg-white  ">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
          <div className="flex flex-col md:flex-row gap-5 md:items-center justify-between h-auto sm:h-20 py-4">
            {/* Left Section: Back button + Icon + Title */}
            <div className="flex items-center gap-4">
              {viewMode === "approved" && (
                <button
                  onClick={handleBackToAll}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ChevronLeft className="w-5 h-5 text-gray-600" />
                </button>
              )}

              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primaryColor rounded-xl flex items-center justify-center shadow-lg">
                  <Stethoscope className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    {viewMode === "approved"
                      ? "All Approved Services"
                      : "Service Management"}
                  </h1>
                  <p className="text-sm text-gray-500">
                    {viewMode === "approved"
                      ? "View all approved services in the database"
                      : "Manage and monitor medical services"}
                  </p>
                </div>
              </div>
            </div>

            {/* Right Section: Add Service button */}
            {viewMode === "all" && (
              <button
                onClick={() => setIsFormOpen(true)}
                className="w-full sm:w-auto bg-primaryColor text-white px-6 py-3 rounded-lg flex items-center justify-center space-x-2 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <Plus className="w-5 h-5" />
                <span className="font-medium">Add Service</span>
              </button>
            )}
          </div>
        </div>
      </div>


      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-4 sm:py-5">
        {/* Stats Cards - Only show in 'all' view */}
        {viewMode === 'all' && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 mb-4 sm:mb-8">
            {Object.entries(statusCounts).map(([status, count]) => (
              <div
                key={status}
                onClick={() => {
                  if (status === 'ALL') {
                    handleTotalServicesClick();
                  } else if (status === 'REJECTED') {
                    setStatusFilter(status as 'REJECTED' | ServiceStatus);
                  } else if (status === 'DRAFT') {
                    setStatusFilter('DRAFT');
                  }
                }}
                className={`p-4 sm:p-6 rounded-xl border-2 cursor-pointer transition-all hover:shadow-md 
                  ${statusFilter === status && statusFilter !== "APPROVED" || statusFilter === "APPROVED" && status == "ALL"
                    ? 'border-blue-500 bg-blue-50 shadow-md'
                    : 'border-gray-100 bg-white hover:border-gray-200'
                  }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm font-medium text-gray-600">
                      {statusLabels[status]}
                    </p>
                    <p className="text-xl sm:text-3xl font-bold text-gray-900">{count}</p>
                  </div>
                  <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center ${status === 'APPROVED' ? 'bg-green-100' :
                    status === 'REJECTED' ? 'bg-red-100' :
                      status === 'DRAFT' ? 'bg-yellow-100' : 'bg-blue-100'
                    }`}>
                    {getStatusIcon(status)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Search and Filters */}
        <div className="mb-4 sm:mb-8 flex flex-col sm:flex-row gap-2 sm:gap-4">
          <div className="relative flex-1 max-w-full sm:max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder={viewMode === 'approved' ? "Search approved services..." : "Search services..."}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-white"
            />
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-gray-600">Loading services...</span>
          </div>
        )}

        {/* Services Grid */}
        {!loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-4 sm:mb-8">
            {filteredServices.map((service) => (
              <div key={service.uuid} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <div className="p-4 sm:p-6">
                  {service.image && (
                    <div className="mb-4 relative w-full h-48 rounded-lg overflow-hidden">
                      <img
                        src={service.image}
                        alt={service.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      {getServiceIcon(service?.name)}
                      <div>
                        <h3 className="font-semibold text-gray-900 capitalize text-base sm:text-lg">{service.name}</h3>
                        <span className={`text-xs px-3 py-1 rounded-full border font-medium ${getStatusColor(service.status)}`}>
                          {service.status === 'DRAFT' ? 'Requested' :
                            service.status === 'APPROVED' ? 'Newly Added' :
                              service.status}
                        </span>
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-600 text-xs sm:text-sm mb-4 line-clamp-3 leading-relaxed">{service.description}</p>
                  <div className="flex flex-wrap gap-1 mb-4 sm:mb-6">
                    {service?.tags?.split(',').slice(0, 3).map((tag, index) => (
                      <span key={index} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-md flex items-center space-x-1">
                        <Tag className="w-3 h-3" />
                        <span>{tag.trim()}</span>
                      </span>
                    ))}
                    {service?.tags?.split(',').length > 3 && (
                      <span className="text-xs text-gray-400">+{service?.tags?.split(',').length - 3} more</span>
                    )}
                  </div>
                  {/* Action Buttons */}
                  <div className="space-y-2 sm:space-y-3">
                    {/* Accept/Reject Buttons for Requested Services - Only show in 'all' view */}
                    {viewMode === 'all' && service.status === 'DRAFT' && (
                      <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                        <button
                          onClick={() => handleStatusChange(service.uuid, 'APPROVED')}
                          className="flex-1 bg-green-600 hover:bg-green-700 text-white px-3 py-2.5 rounded-lg text-xs sm:text-sm font-medium transition-colors flex items-center justify-center space-x-1"
                        >
                          <CheckCircle className="w-4 h-4" />
                          <span className='text-xs'>Accept Service</span>
                        </button>
                        <button
                          onClick={() => handleStatusChange(service.uuid, 'REJECTED')}
                          className="flex-1 bg-red-600 hover:bg-red-700 text-white px-3 py-2.5 rounded-lg text-xs sm:text-sm font-medium transition-colors flex items-center justify-center space-x-1"
                        >
                          <XCircle className="w-4 h-4" />
                          <span className='text-xs'>Reject Service</span>
                        </button>
                      </div>
                    )}
                    {/* View/Edit/Delete buttons - Show for approved services in both views */}
                    {(service.status === 'APPROVED' || (viewMode === 'all' && service.status !== 'DRAFT')) && (
                      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                        <button
                          onClick={() => setViewingService(service)}
                          className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 text-xs sm:text-sm font-medium transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                          <span>View</span>
                        </button>
                        {viewMode === 'all' && (
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleEdit(service)}
                              className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => openDeleteModal(service)}
                              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredServices.length === 0 && (
          <div className="text-center py-8 sm:py-16">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
              <Search className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400" />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
              {viewMode === 'approved' ? 'No approved services found' : 'No services found'}
            </h3>
            <p className="text-gray-500 mb-4 sm:mb-6">
              {viewMode === 'approved' ? 'Try adjusting your search criteria' : 'Try adjusting your search criteria or filters'}
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                if (viewMode === 'all') {
                  setStatusFilter('APPROVED');
                }
              }}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Clear search
            </button>
          </div>
        )}

        {/* Server-side Pagination */}
        {paginationData.total_pages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between bg-white px-4 sm:px-6 py-2 sm:py-4 rounded-xl border border-gray-200 gap-2 sm:gap-0">
            <div className="flex items-center text-xs sm:text-sm text-gray-500 mb-2 sm:mb-0">
              <span>
                Showing page {paginationData.current_page} of {paginationData.total_pages} ({paginationData.total_items} total items)
              </span>
            </div>
            <div className="flex items-center space-x-1 sm:space-x-2">
              <button
                onClick={() => handlePageChange(paginationData.current_page - 1)}
                disabled={!paginationData.previous || loading}
                className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <div className="flex space-x-0.5 sm:space-x-1">
                {generatePageNumbers().map((page, index) => {
                  if (page === '...') {
                    return <span key={index} className="px-1 sm:px-2 text-gray-400">...</span>;
                  }
                  return (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page as number)}
                      disabled={loading}
                      className={`px-2 sm:px-3 py-1 sm:py-2 text-xs sm:text-sm rounded-lg transition-colors ${paginationData.current_page === page
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-600 hover:bg-gray-100'
                        }`}
                    >
                      {page}
                    </button>
                  );
                })}
              </div>
              <button
                onClick={() => handlePageChange(paginationData.current_page + 1)}
                disabled={!paginationData.next || loading}
                className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Add/Edit Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 sm:p-4 z-50">
          <div className="bg-white rounded-2xl max-w-full sm:max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
                  {editingService ? 'Edit Service' : 'Add New Service'}
                </h2>
                <button
                  onClick={() => {
                    setFormData({ name: '', description: '', tags: '', image: '' });
                    setIsFormOpen(false);
                    setEditingService(null);
                  }}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>
              <div className="space-y-3 sm:space-y-4">
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                    Service Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    placeholder="Enter service name"
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                    Description
                  </label>
                  <textarea
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
                    placeholder="Enter service description"
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                    Tags (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    placeholder="heart, cardiology, blood pressure"
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                    Service Image
                  </label>
                  <div className="flex items-center space-x-4">
                    <div className="flex-1">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setSelectedImageFile(file);
                            const reader = new FileReader();
                            reader.onload = (ev) => {
                              setFormData({ ...formData, image: ev.target?.result as string });
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                        className="w-full px-3 sm:px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                      />
                    </div>
                    {formData.image && (
                      <div className="relative">
                        <img
                          src={typeof formData.image === 'string' ? formData.image : URL.createObjectURL(formData.image)}
                          alt="Service Preview"
                          className="w-16 h-16 object-cover rounded-lg border border-gray-200"
                        />
                        <button
                          onClick={() => {
                            setFormData({ ...formData, image: null });
                            setSelectedImageFile(null);
                          }}
                          className="absolute -top-2 -right-2 bg-red-100 rounded-full p-1 hover:bg-red-200 transition-colors"
                        >
                          <X className="w-4 h-4 text-red-600" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 pt-2 sm:pt-4">
                  <button
                    onClick={() => {
                      setFormData({ name: '', description: '', tags: '', image: '' });
                      setIsFormOpen(false);
                      setEditingService(null);
                    }}
                    className="flex-1 px-4 py-2 sm:py-3 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-4 py-2 sm:py-3 rounded-xl transition-colors font-medium flex items-center justify-center space-x-2"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <Check className="w-4 h-4" />
                        <span>{editingService ? 'Update' : 'Create'}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View Details Modal */}
      {viewingService && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 sm:p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-lg sm:max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl relative">
            <button
              onClick={() => setViewingService(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-700 z-10"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="p-4 sm:p-6">
              {viewingService.image && (
                <div className="mb-6 relative w-full h-64 rounded-xl overflow-hidden">
                  <img
                    src={viewingService.image}
                    alt={viewingService.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                {getServiceIcon(viewingService.name)}
                <span>{viewingService.name}</span>
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-1">Status</h3>
                  <span className={`text-sm px-3 py-1 rounded-full border font-medium ${getStatusColor(viewingService.status)}`}>
                    {viewingService.status === 'DRAFT' ? 'Requested' :
                      viewingService.status === 'APPROVED' ? 'Newly Added' :
                        viewingService.status}
                  </span>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-1">Description</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {viewingService.description}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-1">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {viewingService.tags?.split(',').map((tag, index) => (
                      <span key={index} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-md flex items-center space-x-1">
                        <Tag className="w-3 h-3" />
                        <span>{tag?.trim()}</span>
                      </span>
                    ))}
                  </div>
                </div>
                {/* <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-1">Payment Methods</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Online Payment</h4>
                      <ul className="space-y-2">
                        <li className="flex items-center text-sm text-gray-600">
                          <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                          Credit/Debit Cards
                        </li>
                        <li className="flex items-center text-sm text-gray-600">
                          <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                          UPI
                        </li>
                        <li className="flex items-center text-sm text-gray-600">
                          <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                          Net Banking
                        </li>
                      </ul>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Offline Payment</h4>
                      <ul className="space-y-2">
                        <li className="flex items-center text-sm text-gray-600">
                          <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                          Cash
                        </li>
                        <li className="flex items-center text-sm text-gray-600">
                          <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                          POS Machine
                        </li>
                      </ul>
                    </div>
                  </div>
                </div> */}
              </div>
              <div className="flex justify-end pt-6 mt-6 border-t border-gray-100">
                <button
                  onClick={() => setViewingService(null)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors w-full sm:w-auto"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ModernModal
        isOpen={deleteModalOpen}
        onClose={closeDeleteModal}
        title="Confirm Delete"
        size="sm"
      >
        <div className="space-y-4">
          <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-full mx-auto">
            <AlertCircle className="w-6 h-6 text-red-600" />
          </div>
          <p className="text-center text-gray-600">
            Are you sure you want to delete the service{' '}
            <strong>"{serviceToDelete?.name}"</strong>? This action cannot be undone.
          </p>
          <div className="flex space-x-3 pt-4">
            <button
              onClick={closeDeleteModal}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              onClick={() => serviceToDelete && handleDelete(serviceToDelete.uuid)}
              disabled={isDeleting === serviceToDelete?.uuid}
              className="flex-1 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg transition-colors font-medium flex items-center justify-center space-x-2"
            >
              {isDeleting === serviceToDelete?.uuid ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Deleting...</span>
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4" />
                  <span>Delete</span>
                </>
              )}
            </button>
          </div>
        </div>
      </ModernModal>

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
  );
};

export default MedicalServicesApp;