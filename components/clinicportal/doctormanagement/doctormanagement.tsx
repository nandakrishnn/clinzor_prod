import React, { useEffect, useState } from 'react';
import {
  Search,
  Plus,
  Filter,
  Edit3,
  Eye,
  Trash2,
  MoreHorizontal,
  Users,
  UserCheck,
  UserX,
  Stethoscope,
  Phone,
  Mail,
  Calendar,
  MapPin,
  X,
  CheckCircle,
  AlertCircle,
  Clock,
  XCircle
} from 'lucide-react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { createDoctor, deleteDoctor, editDoctor, GetAllDoctor } from '@/service/clinic/doctorManagementService';
import { Clinic_by_clinic_user, GetAllClinicService, GetAllServiceForClinic } from '@/service/clinic/serviceManagementService';
import { uploadFiles } from '@/service/uploadService/uploadService';
import { motion, AnimatePresence } from "framer-motion";
// Types
interface Service {
  uuid: string;
  created_by: string;
  service_name: string;
  description: string;
  tags: string;
  image: string | null;
  status: 'APPROVED' | 'PENDING' | 'REJECTED';
}

interface Doctor {
  uuid: string;
  clinic_service: string;
  created_by: string;
  name: string;
  dob: string | null;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  specializaton: string;
  experience: number | null;
  phone_number: string;
  email: string | null;
  status: 'APPROVED' | 'PENDING' | 'REJECTED';
  profile_pic: string | null;
  reason_for_rejection: string | null;
  education?: string;
  government_document?: string[];
  extra_info?: string;
}

interface NewDoctor {
  clinic_service: string;
  name: string;
  dob: string;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  specializaton: string;
  experience: string;
  phone_number: string;
  email: string;
  education?: string;
  additional_info?: string;
  profile_pic_file?: File | null;
  govt_verification_doc_files?: File[];
  extra_info?: string;
}

// remove mock/sample data – real backend data is used
interface NotificationProps {
  type: "success" | "error" | "warning";
  message: string;
  onClose: () => void;
}

const MAX_GOVT_DOC_FILES = 5;
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

const DoctorManagement: React.FC = () => {
  // State management
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const doctorsPerPage = 10;
  const [totalPages, setTotalPages] = useState(1);

  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [serviceFilter, setServiceFilter] = useState('');
  const [genderFilter, setGenderFilter] = useState('');
  const [specializationFilter, setSpecializationFilter] = useState('');
  // totalPages moved up
  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [modalMode, setModalMode] = useState<'view' | 'edit' | 'delete' | null>(null);
  const [uploading, setUploading] = useState(false);
  const [newDoctor, setNewDoctor] = useState<NewDoctor>({
    clinic_service: '',
    name: '',
    dob: '',
    gender: 'MALE',
    specializaton: '',
    experience: '',
    phone_number: '',
    email: '',
    education: '',
    additional_info: '',
    profile_pic_file: null,
    govt_verification_doc_files: [],
  });
  const [paginationData, setPaginationData] = useState({
    current_page: 1,
    total_pages: 1,
    total_items: 0,
    next: null as string | null,
    previous: null as string | null
  });
  // Validation state
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  // Image upload error state
  const [imageError, setImageError] = useState<string>('');
  const [govtDocError, setGovtDocError] = useState<string>('');
  const [govtDocHelper, setGovtDocHelper] = useState<string>('You can upload up to 5 files.');
  const [services, setServices] = useState<Service[]>([])
  const [totalitems, setTotalItems] = useState(0);
  // Preview state
  const [previewDoc, setPreviewDoc] = useState<{ url: string; type: string; name: string } | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };
  const [notification, setNotification] = useState<{
    type: "success" | "error" | "warning";
    message: string;
  } | null>(null);
  // Add state for search timeout
  const [loading, setLoading] = useState(true);
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null);
  const fetchDoctor = async (
    pageNum: number = currentPage,
    searchText: string = searchTerm,
    status: string = statusFilter,
    service: string = serviceFilter,
    gender: string = genderFilter,
    specialization: string = specializationFilter
  ) => {
    try {
      setLoading(true);
      const clinicUserData = await Clinic_by_clinic_user();
      const clinicId = clinicUserData?.uuid as string;

      const [DoctorData, allServicesData] = await Promise.all([
        GetAllDoctor(pageNum, doctorsPerPage, searchText, status, service, gender, specialization),
        GetAllClinicService(clinicId, 'approved'),
      ]);

      // Set states with the responses
      setPaginationData({
        current_page: DoctorData.current_page || 1,
        total_pages: DoctorData.total_pages || 1,
        total_items: DoctorData.total_items || 0,
        next: DoctorData.next || null,
        previous: DoctorData.previous || null
      });

      setTotalPages(DoctorData.total_pages || Math.ceil((DoctorData.count || 0) / doctorsPerPage) || 1);
      setDoctors(DoctorData.data);
      setTotalItems(DoctorData.total_items || 0);
      setServices(allServicesData.data);
    } catch (error) {
      console.error("Error to fetch Data", error);
    } finally {
      setLoading(false);
    }
  }

  // Update useEffect to use parameters
  useEffect(() => {
    fetchDoctor(
      currentPage,
      searchTerm,
      statusFilter,
      serviceFilter,
      genderFilter,
      specializationFilter
    );
  }, [currentPage, statusFilter, serviceFilter, genderFilter, specializationFilter]);

  // Update search handler to trigger API call with debounce
  const handleSearchChange = (term: string) => {
    setSearchTerm(term);

    // Clear previous timeout
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    // Set new timeout for debounced search
    const timeoutId = setTimeout(() => {
      fetchDoctor(
        1,
        term,
        statusFilter,
        serviceFilter,
        genderFilter,
        specializationFilter
      );
      setCurrentPage(1); // Reset to first page when searching
    }, 500);

    setSearchTimeout(timeoutId);
  };

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }
    };
  }, [searchTimeout]);

  console.log(doctors, "data")

  // Update filter handlers to trigger API calls
  const handleStatusFilterChange = (status: string) => {
    setStatusFilter(status);
    setCurrentPage(1); // Reset to first page when filtering
  };

  const handleServiceFilterChange = (service: string) => {
    setServiceFilter(service);
    setCurrentPage(1);
  };

  const handleSpecializationFilterChange = (specialization: string) => {
    setSpecializationFilter(specialization);
    setCurrentPage(1);
  };

  // Helper functions
  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'APPROVED': return {
        color: 'bg-emerald-500/10 text-emerald-700 border-emerald-500/20',
        dot: 'bg-emerald-500',
        icon: CheckCircle
      };
      case 'PENDING': return {
        color: 'bg-amber-500/10 text-amber-700 border-amber-500/20',
        dot: 'bg-amber-500',
        icon: Clock
      };
      case 'REJECTED': return {
        color: 'bg-red-500/10 text-red-700 border-red-500/20',
        dot: 'bg-red-500',
        icon: AlertCircle
      };
      default: return {
        color: 'bg-slate-500/10 text-slate-700 border-slate-500/20',
        dot: 'bg-slate-500',
        icon: AlertCircle
      };
    }
  };

  const getServiceName = (serviceId: string) => {
    return services.find(s => s.uuid === serviceId)?.service_name || 'Unknown Service';
  };

  const calculateAge = (dob: string | null) => {
    if (!dob) return 'N/A';
    const age = new Date().getFullYear() - new Date(dob).getFullYear();
    return `${age} years`;
  };

  // Backend paginates; render the page as delivered and keep client filters if needed
  const paginatedDoctors = doctors;

  // Statistics
  const totalDoctors = totalitems;
  const approvedDoctors = doctors.filter(d => d.status === 'APPROVED').length;
  const pendingDoctors = doctors.filter(d => d.status === 'PENDING').length;
  const rejectedDoctors = doctors.filter(d => d.status === 'REJECTED').length;

  // Validation function
  const validateForm = () => {
    const errors: { [key: string]: string } = {};
    if (!newDoctor.name.trim()) errors.name = 'Name is required.';
    if (!newDoctor.dob) errors.dob = 'Date of birth is required.';
    if (!newDoctor.gender) errors.gender = 'Gender is required.';
    if (!newDoctor.specializaton.trim()) errors.specializaton = 'Specialization is required.';
    if (!newDoctor.experience.trim() || isNaN(Number(newDoctor.experience)) || Number(newDoctor.experience) < 0) errors.experience = 'Valid experience is required.';
    if (!newDoctor.phone_number.trim() || !/^\d{10}$/.test(newDoctor.phone_number)) errors.phone_number = 'Valid 10-digit phone number is required.';
    if (!newDoctor.email.trim() || !/^\S+@\S+\.\S+$/.test(newDoctor.email)) errors.email = 'Valid email is required.';
    if (!newDoctor.clinic_service) errors.clinic_service = 'Clinic service is required.';
    if (!newDoctor.education || !newDoctor.education.trim()) errors.education = 'Education is required.';
    // Validate image file type and size if present
    if (newDoctor.profile_pic_file) {
      const file = newDoctor.profile_pic_file;
      const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
      if (!validTypes.includes(file.type)) {
        errors.profile_pic_file = 'Only JPG, PNG, or WEBP images are allowed.';
      }
      if (file.size > 2 * 1024 * 1024) {
        errors.profile_pic_file = 'Image size must be less than 2MB.';
      }
    }
    // profile_pic_file and govt_verification_doc_files are optional
    return errors;
  };

  // Enhanced handleCreateDoctor with validation
  const handleCreateDoctorEnhanced = (e: React.FormEvent) => {
    e.preventDefault();
    const errors = validateForm();
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) return;
    handleCreateDoctor();
  };

  // Enhanced handleUpdateDoctor with validation
  const handleUpdateDoctorEnhanced = (e: React.FormEvent) => {
    e.preventDefault();
    const errors = validateForm();
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) return;
    handleUpdateDoctor();
  };

  // Enhanced resetForm to clear errors
  const resetFormEnhanced = () => {
    resetForm();
    setFormErrors({});
  };

  // Add these helper functions to your component
  const uploadDoctorFiles = async (
    profilePicFile: File | null | undefined,
    govtDocFiles: File[] = []
  ) => {
    try {
      const filesToUpload: File[] = [];

      // Handle profile pic file (could be null or undefined)
      if (profilePicFile) {
        filesToUpload.push(profilePicFile);
      }

      // Handle govt doc files
      if (govtDocFiles && govtDocFiles.length > 0) {
        filesToUpload.push(...govtDocFiles);
      }

      if (filesToUpload.length === 0) {
        return { profilePicUrl: null, govtDocUrls: [] };
      }

      // Upload all files
      const uploadedUrls = await uploadFiles(filesToUpload);

      // Separate the URLs - profile pic is first if it exists
      let profilePicUrl = null;
      let govtDocUrls = [];

      if (profilePicFile) {
        profilePicUrl = uploadedUrls[0];
        govtDocUrls = uploadedUrls.slice(1);
      } else {
        govtDocUrls = uploadedUrls;
      }

      return { profilePicUrl, govtDocUrls };
    } catch (error) {
      console.error("Error uploading files:", error);
      throw new Error("Failed to upload files");
    }
  };

  const prepareGovtVerificationDocs = (govtDocUrls: string[]) => {
    // Simply return the array of URLs as the API expects
    return govtDocUrls;
  };

  // CRUD operations
  const handleCreateDoctor = async () => {
    try {
      // Upload files first
      setUploading(true);
      const { profilePicUrl, govtDocUrls } = await uploadDoctorFiles(
        newDoctor.profile_pic_file,
        newDoctor.govt_verification_doc_files || []
      );

      // Prepare the govt verification docs
      const government_document = prepareGovtVerificationDocs(govtDocUrls);

      // Prepare the payload for API
      const payload = {
        clinic_service: newDoctor.clinic_service,
        name: newDoctor.name,
        dob: newDoctor.dob,
        gender: newDoctor.gender,
        specializaton: newDoctor.specializaton,
        experience: newDoctor.experience,
        phone_number: newDoctor.phone_number,
        email: newDoctor.email,
        education: newDoctor.education,
        extra_info: newDoctor.additional_info,
        profile_pic: profilePicUrl,
        government_document: government_document,
      };

      // Call the create doctor API
      const createdDoctor = await createDoctor(payload);

      // Update local state
      setDoctors([createdDoctor, ...doctors]);
      resetForm();
      setShowCreateModal(false);

      setNotification({
        type: "success",
        message: "Doctor created successfully!"
      });
      // showToast('Doctor created successfully!', 'success');
      fetchDoctor(currentPage);
    } catch (error: any) {
      console.error("Error creating doctor:", error);
      setNotification({
        type: "error",
        message: `Failed to create doctor ${error.message}`
      });
      // showToast('Failed to create doctor', 'error');
    } finally {
      setUploading(false); // Add this if you have uploading state
    }
  };

  const handleUpdateDoctor = async () => {
    if (!selectedDoctor) return;

    try {
      setUploading(true); // Add this if you have uploading state

      let profilePicUrl = selectedDoctor.profile_pic;
      let government_document = selectedDoctor.government_document || [];

      // Upload new files if they exist
      if (newDoctor.profile_pic_file || (newDoctor.govt_verification_doc_files && newDoctor.govt_verification_doc_files.length > 0)) {
        const { profilePicUrl: newProfilePicUrl, govtDocUrls } = await uploadDoctorFiles(
          newDoctor.profile_pic_file,
          newDoctor.govt_verification_doc_files || []
        );

        // Use new profile pic URL if uploaded
        if (newProfilePicUrl) {
          profilePicUrl = newProfilePicUrl;
        }

        // Add new govt docs if uploaded
        if (govtDocUrls.length > 0) {
          government_document = [...government_document, ...govtDocUrls];
        }
      }

      // Prepare the payload for API
      const payload = {
        name: newDoctor.name,
        dob: newDoctor.dob,
        gender: newDoctor.gender,
        specializaton: newDoctor.specializaton,
        experience: parseInt(newDoctor.experience),
        phone_number: newDoctor.phone_number,
        email: newDoctor.email,
        education: newDoctor.education,
        extra_info: newDoctor.additional_info,
        profile_pic: profilePicUrl,
        government_document: government_document,
      };

      await editDoctor(selectedDoctor.uuid, payload as any);
      await fetchDoctor();

      closeModal();
      fetchDoctor(currentPage)
      setNotification({
        type: "success",
        message: "Doctor updated successfully!"
      });
      // showToast('Doctor updated successfully!', 'success');
    } catch (error: any) {
      console.error("Error updating doctor:", error);
      setNotification({
        type: "error",
        message: `Failed to updating doctor: ${error.message}`
      });
      // showToast('Failed to update doctor', 'error');
    } finally {
      setUploading(false); // Add this if you have uploading state
    }
  };

  const handleDeleteDoctor = async () => {
    if (!selectedDoctor) return;

    try {
      // Call API
      await deleteDoctor(selectedDoctor.uuid);

      // Update local state
      setDoctors(doctors.filter(d => d.uuid !== selectedDoctor.uuid));
      closeModal();
      setNotification({
        type: "success",
        message: "Doctor deleted successfully!"
      });
      // showToast('Doctor deleted successfully!', 'success');
      fetchDoctor(currentPage)
    } catch (error: any) {
      console.error("Error deleting doctor:", error);
      setNotification({
        type: "error",
        message: `Failed to  deleting doctor: ${error.message}`
      });
      // showToast('Failed to delete doctor', 'error');
    }
  };

  // Modal handlers
  const handleViewDoctor = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setModalMode('view');
  };

  const handleEditDoctor = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setNewDoctor({
      clinic_service: doctor.clinic_service,
      name: doctor.name,
      dob: doctor.dob || '',
      gender: doctor.gender,
      specializaton: doctor.specializaton,
      experience: doctor.experience?.toString() || '',
      phone_number: doctor.phone_number,
      email: doctor.email || '',
      education: doctor.education || '',
      additional_info: doctor.extra_info || '',
      profile_pic_file: null,
      govt_verification_doc_files: [],
    });
    setModalMode('edit');
  };

  const handleDeleteConfirm = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setModalMode('delete');
  };

  const closeModal = () => {
    setModalMode(null);
    setSelectedDoctor(null);
    setShowCreateModal(false);
    resetForm();
  };

  const resetForm = () => {
    setNewDoctor({
      clinic_service: '',
      name: '',
      dob: '',
      gender: 'MALE',
      specializaton: '',
      experience: '',
      phone_number: '',
      email: '',
      education: '',
      additional_info: '',
      profile_pic_file: null,
      govt_verification_doc_files: [],
    });
    setImageError('');
    setGovtDocError('');
    setGovtDocHelper('');
  };

  // Update resetFilters to reset API calls
  const resetFilters = () => {
    setSearchTerm('');
    setStatusFilter('');
    setServiceFilter('');
    setGenderFilter('');
    setSpecializationFilter('');
    setCurrentPage(1);

    // Fetch with empty filters
    fetchDoctor(1, '', '', '', '', '');
  };

  // Image file handler for Doctor Image upload
  function handleImageFile(file: File) {
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
      setImageError('Only JPG, PNG, or WEBP images are allowed.');
      setNewDoctor(prev => ({ ...prev, profile_pic_file: null }));
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setImageError('Image size must be less than 2MB.');
      setNewDoctor(prev => ({ ...prev, profile_pic_file: null }));
      return;
    }
    setImageError('');
    setNewDoctor(prev => ({ ...prev, profile_pic_file: file }));
  }

  function handleGovtDocFile(file: File) {
    const validTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
      setGovtDocError('Only PDF, JPG, PNG, or WEBP files are allowed.');
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setGovtDocError('File size must be less than 2MB.');
      return;
    }
    setGovtDocError('');
    setGovtDocHelper('');
    setNewDoctor(prev => {
      const currentFiles = prev.govt_verification_doc_files || [];
      if (currentFiles.length >= MAX_GOVT_DOC_FILES) {
        setGovtDocError(`You can only upload up to ${MAX_GOVT_DOC_FILES} files.`);
        return prev;
      }
      return { ...prev, govt_verification_doc_files: [...currentFiles, file] };
    });
  }
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
    <>
      <div className="min-h-screen ">
        {/* Header Section */}
        <div className="bg-white/80 backdrop-blur-xl ">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between py-6 space-y-4 lg:space-y-0">
              {/* Title Section */}
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg">
                  <Stethoscope className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700 bg-clip-text text-transparent">
                    Doctor Management
                  </h1>
                  <p className="text-sm text-slate-500 mt-1 font-medium">
                    Manage your clinic doctors efficiently
                  </p>
                </div>
              </div>

              {/* Add Doctor Button */}
              <button
                onClick={() => setShowCreateModal(true)}
                className="group relative inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 font-semibold max-w-fit"
              >
                <div className="absolute inset-0 bg-white/20 rounded-2xl transform scale-0 group-hover:scale-100 transition-transform duration-300"></div>
                <Plus className="w-5 h-5 mr-3 relative z-10" />
                <span className="relative z-10">Add New Doctor</span>
              </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 pb-6">
              <div className="bg-gradient-to-br from-white to-blue-50/50 rounded-2xl p-5 border border-blue-100/60 shadow-sm hover:shadow-md transition-shadow duration-300">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
                    <Users className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-blue-600/80">Total Doctors</p>
                    <p className="text-2xl font-bold text-blue-900">{totalDoctors}</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-white to-emerald-50/50 rounded-2xl p-5 border border-emerald-100/60 shadow-sm hover:shadow-md transition-shadow duration-300">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl shadow-lg">
                    <UserCheck className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-emerald-600/80">Approved</p>
                    <p className="text-2xl font-bold text-emerald-900">{approvedDoctors}</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-white to-amber-50/50 rounded-2xl p-5 border border-amber-100/60 shadow-sm hover:shadow-md transition-shadow duration-300">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl shadow-lg">
                    <Clock className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-amber-600/80">Pending</p>
                    <p className="text-2xl font-bold text-amber-900">{pendingDoctors}</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-white to-red-50/50 rounded-2xl p-5 border border-red-100/60 shadow-sm hover:shadow-md transition-shadow duration-300">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-gradient-to-br from-red-500 to-red-600 rounded-xl shadow-lg">
                    <UserX className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-red-600/80">Rejected</p>
                    <p className="text-2xl font-bold text-red-900">{rejectedDoctors}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto ">
          {/* Filters Section */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-slate-200/60 shadow-sm p-6 mb-8">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
              {/* Search Bar */}
              <div className="lg:col-span-2">
                <label className="text-sm font-semibold text-slate-700 mb-2 ml-1 block">Search Doctors</label>
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search by name, specialization, or phone..."
                    value={searchTerm}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all duration-200 text-slate-700 placeholder-slate-400 shadow-sm"
                  />
                </div>
              </div>

              {/* Status Filter */}
              <div>
                <label className="text-sm font-semibold text-slate-700 mb-2 ml-1 block">Filter by Status</label>
                <select
                  value={statusFilter}
                  onChange={(e) => handleStatusFilterChange(e.target.value)}
                  className="w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-white text-slate-700 focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all duration-200 shadow-sm"
                >
                  <option value="">All Status</option>
                  <option value="APPROVED">Approved</option>
                  <option value="DRAFT">Draft</option>
                  <option value="REJECTED">Rejected</option>
                </select>
              </div>

              {/* Reset Filters */}
              <div className="flex flex-col justify-end">
                <button
                  onClick={resetFilters}
                  className="px-6 py-3.5 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white font-semibold hover:from-slate-700 hover:to-slate-800 transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  Reset Filters
                </button>
              </div>
            </div>
          </div>

          {/* Doctors Grid */}
          {paginatedDoctors?.length === 0 ? (
            <div className="text-center py-16 bg-white/50 rounded-3xl border border-slate-200/60 shadow-sm">
              <div className="max-w-md mx-auto">
                <div className="relative inline-block mb-6">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-2xl"></div>
                  <div className="relative p-4 bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl">
                    <Stethoscope className="w-12 h-12 text-slate-400" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-3">No doctors found</h3>
                <p className="text-slate-500 text-base mb-8">
                  Try adjusting your search criteria or add your first doctor to get started
                </p>
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl font-semibold hover:scale-105"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Add Your First Doctor
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
                {paginatedDoctors?.map((doctor) => {
                  const statusConfig = getStatusConfig(doctor.status);
                  const StatusIcon = statusConfig.icon;

                  return (
                    <div key={doctor.uuid} className="group">
                      <div className="relative bg-white rounded-2xl border border-slate-200/60 hover:border-blue-200 transition-all duration-300 shadow-sm hover:shadow-xl overflow-hidden">
                        {/* Status Ribbon */}
                        <div className={`absolute top-4 right-4 z-10 ${statusConfig.color} px-3 py-1.5 rounded-full text-xs font-bold backdrop-blur-sm`}>
                          <StatusIcon className="w-3 h-3 mr-1 inline" />
                          {doctor.status}
                        </div>

                        <div className="p-6">
                          {/* Doctor Header */}
                          <div className="flex items-start space-x-3 mb-6">
                            <div className="flex-shrink-0">
                              {doctor?.profile_pic ? (
                                <img src={doctor?.profile_pic} alt={doctor.name} className="h-20 w-20 object-cover rounded-xl border border-slate-200" />
                              ) : (
                                <div className="h-20 w-20 flex items-center justify-center rounded-xl bg-slate-200 text-slate-400 text-3xl font-bold">
                                  {doctor.name.charAt(0)}
                                </div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors truncate">
                                {doctor.name}
                              </h3>
                              <p className="text-sm text-slate-600 font-medium capitalize mt-1">
                                {doctor.specializaton}
                              </p>
                            </div>
                          </div>

                          {/* Doctor Information */}
                          <div className="space-y-3 mb-6">
                            <div className="flex items-center text-sm text-slate-700">
                              <MapPin className="w-4 h-4 mr-3 text-slate-400 flex-shrink-0" />
                              <span className="truncate">{getServiceName(doctor.clinic_service)}</span>
                            </div>
                            {doctor.phone_number && (
                              <div className="flex items-center text-sm text-slate-700">
                                <Phone className="w-4 h-4 mr-3 text-slate-400 flex-shrink-0" />
                                <span>{doctor.phone_number}</span>
                              </div>
                            )}
                            {doctor.email && (
                              <div className="flex items-center text-sm text-slate-700">
                                <Mail className="w-4 h-4 mr-3 text-slate-400 flex-shrink-0" />
                                <span className="truncate">{doctor.email}</span>
                              </div>
                            )}
                            <div className="flex items-center text-sm text-slate-700">
                              <Calendar className="w-4 h-4 mr-3 text-slate-400 flex-shrink-0" />
                              <span>{calculateAge(doctor.dob)} • {doctor.gender}</span>
                            </div>
                          </div>

                          {/* Experience Badge */}
                          {doctor.experience && (
                            <div className="mb-6">
                              <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-emerald-500 to-green-500 text-white rounded-xl shadow-lg">
                                <span className="text-lg font-bold mr-2">{doctor.experience}</span>
                                <span className="text-sm font-medium">Years Experience</span>
                              </div>
                            </div>
                          )}

                          {/* Rejection Reason */}
                          {doctor.status === 'REJECTED' && doctor.reason_for_rejection && (
                            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                              <p className="text-xs font-semibold text-red-600 mb-1">Rejection Reason</p>
                              <p className="text-sm text-red-700">{doctor.reason_for_rejection}</p>
                            </div>
                          )}

                          {/* Action Buttons */}
                          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                            <div className="text-xs text-slate-500 font-medium">
                              ID: {doctor.uuid.slice(0, 8)}...
                            </div>
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => handleViewDoctor(doctor)}
                                className="p-2.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-200 hover:scale-110"
                                title="View Details"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleEditDoctor(doctor)}
                                className="p-2.5 text-slate-500 hover:text-green-600 hover:bg-green-50 rounded-xl transition-all duration-200 hover:scale-110"
                                title="Edit Doctor"
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteConfirm(doctor)}
                                className="p-2.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200 hover:scale-110"
                                title="Delete Doctor"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex flex-wrap justify-center items-center gap-3 mt-12">
                  <button
                    onClick={() => {
                      const nextPage = Math.max(1, currentPage - 1);
                      if (nextPage !== currentPage) {
                        setCurrentPage(nextPage);
                        fetchDoctor(nextPage, searchTerm, statusFilter, serviceFilter, genderFilter, specializationFilter);
                      }
                    }}
                    disabled={currentPage === 1}
                    className="px-5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 font-semibold disabled:opacity-50 hover:bg-slate-50 transition-all duration-200 shadow-sm"
                  >
                    Previous
                  </button>

                  <div className="flex items-center space-x-2">
                    {Array.from({ length: totalPages }, (_, i) => (
                      <button
                        key={i}
                        onClick={() => {
                          setCurrentPage(i + 1);
                          fetchDoctor(i + 1, searchTerm, statusFilter, serviceFilter, genderFilter, specializationFilter);
                        }}
                        className={`w-10 h-10 rounded-xl border font-semibold transition-all duration-200 ${currentPage === i + 1
                          ? 'bg-gradient-to-br from-blue-600 to-indigo-600 text-white border-blue-600 shadow-lg'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 shadow-sm'
                          }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => {
                      const nextPage = Math.min(totalPages, currentPage + 1);
                      if (nextPage !== currentPage) {
                        setCurrentPage(nextPage);
                        fetchDoctor(nextPage, searchTerm, statusFilter, serviceFilter, genderFilter, specializationFilter);
                      }
                    }}
                    disabled={currentPage === totalPages}
                    className="px-5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 font-semibold disabled:opacity-50 hover:bg-slate-50 transition-all duration-200 shadow-sm"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Create/Edit/View Doctor Modal */}
      {(showCreateModal || modalMode === 'edit' || modalMode === 'view') && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white/95 backdrop-blur-xl rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto hide-scrollbar  border border-white/20 shadow-2xl relative">
            {/* Close Button */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 text-slate-500 hover:text-slate-900 transition"
              aria-label="Close"
            >
              <X className="w-6 h-6" />
            </button>
            <div className="p-8">
              {modalMode === 'view' ? (
                // VIEW DOCTOR MODAL
                <>
                  <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Eye className="w-8 h-8 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">Doctor Details</h2>
                    <p className="text-slate-500">View doctor information</p>
                  </div>
                  {selectedDoctor && (
                    <div className="space-y-8">
                      {/* Summary Card */}
                      <div className="flex items-center gap-6 bg-blue-50 border border-blue-100 rounded-2xl p-6 mb-4">
                        <div>
                          {selectedDoctor.profile_pic ? (
                            <img src={selectedDoctor.profile_pic} alt={selectedDoctor.name} className="h-20 w-20 object-cover rounded-xl border border-slate-200" />
                          ) : (
                            <div className="h-20 w-20 flex items-center justify-center rounded-xl bg-slate-200 text-slate-400 text-3xl font-bold">
                              {selectedDoctor.name.charAt(0)}
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-1">
                            <span className="text-2xl font-bold text-slate-900">{selectedDoctor.name}</span>
                            <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold border ${getStatusConfig(selectedDoctor.status).color}`} title={selectedDoctor.status.charAt(0) + selectedDoctor.status.slice(1).toLowerCase()}>
                              {React.createElement(getStatusConfig(selectedDoctor.status).icon, { className: 'w-3 h-3 mr-1' })}
                              {selectedDoctor.status}
                            </span>
                          </div>
                          <div className="text-blue-700 font-semibold text-lg capitalize">{selectedDoctor.specializaton}</div>
                          <div className="text-slate-600 text-sm">{selectedDoctor.experience ? `${selectedDoctor.experience} years experience` : 'Experience: N/A'}</div>
                        </div>
                      </div>
                      {/* Section: Personal Info */}
                      <div>
                        <h3 className="text-blue-700 font-semibold text-lg mb-2">Personal Information</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="text-xs font-semibold text-slate-600 mb-1 ml-1 block">Date of Birth</label>
                            <div className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-700">{selectedDoctor.dob || 'N/A'}</div>
                          </div>
                          <div>
                            <label className="text-xs font-semibold text-slate-600 mb-1 ml-1 block">Gender</label>
                            <div className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 capitalize flex items-center gap-2"><span>{selectedDoctor.gender}</span></div>
                          </div>
                        </div>
                      </div>
                      {/* Section: Contact Info */}
                      <div>
                        <h3 className="text-blue-700 font-semibold text-lg mb-2">Contact Information</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="text-xs font-semibold text-slate-600 mb-1 ml-1 block">Phone Number</label>
                            <div className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 flex items-center gap-2"><Phone className="w-4 h-4 text-blue-400" />{selectedDoctor.phone_number}</div>
                          </div>
                          <div>
                            <label className="text-xs font-semibold text-slate-600 mb-1 ml-1 block">Email</label>
                            <div className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 flex items-center gap-2"><Mail className="w-4 h-4 text-blue-400" />{selectedDoctor.email || 'N/A'}</div>
                          </div>
                        </div>
                      </div>
                      {/* Section: Professional Info */}
                      <div>
                        <h3 className="text-blue-700 font-semibold text-lg mb-2">Professional Information</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="text-xs font-semibold text-slate-600 mb-1 ml-1 block">Specialization</label>
                            <div className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 capitalize">{selectedDoctor.specializaton}</div>
                          </div>
                          <div>
                            <label className="text-xs font-semibold text-slate-600 mb-1 ml-1 block">Experience</label>
                            <div className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-700">{selectedDoctor.experience ? `${selectedDoctor.experience} years` : 'N/A'}</div>
                          </div>
                          <div className="sm:col-span-2">
                            <label className="text-xs font-semibold text-slate-600 mb-1 ml-1 block">Education</label>
                            <div className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-700">{selectedDoctor.education || 'N/A'}</div>
                          </div>
                          <div className="sm:col-span-2">
                            <label className="text-xs font-semibold text-slate-600 mb-1 ml-1 block">Clinic Service</label>
                            <div className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-700">{getServiceName(selectedDoctor.clinic_service)}</div>
                          </div>
                        </div>
                      </div>
                      {/* Section: Status & Rejection Reason */}
                      <div>
                        <h3 className="text-blue-700 font-semibold text-lg mb-2">Status</h3>
                        <div className="flex items-center gap-3 mb-2">
                          <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold border ${getStatusConfig(selectedDoctor.status).color}`} title={selectedDoctor.status.charAt(0) + selectedDoctor.status.slice(1).toLowerCase()}>
                            {React.createElement(getStatusConfig(selectedDoctor.status).icon, { className: 'w-3 h-3 mr-1' })}
                            {selectedDoctor.status}
                          </span>
                        </div>
                        {selectedDoctor.status === 'REJECTED' && selectedDoctor.reason_for_rejection && (
                          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-xs text-red-600 font-medium">Rejection Reason:</p>
                            <p className="text-sm text-red-700">{selectedDoctor.reason_for_rejection}</p>
                          </div>
                        )}
                      </div>
                      {/* Section: Verification Documents */}
                      <div>
                        <h3 className="text-blue-700 font-semibold text-lg mb-2">Verification Documents</h3>
                        <p className="text-xs text-blue-700 mb-2">Uploaded government-issued documents for identity and credential verification.</p>
                        {/* // In the view modal section, update the verification documents display */}
                        {selectedDoctor.government_document && selectedDoctor.government_document.length > 0 ? (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {selectedDoctor.government_document.map((url, idx) => {
                              const fileName = url.split('/').pop() || `document-${idx + 1}`;
                              const isPdf = fileName.toLowerCase().endsWith('.pdf');

                              return (
                                <div key={idx} className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg p-2">
                                  {isPdf ? (
                                    <svg className="w-6 h-6 text-red-500 mr-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                                    </svg>
                                  ) : (
                                    <img src={url} alt={fileName} className="h-10 w-10 object-cover rounded border border-slate-200" />
                                  )}
                                  <span className="text-blue-700 font-semibold text-sm truncate max-w-[100px]">{fileName}</span>
                                  <button
                                    type="button"
                                    className="text-xs text-blue-600 hover:underline ml-2"
                                    title="View document"
                                    onClick={() => setPreviewDoc({
                                      url: url,
                                      type: isPdf ? 'pdf' : 'image',
                                      name: fileName
                                    })}
                                  >
                                    View
                                  </button>
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          <div className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-400">No documents uploaded</div>
                        )}
                      </div>
                      {/* Section: Additional Info */}
                      <div>
                        <h3 className="text-blue-700 font-semibold text-lg mb-2">Additional Info</h3>
                        <div className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 whitespace-pre-line">{selectedDoctor.extra_info || 'N/A'}</div>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                // CREATE/EDIT DOCTOR MODAL
                <>
                  <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Plus className="w-8 h-8 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">
                      {modalMode === 'edit' ? 'Edit Doctor' : 'Add New Doctor'}
                    </h2>
                    <p className="text-slate-500">
                      {modalMode === 'edit' ? 'Update doctor information' : 'Fill in the details to add a new doctor'}
                    </p>
                  </div>
                  <form onSubmit={modalMode === 'edit' ? handleUpdateDoctorEnhanced : handleCreateDoctorEnhanced}>
                    {/* Personal Info Section */}
                    <div className="mb-4">
                      <h3 className="text-lg font-semibold text-blue-700 mb-2">Personal Information</h3>
                      <div className="grid gap-4 md:grid-cols-2">
                        {/* Doctor Image Upload */}
                        <div className="md:col-span-2">
                          <label className="text-xs font-semibold text-slate-600 mb-1 ml-1 block">Doctor Image <span className='text-slate-400'>(JPG, PNG, WEBP, &lt;2MB)</span></label>
                          <div
                            className={`flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-4 transition-all duration-200 cursor-pointer ${newDoctor.profile_pic_file ? 'border-blue-400 bg-blue-50/30' : 'border-slate-200 bg-white/80'} hover:border-blue-400`}
                            onClick={() => document.getElementById('doctor-image-upload')?.click()}
                            onDragOver={e => { e.preventDefault(); e.stopPropagation(); }}
                            onDrop={e => {
                              e.preventDefault();
                              const file = e.dataTransfer.files && e.dataTransfer.files[0];
                              if (file) handleImageFile(file);
                            }}
                            style={{ minHeight: '120px' }}
                          >
                            {newDoctor.profile_pic_file ? (
                              <div className="flex flex-col items-center w-full">
                                <img
                                  src={URL.createObjectURL(newDoctor.profile_pic_file)}
                                  alt="Preview"
                                  className="h-28 w-28 object-cover rounded-lg border border-slate-200 shadow mb-2"
                                />
                                <button
                                  type="button"
                                  className="text-xs text-red-600 hover:underline mt-1"
                                  onClick={e => {
                                    e.stopPropagation();
                                    setNewDoctor({ ...newDoctor, profile_pic_file: null });
                                    setImageError('');
                                  }}
                                >Remove Image</button>
                              </div>
                            ) : (
                              <>
                                <span className="text-slate-400 text-sm mb-2">Drag & drop or click to upload</span>
                                <span className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-semibold cursor-pointer hover:bg-blue-700 transition">Select Image</span>
                              </>
                            )}
                            <input
                              id="doctor-image-upload"
                              type="file"
                              accept="image/jpeg,image/png,image/webp,image/jpg"
                              className="hidden"
                              onChange={e => {
                                const file = e.target.files && e.target.files[0];
                                if (file) handleImageFile(file);
                              }}
                            />
                          </div>
                          <span className="text-xs text-slate-400 block mt-1">Accepted: JPG, PNG, WEBP. Max size: 2MB.</span>
                          {(formErrors.profile_pic_file || imageError) && <p className="text-xs text-red-500 mt-1">{formErrors.profile_pic_file || imageError}</p>}
                        </div>
                        {/* Name */}
                        <div>
                          <label className="text-xs font-semibold text-slate-600 mb-1 ml-1 block">Name *</label>
                          <input
                            type="text"
                            placeholder="e.g. Dr. John Doe"
                            value={newDoctor.name}
                            onChange={(e) => setNewDoctor({ ...newDoctor, name: e.target.value })}
                            className={`w-full px-4 py-3 bg-white/80 border ${formErrors.name ? 'border-red-400' : 'border-slate-200'} rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all duration-200 text-slate-700 placeholder-slate-400`}
                          />
                          {formErrors.name && <p className="text-xs text-red-500 mt-1">{formErrors.name}</p>}
                        </div>
                        <div>
                          <label className="text-xs font-semibold text-slate-600 mb-1 ml-1 block">Date of Birth *</label>
                          <DatePicker
                            selected={newDoctor.dob ? new Date(newDoctor.dob) : null}
                            onChange={(date: Date | null) => setNewDoctor({ ...newDoctor, dob: date ? date.toISOString().slice(0, 10) : '' })}
                            dateFormat="yyyy-MM-dd"
                            placeholderText="Select date of birth"
                            className={`w-full px-4 py-3 bg-white/80 border ${formErrors.dob ? 'border-red-400' : 'border-slate-200'} rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all duration-200 text-slate-700 placeholder-slate-400`}
                            maxDate={new Date()}
                            showMonthDropdown
                            showYearDropdown
                            dropdownMode="select"
                            isClearable
                          />
                          {formErrors.dob && <p className="text-xs text-red-500 mt-1">{formErrors.dob}</p>}
                        </div>
                        <div>
                          <label className="text-xs font-semibold text-slate-600 mb-1 ml-1 block">Gender *</label>
                          <select
                            value={newDoctor.gender}
                            onChange={(e) => setNewDoctor({ ...newDoctor, gender: e.target.value as 'MALE' | 'FEMALE' | 'OTHER' })}
                            className={`w-full px-4 py-3 bg-white/80 border ${formErrors.gender ? 'border-red-400' : 'border-slate-200'} rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all duration-200 text-slate-700 placeholder-slate-400`}
                          >
                            <option value="MALE">Male</option>
                            <option value="FEMALE">Female</option>
                            <option value="OTHER">Other</option>
                          </select>
                          {formErrors.gender && <p className="text-xs text-red-500 mt-1">{formErrors.gender}</p>}
                        </div>
                        {/* Education */}
                        <div>
                          <label className="text-xs font-semibold text-slate-600 mb-1 ml-1 block">Education *</label>
                          <input
                            type="text"
                            placeholder="e.g. MBBS, MD, BPT, MPT"
                            value={newDoctor.education}
                            onChange={e => setNewDoctor({ ...newDoctor, education: e.target.value })}
                            className={`w-full px-4 py-3 bg-white/80 border ${formErrors.education ? 'border-red-400' : 'border-slate-200'} rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all duration-200 text-slate-700 placeholder-slate-400`}
                          />
                          {formErrors.education && <p className="text-xs text-red-500 mt-1">{formErrors.education}</p>}
                        </div>
                      </div>
                    </div>
                    {/* Contact Info Section */}
                    <div className="mb-4">
                      <h3 className="text-lg font-semibold text-blue-700 mb-2">Contact Information</h3>
                      <div className="grid gap-4 md:grid-cols-2">
                        <div>
                          <label className="text-xs font-semibold text-slate-600 mb-1 ml-1 block">Phone Number *</label>
                          <input
                            type="text"
                            placeholder="e.g. 9876543210"
                            value={newDoctor.phone_number}
                            onChange={(e) => setNewDoctor({ ...newDoctor, phone_number: e.target.value })}
                            className={`w-full px-4 py-3 bg-white/80 border ${formErrors.phone_number ? 'border-red-400' : 'border-slate-200'} rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all duration-200 text-slate-700 placeholder-slate-400`}
                            maxLength={10}
                          />
                          <p className="text-xs text-slate-400 mt-1">Enter a 10-digit phone number</p>
                          {formErrors.phone_number && <p className="text-xs text-red-500 mt-1">{formErrors.phone_number}</p>}
                        </div>
                        <div>
                          <label className="text-xs font-semibold text-slate-600 mb-1 ml-1 block">Email *</label>
                          <input
                            type="email"
                            placeholder="e.g. doctor@email.com"
                            value={newDoctor.email}
                            onChange={(e) => setNewDoctor({ ...newDoctor, email: e.target.value })}
                            className={`w-full px-4 py-3 bg-white/80 border ${formErrors.email ? 'border-red-400' : 'border-slate-200'} rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all duration-200 text-slate-700 placeholder-slate-400`}
                          />
                          {formErrors.email && <p className="text-xs text-red-500 mt-1">{formErrors.email}</p>}
                        </div>
                      </div>
                    </div>
                    {/* Professional Info Section */}
                    <div className="mb-4">
                      <h3 className="text-lg font-semibold text-blue-700 mb-2">Professional Information</h3>
                      <div className="grid gap-4 md:grid-cols-2">
                        <div>
                          <label className="text-xs font-semibold text-slate-600 mb-1 ml-1 block">Specialization *</label>
                          <input
                            type="text"
                            placeholder="e.g. Cardiologist, Dermatologist"
                            value={newDoctor.specializaton}
                            onChange={(e) => setNewDoctor({ ...newDoctor, specializaton: e.target.value })}
                            className={`w-full px-4 py-3 bg-white/80 border ${formErrors.specializaton ? 'border-red-400' : 'border-slate-200'} rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all duration-200 text-slate-700 placeholder-slate-400`}
                          />
                          {formErrors.specializaton && <p className="text-xs text-red-500 mt-1">{formErrors.specializaton}</p>}
                        </div>
                        <div>
                          <label className="text-xs font-semibold text-slate-600 mb-1 ml-1 block">Experience (years) *</label>
                          <input
                            type="number"
                            min="0"
                            placeholder="e.g. 5"
                            value={newDoctor.experience}
                            onChange={(e) => setNewDoctor({ ...newDoctor, experience: e.target.value })}
                            className={`w-full px-4 py-3 bg-white/80 border ${formErrors.experience ? 'border-red-400' : 'border-slate-200'} rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all duration-200 text-slate-700 placeholder-slate-400`}
                          />
                          {formErrors.experience && <p className="text-xs text-red-500 mt-1">{formErrors.experience}</p>}
                        </div>
                        <div className="md:col-span-2">
                          <label className="text-xs font-semibold text-slate-600 mb-1 ml-1 block">Clinic Service *</label>
                          <select
                            value={newDoctor.clinic_service}
                            onChange={(e) => setNewDoctor({ ...newDoctor, clinic_service: e.target.value })}
                            className={`w-full px-4 py-3 bg-white/80 border ${formErrors.clinic_service ? 'border-red-400' : 'border-slate-200'} rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all duration-200 text-slate-700 placeholder-slate-400`}
                          >
                            <option value="">Select a clinic service</option>
                            {services.map(service => (
                              <option key={service.uuid} value={service.uuid}>{service.service_name}</option>
                            ))}
                          </select>
                          {formErrors.clinic_service && <p className="text-xs text-red-500 mt-1">{formErrors.clinic_service}</p>}
                        </div>
                        {/* Govt. Verification Document Upload */}
                        <div className="md:col-span-2">
                          <div className="mb-2 p-4 bg-blue-50 border border-blue-200 rounded-xl flex flex-col gap-2">
                            <div className="flex items-center gap-2">
                              <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01" /></svg>
                              <span className="font-semibold text-blue-700">Why upload Govt. Verification Documents?</span>
                            </div>
                            <span className="text-xs text-blue-700">These documents are required to verify the identity and credentials of the doctor. Please upload clear scans or photos of official documents.</span>
                            <ul className="list-disc list-inside text-xs text-blue-700 mt-1">
                              <li>Aadhaar Card</li>
                              <li>PAN Card</li>
                              <li>Medical License</li>
                              <li>Other government-issued ID</li>
                              <li>Degree/Certificate</li>
                            </ul>
                            <div className="flex items-center gap-2 mt-2">
                              <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V4a2 2 0 10-4 0v1.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                              <span className="text-xs text-blue-500">Accepted: PDF, JPG, PNG, WEBP. Max size: 2MB. Up to 5 files.</span>
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                              <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                              <span className="text-xs text-green-700">Your documents are securely stored and only used for verification purposes.</span>
                            </div>
                          </div>
                          <label className="text-xs font-semibold text-slate-600 mb-1 ml-1 block">Govt. Verification Document (optional) <span className='text-slate-400'>(PDF, JPG, PNG, WEBP, &lt;2MB, up to 5 files)</span></label>
                          <div
                            className={`flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-4 transition-all duration-200 cursor-pointer ${newDoctor.govt_verification_doc_files && newDoctor.govt_verification_doc_files.length > 0 ? 'border-blue-400 bg-blue-50/30' : 'border-slate-200 bg-white/80'} hover:border-blue-400`}
                            onClick={() => document.getElementById('govt-doc-upload')?.click()}
                            onDragOver={e => { e.preventDefault(); e.stopPropagation(); }}
                            onDrop={e => {
                              e.preventDefault();
                              const files = Array.from(e.dataTransfer.files);
                              files.forEach(file => handleGovtDocFile(file));
                            }}
                            style={{ minHeight: '100px', borderStyle: 'dashed', position: 'relative' }}
                          >
                            <span className="absolute top-2 right-4 text-xs text-slate-400">{newDoctor.govt_verification_doc_files?.length || 0}/{MAX_GOVT_DOC_FILES}</span>
                            {newDoctor.govt_verification_doc_files && newDoctor.govt_verification_doc_files.length > 0 ? (
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
                                {newDoctor.govt_verification_doc_files.map((file, idx) => (
                                  <div key={idx} className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg p-2">
                                    {file.type === 'application/pdf' ? (
                                      <span className="inline-flex items-center"><svg className="w-6 h-6 text-red-500 mr-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>PDF</span>
                                    ) : (
                                      <img
                                        src={URL.createObjectURL(file)}
                                        alt="Preview"
                                        className="h-10 w-10 object-cover rounded border border-slate-200"
                                      />
                                    )}
                                    <span className="truncate text-xs font-medium text-slate-700 max-w-[100px]">{file.name}</span>
                                    <button
                                      type="button"
                                      className="text-xs text-red-600 hover:underline ml-2"
                                      onClick={e => {
                                        e.stopPropagation();
                                        setNewDoctor(prev => ({
                                          ...prev,
                                          govt_verification_doc_files: prev.govt_verification_doc_files?.filter((_, i) => i !== idx) || [],
                                        }));
                                      }}
                                    >Remove</button>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <>
                                <span className="text-slate-400 text-sm mb-2">Drag & drop or click to upload</span>
                                <span className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-semibold cursor-pointer hover:bg-blue-700 transition">Select Files</span>
                              </>
                            )}
                            <input
                              id="govt-doc-upload"
                              type="file"
                              accept="application/pdf,image/jpeg,image/png,image/webp,image/jpg"
                              className="hidden"
                              multiple
                              onChange={e => {
                                const files = e.target.files ? Array.from(e.target.files) : [];
                                files.forEach(file => handleGovtDocFile(file));
                              }}
                            />
                          </div>
                          <button
                            type="button"
                            className={`mt-3 w-full px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold shadow hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 ${newDoctor.govt_verification_doc_files && newDoctor.govt_verification_doc_files.length >= MAX_GOVT_DOC_FILES ? 'opacity-60 cursor-not-allowed' : ''}`}
                            onClick={() => document.getElementById('govt-doc-upload')?.click()}
                            disabled={!!(newDoctor.govt_verification_doc_files && newDoctor.govt_verification_doc_files.length >= MAX_GOVT_DOC_FILES)}
                            title={newDoctor.govt_verification_doc_files && newDoctor.govt_verification_doc_files.length >= MAX_GOVT_DOC_FILES ? `Maximum ${MAX_GOVT_DOC_FILES} files allowed` : 'Upload more documents'}
                          >
                            Upload Documents
                          </button>
                          <span className="text-xs text-slate-400 block mt-1">Accepted: PDF, JPG, PNG, WEBP. Max size: 2MB. You can upload up to 5 files.</span>
                          {govtDocError && <p className="text-xs text-red-500 mt-1">{govtDocError}</p>}
                          {govtDocHelper && !govtDocError && <p className="text-xs text-slate-400 mt-1">{govtDocHelper}</p>}
                        </div>
                        {/* Additional Info */}
                        <div className="md:col-span-2">
                          <label className="text-xs font-semibold text-slate-600 mb-1 ml-1 block">Additional Info</label>
                          <textarea
                            placeholder="e.g. More about experience, specialization, etc."
                            value={newDoctor.additional_info}
                            onChange={e => setNewDoctor({ ...newDoctor, additional_info: e.target.value })}
                            className="w-full px-4 py-3 bg-white/80 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all duration-200 text-slate-700 placeholder-slate-400 min-h-[60px]"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="mt-8 flex flex-col sm:flex-row justify-end gap-3">
                      <button
                        type="button"
                        onClick={resetFormEnhanced}
                        className="px-6 py-2 rounded-xl bg-gradient-to-r from-slate-200 to-slate-100 text-slate-700 font-semibold border border-slate-300 hover:from-slate-300 hover:to-slate-200 transition-all duration-200"
                      >
                        Clear
                      </button>
                      <button
                        type="submit"
                        disabled={uploading}
                        className={`px-6 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold border border-slate-300 transition-all duration-200 ${uploading
                          ? 'opacity-50 cursor-not-allowed'
                          : 'hover:from-blue-700 hover:to-indigo-700'
                          }`}
                      >
                        {uploading ? (
                          <div className="flex items-center justify-center">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            {modalMode === 'edit' ? 'Updating...' : 'Creating...'}
                          </div>
                        ) : (
                          modalMode === 'edit' ? 'Update Doctor' : 'Add Doctor'
                        )}
                      </button>
                    </div>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Delete Doctor Confirmation Modal */}
      {modalMode === 'delete' && selectedDoctor && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white/95 backdrop-blur-xl rounded-3xl max-w-md w-full border border-white/20 shadow-2xl relative">
            {/* Close Button */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 text-slate-500 hover:text-slate-900 transition"
              aria-label="Close"
            >
              <X className="w-6 h-6" />
            </button>
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Delete Doctor?</h2>
              <p className="text-slate-500 mb-6">Are you sure you want to delete <span className="font-semibold text-red-600">{selectedDoctor.name}</span>? This action cannot be undone.</p>
              <div className="flex justify-center gap-4 mt-4">
                <button
                  onClick={closeModal}
                  className="px-6 py-2 rounded-xl bg-gradient-to-r from-slate-200 to-slate-100 text-slate-700 font-semibold border border-slate-300 hover:from-slate-300 hover:to-slate-200 transition-all duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteDoctor}
                  className="px-6 py-2 rounded-xl bg-gradient-to-r from-red-600 to-pink-600 text-white font-semibold border border-slate-300 hover:from-red-700 hover:to-pink-700 transition-all duration-200"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Extra View Modal for Govt. Docs */}
      {previewDoc && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-auto relative">
            <button
              onClick={() => setPreviewDoc(null)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 text-slate-500 hover:text-slate-900 transition"
              aria-label="Close preview"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
            <div className="p-6 flex flex-col items-center">
              <div className="mb-4 text-center">
                <span className="font-bold text-lg text-slate-800">{previewDoc.name}</span>
              </div>
              {previewDoc.type === 'image' && previewDoc.url && (
                <img src={previewDoc.url} alt={previewDoc.name} className="max-h-[60vh] rounded-xl border border-slate-200" />
              )}
              {previewDoc.type === 'pdf' && previewDoc.url && (
                <iframe src={previewDoc.url} title={previewDoc.name} className="w-full h-[60vh] rounded-xl border border-slate-200" />
              )}
              {previewDoc.type === 'pdf' && !previewDoc.url && (
                <div className="w-full h-[60vh] flex items-center justify-center">
                  <span className="text-slate-500">PDF preview not available. <br /> <a href={`/path/to/pdf/${previewDoc.name}`} download className="text-blue-600 underline">Download</a></span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

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
    </>
  );
}

export default DoctorManagement;