"use client";
import React, { useState, useRef, useEffect } from 'react';
import {
  MapPin,
  Clock,
  Phone,
  Mail,
  Building2,
  Save,
  X,
  ChevronDown,
  Plus,
  Settings,
  Edit3,
  Search as SearchIcon,
  CheckCircle2,
  AlertCircle,
  Star,
  Users,
  Calendar,
  Shield,
  Award,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import MapPicker from './MapPicker';
import { useSession } from 'next-auth/react';
import useClinicByUser from '@/hooks/cilincHook/useClinicByUser';
import { editClinicODetails } from '@/service/clinic/profileService';
import { axiosPrivate } from '@/axios/axios';

// API Interface
interface NewClinic {
  title: string;
  offer_type: string;
  description: string;
  valid_from: string;
  valid_to: string;
  flat_discount_amt: string;
  clinic: string;
}

// Type definitions
interface ClinicData {
  uuid?: string;
  name: string;
  email: string;
  phone: string;
  type: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  about: string;
  insuranceNetworks: string[];
  specialties: string[];
  location: {
    lat: number;
    lng: number;
  };
  landmark?: string;
  gstNo?: string;
  foundedOn?: string | null;
  images?: string[];
  status?: string;
}

interface OperatingHour {
  open: string;
  close: string;
  closed: boolean;
}

interface OperatingHours {
  monday: OperatingHour;
  tuesday: OperatingHour;
  wednesday: OperatingHour;
  thursday: OperatingHour;
  friday: OperatingHour;
  saturday: OperatingHour;
  sunday: OperatingHour;
}

// Backend clinic type
interface BackendClinic {
  name: string;
  email: string;
  contact_number: string;
  address: string;
  city: string;
  pincode: string;
  about_clinic: string;
  coordinates?: string;
  uuid?: string;
  images?: string[];
  status?: string;
  gst_no?: string;
  founded_on?: string | null;
}

// Nominatim API response types
interface NominatimAddress {
  city?: string;
  town?: string;
  village?: string;
  state?: string;
  postcode?: string;
}

interface NominatimResult {
  place_id: string;
  lat: string;
  lon: string;
  display_name: string;
  address?: NominatimAddress;
}

interface NominatimReverseResult {
  display_name?: string;
  address?: NominatimAddress;
}

// Timing interface for API
interface TimingItem {
  day: string;
  opening_time: string;
  closing_time: string;
}

function debounce<T extends (...args: any[]) => void>(fn: T, delay: number) {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), delay);
  };
}

const ClinicSettingsDashboard = () => {
  const { data: user, status } = useSession();
  const { clinic, loading: isClinicLoading, error: clinicError } = useClinicByUser();

  const [clinicData, setClinicData] = useState<ClinicData>({
    name: '',
    email: '',
    phone: '',
    type: 'General Practice',
    address: '',
    city: '',
    state: '',
    postalCode: '',
    about: '',
    insuranceNetworks: [],
    specialties: [],
    location: {
      lat: 0,
      lng: 0,
    },
    images: []
  });

  // Carousel state
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  const [operatingHours, setOperatingHours] = useState<OperatingHours>({
    monday: { open: '09:00', close: '18:00', closed: false },
    tuesday: { open: '09:00', close: '18:00', closed: false },
    wednesday: { open: '09:00', close: '18:00', closed: false },
    thursday: { open: '09:00', close: '18:00', closed: false },
    friday: { open: '09:00', close: '18:00', closed: false },
    saturday: { open: '10:00', close: '16:00', closed: false },
    sunday: { open: '10:00', close: '14:00', closed: true }
  });

  const [newInsurance, setNewInsurance] = useState<string>('');
  const [newSpecialty, setNewSpecialty] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<NominatimResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState('');
  const [activeSection, setActiveSection] = useState<string>('');
  const searchRef = useRef<HTMLInputElement>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [mapZoom, setMapZoom] = useState(13);
  const [isLoading, setIsLoading] = useState(false);

  const clinicTypes: string[] = [
    'General Practice',
    'Dental Clinic',
    'Specialty Clinic',
    'Urgent Care',
    'Hospital'
  ];

  type TimeOption = { value: string; label: string };
  const timeOptions: TimeOption[] = [];
  for (let hour = 0; hour < 24; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      const displayTime = new Date(`2000-01-01T${time}:00`).toLocaleTimeString([], {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
      timeOptions.push({ value: time, label: displayTime });
    }
  }

  const dayNames: Record<keyof OperatingHours, string> = {
    monday: 'Monday',
    tuesday: 'Tuesday',
    wednesday: 'Wednesday',
    thursday: 'Thursday',
    friday: 'Friday',
    saturday: 'Saturday',
    sunday: 'Sunday'
  };

  // Helper function to parse coordinates safely
  const parseCoordinates = (coordinatesString?: string): { lat: number; lng: number } => {
    if (!coordinatesString) {
      return { lat: 8.5241, lng: 76.9366 };
    }

    try {
      if (coordinatesString.includes('POINT')) {
        const match = coordinatesString.match(/POINT\(([^)]+)\)/);
        if (match) {
          const coords = match[1].split(' ');
          const lng = parseFloat(coords[0]);
          const lat = parseFloat(coords[1]);
          if (!isNaN(lat) && !isNaN(lng)) {
            return { lat, lng };
          }
        }
      }

      const coords = coordinatesString.trim().split(/\s+/);
      if (coords.length >= 2) {
        const lng = parseFloat(coords[0]);
        const lat = parseFloat(coords[1]);
        if (!isNaN(lat) && !isNaN(lng)) {
          return { lat, lng };
        }
      }

      const commaCoords = coordinatesString.split(',');
      if (commaCoords.length === 2) {
        const lat = parseFloat(commaCoords[0].trim());
        const lng = parseFloat(commaCoords[1].trim());
        if (!isNaN(lat) && !isNaN(lng)) {
          return { lat, lng };
        }
      }
    } catch (error) {
      console.error('Error parsing coordinates:', error);
    }

    return { lat: 8.5241, lng: 76.9366 };
  };

  useEffect(() => {
    if (clinic) {
      const backendClinic = clinic as BackendClinic;
      const coordinates = parseCoordinates(backendClinic?.coordinates);

      setClinicData(prev => ({
        ...prev,
        name: backendClinic?.name || '',
        email: backendClinic?.email || '',
        phone: backendClinic?.contact_number || '',
        address: backendClinic?.address || '',
        city: backendClinic?.city || '',
        postalCode: backendClinic?.pincode?.toString() || '',
        about: backendClinic?.about_clinic || '',
        location: coordinates,
        uuid: backendClinic?.uuid || '',
        images: backendClinic?.images || [],
        status: backendClinic?.status || '',
        gstNo: backendClinic?.gst_no || '',
        foundedOn: backendClinic?.founded_on || null
      }));
    }
  }, [clinic]);

  // Carousel functions
  const nextImage = () => {
    if (clinicData.images && clinicData.images.length > 0) {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === clinicData.images!.length - 1 ? 0 : prevIndex + 1
      );
    }
  };

  const prevImage = () => {
    if (clinicData.images && clinicData.images.length > 0) {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === 0 ? clinicData.images!.length - 1 : prevIndex - 1
      );
    }
  };

  const goToImage = (index: number) => {
    setCurrentImageIndex(index);
  };

  // Auto-play carousel
  useEffect(() => {
    if (!isAutoPlaying || !clinicData.images || clinicData.images.length <= 1) return;

    const interval = setInterval(() => {
      nextImage();
    }, 5000);

    return () => clearInterval(interval);
  }, [currentImageIndex, isAutoPlaying, clinicData.images]);

  // Transform operating hours to API format
  const transformOperatingHoursToAPI = (operatingHours: OperatingHours): TimingItem[] => {
    const daysMapping: Record<keyof OperatingHours, string> = {
      monday: 'monday',
      tuesday: 'tuesday',
      wednesday: 'wednesday',
      thursday: 'thursday',
      friday: 'friday',
      saturday: 'saturday',
      sunday: 'sunday'
    };

    const timingList: TimingItem[] = [];

    Object.entries(operatingHours).forEach(([day, hours]) => {
      if (!hours.closed && hours.open && hours.close) {
        timingList.push({
          day: daysMapping[day as keyof OperatingHours],
          opening_time: `${hours.open}:00`,
          closing_time: `${hours.close}:00`
        });
      }
    });

    return timingList;
  };

  // Save operating hours
  const saveOperatingHours = async (clinicId: string, operatingHours: OperatingHours) => {
    try {
      const timingList = transformOperatingHoursToAPI(operatingHours);
      const body = {
        clinic: clinicId,
        timing_list: timingList
      };

      const response = await axiosPrivate.post('/clinic/clinic-timing-create/', body);
      return response.data;
    } catch (error) {
      console.error("Operating hours update error:", error);
      throw error;
    }
  };

  const handleInputChange = (field: keyof ClinicData, value: string) => {
    setClinicData(prev => ({ ...prev, [field]: value }));
  };

  const handleHoursChange = (day: keyof OperatingHours, field: keyof OperatingHour, value: string | boolean) => {
    setOperatingHours(prev => ({
      ...prev,
      [day]: { ...prev[day], [field]: value }
    }));
  };

  const toggleDayClosed = (day: keyof OperatingHours) => {
    setOperatingHours(prev => ({
      ...prev,
      [day]: { ...prev[day], closed: !prev[day].closed }
    }));
  };

  const addInsurance = () => {
    if (newInsurance.trim() && !clinicData.insuranceNetworks.includes(newInsurance.trim())) {
      setClinicData(prev => ({
        ...prev,
        insuranceNetworks: [...prev.insuranceNetworks, newInsurance.trim()]
      }));
      setNewInsurance('');
    }
  };

  const removeInsurance = (insurance: string) => {
    setClinicData(prev => ({
      ...prev,
      insuranceNetworks: prev.insuranceNetworks.filter(i => i !== insurance)
    }));
  };

  const addSpecialty = () => {
    if (newSpecialty.trim() && !clinicData.specialties.includes(newSpecialty.trim())) {
      setClinicData(prev => ({
        ...prev,
        specialties: [...prev.specialties, newSpecialty.trim()]
      }));
      setNewSpecialty('');
    }
  };

  const removeSpecialty = (specialty: string) => {
    setClinicData(prev => ({
      ...prev,
      specialties: prev.specialties.filter(s => s !== specialty)
    }));
  };

  const handleSave = async () => {
    setSaveStatus('saving');
    try {
      const requestData = {
        name: clinicData.name,
        email: clinicData.email,
        contact_number: clinicData.phone,
        address: clinicData.address,
        city: clinicData.city,
        pincode: clinicData.postalCode,
        about_clinic: clinicData.about,
        coordinates: `SRID=4326;POINT (${clinicData.location.lng} ${clinicData.location.lat})`
      };

      const clinicId = clinic ? (clinic as BackendClinic).uuid || '' : '';

      await editClinicODetails(clinicId, requestData);
      await saveOperatingHours(clinicId, operatingHours);

      console.log('Clinic details and operating hours updated successfully');
      setSaveStatus('saved');
      setIsEditMode(false);
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch (error) {
      console.error('Failed to update clinic details:', error);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 3000);
    }
  };

  const handleCancelEdit = () => {
    setIsEditMode(false);
    setSaveStatus('idle');
    // Reset form data if needed
    if (clinic) {
      const backendClinic = clinic as BackendClinic;
      const coordinates = parseCoordinates(backendClinic?.coordinates);
      setClinicData(prev => ({
        ...prev,
        name: backendClinic?.name || '',
        email: backendClinic?.email || '',
        phone: backendClinic?.contact_number || '',
        address: backendClinic?.address || '',
        city: backendClinic?.city || '',
        postalCode: backendClinic?.pincode?.toString() || '',
        about: backendClinic?.about_clinic || '',
        location: coordinates,
      }));
    }
  };

  // Geocoding functions
  const fetchSearchResults = debounce(async (query: string) => {
    if (!query) {
      setSearchResults([]);
      return;
    }
    setIsSearching(true);
    setSearchError('');
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&addressdetails=1&limit=5`
      );
      const data: NominatimResult[] = await res.json();
      setSearchResults(data);
    } catch (err) {
      setSearchError('Failed to fetch suggestions');
    } finally {
      setIsSearching(false);
    }
  }, 400);

  const fetchAddressFromCoords = async (lat: number, lon: number) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&addressdetails=1`
      );
      const data: NominatimReverseResult = await res.json();
      if (data && data.address) {
        setClinicData(prev => ({
          ...prev,
          address: data.display_name || '',
          city: data.address?.city || data.address?.town || data.address?.village || '',
          state: data.address?.state || '',
          postalCode: data.address?.postcode || '',
        }));
      }
    } catch (err) {
      console.error('Error fetching address:', err);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    fetchSearchResults(e.target.value);
    setDropdownOpen(true);
    setHighlightedIndex(-1);
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!dropdownOpen || searchResults.length === 0) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex(idx => Math.min(idx + 1, searchResults.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex(idx => Math.max(idx - 1, 0));
    } else if (e.key === 'Enter' && highlightedIndex >= 0) {
      handleSearchSelect(searchResults[highlightedIndex]);
    } else if (e.key === 'Escape') {
      setDropdownOpen(false);
    }
  };

  const handleSearchSelect = (result: NominatimResult) => {
    setClinicData(prev => ({
      ...prev,
      location: {
        lat: parseFloat(result.lat),
        lng: parseFloat(result.lon),
      },
      address: result.display_name || prev.address,
      city: result.address?.city || result.address?.town || result.address?.village || prev.city,
      state: result.address?.state || prev.state,
      postalCode: result.address?.postcode || prev.postalCode,
    }));
    setSearchQuery(result.display_name);
    setSearchResults([]);
    setDropdownOpen(false);
    setHighlightedIndex(-1);
    setMapZoom(16);
    if (searchRef.current) searchRef.current.blur();
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setDropdownOpen(false);
    setHighlightedIndex(-1);
    if (searchRef.current) searchRef.current.focus();
  };

  // Intersection Observer for active section
  useEffect(() => {
    const sections = document.querySelectorAll('[data-section]');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.getAttribute('data-section') || '');
          }
        });
      },
      { threshold: 0.3, rootMargin: '-100px 0px -50% 0px' }
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownOpen]);

  // Get header action button content
  const getHeaderActionButton = () => {
    if (isEditMode) {
      return (
        <div className="flex items-center space-x-3">
          <button
            onClick={handleCancelEdit}
            className="flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-xl hover:bg-white/30 transition-all duration-200 border border-white/30"
          >
            <X className="w-4 h-4 mr-2" />
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saveStatus === 'saving'}
            className={`flex items-center px-6 py-2 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 ${
              saveStatus === 'saving'
                ? 'bg-blue-400 text-white'
                : saveStatus === 'saved'
                ? 'bg-green-500 text-white'
                : saveStatus === 'error'
                ? 'bg-red-500 text-white'
                : 'bg-white text-blue-600 hover:bg-blue-50'
            }`}
          >
            {saveStatus === 'saving' ? (
              <>
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                Saving...
              </>
            ) : saveStatus === 'saved' ? (
              <>
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Saved
              </>
            ) : saveStatus === 'error' ? (
              <>
                <AlertCircle className="w-4 h-4 mr-2" />
                Error
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save
              </>
            )}
          </button>
        </div>
      );
    }

    return (
      <button
        onClick={() => setIsEditMode(true)}
        className="flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-xl hover:bg-white/30 transition-all duration-200 border border-white/30 group"
      >
        <Edit3 className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
        Edit Profile
      </button>
    );
  };

  if (isClinicLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading your clinic profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen ">
      {/* Header with Banner Carousel */}
      <div className="relative h-80 sm:h-96 rounded-xl overflow-hidden">
        {/* Banner Carousel */}
        {clinicData.images && clinicData.images.length > 0 ? (
          <div
            className="relative w-full h-full"
            onMouseEnter={() => setIsAutoPlaying(false)}
            onMouseLeave={() => setIsAutoPlaying(true)}
          >
            {/* Current Image */}
            <div
              className="w-full h-full bg-cover bg-center transition-all duration-500 ease-in-out"
              style={{ backgroundImage: `url(${clinicData.images[currentImageIndex]})` }}
            >
              <div className="absolute inset-0 bg-black/40"></div>
            </div>

            {/* Navigation Arrows */}
            {/* {clinicData.images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-3 transition-all duration-200"
                >
                  <ChevronLeft className="w-6 h-6 text-white" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-3 transition-all duration-200"
                >
                  <ChevronRight className="w-6 h-6 text-white" />
                </button>
              </>
            )} */}

            {/* Image Indicators */}
            {clinicData.images.length > 1 && (
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                {clinicData.images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToImage(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-200 ${
                      index === currentImageIndex
                        ? 'bg-white'
                        : 'bg-white/50 hover:bg-white/70'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        ) : (
          // Default gradient background when no images
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-700"></div>
        )}

        {/* Edit/Save Action Button - Top Right */}
        <div className="absolute top-6 right-6 z-20">
          {getHeaderActionButton()}
        </div>

        {/* Edit Mode Indicator */}
        {isEditMode && (
          <div className="absolute top-6 left-6 z-20">
            <div className="flex items-center px-4 py-2 bg-yellow-500/90 backdrop-blur-sm text-white rounded-xl border border-yellow-300">
              <Edit3 className="w-4 h-4 mr-2" />
              <span className="text-sm font-medium">Edit Mode</span>
            </div>
          </div>
        )}

        {/* Clinic Header Content */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white px-6 max-w-4xl mx-auto">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-white/20 backdrop-blur-sm rounded-3xl mb-6 border border-white/30 shadow-2xl">
              <Building2 className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold mb-4 drop-shadow-lg">
              {clinicData.name || 'Clinic Profile'}
            </h1>
            <p className="text-xl sm:text-2xl text-white/90 mb-6 drop-shadow">
              {isEditMode ? 'Edit your clinic information' : 'Manage your clinic information and settings'}
            </p>
            {clinicData.status && (
              <div className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full border border-white/30">
                <div className={`w-2 h-2 rounded-full mr-2 ${
                  clinicData.status === 'APPROVED' ? 'bg-green-400' : 
                  clinicData.status === 'PENDING' ? 'bg-yellow-400' : 'bg-red-400'
                }`}></div>
                <span className="text-sm font-semibold capitalize">
                  {clinicData.status.toLowerCase()}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Save Status Toast */}
        {saveStatus === 'saved' && (
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-20">
            <div className="flex items-center px-6 py-3 bg-green-500 text-white rounded-xl shadow-lg animate-bounce">
              <CheckCircle2 className="w-5 h-5 mr-2" />
              <span className="font-medium">Changes saved successfully!</span>
            </div>
          </div>
        )}

        {saveStatus === 'error' && (
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-20">
            <div className="flex items-center px-6 py-3 bg-red-500 text-white rounded-xl shadow-lg animate-bounce">
              <AlertCircle className="w-5 h-5 mr-2" />
              <span className="font-medium">Failed to save changes</span>
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="relative max-w-6xl mx-auto pb-20 mt-5">
        {/* Edit Mode Banner */}
        {isEditMode && (
          <div className="mb-8 p-6 bg-yellow-50 border border-yellow-200 rounded-3xl shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-yellow-100 rounded-2xl flex items-center justify-center">
                  <Edit3 className="w-5 h-5 text-yellow-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-yellow-800">Edit Mode Active</h3>
                  <p className="text-yellow-600 text-sm">
                    You are currently editing your clinic profile. Remember to save your changes.
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-sm text-yellow-600 font-medium">
                  All fields are now editable
                </span>
              </div>
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Sidebar - Quick Info */}
          <div className="lg:col-span-1 space-y-6">
            {/* Clinic Status Card */}
            <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <Shield className="w-5 h-5 text-blue-600 mr-2" />
                Clinic Status
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Verification</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    clinicData.status === 'APPROVED' 
                      ? 'bg-green-100 text-green-800'
                      : clinicData.status === 'PENDING'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                  }`}>
                    {clinicData.status || 'Not Set'}
                  </span>
                </div>
                {clinicData.gstNo && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">GST Number</span>
                    <span className="text-gray-900 font-medium">{clinicData.gstNo}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Contact Information Card */}
            <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <Phone className="w-5 h-5 text-blue-600 mr-2" />
                Contact Info
              </h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">{clinicData.email}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">{clinicData.phone}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600 text-sm">{clinicData.city}, {clinicData.state}</span>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <Award className="w-5 h-5 text-blue-600 mr-2" />
                Clinic Overview
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-2xl">
                  <Users className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900">{clinicData.specialties.length}+</div>
                  <div className="text-xs text-gray-600">Specialties</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-2xl">
                  <Calendar className="w-6 h-6 text-green-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900">
                    {Object.values(operatingHours).some(hour => !hour.closed) ? '24/7' : 'Limited'}
                  </div>
                  <div className="text-xs text-gray-600">Available</div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-8">
            {/* Clinic Information */}
            <section className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="p-8">
                <div className="flex items-center space-x-4 mb-8">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <Building2 className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Clinic Information</h2>
                    <p className="text-gray-500">Basic details about your clinic</p>
                  </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">Clinic Name</label>
                    <input
                      type="text"
                      value={clinicData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      disabled={!isEditMode}
                      className="w-full px-4 py-4 bg-gray-50 border-0 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all duration-200 text-gray-900 disabled:bg-gray-100 disabled:text-gray-500 text-lg"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">Clinic Type</label>
                    <div className="relative">
                      <select
                        value={clinicData.type}
                        onChange={(e) => handleInputChange('type', e.target.value)}
                        disabled={!isEditMode}
                        className="w-full px-4 py-4 bg-gray-50 border-0 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all duration-200 text-gray-900 disabled:bg-gray-100 disabled:text-gray-500 appearance-none text-lg"
                      >
                        {clinicTypes.map(type => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="email"
                        value={clinicData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        disabled={!isEditMode}
                        className="w-full pl-12 pr-4 py-4 bg-gray-50 border-0 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all duration-200 text-gray-900 disabled:bg-gray-100 disabled:text-gray-500 text-lg"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">Phone Number</label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="tel"
                        value={clinicData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        disabled={!isEditMode}
                        className="w-full pl-12 pr-4 py-4 bg-gray-50 border-0 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all duration-200 text-gray-900 disabled:bg-gray-100 disabled:text-gray-500 text-lg"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Location Section */}
            <section className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="p-8">
                <div className="flex items-center space-x-4 mb-8">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Location</h2>
                    <p className="text-gray-500">Set your clinic's address and location</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">Street Address</label>
                    <input
                      type="text"
                      value={clinicData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      disabled={!isEditMode}
                      className="w-full px-4 py-4 bg-gray-50 border-0 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all duration-200 text-gray-900 disabled:bg-gray-100 disabled:text-gray-500 text-lg"
                    />
                  </div>

                  <div className="grid gap-6 md:grid-cols-3">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">City</label>
                      <input
                        type="text"
                        value={clinicData.city}
                        onChange={(e) => handleInputChange('city', e.target.value)}
                        disabled={!isEditMode}
                        className="w-full px-4 py-4 bg-gray-50 border-0 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all duration-200 text-gray-900 disabled:bg-gray-100 disabled:text-gray-500 text-lg"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">State</label>
                      <input
                        type="text"
                        value={clinicData.state}
                        onChange={(e) => handleInputChange('state', e.target.value)}
                        disabled={!isEditMode}
                        className="w-full px-4 py-4 bg-gray-50 border-0 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all duration-200 text-gray-900 disabled:bg-gray-100 disabled:text-gray-500 text-lg"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">Postal Code</label>
                      <input
                        type="text"
                        value={clinicData.postalCode}
                        onChange={(e) => handleInputChange('postalCode', e.target.value)}
                        disabled={!isEditMode}
                        className="w-full px-4 py-4 bg-gray-50 border-0 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all duration-200 text-gray-900 disabled:bg-gray-100 disabled:text-gray-500 text-lg"
                      />
                    </div>
                  </div>

                  {/* Location Search and Map */}
                  {isEditMode && (
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
                      <h3 className="text-lg font-semibold text-blue-900 mb-4 flex items-center">
                        <MapPin className="w-5 h-5 text-blue-600 mr-2" />
                        Pick Location on Map
                      </h3>
                      <div className="mb-4">
                        <div className="relative">
                          <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-blue-400" />
                          <input
                            ref={searchRef}
                            type="text"
                            value={searchQuery}
                            onChange={handleSearchChange}
                            onKeyDown={handleSearchKeyDown}
                            placeholder="Search for address, city, or place..."
                            className="w-full pl-12 pr-12 py-4 bg-white border-0 rounded-2xl focus:ring-2 focus:ring-blue-500 shadow-sm text-lg"
                            onFocus={() => setDropdownOpen(true)}
                            autoComplete="off"
                          />
                          {searchQuery && (
                            <button
                              onClick={handleClearSearch}
                              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-blue-400 hover:text-blue-600 transition-colors p-2"
                            >
                              <X className="w-5 h-5" />
                            </button>
                          )}
                          {isSearching && (
                            <div className="absolute right-12 top-1/2 transform -translate-y-1/2">
                              <div className="w-5 h-5 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
                            </div>
                          )}
                          {dropdownOpen && searchResults.length > 0 && (
                            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50">
                              {searchResults.map((result, idx) => (
                                <button
                                  key={result.place_id}
                                  onClick={() => handleSearchSelect(result)}
                                  className={`w-full px-6 py-4 text-left hover:bg-blue-50 transition-colors border-b border-gray-50 last:border-b-0 ${idx === highlightedIndex ? 'bg-blue-50' : ''
                                    }`}
                                >
                                  <div className="flex items-center space-x-3">
                                    <MapPin className="w-5 h-5 text-blue-400 flex-shrink-0" />
                                    <span className="text-gray-900 truncate">{result.display_name}</span>
                                  </div>
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                      <MapPicker
                        value={{
                          lat: isNaN(clinicData.location.lat) ? 8.5241 : clinicData.location.lat,
                          lng: isNaN(clinicData.location.lng) ? 76.9366 : clinicData.location.lng
                        }}
                        onChange={async (coords) => {
                          if (!isNaN(coords.lat) && !isNaN(coords.lng)) {
                            setClinicData(prev => ({ ...prev, location: coords }));
                            await fetchAddressFromCoords(coords.lat, coords.lng);
                            setMapZoom(13);
                          }
                        }}
                        disabled={!isEditMode}
                        zoom={mapZoom}
                      />
                      <div className="mt-4 p-4 bg-white rounded-xl border border-blue-100">
                        <div className="text-sm text-blue-700">
                          <span className="font-semibold">Coordinates:</span>{' '}
                          {isNaN(clinicData.location.lat) ? '0.00000' : clinicData.location.lat.toFixed(5)}
                          , {isNaN(clinicData.location.lng) ? '0.00000' : clinicData.location.lng.toFixed(5)}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </section>

            {/* Operating Hours */}
            <section className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="p-8">
                <div className="flex items-center space-x-4 mb-8">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Operating Hours</h2>
                    <p className="text-gray-500">Set your clinic's working hours</p>
                  </div>
                </div>
                <div className="space-y-4">
                  {Object.entries(operatingHours).map(([day, hours]) => (
                    <div key={day} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-6 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors">
                      <div className="flex items-center space-x-4 min-w-[140px]">
                        <div className="w-20">
                          <span className="text-lg font-semibold text-gray-900 capitalize">
                            {dayNames[day as keyof OperatingHours]}
                          </span>
                        </div>
                        <button
                          onClick={() => toggleDayClosed(day as keyof OperatingHours)}
                          disabled={!isEditMode}
                          className={`relative inline-flex h-8 w-14 items-center rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 ${hours.closed ? 'bg-gray-300' : 'bg-blue-500'
                            }`}
                        >
                          <span
                            className={`inline-block h-6 w-6 transform rounded-full bg-white shadow-lg transition-transform ${hours.closed ? 'translate-x-1' : 'translate-x-7'
                              }`}
                          />
                        </button>
                      </div>
                      <div className="flex-1 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 w-full">
                        {hours.closed ? (
                          <span className="text-gray-400 font-medium">Closed</span>
                        ) : (
                          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full">
                            <select
                              value={hours.open}
                              onChange={(e) => handleHoursChange(day as keyof OperatingHours, 'open', e.target.value)}
                              disabled={!isEditMode}
                              className="w-full sm:w-auto px-3 py-2 bg-white border border-gray-200 rounded-lg text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-400 disabled:bg-gray-100 disabled:text-gray-500"
                            >
                              {timeOptions.map(time => (
                                <option key={time.value} value={time.value}>{time.label}</option>
                              ))}
                            </select>
                            <span className="text-gray-400 font-medium text-center">—</span>
                            <select
                              value={hours.close}
                              onChange={(e) => handleHoursChange(day as keyof OperatingHours, 'close', e.target.value)}
                              disabled={!isEditMode}
                              className="w-full sm:w-auto px-3 py-2 bg-white border border-gray-200 rounded-lg text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-400 disabled:bg-gray-100 disabled:text-gray-500"
                            >
                              {timeOptions.map(time => (
                                <option key={time.value} value={time.value}>{time.label}</option>
                              ))}
                            </select>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Additional Information */}
            <section className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="p-8">
                <div className="flex items-center space-x-4 mb-8">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-2xl flex items-center justify-center shadow-lg">
                    <Settings className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Additional Information</h2>
                    <p className="text-gray-500">Tell us more about your clinic</p>
                  </div>
                </div>
                <div className="space-y-8">
                  {/* About Clinic */}
                  <div>
                    <label className="text-sm font-semibold text-gray-700 mb-2 ml-1 block">About Your Clinic</label>
                    <textarea
                      value={clinicData.about}
                      onChange={(e) => handleInputChange('about', e.target.value)}
                      disabled={!isEditMode}
                      rows={4}
                      className="w-full px-4 py-3 bg-gray-50 border-0 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all duration-200 text-gray-900 disabled:bg-gray-100 disabled:text-gray-500 resize-none"
                      placeholder="Describe your clinic, services, and what makes you unique..."
                    />
                  </div>

                  {/* Insurance Networks */}
                  <div>
                    <label className="text-sm font-semibold text-gray-700 mb-2 ml-1 block">Insurance Networks</label>
                    <div className="space-y-3">
                      <div className="flex flex-wrap gap-2">
                        {clinicData.insuranceNetworks.map((insurance, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                          >
                            {insurance}
                            {isEditMode && (
                              <button
                                onClick={() => removeInsurance(insurance)}
                                className="ml-2 text-blue-600 hover:text-blue-800"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            )}
                          </span>
                        ))}
                      </div>
                      {isEditMode && (
                        <div className="flex flex-col sm:flex-row gap-2">
                          <input
                            type="text"
                            value={newInsurance}
                            onChange={(e) => setNewInsurance(e.target.value)}
                            placeholder="Add insurance network..."
                            className="flex-1 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-400"
                            onKeyPress={(e) => e.key === 'Enter' && addInsurance()}
                          />
                          <button
                            onClick={addInsurance}
                            className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Specialties */}
                  <div>
                    <label className="text-sm font-semibold text-gray-700 mb-2 ml-1 block">Specialties</label>
                    <div className="space-y-3">
                      <div className="flex flex-wrap gap-2">
                        {clinicData.specialties.map((specialty, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-sm font-medium"
                          >
                            {specialty}
                            {isEditMode && (
                              <button
                                onClick={() => removeSpecialty(specialty)}
                                className="ml-2 text-emerald-600 hover:text-emerald-800"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            )}
                          </span>
                        ))}
                      </div>
                      {isEditMode && (
                        <div className="flex flex-col sm:flex-row gap-2">
                          <input
                            type="text"
                            value={newSpecialty}
                            onChange={(e) => setNewSpecialty(e.target.value)}
                            placeholder="Add specialty..."
                            className="flex-1 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-400"
                            onKeyPress={(e) => e.key === 'Enter' && addSpecialty()}
                          />
                          <button
                            onClick={addSpecialty}
                            className="px-3 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClinicSettingsDashboard;