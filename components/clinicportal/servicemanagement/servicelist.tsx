import React, { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import {
  Search,
  Plus,
  Edit3,
  Eye,
  Trash2,
  Settings,
  CheckCircle,
  AlertCircle,
  Clock,
  X,
  Heart,
  Stethoscope,
  Brain,
  Activity,
  Video,
  Home,
  Building,
  Tag,
  Image,
  XCircle,
  Building2,
  LayoutGrid,
  List as ListIcon,
  Calendar as CalendarIcon,
  Upload
} from 'lucide-react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import type { DraggableProvided, DroppableProvided } from 'react-beautiful-dnd';
import { isBefore, startOfDay } from 'date-fns';
import { Clinic_by_clinic_user, createClinicService, deleteClinicService, GetAllClinicService, GetAllServiceForClinic, getClinicServiceStaticData, requestNewService, updateClinicService, updateRankClinicService } from '@/service/clinic/serviceManagementService';
import { uploadFiles } from '@/service/uploadService/uploadService';

// Types
interface Service {
  uuid: string;
  created_by: string;
  name: string;
  description: string;
  tags: string;
  image: string | null;
  status: 'APPROVED' | 'PENDING' | 'REJECTED' | 'DRAFT';
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
  status: 'APPROVED' | 'PENDING' | 'REJECTED' | 'DRAFT';
  is_video_call: boolean;
  is_home_visit: boolean;
  is_physical_visit: boolean;
  image: string | null;
  description: string | null;
  reason_for_rejection: string | null;
  display_date: string
  clinic_name?: string
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
  is_home_visit: boolean;
  is_physical_visit: boolean;
  clinic_provided_name: string;
  image: string;
  description: string;
  start_time: string;
  max_bookings: number;
}

// Minimal shape for clinic returned by Clinic_by_clinic_user
interface ClinicUserMinimal {
  uuid: string;
  [key: string]: any;
}

// Sample data
const sampleClinics = [
  { uuid: "5a1f8f39-ca38-464c-93c5-ea8edbd6c03f", name: "City General Hospital" },
  { uuid: "b2c8f4d1-4a5b-4c7d-8e9f-1a2b3c4d5e6f", name: "Metro Medical Center" },
  { uuid: "c3d9f5e2-5b6c-5d8e-9f0g-2b3c4d5e6f7g", name: "Downtown Clinic" },
  { uuid: "d4e5f6g7-h8i9-j0k1-l2m3-n4o5p6q7r8s9", name: "Sunrise Specialty Clinic" },
  { uuid: "e5f6g7h8-i9j0-k1l2-m3n4-o5p6q7r8s9t0", name: "Lakeside Health Center" }
];

const ServiceManagement: React.FC = () => {
  // Session management
  const { data: session } = useSession();

  const [dashData, setDashData] = useState<any>()
  // State management
  const [clinicUser, setClinicUser] = useState<ClinicUserMinimal | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [clinicServices, setClinicServices] = useState<ClinicService[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

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
  const [servicePagination, setServicePagination] = useState({
    current_page: 1,
    total_pages: 1,
    total_items: 0,
    has_more: false
  });
  const [loadingMoreServices, setLoadingMoreServices] = useState(false);


  // Service request states
  const [serviceRequest, setServiceRequest] = useState({
    name: '',
    description: '',
    tags: '',
    image: ""
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
    is_home_visit: false,
    is_physical_visit: false,
    clinic_provided_name: '',
    image: '',
    description: '',
    start_time: '',
    max_bookings: 0
  });

  // Validation state
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);
  const [paginationData, setPaginationData] = useState({
    current_page: 1,
    total_pages: 1,
    total_items: 0,
    next: null as string | null,
    previous: null as string | null
  });

  // Add after state declarations
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  // Add state for filters
  const [statusFilter, setStatusFilter] = useState<string>('');

  const handleServiceScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;

    // Load more when 80% scrolled and there are more pages to load
    if (scrollTop + clientHeight >= scrollHeight - 100 &&
      servicePagination.has_more &&
      !loadingMoreServices &&
      !isLoadingServices) {
      handleServiceSearch(servicePagination.current_page + 1, serviceSearchTerm, true);
    }
  };

  // Modify the fetchService function to use parameters
  const fetchService = async (pageNum: number = currentPage, searchText: string = searchTerm, status: string = statusFilter) => {
    try {
      // Get clinic for current user first
      setLoading(true);
      const clinicUserData = await Clinic_by_clinic_user();
      const clinicId = clinicUserData?.uuid as string;

      // Fetch services in parallel using clinic id with parameters
      const [clinicServicesData, dashData] = await Promise.all([
        // GetAllServiceForClinic("APPROVED"),/
        GetAllClinicService(clinicId, status = statusFilter, searchText, pageNum, itemsPerPage),
        getClinicServiceStaticData()
      ]);

      setClinicUser(clinicUserData);
      // setServices(servicesData.data || []);
      // setAllServices(servicesData.data || []);
      setClinicServices(clinicServicesData.data || []);
      setDashData(dashData?.data)

      setPaginationData({
        current_page: clinicServicesData.current_page || 1,
        total_pages: clinicServicesData.total_pages || 1,
        total_items: clinicServicesData.total_items || 0,
        next: clinicServicesData.next || null,
        previous: clinicServicesData.previous || null
      });
    } catch (error) {
      console.error("Error fetching data", error);
    } finally {
      setLoading(false);
    }

  }

  const handleServiceSearch = async (page: number = 1, searchTerm: string = serviceSearchTerm, append: boolean = false) => {
    try {
      if (page === 1) {
        setIsLoadingServices(true);
        // Clear existing services when starting a new search
        if (!append) {
          setAllServices([]);
        }
      } else {
        setLoadingMoreServices(true);
      }

      const response = await GetAllServiceForClinic("APPROVED", searchTerm, page, 12);

      if (append) {
        // Append new services to existing list
        setAllServices(prev => [...prev, ...(response.data || [])]);
      } else {
        // Replace with new search results
        setAllServices(response.data || []);
      }

      setServicePagination({
        current_page: response.current_page || 1,
        total_pages: response.total_pages || 1,
        total_items: response.total_items || 0,
        has_more: (response.current_page || 1) < (response.total_pages || 1)
      });

    } catch (error) {
      console.error("Error searching services:", error);
      showToast('Failed to load services', 'error');
    } finally {
      setIsLoadingServices(false);
      setLoadingMoreServices(false);
    }
  };

  // Update useEffect to use parameters
  useEffect(() => {
    fetchService(1, searchTerm, statusFilter);
  }, [statusFilter]); // Refetch when status filter changes

  useEffect(() => {
    if (clinicUser?.uuid) {
      setNewClinicService(prev => ({
        ...prev,
        clinic: clinicUser.uuid
      }));
      console.log('Clinic ID set from clinicUser:', clinicUser.uuid);
    }
  }, [clinicUser]);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    // Add debounce to avoid too many API calls
    const timeoutId = setTimeout(() => {
      fetchService(1, term, statusFilter);
    }, 500);

    return () => clearTimeout(timeoutId);
  };

  // Update pagination handler
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchService(page, searchTerm, statusFilter);
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
  // Add the image selection handler
  const handleImageSelection = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    setSelectedImageFile(file);

    // Create preview for immediate UI feedback
    const previewUrl = URL.createObjectURL(file);
    setImagePreviewUrl(previewUrl);
  };

  const removeImage = () => {
    setSelectedImageFile(null);
    setImagePreviewUrl(null);
    setNewClinicService(prev => ({
      ...prev,
      image: ''
    }));
    setServiceRequest(prev => ({
      ...prev,
      image: ''
    }));
  };

  // CRUD operations
  const handleCreateClinicService = async () => {
    console.log('Starting handleCreateClinicService with newClinicService:', newClinicService);

    const errors = validateClinicServiceForm();
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) {
      console.log('Validation errors:', errors);
      return;
    }

    try {
      // Check if this service already exists for the clinic
      const existingService = clinicServices.find(
        cs => cs.service === newClinicService.service && cs.clinic === newClinicService.clinic
      );

      if (existingService) {
        showToast('This service already exists for your clinic. Please edit the existing one instead.', 'error');
        return;
      }

      if (!clinicUser?.uuid) {
        showToast('Clinic not loaded. Please try again.', 'error');
        return;
      }

      // Check if there's an image file to upload
      let imageUrl = newClinicService.image;

      // If we have a selected image file, upload it using the presigned URL API
      if (selectedImageFile) {
        setUploadingImage(true);

        try {
          // Upload the file using the presigned URL API
          const uploadedUrls = await uploadFiles([selectedImageFile]);

          if (uploadedUrls && uploadedUrls.length > 0) {
            imageUrl = uploadedUrls[0];
            console.log('Image uploaded successfully. URL:', imageUrl);
          }
        } catch (uploadError) {
          console.error("Error uploading image:", uploadError);
          showToast("Failed to upload image. Please try again.", "error");
          setUploadingImage(false);
          return;
        } finally {
          setUploadingImage(false);
        }
      }

      const requestBody: NewClinicService = {
        clinic: clinicUser.uuid,
        service: newClinicService.service,
        clinic_provided_name: newClinicService.clinic_provided_name || '',
        description: newClinicService.description || '',
        image: imageUrl || '',
        consultation_charge_video_call: newClinicService.consultation_charge_video_call,
        consultation_charge_home_visit: newClinicService.consultation_charge_home_visit,
        treatment_charge_video_call: newClinicService.treatment_charge_video_call,
        treatment_charge_physical_visit: newClinicService.treatment_charge_physical_visit,
        consultation_charge_physical_visit: newClinicService.consultation_charge_physical_visit,
        treatment_charge_home_visit: newClinicService.treatment_charge_home_visit,
        is_video_call: newClinicService.is_video_call,
        is_home_service: newClinicService.is_home_service,
        is_clinic_visit: newClinicService.is_clinic_visit,
        is_home_visit: newClinicService.is_home_service,
        is_physical_visit: newClinicService.is_clinic_visit,
        rank: newClinicService.rank,
        start_time: newClinicService.start_time || '',
        max_bookings: newClinicService.max_bookings || 0,
      };

      console.log('Sending requestBody to backend:', requestBody);

      // Call the API
      const response = await createClinicService(requestBody);

      // Create the local clinic service object for state update
      const clinicService: ClinicService = {
        uuid: (response as any)?.uuid || `clinic-service-${Date.now()}`,
        service: newClinicService.service,
        clinic: clinicUser.uuid,
        service_name: newClinicService.service,
        created_by: session?.user?.email || 'unknown',
        clinic_provided_name: newClinicService.clinic_provided_name || null,
        rank: parseInt(newClinicService.rank || '0'),
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
        image: imageUrl || null,
        description: newClinicService.description || null,
        reason_for_rejection: null,
        display_date: new Date().toISOString(),
      };

      // Update state and UI
      fetchService()
      setClinicServices([clinicService, ...clinicServices]);
      resetClinicServiceForm();
      setShowCreateModal(false);
      showToast('Clinic service added successfully!', 'success');

    } catch (error: any) {
      console.error("Error creating clinic service:", error);
      const data = error.response?.data;

      if (data?.non_field_errors?.includes("unique set")) {
        showToast('This service already exists for your clinic. Please edit the existing one instead.', 'error');
      } else if (data?.non_field_errors?.length > 0) {
        showToast(data.non_field_errors[0], 'error');
      } else {
        showToast(
          error.response?.data?.message || "Failed to create clinic service. Please try again.",
          "error"
        );
      }
    }
  };

  const handleDelete = async () => {
    if (!selectedItem) return;

    try {
      // Call the API to delete the service
      await deleteClinicService(selectedItem.uuid);

      // Update local state if API call succeeds
      setClinicServices(clinicServices.filter(cs => cs.uuid !== selectedItem.uuid));

      // Show success feedback
      showToast('Clinic service deleted successfully!', 'success');

      // Close the modal
      closeModal();
    } catch (error) {
      console.error('Error deleting clinic service:', error);
      showToast('Failed to delete clinic service', 'error');
    }
  };

  // Modal handlers
  const handleView = (item: ClinicService) => {
    setSelectedItem(item);
    setModalMode('view');
  };

  const handleEdit = (item: ClinicService) => {
    setSelectedItem(item);
    setModalMode('edit');
    setSelectedImageFile(null);
    setImagePreviewUrl(item.image || null);
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
    setSelectedImageFile(null);
    setImagePreviewUrl(null);
  };

  const resetClinicServiceForm = () => {
    console.log('Resetting clinic service form');
    const currentClinicId = clinicUser?.uuid || '';
    setNewClinicService({
      clinic: currentClinicId,
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
      is_home_visit: false,
      is_physical_visit: false,
      clinic_provided_name: '',
      image: '',
      description: '',
      start_time: '',
      max_bookings: 0
    });
  };

  // Add state for rank editing
  const [rankEditValue, setRankEditValue] = useState('');

  // Add handler to save rank
  const handleSaveRank = async () => {
    if (!selectedItem) return;

    try {
      // Prepare the request body in the required format
      const requestBody = [
        {
          clinic_service: selectedItem.uuid,
          rank: parseInt(rankEditValue)
        }
      ];

      // Call the API to update the rank
      await updateRankClinicService(requestBody);

      // Update local state if API call succeeds
      setClinicServices(clinicServices.map(cs =>
        cs.uuid === selectedItem.uuid ? { ...cs, rank: parseInt(rankEditValue) } : cs
      ));

      showToast('Rank updated successfully!', 'success');
      closeModal();
    } catch (error) {
      console.error('Error updating rank:', error);
      showToast('Failed to update rank', 'error');
    }
  };

  // Service search functions
  const handleOpenServiceSearch = () => {
    // allServices is already populated from the API in fetchService
    setShowServiceSearchModal(true);
    setServiceSearchTerm('');
    // Load first page of services
    handleServiceSearch(1, '');
  };

  const handleSelectService = (service: Service) => {
    console.log('Service selected:', service);
    setNewClinicService(prev => {
      const updated = {
        ...prev,
        service: service.uuid
      };
      console.log('Updated newClinicService:', updated);
      return updated;
    });
    setShowServiceSearchModal(false);
    setServiceSearchTerm('');
  };

  const handleRequestService = async () => {
    // Basic validation
    if (!serviceRequest.name.trim()) {
      showToast('Service name is required', 'error');
      return;
    }

    if (!serviceRequest.description.trim()) {
      showToast('Service description is required', 'error');
      return;
    }

    if (!serviceRequest.tags.trim()) {
      showToast('At least one tag is required', 'error');
      return;
    }

    try {

      let imageUrl = serviceRequest.image;

      // If we have a selected image file, upload it using the presigned URL API
      if (selectedImageFile) {
        setUploadingImage(true);

        try {
          // Upload the file using the presigned URL API
          const uploadedUrls = await uploadFiles([selectedImageFile]);

          if (uploadedUrls && uploadedUrls.length > 0) {
            imageUrl = uploadedUrls[0];
            console.log('Image uploaded successfully. URL:', imageUrl);
          }
        } catch (uploadError) {
          console.error("Error uploading image:", uploadError);
          showToast("Failed to upload image. Please try again.", "error");
          setUploadingImage(false);
          return;
        } finally {
          setUploadingImage(false);
        }
      }

      // Prepare the request body according to backend expectations
      const requestBody = {
        name: serviceRequest.name.trim(),
        description: serviceRequest.description.trim(),
        tags: serviceRequest.tags.trim(),
        image: imageUrl
      };

      // Call the API
      await requestNewService(requestBody);

      showToast('Service request submitted successfully! We will review and add it soon.', 'success');
      setShowRequestServiceModal(false);
      resetServiceRequest();
    } catch (error: any) {
      console.error('Error requesting service:', error);
      showToast(
        error.response?.data?.message || "Failed to submit service request. Please try again.",
        "error"
      );
    }
  };

  // 4. Update the resetServiceRequest function
  const resetServiceRequest = () => {
    setSelectedImageFile(null);
    setImagePreviewUrl(null);
    setServiceRequest({
      name: '',
      description: '',
      tags: '',
      image: ''
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

  // Populate edit form when modal opens
  useEffect(() => {
    if (modalMode === 'edit' && selectedItem) {
      console.log('Populating edit form with:', selectedItem);

      // Find the service name from the service UUID
      const serviceName = services.find(s => s.uuid === selectedItem.service)?.name || selectedItem.service_name;

      setNewClinicService({
        clinic: selectedItem.clinic,
        service: selectedItem.service, // This should be the service UUID
        rank: selectedItem?.rank?.toString(),
        consultation_charge_video_call: selectedItem.consultation_charge_video_call || '',
        consultation_charge_home_visit: selectedItem.consultation_charge_home_visit || '',
        treatment_charge_video_call: selectedItem.treatment_charge_video_call || '',
        treatment_charge_physical_visit: selectedItem.treatment_charge_physical_visit || '',
        consultation_charge_physical_visit: selectedItem.consultation_charge_physical_visit || '',
        treatment_charge_home_visit: selectedItem.treatment_charge_home_visit || '',
        is_video_call: selectedItem.is_video_call,
        is_home_service: selectedItem.is_home_visit,
        is_clinic_visit: selectedItem.is_physical_visit,
        is_home_visit: selectedItem.is_home_visit,
        is_physical_visit: selectedItem.is_physical_visit,
        clinic_provided_name: selectedItem.clinic_provided_name || '',
        image: selectedItem.image || '',
        description: selectedItem.description || '',
        start_time: selectedItem.display_date || '',
        max_bookings: 0
      });
    }
  }, [modalMode, selectedItem, services]);

  // the search input handler with debouncing
  useEffect(() => {
    if (showServiceSearchModal) {
      const timeoutId = setTimeout(() => {
        handleServiceSearch(1, serviceSearchTerm);
      }, 500);

      return () => clearTimeout(timeoutId);
    }
  }, [serviceSearchTerm, showServiceSearchModal]);

  const handleUpdateClinicService = async () => {
    if (!selectedItem) return;

    const errors = validateClinicServiceForm();
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) return;

    try {
      // Upload new image if selected
      let imageUrl = newClinicService.image;

      if (selectedImageFile) {
        setUploadingImage(true);
        try {
          const uploadedUrls = await uploadFiles([selectedImageFile]);
          if (uploadedUrls && uploadedUrls.length > 0) {
            imageUrl = uploadedUrls[0];
          }
        } catch (uploadError) {
          console.error("Error uploading image:", uploadError);
          showToast("Failed to upload image. Please try again.", "error");
          setUploadingImage(false);
          return;
        } finally {
          setUploadingImage(false);
        }
      }

      // Prepare update data - you'll need to create an update API function
      const updateData = {
        clinic: newClinicService.clinic,
        service: newClinicService.service,
        clinic_provided_name: newClinicService.clinic_provided_name,
        description: newClinicService.description,
        image: imageUrl,
        consultation_charge_video_call: newClinicService.consultation_charge_video_call,
        consultation_charge_home_visit: newClinicService.consultation_charge_home_visit,
        treatment_charge_video_call: newClinicService.treatment_charge_video_call,
        treatment_charge_physical_visit: newClinicService.treatment_charge_physical_visit,
        consultation_charge_physical_visit: newClinicService.consultation_charge_physical_visit,
        treatment_charge_home_visit: newClinicService.treatment_charge_home_visit,
        is_video_call: newClinicService.is_video_call,
        is_home_service: newClinicService.is_home_service,
        is_clinic_visit: newClinicService.is_clinic_visit,
        rank: newClinicService.rank,
      };

      // Call your update API here - you'll need to create this function
      const res = await updateClinicService(updateData, selectedItem?.uuid)
      console.log(res, 'response fromt he updaate ')
      if (res?.status == 200) {
        fetchService(1, searchTerm, statusFilter);
        closeModal();
        showToast('Clinic service updated successfully!', 'success');
      }
    } catch (error: any) {
      console.error('Error updating clinic service:', error, error?.response?.data);
      showToast('Failed to update clinic service', 'error');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen  flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading ...</p>
        </div>
      </div>
    );
  }
  return (
    <>
      <div className="min-h-screen">
        {/* Enhanced Header */}
        <div className="bg-white/80 backdrop-blur-xl ">
          <div className="max-w-7xl mx-auto ">
            <div className="py-6">
              {/* Header Content */}
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg">
                      <Settings className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700 bg-clip-text text-transparent">
                        Service Management
                      </h1>
                      <p className="text-slate-600 text-sm mt-1">
                        Manage and organize your clinic services efficiently
                      </p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => setShowRequestServiceModal(true)}
                    className="group relative inline-flex items-center justify-center px-5 py-3 bg-gradient-to-r from-emerald-500 to-green-500 text-white rounded-xl hover:from-emerald-600 hover:to-green-600 transition-all duration-200 shadow-lg hover:shadow-xl font-semibold text-sm border border-emerald-400/20"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-green-400 rounded-xl blur opacity-20 group-hover:opacity-30 transition-opacity"></div>
                    <Plus className="w-4 h-4 mr-2 relative z-10" />
                    <span className="relative z-10">Request Service</span>
                  </button>
                  <button
                    onClick={() => setShowCreateModal(true)}
                    className="group relative inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl hover:from-blue-600 hover:to-indigo-600 transition-all duration-200 shadow-lg hover:shadow-xl font-semibold text-sm border border-blue-400/20"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-xl blur opacity-20 group-hover:opacity-30 transition-opacity"></div>
                    <Plus className="w-5 h-5 mr-2 relative z-10" />
                    <span className="relative z-10">Add Service</span>
                  </button>
                </div>
              </div>

              {/* Enhanced Stats Cards */}
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Total Services Card */}
                <div className="group relative bg-gradient-to-br from-white to-blue-50/50 rounded-2xl border border-blue-100/60 shadow-sm hover:shadow-md transition-all duration-300 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-blue-600 mb-1">Total Services</p>
                      <p className="text-3xl font-bold text-slate-900">{dashData?.total_clinic_service}</p>
                      <p className="text-xs text-slate-500 mt-1">All clinic services</p>
                    </div>
                    <div className="p-3 bg-blue-500/10 rounded-xl group-hover:scale-110 transition-transform duration-300">
                      <Settings className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 to-blue-600 rounded-b-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>

                {/* Approved Card */}
                <div className="group relative bg-gradient-to-br from-white to-emerald-50/50 rounded-2xl border border-emerald-100/60 shadow-sm hover:shadow-md transition-all duration-300 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-emerald-600 mb-1">Approved</p>
                      <p className="text-3xl font-bold text-slate-900">{dashData?.approved_service}</p>
                      <p className="text-xs text-slate-500 mt-1">Active services</p>
                    </div>
                    <div className="p-3 bg-emerald-500/10 rounded-xl group-hover:scale-110 transition-transform duration-300">
                      <CheckCircle className="w-6 h-6 text-emerald-600" />
                    </div>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-b-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>

                {/* Pending Card */}
                <div className="group relative bg-gradient-to-br from-white to-amber-50/50 rounded-2xl border border-amber-100/60 shadow-sm hover:shadow-md transition-all duration-300 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-amber-600 mb-1">Pending</p>
                      <p className="text-3xl font-bold text-slate-900">{dashData?.pending_service}</p>
                      <p className="text-xs text-slate-500 mt-1">Awaiting approval</p>
                    </div>
                    <div className="p-3 bg-amber-500/10 rounded-xl group-hover:scale-110 transition-transform duration-300">
                      <Clock className="w-6 h-6 text-amber-600" />
                    </div>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 to-amber-600 rounded-b-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>

                {/* Rejected Card */}
                <div className="group relative bg-gradient-to-br from-white to-red-50/50 rounded-2xl border border-red-100/60 shadow-sm hover:shadow-md transition-all duration-300 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-red-600 mb-1">Rejected</p>
                      <p className="text-3xl font-bold text-slate-900">{dashData?.rejected_service}</p>
                      <p className="text-xs text-slate-500 mt-1">Needs revision</p>
                    </div>
                    <div className="p-3 bg-red-500/10 rounded-xl group-hover:scale-110 transition-transform duration-300">
                      <XCircle className="w-6 h-6 text-red-600" />
                    </div>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-red-400 to-red-600 rounded-b-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto ">
          {/* Filters Section */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200/60 shadow-sm p-6 mb-8">
            <div className="flex flex-col lg:flex-row lg:items-end gap-6">
              {/* Search Bar */}
              <div className="flex-1">
                <label className="text-sm font-semibold text-slate-700 mb-2 block">Search Services</label>
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search by service name, description, or clinic..."
                    value={searchTerm}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all duration-200 text-slate-700 placeholder-slate-400 shadow-sm"
                  />
                </div>
              </div>

              {/* Status Filter */}
              <div>
                <label className="text-sm font-semibold text-slate-700 mb-2 ml-1 block">Filter by Status</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-white text-slate-700 focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all duration-200 shadow-sm"
                >
                  <option value="">All Status</option>
                  <option value="APPROVED">Approved</option>
                  <option value="DRAFT">Draft</option>
                  <option value="REJECTED">Rejected</option>
                </select>
              </div>

              {/* View Toggle and Filters */}
              <div className="flex flex-col sm:flex-row gap-4">
                {/* View Toggle */}
                <div>
                  <label className="text-sm font-semibold text-slate-700 mb-2 block">View</label>
                  <div className="flex bg-slate-100 rounded-xl p-1.5 shadow-inner border border-slate-200">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-semibold transition-all duration-200 text-sm ${viewMode === 'grid'
                        ? 'bg-white text-blue-700 shadow-sm border border-slate-200'
                        : 'text-slate-600 hover:text-slate-800'
                        }`}
                    >
                      <LayoutGrid className="w-4 h-4" />
                      Grid
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-semibold transition-all duration-200 text-sm ${viewMode === 'list'
                        ? 'bg-white text-blue-700 shadow-sm border border-slate-200'
                        : 'text-slate-600 hover:text-slate-800'
                        }`}
                    >
                      <ListIcon className="w-4 h-4" />
                      List
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Services Grid/List */}
          {clinicServices.length === 0 ? (
            <div className="text-center py-16 bg-white/50 rounded-2xl border-2 border-dashed border-slate-200">
              <div className="max-w-md mx-auto">
                <div className="w-20 h-20 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Settings className="w-10 h-10 text-slate-400" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-3">No services found</h3>
                <p className="text-slate-600 mb-8">
                  {searchTerm
                    ? `No services match "${searchTerm}". Try adjusting your search or add a new service.`
                    : "Get started by adding your first clinic service."
                  }
                </p>
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl hover:from-blue-600 hover:to-indigo-600 transition-all duration-200 shadow-lg font-semibold"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Add Your First Service
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Results Header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">
                    Clinic Services ({clinicServices.length})
                  </h2>
                  <p className="text-sm text-slate-600">
                    Services by priority
                    {/* Drag to reorder  */}
                  </p>
                </div>
                <div className="text-sm text-slate-500">
                  Page {currentPage} of {paginationData?.total_pages}
                </div>
              </div>

              <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="clinic-services-droppable" direction={viewMode === 'grid' ? 'horizontal' : 'vertical'}>
                  {(provided: DroppableProvided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={
                        viewMode === 'grid'
                          ? 'grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3'
                          : 'flex flex-col gap-4'
                      }
                    >
                      {clinicServices.map((clinicService: any, idx) => {
                        const statusConfig = getStatusConfig(clinicService.status);
                        const StatusIcon = statusConfig.icon;

                        return (
                          <Draggable key={clinicService.uuid} draggableId={clinicService.uuid} index={idx}>
                            {(provided: DraggableProvided) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className={
                                  viewMode === 'grid'
                                    ? 'group relative'
                                    : 'group relative flex items-center bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 p-6'
                                }
                              >
                                {/* Grid View */}
                                {viewMode === 'grid' && (
                                  <div className="group relative bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden hover:border-slate-300">
                                    {/* Status Badge */}
                                    <div className="absolute top-4 right-4 z-10">
                                      <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold border bg-white ${statusConfig.color}`}>
                                        <StatusIcon className="w-3 h-3 mr-1.5" />
                                        {clinicService.status}
                                      </span>
                                    </div>

                                    {/* Service Image/Icon */}
                                    <div className="relative h-48 bg-gradient-to-br from-slate-50 to-slate-100 overflow-hidden">
                                      {clinicService.image || clinicService?.service_image ? (
                                        <img
                                          src={clinicService.image || clinicService?.service_image}
                                          alt={clinicService.service_name}
                                          className="w-full h-full object-cover"
                                        />
                                      ) : (
                                        <img
                                          src={'/clinic.png'}
                                          alt={clinicService.service_name}
                                          className="w-full h-full object-cover"
                                        />
                                      )}
                                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                                    </div>

                                    {/* Content */}
                                    <div className="p-6">
                                      {/* Header */}
                                      <div className="flex items-start gap-4 mb-2">
                                        <div className="flex-1 min-w-0">
                                          <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors capitalize line-clamp-2 mb-2">
                                            {clinicService?.clinic_provided_name || clinicService?.service_name}
                                          </h3>
                                          <p className="text-sm text-slate-600 flex items-center gap-1.5">
                                            <Building2 className="w-4 h-4" />
                                            {clinicService.clinic_name}
                                          </p>
                                        </div>
                                      </div>

                                      {/* Description */}
                                      <div className='mb-3 text-sm text-slate-600 line-clamp-2'>
                                        <p>{clinicService?.description || clinicService?.service_description || "Please add a proper description for get a good understanding of visiters"}</p>
                                      </div>

                                      {/* Pricing Summary */}
                                      <div className="grid grid-cols-3 gap-2 mb-4 text-xs">
                                        {clinicService.consultation_charge_video_call && (
                                          <div className="text-start p-2.5 bg-slate-50 rounded-lg">
                                            <div className="font-semibold text-slate-900">₹ {clinicService.consultation_charge_video_call}</div>
                                            <div className="text-slate-500 truncate">Video Call</div>
                                          </div>
                                        )}
                                        {clinicService.consultation_charge_physical_visit && (
                                          <div className="text-start p-2.5 bg-slate-50 rounded-lg">
                                            <div className="font-semibold text-slate-900">₹ {clinicService.consultation_charge_physical_visit}</div>
                                            <div className="text-slate-500 truncate">Physical Visit</div>
                                          </div>
                                        )}
                                        {clinicService.consultation_charge_home_visit && (
                                          <div className="text-center p-2 bg-slate-50 rounded-lg">
                                            <div className="font-semibold text-slate-900">₹{clinicService.consultation_charge_home_visit}</div>
                                            <div className="text-slate-500 truncate">Home Visit</div>
                                          </div>
                                        )}
                                      </div>

                                      {/* Rank and Actions */}
                                      <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                                        <div className="flex items-center gap-3">
                                          <div className="text-center">
                                            <div className="text-2xl font-bold text-emerald-600">{clinicService.rank}</div>
                                            <div className="text-xs text-slate-500 font-medium">Rank</div>
                                          </div>
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="flex items-center gap-1">
                                          <button
                                            onClick={() => handleView(clinicService)}
                                            className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                                            title="View"
                                          >
                                            <Eye className="w-4 h-4" />
                                          </button>
                                          <button
                                            onClick={() => handleEdit(clinicService)}
                                            className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                                            title="Edit"
                                          >
                                            <Edit3 className="w-4 h-4" />
                                          </button>
                                          {/* <button
                                            onClick={() => handleEditRank(clinicService)}
                                            className="p-2 text-slate-400 hover:text-yellow-600 hover:bg-yellow-50 rounded-lg transition-all duration-200"
                                            title="Edit Rank"
                                          >
                                            <Star className="w-4 h-4" />
                                          </button> */}
                                          <button
                                            onClick={() => handleDeleteConfirm(clinicService)}
                                            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                                            title="Delete"
                                          >
                                            <Trash2 className="w-4 h-4" />
                                          </button>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                )}

                                {/* List View */}
                                {viewMode === 'list' && (
                                  <>
                                    <div className="flex-1 grid grid-cols-12 gap-6 items-center">
                                      {/* Service Info */}
                                      <div className="col-span-4 flex items-center gap-4">
                                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center overflow-hidden flex-shrink-0">
                                          {clinicService.image || clinicService?.service_image ? (
                                            <img
                                              src={clinicService.image || clinicService?.service_image}
                                              alt={clinicService.service_name}
                                              className="w-full h-full object-contain"
                                            />
                                          ) : (
                                            <img
                                              src={'/clinic.png'}
                                              alt={clinicService.service_name}
                                              className="w-full h-full object-cover"
                                            />
                                          )}
                                        </div>
                                        <div className="min-w-0">
                                          <h3 className="font-semibold text-slate-900 group-hover:text-blue-600 capitalize transition-colors truncate">
                                            {clinicService.clinic_provided_name || clinicService.service_name}
                                          </h3>
                                          <p className="text-sm text-slate-600 truncate">{clinicService?.clinic_name}</p>
                                        </div>
                                      </div>

                                      {/* Status */}
                                      <div className="col-span-2">
                                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${statusConfig.color}`}>
                                          <StatusIcon className="w-3 h-3 mr-1.5" />
                                          {clinicService.status}
                                        </span>
                                      </div>

                                      {/* Rank */}
                                      <div className="col-span-1 text-center">
                                        <div className="text-lg font-bold text-emerald-600">{clinicService.rank}</div>
                                        <div className="text-xs text-slate-500">Rank</div>
                                      </div>

                                      {/* Facilities */}
                                      <div className="col-span-3">
                                        <div className="flex flex-wrap gap-1">
                                          {clinicService.is_video_call && (
                                            <Video className="w-4 h-4 text-blue-500" />
                                          )}
                                          {clinicService.is_physical_visit && (
                                            <Home className="w-4 h-4 text-green-500" />
                                          )}
                                          {clinicService.is_home_visit && (
                                            <Building className="w-4 h-4 text-amber-500" />
                                          )}
                                        </div>
                                      </div>

                                      {/* Actions */}
                                      <div className="col-span-2 flex items-center justify-end gap-1">
                                        <button
                                          onClick={() => handleView(clinicService)}
                                          className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                                        >
                                          <Eye className="w-4 h-4" />
                                        </button>
                                        <button
                                          onClick={() => handleEdit(clinicService)}
                                          className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                                        >
                                          <Edit3 className="w-4 h-4" />
                                        </button>
                                        {/* <button
                                          onClick={() => handleEditRank(clinicService)}
                                          className="p-2 text-slate-400 hover:text-yellow-600 hover:bg-yellow-50 rounded-lg transition-all duration-200"
                                        >
                                          <Star className="w-4 h-4" />
                                        </button> */}
                                        <button
                                          onClick={() => handleDeleteConfirm(clinicService)}
                                          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                                        >
                                          <Trash2 className="w-4 h-4" />
                                        </button>
                                      </div>
                                    </div>
                                  </>
                                )}
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
            </>
          )}

          {/* Enhanced Pagination */}
          {paginationData?.total_pages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-12 pt-6 border-t border-slate-200">
              <div className="text-sm text-slate-600">
                Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, paginationData.total_items)} of {paginationData.total_items} results
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1 || !paginationData.previous}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-200 bg-white text-slate-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors"
                >
                  Previous
                </button>

                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, paginationData?.total_pages) }, (_, i) => {
                    const pageNum = i + 1;
                    return (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`w-10 h-10 rounded-lg border font-medium transition-all duration-200 ${currentPage === pageNum
                          ? 'bg-blue-500 text-white border-blue-500 shadow-sm'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                          }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                  {paginationData?.total_pages > 5 && <span className="px-2 text-slate-400">...</span>}
                </div>

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === paginationData?.total_pages || !paginationData.next}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-200 bg-white text-slate-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors"
                >
                  Next
                </button>
              </div>
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
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[95vh] overflow-y-auto hide-scrollbar">
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
                                const selectedService = allServices.find(s => s.uuid === newClinicService.service);
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
                                  {newClinicService.service}
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
                                  const selectedService = allServices.find(s => s.uuid === newClinicService.service);
                                  return selectedService?.description || 'No description available';
                                })()}
                              </p>

                              {/* Service Tags */}
                              <div className="flex flex-wrap gap-1 justify-center sm:justify-start">
                                {(() => {
                                  const selectedService = allServices.find(s => s.uuid === newClinicService.service);
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

                {/* Image Upload Section */}
                <div className="mb-4">
                  <label className="block text-sm font-semibold mb-2">Image</label>

                  {/* Disclaimer text */}
                  <div className="mb-3 p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-800">
                    <strong>Note:</strong> Please name your image file the same as your service name for better organization.
                  </div>

                  {imagePreviewUrl || newClinicService.image ? (
                    <div className="relative group mb-3">
                      <img
                        src={imagePreviewUrl || newClinicService.image}
                        alt="Service preview"
                        className="h-32 w-full object-cover rounded-lg border"
                      />
                      <button
                        type="button"
                        onClick={removeImage}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center w-full mb-3">
                      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <Upload className="w-8 h-8 mb-4 text-gray-500" />
                          <p className="mb-2 text-sm text-gray-500">
                            <span className="font-semibold">Click to upload</span> or drag and drop
                          </p>
                          <p className="text-xs text-gray-500">PNG, JPG, GIF (MAX. 10MB)</p>
                        </div>
                        <input
                          type="file"
                          className="hidden"
                          onChange={handleImageSelection}
                          accept="image/*"
                        />
                      </label>
                    </div>
                  )}

                  {uploadingImage && (
                    <div className="mt-2 text-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto mb-2"></div>
                      <p className="text-sm text-gray-600">Uploading image...</p>
                    </div>
                  )}
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-2 sm:p-4 ">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[95vh] overflow-y-auto hide-scrollbar">
            {/* Header */}
            <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-2xl">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{selectedItem?.service_name}</h2>
                <p className="text-sm text-gray-600 mt-1">{selectedItem?.clinic_name}</p>
              </div>
              <button
                onClick={closeModal}
                className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-white rounded-xl transition-all duration-200"
                aria-label="Close"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Status Badge */}
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Status</span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${selectedItem?.status === 'DRAFT'
                  ? 'bg-yellow-100 text-yellow-800'
                  : selectedItem.status === 'REJECTED'
                    ? 'bg-red-100 text-red-800'
                    : 'bg-green-100 text-green-800'
                  }`}>
                  {selectedItem.status}
                </span>
              </div>

              {/* Service Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Basic Information */}
                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 mb-3 text-lg">Service Information</h3>

                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-medium text-gray-600">Clinic Provided Name</label>
                        <p className="text-gray-900 mt-1">{selectedItem.clinic_provided_name || 'Not specified'}</p>
                      </div>

                      <div>
                        <label className="text-sm font-medium text-gray-600">Rank</label>
                        <div className="flex items-center mt-1">
                          <div className="flex">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <span
                                key={star}
                                className={`text-lg ${star <= selectedItem.rank
                                  ? 'text-yellow-400'
                                  : 'text-gray-300'
                                  }`}
                              >
                                ★
                              </span>
                            ))}
                          </div>
                          <span className="ml-2 text-sm text-gray-600">({selectedItem.rank}/5)</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 mb-3 text-lg">Description</h3>
                    <p className="text-gray-700 leading-relaxed">
                      {selectedItem.description || 'No description provided'}
                    </p>
                  </div>
                </div>

                {/* Charges & Facilities */}
                <div className="space-y-4">
                  {/* Available Facilities */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 mb-3 text-lg">Available Facilities</h3>
                    <div className="space-y-2">
                      {selectedItem.consultation_charge_video_call && (
                        <div className="flex items-center p-3 bg-white rounded-lg border border-gray-200">
                          <div className="w-3 h-3 bg-blue-500 rounded-full mr-3"></div>
                          <span className="text-gray-900 font-medium">Video Call Consultation</span>
                        </div>
                      )}
                      {selectedItem.consultation_charge_physical_visit && (
                        <div className="flex items-center p-3 bg-white rounded-lg border border-gray-200">
                          <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                          <span className="text-gray-900 font-medium">Physical Visit</span>
                        </div>
                      )}
                      {selectedItem.consultation_charge_home_visit && (
                        <div className="flex items-center p-3 bg-white rounded-lg border border-gray-200">
                          <div className="w-3 h-3 bg-purple-500 rounded-full mr-3"></div>
                          <span className="text-gray-900 font-medium">Home Visit</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Pricing */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 mb-3 text-lg">Service Charges</h3>
                    <div className="space-y-3">
                      {selectedItem.is_video_call && (
                        <div className="bg-white rounded-lg p-3 border border-gray-200">
                          <div className="flex justify-between items-center mb-2">
                            <span className="font-medium text-gray-900">Video Call</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Consultation:</span>
                            <span className="font-medium">₹{selectedItem.consultation_charge_video_call}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Treatment:</span>
                            <span className="font-medium">₹{selectedItem.treatment_charge_video_call}</span>
                          </div>
                        </div>
                      )}

                      {selectedItem.is_physical_visit && (
                        <div className="bg-white rounded-lg p-3 border border-gray-200">
                          <div className="flex justify-between items-center mb-2">
                            <span className="font-medium text-gray-900">Physical Visit</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Consultation:</span>
                            <span className="font-medium">₹{selectedItem.consultation_charge_physical_visit}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Treatment:</span>
                            <span className="font-medium">₹{selectedItem.treatment_charge_physical_visit}</span>
                          </div>
                        </div>
                      )}

                      {selectedItem.is_home_visit && (
                        <div className="bg-white rounded-lg p-3 border border-gray-200">
                          <div className="flex justify-between items-center mb-2">
                            <span className="font-medium text-gray-900">Home Visit</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Consultation:</span>
                            <span className="font-medium">₹{selectedItem.consultation_charge_home_visit}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Treatment:</span>
                            <span className="font-medium">₹{selectedItem.treatment_charge_home_visit}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Rejection Reason */}
              {selectedItem.reason_for_rejection && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-center mb-2">
                    <span className="text-red-600 font-semibold text-lg">Reason for Rejection</span>
                  </div>
                  <p className="text-red-700">{selectedItem.reason_for_rejection}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {modalMode === 'edit' && selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-2 sm:p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[95vh] overflow-y-auto hide-scrollbar">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Edit Clinic Service</h2>
              <button onClick={closeModal} className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 rounded-lg" aria-label="Close">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-6">
              <form onSubmit={e => {
                e.preventDefault();
                handleUpdateClinicService();
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
                                const selectedService = services.find(s => s.uuid === newClinicService.service);
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
                                {newClinicService.service}
                              </h4>
                              <p className="text-sm text-slate-600 line-clamp-2">
                                {(() => {
                                  const selectedService = services.find(s => s.uuid === newClinicService.service);
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
                <div className="mb-4">
                  <label className="block text-sm font-semibold mb-2">Image</label>

                  {/* Disclaimer text */}
                  <div className="mb-3 p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-800">
                    <strong>Note:</strong> Please name your image file the same as your service name for better organization.
                  </div>

                  {imagePreviewUrl || newClinicService.image ? (
                    <div className="relative group mb-3">
                      <img
                        src={imagePreviewUrl || newClinicService.image}
                        alt="Service preview"
                        className="h-32 w-full object-cover rounded-lg border"
                      />
                      <button
                        type="button"
                        onClick={removeImage}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center w-full mb-3">
                      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <Upload className="w-8 h-8 mb-4 text-gray-500" />
                          <p className="mb-2 text-sm text-gray-500">
                            <span className="font-semibold">Click to upload</span> or drag and drop
                          </p>
                          <p className="text-xs text-gray-500">PNG, JPG, GIF (MAX. 10MB)</p>
                        </div>
                        <input
                          type="file"
                          className="hidden"
                          onChange={handleImageSelection}
                          accept="image/*"
                        />
                      </label>
                    </div>
                  )}

                  {uploadingImage && (
                    <div className="mt-2 text-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto mb-2"></div>
                      <p className="text-sm text-gray-600">Uploading image...</p>
                    </div>
                  )}
                </div>

                {/* Rank */}
                <div>
                  <label className="block text-sm font-semibold mb-1 sm:mb-2">Rank <span className="text-red-500">*</span></label>
                  <input
                    type="number"
                    className={`w-full px-3 sm:px-4 py-2 sm:py-3 rounded-xl border ${formErrors.rank ? 'border-red-400' : 'border-slate-200'} bg-white text-slate-700 text-sm sm:text-base`}
                    value={newClinicService.rank}
                    onChange={e => setNewClinicService(cs => ({ ...cs, rank: e.target.value }))}

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
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md max-h-[95vh] overflow-y-auto hide-scrollbar">
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
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md max-h-[95vh] overflow-y-auto hide-scrollbar">
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
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="p-4 sm:p-6 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 flex-shrink-0">
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
            <div className="p-4 sm:p-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50 flex-shrink-0">
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
                  {isLoadingServices ? (
                    'Searching...'
                  ) : (
                    <>
                      Found <span className="font-semibold text-blue-600">{servicePagination.total_items}</span> services
                      {serviceSearchTerm && (
                        <span> matching "<span className="font-medium">{serviceSearchTerm}</span>"</span>
                      )}
                      {servicePagination.total_items > 0 && (
                        <span> - Page {servicePagination.current_page} of {servicePagination.total_pages}</span>
                      )}
                    </>
                  )}
                </p>
              </div>
            </div>

            {/* Services Grid with Scrollable Area */}
            <div
              className="flex-1 overflow-y-auto p-4 sm:p-6"
              onScroll={handleServiceScroll}
            >
              {isLoadingServices && allServices.length === 0 ? (
                <div className="flex justify-center items-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                  <span className="ml-3 text-slate-600">Loading services...</span>
                </div>
              ) : allServices.length === 0 ? (
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
                    {allServices.map((service, idx) => {
                      const ServiceIcon = getServiceIcon(service.name);
                      return (
                        <div key={`${service.uuid}-${idx}`} className="group relative">
                          <div className="relative bg-white/90 backdrop-blur-xl rounded-2xl border border-slate-200/60 hover:border-slate-300/60 transition-all duration-300 shadow-sm hover:shadow-2xl overflow-hidden">
                            <div className="p-6">
                              {/* Header */}
                              <div className="flex items-start justify-between mb-4 sm:mb-6">
                                <div className="flex-1">
                                  <div className="flex items-center space-x-3 mb-2 sm:mb-3">
                                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-slate-100 to-slate-200 rounded-xl flex items-center justify-center overflow-hidden">
                                      {service.image ? (
                                        <img
                                          src={service.image}
                                          alt={service.name}
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
                                        {service.name}
                                      </h3>
                                      <p className="text-sm text-slate-600">
                                        Service ID: {service.uuid.slice(0, 8)}...
                                      </p>
                                    </div>
                                  </div>
                                  <div className={`inline-flex items-center px-2 py-1 rounded-lg border text-xs font-semibold bg-green-50 text-green-700 border-green-200 space-x-2`}>
                                    <span className="w-2 h-2 rounded-full bg-green-500"></span>
                                    <CheckCircle className="w-4 h-4" />
                                    <span>{service.status}</span>
                                  </div>
                                </div>
                              </div>
                              {/* Description */}
                              {service.description && (
                                <div className="mb-4">
                                  <p className="text-slate-700 text-sm line-clamp-3">
                                    {service.description}
                                  </p>
                                </div>
                              )}
                              {/* Tags */}
                              {service.tags && (
                                <div className="mb-4">
                                  <div className="flex flex-wrap gap-2 text-xs text-slate-600">
                                    {service.tags.split(',').slice(0, 3).map((tag, index) => (
                                      <span key={index} className="inline-flex items-center px-2 py-1 bg-slate-50 rounded-lg">
                                        <Tag className="w-4 h-4 mr-1 text-slate-500" />
                                        {tag.trim()}
                                      </span>
                                    ))}
                                    {service.tags.split(',').length > 3 && (
                                      <span className="inline-flex items-center px-2 py-1 bg-slate-50 rounded-lg text-slate-500">
                                        +{service.tags.split(',').length - 3} more
                                      </span>
                                    )}
                                  </div>
                                </div>
                              )}
                              {/* Select Button */}
                              <div className="flex items-center justify-center">
                                <button
                                  onClick={() => handleSelectService(service)}
                                  className="inline-flex items-center px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 text-sm font-semibold shadow-lg"
                                >
                                  <CheckCircle className="w-4 h-4 mr-2" /> Select Service
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Loading More Indicator */}
                  {loadingMoreServices && (
                    <div className="flex justify-center items-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                      <span className="ml-3 text-slate-600">Loading more services...</span>
                    </div>
                  )}

                  {/* End of Results */}
                  {!servicePagination.has_more && allServices.length > 0 && (
                    <div className="text-center py-8">
                      <div className="inline-flex items-center px-4 py-2 bg-slate-100 text-slate-600 rounded-full text-sm">
                        <CheckCircle className="w-4 h-4 mr-2" />
                        All {servicePagination.total_items} services loaded
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Request a Service Modal */}
      {showRequestServiceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-2 sm:p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[95vh] overflow-y-auto hide-scrollbar">
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
                {/* Service Name */}
                <div>
                  <label className="block text-sm font-semibold mb-1 sm:mb-2">
                    Service Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-xl border border-slate-200 bg-white text-slate-700 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 text-sm sm:text-base"
                    value={serviceRequest.name}
                    onChange={e => setServiceRequest(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g. Aerospace Medicine Specialist, Pediatric Cardiology"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-semibold mb-1 sm:mb-2">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    required
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-xl border border-slate-200 bg-white text-slate-700 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 text-sm sm:text-base"
                    value={serviceRequest.description}
                    onChange={e => setServiceRequest(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Provide a detailed description of the service, including what conditions it treats, procedures involved, and target patient groups..."
                    rows={4}
                  />
                  <p className="text-xs text-slate-500 mt-1">
                    Be specific about the medical specialty, conditions treated, and any unique aspects of this service.
                  </p>
                </div>

                {/* Image Upload Section */}
                <div className="mb-4">
                  <label className="block text-sm font-semibold mb-2">Image</label>

                  {/* Disclaimer text */}
                  <div className="mb-3 p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-800">
                    <strong>Note:</strong> Please name your image file the same as your service name for better organization.
                  </div>

                  {imagePreviewUrl || serviceRequest.image ? (
                    <div className="relative group mb-3">
                      <img
                        src={imagePreviewUrl || serviceRequest.image}
                        alt="Service preview"
                        className="h-32 w-full object-cover rounded-lg border"
                      />
                      <button
                        type="button"
                        onClick={removeImage}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center w-full mb-3">
                      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <Upload className="w-8 h-8 mb-4 text-gray-500" />
                          <p className="mb-2 text-sm text-gray-500">
                            <span className="font-semibold">Click to upload</span> or drag and drop
                          </p>
                          <p className="text-xs text-gray-500">PNG, JPG, GIF (MAX. 10MB)</p>
                        </div>
                        <input
                          type="file"
                          className="hidden"
                          onChange={handleImageSelection}
                          accept="image/*"
                        />
                      </label>
                    </div>
                  )}

                  {uploadingImage && (
                    <div className="mt-2 text-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto mb-2"></div>
                      <p className="text-sm text-gray-600">Uploading image...</p>
                    </div>
                  )}
                </div>

                {/* Tags */}
                <div>
                  <label className="block text-sm font-semibold mb-1 sm:mb-2">
                    Tags <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-xl border border-slate-200 bg-white text-slate-700 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 text-sm sm:text-base"
                    value={serviceRequest.tags}
                    onChange={e => setServiceRequest(prev => ({ ...prev, tags: e.target.value }))}
                    placeholder="e.g. aviation medicine,space medicine,altitude sickness,microgravity,flight safety"
                  />
                  <p className="text-xs text-slate-500 mt-1">
                    Enter comma-separated tags that help categorize and search for this service. Include medical specialties, conditions, and relevant keywords.
                  </p>

                  {/* Tag suggestions for common medical fields */}
                  <div className="mt-2">
                    <p className="text-xs font-medium text-slate-600 mb-2">Common medical tags:</p>
                    <div className="flex flex-wrap gap-1">
                      {[
                        'cardiology', 'neurology', 'orthopedics', 'dermatology', 'pediatrics',
                        'psychiatry', 'oncology', 'emergency medicine', 'radiology', 'pathology'
                      ].map((tag) => (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => {
                            const currentTags = serviceRequest.tags;
                            const newTag = currentTags ? `${currentTags},${tag}` : tag;
                            setServiceRequest(prev => ({ ...prev, tags: newTag }));
                          }}
                          className="px-2 py-1 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors text-xs font-medium"
                        >
                          + {tag}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Info Box */}
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-4 h-4 text-white" />
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-blue-900 mb-1">What happens next?</h4>
                      <p className="text-sm text-blue-800">
                        Your service request will be reviewed by our team. Once approved, the service will be added to our catalog and you'll be able to add it to your clinic with specific pricing and availability.
                      </p>
                    </div>
                  </div>
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
                    className="px-4 sm:px-6 py-2 sm:py-2 rounded-xl bg-primaryColor text-white font-semibold shadow hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 text-sm sm:text-base"
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