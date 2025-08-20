"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Building2,
  Search,
  Filter,
  MoreVertical,
  Eye,
  Edit,
  Mail,
  Phone,
  Calendar,
  Download,
  Plus,
  MapPin,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  DollarSign,
  RefreshCw,
  Settings,
  X,
  ChevronDown,
  ExternalLink,
  Globe,
  Building,
  Lock,
  Check,
  User,
  ArrowRight,
  ArrowLeft,
  Upload,
  ImageIcon,
  FileText
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  approveOrRejectClinic,
  createClinic,
  createUserForClinic,
  deleteClinic,
  getAllClinic,
  toggleActiveClinic
} from "@/service/admin/clinicManagentService";
import { Call } from "@mui/icons-material";
import { sampleBookings } from "@/components/clinicportal/dues/duesmanagement";
import { uploadFiles } from "@/service/uploadService/uploadService";

interface Clinic {
  uuid: string;
  name: string;
  address: string;
  city: string;
  pincode: string;
  status: "APPROVED" | "Draft" | "Pending" | "REJECTED";
  paymentStatus: "Paid" | "Pending" | "No Dues" | "Overdue";
  dueAmount: string;
  hours: string;
  workingDays: string[];
  contact_number: string;
  country_code: string;
  email: string;
  is_active: boolean;
  mapLink?: string;
  gpsCoordinates?: string;
  openingTime?: string;
  closingTime?: string;
  submissionDate: string;
  documents: string[];
}

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
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

type TimePickerProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

const TimePicker = ({
  value,
  onChange,
  placeholder = "Select time"
}: TimePickerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const generateTimeOptions = () => {
    const times = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute of [0, 30]) {
        const time24 = `${hour.toString().padStart(2, "0")}:${minute
          .toString()
          .padStart(2, "0")}`;
        const hour12 = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
        const ampm = hour >= 12 ? "PM" : "AM";
        const time12 = `${hour12}:${minute
          .toString()
          .padStart(2, "0")} ${ampm}`;
        times.push({ value: time24, label: time12 });
      }
    }
    return times;
  };
  const timeOptions = generateTimeOptions();
  const selectedTime = timeOptions.find((t) => t.value === value);
  return (
    <div className="relative">
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer hover:border-blue-400 transition-all bg-white"
      >
        <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
        <span className={selectedTime ? "text-gray-900" : "text-gray-400"}>
          {selectedTime ? selectedTime.label : placeholder}
        </span>
      </div>
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-50 max-h-60 overflow-y-auto">
          {timeOptions.map((time) => (
            <div
              key={time.value}
              onClick={() => {
                onChange(time.value);
                setIsOpen(false);
              }}
              className={`px-4 py-2 cursor-pointer hover:bg-blue-50 transition-colors ${value === time.value
                ? "bg-blue-100 text-blue-800 font-medium"
                : "text-gray-700"
                }`}
            >
              {time.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

type InputFieldProps = {
  label: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
  error?: string;
  icon?: React.ElementType;
  optional?: boolean;
};

function InputField({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  required = false,
  error,
  icon: Icon,
  optional = false
}: InputFieldProps) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        {label} {required && <span className="text-red-500">*</span>}
        {optional && <span className="text-gray-400 text-xs ml-1">(optional)</span>}
      </label>
      <div className="relative">
        {Icon && (
          <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        )}
        <input
          type={type}
          value={value}
          onChange={onChange}
          className={`w-full ${Icon ? "pl-10" : "pl-4"
            } pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${error ? "border-red-300 focus:ring-red-500" : "border-gray-200"
            }`}
          placeholder={placeholder}
          required={required}
        />
      </div>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}

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

const StatusBadge = ({ status }: { status: Clinic["status"] }) => {
  const statusConfig = {
    APPROVED: {
      color: "bg-green-100 text-green-700",
      icon: CheckCircle
    },
    Draft: {
      color: "bg-gray-100 text-gray-700",
      icon: Edit
    },
    Pending: {
      color: "bg-yellow-100 text-yellow-700",
      icon: Clock
    },
    REJECTED: {
      color: "bg-red-100 text-red-700",
      icon: XCircle
    }
  };

  const config = statusConfig[status];
  const Icon = config?.icon;

  return (
    <span
      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config?.color}`}
    >
      {Icon && <Icon size={12} className="mr-1" />}
      {status}
    </span>
  );
};

const PaymentStatusBadge = ({
  status
}: {
  status: Clinic["paymentStatus"];
}) => {
  const statusConfig = {
    Paid: { color: "bg-green-100 text-green-700" },
    Pending: { color: "bg-yellow-100 text-yellow-700" },
    "No Dues": { color: "bg-blue-100 text-blue-700" },
    Overdue: { color: "bg-red-100 text-red-700" }
  };

  const config = statusConfig[status];

  return (
    <span
      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config?.color}`}
    >
      {status}
    </span>
  );
};

// Stepper component for multi-step form
const Stepper = ({ steps, currentStep }: { steps: string[], currentStep: number }) => {
  return (
    <div className="flex justify-between mb-8 relative">
      <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-200 -translate-y-1/2 -z-10"></div>
      {steps.map((step, index) => (
        <div key={index} className="flex flex-col items-center relative">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep > index
            ? "bg-blue-600 text-white"
            : currentStep === index
              ? "bg-blue-100 border-2 border-blue-600 text-blue-600"
              : "bg-gray-100 text-gray-400"
            } font-semibold text-sm`}>
            {currentStep > index ? <Check size={16} /> : index + 1}
          </div>
          <span className={`text-sm mt-2 font-medium ${currentStep >= index ? "text-blue-600" : "text-gray-500"
            }`}>{step}</span>
        </div>
      ))}
    </div>
  );
};

export default function ClinicManagement() {
  const router = useRouter();
  const [clinics, setClinics] = useState<Clinic[]>([]);

  const [filteredClinics, setFilteredClinics] = useState<Clinic[]>(clinics);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<
    Clinic["status"] | "ALL"
  >("ALL");
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState<
    Clinic["paymentStatus"] | "ALL"
  >("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedClinic, setSelectedClinic] = useState<Clinic | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [paginationData, setPaginationData] = useState({
    current_page: 1,
    total_pages: 1,
    total_items: 0,
    next: null as string | null,
    previous: null as string | null
  });
  const [notification, setNotification] = useState<{
    type: "success" | "error" | "warning";
    message: string;
  } | null>(null);

  // Multi-step form state
  const [currentStep, setCurrentStep] = useState(0);
  const steps = ["Clinic Details", "Create Admin User"];

  // Add Clinic Form State - Step 1
  const [newClinic, setNewClinic] = useState({
    name: "",
    city: "",
    phone: "",
    email: "",
    address: "",
    pincode: "",
    landmark: "",
    mapLink: "",
    gpsCoordinates: "",
    openingTime: "",
    closingTime: "",
    workingDays: [] as string[],
    about_clinic: "",
    gst_no: "",
    images: [] as string[]
  });

  // Add User Form State - Step 2
  const [newUser, setNewUser] = useState({
    clinic: "",
    full_name: "",
    email: "",
    phone_number: "",
    password: ""
  });

  // Add state for confirmation modals
  const [confirmModal, setConfirmModal] = useState<{
    type: "active" | "inactive" | "delete";
    clinic: Clinic | null;
  } | null>(null);

  const workingDayOptions = [
    { value: "Mon", label: "Monday" },
    { value: "Tue", label: "Tuesday" },
    { value: "Wed", label: "Wednesday" },
    { value: "Thu", label: "Thursday" },
    { value: "Fri", label: "Friday" },
    { value: "Sat", label: "Saturday" },
    { value: "Sun", label: "Sunday" }
  ];

  const clinicsListRef = useRef<HTMLDivElement>(null);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const [showDeactivated, setShowDeactivated] = useState(false);
  // Inside your ClinicManagement component, add these states
  const [uploadingFiles, setUploadingFiles] = useState(false);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [selectedRegistrationCertificate, setSelectedRegistrationCertificate] = useState<File | null>(null);
  const [uploadedImageUrls, setUploadedImageUrls] = useState<string[]>([]);
  const [uploadedCertificateUrl, setUploadedCertificateUrl] = useState<string>("");
  const [selectedHeader, setSelectedHeader] = useState<
    "ALL" | "Approved" | "Pending" | "Active" | "Deactivated"
  >("Approved");

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 500); // 500ms debounce

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery]);

  const fetchClinics = async (page = 1, search = '', status = 'ALL', paymentStatus = 'ALL') => {
    setLoading(true);
    try {
      // Prepare query parameters
      const params: any = {
        page_size: itemsPerPage,
        page: page
      };

      // Add search parameter if provided
      if (search) {
        params.search = search;
      }

      // Add status filter if provided
      if (status !== 'ALL') {
        params.status = status;
      }

      // Add payment status filter if provided
      if (paymentStatus !== 'ALL') {
        params.payment_status = paymentStatus;
      }

      // Add header filter if provided
      if (selectedHeader !== 'ALL') {
        if (selectedHeader === 'Approved') {
          params.status = 'APPROVED';
        } else if (selectedHeader === 'Pending') {
          params.status = 'PENDING';
        } else if (selectedHeader === 'Active') {
          params.is_active = true;
        } else if (selectedHeader === 'Deactivated') {
          params.is_active = false;
        }
      }

      const response = await getAllClinic(params);
      setClinics(response.data);
      console.log(response.data, "clinics data");
      setFilteredClinics(response.data);
      setPaginationData({
        current_page: response.current_page,
        total_pages: response.total_pages,
        total_items: response.total_items,
        next: response.next,
        previous: response.previous
      });
    } catch (error) {
      console.error("Failed to fetch clinics:", error);
      setNotification({
        type: "error",
        message: "Failed to load clinics"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClinics(currentPage, debouncedSearchQuery, selectedStatus, selectedPaymentStatus);
  }, [currentPage, itemsPerPage, debouncedSearchQuery, selectedStatus, selectedPaymentStatus, selectedHeader]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= paginationData.total_pages) {
      setCurrentPage(newPage);
    }
  };

  // Filter for header selection
  let clinicsToShow = filteredClinics;
  if (selectedHeader === "Approved")
    clinicsToShow = filteredClinics.filter((c) => c.status === "APPROVED");
  else if (selectedHeader === "Pending")
    clinicsToShow = filteredClinics.filter((c) => c.status === "Pending");
  else if (selectedHeader === "Active")
    clinicsToShow = filteredClinics.filter((c) => c.is_active);
  else if (selectedHeader === "Deactivated")
    clinicsToShow = filteredClinics.filter((c) => !c.is_active);

  // Use server-side pagination data
  // clinicsToShow already contains only the clinics for the current page from the API
  const totalPages = paginationData.total_pages;

  const handleView = (clinic: Clinic) => {
    setSelectedClinic(clinic);
    setIsViewModalOpen(true);
  };

  const handleWorkingDayToggle = (day: string) => {
    setNewClinic((prev) => ({
      ...prev,
      workingDays: prev.workingDays.includes(day)
        ? prev.workingDays.filter((d) => d !== day)
        : [...prev.workingDays, day]
    }));
  };

  const handleSelectAllDays = () => {
    setNewClinic((prev) => ({
      ...prev,
      workingDays: workingDayOptions.map((day) => day.value)
    }));
  };

  const handleSelectWeekdays = () => {
    setNewClinic((prev) => ({
      ...prev,
      workingDays: ["Mon", "Tue", "Wed", "Thu", "Fri"]
    }));
  };

  const handleClearAllDays = () => {
    setNewClinic((prev) => ({
      ...prev,
      workingDays: []
    }));
  };

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Add file input handlers
  const handleImageSelection = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setSelectedImages(prev => [...prev, ...filesArray]);
    }
  };

  const handleCertificateSelection = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedRegistrationCertificate(e.target.files[0]);
    }
  };

  const removeImage = (index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
  }

  const handleAddClinicStep1 = async () => {
    if (
      !newClinic.name ||
      !newClinic.city ||
      !newClinic.email ||
      !newClinic.phone
    ) {
      setNotification({
        type: "error",
        message: "Please fill in all required fields"
      });
      return;
    }

    if (newClinic.workingDays.length === 0) {
      setNotification({
        type: "error",
        message: "Please select at least one working day"
      });
      return;
    }

    setIsSubmitting(true);
    setUploadingFiles(true);
    try {
      // Upload files if any are selected
      let imageUrls: string[] = [];
      let certificateUrl = "";

      if (selectedImages.length > 0) {
        imageUrls = await uploadFiles(selectedImages);
      }

      if (selectedRegistrationCertificate) {
        const certificateUrls = await uploadFiles([selectedRegistrationCertificate]);
        certificateUrl = certificateUrls[0];
      }
      const clinicData = {
        name: newClinic.name,
        email: newClinic.email,
        phone: newClinic.phone,
        city: newClinic.city,
        address: newClinic.address,
        pincode: newClinic.pincode,
        landmark: newClinic.landmark,
        map_link: newClinic.mapLink,
        gps_coordinates: newClinic.gpsCoordinates,
        opening_time: newClinic.openingTime,
        closing_time: newClinic.closingTime,
        working_days: newClinic.workingDays,
        about_clinic: newClinic.about_clinic,
        gst_no: newClinic.gst_no,
        images: imageUrls,
        registration_certificate: certificateUrl
      };

      const createdClinic = await createClinic(clinicData);

      // Store the created clinic UUID for the next step
      setNewUser(prev => ({
        ...prev,
        clinic: createdClinic.data.uuid,
        email: newClinic.email // Pre-fill email for user creation
      }));

      // Move to next step
      setCurrentStep(1);

      setNotification({
        type: "success",
        message: "Clinic created successfully! Now create an admin user."
      });
    } catch (error: any) {
      setNotification({
        type: "error",
        message: `Failed to add clinic: ${error.message}`
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddUserStep2 = async () => {
    if (
      !newUser.full_name ||
      !newUser.email ||
      !newUser.phone_number ||
      !newUser.password
    ) {
      setNotification({
        type: "error",
        message: "Please fill in all required user fields"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const userData = {
        clinic: newUser.clinic,
        full_name: newUser.full_name,
        email: newUser.email,
        phone_number: newUser.phone_number,
        password: newUser.password
      };
      console.log(userData, "user data for submission");
      await createUserForClinic(userData);

      // Reset forms and close modal
      setNewClinic({
        name: "",
        city: "",
        phone: "",
        email: "",
        address: "",
        pincode: "",
        landmark: "",
        mapLink: "",
        gpsCoordinates: "",
        openingTime: "",
        closingTime: "",
        workingDays: [],
        about_clinic: "",
        gst_no: "",
        images: []
      });

      setNewUser({
        clinic: "",
        full_name: "",
        email: "",
        phone_number: "",
        password: ""
      });

      setIsAddModalOpen(false);
      setCurrentStep(0);

      // Refresh clinics list
      fetchClinics();

      setNotification({
        type: "success",
        message: "Clinic and admin user created successfully!"
      });
    } catch (error: any) {
      setNotification({
        type: "error",
        message: `Failed to create user: ${error.response?.data?.message || error.message}`
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper function to format time
  const formatTime = (time24: string) => {
    if (!time24) return "";
    const [hours, minutes] = time24.split(":");
    const hourNum = parseInt(hours, 10);
    const ampm = hourNum >= 12 ? "PM" : "AM";
    const hour12 = hourNum % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  const stats = {
    total: paginationData.total_items,
    approved: clinics.filter((c) => c.status === "APPROVED").length,
    pending: clinics.filter((c) => c.status === "Pending").length,
    active: clinics.filter((c) => c.is_active).length,
    deactivated: clinics.filter((c) => !c.is_active).length
  };

  function handleApprove(clinic: Clinic) {
    // Optimistically update the UI
    setClinics((prev) =>
      prev.map((c) =>
        c.uuid === clinic.uuid ? { ...c, status: "APPROVED" } : c
      )
    );

    // Call the API
    approveOrRejectClinic(clinic.uuid.toString(), { status: "APPROVED" })
      .then(() => {
        setNotification({
          type: "success",
          message: `Clinic "${clinic.name}" approved!`
        });
      })
      .catch((error) => {
        // Revert the UI change if the API call fails
        setClinics((prev) =>
          prev.map((c) =>
            c.uuid === clinic.uuid ? { ...c, status: clinic.status } : c
          )
        );
        setNotification({
          type: "error",
          message: `Failed to approve clinic "${clinic.name}". ${error.response?.data?.message || ""
            }`
        });
      });
  }

  function handleReject(clinic: Clinic) {
    // Optimistically update the UI
    setClinics((prev) =>
      prev.map((c) =>
        c.uuid === clinic.uuid ? { ...c, status: "REJECTED" } : c
      )
    );

    // Call the API
    approveOrRejectClinic(clinic.uuid.toString(), { status: "REJECTED" })
      .then(() => {
        setNotification({
          type: "error",
          message: `Clinic "${clinic.name}" rejected.`
        });
      })
      .catch((error) => {
        // Revert the UI change if the API call fails
        setClinics((prev) =>
          prev.map((c) =>
            c.uuid === clinic.uuid ? { ...c, status: clinic.status } : c
          )
        );
        setNotification({
          type: "error",
          message: `Failed to reject clinic "${clinic.name}". ${error.response?.data?.message || ""
            }`
        });
      });
  }

  function handleToggleActive(clinic: Clinic) {
    setLoadingId(clinic.uuid);

    // Optimistically update the UI
    setClinics((prev) =>
      prev.map((c) =>
        c.uuid === clinic.uuid ? { ...c, is_active: !c.is_active } : c
      )
    );

    // Call the API
    toggleActiveClinic(clinic.uuid, { is_active: !clinic.is_active })
      .then(() => {
        setNotification({
          type: "success",
          message: `Clinic "${clinic.name}" is now ${!clinic.is_active ? "active" : "inactive"
            }.`
        });
      })
      .catch((error) => {
        // Revert the UI change if the API call fails
        setClinics((prev) =>
          prev.map((c) =>
            c.uuid === clinic.uuid ? { ...c, is_active: clinic.is_active } : c
          )
        );
        setNotification({
          type: "error",
          message: `Failed to ${clinic.is_active ? "deactivate" : "activate"
            } clinic "${clinic.name}". ${error.response?.data?.message || ""}`
        });
      })
      .finally(() => {
        setLoadingId(null);
      });
  }

  function handleDeleteClinic(clinic: Clinic) {
    setClinics((prev) => prev.filter((c) => c.uuid !== clinic.uuid));
    deleteClinic(clinic.uuid)
      .then(() => {
        setNotification({
          type: "success",
          message: `Clinic "${clinic.name}" deleted Successfully.`
        });
      })
      .catch((error) => {
        setNotification({
          type: "error",
          message: `Failed to delete clinic "${clinic.name}". ${error.response?.data?.message || ""
            }`
        });
      })
      .finally(() => {
        setLoadingId(null);
      });
  }

  // Calculate bookings per clinic (by name)
  const getBookingCount = (clinicName: string) => {
    return sampleBookings.filter((b: any) => b.clinic_name === clinicName)
      .length;
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
    <div className="min-h-screen bg-gray-50 p-2 sm:p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          className="flex flex-col md:flex-row md:items-center justify-between mb-8 bg-white rounded-xl shadow-lg p-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <Building2 className="mr-3 text-blue-600" size={32} />
              Clinic Management
            </h1>
            <p className="text-gray-600 mt-1">
              Manage and monitor clinic registrations
            </p>
          </div>

          <div className="flex items-center gap-4 mt-4 md:mt-0">
            <button
              onClick={() => window.location.reload()}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <RefreshCw size={16} />
              Refresh
            </button>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus size={16} />
              Add New Clinic
            </button>
          </div>
        </motion.div>

        {/* Deactivated Clinics Header/Toggle */}
        <div className="flex items-center gap-4 mb-4">
          <h2 className="text-2xl font-bold text-gray-800">All Clinics</h2>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 sm:gap-6 mb-8">
          <motion.div
            className={`bg-white p-6 rounded-xl shadow-lg border border-gray-100 cursor-pointer transition ${selectedHeader === "ALL" ? "ring-2 ring-blue-500" : ""
              }`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={() => {
              setSelectedHeader("ALL");
              setSelectedStatus("ALL");
              setShowDeactivated(false);
            }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Clinics
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.total}
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <Building2 size={24} className="text-blue-600" />
              </div>
            </div>
          </motion.div>

          <motion.div
            className={`bg-white p-6 rounded-xl shadow-lg border border-gray-100 cursor-pointer transition ${selectedHeader === "Approved" ? "ring-2 ring-blue-500" : ""
              }`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            onClick={() => {
              setSelectedHeader("Approved");
              setSelectedStatus("ALL");
              setShowDeactivated(false);
            }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Approved</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.approved}
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <CheckCircle size={24} className="text-green-600" />
              </div>
            </div>
          </motion.div>

          <motion.div
            className={`bg-white p-6 rounded-xl shadow-lg border border-gray-100 cursor-pointer transition ${selectedHeader === "Pending" ? "ring-2 ring-blue-500" : ""
              }`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            onClick={() => {
              setSelectedHeader("Pending");
              setSelectedStatus("ALL");
              setShowDeactivated(false);
            }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.pending}
                </p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-lg">
                <Clock size={24} className="text-yellow-600" />
              </div>
            </div>
          </motion.div>

          <motion.div
            className={`bg-white p-6 rounded-xl shadow-lg border border-gray-100 cursor-pointer transition ${selectedHeader === "Active" ? "ring-2 ring-blue-500" : ""
              }`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            onClick={() => {
              setSelectedHeader("Active");
              setSelectedStatus("ALL");
              setShowDeactivated(false);
            }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.active}
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <CheckCircle size={24} className="text-purple-600" />
              </div>
            </div>
          </motion.div>

          <motion.div
            className={`bg-white p-6 rounded-xl shadow-lg border border-gray-100 cursor-pointer transition ${selectedHeader === "Deactivated" ? "ring-2 ring-blue-500" : ""
              }`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            onClick={() => {
              setSelectedHeader("Deactivated");
              setSelectedStatus("ALL");
              setShowDeactivated(true);
              setTimeout(() => {
                clinicsListRef.current?.scrollIntoView({ behavior: "smooth" });
              }, 100);
            }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Deactivated</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.deactivated}
                </p>
              </div>
              <div className="p-3 bg-gray-100 rounded-lg">
                <XCircle size={24} className="text-gray-500" />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Filters and Search */}
        <motion.div
          className="bg-white p-3 sm:p-6 rounded-xl shadow-sm border border-gray-100 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex flex-col md:flex-row md:items-center gap-2 sm:gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search
                size={20}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="Search by name, city, email, or phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Status Filter */}
            <div className="relative">
              <select
                value={selectedStatus}
                onChange={(e) =>
                  setSelectedStatus(e.target.value as Clinic["status"] | "ALL")
                }
                className="appearance-none bg-white border border-gray-200 rounded-lg px-4 py-3 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="ALL">All Status</option>
                <option value="Approved">Approved</option>
                <option value="Draft">Draft</option>
                <option value="Pending">Pending</option>
                <option value="Rejected">Rejected</option>
              </select>
              <ChevronDown
                size={16}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
              />
            </div>

            {/* Payment Status Filter */}
            <div className="relative">
              <select
                value={selectedPaymentStatus}
                onChange={(e) =>
                  setSelectedPaymentStatus(
                    e.target.value as Clinic["paymentStatus"] | "ALL"
                  )
                }
                className="appearance-none bg-white border border-gray-200 rounded-lg px-4 py-3 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="ALL">All Payments</option>
                <option value="Paid">Paid</option>
                <option value="Pending">Pending</option>
                <option value="No Dues">No Dues</option>
                <option value="Overdue">Overdue</option>
              </select>
              <ChevronDown
                size={16}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
              />
            </div>
          </div>
        </motion.div>

        {/* Results Count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-600">
            Showing {(paginationData.current_page - 1) * itemsPerPage + 1}-
            {Math.min(
              paginationData.current_page * itemsPerPage,
              paginationData.total_items
            )}{" "}
            of {paginationData.total_items} clinics
          </p>
        </div>

        {/* Clinics List - Card Style for All Screens */}
        <div ref={clinicsListRef} className="mb-8 space-y-4">
          {clinicsToShow.map((clinic, index) => (
            <motion.div
              key={clinic.uuid}
              className="bg-white rounded-xl shadow-xl border border-gray-100 p-6 hover:shadow-2xl transition-shadow cursor-pointer"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                {/* Clinic Info */}
                <div className="flex-1 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                        {clinic.name}
                        <span className="ml-2 px-2 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-semibold border border-blue-100">
                          {getBookingCount(clinic.name)} Bookings
                        </span>
                      </h3>
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
                      <span>{clinic.country_code}{clinic.contact_number}</span>
                    </div>
                    {clinic.hours && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <Clock size={14} />
                        <span>{clinic.hours}</span>
                      </div>
                    )
                    }
                    {clinic?.workingDays && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <Calendar size={14} />
                        <span>{clinic?.workingDays?.join(", ")}</span>
                      </div>
                    )}

                  </div>
                  {clinic.submissionDate && (
                    <div className="text-xs text-gray-500">
                      Submitted on:{" "}
                      {new Date(clinic.submissionDate).toLocaleDateString()}
                    </div>
                  )}
                  {clinic.dueAmount && (
                    <div className="flex flex-wrap gap-2 text-xs text-gray-700 mt-2">
                      <PaymentStatusBadge status={clinic.paymentStatus} />
                      {clinic.dueAmount !== "₹0" && (
                        <span className="text-rose-600">
                          Due: {clinic.dueAmount}
                        </span>
                      )}
                    </div>
                  )}

                </div>
                {/* Actions */}
                <div className="flex items-center gap-3 flex-wrap mt-4 lg:mt-0">
                  <Link
                    href={`/admin/allclinics/${clinic.uuid}`}
                    legacyBehavior
                  >
                    <a
                      className="flex items-center gap-2 px-4 py-2 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors font-medium"
                      aria-label="Review details"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Eye size={16} />
                      <span className="hidden sm:inline">Review</span>
                    </a>
                  </Link>
                  {clinic.status !== "APPROVED" && (
                    <button
                      onClick={() => handleApprove(clinic)}
                      className="flex items-center gap-2 px-4 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors font-medium"
                    >
                      <Check size={16} />
                      <span className="hidden sm:inline">Approve</span>
                    </button>
                  )}
                  {clinic.status !== "REJECTED" &&
                    clinic.status !== "APPROVED" && (
                      <button
                        onClick={() => handleReject(clinic)}
                        className="flex items-center gap-2 px-4 py-2 text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors font-medium"
                      >
                        <X size={16} />
                        <span className="hidden sm:inline">Reject</span>
                      </button>
                    )}
                  {clinic.is_active ? (
                    <button
                      onClick={() =>
                        setConfirmModal({ type: "active", clinic })
                      }
                      className="flex items-center gap-2 px-4 py-2 text-emerald-700 bg-emerald-100 rounded-lg hover:bg-emerald-200 transition-colors font-medium"
                    >
                      <CheckCircle size={16} />
                      <span className="hidden sm:inline">Activate</span>
                    </button>
                  ) : (
                    <button
                      onClick={() =>
                        setConfirmModal({ type: "inactive", clinic })
                      }
                      className="flex items-center gap-2 px-4 py-2 text-yellow-700 bg-yellow-100 rounded-lg hover:bg-yellow-200 transition-colors font-medium"
                    >
                      <XCircle size={16} />
                      <span className="hidden sm:inline">Deactivate</span>
                    </button>
                  )}
                  <button
                    onClick={() => setConfirmModal({ type: "delete", clinic })}
                    className="flex items-center gap-2 px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors font-medium"
                  >
                    <X size={16} />
                    <span className="hidden sm:inline">Delete</span>
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Pagination Controls */}
        {paginationData.total_pages > 1 && (
          <motion.div
            className="flex items-center justify-between bg-white p-4 rounded-xl shadow-sm border border-gray-100"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${currentPage === 1
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
                  }`}
              >
                Previous
              </button>

              <span className="text-sm text-gray-600">
                Page {currentPage} of {paginationData.total_pages}
              </span>

              <button
                type="button"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === paginationData.total_pages}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${currentPage === paginationData.total_pages
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
                  }`}
              >
                Next
              </button>
            </div>
            <div className="text-sm text-gray-500">
              Showing {(paginationData.current_page - 1) * itemsPerPage + 1}-
              {Math.min(
                paginationData.current_page * itemsPerPage,
                paginationData.total_items
              )}{" "}
              of {paginationData.total_items} clinics
            </div>
          </motion.div>
        )}

        {/* Add Clinic Modal */}
        {isAddModalOpen && (
          <ModernModal
            isOpen={isAddModalOpen}
            onClose={() => {
              setIsAddModalOpen(false);
              setCurrentStep(0);
              // Reset forms when modal is closed
              setNewClinic({
                name: "",
                city: "",
                phone: "",
                email: "",
                address: "",
                pincode: "",
                landmark: "",
                mapLink: "",
                gpsCoordinates: "",
                openingTime: "",
                closingTime: "",
                workingDays: [],
                about_clinic: "",
                gst_no: "",
                images: []
              });
              setNewUser({
                clinic: "",
                full_name: "",
                email: "",
                phone_number: "",
                password: ""
              });
            }}
            title="Add New Clinic"
            size="xl"
          >
            <Stepper steps={steps} currentStep={currentStep} />

            {currentStep === 0 && (
              <form className="space-y-6">
                <div className="bg-gray-50 p-4 rounded-xl">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <Building className="w-5 h-5" />
                    Basic Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputField
                      label="Clinic Name"
                      value={newClinic.name}
                      onChange={(e) =>
                        setNewClinic({ ...newClinic, name: e.target.value })
                      }
                      placeholder="Enter clinic name"
                      required
                      icon={Building}
                    />
                    <InputField
                      label="About Clinic"
                      value={newClinic.about_clinic}
                      onChange={(e) =>
                        setNewClinic({ ...newClinic, about_clinic: e.target.value })
                      }
                      placeholder="Enter about clinic"
                      optional
                      icon={Building}
                    />
                    <InputField
                      label="GST No"
                      value={newClinic.gst_no}
                      onChange={(e) =>
                        setNewClinic({ ...newClinic, gst_no: e.target.value })
                      }
                      placeholder="Enter GST number"
                      optional
                      icon={Building}
                    />
                    <InputField
                      label="City"
                      value={newClinic.city}
                      onChange={(e) =>
                        setNewClinic({ ...newClinic, city: e.target.value })
                      }
                      placeholder="Enter city"
                      required
                      icon={MapPin}
                    />
                    <InputField
                      label="Landmark"
                      value={newClinic.landmark}
                      onChange={(e) =>
                        setNewClinic({ ...newClinic, landmark: e.target.value })
                      }
                      placeholder="Enter landmark"
                      optional
                      icon={MapPin}
                    />
                    <InputField
                      label="Pincode"
                      value={newClinic.pincode}
                      onChange={(e) =>
                        setNewClinic({ ...newClinic, pincode: e.target.value })
                      }
                      placeholder="Enter pincode"
                      optional
                      icon={MapPin}
                    />
                  </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-xl">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <Mail className="w-5 h-5" />
                    Contact Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputField
                      label="Email"
                      type="email"
                      value={newClinic.email}
                      onChange={(e) =>
                        setNewClinic({ ...newClinic, email: e.target.value })
                      }
                      placeholder="Enter clinic email"
                      required
                      icon={Mail}
                    />
                    <InputField
                      label="Contact Number"
                      type="tel"
                      value={newClinic.phone}
                      onChange={(e) =>
                        setNewClinic({ ...newClinic, phone: e.target.value })
                      }
                      placeholder="Enter clinic contact number"
                      required
                      icon={Call}
                    />
                  </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-xl">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    Location Details
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Address
                      </label>
                      <textarea
                        value={newClinic.address}
                        onChange={(e) =>
                          setNewClinic({ ...newClinic, address: e.target.value })
                        }
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        rows={3}
                        placeholder="Enter full address"
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <InputField
                        label="Google Maps Link"
                        type="url"
                        value={newClinic.mapLink}
                        onChange={(e) =>
                          setNewClinic({ ...newClinic, mapLink: e.target.value })
                        }
                        placeholder="https://maps.google.com/..."
                        optional
                      />
                      <InputField
                        label="Coordinates"
                        value={newClinic.gpsCoordinates}
                        onChange={(e) =>
                          setNewClinic({
                            ...newClinic,
                            gpsCoordinates: e.target.value
                          })
                        }
                        placeholder="POINT(longitude latitude)"
                        optional
                      />
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Image Upload Section */}
                  <div className="bg-gray-50 p-4 rounded-xl">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                      <ImageIcon className="w-5 h-5" />
                      Clinic Images
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Upload Clinic Images {selectedImages.length > 0 && `(${selectedImages.length} selected)`}
                        </label>
                        <div className="flex items-center gap-4">
                          <label className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg cursor-pointer hover:bg-blue-200 transition-colors">
                            <Upload size={16} />
                            Select Images
                            <input
                              type="file"
                              multiple
                              accept="image/*"
                              onChange={handleImageSelection}
                              className="hidden"
                            />
                          </label>
                          {uploadingFiles && (
                            <div className="flex items-center gap-2 text-gray-500">
                              <RefreshCw size={16} className="animate-spin" />
                              Uploading...
                            </div>
                          )}
                        </div>

                        {selectedImages.length > 0 && (
                          <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-2">
                            {selectedImages.map((file, index) => (
                              <div key={index} className="relative group">
                                <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                                  <img
                                    src={URL.createObjectURL(file)}
                                    alt={file.name}
                                    className="object-cover w-full h-full"
                                  />
                                </div>
                                <button
                                  type="button"
                                  onClick={() => removeImage(index)}
                                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  <X size={12} />
                                </button>
                                <p className="text-xs text-gray-500 truncate mt-1">{file.name}</p>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  {/* Registration Certificate Upload Section */}
                  <div className="bg-gray-50 p-4 rounded-xl">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                      <FileText className="w-5 h-5" />
                      Registration Certificate
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Upload Registration Certificate (PDF)
                          {selectedRegistrationCertificate && ` - ${selectedRegistrationCertificate.name}`}
                        </label>
                        <div className="flex items-center gap-4">
                          <label className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg cursor-pointer hover:bg-blue-200 transition-colors">
                            <Upload size={16} />
                            Select Certificate
                            <input
                              type="file"
                              accept=".pdf,application/pdf"
                              onChange={handleCertificateSelection}
                              className="hidden"
                            />
                          </label>
                          {selectedRegistrationCertificate && (
                            <button
                              type="button"
                              onClick={() => setSelectedRegistrationCertificate(null)}
                              className="flex items-center gap-2 px-4 py-2 text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                            >
                              <X size={16} />
                              Remove
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-xl">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    Working Hours
                  </h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Opening Time <span className="text-red-500">*</span>
                        </label>
                        <TimePicker
                          value={newClinic.openingTime}
                          onChange={(value) =>
                            setNewClinic({ ...newClinic, openingTime: value })
                          }
                          placeholder="Select opening time"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Closing Time <span className="text-red-500">*</span>
                        </label>
                        <TimePicker
                          value={newClinic.closingTime}
                          onChange={(value) =>
                            setNewClinic({ ...newClinic, closingTime: value })
                          }
                          placeholder="Select closing time"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        Working Days <span className="text-red-500">*</span>
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {workingDayOptions.map((day) => (
                          <label
                            key={day.value}
                            className="flex items-center gap-2 cursor-pointer"
                          >
                            <input
                              type="checkbox"
                              checked={newClinic.workingDays.includes(day.value)}
                              onChange={() => handleWorkingDayToggle(day.value)}
                              className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                            />
                            <span className="text-sm text-gray-700">
                              {day.label}
                            </span>
                          </label>
                        ))}
                      </div>
                      <div className="flex gap-2 mt-2">
                        <button
                          type="button"
                          className="text-xs text-blue-600 underline"
                          onClick={handleSelectAllDays}
                        >
                          All
                        </button>
                        <button
                          type="button"
                          className="text-xs text-blue-600 underline"
                          onClick={handleSelectWeekdays}
                        >
                          Weekdays
                        </button>
                        <button
                          type="button"
                          className="text-xs text-blue-600 underline"
                          onClick={handleClearAllDays}
                        >
                          Clear
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleAddClinicStep1}
                    disabled={isSubmitting}
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all font-semibold flex items-center gap-2 disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>Processing...</>
                    ) : (
                      <>
                        Next Step <ArrowRight size={16} />
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}

            {currentStep === 1 && (
              <form className="space-y-6">
                <div className="bg-gray-50 p-4 rounded-xl">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Create Admin User
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Create an admin user for this clinic. This user will have administrative access to manage the clinic.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputField
                      label="Full Name"
                      value={newUser.full_name}
                      onChange={(e) =>
                        setNewUser({ ...newUser, full_name: e.target.value })
                      }
                      placeholder="Enter user's full name"
                      required
                      icon={User}
                    />
                    <InputField
                      label="Email"
                      type="email"
                      value={newUser.email}
                      onChange={(e) =>
                        setNewUser({ ...newUser, email: e.target.value })
                      }
                      placeholder="Enter user email"
                      required
                      icon={Mail}
                    />
                    <InputField
                      label="Phone Number"
                      type="tel"
                      value={newUser.phone_number}
                      onChange={(e) =>
                        setNewUser({ ...newUser, phone_number: e.target.value })
                      }
                      placeholder="Enter user phone number"
                      required
                      icon={Call}
                    />
                    <InputField
                      label="Password"
                      type="password"
                      value={newUser.password}
                      onChange={(e) =>
                        setNewUser({ ...newUser, password: e.target.value })
                      }
                      placeholder="Enter temporary password (min 6 chars)"
                      required
                      icon={Lock}
                    />
                  </div>
                </div>
                <div className="flex justify-between gap-4 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(0)}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all font-medium flex items-center gap-2"
                  >
                    <ArrowLeft size={16} /> Previous Step
                  </button>
                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={() => setIsAddModalOpen(false)}
                      className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all font-medium"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleAddUserStep2}
                      disabled={isSubmitting}
                      className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all font-semibold disabled:opacity-50"
                    >
                      {isSubmitting ? "Creating User..." : "Create User & Complete"}
                    </button>
                  </div>
                </div>
              </form>
            )}
          </ModernModal>
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

        {/* Confirmation Modal */}
        {confirmModal && confirmModal.clinic && (
          <ModernModal
            isOpen={!!confirmModal}
            onClose={() => setConfirmModal(null)}
            title={
              confirmModal.type === "delete"
                ? "Delete Clinic"
                : confirmModal.type === "active"
                  ? "Activate Clinic"
                  : "Deactivate Clinic"
            }
            size="sm"
          >
            <div className="space-y-4">
              <p className="text-gray-700 text-base">
                {confirmModal.type === "delete" &&
                  `Are you sure you want to delete "${confirmModal.clinic.name}"? This action cannot be undone.`}
                {confirmModal.type === "active" &&
                  `Are you sure you want to activate "${confirmModal.clinic.name}"?`}
                {confirmModal.type === "inactive" &&
                  `Are you sure you want to deactivate "${confirmModal.clinic.name}"?`}
              </p>
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  onClick={() => setConfirmModal(null)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-all"
                >
                  Cancel
                </button>
                {confirmModal.type === "delete" && (
                  <button
                    onClick={() => {
                      handleDeleteClinic(confirmModal.clinic!);
                      setConfirmModal(null);
                    }}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all"
                  >
                    Delete
                  </button>
                )}
                {confirmModal.type === "active" && (
                  <button
                    onClick={() => {
                      handleToggleActive(confirmModal.clinic!);
                      setConfirmModal(null);
                    }}
                    className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-all"
                  >
                    Activate
                  </button>
                )}
                {confirmModal.type === "inactive" && (
                  <button
                    onClick={() => {
                      handleToggleActive(confirmModal.clinic!);
                      setConfirmModal(null);
                    }}
                    className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-all"
                  >
                    Deactivate
                  </button>
                )}
              </div>
            </div>
          </ModernModal>
        )}
      </div>
    </div>
  );
}