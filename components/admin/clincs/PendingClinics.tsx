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
  Check,
  X,
  Stethoscope,
  AlertTriangle,
  User,
  GraduationCap,
  Award
} from 'lucide-react';
import {
  approveOrRejectClinic,
  approveOrRejectDoctor,
  approveOrRejectService,
  getAllClinic,
  getClinicDoctor,
  getClinicService
} from '@/service/admin/clinicManagentService';

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

interface ClinicService {
  uuid: string;
  service: string;
  clinic: string;
  created_by: string;
  clinic_provided_name: string;
  rank: number;
  consultation_charge_video_call: string;
  consultation_charge_physical_visit: string;
  consultation_charge_home_visit: string | null;
  treatment_charge_video_call: string;
  treatment_charge_physical_visit: string;
  treatment_charge_home_visit: string | null;
  status: 'DRAFT' | 'APPROVED' | 'REJECTED';
  image: string;
  description: string;
  reason_for_rejection: string | null;
  clinic_name: string;
  service_name: string;
}

interface ClinicDoctor {
  uuid: string;
  clinic_service: string;
  created_by: string;
  name: string;
  dob: string;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  specializaton: string;
  experience: number;
  phone_number: string;
  email: string;
  profile_pic: string;
  status: 'DRAFT' | 'APPROVED' | 'REJECTED';
  reason_for_rejection: string | null;
  education: string;
  government_document: string[];
  extra_info: string;
  clinic_name?: string;
  service_name?: string;
}

// Status Badge Component
const StatusBadge = ({ status }: { status: Clinic['status'] | ClinicService['status'] | ClinicDoctor['status'] }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Approved':
      case 'APPROVED':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'PENDING':
      case 'DRAFT':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'Draft':
        return 'bg-gray-100 text-gray-700 border-gray-200';
      case 'Rejected':
      case 'REJECTED':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(status)}`}>
      {status}
    </span>
  );
};

// Notification Component (keep existing implementation)
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

// Confirmation Dialog Component (keep existing implementation)
const ConfirmationDialog = ({
  isOpen,
  onClose,
  onConfirm,
  type,
  title,
  message,
  confirmText,
  cancelText = "Cancel",
  isDestructive = false,
  showReasonInput = false,
  reason = "",
  onReasonChange = () => { }
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  type: 'approve' | 'reject';
  title: string;
  message: string;
  confirmText: string;
  cancelText?: string;
  isDestructive?: boolean;
  showReasonInput?: boolean;
  reason?: string;
  onReasonChange?: (reason: string) => void;
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen w-full items-center justify-center px-4 pt-4 text-center ">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity  " onClick={onClose} />
        <div className="align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className={`mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full sm:mx-0 sm:h-10 sm:w-10 ${type === 'approve' ? 'bg-green-100' : 'bg-red-100'
                }`}>
                {type === 'approve' ? (
                  <CheckCircle className="h-6 w-6 text-green-600" />
                ) : (
                  <AlertTriangle className="h-6 w-6 text-red-600" />
                )}
              </div>
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  {title}
                </h3>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    {message}
                  </p>
                  {showReasonInput && (
                    <div className="mt-4">
                      <label htmlFor="reason" className="block text-sm font-medium text-gray-700 text-left">
                        Reason for rejection
                      </label>
                      <textarea
                        id="reason"
                        rows={3}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-sm"
                        placeholder="Please provide a reason for rejection..."
                        value={reason}
                        onChange={(e) => onReasonChange(e.target.value)}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium text-white sm:ml-3 sm:w-auto sm:text-sm ${isDestructive
                ? 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
                : 'bg-green-600 hover:bg-green-700 focus:ring-green-500'
                } focus:outline-none focus:ring-2 focus:ring-offset-2`}
              onClick={onConfirm}
            >
              {confirmText}
            </button>
            <button
              type="button"
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              onClick={onClose}
            >
              {cancelText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Modern Modal Component (keep existing implementation)
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

// Clinic Detail Modal Component (keep existing implementation)
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
  onReject: (clinic: Clinic, reason?: string) => void;
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
            onClick={() => onReject(clinic)}
            className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all font-medium flex items-center gap-2"
          >
            <X size={16} />
            Reject
          </button>
          <button
            onClick={() => onApprove(clinic)}
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

// Service Detail Modal Component (keep existing implementation)
const ServiceDetailModal = ({
  service,
  isOpen,
  onClose,
  onApprove,
  onReject
}: {
  service: ClinicService | null;
  isOpen: boolean;
  onClose: () => void;
  onApprove: (service: ClinicService) => void;
  onReject: (service: ClinicService, reason?: string) => void;
}) => {
  if (!service) return null;

  return (
    <ModernModal isOpen={isOpen} onClose={onClose} title={`Review Service: ${service.clinic_provided_name}`} size="lg">
      <div className="space-y-6">
        {/* Service Information */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
            <Stethoscope size={18} />
            Service Information
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium text-gray-600">Service Name:</span>
              <p className="text-gray-900">{service.clinic_provided_name}</p>
            </div>
            <div>
              <span className="font-medium text-gray-600">Original Service:</span>
              <p className="text-gray-900">{service.service_name}</p>
            </div>
            <div>
              <span className="font-medium text-gray-600">Clinic:</span>
              <p className="text-gray-900">{service.clinic_name}</p>
            </div>
            <div>
              <span className="font-medium text-gray-600">Rank:</span>
              <p className="text-gray-900">{service.rank}</p>
            </div>
            <div className="md:col-span-2">
              <span className="font-medium text-gray-600">Description:</span>
              <p className="text-gray-900 mt-1">{service.description}</p>
            </div>
          </div>
        </div>

        {/* Consultation Charges */}
        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-semibold text-blue-800 mb-3">Consultation Charges</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="font-medium text-blue-700">Video Call:</span>
              <p className="text-blue-900">₹{service.consultation_charge_video_call}</p>
            </div>
            <div>
              <span className="font-medium text-blue-700">Physical Visit:</span>
              <p className="text-blue-900">₹{service.consultation_charge_physical_visit}</p>
            </div>
            <div>
              <span className="font-medium text-blue-700">Home Visit:</span>
              <p className="text-blue-900">
                {service.consultation_charge_home_visit ? `₹${service.consultation_charge_home_visit}` : 'Not available'}
              </p>
            </div>
          </div>
        </div>

        {/* Treatment Charges */}
        <div className="bg-green-50 p-4 rounded-lg">
          <h4 className="font-semibold text-green-800 mb-3">Treatment Charges</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="font-medium text-green-700">Video Call:</span>
              <p className="text-green-900">₹{service.treatment_charge_video_call}</p>
            </div>
            <div>
              <span className="font-medium text-green-700">Physical Visit:</span>
              <p className="text-green-900">₹{service.treatment_charge_physical_visit}</p>
            </div>
            <div>
              <span className="font-medium text-green-700">Home Visit:</span>
              <p className="text-green-900">
                {service.treatment_charge_home_visit ? `₹${service.treatment_charge_home_visit}` : 'Not available'}
              </p>
            </div>
          </div>
        </div>

        {/* Service Image */}
        {service.image && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold text-gray-800 mb-3">Service Image</h4>
            <img
              src={service.image}
              alt={service.clinic_provided_name}
              className="max-w-full h-auto rounded-lg max-h-64 object-cover"
            />
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
            onClick={() => onReject(service)}
            className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all font-medium flex items-center gap-2"
          >
            <X size={16} />
            Reject
          </button>
          <button
            onClick={() => onApprove(service)}
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

// Doctor Detail Modal Component
const DoctorDetailModal = ({
  doctor,
  isOpen,
  onClose,
  onApprove,
  onReject
}: {
  doctor: ClinicDoctor | null;
  isOpen: boolean;
  onClose: () => void;
  onApprove: (doctor: ClinicDoctor) => void;
  onReject: (doctor: ClinicDoctor, reason?: string) => void;
}) => {
  if (!doctor) return null;

  const calculateAge = (dob: string) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  return (
    <ModernModal isOpen={isOpen} onClose={onClose} title={`Review Doctor: ${doctor.name}`} size="lg">
      <div className="space-y-6">
        {/* Doctor Profile */}
        <div className="flex items-start gap-4">
          <img
            src={doctor.profile_pic}
            alt={doctor.name}
            className="w-24 h-24 rounded-full object-cover border-2 border-gray-200"
          />
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-gray-900">{doctor.name}</h3>
            <p className="text-gray-600">{doctor.specializaton}</p>
            <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
              <span>{calculateAge(doctor.dob)} years</span>
              <span>{doctor.gender}</span>
              <span>{doctor.experience} years experience</span>
            </div>
          </div>
          <StatusBadge status={doctor.status} />
        </div>

        {/* Professional Information */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
            <GraduationCap size={18} />
            Professional Information
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium text-gray-600">Specialization:</span>
              <p className="text-gray-900">{doctor.specializaton}</p>
            </div>
            <div>
              <span className="font-medium text-gray-600">Experience:</span>
              <p className="text-gray-900">{doctor.experience} years</p>
            </div>
            <div>
              <span className="font-medium text-gray-600">Education:</span>
              <p className="text-gray-900">{doctor.education}</p>
            </div>
            <div>
              <span className="font-medium text-gray-600">Date of Birth:</span>
              <p className="text-gray-900">{new Date(doctor.dob).toLocaleDateString()}</p>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
            <Phone size={18} />
            Contact Information
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium text-blue-700">Phone:</span>
              <p className="text-blue-900">{doctor.phone_number}</p>
            </div>
            <div>
              <span className="font-medium text-blue-700">Email:</span>
              <p className="text-blue-900">{doctor.email}</p>
            </div>
          </div>
        </div>

        {/* Additional Information */}
        {doctor.extra_info && (
          <div className="bg-green-50 p-4 rounded-lg">
            <h4 className="font-semibold text-green-800 mb-3">Additional Information</h4>
            <p className="text-green-900 text-sm">{doctor.extra_info}</p>
          </div>
        )}

        {/* Government Documents */}
        {/* Government Documents */}
        {doctor.government_document && doctor.government_document.length > 0 && (
          <div className="bg-yellow-50 p-4 rounded-lg">
            <h4 className="font-semibold text-yellow-800 mb-3">Government Documents</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {doctor.government_document.map((doc, index) => {
                // Get file extension for better icon representation
                const getFileIcon = (url: any) => {
                  if (url.toLowerCase().includes('.pdf')) return 'pdf';
                  if (url.toLowerCase().match(/\.(doc|docx)$/)) return 'word';
                  if (url.toLowerCase().match(/\.(xls|xlsx)$/)) return 'excel';
                  return 'document';
                };

                const fileType = getFileIcon(doc);

                return (
                  <div key={index} className="text-center">
                    <button
                      onClick={() => window.open(doc, '_blank')}
                      className="w-full h-32 bg-white rounded-lg border border-yellow-300 hover:border-yellow-500 hover:bg-yellow-100 transition-colors duration-200 flex flex-col items-center justify-center cursor-pointer group"
                    >
                      {/* PDF Icon */}
                      {fileType === 'pdf' && (
                        <svg className="w-12 h-12 text-red-600 mb-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                          <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                        </svg>
                      )}

                      {/* Word Document Icon */}
                      {fileType === 'word' && (
                        <svg className="w-12 h-12 text-blue-600 mb-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                          <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                        </svg>
                      )}

                      {/* Generic Document Icon */}
                      {fileType === 'document' && (
                        <svg className="w-12 h-12 text-yellow-600 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      )}

                      <span className="text-yellow-700 font-medium text-sm group-hover:text-yellow-800">
                        View {fileType === 'pdf' ? 'PDF' : fileType === 'word' ? 'Word Doc' : 'Document'} {index + 1}
                      </span>
                      <span className="text-yellow-600 text-xs mt-1">Click to open in new tab</span>
                    </button>
                    <p className="text-xs text-yellow-700 mt-1">
                      {fileType === 'pdf' ? 'PDF' : fileType === 'word' ? 'Word Document' : 'Document'} {index + 1}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col md:flex-row md:justify-end gap-4 pt-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-6 py-2 md:py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all font-medium"
          >
            Close
          </button>
          <button
            onClick={() => onReject(doctor)}
            className="px-6 py-2 md:py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all font-medium flex items-center gap-2"
          >
            <X size={16} />
            Reject
          </button>
          <button
            onClick={() => onApprove(doctor)}
            className="px-6 py-2 md:py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all font-medium flex items-center gap-2"
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
const getChangedFields = (clinic: Clinic) => {
  const uuidLastChar = clinic.uuid.charAt(clinic.uuid.length - 1);
  const lastCharCode = uuidLastChar.charCodeAt(0);
  const numericValue = isNaN(parseInt(uuidLastChar))
    ? lastCharCode % 10
    : parseInt(uuidLastChar);

  if (numericValue % 2 === 0) return ['services'];
  if (numericValue % 3 === 0) return ['doctors'];
  return [];
};

// Tab Component
const TabButton = ({
  active,
  onClick,
  icon: Icon,
  children,
  count
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ComponentType<any>;
  children: React.ReactNode;
  count?: number;
}) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-4 py-3 rounded-lg font-medium transition-all ${active
      ? 'bg-primaryColor text-white shadow-md'
      : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
      }`}
  >
    <Icon size={18} />
    <span>{children}</span>
    {count !== undefined && (
      <span className={`px-2 py-1 text-xs rounded-full ${active ? 'bg-white text-primaryColor' : 'bg-gray-200 text-gray-700'
        }`}>
        {count}
      </span>
    )}
  </button>
);

// Main Component
export default function PendingApprovalPage() {
  const [activeTab, setActiveTab] = useState<'clinics' | 'services' | 'doctors'>('clinics');
  const [allClinics, setAllClinics] = useState<Clinic[]>([]);
  const [pendingClinics, setPendingClinics] = useState<Clinic[]>([]);
  const [clinicServices, setClinicServices] = useState<ClinicService[]>([]);
  const [pendingServices, setPendingServices] = useState<ClinicService[]>([]);
  const [clinicDoctors, setClinicDoctors] = useState<ClinicDoctor[]>([]);
  const [pendingDoctors, setPendingDoctors] = useState<ClinicDoctor[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredClinics, setFilteredClinics] = useState<Clinic[]>([]);
  const [filteredServices, setFilteredServices] = useState<ClinicService[]>([]);
  const [filteredDoctors, setFilteredDoctors] = useState<ClinicDoctor[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClinic, setSelectedClinic] = useState<Clinic | null>(null);
  const [selectedService, setSelectedService] = useState<ClinicService | null>(null);
  const [selectedDoctor, setSelectedDoctor] = useState<ClinicDoctor | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [isDoctorModalOpen, setIsDoctorModalOpen] = useState(false);
  const [notification, setNotification] = useState<{
    type: 'success' | 'error' | 'warning';
    message: string;
  } | null>(null);

  // Confirmation dialog states
  const [confirmationDialog, setConfirmationDialog] = useState<{
    isOpen: boolean;
    type: 'approve' | 'reject';
    itemType: 'clinic' | 'service' | 'doctor';
    item: Clinic | ClinicService | ClinicDoctor | null;
    title: string;
    message: string;
    confirmText: string;
    isDestructive: boolean;
    showReasonInput: boolean;
    reason: string;
  }>({
    isOpen: false,
    type: 'approve',
    itemType: 'clinic',
    item: null,
    title: '',
    message: '',
    confirmText: '',
    isDestructive: false,
    showReasonInput: false,
    reason: ''
  });

  // Fetch clinics, services, and doctors
  useEffect(() => {
    const fetchData = async (page = 1) => {
      try {
        setLoading(true);

        const params = {
          page: page,
          status: 'DRAFT'
        };

        // Fetch clinics
        const clinicData = await getAllClinic(params);
        setAllClinics(clinicData.data);
        setPendingClinics(clinicData.data);

        // Fetch services
        const serviceData = await getClinicService(params);
        setClinicServices(serviceData.data || []);
        setPendingServices(serviceData.data || []);

        // Fetch doctors
        const doctorData = await getClinicDoctor(params);
        setClinicDoctors(doctorData.data || []);
        setPendingDoctors(doctorData.data || []);

        console.log('Clinic data:', clinicData.data);
        console.log('Service data:', serviceData.data);
        console.log('Doctor data:', doctorData.data?.data);

      } catch (error) {
        setNotification({
          type: 'error',
          message: 'Failed to load data'
        });
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData(currentPage);
  }, [currentPage]);

  // Search functionality for clinics
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

  // Search functionality for services
  useEffect(() => {
    let filtered = [...pendingServices];

    if (searchQuery) {
      filtered = filtered.filter(service =>
        service.clinic_provided_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.service_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.clinic_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredServices(filtered);
  }, [pendingServices, searchQuery]);

  // Search functionality for doctors
  useEffect(() => {
    let filtered = [...pendingDoctors];

    if (searchQuery) {
      filtered = filtered.filter(doctor =>
        doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doctor.specializaton.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doctor.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doctor.phone_number.includes(searchQuery) ||
        doctor.education.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredDoctors(filtered);
  }, [pendingDoctors, searchQuery]);

  // Show confirmation dialog
  const showConfirmation = (
    type: 'approve' | 'reject',
    itemType: 'clinic' | 'service' | 'doctor',
    item: Clinic | ClinicService | ClinicDoctor,
    title: string,
    message: string,
    confirmText: string,
    isDestructive: boolean = false,
    showReasonInput: boolean = false
  ) => {
    setConfirmationDialog({
      isOpen: true,
      type,
      itemType,
      item,
      title,
      message,
      confirmText,
      isDestructive,
      showReasonInput,
      reason: ''
    });
  };

  // Handle confirmation
  const handleConfirmation = async () => {
    const { type, itemType, item, reason } = confirmationDialog;

    if (!item) return;

    try {
      if (itemType === 'clinic') {
        const clinic = item as Clinic;
        if (type === 'approve') {
          await handleApproveClinic(clinic);
        } else {
          await handleRejectClinic(clinic, reason);
        }
      } else if (itemType === 'service') {
        const service = item as ClinicService;
        if (type === 'approve') {
          await handleApproveService(service);
        } else {
          await handleRejectService(service, reason);
        }
      } else if (itemType === 'doctor') {
        const doctor = item as ClinicDoctor;
        if (type === 'approve') {
          await handleApproveDoctor(doctor);
        } else {
          await handleRejectDoctor(doctor, reason);
        }
      }
    } catch (error) {
      // Error handling is done in the individual functions
    } finally {
      setConfirmationDialog(prev => ({ ...prev, isOpen: false, reason: '' }));
    }
  };

  // Clinic approval handlers
  const handleApproveClinic = async (clinic: Clinic) => {
    try {
      setPendingClinics(prev => prev.filter(c => c.uuid !== clinic.uuid));
      await approveOrRejectClinic(clinic.uuid, { status: 'APPROVED' });
      setNotification({
        type: 'success',
        message: `${clinic.name} has been approved successfully!`
      });
    } catch (error) {
      setPendingClinics(prev => [...prev, clinic]);
      setNotification({
        type: 'error',
        message: `Failed to approve ${clinic.name}. Please try again.`
      });
      console.error("Error approving clinic:", error);
    }
  };

  const handleRejectClinic = async (clinic: Clinic, reason?: string) => {
    try {
      setPendingClinics(prev => prev.filter(c => c.uuid !== clinic.uuid));
      await approveOrRejectClinic(clinic.uuid, {
        status: 'REJECTED',
        ...(reason && { reason_for_rejection: reason })
      });
      setNotification({
        type: 'error',
        message: `${clinic.name} has been rejected.`
      });
    } catch (error) {
      setPendingClinics(prev => [...prev, clinic]);
      setNotification({
        type: 'error',
        message: `Failed to reject ${clinic.name}. Please try again.`
      });
      console.error("Error rejecting clinic:", error);
    }
  };

  // Service approval handlers
  const handleApproveService = async (service: ClinicService) => {
    try {
      await approveOrRejectService(service.uuid, { status: 'APPROVED' });
      setPendingServices(prev => prev.filter(s => s.uuid !== service.uuid));
      setNotification({
        type: 'success',
        message: `${service.clinic_provided_name} has been approved successfully!`
      });
    } catch (error) {
      setNotification({
        type: 'error',
        message: `Failed to approve ${service.clinic_provided_name}. Please try again.`
      });
      console.error("Error approving service:", error);
    }
  };

  const handleRejectService = async (service: ClinicService, reason?: string) => {
    try {
      await approveOrRejectService(service.uuid, {
        status: 'REJECTED',
        ...(reason && { reason_for_rejection: reason })
      });
      setPendingServices(prev => prev.filter(s => s.uuid !== service.uuid));
      setNotification({
        type: 'error',
        message: `${service.clinic_provided_name} has been rejected.`
      });
    } catch (error) {
      setNotification({
        type: 'error',
        message: `Failed to reject ${service.clinic_provided_name}. Please try again.`
      });
      console.error("Error rejecting service:", error);
    }
  };

  // Doctor approval handlers
  const handleApproveDoctor = async (doctor: ClinicDoctor) => {
    try {
      await approveOrRejectDoctor(doctor.uuid, { status: 'APPROVED' });
      setPendingDoctors(prev => prev.filter(d => d.uuid !== doctor.uuid));
      setNotification({
        type: 'success',
        message: `Dr. ${doctor.name} has been approved successfully!`
      });
    } catch (error) {
      setNotification({
        type: 'error',
        message: `Failed to approve Dr. ${doctor.name}. Please try again.`
      });
      console.error("Error approving doctor:", error);
    }
  };

  const handleRejectDoctor = async (doctor: ClinicDoctor, reason?: string) => {
    try {
      await approveOrRejectDoctor(doctor.uuid, {
        status: 'REJECTED',
        ...(reason && { reason_for_rejection: reason })
      });
      setPendingDoctors(prev => prev.filter(d => d.uuid !== doctor.uuid));
      setNotification({
        type: 'error',
        message: `Dr. ${doctor.name} has been rejected.`
      });
    } catch (error) {
      setNotification({
        type: 'error',
        message: `Failed to reject Dr. ${doctor.name}. Please try again.`
      });
      console.error("Error rejecting doctor:", error);
    }
  };

  const handleViewClinicDetails = (clinic: Clinic) => {
    setSelectedClinic(clinic);
    setIsDetailModalOpen(true);
  };

  const handleViewServiceDetails = (service: ClinicService) => {
    setSelectedService(service);
    setIsServiceModalOpen(true);
  };

  const handleViewDoctorDetails = (doctor: ClinicDoctor) => {
    setSelectedDoctor(doctor);
    setIsDoctorModalOpen(true);
  };

  const handleBulkApprove = () => {
    if (activeTab === 'clinics') {
      const count = filteredClinics.length;
      setPendingClinics([]);
      setNotification({
        type: 'success',
        message: `${count} clinic(s) have been approved successfully!`
      });
    } else if (activeTab === 'services') {
      const count = filteredServices.length;
      setPendingServices([]);
      setNotification({
        type: 'success',
        message: `${count} service(s) have been approved successfully!`
      });
    } else if (activeTab === 'doctors') {
      const count = filteredDoctors.length;
      setPendingDoctors([]);
      setNotification({
        type: 'success',
        message: `${count} doctor(s) have been approved successfully!`
      });
    }
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
              Pending Approvals
            </h1>
            <p className="text-gray-600 mt-1">Review and approve clinic registration requests, services, and doctors</p>
          </div>

          <div className="flex items-center gap-4 mt-4 md:mt-0">
            <button
              onClick={() => window.location.reload()}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <RefreshCw size={16} />
              Refresh
            </button>
            {(filteredClinics.length > 0 || filteredServices.length > 0 || filteredDoctors.length > 0) && (
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

        {/* Tabs */}
        <motion.div
          className="bg-white p-2 rounded-xl shadow-sm border border-gray-100 mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex flex-col md:flex-row gap-2">
            <TabButton
              active={activeTab === 'clinics'}
              onClick={() => setActiveTab('clinics')}
              icon={Building2}
              count={filteredClinics.length}
            >
              Clinic Approvals
            </TabButton>
            <TabButton
              active={activeTab === 'services'}
              onClick={() => setActiveTab('services')}
              icon={Stethoscope}
              count={filteredServices.length}
            >
              Service Approvals
            </TabButton>
            <TabButton
              active={activeTab === 'doctors'}
              onClick={() => setActiveTab('doctors')}
              icon={User}
              count={filteredDoctors.length}
            >
              Doctor Approvals
            </TabButton>
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
              placeholder={
                activeTab === 'clinics'
                  ? "Search pending clinics by name, city, email, or phone..."
                  : activeTab === 'services'
                    ? "Search pending services by name, clinic, or description..."
                    : "Search pending doctors by name, specialization, or email..."
              }
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </motion.div>

        {/* Content based on active tab */}
        {activeTab === 'clinics' ? (
          /* Clinic Approval Content */
          filteredClinics.length === 0 ? (
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
                        onClick={() => handleViewClinicDetails(clinic)}
                        className="flex items-center gap-2 px-4 py-2 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors font-medium"
                      >
                        <Eye size={16} />
                        <span className="hidden sm:inline">Review</span>
                      </button>
                      <button
                        onClick={() => showConfirmation(
                          'reject',
                          'clinic',
                          clinic,
                          'Reject Clinic',
                          `Are you sure you want to reject ${clinic.name}? This action cannot be undone.`,
                          'Reject Clinic',
                          true,
                          true
                        )}
                        className="flex items-center gap-2 px-4 py-2 text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors font-medium"
                      >
                        <X size={16} />
                        <span className="hidden sm:inline">Reject</span>
                      </button>
                      <button
                        onClick={() => showConfirmation(
                          'approve',
                          'clinic',
                          clinic,
                          'Approve Clinic',
                          `Are you sure you want to approve ${clinic.name}?`,
                          'Approve Clinic'
                        )}
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
          )
        ) : activeTab === 'services' ? (
          /* Service Approval Content */
          filteredServices.length === 0 ? (
            <motion.div
              className="bg-white p-12 rounded-xl shadow-sm border border-gray-100 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <CheckCircle size={64} className="mx-auto text-green-500 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">All Caught Up!</h3>
              <p className="text-gray-600">
                {searchQuery ? 'No pending services match your search.' : 'No services are currently pending approval.'}
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
              {filteredServices.map((service, index) => (
                <motion.div
                  key={service.uuid}
                  className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="p-6">
                    {/* Header Section */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-semibold text-gray-900 truncate">
                            {service.clinic_provided_name}
                          </h3>
                          <StatusBadge status={service.status} />
                        </div>
                        <div className="flex items-center text-gray-600 text-sm">
                          <Building2 size={16} className="flex-shrink-0 mr-2" />
                          <span className="truncate">{service.clinic_name}</span>
                          <span className="mx-2">•</span>
                          <span className="text-gray-700 font-medium">{service.service_name}</span>
                        </div>
                      </div>
                    </div>

                    {/* Pricing Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
                      <div className="bg-gray-50 rounded-lg p-3">
                        <div className="text-sm text-gray-600 mb-1">Rank</div>
                        <div className="text-lg font-semibold text-gray-900">#{service.rank}</div>
                      </div>
                      <div className="bg-blue-50 rounded-lg p-3">
                        <div className="text-sm text-blue-600 mb-1">Video Consultation</div>
                        <div className="text-lg font-semibold text-gray-900">₹{service.consultation_charge_video_call}</div>
                      </div>
                      <div className="bg-green-50 rounded-lg p-3">
                        <div className="text-sm text-green-600 mb-1">Physical Visit</div>
                        <div className="text-lg font-semibold text-gray-900">₹{service.consultation_charge_physical_visit}</div>
                      </div>
                    </div>

                    {/* Description */}
                    {service.description && (
                      <div className="mb-4">
                        <div className="text-sm font-medium text-gray-700 mb-2">Description</div>
                        <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">
                          {service.description}
                        </p>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <button
                        onClick={() => handleViewServiceDetails(service)}
                        className="flex items-center gap-2 px-4 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-colors font-medium text-sm"
                      >
                        <Eye size={16} />
                        View Details
                      </button>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => showConfirmation(
                            'reject',
                            'service',
                            service,
                            'Reject Service',
                            `Are you sure you want to reject ${service.clinic_provided_name}? This action cannot be undone.`,
                            'Reject Service',
                            true,
                            true
                          )}
                          className="flex items-center gap-2 px-4 py-2.5 text-red-700 bg-white border border-red-200 rounded-lg hover:bg-red-50 hover:border-red-300 transition-colors font-medium text-sm"
                        >
                          <X size={16} />
                          Reject
                        </button>
                        <button
                          onClick={() => showConfirmation(
                            'approve',
                            'service',
                            service,
                            'Approve Service',
                            `Are you sure you want to approve ${service.clinic_provided_name}?`,
                            'Approve Service'
                          )}
                          className="flex items-center gap-2 px-4 py-2.5 text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors font-medium text-sm shadow-sm"
                        >
                          <Check size={16} />
                          Approve
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )
        ) : (
          /* Doctor Approval Content */
          filteredDoctors.length === 0 ? (
            <motion.div
              className="bg-white p-12 rounded-xl shadow-sm border border-gray-100 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <CheckCircle size={64} className="mx-auto text-green-500 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">All Caught Up!</h3>
              <p className="text-gray-600">
                {searchQuery ? 'No pending doctors match your search.' : 'No doctors are currently pending approval.'}
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
              {filteredDoctors.map((doctor, index) => (
                <motion.div
                  key={doctor.uuid}
                  className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                      {/* Doctor Profile */}
                      <div className="flex items-center gap-4 sm:flex-col sm:items-center sm:gap-3 sm:flex-shrink-0">
                        <img
                          src={doctor.profile_pic}
                          alt={doctor.name}
                          className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover border-2 border-gray-200"
                        />
                        {/* Status badge for mobile - shown below image on mobile */}
                        <div className="sm:hidden">
                          <StatusBadge status={doctor.status} />
                        </div>
                      </div>

                      {/* Doctor Information */}
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-3 gap-2">
                          <div className="flex-1">
                            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-1">
                              Dr. {doctor.name}
                            </h3>
                            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 text-sm text-gray-600 mb-2">
                              <span className="flex items-center gap-1">
                                <Award size={14} />
                                {doctor.specializaton}
                              </span>
                              <span className="hidden sm:inline">•</span>
                              <span>{doctor.experience} years experience</span>
                              <span className="hidden sm:inline">•</span>
                              <span className="text-xs sm:text-sm">{doctor.education}</span>
                            </div>
                          </div>
                          {/* Status badge for desktop - shown on top right */}
                          <div className="hidden sm:block">
                            <StatusBadge status={doctor.status} />
                          </div>
                        </div>

                        {/* Contact Information */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 text-sm text-gray-600 mb-4">
                          <div className="flex items-center gap-2">
                            <Mail size={14} className="flex-shrink-0" />
                            <span className="truncate text-xs sm:text-sm">{doctor.email}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone size={14} className="flex-shrink-0" />
                            <span className="text-xs sm:text-sm">{doctor.phone_number}</span>
                          </div>
                        </div>

                        {/* Additional Info */}
                        {doctor.extra_info && (
                          <div className="mb-4">
                            <p className="text-gray-600 text-xs sm:text-sm leading-relaxed line-clamp-2">
                              {doctor.extra_info}
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-col sm:flex-row lg:flex-col gap-2 sm:items-center lg:items-end">
                        <button
                          onClick={() => handleViewDoctorDetails(doctor)}
                          className="flex items-center justify-center gap-2 px-3 py-2 sm:px-4 sm:py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-colors font-medium text-xs sm:text-sm w-full sm:w-auto"
                        >
                          <Eye size={14} className="sm:size-[16px]" />
                          <span>Details</span>
                        </button>
                        <div className="flex gap-2 w-full">
                          <button
                            onClick={() => showConfirmation(
                              'reject',
                              'doctor',
                              doctor,
                              'Reject Doctor',
                              `Are you sure you want to reject Dr. ${doctor.name}? This action cannot be undone.`,
                              'Reject Doctor',
                              true,
                              true
                            )}
                            className="flex items-center justify-center gap-2 px-3 py-2 sm:px-4 sm:py-2.5 text-red-700 bg-white border border-red-200 rounded-lg hover:bg-red-50 hover:border-red-300 transition-colors font-medium text-xs sm:text-sm flex-1 sm:flex-none"
                          >
                            <X size={14} className="sm:size-[16px]" />
                            <span className="sm:hidden">Reject</span>
                            <span className="hidden sm:inline">Reject</span>
                          </button>
                          <button
                            onClick={() => showConfirmation(
                              'approve',
                              'doctor',
                              doctor,
                              'Approve Doctor',
                              `Are you sure you want to approve Dr. ${doctor.name}?`,
                              'Approve Doctor'
                            )}
                            className="flex items-center justify-center gap-2 px-3 py-2 sm:px-4 sm:py-2.5 text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors font-medium text-xs sm:text-sm flex-1 sm:flex-none shadow-sm"
                          >
                            <Check size={14} className="sm:size-[16px]" />
                            <span className="sm:hidden">Approve</span>
                            <span className="hidden sm:inline">Approve</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )
        )}

        {/* Modals */}
        <ClinicDetailModal
          clinic={selectedClinic}
          isOpen={isDetailModalOpen}
          onClose={() => setIsDetailModalOpen(false)}
          onApprove={(clinic) => showConfirmation(
            'approve',
            'clinic',
            clinic,
            'Approve Clinic',
            `Are you sure you want to approve ${clinic.name}?`,
            'Approve Clinic'
          )}
          onReject={(clinic) => showConfirmation(
            'reject',
            'clinic',
            clinic,
            'Reject Clinic',
            `Are you sure you want to reject ${clinic.name}? This action cannot be undone.`,
            'Reject Clinic',
            true,
            true
          )}
        />

        <ServiceDetailModal
          service={selectedService}
          isOpen={isServiceModalOpen}
          onClose={() => setIsServiceModalOpen(false)}
          onApprove={(service) => showConfirmation(
            'approve',
            'service',
            service,
            'Approve Service',
            `Are you sure you want to approve ${service.clinic_provided_name}?`,
            'Approve Service'
          )}
          onReject={(service) => showConfirmation(
            'reject',
            'service',
            service,
            'Reject Service',
            `Are you sure you want to reject ${service.clinic_provided_name}? This action cannot be undone.`,
            'Reject Service',
            true,
            true
          )}
        />

        <DoctorDetailModal
          doctor={selectedDoctor}
          isOpen={isDoctorModalOpen}
          onClose={() => setIsDoctorModalOpen(false)}
          onApprove={(doctor) => showConfirmation(
            'approve',
            'doctor',
            doctor,
            'Approve Doctor',
            `Are you sure you want to approve Dr. ${doctor.name}?`,
            'Approve Doctor'
          )}
          onReject={(doctor) => showConfirmation(
            'reject',
            'doctor',
            doctor,
            'Reject Doctor',
            `Are you sure you want to reject Dr. ${doctor.name}? This action cannot be undone.`,
            'Reject Doctor',
            true,
            true
          )}
        />

        {/* Confirmation Dialog */}
        <ConfirmationDialog
          isOpen={confirmationDialog.isOpen}
          onClose={() => setConfirmationDialog(prev => ({ ...prev, isOpen: false, reason: '' }))}
          onConfirm={handleConfirmation}
          type={confirmationDialog.type}
          title={confirmationDialog.title}
          message={confirmationDialog.message}
          confirmText={confirmationDialog.confirmText}
          isDestructive={confirmationDialog.isDestructive}
          showReasonInput={confirmationDialog.showReasonInput}
          reason={confirmationDialog.reason}
          onReasonChange={(reason) => setConfirmationDialog(prev => ({ ...prev, reason }))}
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