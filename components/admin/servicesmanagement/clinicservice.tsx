import React, { useState, useEffect } from 'react';
import { Edit3, Eye, X, Check, Search, Tag, Heart, Stethoscope, Brain, User, CheckCircle, XCircle, ChevronLeft, ChevronRight, DollarSign, Video, Home, Building, Star } from 'lucide-react';

interface Service {
  uuid: string;
  service: string;
  clinic: string;
  service_name: string;
  created_by: string;
  clinic_provided_name: string | null;
  rank: number;
  consultation_charge_video_call: string;
  consultation_charge_physical_visit: string | null;
  consultation_charge_home_visit: string | null;
  treatment_charge_video_call: string;
  treatment_charge_physical_visit: string | null;
  treatment_charge_home_visit: string | null;
  status: 'DRAFT' | 'APPROVED' | 'REJECTED';
  is_video_call: boolean;
  is_home_visit: boolean;
  is_physical_visit: boolean;
  image: string | null;
  description: string | null;
  reason_for_rejection: string | null;
}

interface FormData {
  rank: string;
  consultation_charge_video_call: string;
  consultation_charge_physical_visit: string;
  consultation_charge_home_visit: string;
  treatment_charge_video_call: string;
  treatment_charge_physical_visit: string;
  treatment_charge_home_visit: string;
  is_video_call: boolean;
  is_physical_visit: boolean;
  is_home_visit: boolean;
  description: string;
  reason_for_rejection: string;
}

const ClinicServices = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [viewingService, setViewingService] = useState<Service | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage] = useState<number>(6);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchServices = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch('/api/clinic/services');
        if (!res.ok) throw new Error('Failed to fetch services');
        const data: Service[] = await res.json();
        setServices(data.filter(service => service.status === 'APPROVED'));
      } catch (err: any) {
        setError(err.message || 'Error fetching services');
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

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

  const filteredServices = services.filter(service => {
    return (
      service.service_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.created_by.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredServices.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentServices = filteredServices.slice(startIndex, endIndex);

  // Reset to page 1 when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg">
                <Building className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Clinic Services</h1>
                <p className="text-sm text-gray-500">Manage clinic service offerings and pricing</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Total Approved Services</p>
              <p className="text-2xl font-bold text-gray-900">{services.length}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8 py-8">
        {/* Search */}
        <div className="mb-8 flex flex-col sm:flex-row gap-2 sm:gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search services..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-white"
            />
          </div>
        </div>

        {/* Loading/Error State */}
        {loading && (
          <div className="text-center py-16 text-gray-500">Loading services...</div>
        )}
        {error && (
          <div className="text-center py-16 text-red-500">{error}</div>
        )}

        {/* Services Grid */}
        {!loading && !error && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8">
              {currentServices.map((service) => (
                <div key={service.uuid} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        {getServiceIcon(service.service_name)}
                        <div>
                          <h3 className="font-semibold text-gray-900 capitalize text-lg">{service.service_name}</h3>
                          <div className="flex items-center space-x-2 mt-1">
                            <span className="text-xs px-3 py-1 rounded-full border font-medium text-green-600 bg-green-50 border-green-200">
                              APPROVED
                            </span>
                            <div className="flex items-center space-x-1 text-xs text-gray-500">
                              <Star className="w-3 h-3" />
                              <span>Rank {service.rank}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* Service Types */}
                    <div className="flex items-center space-x-3 mb-4">
                      {service.is_video_call && (
                        <div className="flex items-center space-x-1 text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded-md">
                          <Video className="w-3 h-3" />
                          <span>Video</span>
                        </div>
                      )}
                      {service.is_physical_visit && (
                        <div className="flex items-center space-x-1 text-xs bg-green-50 text-green-600 px-2 py-1 rounded-md">
                          <Building className="w-3 h-3" />
                          <span>Physical</span>
                        </div>
                      )}
                      {service.is_home_visit && (
                        <div className="flex items-center space-x-1 text-xs bg-purple-50 text-purple-600 px-2 py-1 rounded-md">
                          <Home className="w-3 h-3" />
                          <span>Home</span>
                        </div>
                      )}
                    </div>
                    {/* Pricing Info */}
                    <div className="bg-gray-50 rounded-lg p-3 mb-4">
                      <div className="text-xs text-gray-600 mb-2">Consultation Charges</div>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        {service.consultation_charge_video_call && (
                          <div className="flex items-center justify-between">
                            <span className="text-gray-500">Video:</span>
                            <span className="font-medium">₹{service.consultation_charge_video_call}</span>
                          </div>
                        )}
                        {service.consultation_charge_physical_visit && (
                          <div className="flex items-center justify-between">
                            <span className="text-gray-500">Physical:</span>
                            <span className="font-medium">₹{service.consultation_charge_physical_visit}</span>
                          </div>
                        )}
                        {service.consultation_charge_home_visit && (
                          <div className="flex items-center justify-between">
                            <span className="text-gray-500">Home:</span>
                            <span className="font-medium">₹{service.consultation_charge_home_visit}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    {/* View Button Only */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pt-3 border-t border-gray-100 gap-2 sm:gap-0 w-full">
                      <button
                        onClick={() => setViewingService(service)}
                        className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors px-2 py-2 rounded-lg min-w-[120px]"
                      >
                        <Eye className="w-4 h-4" />
                        <span>View Details</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {/* Empty State */}
            {filteredServices.length === 0 && (
              <div className="text-center py-16">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Search className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No services found</h3>
                <p className="text-gray-500 mb-6">Try adjusting your search criteria</p>
                <button
                  onClick={() => setSearchTerm('')}
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  Clear search
                </button>
              </div>
            )}
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex flex-col sm:flex-row items-center justify-between bg-white px-2 sm:px-6 py-4 rounded-xl border border-gray-200 gap-2 sm:gap-0">
                <div className="flex items-center text-sm text-gray-500">
                  <span>
                    Showing {startIndex + 1} to {Math.min(endIndex, filteredServices.length)} of {filteredServices.length} results
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <div className="flex space-x-1">
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
                            className={`px-3 py-2 text-sm rounded-lg transition-colors ${
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
                        return <span key={page} className="px-2 text-gray-400">...</span>;
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
          </>
        )}
      </div>

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
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                {getServiceIcon(viewingService.service_name)}
                <span>{viewingService.service_name}</span>
              </h2>
              <div className="mb-2 text-sm text-gray-500">Created by: {viewingService.created_by}</div>
              <div className="mb-2 text-sm text-gray-500">Rank: {viewingService.rank}</div>
              <div className="mb-2 text-sm text-gray-500">Status: <span className="font-bold text-green-600 bg-green-50 border-green-200 px-2 py-1 rounded">APPROVED</span></div>
              <div className="mb-2 text-sm text-gray-500">Description: {viewingService.description || <span className="italic text-gray-400">No description</span>}</div>
              <div className="mb-2 text-sm text-gray-500">Reason for Rejection: {viewingService.reason_for_rejection || <span className="italic text-gray-400">None</span>}</div>
              <div className="mb-2 text-sm text-gray-500">Available Types:</div>
              <div className="flex flex-wrap gap-2 mb-4">
                {viewingService.is_video_call && (
                  <span className="flex items-center space-x-1 text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded-md">
                    <Video className="w-3 h-3" /> <span>Video</span>
                  </span>
                )}
                {viewingService.is_physical_visit && (
                  <span className="flex items-center space-x-1 text-xs bg-green-50 text-green-600 px-2 py-1 rounded-md">
                    <Building className="w-3 h-3" /> <span>Physical</span>
                  </span>
                )}
                {viewingService.is_home_visit && (
                  <span className="flex items-center space-x-1 text-xs bg-purple-50 text-purple-600 px-2 py-1 rounded-md">
                    <Home className="w-3 h-3" /> <span>Home</span>
                  </span>
                )}
              </div>
              <div className="mb-2 text-sm text-gray-500 font-semibold">Consultation Charges:</div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-4">
                {viewingService.consultation_charge_video_call && (
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500">Video:</span>
                    <span className="font-medium">₹{viewingService.consultation_charge_video_call}</span>
                  </div>
                )}
                {viewingService.consultation_charge_physical_visit && (
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500">Physical:</span>
                    <span className="font-medium">₹{viewingService.consultation_charge_physical_visit}</span>
                  </div>
                )}
                {viewingService.consultation_charge_home_visit && (
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500">Home:</span>
                    <span className="font-medium">₹{viewingService.consultation_charge_home_visit}</span>
                  </div>
                )}
              </div>
              <div className="mb-2 text-sm text-gray-500 font-semibold">Treatment Charges:</div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-4">
                {viewingService.treatment_charge_video_call && (
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500">Video:</span>
                    <span className="font-medium">₹{viewingService.treatment_charge_video_call}</span>
                  </div>
                )}
                {viewingService.treatment_charge_physical_visit && (
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500">Physical:</span>
                    <span className="font-medium">₹{viewingService.treatment_charge_physical_visit}</span>
                  </div>
                )}
                {viewingService.treatment_charge_home_visit && (
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500">Home:</span>
                    <span className="font-medium">₹{viewingService.treatment_charge_home_visit}</span>
                  </div>
                )}
              </div>
              <div className="flex justify-end pt-2">
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

export default ClinicServices;