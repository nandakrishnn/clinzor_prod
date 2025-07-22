import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  Plus, 
  Filter,
  Edit3, 
  Eye, 
  Trash2, 
  MoreHorizontal,
  Settings,
  CheckCircle,
  AlertCircle,
  Clock,
  X,
  Heart,
  Stethoscope,
  Brain,
  Activity,
  DollarSign,
  Video,
  Home,
  Building,
  Star,
  Tag,
  FileText,
  Image as ImageIcon,
  XCircle,
  Building2,
  LayoutGrid,
  List as ListIcon,
  Calendar as CalendarIcon
} from 'lucide-react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import type { DraggableProvided, DroppableProvided } from 'react-beautiful-dnd';
import { isBefore, startOfDay } from 'date-fns';

// Types
interface Service {
  uuid: string;
  created_by: string;
  name: string;
  description: string;
  tags: string;
  image: string | null;
  status: 'APPROVED' | 'PENDING' | 'REJECTED';
}

interface ClinicService {
  uuid: string;
  service: string;
  clinic: string;
  service_name: string;
  created_by: string;
  clinic_provided_name: string | null;
  rank: number;
  consultation_charge_video_call: string;
  consultation_charge_physical_visit: string;
  consultation_charge_home_visit: string;
  treatment_charge_video_call: string;
  treatment_charge_physical_visit: string;
  treatment_charge_home_visit: string;
  status: 'APPROVED' | 'PENDING' | 'REJECTED';
  is_video_call: boolean;
  is_home_visit: boolean;
  is_physical_visit: boolean;
  image: string | null;
  description: string | null;
  reason_for_rejection: string | null;
  display_date?: string; // ISO string for display date
}

interface NewClinicService {
  clinic: string;
  service: string;
  rank: string;
  consultation_charge_video_call: string;
  consultation_charge_home_visit: string;
  treatment_charge_video_call: string;
  treatment_charge_physical_visit: string;
  consultation_charge_physical_visit: string;
  treatment_charge_home_visit: string;
  is_video_call: boolean;
  is_home_service: boolean;
  is_clinic_visit: boolean;
  clinic_provided_name: string;
  image: string;
  description: string;
}

// Sample data
const sampleClinics = [
  { uuid: "5a1f8f39-ca38-464c-93c5-ea8edbd6c03f", name: "City General Hospital" },
  { uuid: "b2c8f4d1-4a5b-4c7d-8e9f-1a2b3c4d5e6f", name: "Metro Medical Center" },
  { uuid: "c3d9f5e2-5b6c-5d8e-9f0g-2b3c4d5e6f7g", name: "Downtown Clinic" },
  { uuid: "d4e5f6g7-h8i9-j0k1-l2m3-n4o5p6q7r8s9", name: "Sunrise Specialty Clinic" },
  { uuid: "e5f6g7h8-i9j0-k1l2-m3n4-o5p6q7r8s9t0", name: "Lakeside Health Center" }
];

const sampleServices: Service[] = [
  {
    uuid: "d7afe788-af8b-4fd4-b65b-bab700df841a",
    created_by: "admin@gmail.com",
    name: "cardiologist",
    description: "Specialist in diagnosing and treating heart and blood vessel conditions.",
    tags: "heart,cardiology,blood pressure,ECG,chest pain",
    image: null,
    status: "APPROVED"
  },
  {
    uuid: "661d42bc-4393-49a3-ab8f-c24b6ab17c38",
    created_by: "admin@gmail.com",
    name: "heart speciality",
    description: "Focus on the diagnosis, treatment, and management of heart and blood vessel conditions",
    tags: "heart",
    image: null,
    status: "APPROVED"
  },
  {
    uuid: "62111833-4927-4060-acdf-f2d857e9d688",
    created_by: "admin@gmail.com",
    name: "neurologist",
    description: "Specialist in diagnosing and treating nervous system disorders.",
    tags: "brain,neurology,headache,seizure,stroke",
    image: null,
    status: "PENDING"
  },
  {
    uuid: "5bfffdfc-0af4-4d17-8d0c-08466e2315e5",
    created_by: "admin@gmail.com",
    name: "physician",
    description: "General medical practitioner providing comprehensive healthcare.",
    tags: "general,medicine,primary care,checkup",
    image: null,
    status: "REJECTED"
  },
  {
    uuid: "9a8b7c6d-5e4f-3g2h-1i0j-k9l8m7n6o5p4",
    created_by: "admin@gmail.com",
    name: "dermatologist",
    description: "Expert in skin, hair, and nail disorders.",
    tags: "skin,acne,eczema,psoriasis,allergy",
    image: null,
    status: "APPROVED"
  },
  {
    uuid: "8b7c6d5e-4f3g-2h1i-0j9k-8l7m6n5o4p3q",
    created_by: "admin@gmail.com",
    name: "orthopedic",
    description: "Specialist in bones, joints, and muscles.",
    tags: "bones,joints,fracture,arthritis,orthopedics",
    image: null,
    status: "PENDING"
  },
  {
    uuid: "7c6d5e4f-3g2h-1i0j-9k8l-7m6n5o4p3q2r",
    created_by: "admin@gmail.com",
    name: "pediatrician",
    description: "Child health and development expert.",
    tags: "children,childcare,pediatrics,immunization,growth",
    image: null,
    status: "APPROVED"
  },
  {
    uuid: "6d5e4f3g-2h1i-0j9k-8l7m-6n5o4p3q2r1s",
    created_by: "admin@gmail.com",
    name: "psychiatrist",
    description: "Mental health and behavioral specialist.",
    tags: "mental health,psychiatry,therapy,depression,anxiety",
    image: null,
    status: "REJECTED"
  }
];

const sampleClinicServices: ClinicService[] = [
  {
    uuid: "159e3627-65eb-40b2-b535-37cbb6535ab8",
    service: "d7afe788-af8b-4fd4-b65b-bab700df841a",
    clinic: "5a1f8f39-ca38-464c-93c5-ea8edbd6c03f",
    service_name: "cardiology",
    created_by: "admin@gmail.com",
    clinic_provided_name: "Advanced Cardiology Care",
    rank: 1,
    consultation_charge_video_call: "400.00",
    consultation_charge_physical_visit: "200.00",
    consultation_charge_home_visit: "200.00",
    treatment_charge_video_call: "600.00",
    treatment_charge_physical_visit: "500.00",
    treatment_charge_home_visit: "800.00",
    status: "APPROVED",
    is_video_call: true,
    is_home_visit: false,
    is_physical_visit: true,
    image: null,
    description: "Premium cardiology services with experienced specialists",
    reason_for_rejection: null,
    display_date: new Date().toISOString(),
  },
  {
    uuid: "269f4738-76fc-51c3-c646-48dcc7646cb9",
    service: "661d42bc-4393-49a3-ab8f-c24b6ab17c38",
    clinic: "b2c8f4d1-4a5b-4c7d-8e9f-1a2b3c4d5e6f",
    service_name: "heart speciality",
    created_by: "admin@gmail.com",
    clinic_provided_name: null,
    rank: 2,
    consultation_charge_video_call: "350.00",
    consultation_charge_physical_visit: "180.00",
    consultation_charge_home_visit: "250.00",
    treatment_charge_video_call: "550.00",
    treatment_charge_physical_visit: "450.00",
    treatment_charge_home_visit: "700.00",
    status: "PENDING",
    is_video_call: true,
    is_home_visit: true,
    is_physical_visit: true,
    image: null,
    description: null,
    reason_for_rejection: null,
    display_date: new Date().toISOString(),
  },
  {
    uuid: "379e3627-65eb-40b2-b535-37cbb6535ab9",
    service: "9a8b7c6d-5e4f-3g2h-1i0j-k9l8m7n6o5p4",
    clinic: "d4e5f6g7-h8i9-j0k1-l2m3-n4o5p6q7r8s9",
    service_name: "dermatologist",
    created_by: "admin@gmail.com",
    clinic_provided_name: "Skin Wellness Center",
    rank: 3,
    consultation_charge_video_call: "300.00",
    consultation_charge_physical_visit: "250.00",
    consultation_charge_home_visit: "350.00",
    treatment_charge_video_call: "500.00",
    treatment_charge_physical_visit: "450.00",
    treatment_charge_home_visit: "600.00",
    status: "APPROVED",
    is_video_call: true,
    is_home_visit: false,
    is_physical_visit: true,
    image: null,
    description: "Comprehensive skin care and treatment.",
    reason_for_rejection: null,
    display_date: new Date().toISOString()
  },
  {
    uuid: "489f4738-76fc-51c3-c646-48dcc7646cb8",
    service: "8b7c6d5e-4f3g-2h1i-0j9k-8l7m6n5o4p3q",
    clinic: "e5f6g7h8-i9j0-k1l2-m3n4-o5p6q7r8s9t0",
    service_name: "orthopedic",
    created_by: "admin@gmail.com",
    clinic_provided_name: "Bone & Joint Clinic",
    rank: 4,
    consultation_charge_video_call: "400.00",
    consultation_charge_physical_visit: "350.00",
    consultation_charge_home_visit: "400.00",
    treatment_charge_video_call: "700.00",
    treatment_charge_physical_visit: "600.00",
    treatment_charge_home_visit: "800.00",
    status: "PENDING",
    is_video_call: true,
    is_home_visit: true,
    is_physical_visit: true,
    image: null,
    description: "Bone, joint, and muscle care.",
    reason_for_rejection: null,
    display_date: new Date().toISOString()
  },
  {
    uuid: "591e3627-65eb-40b2-b535-37cbb6535ab1",
    service: "7c6d5e4f-3g2h-1i0j-9k8l-7m6n5o4p3q2r",
    clinic: "5a1f8f39-ca38-464c-93c5-ea8edbd6c03f",
    service_name: "pediatrician",
    created_by: "admin@gmail.com",
    clinic_provided_name: "Child Health Center",
    rank: 5,
    consultation_charge_video_call: "350.00",
    consultation_charge_physical_visit: "300.00",
    consultation_charge_home_visit: "400.00",
    treatment_charge_video_call: "600.00",
    treatment_charge_physical_visit: "550.00",
    treatment_charge_home_visit: "700.00",
    status: "APPROVED",
    is_video_call: true,
    is_home_visit: false,
    is_physical_visit: true,
    image: null,
    description: "Pediatric care and immunizations.",
    reason_for_rejection: null,
    display_date: new Date().toISOString()
  },
  {
    uuid: "6a9e3627-65eb-40b2-b535-37cbb6535ab2",
    service: "6d5e4f3g-2h1i-0j9k-8l7m-6n5o4p3q2r1s",
    clinic: "b2c8f4d1-4a5b-4c7d-8e9f-1a2b3c4d5e6f",
    service_name: "psychiatrist",
    created_by: "admin@gmail.com",
    clinic_provided_name: "Mind Wellness Center",
    rank: 6,
    consultation_charge_video_call: "500.00",
    consultation_charge_physical_visit: "400.00",
    consultation_charge_home_visit: "500.00",
    treatment_charge_video_call: "800.00",
    treatment_charge_physical_visit: "700.00",
    treatment_charge_home_visit: "900.00",
    status: "REJECTED",
    is_video_call: true,
    is_home_visit: true,
    is_physical_visit: true,
    image: null,
    description: "Mental health and therapy services.",
    reason_for_rejection: "Incomplete documentation.",
    display_date: new Date().toISOString()
  }
];

const ServiceManagement: React.FC = () => {
  // State management
  const [services, setServices] = useState<Service[]>(sampleServices);
  const [clinicServices, setClinicServices] = useState<ClinicService[]>(sampleClinicServices.map(cs => ({
    ...cs,
    display_date: cs.display_date || new Date().toISOString(),
  })));
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState<'clinic-services'>('clinic-services');
  const itemsPerPage = 6;

  // Search state
  const [searchTerm, setSearchTerm] = useState('');

  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showServiceSearchModal, setShowServiceSearchModal] = useState(false);
  const [showRequestServiceModal, setShowRequestServiceModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ClinicService | null>(null);
  const [modalMode, setModalMode] = useState<'view' | 'edit' | 'delete' | 'edit-rank' | null>(null);
  
  // Service search states
  const [serviceSearchTerm, setServiceSearchTerm] = useState('');
  const [allServices, setAllServices] = useState<Service[]>([]);
  const [isLoadingServices, setIsLoadingServices] = useState(false);

  // Service request states
  const [serviceRequest, setServiceRequest] = useState({
    name: '',
    image: '',
    description: '',
    type: '',
    rates: '',
    additionalInfo: '',
    rank: '1',
    consultation_charge_video_call: '',
    consultation_charge_home_visit: '',
    treatment_charge_video_call: '',
    treatment_charge_physical_visit: '',
    consultation_charge_physical_visit: '',
    treatment_charge_home_visit: '',
    is_video_call: false,
    is_home_service: false,
    is_clinic_visit: true,
    clinic_provided_name: ''
  });

  const [newClinicService, setNewClinicService] = useState<NewClinicService>({
    clinic: '',
    service: '',
    rank: '1',
    consultation_charge_video_call: '',
    consultation_charge_home_visit: '',
    treatment_charge_video_call: '',
    treatment_charge_physical_visit: '',
    consultation_charge_physical_visit: '',
    treatment_charge_home_visit: '',
    is_video_call: false,
    is_home_service: false,
    is_clinic_visit: true,
    clinic_provided_name: '',
    image: '',
    description: ''
  });

  // Validation state
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

  // Add after state declarations
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
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

  const getServiceIcon = (serviceName: string) => {
    const name = serviceName.toLowerCase();
    if (name.includes('cardio') || name.includes('heart')) return Heart;
    if (name.includes('neuro') || name.includes('brain')) return Brain;
    if (name.includes('physician') || name.includes('general')) return Stethoscope;
    return Activity;
  };

  const getClinicName = (clinicId: string) => {
    return sampleClinics.find(c => c.uuid === clinicId)?.name || 'Unknown Clinic';
  };

  const getServiceName = (serviceId: string) => {
    return services.find(s => s.uuid === serviceId)?.name || 'Unknown Service';
  };

  // Mock data for all services from backend
  const mockAllServices: Service[] = [
    {
      uuid: "d7afe788-af8b-4fd4-b65b-bab700df841a",
      created_by: "admin@gmail.com",
      name: "Cardiology",
      description: "Specialist in diagnosing and treating heart and blood vessel conditions.",
      tags: "heart,cardiology,blood pressure,ECG,chest pain",
      image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=400&fit=crop",
      status: "APPROVED"
    },
    {
      uuid: "661d42bc-4393-49a3-ab8f-c24b6ab17c38",
      created_by: "admin@gmail.com",
      name: "Neurology",
      description: "Specialist in diagnosing and treating nervous system disorders.",
      tags: "brain,neurology,headache,seizure,stroke",
      image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400&h=400&fit=crop",
      status: "APPROVED"
    },
    {
      uuid: "62111833-4927-4060-acdf-f2d857e9d688",
      created_by: "admin@gmail.com",
      name: "Dermatology",
      description: "Specialist in diagnosing and treating skin conditions.",
      tags: "skin,dermatology,acne,eczema,psoriasis",
      image: "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=400&h=400&fit=crop",
      status: "APPROVED"
    },
    {
      uuid: "5bfffdfc-0af4-4d17-8d0c-08466e2315e5",
      created_by: "admin@gmail.com",
      name: "Orthopedics",
      description: "Specialist in diagnosing and treating bone and joint conditions.",
      tags: "bones,joints,orthopedics,fracture,arthritis",
      image: "https://images.unsplash.com/photo-1559757172-9b3c5a9c0b5a?w=400&h=400&fit=crop",
      status: "APPROVED"
    },
    {
      uuid: "7c8e9f0a-1b2c-3d4e-5f6g-7h8i9j0k1l2m",
      created_by: "admin@gmail.com",
      name: "Pediatrics",
      description: "Specialist in diagnosing and treating children's health conditions.",
      tags: "children,pediatrics,childcare,development",
      image: "https://images.unsplash.com/photo-1559757173-9b3c5a9c0b5b?w=400&h=400&fit=crop",
      status: "APPROVED"
    },
    {
      uuid: "8d9e0f1b-2c3d-4e5f-6g7h-8i9j0k1l2m3n",
      created_by: "admin@gmail.com",
      name: "Psychiatry",
      description: "Specialist in diagnosing and treating mental health conditions.",
      tags: "mental health,psychiatry,depression,anxiety,therapy",
      image: "https://images.unsplash.com/photo-1559757174-9b3c5a9c0b5c?w=400&h=400&fit=crop",
      status: "APPROVED"
    }
  ];

  // Filtering logic
  const filteredClinicServices = clinicServices.filter(clinicService => {
    // Only show approved services
    if (clinicService.status !== 'APPROVED') {
      return false;
    }
    
    // Apply search filter
    const matchesSearch = clinicService.service_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (clinicService.clinic_provided_name?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
                         clinicService.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         getClinicName(clinicService.clinic).toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSearch;
  });

  // Pagination logic
  const currentData = filteredClinicServices;
  const totalPages = Math.ceil(currentData.length / itemsPerPage);
  const paginatedData = currentData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // Statistics
  const totalClinicServices = clinicServices.length;
  const approvedClinicServices = clinicServices.filter(cs => cs.status === 'APPROVED').length;
  const pendingClinicServices = clinicServices.filter(cs => cs.status === 'PENDING').length;
  const rejectedClinicServices = clinicServices.filter(cs => cs.status === 'REJECTED').length;

  // Validation functions
  const validateClinicServiceForm = () => {
    const errors: { [key: string]: string } = {};
    // Remove clinic validation since we're removing the dropdown
    if (!newClinicService.service) errors.service = 'Service is required.';
    if (!newClinicService.rank || isNaN(Number(newClinicService.rank))) errors.rank = 'Valid rank is required.';
    
    // Validate charges based on enabled services
    if (newClinicService.is_video_call) {
      if (!newClinicService.consultation_charge_video_call) errors.consultation_charge_video_call = 'Video consultation charge is required.';
      if (!newClinicService.treatment_charge_video_call) errors.treatment_charge_video_call = 'Video treatment charge is required.';
    }
    if (newClinicService.is_clinic_visit) {
      if (!newClinicService.consultation_charge_physical_visit) errors.consultation_charge_physical_visit = 'Physical consultation charge is required.';
      if (!newClinicService.treatment_charge_physical_visit) errors.treatment_charge_physical_visit = 'Physical treatment charge is required.';
    }
    if (newClinicService.is_home_service) {
      if (!newClinicService.consultation_charge_home_visit) errors.consultation_charge_home_visit = 'Home consultation charge is required.';
      if (!newClinicService.treatment_charge_home_visit) errors.treatment_charge_home_visit = 'Home treatment charge is required.';
    }
    
    return errors;
  };

  // CRUD operations
  const handleCreateClinicService = () => {
    const errors = validateClinicServiceForm();
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) return;

    const clinicService: ClinicService = {
      uuid: `clinic-service-${Date.now()}`,
      service: newClinicService.service,
      clinic: newClinicService.clinic,
      service_name: getServiceName(newClinicService.service),
      created_by: 'admin@clinic.com',
      clinic_provided_name: newClinicService.clinic_provided_name || null,
      rank: parseInt(newClinicService.rank),
      consultation_charge_video_call: newClinicService.consultation_charge_video_call,
      consultation_charge_physical_visit: newClinicService.consultation_charge_physical_visit,
      consultation_charge_home_visit: newClinicService.consultation_charge_home_visit,
      treatment_charge_video_call: newClinicService.treatment_charge_video_call,
      treatment_charge_physical_visit: newClinicService.treatment_charge_physical_visit,
      treatment_charge_home_visit: newClinicService.treatment_charge_home_visit,
      status: 'PENDING',
      is_video_call: newClinicService.is_video_call,
      is_home_visit: newClinicService.is_home_service,
      is_physical_visit: newClinicService.is_clinic_visit,
      image: newClinicService.image || null,
      description: newClinicService.description || null,
      reason_for_rejection: null,
      display_date: new Date().toISOString(),
    };
    
    setClinicServices([clinicService, ...clinicServices]);
    resetClinicServiceForm();
    setShowCreateModal(false);
    showToast('Clinic service added successfully!', 'success');
  };

  const handleDelete = () => {
    if (!selectedItem) return;
    
    setClinicServices(clinicServices.filter(cs => cs.uuid !== selectedItem.uuid));
    showToast('Clinic service deleted successfully!', 'success');
    closeModal();
  };

  // Modal handlers
  const handleView = (item: ClinicService) => {
    setSelectedItem(item);
    setModalMode('view');
  };

  const handleEdit = (item: ClinicService) => {
    setSelectedItem(item);
    setModalMode('edit');
  };

  const handleDeleteConfirm = (item: ClinicService) => {
    setSelectedItem(item);
    setModalMode('delete');
  };

  const closeModal = () => {
    setModalMode(null);
    setSelectedItem(null);
    resetClinicServiceForm();
    setFormErrors({});
    setShowCreateModal(false);
  };

  const resetClinicServiceForm = () => {
    setNewClinicService({
      clinic: '',
      service: '',
      rank: '1',
      consultation_charge_video_call: '',
      consultation_charge_home_visit: '',
      treatment_charge_video_call: '',
      treatment_charge_physical_visit: '',
      consultation_charge_physical_visit: '',
      treatment_charge_home_visit: '',
      is_video_call: false,
      is_home_service: false,
      is_clinic_visit: true,
      clinic_provided_name: '',
      image: '',
      description: ''
    });
  };

  // Add state for rank editing
  const [rankEditValue, setRankEditValue] = useState('');

  // Add handler to open rank edit modal
  const handleEditRank = (clinicService: ClinicService) => {
    setSelectedItem(clinicService);
    setRankEditValue(clinicService.rank.toString());
    setModalMode('edit-rank');
  };

  // Add handler to save rank
  const handleSaveRank = () => {
    if (!selectedItem) return;
    setClinicServices(clinicServices.map(cs =>
      cs.uuid === selectedItem.uuid ? { ...cs, rank: parseInt(rankEditValue) } : cs
    ));
    showToast('Rank updated successfully!', 'success');
    closeModal();
  };

  // Service search functions
  const handleOpenServiceSearch = () => {
    setAllServices(mockAllServices);
    setShowServiceSearchModal(true);
  };

  const handleSelectService = (service: Service) => {
    setNewClinicService(prev => ({
      ...prev,
      service: service.uuid
    }));
    setShowServiceSearchModal(false);
    setServiceSearchTerm('');
  };

  const handleRequestService = () => {
    // In a real app, this would send the request to the backend
    console.log('Service Request:', serviceRequest);
    showToast('Service request submitted successfully! We will review and add it soon.', 'success');
    setShowRequestServiceModal(false);
    resetServiceRequest();
  };

  const resetServiceRequest = () => {
    setServiceRequest({
      name: '',
      image: '',
      description: '',
      type: '',
      rates: '',
      additionalInfo: '',
      rank: '1',
      consultation_charge_video_call: '',
      consultation_charge_home_visit: '',
      treatment_charge_video_call: '',
      treatment_charge_physical_visit: '',
      consultation_charge_physical_visit: '',
      treatment_charge_home_visit: '',
      is_video_call: false,
      is_home_service: false,
      is_clinic_visit: true,
      clinic_provided_name: ''
    });
  };

  const filteredAllServices = allServices.filter(service =>
    service.name.toLowerCase().includes(serviceSearchTerm.toLowerCase()) ||
    service.description.toLowerCase().includes(serviceSearchTerm.toLowerCase()) ||
    service.tags.toLowerCase().includes(serviceSearchTerm.toLowerCase())
  );

  // Drag-and-drop handlers
  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const { source, destination } = result;
    if (destination == null) return;
    const reordered = Array.from(filteredClinicServices);
    const [removed] = reordered.splice(source.index, 1);
    reordered.splice(destination.index, 0, removed);
    // Update rank and display_date
    const now = new Date().toISOString();
    const updated = reordered.map((item, idx) => ({
      ...item,
      rank: idx + 1,
      display_date: idx === destination.index ? now : item.display_date,
    }));
    // Update the main clinicServices state
    setClinicServices(
      clinicServices.map(cs => {
        const found = updated.find(u => u.uuid === cs.uuid);
        return found ? { ...cs, rank: found.rank, display_date: found.display_date } : cs;
      })
    );
    showToast('Order updated! Rank and date changed.', 'success');
  };

  // Manual date edit handler
  const handleDateChange = (uuid: string, date: Date) => {
    setClinicServices(clinicServices.map(cs =>
      cs.uuid === uuid ? { ...cs, display_date: date.toISOString() } : cs
    ));
    showToast('Display date updated!', 'success');
  };

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Add state for Apple-style date picker modal
  const [datePickerModal, setDatePickerModal] = useState<{ open: boolean; uuid: string | null; date: Date }>({ open: false, uuid: null, date: new Date() });

  // Prevent background scroll when modal is open
  useEffect(() => {
    if (datePickerModal.open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [datePickerModal.open]);

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
        {/* Header */}
        <div className="backdrop-blur-xl bg-white/80 border-b border-slate-200/60 sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between h-auto sm:h-16 gap-2 sm:gap-0 py-3 sm:py-0"> {/* Responsive layout */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-6 space-y-1 sm:space-y-0"> {/* Responsive spacing */}
                <div>
                  <h1 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-slate-900 via-slate-800 to-slate-600 bg-clip-text text-transparent leading-tight"> {/* Responsive text size */}
                    Service Management
                  </h1>
                  <p className="text-xs sm:text-xs text-slate-500 mt-0.5">
                    Manage your clinic services
                  </p>
                </div>
                {/* Stats Cards: stack on mobile, row on desktop */}
                <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 sm:gap-6 mt-2 sm:mt-0">
                  <div className="flex items-center space-x-2 px-3 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                    <div className="p-1.5 bg-blue-500 rounded-lg">
                      <Settings className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-[10px] text-blue-600 font-medium">Total Services</p>
                      <p className="text-base font-bold text-blue-700">{totalClinicServices}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 px-3 py-2 bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl border border-emerald-100">
                    <div className="p-1.5 bg-emerald-500 rounded-lg">
                      <CheckCircle className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-[10px] text-emerald-600 font-medium">Approved</p>
                      <p className="text-base font-bold text-emerald-700">{approvedClinicServices}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 px-3 py-2 bg-gradient-to-r from-amber-50 to-yellow-50 rounded-xl border border-amber-100">
                    <div className="p-1.5 bg-amber-500 rounded-lg">
                      <Clock className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-[10px] text-amber-600 font-medium">Pending</p>
                      <p className="text-base font-bold text-amber-700">{pendingClinicServices}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 px-3 py-2 bg-gradient-to-r from-red-50 to-pink-50 rounded-xl border border-red-100">
                    <div className="p-1.5 bg-red-500 rounded-lg">
                      <XCircle className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-[10px] text-red-600 font-medium">Rejected</p>
                      <p className="text-base font-bold text-red-700">{rejectedClinicServices}</p>
                    </div>
                  </div>
                </div>
              </div>
              {/* Action Buttons: stack on mobile, row on desktop */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 mt-2 sm:mt-0 w-full sm:w-auto">
                <button
                  onClick={() => setShowRequestServiceModal(true)}
                  className="group relative inline-flex items-center justify-center px-4 py-2 bg-gradient-to-r from-emerald-600 to-green-600 text-white rounded-xl hover:from-emerald-700 hover:to-green-700 transition-all duration-200 shadow-lg hover:shadow-xl font-semibold text-xs sm:text-sm w-full sm:w-auto"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-green-400 rounded-xl blur opacity-30 group-hover:opacity-50 transition-opacity"></div>
                  <Plus className="w-4 h-4 mr-2 relative" />
                  <span className="relative">Request Service</span>
                </button>
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="group relative inline-flex items-center justify-center px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl font-semibold text-xs sm:text-sm w-full sm:w-auto"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-xl blur opacity-30 group-hover:opacity-50 transition-opacity"></div>
                  <Plus className="w-5 h-5 mr-2 relative" />
                  <span className="relative">Add Service</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Filters Section */}
        <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 py-8">
          <div className="bg-white/80 border border-slate-200 rounded-2xl shadow-md p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mb-4">
              {/* Search Bar */}
              <div className="xl:col-span-2">
                <label className="text-xs font-semibold text-slate-600 mb-1 ml-1 block">Search</label>
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search by service name, description, or clinic..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-white/80 backdrop-blur-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all duration-200 text-slate-700 placeholder-slate-400"
                  />
                </div>
              </div>

              {/* View Toggle */}
              <div>
                <label className="text-xs font-semibold text-slate-600 mb-1 ml-1 block">View Mode</label>
                <div className="flex bg-slate-100 rounded-full p-1 shadow-inner border border-slate-200">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`flex items-center gap-1 px-4 py-2 rounded-full font-semibold transition-all duration-150 text-sm ${viewMode === 'grid' ? 'bg-blue-600 text-white shadow' : 'text-blue-700 hover:bg-blue-200/60'}`}
                  >
                    <LayoutGrid className="w-4 h-4" /> Grid
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`flex items-center gap-1 px-4 py-2 rounded-full font-semibold transition-all duration-150 text-sm ${viewMode === 'list' ? 'bg-blue-600 text-white shadow' : 'text-blue-700 hover:bg-blue-200/60'}`}
                  >
                    <ListIcon className="w-4 h-4" /> List
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Services Grid/List */}
          {filteredClinicServices.length === 0 ? (
            <div className="text-center py-20">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-3xl"></div>
                <Settings className="relative w-16 h-16 text-slate-400 mx-auto mb-6" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3">No services found</h3>
              <p className="text-slate-500 text-lg mb-8 max-w-md mx-auto">
                Try adjusting your search terms or add your first service
              </p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg font-semibold"
              >
                <Plus className="w-5 h-5 mr-2" />
                Add Your First Service
              </button>
            </div>
          ) : (
            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable droppableId="clinic-services-droppable" direction={viewMode === 'grid' ? 'horizontal' : 'vertical'}>
                {(provided: DroppableProvided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={viewMode === 'grid' ? 'grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3' : 'flex flex-col gap-4'}
                  >
                    {paginatedData.map((clinicService, idx) => {
                      const statusConfig = getStatusConfig(clinicService.status);
                      const StatusIcon = statusConfig.icon;
                      const ServiceIcon = getServiceIcon(clinicService.service_name);
                      return (
                        <Draggable key={clinicService.uuid} draggableId={clinicService.uuid} index={idx}>
                          {(provided: DraggableProvided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={viewMode === 'grid' ? 'group relative' : 'group relative flex items-center bg-white/90 rounded-xl border border-slate-200/60 shadow-lg hover:shadow-2xl p-4'}
                            >
                              <div className={viewMode === 'grid' ? 'relative bg-white/90 backdrop-blur-xl rounded-2xl border border-slate-200/60 hover:border-slate-300/60 transition-all duration-300 shadow-sm hover:shadow-2xl hover:shadow-slate-200/50 overflow-hidden' : 'flex-1'}>
                                <div className={viewMode === 'grid' ? 'p-6' : ''}>
                                  {/* Header */}
                                  <div className="flex items-start justify-between mb-6">
                                    <div className="flex-1">
                                      <div className="flex items-center space-x-3 mb-2">
                                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center overflow-hidden">
                                          {clinicService.image ? (
                                            <img
                                              src={clinicService.image}
                                              alt={clinicService.service_name}
                                              className="w-full h-full object-cover"
                                            />
                                          ) : (
                                            <ServiceIcon className="w-6 h-6 text-white" />
                                          )}
                                        </div>
                                        <div>
                                          <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors capitalize">
                                            {clinicService.clinic_provided_name || clinicService.service_name}
                                          </h3>
                                          <p className="text-sm text-slate-600">
                                            {getClinicName(clinicService.clinic)}
                                          </p>
                                        </div>
                                      </div>
                                    </div>
                                    
                                    <div className="flex items-center space-x-2">
                                      <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold border ${statusConfig.color}`}>
                                        <StatusIcon className="w-3 h-3 mr-1" />
                                        {clinicService.status}
                                      </span>
                                      <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                                        <MoreHorizontal className="w-4 h-4" />
                                      </button>
                                    </div>
                                  </div>

                                  {/* Description */}
                                  {clinicService.description && (
                                    <div className="mb-6">
                                      <p className="text-slate-700 text-sm line-clamp-3">
                                        {clinicService.description}
                                      </p>
                                    </div>
                                  )}

                                  {/* Charges */}
                                  <div className="mb-6">
                                    <div className="flex flex-wrap gap-2 text-xs text-slate-600">
                                      {clinicService.is_video_call && (
                                        <span className="inline-flex items-center px-2 py-1 bg-blue-50 rounded-lg">
                                          <Video className="w-4 h-4 mr-1 text-blue-500" />
                                          Video: ₹{clinicService.consultation_charge_video_call} / ₹{clinicService.treatment_charge_video_call}
                                        </span>
                                      )}
                                      {clinicService.is_physical_visit && (
                                        <span className="inline-flex items-center px-2 py-1 bg-green-50 rounded-lg">
                                          <Home className="w-4 h-4 mr-1 text-green-500" />
                                          Physical: ₹{clinicService.consultation_charge_physical_visit} / ₹{clinicService.treatment_charge_physical_visit}
                                        </span>
                                      )}
                                      {clinicService.is_home_visit && (
                                        <span className="inline-flex items-center px-2 py-1 bg-amber-50 rounded-lg">
                                          <Building className="w-4 h-4 mr-1 text-amber-500" />
                                          Home: ₹{clinicService.consultation_charge_home_visit} / ₹{clinicService.treatment_charge_home_visit}
                                        </span>
                                      )}
                                    </div>
                                  </div>

                                  {/* Rank Display */}
                                  <div className="mb-6">
                                    <div className="text-center p-4 bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl border border-emerald-100">
                                      <p className="text-2xl font-bold text-emerald-700">{clinicService.rank}</p>
                                      <p className="text-xs text-emerald-600 font-medium">Service Rank</p>
                                    </div>
                                  </div>

                                  {/* Display Date */}
                                  <div className="mb-6">
                                    <div className="flex items-center justify-between">
                                      <span className="text-sm text-slate-600">Display Date:</span>
                                      <button
                                        className="px-3 py-1 rounded-lg bg-slate-100 hover:bg-blue-100 text-xs font-semibold border border-slate-200 transition-all"
                                        onClick={() => setDatePickerModal({ open: true, uuid: clinicService.uuid, date: clinicService.display_date ? new Date(clinicService.display_date) : new Date() })}
                                      >
                                        {clinicService.display_date ? new Date(clinicService.display_date).toLocaleDateString() : 'Set Date'}
                                      </button>
                                    </div>
                                  </div>

                                  {/* Actions */}
                                  <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                                    <div />
                                    <div className="flex items-center space-x-1">
                                      <button 
                                        onClick={() => handleView(clinicService)}
                                        className="p-2.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-200"
                                      >
                                        <Eye className="w-4 h-4" />
                                      </button>
                                      <button 
                                        onClick={() => handleEdit(clinicService)}
                                        className="p-2.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-200"
                                      >
                                        <Edit3 className="w-4 h-4" />
                                      </button>
                                      <button 
                                        onClick={() => handleDeleteConfirm(clinicService)}
                                        className="p-2.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200"
                                      >
                                        <Trash2 className="w-4 h-4" />
                                      </button>
                                      <button 
                                        onClick={() => handleEditRank(clinicService)}
                                        className="p-2.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-200"
                                      >
                                        <Star className="w-4 h-4" />
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      );
                    })}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex flex-wrap justify-center items-center gap-2 mt-8">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 rounded-lg border border-slate-200 bg-white/80 text-slate-700 font-semibold disabled:opacity-50"
              >
                Prev
              </button>
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`px-3 py-2 rounded-lg border border-slate-200 font-semibold ${currentPage === i + 1 ? 'bg-blue-600 text-white' : 'bg-white/80 text-slate-700'}`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 rounded-lg border border-slate-200 bg-white/80 text-slate-700 font-semibold disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Toast Notification */}
      {toast && (
        <div className={`fixed top-6 left-1/2 transform -translate-x-1/2 z-[9999] px-6 py-4 rounded-xl shadow-lg flex items-center space-x-3
          ${toast.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-red-50 text-red-800 border border-red-200'}`}
        >
          {toast.type === 'success' ? <CheckCircle className="w-5 h-5 text-emerald-600" /> : <XCircle className="w-5 h-5 text-red-600" />}
          <span className="font-medium">{toast.message}</span>
        </div>
      )}

      {/* Modal for Add Clinic Service */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-2 sm:p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[95vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="p-4 sm:p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
                Add Clinic Service
              </h2>
              <button
                onClick={closeModal}
                className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 rounded-lg"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            {/* Modal Content */}
            <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
              <form onSubmit={e => { e.preventDefault(); handleCreateClinicService(); }} className="space-y-4 sm:space-y-5">
                {/* Service */}
                <div>
                  <label className="block text-sm font-semibold mb-1 sm:mb-2">Service <span className="text-red-500">*</span></label>
                  <div className="flex flex-col gap-3">
                    {newClinicService.service ? (
                      <div className="flex-1">
                        {/* Selected Service Card */}
                        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-2xl p-3 sm:p-6 shadow-lg hover:shadow-xl transition-all duration-300">
                          <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-6">
                            {/* Service Image */}
                            <div className="flex-shrink-0 mx-auto sm:mx-0">
                              {(() => {
                                const selectedService = mockAllServices.find(s => s.uuid === newClinicService.service);
                                return selectedService?.image ? (
                                  <div className="relative">
                                    <img
                                      src={selectedService.image}
                                      alt={selectedService.name}
                                      className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-xl shadow-md"
                                    />
                                    <div className="absolute -top-1 -right-1 bg-emerald-500 text-white text-xs px-2 py-1 rounded-full font-semibold shadow-lg">
                                      Selected
                                    </div>
                                  </div>
                                ) : (
                                  <div className="relative">
                                    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center shadow-md">
                                      <Activity className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                                    </div>
                                    <div className="absolute -top-1 -right-1 bg-emerald-500 text-white text-xs px-2 py-1 rounded-full font-semibold shadow-lg">
                                      Selected
                                    </div>
                                  </div>
                                );
                              })()}
                            </div>
                            
                            {/* Service Info */}
                            <div className="flex-1 min-w-0 text-center sm:text-left">
                              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-0 mb-2">
                                <h4 className="font-bold text-slate-900 text-base sm:text-lg">
                                  {getServiceName(newClinicService.service)}
                                </h4>
                                <button
                                  type="button"
                                  onClick={handleOpenServiceSearch}
                                  className="px-3 py-1.5 text-xs bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 font-semibold shadow-sm w-fit mx-auto sm:mx-0"
                                >
                                  Change
                                </button>
                              </div>
                              <p className="text-sm text-slate-600 line-clamp-2 mb-3 leading-relaxed">
                                {(() => {
                                  const selectedService = mockAllServices.find(s => s.uuid === newClinicService.service);
                                  return selectedService?.description || 'No description available';
                                })()}
                              </p>
                              
                              {/* Service Tags */}
                              <div className="flex flex-wrap gap-1 justify-center sm:justify-start">
                                {(() => {
                                  const selectedService = mockAllServices.find(s => s.uuid === newClinicService.service);
                                  return selectedService?.tags.split(',').slice(0, 2).map((tag, idx) => (
                                    <span key={idx} className="inline-block px-2 py-1 bg-blue-100 text-blue-700 rounded-lg text-xs font-medium">
                                      #{tag.trim()}
                                    </span>
                                  ));
                                })()}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex-1">
                        <div className="bg-slate-50 border-2 border-dashed border-slate-300 rounded-2xl p-4 sm:p-8 text-center hover:border-slate-400 transition-colors duration-200">
                          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-slate-200 rounded-xl flex items-center justify-center mx-auto mb-3">
                            <Search className="w-6 h-6 sm:w-8 sm:h-8 text-slate-400" />
                          </div>
                          <p className="text-slate-500 text-sm sm:text-base font-medium">
                            No service selected
                          </p>
                          <p className="text-slate-400 text-xs sm:text-sm mt-1">
                            Click "Search Services" to browse available options
                          </p>
                        </div>
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={handleOpenServiceSearch}
                      className="px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 flex items-center justify-center gap-2 text-sm font-semibold shadow-lg hover:shadow-xl"
                    >
                      <Search className="w-4 h-4 sm:w-5 sm:h-5" />
                      {newClinicService.service ? 'Change Service' : 'Search Services'}
                    </button>
                  </div>
                  {formErrors.service && <p className="text-xs text-red-500 mt-2">{formErrors.service}</p>}
                </div>
                {/* Clinic Provided Name (optional) */}
                <div>
                  <label className="block text-sm font-semibold mb-1 sm:mb-2">Clinic Provided Name</label>
                  <input
                    type="text"
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-xl border border-slate-200 bg-white text-slate-700 text-sm sm:text-base"
                    value={newClinicService.clinic_provided_name}
                    onChange={e => setNewClinicService(cs => ({ ...cs, clinic_provided_name: e.target.value }))}
                    placeholder="(Optional) Custom name for this service at the clinic"
                  />
                </div>
                
                {/* Description */}
                <div>
                  <label className="block text-sm font-semibold mb-1 sm:mb-2">Description</label>
                  <textarea
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-xl border border-slate-200 bg-white text-slate-700 text-sm sm:text-base"
                    value={newClinicService.description}
                    onChange={e => setNewClinicService(cs => ({ ...cs, description: e.target.value }))}
                    placeholder="Describe this clinic service..."
                    rows={3}
                  />
                </div>
                
                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-semibold mb-1 sm:mb-2">Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-xl border border-slate-200 bg-white text-slate-700 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 text-sm sm:text-base"
                    onChange={e => {
                      const file = e.target.files?.[0];
                      if (file) {
                        // In a real app, you would upload the file to a server and get back a URL
                        // For now, we'll create a local URL for preview
                        const imageUrl = URL.createObjectURL(file);
                        setNewClinicService(cs => ({ ...cs, image: imageUrl }));
                      }
                    }}
                  />
                </div>
                {/* Rank */}
                <div>
                  <label className="block text-sm font-semibold mb-1 sm:mb-2">Rank <span className="text-red-500">*</span></label>
                  <input
                    type="number"
                    className={`w-full px-3 sm:px-4 py-2 sm:py-3 rounded-xl border ${formErrors.rank ? 'border-red-400' : 'border-slate-200'} bg-white text-slate-700 text-sm sm:text-base`}
                    value={newClinicService.rank}
                    onChange={e => setNewClinicService(cs => ({ ...cs, rank: e.target.value }))}
                    min={1}
                    placeholder="e.g. 1"
                  />
                  {formErrors.rank && <p className="text-xs text-red-500 mt-1">{formErrors.rank}</p>}
                </div>
                {/* Facility Toggles */}
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                  <label className="flex items-center gap-2 text-sm sm:text-base">
                    <input
                      type="checkbox"
                      checked={newClinicService.is_video_call}
                      onChange={e => setNewClinicService(cs => ({ ...cs, is_video_call: e.target.checked }))}
                    /> Video Call
                  </label>
                  <label className="flex items-center gap-2 text-sm sm:text-base">
                    <input
                      type="checkbox"
                      checked={newClinicService.is_clinic_visit}
                      onChange={e => setNewClinicService(cs => ({ ...cs, is_clinic_visit: e.target.checked }))}
                    /> Physical Visit
                  </label>
                  <label className="flex items-center gap-2 text-sm sm:text-base">
                    <input
                      type="checkbox"
                      checked={newClinicService.is_home_service}
                      onChange={e => setNewClinicService(cs => ({ ...cs, is_home_service: e.target.checked }))}
                    /> Home Visit
                  </label>
                </div>
                {/* Charges - show fields as per toggles */}
                {newClinicService.is_video_call && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <label className="block text-sm font-semibold mb-1 sm:mb-2">Consultation Charge (Video Call) <span className="text-red-500">*</span></label>
                      <input
                        type="number"
                        className={`w-full px-3 sm:px-4 py-2 sm:py-3 rounded-xl border ${formErrors.consultation_charge_video_call ? 'border-red-400' : 'border-slate-200'} bg-white text-slate-700 text-sm sm:text-base`}
                        value={newClinicService.consultation_charge_video_call}
                        onChange={e => setNewClinicService(cs => ({ ...cs, consultation_charge_video_call: e.target.value }))}
                        placeholder="e.g. 400"
                      />
                      {formErrors.consultation_charge_video_call && <p className="text-xs text-red-500 mt-1">{formErrors.consultation_charge_video_call}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-1 sm:mb-2">Treatment Charge (Video Call) <span className="text-red-500">*</span></label>
                      <input
                        type="number"
                        className={`w-full px-3 sm:px-4 py-2 sm:py-3 rounded-xl border ${formErrors.treatment_charge_video_call ? 'border-red-400' : 'border-slate-200'} bg-white text-slate-700 text-sm sm:text-base`}
                        value={newClinicService.treatment_charge_video_call}
                        onChange={e => setNewClinicService(cs => ({ ...cs, treatment_charge_video_call: e.target.value }))}
                        placeholder="e.g. 800"
                      />
                      {formErrors.treatment_charge_video_call && <p className="text-xs text-red-500 mt-1">{formErrors.treatment_charge_video_call}</p>}
                    </div>
                  </div>
                )}
                {newClinicService.is_clinic_visit && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <label className="block text-sm font-semibold mb-1 sm:mb-2">Consultation Charge (Physical Visit) <span className="text-red-500">*</span></label>
                      <input
                        type="number"
                        className={`w-full px-3 sm:px-4 py-2 sm:py-3 rounded-xl border ${formErrors.consultation_charge_physical_visit ? 'border-red-400' : 'border-slate-200'} bg-white text-slate-700 text-sm sm:text-base`}
                        value={newClinicService.consultation_charge_physical_visit}
                        onChange={e => setNewClinicService(cs => ({ ...cs, consultation_charge_physical_visit: e.target.value }))}
                        placeholder="e.g. 200"
                      />
                      {formErrors.consultation_charge_physical_visit && <p className="text-xs text-red-500 mt-1">{formErrors.consultation_charge_physical_visit}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-1 sm:mb-2">Treatment Charge (Physical Visit) <span className="text-red-500">*</span></label>
                      <input
                        type="number"
                        className={`w-full px-3 sm:px-4 py-2 sm:py-3 rounded-xl border ${formErrors.treatment_charge_physical_visit ? 'border-red-400' : 'border-slate-200'} bg-white text-slate-700 text-sm sm:text-base`}
                        value={newClinicService.treatment_charge_physical_visit}
                        onChange={e => setNewClinicService(cs => ({ ...cs, treatment_charge_physical_visit: e.target.value }))}
                        placeholder="e.g. 500"
                      />
                      {formErrors.treatment_charge_physical_visit && <p className="text-xs text-red-500 mt-1">{formErrors.treatment_charge_physical_visit}</p>}
                    </div>
                  </div>
                )}
                {newClinicService.is_home_service && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <label className="block text-sm font-semibold mb-1 sm:mb-2">Consultation Charge (Home Visit) <span className="text-red-500">*</span></label>
                      <input
                        type="number"
                        className={`w-full px-3 sm:px-4 py-2 sm:py-3 rounded-xl border ${formErrors.consultation_charge_home_visit ? 'border-red-400' : 'border-slate-200'} bg-white text-slate-700 text-sm sm:text-base`}
                        value={newClinicService.consultation_charge_home_visit}
                        onChange={e => setNewClinicService(cs => ({ ...cs, consultation_charge_home_visit: e.target.value }))}
                        placeholder="e.g. 200"
                      />
                      {formErrors.consultation_charge_home_visit && <p className="text-xs text-red-500 mt-1">{formErrors.consultation_charge_home_visit}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-1 sm:mb-2">Treatment Charge (Home Visit) <span className="text-red-500">*</span></label>
                      <input
                        type="number"
                        className={`w-full px-3 sm:px-4 py-2 sm:py-3 rounded-xl border ${formErrors.treatment_charge_home_visit ? 'border-red-400' : 'border-slate-200'} bg-white text-slate-700 text-sm sm:text-base`}
                        value={newClinicService.treatment_charge_home_visit}
                        onChange={e => setNewClinicService(cs => ({ ...cs, treatment_charge_home_visit: e.target.value }))}
                        placeholder="e.g. 600"
                      />
                      {formErrors.treatment_charge_home_visit && <p className="text-xs text-red-500 mt-1">{formErrors.treatment_charge_home_visit}</p>}
                    </div>
                  </div>
                )}
                <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-2 mt-4 sm:mt-6">
                  <button
                    type="button"
                    className="px-4 sm:px-6 py-2 sm:py-2 rounded-xl bg-slate-200 text-slate-700 font-semibold border border-slate-300 hover:bg-slate-300 transition-all duration-200 text-sm sm:text-base"
                    onClick={closeModal}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 sm:px-6 py-2 sm:py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold shadow hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 text-sm sm:text-base"
                  >
                    Add Clinic Service
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* View Modal */}
      {modalMode === 'view' && selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-2 sm:p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[95vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">View Clinic Service</h2>
              <button onClick={closeModal} className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 rounded-lg" aria-label="Close">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <span className="font-semibold">Service:</span> {getServiceName(selectedItem.service)}
              </div>
              <div>
                <span className="font-semibold">Clinic Provided Name:</span> {selectedItem.clinic_provided_name || '-'}
              </div>
              <div>
                <span className="font-semibold">Rank:</span> {selectedItem.rank}
              </div>
              <div>
                <span className="font-semibold">Description:</span> {selectedItem.description || '-'}
              </div>
              <div>
                <span className="font-semibold">Facilities:</span>
                <ul className="list-disc ml-6">
                  {selectedItem.is_video_call && <li>Video Call</li>}
                  {selectedItem.is_physical_visit && <li>Physical Visit</li>}
                  {selectedItem.is_home_visit && <li>Home Visit</li>}
                </ul>
              </div>
              <div>
                <span className="font-semibold">Charges:</span>
                <ul className="list-disc ml-6">
                  {selectedItem.is_video_call && <li>Consultation (Video): ₹{selectedItem.consultation_charge_video_call}, Treatment (Video): ₹{selectedItem.treatment_charge_video_call}</li>}
                  {selectedItem.is_physical_visit && <li>Consultation (Physical): ₹{selectedItem.consultation_charge_physical_visit}, Treatment (Physical): ₹{selectedItem.treatment_charge_physical_visit}</li>}
                  {selectedItem.is_home_visit && <li>Consultation (Home): ₹{selectedItem.consultation_charge_home_visit}, Treatment (Home): ₹{selectedItem.treatment_charge_home_visit}</li>}
                </ul>
              </div>
              {selectedItem.reason_for_rejection && (
                <div>
                  <span className="font-semibold text-red-500">Reason for Rejection:</span> {selectedItem.reason_for_rejection}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {modalMode === 'edit' && selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-2 sm:p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[95vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Edit Clinic Service</h2>
              <button onClick={closeModal} className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 rounded-lg" aria-label="Close">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-6">
              <form onSubmit={e => {
                e.preventDefault();
                const errors = validateClinicServiceForm();
                setFormErrors(errors);
                if (Object.keys(errors).length > 0) return;
                setClinicServices(clinicServices.map(cs => cs.uuid === selectedItem.uuid ? {
                  ...cs,
                  ...newClinicService,
                  rank: parseInt(newClinicService.rank),
                  service_name: getServiceName(newClinicService.service),
                  is_video_call: newClinicService.is_video_call,
                  is_home_visit: newClinicService.is_home_service,
                  is_physical_visit: newClinicService.is_clinic_visit,
                  image: newClinicService.image || null,
                  description: newClinicService.description || null,
                } : cs));
                closeModal();
                showToast('Clinic service updated successfully!', 'success');
              }} className="space-y-5">
                {/* Service */}
                <div>
                  <label className="block text-sm font-semibold mb-1">Service <span className="text-red-500">*</span></label>
                  <div className="flex gap-2">
                    {newClinicService.service ? (
                      <div className="flex-1">
                        {/* Selected Service Card */}
                        <div className="bg-white border border-slate-200 rounded-xl p-4">
                          <div className="flex items-start space-x-4">
                            {/* Service Image */}
                            <div className="flex-shrink-0">
                              {(() => {
                                const selectedService = mockAllServices.find(s => s.uuid === newClinicService.service);
                                return selectedService?.image ? (
                                  <img
                                    src={selectedService.image}
                                    alt={selectedService.name}
                                    className="w-16 h-16 object-cover rounded-lg"
                                  />
                                ) : (
                                  <div className="w-16 h-16 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg flex items-center justify-center">
                                    <Activity className="w-8 h-8 text-blue-500" />
                                  </div>
                                );
                              })()}
                            </div>
                            
                            {/* Service Info */}
                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold text-slate-900 mb-1">
                                {getServiceName(newClinicService.service)}
                              </h4>
                              <p className="text-sm text-slate-600 line-clamp-2">
                                {(() => {
                                  const selectedService = mockAllServices.find(s => s.uuid === newClinicService.service);
                                  return selectedService?.description || 'No description available';
                                })()}
                              </p>
                            </div>
                            
                            {/* Change Button */}
                            <button
                              type="button"
                              onClick={handleOpenServiceSearch}
                              className="flex-shrink-0 px-3 py-1 text-xs bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-all duration-200"
                            >
                              Change
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-600 flex items-center justify-center">
                        No service selected
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={handleOpenServiceSearch}
                      className="px-4 py-3 bg-blue-50 text-blue-700 rounded-xl border border-blue-200 hover:bg-blue-100 transition-all duration-200 flex items-center gap-2"
                    >
                      <Search className="w-4 h-4" />
                      {newClinicService.service ? 'Change' : 'Search'}
                    </button>
                  </div>
                  {formErrors.service && <p className="text-xs text-red-500 mt-1">{formErrors.service}</p>}
                </div>
                {/* Clinic Provided Name (optional) */}
                <div>
                  <label className="block text-sm font-semibold mb-1 sm:mb-2">Clinic Provided Name</label>
                  <input
                    type="text"
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-xl border border-slate-200 bg-white text-slate-700 text-sm sm:text-base"
                    value={newClinicService.clinic_provided_name}
                    onChange={e => setNewClinicService(cs => ({ ...cs, clinic_provided_name: e.target.value }))}
                    placeholder="(Optional) Custom name for this service at the clinic"
                  />
                </div>
                {/* Description */}
                <div>
                  <label className="block text-sm font-semibold mb-1 sm:mb-2">Description</label>
                  <textarea
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-xl border border-slate-200 bg-white text-slate-700 text-sm sm:text-base"
                    value={newClinicService.description}
                    onChange={e => setNewClinicService(cs => ({ ...cs, description: e.target.value }))}
                    placeholder="Describe this clinic service..."
                    rows={3}
                  />
                </div>
                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-semibold mb-1 sm:mb-2">Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-xl border border-slate-200 bg-white text-slate-700 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 text-sm sm:text-base"
                    onChange={e => {
                      const file = e.target.files?.[0];
                      if (file) {
                        // In a real app, you would upload the file to a server and get back a URL
                        // For now, we'll create a local URL for preview
                        const imageUrl = URL.createObjectURL(file);
                        setNewClinicService(cs => ({ ...cs, image: imageUrl }));
                      }
                    }}
                  />
                </div>
                {/* Rank */}
                <div>
                  <label className="block text-sm font-semibold mb-1 sm:mb-2">Rank <span className="text-red-500">*</span></label>
                  <input
                    type="number"
                    className={`w-full px-3 sm:px-4 py-2 sm:py-3 rounded-xl border ${formErrors.rank ? 'border-red-400' : 'border-slate-200'} bg-white text-slate-700 text-sm sm:text-base`}
                    value={newClinicService.rank}
                    onChange={e => setNewClinicService(cs => ({ ...cs, rank: e.target.value }))}
                    min={1}
                    placeholder="e.g. 1"
                  />
                  {formErrors.rank && <p className="text-xs text-red-500 mt-1">{formErrors.rank}</p>}
                </div>
                {/* Facility Toggles */}
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                  <label className="flex items-center gap-2 text-sm sm:text-base">
                    <input
                      type="checkbox"
                      checked={newClinicService.is_video_call}
                      onChange={e => setNewClinicService(cs => ({ ...cs, is_video_call: e.target.checked }))}
                    /> Video Call
                  </label>
                  <label className="flex items-center gap-2 text-sm sm:text-base">
                    <input
                      type="checkbox"
                      checked={newClinicService.is_clinic_visit}
                      onChange={e => setNewClinicService(cs => ({ ...cs, is_clinic_visit: e.target.checked }))}
                    /> Physical Visit
                  </label>
                  <label className="flex items-center gap-2 text-sm sm:text-base">
                    <input
                      type="checkbox"
                      checked={newClinicService.is_home_service}
                      onChange={e => setNewClinicService(cs => ({ ...cs, is_home_service: e.target.checked }))}
                    /> Home Visit
                  </label>
                </div>
                {/* Charges - show fields as per toggles */}
                {newClinicService.is_video_call && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <label className="block text-sm font-semibold mb-1 sm:mb-2">Consultation Charge (Video Call) <span className="text-red-500">*</span></label>
                      <input
                        type="number"
                        className={`w-full px-3 sm:px-4 py-2 sm:py-3 rounded-xl border ${formErrors.consultation_charge_video_call ? 'border-red-400' : 'border-slate-200'} bg-white text-slate-700 text-sm sm:text-base`}
                        value={newClinicService.consultation_charge_video_call}
                        onChange={e => setNewClinicService(cs => ({ ...cs, consultation_charge_video_call: e.target.value }))}
                        placeholder="e.g. 400"
                      />
                      {formErrors.consultation_charge_video_call && <p className="text-xs text-red-500 mt-1">{formErrors.consultation_charge_video_call}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-1 sm:mb-2">Treatment Charge (Video Call) <span className="text-red-500">*</span></label>
                      <input
                        type="number"
                        className={`w-full px-3 sm:px-4 py-2 sm:py-3 rounded-xl border ${formErrors.treatment_charge_video_call ? 'border-red-400' : 'border-slate-200'} bg-white text-slate-700 text-sm sm:text-base`}
                        value={newClinicService.treatment_charge_video_call}
                        onChange={e => setNewClinicService(cs => ({ ...cs, treatment_charge_video_call: e.target.value }))}
                        placeholder="e.g. 800"
                      />
                      {formErrors.treatment_charge_video_call && <p className="text-xs text-red-500 mt-1">{formErrors.treatment_charge_video_call}</p>}
                    </div>
                  </div>
                )}
                {newClinicService.is_clinic_visit && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <label className="block text-sm font-semibold mb-1 sm:mb-2">Consultation Charge (Physical Visit) <span className="text-red-500">*</span></label>
                      <input
                        type="number"
                        className={`w-full px-3 sm:px-4 py-2 sm:py-3 rounded-xl border ${formErrors.consultation_charge_physical_visit ? 'border-red-400' : 'border-slate-200'} bg-white text-slate-700 text-sm sm:text-base`}
                        value={newClinicService.consultation_charge_physical_visit}
                        onChange={e => setNewClinicService(cs => ({ ...cs, consultation_charge_physical_visit: e.target.value }))}
                        placeholder="e.g. 200"
                      />
                      {formErrors.consultation_charge_physical_visit && <p className="text-xs text-red-500 mt-1">{formErrors.consultation_charge_physical_visit}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-1 sm:mb-2">Treatment Charge (Physical Visit) <span className="text-red-500">*</span></label>
                      <input
                        type="number"
                        className={`w-full px-3 sm:px-4 py-2 sm:py-3 rounded-xl border ${formErrors.treatment_charge_physical_visit ? 'border-red-400' : 'border-slate-200'} bg-white text-slate-700 text-sm sm:text-base`}
                        value={newClinicService.treatment_charge_physical_visit}
                        onChange={e => setNewClinicService(cs => ({ ...cs, treatment_charge_physical_visit: e.target.value }))}
                        placeholder="e.g. 500"
                      />
                      {formErrors.treatment_charge_physical_visit && <p className="text-xs text-red-500 mt-1">{formErrors.treatment_charge_physical_visit}</p>}
                    </div>
                  </div>
                )}
                {newClinicService.is_home_service && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <label className="block text-sm font-semibold mb-1 sm:mb-2">Consultation Charge (Home Visit) <span className="text-red-500">*</span></label>
                      <input
                        type="number"
                        className={`w-full px-3 sm:px-4 py-2 sm:py-3 rounded-xl border ${formErrors.consultation_charge_home_visit ? 'border-red-400' : 'border-slate-200'} bg-white text-slate-700 text-sm sm:text-base`}
                        value={newClinicService.consultation_charge_home_visit}
                        onChange={e => setNewClinicService(cs => ({ ...cs, consultation_charge_home_visit: e.target.value }))}
                        placeholder="e.g. 200"
                      />
                      {formErrors.consultation_charge_home_visit && <p className="text-xs text-red-500 mt-1">{formErrors.consultation_charge_home_visit}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-1 sm:mb-2">Treatment Charge (Home Visit) <span className="text-red-500">*</span></label>
                      <input
                        type="number"
                        className={`w-full px-3 sm:px-4 py-2 sm:py-3 rounded-xl border ${formErrors.treatment_charge_home_visit ? 'border-red-400' : 'border-slate-200'} bg-white text-slate-700 text-sm sm:text-base`}
                        value={newClinicService.treatment_charge_home_visit}
                        onChange={e => setNewClinicService(cs => ({ ...cs, treatment_charge_home_visit: e.target.value }))}
                        placeholder="e.g. 600"
                      />
                      {formErrors.treatment_charge_home_visit && <p className="text-xs text-red-500 mt-1">{formErrors.treatment_charge_home_visit}</p>}
                    </div>
                  </div>
                )}
                <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-2 mt-4 sm:mt-6">
                  <button
                    type="button"
                    className="px-4 sm:px-6 py-2 sm:py-2 rounded-xl bg-slate-200 text-slate-700 font-semibold border border-slate-300 hover:bg-slate-300 transition-all duration-200 text-sm sm:text-base"
                    onClick={closeModal}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 sm:px-6 py-2 sm:py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold shadow hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 text-sm sm:text-base"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {modalMode === 'delete' && selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-2 sm:p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md max-h-[95vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Confirm Delete</h2>
              <button onClick={closeModal} className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 rounded-lg" aria-label="Close">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-6">
              <p className="text-slate-700 text-lg">Are you sure you want to delete this clinic service?</p>
              <div className="flex justify-end gap-2 mt-6">
                <button
                  type="button"
                  className="px-6 py-2 rounded-xl bg-slate-200 text-slate-700 font-semibold border border-slate-300 hover:bg-slate-300 transition-all duration-200"
                  onClick={closeModal}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="px-6 py-2 rounded-xl bg-gradient-to-r from-red-600 to-pink-600 text-white font-semibold shadow hover:from-red-700 hover:to-pink-700 transition-all duration-200"
                  onClick={handleDelete}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Rank Modal */}
      {modalMode === 'edit-rank' && selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-2 sm:p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md max-h-[95vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Edit Rank</h2>
              <button onClick={closeModal} className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 rounded-lg" aria-label="Close">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-6">
              <label className="block text-sm font-semibold mb-1">Rank</label>
              <input
                type="number"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-700"
                value={rankEditValue}
                onChange={e => setRankEditValue(e.target.value)}
                min={1}
              />
              <div className="flex justify-end gap-2 mt-6">
                <button
                  type="button"
                  className="px-6 py-2 rounded-xl bg-slate-200 text-slate-700 font-semibold border border-slate-300 hover:bg-slate-300 transition-all duration-200"
                  onClick={closeModal}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="px-6 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold shadow hover:from-blue-700 hover:to-indigo-700 transition-all duration-200"
                  onClick={handleSaveRank}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Service Search Modal */}
      {showServiceSearchModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-2 sm:p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="p-4 sm:p-6 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-1">Search & Select Services</h2>
                <p className="text-sm text-gray-600">Browse available services or request a new one</p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    setShowServiceSearchModal(false);
                    setShowRequestServiceModal(true);
                  }}
                  className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-emerald-600 to-green-600 text-white rounded-xl hover:from-emerald-700 hover:to-green-700 transition-all duration-200 text-sm font-semibold shadow-lg"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Request New Service
                </button>
                <button
                  onClick={() => setShowServiceSearchModal(false)}
                  className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
                  aria-label="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            {/* Search Bar */}
            <div className="p-4 sm:p-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
              <div className="relative max-w-2xl mx-auto">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search services by name, description, or tags... (e.g., 'cardiology', 'heart', 'skin')"
                  value={serviceSearchTerm}
                  onChange={(e) => setServiceSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-white/90 backdrop-blur-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all duration-200 text-slate-700 placeholder-slate-400 text-base shadow-sm"
                />
                {serviceSearchTerm && (
                  <button
                    onClick={() => setServiceSearchTerm('')}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
              <div className="mt-3 text-center">
                <p className="text-sm text-slate-600">
                  Found <span className="font-semibold text-blue-600">{filteredAllServices.length}</span> services
                  {serviceSearchTerm && (
                    <span> matching "<span className="font-medium">{serviceSearchTerm}</span>"</span>
                  )}
                </p>
              </div>
            </div>

            {/* Services Grid */}
            <div className="p-4 sm:p-6">
              {filteredAllServices.length === 0 ? (
                <div className="text-center py-12 sm:py-16">
                  <div className="relative mb-6">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-3xl"></div>
                    <Search className="relative w-16 h-16 text-slate-400 mx-auto" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-semibold text-slate-900 mb-3">No services found</h3>
                  <p className="text-slate-500 text-base sm:text-lg mb-8 max-w-md mx-auto">
                    {serviceSearchTerm 
                      ? `No services match "${serviceSearchTerm}". Try different keywords or request a new service.`
                      : "No services available. Request a new service to get started."
                    }
                  </p>
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <button
                      onClick={() => setServiceSearchTerm('')}
                      className="px-6 py-3 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 transition-all duration-200 font-semibold"
                    >
                      Clear Search
                    </button>
                    <button
                      onClick={() => {
                        setShowServiceSearchModal(false);
                        setShowRequestServiceModal(true);
                      }}
                      className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg font-semibold"
                    >
                      <Plus className="w-5 h-5 mr-2" />
                      Request a New Service
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Quick Filters */}
                  <div className="flex flex-wrap gap-2">
                    <span className="text-sm font-medium text-slate-700 mr-2">Quick filters:</span>
                    {['cardiology', 'dermatology', 'neurology', 'orthopedics'].map((tag) => (
                      <button
                        key={tag}
                        onClick={() => setServiceSearchTerm(tag)}
                        className="px-3 py-1 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors text-sm font-medium capitalize"
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                  
                  {/* Services Grid */}
                  <div className="grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
                    {paginatedData.map((clinicService, idx) => {
                      const statusConfig = getStatusConfig(clinicService.status);
                      const StatusIcon = statusConfig.icon;
                      const ServiceIcon = getServiceIcon(clinicService.service_name);
                      return (
                        <div key={clinicService.uuid} className="group relative">
                          <div className="relative bg-white/90 backdrop-blur-xl rounded-2xl border border-slate-200/60 hover:border-slate-300/60 transition-all duration-300 shadow-sm hover:shadow-2xl overflow-hidden">
                            <div className="p-6">
                              {/* Header */}
                              <div className="flex items-start justify-between mb-4 sm:mb-6">
                                <div className="flex-1">
                                  <div className="flex items-center space-x-3 mb-2 sm:mb-3">
                                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-slate-100 to-slate-200 rounded-xl flex items-center justify-center overflow-hidden">
                                      {clinicService.image ? (
                                        <img
                                          src={clinicService.image}
                                          alt={clinicService.service_name}
                                          className="w-full h-full object-cover"
                                        />
                                      ) : (
                                        <div className="w-full h-full bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center">
                                          <span className="text-slate-400 text-xs font-medium">No Image</span>
                                        </div>
                                      )}
                                    </div>
                                    <div>
                                      <h3 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors capitalize">
                                        {clinicService.clinic_provided_name || clinicService.service_name}
                                      </h3>
                                      <p className="text-sm text-slate-600">
                                        {getClinicName(clinicService.clinic)}
                                      </p>
                                    </div>
                                  </div>
                                  <div className={`inline-flex items-center px-2 py-1 rounded-lg border text-xs font-semibold ${statusConfig.color} space-x-2`}>
                                    <span className={`w-2 h-2 rounded-full ${statusConfig.dot}`}></span>
                                    <StatusIcon className="w-4 h-4" />
                                    <span>{clinicService.status}</span>
                                  </div>
                                </div>
                              </div>
                              {/* Description */}
                              {clinicService.description && (
                                <div className="mb-4">
                                  <p className="text-slate-700 text-sm line-clamp-3">
                                    {clinicService.description}
                                  </p>
                                </div>
                              )}
                              {/* Charges */}
                              <div className="mb-4">
                                <div className="flex flex-wrap gap-2 text-xs text-slate-600">
                                  {clinicService.is_video_call && (
                                    <span className="inline-flex items-center px-2 py-1 bg-blue-50 rounded-lg">
                                      <Video className="w-4 h-4 mr-1 text-blue-500" />
                                      Video: ₹{clinicService.consultation_charge_video_call} / ₹{clinicService.treatment_charge_video_call}
                                    </span>
                                  )}
                                  {clinicService.is_physical_visit && (
                                    <span className="inline-flex items-center px-2 py-1 bg-green-50 rounded-lg">
                                      <Home className="w-4 h-4 mr-1 text-green-500" />
                                      Physical: ₹{clinicService.consultation_charge_physical_visit} / ₹{clinicService.treatment_charge_physical_visit}
                                    </span>
                                  )}
                                  {clinicService.is_home_visit && (
                                    <span className="inline-flex items-center px-2 py-1 bg-amber-50 rounded-lg">
                                      <Building className="w-4 h-4 mr-1 text-amber-500" />
                                      Home: ₹{clinicService.consultation_charge_home_visit} / ₹{clinicService.treatment_charge_home_visit}
                                    </span>
                                  )}
                                </div>
                              </div>
                              {/* Actions */}
                              <div className="flex items-center justify-between">
                                <button onClick={() => handleView(clinicService)} className="inline-flex items-center px-3 py-2 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 transition-all text-xs font-semibold">
                                  <Eye className="w-4 h-4 mr-1" /> View
                                </button>
                                <div className="flex space-x-2">
                                  <button onClick={() => handleEdit(clinicService)} className="inline-flex items-center px-3 py-2 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-all text-xs font-semibold">
                                    <Edit3 className="w-4 h-4 mr-1" /> Edit
                                  </button>
                                  <button onClick={() => handleDeleteConfirm(clinicService)} className="inline-flex items-center px-3 py-2 rounded-lg bg-red-50 text-red-700 hover:bg-red-100 transition-all text-xs font-semibold">
                                    <Trash2 className="w-4 h-4 mr-1" /> Delete
                                  </button>
                                  <button onClick={() => handleEditRank(clinicService)} className="inline-flex items-center px-3 py-2 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 transition-all text-xs font-semibold">
                                    <Edit3 className="w-4 h-4 mr-1" /> Edit Rank
                                  </button>
                                </div>
                              </div>
                              {/* Display Date (manual edit) */}
                              <div className="mt-2 mb-2 flex items-center gap-2">
                                <span className="text-xs text-slate-500">Display Date:</span>
                                <button
                                  className="px-2 py-1 rounded bg-slate-100 hover:bg-blue-100 text-xs font-semibold border border-slate-200 transition-all"
                                  onClick={() => setDatePickerModal({ open: true, uuid: clinicService.uuid, date: clinicService.display_date ? new Date(clinicService.display_date) : new Date() })}
                                >
                                  {clinicService.display_date ? new Date(clinicService.display_date).toLocaleDateString() : 'Set Date'}
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Request a Service Modal */}
      {showRequestServiceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-2 sm:p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[95vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Request a Service</h2>
              <button
                onClick={() => {
                  setShowRequestServiceModal(false);
                  resetServiceRequest();
                }}
                className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 rounded-lg"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
              <form onSubmit={e => { e.preventDefault(); handleRequestService(); }} className="space-y-4 sm:space-y-5">
                {/* Name of Service */}
                <div>
                  <label className="block text-sm font-semibold mb-1 sm:mb-2">Name of Service <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    required
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-xl border border-slate-200 bg-white text-slate-700 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 text-sm sm:text-base"
                    value={serviceRequest.name}
                    onChange={e => setServiceRequest(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g. Dermatology, Cardiology"
                  />
                </div>

                {/* Clinic Provided Name (optional) */}
                <div>
                  <label className="block text-sm font-semibold mb-1 sm:mb-2">Clinic Provided Name</label>
                  <input
                    type="text"
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-xl border border-slate-200 bg-white text-slate-700 text-sm sm:text-base"
                    value={serviceRequest.clinic_provided_name}
                    onChange={e => setServiceRequest(prev => ({ ...prev, clinic_provided_name: e.target.value }))}
                    placeholder="(Optional) Custom name for this service at the clinic"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-semibold mb-1 sm:mb-2">Description <span className="text-red-500">*</span></label>
                  <textarea
                    required
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-xl border border-slate-200 bg-white text-slate-700 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 text-sm sm:text-base"
                    value={serviceRequest.description}
                    onChange={e => setServiceRequest(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe the service in detail..."
                    rows={3}
                  />
                </div>

                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-semibold mb-1 sm:mb-2">Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-xl border border-slate-200 bg-white text-slate-700 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 text-sm sm:text-base"
                    onChange={e => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const imageUrl = URL.createObjectURL(file);
                        setServiceRequest(prev => ({ ...prev, image: imageUrl }));
                      }
                    }}
                  />
                </div>

                {/* Rank */}
                <div>
                  <label className="block text-sm font-semibold mb-1 sm:mb-2">Rank <span className="text-red-500">*</span></label>
                  <input
                    type="number"
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-xl border border-slate-200 bg-white text-slate-700 text-sm sm:text-base"
                    value={serviceRequest.rank}
                    onChange={e => setServiceRequest(prev => ({ ...prev, rank: e.target.value }))}
                    min={1}
                    placeholder="e.g. 1"
                  />
                </div>

                {/* Facility Toggles */}
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                  <label className="flex items-center gap-2 text-sm sm:text-base">
                    <input
                      type="checkbox"
                      checked={serviceRequest.is_video_call}
                      onChange={e => setServiceRequest(prev => ({ ...prev, is_video_call: e.target.checked }))}
                    /> Video Call
                  </label>
                  <label className="flex items-center gap-2 text-sm sm:text-base">
                    <input
                      type="checkbox"
                      checked={serviceRequest.is_clinic_visit}
                      onChange={e => setServiceRequest(prev => ({ ...prev, is_clinic_visit: e.target.checked }))}
                    /> Physical Visit
                  </label>
                  <label className="flex items-center gap-2 text-sm sm:text-base">
                    <input
                      type="checkbox"
                      checked={serviceRequest.is_home_service}
                      onChange={e => setServiceRequest(prev => ({ ...prev, is_home_service: e.target.checked }))}
                    /> Home Visit
                  </label>
                </div>

                {/* Charges - show fields as per toggles */}
                {serviceRequest.is_video_call && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <label className="block text-sm font-semibold mb-1 sm:mb-2">Consultation Charge (Video Call) <span className="text-red-500">*</span></label>
                      <input
                        type="number"
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-xl border border-slate-200 bg-white text-slate-700 text-sm sm:text-base"
                        value={serviceRequest.consultation_charge_video_call}
                        onChange={e => setServiceRequest(prev => ({ ...prev, consultation_charge_video_call: e.target.value }))}
                        placeholder="e.g. 400"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-1 sm:mb-2">Treatment Charge (Video Call) <span className="text-red-500">*</span></label>
                      <input
                        type="number"
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-xl border border-slate-200 bg-white text-slate-700 text-sm sm:text-base"
                        value={serviceRequest.treatment_charge_video_call}
                        onChange={e => setServiceRequest(prev => ({ ...prev, treatment_charge_video_call: e.target.value }))}
                        placeholder="e.g. 800"
                      />
                    </div>
                  </div>
                )}
                {serviceRequest.is_clinic_visit && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <label className="block text-sm font-semibold mb-1 sm:mb-2">Consultation Charge (Physical Visit) <span className="text-red-500">*</span></label>
                      <input
                        type="number"
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-xl border border-slate-200 bg-white text-slate-700 text-sm sm:text-base"
                        value={serviceRequest.consultation_charge_physical_visit}
                        onChange={e => setServiceRequest(prev => ({ ...prev, consultation_charge_physical_visit: e.target.value }))}
                        placeholder="e.g. 200"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-1 sm:mb-2">Treatment Charge (Physical Visit) <span className="text-red-500">*</span></label>
                      <input
                        type="number"
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-xl border border-slate-200 bg-white text-slate-700 text-sm sm:text-base"
                        value={serviceRequest.treatment_charge_physical_visit}
                        onChange={e => setServiceRequest(prev => ({ ...prev, treatment_charge_physical_visit: e.target.value }))}
                        placeholder="e.g. 500"
                      />
                    </div>
                  </div>
                )}
                {serviceRequest.is_home_service && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <label className="block text-sm font-semibold mb-1 sm:mb-2">Consultation Charge (Home Visit) <span className="text-red-500">*</span></label>
                      <input
                        type="number"
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-xl border border-slate-200 bg-white text-slate-700 text-sm sm:text-base"
                        value={serviceRequest.consultation_charge_home_visit}
                        onChange={e => setServiceRequest(prev => ({ ...prev, consultation_charge_home_visit: e.target.value }))}
                        placeholder="e.g. 200"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-1 sm:mb-2">Treatment Charge (Home Visit) <span className="text-red-500">*</span></label>
                      <input
                        type="number"
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-xl border border-slate-200 bg-white text-slate-700 text-sm sm:text-base"
                        value={serviceRequest.treatment_charge_home_visit}
                        onChange={e => setServiceRequest(prev => ({ ...prev, treatment_charge_home_visit: e.target.value }))}
                        placeholder="e.g. 600"
                      />
                    </div>
                  </div>
                )}

                {/* Type of Service */}
                <div>
                  <label className="block text-sm font-semibold mb-1 sm:mb-2">Type of Service <span className="text-red-500">*</span></label>
                  <select
                    required
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-xl border border-slate-200 bg-white text-slate-700 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 text-sm sm:text-base"
                    value={serviceRequest.type}
                    onChange={e => setServiceRequest(prev => ({ ...prev, type: e.target.value }))}
                  >
                    <option value="">Select Service Type</option>
                    <option value="medical">Medical</option>
                    <option value="surgical">Surgical</option>
                    <option value="diagnostic">Diagnostic</option>
                    <option value="therapeutic">Therapeutic</option>
                    <option value="preventive">Preventive</option>
                    <option value="rehabilitative">Rehabilitative</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                {/* Additional Information */}
                <div>
                  <label className="block text-sm font-semibold mb-1 sm:mb-2">Additional Information</label>
                  <textarea
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-xl border border-slate-200 bg-white text-slate-700 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 text-sm sm:text-base"
                    value={serviceRequest.additionalInfo}
                    onChange={e => setServiceRequest(prev => ({ ...prev, additionalInfo: e.target.value }))}
                    placeholder="Any additional details, requirements, or special considerations..."
                    rows={2}
                  />
                </div>

                {/* Submit Buttons */}
                <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowRequestServiceModal(false);
                      resetServiceRequest();
                    }}
                    className="px-4 sm:px-6 py-2 sm:py-2 rounded-xl bg-slate-200 text-slate-700 font-semibold border border-slate-300 hover:bg-slate-300 transition-all duration-200 text-sm sm:text-base"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 sm:px-6 py-2 sm:py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold shadow hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 text-sm sm:text-base"
                  >
                    Submit Request
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Apple-style Date Picker Modal */}
      {datePickerModal.open && (
        <DatePickerModal
          date={datePickerModal.date}
          onClose={() => setDatePickerModal({ open: false, uuid: null, date: new Date() })}
          onSave={date => {
            if (datePickerModal.uuid) handleDateChange(datePickerModal.uuid, date);
            setDatePickerModal({ open: false, uuid: null, date: new Date() });
          }}
          originalDate={(() => {
            const svc = clinicServices.find(cs => cs.uuid === datePickerModal.uuid);
            return svc?.display_date ? new Date(svc.display_date) : null;
          })()}
        />
      )}
    </>
  );
};

// Apple-style Date Picker Modal component
function DatePickerModal({ date, onClose, onSave, originalDate }: { date: Date, onClose: () => void, onSave: (date: Date) => void, originalDate: Date | null }) {
  const modalRef = useRef<HTMLDivElement>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(date);
  const [error, setError] = useState<string | null>(null);
  // Trap focus
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'Tab' && modalRef.current) {
        const focusable = modalRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        } else if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      }
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [onClose]);
  // Focus modal on open
  useEffect(() => { modalRef.current?.focus(); }, []);

  // Validation: only allow today or future, and must be different from original
  const today = startOfDay(new Date());
  const isPast = isBefore(startOfDay(selectedDate), today);
  const isSame = originalDate && startOfDay(selectedDate).getTime() === startOfDay(originalDate).getTime();
  useEffect(() => {
    if (isPast) setError('Date cannot be in the past.');
    else setError(null);
  }, [selectedDate, isPast]);

  return (
    <div className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center">
      {/* Blurred, darkened backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-[6px] transition-all" onClick={onClose}></div>
      {/* Modal */}
      <div
        ref={modalRef}
        tabIndex={-1}
        className="relative w-full max-w-md mx-auto p-0 flex flex-col items-center animate-appleBounce focus:outline-none sm:mt-0 mt-auto mb-0 sm:mb-0"
        style={{ minHeight: '380px' }}
      >
        <div className="relative w-full bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-slate-100 p-6 flex flex-col items-center">
          <button
            className="absolute top-3 right-3 text-slate-400 hover:text-slate-600 rounded-full p-2 focus:outline-none"
            onClick={onClose}
            aria-label="Close"
            style={{ WebkitTapHighlightColor: 'transparent' }}
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 mb-4">
            <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 shadow-sm">
              <CalendarIcon className="w-5 h-5 text-blue-600" />
            </span>
            <h3 className="text-lg font-bold text-slate-900">Select Display Date</h3>
          </div>
          <div className="w-full flex flex-col items-center">
            <DatePicker
              selected={selectedDate}
              onChange={d => d && setSelectedDate(d as Date)}
              inline
              calendarClassName="!w-full !text-lg !p-2 !rounded-2xl !border !border-slate-200 !bg-white/80 !backdrop-blur"
              dayClassName={d =>
                d && selectedDate && d.toDateString() === selectedDate.toDateString()
                  ? '!bg-blue-600 !text-white !rounded-full !font-bold !shadow-lg'
                  : '!rounded-full hover:!bg-blue-100 focus:!bg-blue-200 transition-colors duration-150'
              }
            />
            <button
              className="mt-2 mb-4 px-6 py-2 rounded-full bg-blue-100 hover:bg-blue-200 text-blue-700 font-semibold text-base shadow transition-all duration-150 active:scale-95"
              onClick={() => setSelectedDate(today)}
              type="button"
              style={{ WebkitTapHighlightColor: 'transparent' }}
            >
              Today
            </button>
          </div>
          {error && <div className="text-red-500 text-sm mt-1 mb-2">{error}</div>}
          <div className="w-full border-t border-slate-200 my-4"></div>
          <button
            className={`w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold text-base shadow-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 active:scale-95 ${isSame || isPast ? 'opacity-60 cursor-not-allowed' : ''}`}
            onClick={() => { if (!isSame && !isPast) onSave(selectedDate); }}
            disabled={isSame || isPast}
            style={{ WebkitTapHighlightColor: 'transparent' }}
          >
            Save
          </button>
        </div>
        <style>{`
          @keyframes appleBounce {
            0% { opacity: 0; transform: scale(0.92) translateY(60px); }
            60% { opacity: 1; transform: scale(1.04) translateY(-8px); }
            100% { opacity: 1; transform: scale(1) translateY(0); }
          }
          .animate-appleBounce { animation: appleBounce 0.32s cubic-bezier(.4,1.4,.6,1) both; }
        `}</style>
      </div>
    </div>
  );
}

export default ServiceManagement;