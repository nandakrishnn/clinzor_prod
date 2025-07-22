"use client";
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IconArrowRight, IconFilter, IconMapPin, IconSearch } from '@tabler/icons-react';
import { X as IconX, Check as IconCheck } from 'lucide-react';
import cn from 'classnames';
import useMedia from '@/src/hooks/useMedia';

// Import our dropdown components
import useDropdown from './use';
import ResponsiveDropdown from './responsivedropdown';

interface SearchParams {
  keyword: string;
  serviceType: string;
  specialty: string;
  location: string;
}

interface SearchBarProps {
  className?: string;
  onSearch?: (params: SearchParams) => void;
}

export interface Option {
  value: string;
  label: string;
}

const serviceOptions: Option[] = [
  { value: 'consultation', label: 'Consultation' },
  { value: 'telehealth', label: 'Telehealth' },
  { value: 'checkup', label: 'General Check-up' },
  { value: 'emergency', label: 'Emergency' },
  { value: 'surgery', label: 'Surgery' },
  { value: 'lab', label: 'Lab Tests' },
  { value: 'imaging', label: 'Advanced Imaging' },
  { value: 'preventive', label: 'Preventive Care' },
  { value: 'specialist', label: 'Specialist Referral' },
];

const specialtyOptions: Option[] = [
  { value: 'family', label: 'Family Medicine' },
  { value: 'cardiology', label: 'Cardiology' },
  { value: 'dermatology', label: 'Dermatology' },
  { value: 'neurology', label: 'Neurology' },
  { value: 'pediatrics', label: 'Pediatrics' },
  { value: 'orthopedics', label: 'Orthopedics' },
  { value: 'psychiatry', label: 'Psychiatry' },
  { value: 'dentistry', label: 'Dentistry' },
  { value: 'optometry', label: 'Optometry' },
  { value: 'oncology', label: 'Oncology' },
  { value: 'endocrinology', label: 'Endocrinology' },
  { value: 'obstetrics', label: 'Obstetrics & Gynecology' },
];

const popularSearches = [
  'Primary Care', 
  'Dentist', 
  'Pediatrician', 
  'Dermatologist'
];

const SearchBar: React.FC<SearchBarProps> = ({ className, onSearch }) => {
  const [keyword, setKeyword] = useState('');
  const [serviceType, setServiceType] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [location, setLocation] = useState('');
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [activePopular, setActivePopular] = useState<string | null>(null);
  const [filtersCount, setFiltersCount] = useState(0);
  
  // Use our custom hooks for dropdowns
  // Use our custom dropdown hooks with unique IDs for coordination
  const serviceDropdown = useDropdown(false, 'service-dropdown');
  const specialtyDropdown = useDropdown(false, 'specialty-dropdown');
  
  const searchFormRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const isMobileView = useMedia('(max-width: 768px)');

  // Initialize filters visibility based on view
  useEffect(() => {
    setShowFilters(!isMobileView);
  }, [isMobileView]);

  // Update filters count
  useEffect(() => {
    let count = 0;
    if (serviceType) count++;
    if (specialty) count++;
    if (location) count++;
    setFiltersCount(count);
  }, [serviceType, specialty, location]);

  const handleDetectLocation = useCallback(() => {
    if (!navigator.geolocation) {
      alert('Geolocation not supported.');
      return;
    }
    setIsDetectingLocation(true);
    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${coords.latitude}&lon=${coords.longitude}`
          );
          const data = await res.json();
          const city =
            data.address?.city ||
            data.address?.town ||
            data.display_name ||
            'Unknown';
          setLocation(city);
        } catch {
          setLocation('Unknown');
        } finally {
          setIsDetectingLocation(false);
        }
      },
      () => {
        setIsDetectingLocation(false);
      }
    );
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.({ keyword, serviceType, specialty, location });
  };

  const clearKeyword = () => {
    setKeyword('');
    setActivePopular(null);
  };

  const clearFilter = (type: 'service' | 'specialty' | 'location') => {
    switch (type) {
      case 'service':
        setServiceType('');
        break;
      case 'specialty':
        setSpecialty('');
        break;
      case 'location':
        setLocation('');
        break;
    }
  };

  const handlePopularSearch = (term: string) => {
    setKeyword(term);
    setActivePopular(term);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  // Close mobile filters on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        isMobileView &&
        showFilters &&
        searchFormRef.current &&
        !searchFormRef.current.contains(e.target as Node)
      ) {
        setShowFilters(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMobileView, showFilters]);

  // Get selected option label
  const getSelectedLabel = (options: Option[], value: string) => {
    const option = options.find(opt => opt.value === value);
    return option ? option.label : '';
  };

  // Dropdown content components to keep the render method clean
  const serviceDropdownContent = (
    <div className="py-1 max-h-64 overflow-y-auto">
      {serviceOptions.map((option) => (
        <motion.button
          key={option.value}
          type="button"
          onClick={() => {
            setServiceType(option.value);
            serviceDropdown.close();
          }}
          className={cn(
            "w-full px-4 py-2.5 text-left text-sm hover:bg-blue-50/80 transition-colors flex items-center justify-between",
            serviceType === option.value ? "bg-blue-50 text-blue-600 font-medium" : "text-gray-700"
          )}
          whileHover={{ backgroundColor: "rgba(219, 234, 254, 0.7)" }}
          whileTap={{ backgroundColor: "rgba(219, 234, 254, 0.9)" }}
        >
          <span>{option.label}</span>
          {serviceType === option.value && <IconCheck size={16} className="text-blue-600" />}
        </motion.button>
      ))}
    </div>
  );

  const specialtyDropdownContent = (
    <div className="py-1 max-h-64 overflow-y-auto">
      {specialtyOptions.map((option) => (
        <motion.button
          key={option.value}
          type="button"
          onClick={() => {
            setSpecialty(option.value);
            specialtyDropdown.close();
          }}
          className={cn(
            "w-full px-4 py-2.5 text-left text-sm hover:bg-blue-50/80 transition-colors flex items-center justify-between",
            specialty === option.value ? "bg-blue-50 text-blue-600 font-medium" : "text-gray-700"
          )}
          whileHover={{ backgroundColor: "rgba(219, 234, 254, 0.7)" }}
          whileTap={{ backgroundColor: "rgba(219, 234, 254, 0.9)" }}
        >
          <span>{option.label}</span>
          {specialty === option.value && <IconCheck size={16} className="text-blue-600" />}
        </motion.button>
      ))}
    </div>
  );

  return (
    <div className={cn('w-full max-w-6xl mx-auto px-4 md:px-6', className)}>
      <motion.div
        className="flex justify-center mb-4"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h2 className="text-lg md:text-xl font-medium text-gray-800">
          Find healthcare providers & services
        </h2>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="bg-white/70 backdrop-blur-sm rounded-3xl overflow-hidden shadow-xl"
        style={{
          boxShadow: isInputFocused
            ? '0 20px 30px rgba(0, 0, 0, 0.12), 0 4px 10px rgba(66, 99, 235, 0.1)'
            : '0 10px 25px rgba(0, 0, 0, 0.08), 0 2px 10px rgba(0, 0, 0, 0.04)',
          transition: 'box-shadow 0.3s ease, transform 0.3s ease'
        }}
      >
        <form
          ref={searchFormRef}
          onSubmit={handleSubmit}
          className="relative"
        >
          <div className="flex flex-col md:flex-row">
            {/* Location */}
            <div className="p-4 md:pl-6 md:pr-4 md:py-5 border-b md:border-b-0 md:border-r border-gray-100 flex-shrink-0">
              <div className="flex flex-col">
                <label className="text-xs text-gray-500 mb-1.5 font-medium">LOCATION</label>
                <div className="flex items-center">
                  {isDetectingLocation ? (
                    <motion.div
                      animate={{ opacity: [0.7, 1, 0.7] }}
                      transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
                      className="flex items-center gap-2 text-sm text-gray-600"
                    >
                      <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}>
                        <IconMapPin size={16} className="text-blue-600" />
                      </motion.div>
                      <span>Finding location...</span>
                    </motion.div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <motion.button
                        type="button"
                        onClick={handleDetectLocation}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        transition={{ duration: 0.2 }}
                        className="flex items-center gap-2 text-sm text-gray-700 hover:text-blue-600 focus:outline-none transition-colors"
                      >
                        <IconMapPin size={16} className="text-blue-600" />
                        <span className="font-medium">
                          {location || 'Set your location'}
                        </span>
                      </motion.button>
                      {location && (
                        <motion.button
                          type="button"
                          onClick={() => clearFilter('location')}
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ duration: 0.2 }}
                          className="p-1 rounded-full hover:bg-gray-100"
                        >
                          <IconX size={14} className="text-gray-500" />
                        </motion.button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Keyword Search */}
            <div className="p-4 md:px-5 md:py-5 border-b md:border-b-0 md:border-r border-gray-100 flex-1">
              <div className="flex flex-col">
                <label htmlFor="keyword-search" className="text-xs text-gray-500 mb-1.5 font-medium">
                  SEARCH
                </label>
                <div className="relative flex items-center">
                  <IconSearch 
                    size={18} 
                    className={cn(
                      "mr-2 transition-colors",
                      isInputFocused ? "text-blue-600" : "text-gray-400"
                    )} 
                  />
                  <input
                    id="keyword-search"
                    ref={inputRef}
                    type="text"
                    value={keyword}
                    onChange={e => setKeyword(e.target.value)}
                    onFocus={() => setIsInputFocused(true)}
                    onBlur={() => setIsInputFocused(false)}
                    placeholder={isMobileView ? "Search healthcare" : "Search doctors, clinics or services"}
                    className="w-full bg-transparent border-none text-gray-800 focus:outline-none text-sm md:text-base py-1"
                  />
                  <AnimatePresence>
                    {keyword && (
                      <motion.button
                        type="button"
                        onClick={clearKeyword}
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="ml-2 p-1 rounded-full hover:bg-gray-100"
                      >
                        <IconX size={16} className="text-gray-500" />
                      </motion.button>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>

            {/* Desktop Filters */}
            <div className={cn("md:flex flex-shrink-0", isMobileView ? "hidden" : "")}>
              {/* Service Type */}
              <div className="p-4 md:px-5 md:py-5 border-b md:border-b-0 md:border-r border-gray-100">
                <div className="flex flex-col">
                  <label className="text-xs text-gray-500 mb-1.5 font-medium">
                    SERVICE TYPE
                  </label>
                  <div className="relative flex items-center">
                    <ResponsiveDropdown
                      isOpen={serviceDropdown.isOpen}
                      onClose={serviceDropdown.close}
                      title="Select Service Type"
                      trigger={
                        <motion.button
                          type="button"
                          onClick={serviceDropdown.toggle}
                          className={cn(
                            "flex items-center justify-between min-w-32 h-8 px-3 py-1.5 text-sm transition-all",
                            isMobileView ? "rounded-md" : "rounded-full", 
                            serviceType 
                              ? "border-blue-300 bg-blue-50/50 text-blue-600 font-medium" 
                              : "border-gray-200 hover:border-blue-300 bg-white text-gray-700"
                          )}
                          whileHover={{ scale: 1.01 }}
                          whileTap={{ scale: 0.99 }}
                        >
                          <span className="truncate">
                            {serviceType ? getSelectedLabel(serviceOptions, serviceType) : 'Any service'}
                          </span>
                          <svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            className={cn("w-4 h-4 ml-1 transition-transform", 
                              serviceDropdown.isOpen ? "transform rotate-180" : "",
                              serviceType ? "text-blue-600" : "text-gray-500")} 
                            fill="none" 
                            viewBox="0 0 24 24" 
                            stroke="currentColor"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </motion.button>
                      }
                    >
                      {serviceDropdownContent}
                    </ResponsiveDropdown>
                    {serviceType && (
                      <motion.button
                        type="button"
                        onClick={() => clearFilter('service')}
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.2 }}
                        className="ml-2 p-1 rounded-full hover:bg-gray-100"
                      >
                        <IconX size={14} className="text-gray-500" />
                      </motion.button>
                    )}
                  </div>
                </div>
              </div>

              {/* Specialty */}
              <div className="p-4 md:px-5 md:py-5 border-b md:border-b-0 md:border-r border-gray-100">
                <div className="flex flex-col">
                  <label className="text-xs text-gray-500 mb-1.5 font-medium">
                    SPECIALTY
                  </label>
                  <div className="relative flex items-center">
                    <ResponsiveDropdown
                      isOpen={specialtyDropdown.isOpen}
                      onClose={specialtyDropdown.close}
                      title="Select Specialty"
                      trigger={
                        <motion.button
                          type="button"
                          onClick={specialtyDropdown.toggle}
                          className={cn(
                            "flex items-center justify-between min-w-32 h-8 px-3 py-1.5 text-sm border transition-all",
                            isMobileView ? "rounded-md" : "rounded-full",
                            specialty 
                              ? "border-blue-300 bg-blue-50/50 text-blue-600 font-medium" 
                              : "border-gray-200 hover:border-blue-300 bg-white text-gray-700"
                          )}
                          whileHover={{ scale: 1.01 }}
                          whileTap={{ scale: 0.99 }}
                        >
                          <span className="truncate">
                            {specialty ? getSelectedLabel(specialtyOptions, specialty) : 'Any specialty'}
                          </span>
                          <svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            className={cn("w-4 h-4 ml-1 transition-transform", 
                              specialtyDropdown.isOpen ? "transform rotate-180" : "",
                              specialty ? "text-blue-600" : "text-gray-500")} 
                            fill="none" 
                            viewBox="0 0 24 24" 
                            stroke="currentColor"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </motion.button>
                      }
                    >
                      {specialtyDropdownContent}
                    </ResponsiveDropdown>
                    {specialty && (
                      <motion.button
                        type="button"
                        onClick={() => clearFilter('specialty')}
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.2 }}
                        className="ml-2 p-1 rounded-full hover:bg-gray-100"
                      >
                        <IconX size={14} className="text-gray-500" />
                      </motion.button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Search Button (Desktop) */}
            <div className={cn("p-4 md:px-6 md:py-5 flex-shrink-0 flex items-end", isMobileView ? "hidden" : "")}>
              <motion.button
                type="submit"
                className="w-full h-10 bg-blue-600 hover:bg-blue-700 text-white rounded-full px-6 flex items-center justify-center gap-2 transition-colors"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <span className="font-medium">Search</span>
                <IconArrowRight size={16} className="ml-1" />
              </motion.button>
            </div>
          </div>

          {/* Mobile Filters Toggle */}
          {isMobileView && (
            <div className="px-4 py-3 border-t border-gray-100 flex justify-between items-center">
              <motion.button
                type="button"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center text-sm text-gray-600 hover:text-blue-600 transition-colors"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                <IconFilter size={16} className="mr-2" />
                <span>
                  {showFilters ? 'Hide filters' : 'Show filters'}
                </span>
                {filtersCount > 0 && !showFilters && (
                  <span className="ml-2 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {filtersCount}
                  </span>
                )}
              </motion.button>
              
              {/* Active filters indicators for mobile view */}
              {!showFilters && filtersCount > 0 && (
                <div className="flex items-center gap-2">
                  {serviceType && (
                    <span className="text-xs bg-blue-50 text-blue-600 py-1 px-2 rounded-full truncate max-w-24">
                      {getSelectedLabel(serviceOptions, serviceType)}
                    </span>
                  )}
                  {specialty && (
                    <span className="text-xs bg-blue-50 text-blue-600 py-1 px-2 rounded-full truncate max-w-24">
                      {getSelectedLabel(specialtyOptions, specialty)}
                    </span>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Mobile Filters */}
          <AnimatePresence>
            {isMobileView && showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="px-4 py-4 border-t border-gray-100 grid grid-cols-1 gap-5">
                  {/* Service Type */}
                  <div>
                    <div className="flex justify-between">
                      <label className="text-xs text-gray-500 mb-1.5 font-medium block">
                        SERVICE TYPE
                      </label>
                      {serviceType && (
                        <button
                          type="button"
                          onClick={() => clearFilter('service')}
                          className="text-xs text-blue-600 hover:text-blue-800"
                        >
                          Clear
                        </button>
                      )}
                    </div>
                    <div className="relative">
                      <ResponsiveDropdown
                        isOpen={serviceDropdown.isOpen}
                        onClose={serviceDropdown.close}
                        title="Select Service Type"
                        trigger={
                          <motion.button
                            type="button"
                            onClick={serviceDropdown.toggle}
                            className={cn(
                              "flex items-center justify-between w-full h-10 px-4 py-2 text-sm rounded-lg border transition-all",
                              serviceType 
                                ? "border-blue-300 bg-blue-50/50 text-blue-600 font-medium" 
                                : "border-gray-200 hover:border-blue-300 bg-white text-gray-700"
                            )}
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                          >
                            <span>
                              {serviceType ? getSelectedLabel(serviceOptions, serviceType) : 'Any service'}
                            </span>
                            <svg 
                              xmlns="http://www.w3.org/2000/svg" 
                              className={cn("w-4 h-4 ml-1 transition-transform", 
                                serviceDropdown.isOpen ? "transform rotate-180" : "",
                                serviceType ? "text-blue-600" : "text-gray-500")} 
                              fill="none" 
                              viewBox="0 0 24 24" 
                              stroke="currentColor"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </motion.button>
                        }
                      >
                        {serviceDropdownContent}
                      </ResponsiveDropdown>
                    </div>
                  </div>

                  {/* Specialty */}
                  <div>
                    <div className="flex justify-between">
                      <label className="text-xs text-gray-500 mb-1.5 font-medium block">
                        SPECIALTY
                      </label>
                      {specialty && (
                        <button
                          type="button"
                          onClick={() => clearFilter('specialty')}
                          className="text-xs text-blue-600 hover:text-blue-800"
                        >
                          Clear
                        </button>
                      )}
                    </div>
                    <div className="relative">
                      <ResponsiveDropdown
                        isOpen={specialtyDropdown.isOpen}
                        onClose={specialtyDropdown.close}
                        title="Select Specialty"
                        trigger={
                          <motion.button
                            type="button"
                            onClick={specialtyDropdown.toggle}
                            className={cn(
                              "flex items-center justify-between w-full h-10 px-4 py-2 text-sm rounded-lg border transition-all",
                              specialty 
                                ? "border-blue-300 bg-blue-50/50 text-blue-600 font-medium" 
                                : "border-gray-200 hover:border-blue-300 bg-white text-gray-700"
                            )}
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                          >
                            <span>
                              {specialty ? getSelectedLabel(specialtyOptions, specialty) : 'Any specialty'}
                            </span>
                            <svg 
                              xmlns="http://www.w3.org/2000/svg" 
                              className={cn("w-4 h-4 ml-1 transition-transform", 
                                specialtyDropdown.isOpen ? "transform rotate-180" : "",
                                specialty ? "text-blue-600" : "text-gray-500")} 
                              fill="none" 
                              viewBox="0 0 24 24" 
                              stroke="currentColor"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </motion.button>
                        }
                      >
                        {specialtyDropdownContent}
                      </ResponsiveDropdown>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Mobile Search Button (Full-width) */}
          {isMobileView && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="px-4 py-4 border-t border-gray-100"
            >
              <motion.button
                type="submit"
                className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-full flex items-center justify-center gap-2 transition-colors"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.97 }}
              >
                <IconSearch size={18} />
                <span className="font-medium">Search</span>
              </motion.button>
            </motion.div>
          )}
        </form>
      </motion.div>

      {/* Popular searches */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        className="mt-4 flex flex-wrap justify-center gap-2"
      >
        <span className="text-xs text-gray-500 font-medium mr-1 self-center">Popular:</span>
        {popularSearches.map((term) => (
          <motion.button
            key={term}
            type="button"
            onClick={() => handlePopularSearch(term)}
            className={cn(
              "px-3 py-1 text-xs rounded-full border transition-all",
              activePopular === term
                ? "bg-blue-50 border-blue-200 text-blue-700"
                : "border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50"
            )}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            {term}
          </motion.button>
        ))}
      </motion.div>
    </div>
  );
}

export default SearchBar;