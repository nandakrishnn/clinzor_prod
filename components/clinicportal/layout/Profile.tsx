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
  AlertCircle
} from 'lucide-react';
import MapPicker from './MapPicker';

// Type definitions
interface ClinicData {
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

function debounce<T extends (...args: any[]) => void>(fn: T, delay: number) {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), delay);
  };
}

const ClinicSettingsDashboard = () => {
  const [clinicData, setClinicData] = useState<ClinicData>({
    name: 'Prime Healthcare Clinic',
    email: 'contact@primehealthcare.com',
    phone: '9876543210',
    type: 'General Practice',
    address: '123 Medical Center Drive',
    city: 'Kozhikode',
    state: 'Kerala',
    postalCode: '673001',
    about: 'We are a leading healthcare provider committed to delivering exceptional medical services with compassion and expertise.',
    insuranceNetworks: ['Aetna', 'Blue Cross Blue Shield', 'Cigna'],
    specialties: ['General Medicine', 'Cardiology', 'Pediatrics'],
    location: {
      lat: 11.2588,
      lng: 75.7804,
    },
  });

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
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState('');
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [activeSection, setActiveSection] = useState<string>('');
  const searchRef = useRef<HTMLInputElement>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [mapZoom, setMapZoom] = useState(13);

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
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
    console.log('Saving clinic data:', clinicData);
    console.log('Saving operating hours:', operatingHours);
      setSaveStatus('saved');
    setIsEditMode(false);
      setTimeout(() => setSaveStatus('idle'), 3000);
    } catch (error) {
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 3000);
    }
  };

  // Geocoding
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
      const data = await res.json();
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
      const data = await res.json();
      if (data && data.address) {
        setClinicData(prev => ({
          ...prev,
          address: data.display_name || '',
          city: data.address.city || data.address.town || data.address.village || '',
          state: data.address.state || '',
          postalCode: data.address.postcode || '',
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

  const handleSearchSelect = (result: any) => {
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
  React.useEffect(() => {
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

  const getSaveButtonContent = () => {
    switch (saveStatus) {
      case 'saving':
        return (
          <>
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
            <span>Saving...</span>
          </>
        );
      case 'saved':
        return (
          <>
            <CheckCircle2 className="w-4 h-4 mr-2" />
            <span>Saved</span>
          </>
        );
      case 'error':
        return (
          <>
            <AlertCircle className="w-4 h-4 mr-2" />
            <span>Error</span>
          </>
        );
      default:
        return (
          <>
            <Save className="w-4 h-4 mr-2" />
            <span>Save Changes</span>
          </>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Floating Navigation */}

      {/* Header and Main Content */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5" />
        <div className="relative max-w-4xl mx-auto px-6 pt-24 pb-12">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-3xl mb-6 shadow-xl">
              <Building2 className="w-10 h-10 text-white" />
              </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-3">
                  Clinic Settings
                </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Manage your clinic information and customize your practice settings
            </p>
            </div>
            
          <div className="flex items-center justify-center space-x-4">
              <button
                onClick={() => setIsEditMode(!isEditMode)}
              className={`inline-flex items-center px-6 py-3 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 ${
                isEditMode
                  ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  : 'bg-blue-500 text-white hover:bg-blue-600 shadow-lg hover:shadow-xl'
              }`}
              >
                <Edit3 className="w-4 h-4 mr-2" />
                {isEditMode ? 'Cancel' : 'Edit Profile'}
              </button>
            
              <button
                onClick={handleSave}
              disabled={saveStatus === 'saving'}
              className={`inline-flex items-center px-8 py-3 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl ${
                saveStatus === 'saved'
                  ? 'bg-green-500 text-white'
                  : saveStatus === 'error'
                  ? 'bg-red-500 text-white'
                  : 'bg-gray-900 text-white hover:bg-gray-800'
              }`}
            >
              {getSaveButtonContent()}
              </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 pb-20 space-y-8">
        {/* Clinic Information */}
        <section id="info" data-section="info" className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-8">
            <div className="flex items-center space-x-4 mb-8">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center">
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

        {/* Location */}
        <section id="location" data-section="location" className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-8">
            <div className="flex items-center space-x-4 mb-8">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center">
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

              {/* Location Search */}
              {isEditMode && (
                <div className="bg-blue-50 rounded-2xl p-6">
                  <h3 className="text-lg font-semibold text-blue-900 mb-4">Pick Location on Map</h3>
                  {/* Search Bar for Location Name/Address */}
                  <div className="mb-4">
                    <div className="relative">
                      <SearchIcon className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-blue-400" />
                      <input
                        ref={searchRef}
                        type="text"
                        value={searchQuery}
                        onChange={handleSearchChange}
                        onKeyDown={handleSearchKeyDown}
                        placeholder="Search for address, city, or place..."
                        className="w-full pl-10 sm:pl-12 pr-10 sm:pr-12 py-3 sm:py-4 bg-white border-0 rounded-2xl focus:ring-2 focus:ring-blue-500 shadow-sm text-base sm:text-lg"
                        onFocus={() => setDropdownOpen(true)}
                        autoComplete="off"
                      />
                      {searchQuery && (
                        <button
                          onClick={handleClearSearch}
                          className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 text-blue-400 hover:text-blue-600 transition-colors p-1 sm:p-2"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      )}
                      {isSearching && (
                        <div className="absolute right-10 sm:right-12 top-1/2 transform -translate-y-1/2">
                          <div className="w-5 h-5 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
                        </div>
                      )}
                      {dropdownOpen && searchResults.length > 0 && (
                        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-[9999] w-full max-w-xs sm:max-w-none mx-auto sm:mx-0">
                          {searchResults.map((result, idx) => (
                            <button
                              key={result.place_id}
                              onClick={() => handleSearchSelect(result)}
                              className={`w-full px-4 sm:px-6 py-3 sm:py-4 text-left hover:bg-blue-50 transition-colors border-b border-gray-50 last:border-b-0 ${
                                idx === highlightedIndex ? 'bg-blue-50' : ''
                              }`}
                            >
                              <div className="flex items-center space-x-2 sm:space-x-3">
                                <MapPin className="w-5 h-5 text-blue-400 flex-shrink-0" />
                                <span className="text-gray-900 truncate text-sm sm:text-base">{result.display_name}</span>
                              </div>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <MapPicker
                    value={clinicData.location}
                    onChange={async (coords) => {
                      setClinicData(prev => ({ ...prev, location: coords }));
                      await fetchAddressFromCoords(coords.lat, coords.lng);
                      setMapZoom(13);
                    }}
                    disabled={!isEditMode}
                    zoom={mapZoom}
                  />
                  <div className="mt-4 p-4 bg-white rounded-xl">
                    <div className="text-sm text-blue-700">
                      <span className="font-semibold">Coordinates:</span> {clinicData.location.lat.toFixed(5)}, {clinicData.location.lng.toFixed(5)}
                    </div>
              </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Operating Hours */}
        <section id="hours" data-section="hours" className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-8">
            <div className="flex items-center space-x-4 mb-8">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Operating Hours</h2>
                <p className="text-gray-500">Set your clinic's working hours</p>
              </div>
            </div>
            <div className="space-y-4">
              {Object.entries(operatingHours).map(([day, hours]) => (
                <div key={day} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 sm:p-6 bg-gray-50 rounded-2xl">
                  <div className="flex items-center space-x-4 min-w-[140px]">
                    <div className="w-20">
                      <span className="text-base sm:text-lg font-semibold text-gray-900 capitalize">
                        {dayNames[day as keyof OperatingHours]}
                      </span>
                    </div>
                    <button
                      onClick={() => toggleDayClosed(day as keyof OperatingHours)}
                      disabled={!isEditMode}
                      className={`relative inline-flex h-8 w-14 items-center rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 ${
                        hours.closed ? 'bg-gray-300' : 'bg-blue-500'
                      }`}
                    >
                      <span
                        className={`inline-block h-6 w-6 transform rounded-full bg-white shadow-lg transition-transform ${
                          hours.closed ? 'translate-x-1' : 'translate-x-7'
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
                          className="w-full sm:w-auto px-3 py-2 bg-white border border-gray-200 rounded-lg text-base focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 disabled:bg-gray-100 disabled:text-gray-500"
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
                          className="w-full sm:w-auto px-3 py-2 bg-white border border-gray-200 rounded-lg text-base focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 disabled:bg-gray-100 disabled:text-gray-500"
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
        <section id="additional" data-section="additional" className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-8">
            <div className="flex items-center space-x-4 mb-8">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-2xl flex items-center justify-center">
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
                  className="w-full px-4 py-3 bg-gray-50 border-0 rounded-2xl focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all duration-200 text-gray-900 disabled:bg-gray-100 disabled:text-gray-500 resize-none"
                  placeholder="Describe your clinic, services, and what makes you unique..."
                />
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
                        className="flex-1 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
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
  );
};

export default ClinicSettingsDashboard;