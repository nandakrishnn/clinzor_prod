import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  Search,
  RefreshCw,
  Building2,
  Mail,
  Phone,
  MapPin,
  Calendar,
  AlertCircle,
  Filter,
  Check,
  X
} from 'lucide-react';
import { approveOrRejectClinic, getAllClinic } from '@/service/admin/clinicManagentService';

// Types
interface Clinic {
  uuid: string;
  name: string;
  address: string;
  city: string;
  pincode: string;
  status: 'Approved' | 'Draft' | 'PENDING' | 'Rejected';
  paymentStatus: 'Paid' | 'PENDING' | 'No Dues' | 'Overdue';
  dueAmount: string;
  hours: string;
  workingDays: string[];
  phone: string;
  email: string;
  isActive: boolean;
  openingTime: string;
  closingTime: string;
  mapLink?: string;
  gpsCoordinates?: string;
  submissionDate?: string;
  documents?: string[];
  changedFields?: string[];
}

// Status Badge Component
const StatusBadge = ({ status }: { status: Clinic['status'] }) => {
  const getStatusColor = (status: Clinic['status']) => {
    switch (status) {
      case 'Approved': return 'bg-green-100 text-green-700 border-green-200';
      case 'PENDING': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'Draft': return 'bg-gray-100 text-gray-700 border-gray-200';
      case 'Rejected': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(status)}`}>
      {status}
    </span>
  );
};

// Notification Component
const Notification = ({
  type,
  message,
  onClose
}: {
  type: 'success' | 'error' | 'warning';
  message: string;
  onClose: () => void;
}) => {
  const getNotificationColor = () => {
    switch (type) {
      case 'success': return 'bg-green-50 text-green-800 border-green-200';
      case 'error': return 'bg-red-50 text-red-800 border-red-200';
      case 'warning': return 'bg-yellow-50 text-yellow-800 border-yellow-200';
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'success': return <CheckCircle size={20} className="text-green-600" />;
      case 'error': return <XCircle size={20} className="text-red-600" />;
      case 'warning': return <AlertCircle size={20} className="text-yellow-600" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      className={`fixed top-4 right-4 p-4 rounded-lg border shadow-lg z-50 ${getNotificationColor()}`}
    >
      <div className="flex items-center gap-3">
        {getIcon()}
        <span className="font-medium">{message}</span>
        <button onClick={onClose} className="ml-2 hover:opacity-70">
          <X size={16} />
        </button>
      </div>
    </motion.div>
  );
};

// Modern Modal Component
const ModernModal = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md'
}: {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}) => {
  if (!isOpen) return null;

  const getSizeClasses = () => {
    switch (size) {
      case 'sm': return 'max-w-md';
      case 'md': return 'max-w-lg';
      case 'lg': return 'max-w-2xl';
      case 'xl': return 'max-w-4xl';
      default: return 'max-w-lg';
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose} />
        <div className={`inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle w-full ${getSizeClasses()}`}>
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">{title}</h3>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

// Clinic Detail Modal Component
const ClinicDetailModal = ({
  clinic,
  isOpen,
  onClose,
  onApprove,
  onReject
}: {
  clinic: Clinic | null;
  isOpen: boolean;
  onClose: () => void;
  onApprove: (clinic: Clinic) => void;
  onReject: (clinic: Clinic) => void;
}) => {
  if (!clinic) return null;

  const changedFields = getChangedFields(clinic);

  return (
    <ModernModal isOpen={isOpen} onClose={onClose} title={`Review: ${clinic.name}`} size="xl">
      <div className="space-y-6">
        {/* Basic Information */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
            <Building2 size={18} />
            Basic Information
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium text-gray-600">Clinic Name:</span>
              <p className="text-gray-900">{clinic.name}</p>
            </div>
            <div>
              <span className="font-medium text-gray-600">City:</span>
              <p className="text-gray-900">{clinic.city}</p>
            </div>
            <div className="md:col-span-2">
              <span className="font-medium text-gray-600">Address:</span>
              <p className="text-gray-900">{clinic.address}</p>
            </div>
            <div>
              <span className="font-medium text-gray-600">Pincode:</span>
              <p className="text-gray-900">{clinic.pincode}</p>
            </div>
            <div>
              <span className="font-medium text-gray-600">Status:</span>
              <div className="mt-1">
                <StatusBadge status={clinic.status} />
              </div>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
            <Phone size={18} />
            Contact Information
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium text-gray-600">Phone:</span>
              <p className="text-gray-900">{clinic.phone}</p>
            </div>
            <div>
              <span className="font-medium text-gray-600">Email:</span>
              <p className="text-gray-900">{clinic.email}</p>
            </div>
          </div>
        </div>

        {/* Working Hours */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
            <Calendar size={18} />
            Working Hours
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium text-gray-600">Hours:</span>
              <p className="text-gray-900">{clinic.hours || 'Not specified'}</p>
            </div>
            <div>
              <span className="font-medium text-gray-600">Working Days:</span>
              <p className="text-gray-900">{clinic?.workingDays?.join(', ')}</p>
            </div>
          </div>
        </div>

        {/* Location Details */}
        {(clinic.mapLink || clinic.gpsCoordinates) && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <MapPin size={18} />
              Location Details
            </h4>
            <div className="space-y-2 text-sm">
              {clinic.mapLink && (
                <div>
                  <span className="font-medium text-gray-600">Maps Link:</span>
                  <a href={clinic.mapLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline block">
                    View on Google Maps
                  </a>
                </div>
              )}
              {clinic.gpsCoordinates && (
                <div>
                  <span className="font-medium text-gray-600">GPS Coordinates:</span>
                  <p className="text-gray-900">{clinic.gpsCoordinates}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Submission Info */}
        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
            <Clock size={18} />
            Submission Information
          </h4>
          <div className="text-sm">
            <span className="font-medium text-blue-700">Submitted on:</span>
            <p className="text-blue-900">{clinic.submissionDate || 'Recently submitted'}</p>
          </div>
        </div>

        {/* Changed Fields */}
        {changedFields.includes('services') && (
          <div className="bg-yellow-100 border-l-4 border-yellow-400 p-2 rounded mb-2">
            <span className="font-semibold text-yellow-800">Services have been updated by the clinic.</span>
          </div>
        )}
        {changedFields.includes('doctors') && (
          <div className="bg-yellow-100 border-l-4 border-yellow-400 p-2 rounded mb-2">
            <span className="font-semibold text-yellow-800">Doctors list has been updated by the clinic.</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all font-medium"
          >
            Close
          </button>
          <button
            onClick={() => {
              onReject(clinic);
              onClose();
            }}
            className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all font-medium flex items-center gap-2"
          >
            <X size={16} />
            Reject
          </button>
          <button
            onClick={() => {
              onApprove(clinic);
              onClose();
            }}
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all font-medium flex items-center gap-2"
          >
            <Check size={16} />
            Approve
          </button>
        </div>
      </div>
    </ModernModal>
  );
};

// Simulate changed fields for demo
// Simulate changed fields for demo
const getChangedFields = (clinic: Clinic) => {
  // In real app, compare with previous approved data
  // For demo, use the clinic's UUID to generate a deterministic but pseudo-random result
  const uuidLastChar = clinic.uuid.charAt(clinic.uuid.length - 1);

  // Convert the last character to a number (0-9 or a-f) for decision making
  const lastCharCode = uuidLastChar.charCodeAt(0);
  const numericValue = isNaN(parseInt(uuidLastChar))
    ? lastCharCode % 10  // For a-f characters, use char code modulo 10
    : parseInt(uuidLastChar);

  if (numericValue % 2 === 0) return ['services'];
  if (numericValue % 3 === 0) return ['doctors'];
  return [];
};

// Main Component
export default function PendingApprovalPage() {

  const [allClinics, setAllClinics] = useState<Clinic[]>([]);
  const [pendingClinics, setPendingClinics] = useState<Clinic[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredClinics, setFilteredClinics] = useState<Clinic[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClinic, setSelectedClinic] = useState<Clinic | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [notification, setNotification] = useState<{
    type: 'success' | 'error' | 'warning';
    message: string;
  } | null>(null);

  // Filter only pending clinics
  useEffect(() => {
    const fetchClinics = async (page = 1) => {
      try {
        setLoading(true);

        // Pass status=PENDING as a query parameter
        const params = {
          page: page,
          status: 'draft' // Add status filter
        };

        const data = await getAllClinic(params); // Pass the params object

        setAllClinics(data.data);
        setPendingClinics(data.data); // All data returned should be pending clinics

        console.log(data.data, 'Pending clinics data');

      } catch (error) {
        setNotification({
          type: 'error',
          message: 'Failed to load clinics'
        });
        console.error("Error fetching clinics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchClinics(currentPage);
  }, [currentPage]);

  // Search functionality
  useEffect(() => {
    let filtered = [...pendingClinics];

    if (searchQuery) {
      filtered = filtered.filter(clinic =>
        clinic.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        clinic.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        clinic.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        clinic.phone.includes(searchQuery) ||
        clinic.address.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredClinics(filtered);
  }, [pendingClinics, searchQuery]);

  const handleApprove = async (clinic: Clinic) => {
    try {
      // Optimistically update the UI first for better UX
      setPendingClinics(prev => prev.filter(c => c.uuid !== clinic.uuid));

      // Make API call to approve the clinic
      await approveOrRejectClinic(clinic.uuid, { status: 'APPROVED' });

      setNotification({
        type: 'success',
        message: `${clinic.name} has been approved successfully!`
      });

    } catch (error) {
      // Revert the UI change if the API call fails
      setPendingClinics(prev => [...prev, clinic]);

      setNotification({
        type: 'error',
        message: `Failed to approve ${clinic.name}. Please try again.`
      });

      console.error("Error approving clinic:", error);
    }
  };

  const handleReject = async (clinic: Clinic) => {
    try {
      // Optimistically update the UI first for better UX
      setPendingClinics(prev => prev.filter(c => c.uuid !== clinic.uuid));

      // Make API call to reject the clinic
      await approveOrRejectClinic(clinic.uuid, { status: 'REJECTED' });

      setNotification({
        type: 'error',
        message: `${clinic.name} has been rejected.`
      });

    } catch (error) {
      // Revert the UI change if the API call fails
      setPendingClinics(prev => [...prev, clinic]);

      setNotification({
        type: 'error',
        message: `Failed to reject ${clinic.name}. Please try again.`
      });

      console.error("Error rejecting clinic:", error);
    }
  };

  const handleViewDetails = (clinic: Clinic) => {
    setSelectedClinic(clinic);
    setIsDetailModalOpen(true);
  };

  const handleBulkApprove = () => {
    const count = filteredClinics.length;
    setPendingClinics([]);
    setNotification({
      type: 'success',
      message: `${count} clinic(s) have been approved successfully!`
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading ...</p>
        </div>
      </div>
    );
  }


  return (
    <div className="min-h-screen p-2 sm:p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          className="flex flex-col md:flex-row md:items-center justify-between mb-5"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <Clock className="mr-3 text-yellow-600" size={32} />
              Pending Approvals
            </h1>
            <p className="text-gray-600 mt-1">Review and approve clinic registration requests</p>
          </div>

          <div className="flex items-center gap-4 mt-4 md:mt-0">
            <button
              onClick={() => window.location.reload()}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <RefreshCw size={16} />
              Refresh
            </button>
            {filteredClinics.length > 0 && (
              <button
                onClick={handleBulkApprove}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <CheckCircle size={16} />
                Approve All
              </button>
            )}
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <Clock size={24} className="text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{filteredClinics.length}</p>
                <p className="text-sm text-gray-600">Clinics awaiting approval</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">
                {filteredClinics.length === 0 ? 'All caught up!' : 'Requires attention'}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Last updated: {new Date().toLocaleTimeString()}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="relative">
            <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search pending clinics by name, city, email, or phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </motion.div>

        {/* Pending Clinics */}
        {filteredClinics.length === 0 ? (
          <motion.div
            className="bg-white p-12 rounded-xl shadow-sm border border-gray-100 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <CheckCircle size={64} className="mx-auto text-green-500 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">All Caught Up!</h3>
            <p className="text-gray-600">
              {searchQuery ? 'No pending clinics match your search.' : 'No clinics are currently pending approval.'}
            </p>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="mt-4 text-blue-600 hover:text-blue-700 underline"
              >
                Clear search
              </button>
            )}
          </motion.div>
        ) : (
          <div className="space-y-4">
            {filteredClinics.map((clinic, index) => (
              <motion.div
                key={clinic.uuid}
                className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  {/* Clinic Info */}
                  <div className="flex-1 space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{clinic.name}</h3>
                        <p className="text-sm text-gray-600 flex items-center gap-1">
                          <MapPin size={14} />
                          {clinic.address}, {clinic.city} - {clinic.pincode}
                        </p>
                      </div>
                      <StatusBadge status={clinic.status} />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Mail size={14} />
                        <span>{clinic.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Phone size={14} />
                        <span>{clinic.phone}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Clock size={14} />
                        <span>{clinic.hours}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Calendar size={14} />
                        <span>{clinic.workingDays?.join(', ')}</span>
                      </div>
                    </div>

                    {clinic.submissionDate && (
                      <div className="text-xs text-gray-500">
                        Submitted on: {new Date(clinic.submissionDate).toLocaleDateString()}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleViewDetails(clinic)}
                      className="flex items-center gap-2 px-4 py-2 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors font-medium"
                    >
                      <Eye size={16} />
                      <span className="hidden sm:inline">Review</span>
                    </button>
                    <button
                      onClick={() => handleReject(clinic)}
                      className="flex items-center gap-2 px-4 py-2 text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors font-medium"
                    >
                      <X size={16} />
                      <span className="hidden sm:inline">Reject</span>
                    </button>
                    <button
                      onClick={() => handleApprove(clinic)}
                      className="flex items-center gap-2 px-4 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors font-medium"
                    >
                      <Check size={16} />
                      <span className="hidden sm:inline">Approve</span>
                    </button>
                  </div>
                </div>

                {/* Highlight Changed Fields: Services/Doctors */}
                {(() => {
                  const changed = getChangedFields(clinic);
                  if (changed.includes('services') || changed.includes('doctors')) {
                    return (
                      <div className="flex gap-2 mt-2">
                        {changed.includes('services') && (
                          <span className="inline-flex items-center px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-semibold border border-yellow-200">
                            <svg className="mr-1" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 10v4M17 10v4M3 10v4M21 10v4M5 10V6a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v4M15 10V6a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v4" /></svg>
                            Services updated
                          </span>
                        )}
                        {changed.includes('doctors') && (
                          <span className="inline-flex items-center px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-semibold border border-yellow-200">
                            <svg className="mr-1" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="8" cy="7" r="4" /><path d="M2 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" /></svg>
                            Doctors updated
                          </span>
                        )}
                      </div>
                    );
                  }
                  return null;
                })()}
              </motion.div>
            ))}
          </div>
        )}

        {/* Clinic Detail Modal */}
        <ClinicDetailModal
          clinic={selectedClinic}
          isOpen={isDetailModalOpen}
          onClose={() => setIsDetailModalOpen(false)}
          onApprove={handleApprove}
          onReject={handleReject}
        />

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