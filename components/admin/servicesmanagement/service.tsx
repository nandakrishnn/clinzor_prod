import React, { useState } from 'react';
import { Plus, Edit3, Trash2, Eye, X, Check, Search, Tag, Heart, Stethoscope, Brain, User, CheckCircle, XCircle, AlertCircle, ChevronLeft, ChevronRight, Image as ImageIcon } from 'lucide-react';

type ServiceStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

interface Service {
  uuid: string;
  name: string;
  description: string;
  tags: string;
  status: ServiceStatus;
  image?: string;
}

const MedicalServicesApp: React.FC = () => {
  const [services, setServices] = useState<Service[]>([
    {
      uuid: "d7afe788-af8b-4fd4-b65b-bab700df841a",
      name: "cardiologist",
      description: "Specialist in diagnosing and treating heart and blood vessel conditions.",
      tags: "heart,cardiology,blood pressure,ECG,chest pain",
      status: "PENDING",
      image: undefined
    },
    {
      uuid: "661d42bc-4393-49a3-ab8f-c24b6ab17c38",
      name: "heart speciality",
      description: "Focus on the diagnosis, treatment, and management of heart and blood vessel conditions",
      tags: "heart",
      status: "APPROVED",
      image: undefined
    },
    {
      uuid: "62111833-4927-4060-acdf-f2d857e9d688",
      name: "neurologist",
      description: "Specialist in diagnosing and treating neurological disorders and brain conditions.",
      tags: "brain,neurology,headache,seizures,memory",
      status: "REJECTED",
      image: undefined
    },
    {
      uuid: "5bfffdfc-0af4-4d17-8d0c-08466e2315e5",
      name: "physician",
      description: "General practitioner providing comprehensive healthcare and preventive medicine.",
      tags: "general,healthcare,checkup,prevention,medicine",
      status: "PENDING",
      image: undefined
    },
    {
      uuid: "1234567890",
      name: "dermatologist",
      description: "Specialist in diagnosing and treating skin, hair, and nail conditions.",
      tags: "skin,dermatology,acne,eczema,hair",
      status: "APPROVED",
      image: undefined
    },
    {
      uuid: "0987654321",
      name: "orthopedic surgeon",
      description: "Specialist in treating musculoskeletal system disorders and injuries.",
      tags: "bones,joints,surgery,fractures,sports",
      status: "PENDING",
      image: undefined
    },
    {
      uuid: "1122334455",
      name: "pediatrician",
      description: "Medical doctor specializing in the care of infants, children, and adolescents.",
      tags: "children,pediatrics,vaccination,growth,development",
      status: "APPROVED",
      image: undefined
    }
  ]);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [viewingService, setViewingService] = useState<Service | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | ServiceStatus>('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);
  const [formData, setFormData] = useState<{
    name: string;
    description: string;
    tags: string;
    image: string;
  }>({
    name: '',
    description: '',
    tags: '',
    image: '',
  });
  const [viewMode, setViewMode] = useState<'all' | 'approved'>('all');

  const getServiceIcon = (name: string) => {
    const serviceLower = name.toLowerCase();
    if (serviceLower.includes('cardio') || serviceLower.includes('heart')) {
      return <Heart className="w-5 h-5 text-red-500" />;
    } else if (serviceLower.includes('neuro') || serviceLower.includes('brain')) {
      return <Brain className="w-5 h-5 text-purple-500" />;
    } else if (serviceLower.includes('physician') || serviceLower.includes('doctor')) {
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
      case 'PENDING':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const handleSubmit = () => {
    if (!formData.name.trim() || !formData.description.trim() || !formData.tags.trim()) {
      alert('Please fill in all fields');
      return;
    }
    if (editingService) {
      setServices(services.map((service) =>
        service.uuid === editingService.uuid
          ? { ...service, ...formData }
          : service
      ));
    } else {
      const newService: Service = {
        uuid: Date.now().toString(),
        ...formData,
        status: 'PENDING',
      };
      setServices([...services, newService]);
    }
    resetForm();
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
      image: service.image || '',
    });
    setEditingService(service);
    setIsFormOpen(true);
  };

  const handleDelete = (uuid: string) => {
    setServices(services.filter((service) => service.uuid !== uuid));
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
      const matchesSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.tags.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'ALL' || service.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
    
    if (viewMode === 'approved') {
      filtered = filtered.filter(service => service.status === 'APPROVED');
    }
    
    return filtered;
  };

  const filteredServices = getFilteredServices();

  // Pagination logic
  const totalPages = Math.ceil(filteredServices.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentServices = filteredServices.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter]);

  const getStatusCounts = () => {
    return {
      ALL: services.length,
      PENDING: services.filter((s) => s.status === 'PENDING').length,
      APPROVED: services.filter((s) => s.status === 'APPROVED').length,
      REJECTED: services.filter((s) => s.status === 'REJECTED').length,
    };
  };

  const statusCounts = getStatusCounts();

  const statusLabels: Record<string, string> = {
    ALL: 'Total Services',
    PENDING: 'Requested Services',
    APPROVED: 'Newly Added Services',
    REJECTED: 'Rejected'
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'REJECTED':
        return <XCircle className="w-5 h-5 text-red-600" />;
      case 'PENDING':
        return <AlertCircle className="w-5 h-5 text-yellow-600" />;
      default:
        return <Stethoscope className="w-5 h-5 text-blue-600" />;
    }
  };

  const handleTotalServicesClick = () => {
    setViewMode('approved');
    setStatusFilter('ALL');
    setSearchTerm('');
  };
  
  const handleBackToAll = () => {
    setViewMode('all');
    setStatusFilter('ALL');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between h-auto sm:h-20 py-4 sm:py-0 gap-4 sm:gap-0">
            {viewMode === 'approved' && (
              <button
                onClick={handleBackToAll}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronLeft className="w-5 h-5 text-gray-600" />
              </button>
            )}
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg">
              <Stethoscope className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {viewMode === 'approved' ? 'All Approved Services' : 'Service Management'}
              </h1>
              <p className="text-sm text-gray-500">
                {viewMode === 'approved' ? 'View all approved services in the database' : 'Manage and monitor medical services'}
              </p>
            </div>
          </div>
          {viewMode === 'all' && (
            <button
              onClick={() => setIsFormOpen(true)}
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl flex items-center justify-center space-x-2 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <Plus className="w-5 h-5" />
              <span className="font-medium">Add Service</span>
            </button>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-4 sm:py-8">
        {/* Stats Cards - Only show in 'all' view */}
        {viewMode === 'all' && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 mb-4 sm:mb-8">
            {Object.entries(statusCounts).map(([status, count]) => (
              <div
                key={status}
                onClick={() => {
                  if (status === 'ALL') {
                    handleTotalServicesClick();
                  } else {
                    setStatusFilter(status as 'ALL' | ServiceStatus);
                  }
                }}
                className={`p-4 sm:p-6 rounded-xl border-2 cursor-pointer transition-all hover:shadow-md ${
                  statusFilter === status
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
                  <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center ${
                    status === 'APPROVED' ? 'bg-green-100' :
                    status === 'REJECTED' ? 'bg-red-100' :
                    status === 'PENDING' ? 'bg-yellow-100' : 'bg-blue-100'
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

        {/* Services Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-4 sm:mb-8">
          {currentServices.map((service) => (
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
                    {getServiceIcon(service.name)}
                    <div>
                      <h3 className="font-semibold text-gray-900 capitalize text-base sm:text-lg">{service.name}</h3>
                      <span className={`text-xs px-3 py-1 rounded-full border font-medium ${getStatusColor(service.status)}`}>
                        {service.status === 'PENDING' ? 'Requested' : 
                         service.status === 'APPROVED' ? 'Newly Added' : 
                         service.status}
                      </span>
                    </div>
                  </div>
                </div>
                <p className="text-gray-600 text-xs sm:text-sm mb-4 line-clamp-3 leading-relaxed">{service.description}</p>
                <div className="flex flex-wrap gap-1 mb-4 sm:mb-6">
                  {service.tags.split(',').slice(0, 3).map((tag, index) => (
                    <span key={index} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-md flex items-center space-x-1">
                      <Tag className="w-3 h-3" />
                      <span>{tag.trim()}</span>
                    </span>
                  ))}
                  {service.tags.split(',').length > 3 && (
                    <span className="text-xs text-gray-400">+{service.tags.split(',').length - 3} more</span>
                  )}
                </div>
                {/* Action Buttons */}
                <div className="space-y-2 sm:space-y-3">
                  {/* Accept/Reject Buttons for Requested Services - Only show in 'all' view */}
                  {viewMode === 'all' && service.status === 'PENDING' && (
                    <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                      <button
                        onClick={() => handleStatusChange(service.uuid, 'APPROVED')}
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors flex items-center justify-center space-x-1"
                      >
                        <CheckCircle className="w-4 h-4" />
                        <span>Accept Service</span>
                      </button>
                      <button
                        onClick={() => handleStatusChange(service.uuid, 'REJECTED')}
                        className="flex-1 bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors flex items-center justify-center space-x-1"
                      >
                        <XCircle className="w-4 h-4" />
                        <span>Reject Service</span>
                      </button>
                    </div>
                  )}
                  {/* View/Edit/Delete buttons - Show for approved services in both views */}
                  {(service.status === 'APPROVED' || (viewMode === 'all' && service.status !== 'PENDING')) && (
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
                            onClick={() => handleDelete(service.uuid)}
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

        {/* Empty State */}
        {filteredServices.length === 0 && (
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
                  setStatusFilter('ALL');
                }
              }}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Clear search
            </button>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between bg-white px-4 sm:px-6 py-2 sm:py-4 rounded-xl border border-gray-200 gap-2 sm:gap-0">
            <div className="flex items-center text-xs sm:text-sm text-gray-500 mb-2 sm:mb-0">
              <span>
                Showing {startIndex + 1} to {Math.min(endIndex, filteredServices.length)} of {filteredServices.length} results
              </span>
            </div>
            <div className="flex items-center space-x-1 sm:space-x-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <div className="flex space-x-0.5 sm:space-x-1">
                {[...Array(totalPages)].map((_, index) => {
                  const page = index + 1;
                  if (
                    page === 1 ||
                    page === totalPages ||
                    (page >= currentPage - 1 && page <= currentPage + 1)
                  ) {
                    return (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-2 sm:px-3 py-1 sm:py-2 text-xs sm:text-sm rounded-lg transition-colors ${
                          currentPage === page
                            ? 'bg-blue-600 text-white'
                            : 'text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        {page}
                      </button>
                    );
                  } else if (
                    page === currentPage - 2 ||
                    page === currentPage + 2
                  ) {
                    return <span key={page} className="px-1 sm:px-2 text-gray-400">...</span>;
                  }
                  return null;
                })}
              </div>
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
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
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
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
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
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
                    onChange={(e) => setFormData({...formData, tags: e.target.value})}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-all transition-all"
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
                        onChange={e => {
                          const file = e.target.files?.[0];
                          if (file) {
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
                          src={formData.image} 
                          alt="Service Preview" 
                          className="w-16 h-16 object-cover rounded-lg border border-gray-200"
                        />
                        <button
                          onClick={() => setFormData({ ...formData, image: '' })}
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
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 sm:py-3 rounded-xl transition-colors font-medium flex items-center justify-center space-x-2"
                  >
                    <Check className="w-4 h-4" />
                    <span>{editingService ? 'Update' : 'Create'}</span>
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
                    {viewingService.status === 'PENDING' ? 'Requested' : 
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
                    {viewingService.tags.split(',').map((tag, index) => (
                      <span key={index} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-md flex items-center space-x-1">
                        <Tag className="w-3 h-3" />
                        <span>{tag.trim()}</span>
                      </span>
                    ))}
                  </div>
                </div>
                <div>
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
                </div>
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
    </div>
  );
};

export default MedicalServicesApp;