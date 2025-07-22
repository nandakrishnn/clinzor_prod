'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useSpring,
} from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Clinic, MOCK_CLINICS } from './clinics';
import ClinicCard from './ClinicCard';
import { 
  IconSearch, 
  IconFilter, 
  IconX, 
  IconLoader, 
  IconArrowRight,
  IconCheck,
  IconChevronDown,
  IconArrowsSort
} from '@tabler/icons-react';

interface FilterOption { id: string; label: string; }

const SPECIALTY_FILTERS: FilterOption[] = [
  { id: 'all', label: 'All Specialties' },
  { id: 'general', label: 'General Practice' },
  { id: 'dental', label: 'Dentistry' },
  { id: 'pediatrics', label: 'Pediatrics' },
  { id: 'cardiology', label: 'Cardiology' },
  { id: 'family', label: 'Family Medicine' },
];

const DISTANCE_FILTERS: FilterOption[] = [
  { id: 'any', label: 'Any Distance' },
  { id: '1', label: '< 1 mile' },
  { id: '3', label: '< 3 miles' },
  { id: '5', label: '< 5 miles' },
  { id: '10', label: '< 10 miles' },
];

const SORT_OPTIONS = [
  { id: 'relevance', label: 'Relevance' },
  { id: 'distance', label: 'Distance' },
  { id: 'rating', label: 'Rating' },
  { id: 'name', label: 'Name (A-Z)' },
];

export default function ClinicSearch({ className }: { className?: string }) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('all');
  const [selectedDistance, setSelectedDistance] = useState('any');
  const [showOpenOnly, setShowOpenOnly] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [sortOption, setSortOption] = useState('relevance');
  const [showSortMenu, setShowSortMenu] = useState(false);

  const [filteredClinics, setFilteredClinics] = useState<Clinic[]>(MOCK_CLINICS);
  const [displayedClinics, setDisplayedClinics] = useState<Clinic[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const itemsPerPage = 9;
  const [pageCount, setPageCount] = useState(1);

  const resultsRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const sortRef = useRef<HTMLDivElement>(null);

  // Animations
  const fadeIn = {
    hidden: { opacity: 0, y: 10 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.05,
        duration: 0.5,
        ease: [0.25, 0.1, 0.25, 1.0], // Apple-like easing
      },
    }),
  };

  // Close sort menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (sortRef.current && !sortRef.current.contains(event.target as Node)) {
        setShowSortMenu(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // 1) Filtering
  useEffect(() => {
    let results = MOCK_CLINICS;
    
    setIsLoading(true);
    
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      results = results.filter((c: Clinic) =>
        c.name.toLowerCase().includes(q) ||
        c.specialty.toLowerCase().includes(q) ||
        c.location.toLowerCase().includes(q)
      );
    }
    
    if (selectedSpecialty !== 'all') {
      results = results.filter((c: Clinic) =>
        c.specialty.toLowerCase().includes(selectedSpecialty)
      );
    }
    
    if (selectedDistance !== 'any') {
      const maxDist = parseFloat(selectedDistance);
      results = results.filter((c: Clinic) => parseFloat(c.distance) < maxDist);
    }
    
    if (showOpenOnly) {
      results = results.filter((c: Clinic) => c.isOpen);
    }

    // Simulate network delay for better UX
    setTimeout(() => {
      setFilteredClinics(results);
      setPageCount(1);
      setIsLoading(false);
    }, 300);
    
  }, [searchQuery, selectedSpecialty, selectedDistance, showOpenOnly]);

  // 2) Sorting and Pagination
  useEffect(() => {
    let sortedResults = [...filteredClinics];
    
    // Apply sorting
    switch (sortOption) {
      case 'distance':
        sortedResults.sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));
        break;
      case 'rating':
        sortedResults.sort((a, b) => b.rating - a.rating);
        break;
      case 'name':
        sortedResults.sort((a, b) => a.name.localeCompare(b.name));
        break;
      // 'relevance' is default order
      default:
        break;
    }
    
    // Apply pagination
    setDisplayedClinics(
      sortedResults.slice(0, pageCount * itemsPerPage)
    );
    
  }, [filteredClinics, pageCount, sortOption]);

  const handleLoadMore = () => {
    setIsLoading(true);
    setTimeout(() => {
      setPageCount(c => c + 1);
      setIsLoading(false);
    }, 500);
  };

  const scrollToResults = () => {
    resultsRef.current?.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    });
  };

  const focusSearch = () => {
    searchInputRef.current?.focus();
  };

  const clearFilters = () => {
    setSelectedSpecialty('all');
    setSelectedDistance('any');
    setShowOpenOnly(false);
    scrollToResults();
  };

  const handleSort = (option: string) => {
    setSortOption(option);
    setShowSortMenu(false);
    scrollToResults();
  };

  return (
    <div className={`${className ?? ''} min-h-screen px-4 py-12`}>
      {/* --- Header & Search Bar --- */}
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold mb-3 text-black tracking-tight">Find a Clinic</h1>
          <p className="text-lg text-black/80">Discover healthcare providers near you</p>
        </motion.div>

        <motion.div 
          className="flex flex-col md:flex-row gap-4 mb-8"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <div className="relative flex-grow">
            <IconSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-black/50" size={20} />
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search by name, specialty, or location..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-10 py-4 rounded-2xl border border-black/10 focus:outline-none focus:ring-2 focus:ring-black/20 shadow-sm text-black text-base"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-black/40 hover:text-black transition-colors duration-200"
                aria-label="Clear search"
              >
                <IconX size={18} />
              </button>
            )}
            <AnimatePresence>
              {!searchQuery && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-black/30 pointer-events-none"
                >
                  ⌘K
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <motion.button
            onClick={() => {
              setIsFilterOpen(o => !o);
              !isFilterOpen && scrollToResults();
            }}
            className="flex items-center justify-center gap-2 px-6 py-4 bg-black text-white rounded-2xl hover:bg-black/90 transition-colors duration-200 shadow-sm min-w-32"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <IconFilter size={18} />
            <span>Filters</span>
            <IconChevronDown
              size={16}
              className={`transition-transform duration-300 ${isFilterOpen ? 'rotate-180' : ''}`}
            />
          </motion.button>
        </motion.div>

        {/* --- Filters Panel --- */}
        <AnimatePresence>
          {isFilterOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1.0] }}
              className="overflow-hidden mb-10"
            >
              <div className="p-8 bg-white shadow-md rounded-2xl border border-black/5">
                <div className="grid md:grid-cols-2 gap-8">
                  {/* Specialty */}
                  <div>
                    <h4 className="font-semibold mb-4 text-black">Specialty</h4>
                    <div className="flex flex-wrap gap-2">
                      {SPECIALTY_FILTERS.map((opt, index) => (
                        <motion.button
                          key={opt.id}
                          custom={index}
                          variants={fadeIn}
                          initial="hidden"
                          animate="visible"
                          onClick={() => {
                            setSelectedSpecialty(opt.id);
                            scrollToResults();
                          }}
                          className={`px-4 py-2 rounded-xl text-sm transition-all duration-200 ${
                            selectedSpecialty === opt.id
                              ? 'bg-black text-white shadow-sm'
                              : 'bg-white border border-black/10 text-black hover:border-black/30'
                          }`}
                        >
                          {opt.label}
                        </motion.button>
                      ))}
                    </div>
                  </div>
                  
                  {/* Distance */}
                  <div>
                    <h4 className="font-semibold mb-4 text-black">Distance</h4>
                    <div className="flex flex-wrap gap-2">
                      {DISTANCE_FILTERS.map((opt, index) => (
                        <motion.button
                          key={opt.id}
                          custom={index}
                          variants={fadeIn}
                          initial="hidden"
                          animate="visible"
                          onClick={() => {
                            setSelectedDistance(opt.id);
                            scrollToResults();
                          }}
                          className={`px-4 py-2 rounded-xl text-sm transition-all duration-200 ${
                            selectedDistance === opt.id
                              ? 'bg-black text-white shadow-sm'
                              : 'bg-white border border-black/10 text-black hover:border-black/30'
                          }`}
                        >
                          {opt.label}
                        </motion.button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Open Only Toggle */}
                <div className="mt-8 flex justify-between items-center">
                  <label className="flex items-center cursor-pointer group">
                    <div className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 ${showOpenOnly ? 'bg-black' : 'bg-black/10'}`}>
                      <motion.div
                        className="bg-white w-4 h-4 rounded-full shadow-sm"
                        animate={{ x: showOpenOnly ? 24 : 0 }}
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      />
                    </div>
                    <span className="ml-3 text-black group-hover:opacity-80 transition-opacity">Show open clinics only</span>
                    <input
                      type="checkbox"
                      checked={showOpenOnly}
                      onChange={() => {
                        setShowOpenOnly(o => !o);
                        scrollToResults();
                      }}
                      className="sr-only"
                    />
                  </label>
                  
                  <motion.button
                    onClick={clearFilters}
                    className="text-black/70 hover:text-black text-sm underline-offset-2 hover:underline transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Reset filters
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* --- Results --- */}
        <div ref={resultsRef} className="pt-4">
          <motion.div 
            className="flex justify-between items-center mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >

            
            {/* Apple-like Sort Dropdown */}
            <div className="relative" ref={sortRef}>
              <motion.button
                onClick={() => setShowSortMenu(!showSortMenu)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-black/5 hover:bg-black/10 transition-colors text-sm font-medium text-black"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <IconArrowsSort size={16} />
                <span>Sort: {SORT_OPTIONS.find(opt => opt.id === sortOption)?.label}</span>
                <IconChevronDown 
                  size={14} 
                  className={`transition-transform duration-300 ${showSortMenu ? 'rotate-180' : ''}`}
                />
              </motion.button>
              
              <AnimatePresence>
                {showSortMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1.0] }}
                    style={{ transformOrigin: 'top right' }}
                    className="absolute right-0 mt-2 w-48 rounded-x shadow-lg border border-black/5 z-10 overflow-hidden text-black bg-blue-50"
                  >
                    <div className="py-1">
                      {SORT_OPTIONS.map((option) => (
                        <motion.button
                          key={option.id}
                          onClick={() => handleSort(option.id)}
                          className="flex items-center justify-between w-full px-4 py-3 text-sm text-left hover:bg-black/5 transition-colors"
                          whileHover={{ backgroundColor: 'rgba(0,0,0,0.05)' }}
                        >
                          <span>{option.label}</span>
                          {sortOption === option.id && (
                            <IconCheck size={16} className="text-black" />
                          )}
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          <AnimatePresence mode="wait">
            {isLoading && filteredClinics.length === 0 ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="py-32 flex flex-col items-center justify-center"
              >
                <IconLoader size={32} className="animate-spin text-black/50 mb-4" />
                <p className="text-black/70">Searching for clinics...</p>
              </motion.div>
            ) : filteredClinics.length > 0 ? (
              <motion.div
                key="results"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {displayedClinics.map((c, i) => (
                    <ClinicCard key={c.id} clinic={c} index={i} />
                  ))}
                </div>

                {displayedClinics.length < filteredClinics.length && (
                  <motion.div 
                    className="mt-12 flex justify-center"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <button
                      onClick={handleLoadMore}
                      disabled={isLoading}
                      className="px-8 py-3 bg-white border border-black/10 rounded-xl flex items-center gap-2 hover:border-black/30 transition-all duration-200 shadow-sm text-black"
                    >
                      {isLoading ? (
                        <><IconLoader size={18} className="animate-spin" /> Loading...</>
                      ) : (
                        <><span>Load More Clinics</span> <IconArrowRight size={16} /></>
                      )}
                    </button>
                  </motion.div>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="py-24 text-center"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-black/5 rounded-full mb-4">
                  <IconSearch size={24} className="text-black/40" />
                </div>
                <h3 className="text-xl font-medium mb-2 text-black">No clinics found</h3>
                <p className="text-black/70 max-w-md mx-auto mb-6">
                  We couldn't find any clinics matching your search criteria. Try adjusting your filters or search query.
                </p>
                <button 
                  onClick={() => {
                    clearFilters();
                    setSearchQuery('');
                    focusSearch();
                  }}
                  className="px-6 py-2 bg-black text-white rounded-lg hover:bg-black/90 transition-colors"
                >
                  Reset Search
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}