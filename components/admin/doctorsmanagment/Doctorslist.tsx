import React, { useState, useMemo } from 'react';
import { Check, X, User, Phone, Mail, Heart, Calendar, Star, Search, Filter, ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';

// Type definitions
interface Doctor {
  uuid: string;
  name: string;
  gender: string;
  specializaton: string;
  experience?: string;
  phone_number: string;
  email?: string;
  status: 'DRAFT' | 'APPROVED' | 'REJECTED';
  created_by: string;
  reason_for_rejection?: string;
}

interface RejectFormProps {
  onReject: (reason: string) => void;
  onCancel: () => void;
}

const DoctorApprovalApp: React.FC = () => {
  // Sample data with more doctors for pagination
  const [allDoctors, setAllDoctors] = useState<Doctor[]>([
    {
      uuid: "7b52ad40-cd6f-45b3-8ac4-4f9e40c53b6d",
      name: "Dr. Sarah Chen",
      gender: "FEMALE",
      specializaton: "Cardiologist",
      experience: "8 years",
      phone_number: "+1 (555) 123-4567",
      email: "sarah.chen@medical.com",
      status: "DRAFT",
      created_by: "sunrise@gmail.com"
    },
    {
      uuid: "8c63be51-de7f-56c4-9bd5-5f0e51d64c7e",
      name: "Dr. Michael Rodriguez",
      gender: "MALE",
      specializaton: "Neurologist",
      experience: "12 years",
      phone_number: "+1 (555) 234-5678",
      email: "m.rodriguez@medical.com",
      status: "APPROVED",
      created_by: "admin@clinic.com"
    },
    {
      uuid: "9d74cf62-ef8f-67d5-ace6-6f1f62e75d8f",
      name: "Dr. Emily Johnson",
      gender: "FEMALE",
      specializaton: "Pediatrician",
      experience: "6 years",
      phone_number: "+1 (555) 345-6789",
      email: "emily.j@medical.com",
      status: "REJECTED",
      created_by: "hr@clinic.com",
      reason_for_rejection: "Incomplete documentation"
    },
    {
      uuid: "ae85d073-f090-78e6-bdf7-701073f86e90",
      name: "Dr. David Kim",
      gender: "MALE",
      specializaton: "Orthopedic Surgeon",
      experience: "15 years",
      phone_number: "+1 (555) 456-7890",
      email: "david.kim@medical.com",
      status: "DRAFT",
      created_by: "recruitment@clinic.com"
    },
    {
      uuid: "bf96e184-0191-89f7-ce08-812184096fa1",
      name: "Dr. Lisa Patel",
      gender: "FEMALE",
      specializaton: "Dermatologist",
      experience: "10 years",
      phone_number: "+1 (555) 567-8901",
      email: "lisa.patel@medical.com",
      status: "APPROVED",
      created_by: "admin@clinic.com"
    },
    {
      uuid: "c0a7f295-1202-90a8-df19-923295107ab2",
      name: "Dr. James Wilson",
      gender: "MALE",
      specializaton: "Psychiatrist",
      experience: "9 years",
      phone_number: "+1 (555) 678-9012",
      email: "james.wilson@medical.com",
      status: "DRAFT",
      created_by: "hr@clinic.com"
    }
  ]);

  // State management
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(3);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [actionType, setActionType] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  // Filter and search logic
  const filteredDoctors = useMemo(() => {
    return allDoctors.filter(doctor => {
      const matchesSearch = doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           doctor.specializaton.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           doctor.email?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'ALL' || doctor.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [allDoctors, searchTerm, statusFilter]);

  // Pagination logic
  const totalPages = Math.ceil(filteredDoctors.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedDoctors = filteredDoctors.slice(startIndex, startIndex + itemsPerPage);

  // Reset pagination when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter]);

  const handleApprove = (doctorId: string) => {
    setAllDoctors(prev => prev.map(doc => 
      doc.uuid === doctorId 
        ? { ...doc, status: 'APPROVED' }
        : doc
    ));
    setShowModal(false);
  };

  const handleReject = (doctorId: string, reason: string) => {
    setAllDoctors(prev => prev.map(doc => 
      doc.uuid === doctorId 
        ? { ...doc, status: 'REJECTED', reason_for_rejection: reason }
        : doc
    ));
    setShowModal(false);
  };

  const openModal = (doctor: Doctor, action: string) => {
    setSelectedDoctor(doctor);
    setActionType(action);
    setShowModal(true);
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'APPROVED': 
        return { 
          color: 'text-green-700 bg-green-100 border-green-200', 
          dot: 'bg-green-500',
          count: allDoctors.filter(d => d.status === 'APPROVED').length
        };
      case 'REJECTED': 
        return { 
          color: 'text-red-700 bg-red-100 border-red-200', 
          dot: 'bg-red-500',
          count: allDoctors.filter(d => d.status === 'REJECTED').length
        };
      case 'DRAFT': 
        return { 
          color: 'text-blue-700 bg-blue-100 border-blue-200', 
          dot: 'bg-blue-500',
          count: allDoctors.filter(d => d.status === 'DRAFT').length
        };
      default: 
        return { 
          color: 'text-gray-700 bg-gray-100 border-gray-200', 
          dot: 'bg-gray-500',
          count: allDoctors.length
        };
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map((n: string) => n[0]).join('').toUpperCase();
  };

  const statusOptions = [
    { value: 'ALL', label: 'All Doctors' },
    { value: 'DRAFT', label: 'Pending Review' },
    { value: 'APPROVED', label: 'Approved' },
    { value: 'REJECTED', label: 'Rejected' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Apple-style Header */}
      <div className="bg-white/90 backdrop-blur-2xl border-b border-gray-200/60 sticky top-0 z-20 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4 md:gap-0">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                Medical Professionals
              </h1>
              <p className="text-gray-500 mt-1 text-sm sm:text-base">Review and manage doctor applications</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm font-medium text-gray-600">
                {filteredDoctors.length} of {allDoctors.length} doctors
              </div>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search Bar */}
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search doctors, specializations, or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white/80 border border-gray-200 rounded-2xl text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all duration-200"
              />
            </div>

            {/* Status Filter */}
            <div className="flex flex-wrap gap-2">
              {statusOptions.map((option) => {
                const config = getStatusConfig(option.value);
                const isActive = statusFilter === option.value;
                return (
                  <button
                    key={option.value}
                    onClick={() => setStatusFilter(option.value)}
                    className={`flex items-center space-x-2 px-4 py-3 rounded-2xl text-sm font-medium transition-all duration-200 ${
                      isActive 
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25' 
                        : 'bg-white/80 text-gray-700 hover:bg-white border border-gray-200 hover:shadow-sm'
                    }`}
                  >
                    <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-white' : config.dot}`} />
                    <span>{option.label}</span>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      isActive ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {config.count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {paginatedDoctors.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-2xl flex items-center justify-center">
              <User className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No doctors found</h3>
            <p className="text-gray-500">Try adjusting your search or filter criteria</p>
          </div>
        ) : (
          <>
            {/* Doctor Cards */}
            <div className="space-y-4 mb-8">
              {paginatedDoctors.map((doctor) => {
                const statusConfig = getStatusConfig(doctor.status);
                return (
                  <div
                    key={doctor.uuid}
                    className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-sm border border-gray-200/50 overflow-hidden hover:shadow-lg hover:shadow-blue-500/5 transition-all duration-300 hover:border-blue-200"
                  >
                    <div className="p-4 sm:p-8">
                      <div className="flex flex-col md:flex-row items-start justify-between gap-6 md:gap-0">
                        <div className="flex items-start space-x-4 sm:space-x-6 w-full">
                          {/* Profile Picture */}
                          <div className="relative">
                            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center text-white text-lg sm:text-xl font-bold shadow-xl">
                              {getInitials(doctor.name)}
                            </div>
                            <div className={`absolute -bottom-1 -right-1 w-6 h-6 ${statusConfig.dot} rounded-full border-3 border-white shadow-sm`} />
                          </div>

                          {/* Doctor Info */}
                          <div className="flex-1">
                            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-3 mb-3">
                              <h3 className="text-lg sm:text-xl font-bold text-gray-900">{doctor.name}</h3>
                              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${statusConfig.color}`}>
                                <div className={`w-1.5 h-1.5 ${statusConfig.dot} rounded-full mr-2`} />
                                {doctor.status}
                              </span>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                              <div className="flex items-center space-x-3 text-gray-600">
                                <div className="w-8 h-8 bg-red-100 rounded-xl flex items-center justify-center">
                                  <Heart className="w-4 h-4 text-red-600" />
                                </div>
                                <span className="font-medium">{doctor.specializaton}</span>
                              </div>
                              {doctor.experience && (
                                <div className="flex items-center space-x-3 text-gray-600">
                                  <div className="w-8 h-8 bg-yellow-100 rounded-xl flex items-center justify-center">
                                    <Star className="w-4 h-4 text-yellow-600" />
                                  </div>
                                  <span className="font-medium">{doctor.experience} experience</span>
                                </div>
                              )}
                              <div className="flex items-center space-x-3 text-gray-600">
                                <div className="w-8 h-8 bg-green-100 rounded-xl flex items-center justify-center">
                                  <Phone className="w-4 h-4 text-green-600" />
                                </div>
                                <span className="font-medium">{doctor.phone_number}</span>
                              </div>
                              {doctor.email && (
                                <div className="flex items-center space-x-3 text-gray-600">
                                  <div className="w-8 h-8 bg-blue-100 rounded-xl flex items-center justify-center">
                                    <Mail className="w-4 h-4 text-blue-600" />
                                  </div>
                                  <span className="font-medium">{doctor.email}</span>
                                </div>
                              )}
                            </div>
                            <div className="text-xs text-gray-500 bg-gray-50 rounded-xl px-3 py-2 inline-block">
                              Submitted by: {doctor.created_by}
                            </div>
                          </div>
                        </div>
                        {/* Action Buttons */}
                        {doctor.status === 'DRAFT' && (
                          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 w-full sm:w-auto mt-4 sm:mt-0">
                            <button
                              onClick={() => openModal(doctor, 'reject')}
                              className="inline-flex items-center justify-center px-6 py-3 bg-white border-2 border-red-200 rounded-2xl text-sm font-semibold text-red-700 hover:bg-red-50 hover:border-red-300 transition-all duration-200 shadow-sm hover:shadow"
                            >
                              <X className="w-4 h-4 mr-2" />
                              Reject
                            </button>
                            <button
                              onClick={() => openModal(doctor, 'approve')}
                              className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl text-sm font-semibold text-white hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg shadow-blue-600/25 hover:shadow-xl hover:shadow-blue-600/30"
                            >
                              <Check className="w-4 h-4 mr-2" />
                              Approve
                            </button>
                          </div>
                        )}
                      </div>
                      {doctor.reason_for_rejection && (
                        <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-2xl">
                          <p className="text-sm text-red-800">
                            <strong>Rejection Reason:</strong> {doctor.reason_for_rejection}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
            {/* Apple-style Pagination */}
            {totalPages > 1 && (
              <div className="flex flex-col sm:flex-row items-center justify-between bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 gap-4">
                <div className="text-sm text-gray-600">
                  Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredDoctors.length)} of {filteredDoctors.length} results
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="p-2 rounded-xl text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <div className="flex space-x-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                          currentPage === page
                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25'
                            : 'text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-xl text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Apple-style Modal */}
      {showModal && selectedDoctor && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border border-white/20">
            <div className="p-6 sm:p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6">
                {actionType === 'approve' ? 'Approve Doctor' : 'Reject Doctor'}
              </h3>
              <div className="flex items-center space-x-4 mb-8">
                <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center text-white text-base sm:text-lg font-bold shadow-xl">
                  {getInitials(selectedDoctor.name)}
                </div>
                <div>
                  <p className="font-bold text-gray-900 text-base sm:text-lg">{selectedDoctor.name}</p>
                  <p className="text-gray-600">{selectedDoctor.specializaton}</p>
                </div>
              </div>
              {actionType === 'approve' ? (
                <div>
                  <p className="text-gray-600 mb-8 leading-relaxed">
                    Are you sure you want to approve this doctor? They will be able to practice on the platform and see patients.
                  </p>
                  <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                    <button
                      onClick={() => setShowModal(false)}
                      className="flex-1 px-6 py-3 border-2 border-gray-200 rounded-2xl text-sm font-semibold text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleApprove(selectedDoctor.uuid)}
                      className="flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 rounded-2xl text-sm font-semibold text-white hover:from-green-700 hover:to-green-800 transition-all duration-200 shadow-lg shadow-green-600/25"
                    >
                      Approve
                    </button>
                  </div>
                </div>
              ) : (
                <RejectForm 
                  onReject={(reason: string) => handleReject(selectedDoctor.uuid, reason)}
                  onCancel={() => setShowModal(false)}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const RejectForm: React.FC<RejectFormProps> = ({ onReject, onCancel }) => {
  const [reason, setReason] = useState<string>('');
  const [selectedReason, setSelectedReason] = useState<string>('');

  const predefinedReasons = [
    'Incomplete documentation',
    'Invalid credentials',
    'Insufficient experience',
    'Failed background check',
    'Other'
  ];

  const handleSubmit = () => {
    const finalReason = selectedReason === 'Other' ? reason : selectedReason;
    if (finalReason.trim()) {
      onReject(finalReason);
    }
  };

  return (
    <div>
      <p className="text-gray-600 mb-6 leading-relaxed">
        Please select or provide a reason for rejection:
      </p>
      <div className="space-y-3 mb-6">
        {predefinedReasons.map((r) => (
          <label key={r} className="flex items-center space-x-3 cursor-pointer group">
            <input
              type="radio"
              name="reason"
              value={r}
              checked={selectedReason === r}
              onChange={(e) => setSelectedReason(e.target.value)}
              className="w-4 h-4 text-blue-600 border-2 border-gray-300 focus:ring-blue-500 focus:ring-2"
            />
            <span className="text-gray-700 group-hover:text-gray-900 transition-colors duration-200">{r}</span>
          </label>
        ))}
      </div>
      {selectedReason === 'Other' && (
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Please specify the reason..."
          className="w-full p-4 border-2 border-gray-200 rounded-2xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-400 resize-none transition-all duration-200 mb-6"
          rows={4}
        />
      )}
      <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
        <button
          onClick={onCancel}
          className="flex-1 px-6 py-3 border-2 border-gray-200 rounded-2xl text-sm font-semibold text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          disabled={!selectedReason || (selectedReason === 'Other' && !reason.trim())}
          className="flex-1 px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 rounded-2xl text-sm font-semibold text-white hover:from-red-700 hover:to-red-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg shadow-red-600/25"
        >
          Reject
        </button>
      </div>
    </div>
  );
};

export default DoctorApprovalApp;