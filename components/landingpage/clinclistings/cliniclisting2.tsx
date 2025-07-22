"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform, AnimatePresence, useSpring } from "framer-motion";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import {
  IconSearch,
  IconFilter,
  IconMapPin,
  IconStar,
  IconChevronRight,
  IconX,
  IconClock,
  IconArrowRight,
  IconLoader,
} from "@tabler/icons-react";

// Types
interface Clinic {
  id: string;
  name: string;
  imageUrl: string;
  rating: number;
  location: string;
  specialty: string;
  distance: string;
  openHours: string;
  isOpen: boolean;
}

interface ClinicSearchProps {
  className?: string;
}

interface FilterOption {
  id: string;
  label: string;
}

// Static image URL
const DEFAULT_IMAGE = "/image.jpg";

// Mock data
const MOCK_CLINICS: Clinic[] = [
  {
    id: "1",
    name: "GreenLife Medical Center",
    imageUrl: DEFAULT_IMAGE,
    rating: 4.8,
    location: "Downtown, 2.1 miles away",
    specialty: "General Practice",
    distance: "2.1 miles",
    openHours: "8:00 AM - 7:00 PM",
    isOpen: true,
  },
  {
    id: "2",
    name: "Advanced Dental Care",
    imageUrl: DEFAULT_IMAGE,
    rating: 4.6,
    location: "West End, 3.5 miles away",
    specialty: "Dentistry",
    distance: "3.5 miles",
    openHours: "9:00 AM - 5:00 PM",
    isOpen: true,
  },
  {
    id: "3",
    name: "Central Pediatrics",
    imageUrl: DEFAULT_IMAGE,
    rating: 4.9,
    location: "Northside, 1.8 miles away",
    specialty: "Pediatrics",
    distance: "1.8 miles",
    openHours: "8:30 AM - 6:00 PM",
    isOpen: false,
  },
  {
    id: "4",
    name: "City Heart Specialists",
    imageUrl: DEFAULT_IMAGE,
    rating: 4.7,
    location: "Eastside, 4.2 miles away",
    specialty: "Cardiology",
    distance: "4.2 miles",
    openHours: "7:30 AM - 6:30 PM",
    isOpen: true,
  },
  {
    id: "5",
    name: "Family Health Partners",
    imageUrl: DEFAULT_IMAGE,
    rating: 4.5,
    location: "Southend, 2.7 miles away",
    specialty: "Family Medicine",
    distance: "2.7 miles",
    openHours: "8:00 AM - 8:00 PM",
    isOpen: true,
  },
];

const SPECIALTY_FILTERS: FilterOption[] = [
  { id: "all", label: "All Specialties" },
  { id: "general", label: "General Practice" },
  { id: "dental", label: "Dentistry" },
  { id: "pediatrics", label: "Pediatrics" },
  { id: "cardiology", label: "Cardiology" },
  { id: "family", label: "Family Medicine" },
];

const DISTANCE_FILTERS: FilterOption[] = [
  { id: "any", label: "Any Distance" },
  { id: "1", label: "< 1 mile" },
  { id: "3", label: "< 3 miles" },
  { id: "5", label: "< 5 miles" },
  { id: "10", label: "< 10 miles" },
];

const FilterButton = ({
  label,
  isSelected,
  onClick,
}: {
  label: string;
  isSelected: boolean;
  onClick: () => void;
}) => (
  <motion.button
    whileHover={{ scale: 1.03 }}
    whileTap={{ scale: 0.97 }}
    onClick={onClick}
    className={cn(
      "px-4 py-2 rounded-xl text-sm whitespace-nowrap transition-all duration-200",
      isSelected
        ? "bg-black text-white shadow-md"
        : "bg-white/80 text-black border border-black/10 hover:border-black/20 hover:bg-white/90"
    )}
    style={{
      boxShadow: isSelected ? "0 4px 12px rgba(0,0,0,0.15)" : "none",
    }}
  >
    {label}
  </motion.button>
);

const StarRating = ({ rating }: { rating: number }) => {
  return (
    <motion.div 
      className="flex items-center gap-1"
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <IconStar size={16} className="text-yellow-500 fill-yellow-500" />
      <span className="text-sm font-medium text-black">{rating.toFixed(1)}</span>
    </motion.div>
  );
};

const ClinicCard = ({ clinic, index }: { clinic: Clinic; index: number }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        delay: index * 0.08, 
        duration: 0.4,
        type: "spring",
        stiffness: 100,
        damping: 15 
      }}
      whileHover={{ y: -5 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="flex flex-col rounded-xl overflow-hidden bg-white border border-black/10 shadow-sm hover:shadow-lg transition-all duration-300"
      style={{
        boxShadow: isHovered 
          ? "0 12px 24px rgba(0,0,0,0.12), 0 4px 8px rgba(0,0,0,0.06)" 
          : "0 2px 6px rgba(0,0,0,0.05)"
      }}
    >
      <div className="relative h-48 w-full overflow-hidden">
        <motion.div
          animate={{ scale: isHovered ? 1.05 : 1 }}
          transition={{ duration: 0.5 }}
          className="h-full w-full"
        >
          <Image
            src={clinic.imageUrl}
            alt={clinic.name}
            fill
            className="object-cover transition-all duration-700"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </motion.div>
        <div className="absolute top-3 right-3 px-2 py-1 rounded-lg text-xs font-medium shadow-md bg-white/90 backdrop-blur-sm">
          {clinic.isOpen ? (
            <motion.span 
              className="flex items-center gap-1 text-green-600"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <motion.span 
                className="h-2 w-2 rounded-full bg-green-500"
                animate={{ 
                  scale: [1, 1.15, 1],
                  opacity: [1, 0.7, 1],
                }}
                transition={{ 
                  repeat: Infinity, 
                  repeatType: "loop", 
                  duration: 2,
                  ease: "easeInOut" 
                }}
              />
              Open Now
            </motion.span>
          ) : (
            <span className="flex items-center gap-1 text-red-600">
              <span className="h-2 w-2 rounded-full bg-red-500"></span>
              Closed
            </span>
          )}
        </div>
      </div>

      <div className="p-4 flex flex-col gap-2 flex-grow">
        <div className="flex justify-between items-start">
          <motion.h3 
            className="font-bold text-black text-lg"
            animate={{ color: isHovered ? "#000000" : "#1a1a1a" }}
          >
            {clinic.name}
          </motion.h3>
          <StarRating rating={clinic.rating} />
        </div>

        <motion.div 
          className="flex gap-1 text-black/80 text-sm items-center"
          initial={{ opacity: 0, x: -5 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.08 + 0.1, duration: 0.3 }}
        >
          <IconMapPin size={16} className="flex-shrink-0" />
          <span>{clinic.location}</span>
        </motion.div>

        <motion.div 
          className="flex gap-1 text-black/80 text-sm items-center"
          initial={{ opacity: 0, x: -5 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.08 + 0.2, duration: 0.3 }}
        >
          <IconClock size={16} className="flex-shrink-0" />
          <span>{clinic.openHours}</span>
        </motion.div>

        <motion.div 
          className="mt-2 text-sm font-medium px-2 py-1 rounded-lg bg-black/5 w-fit text-black"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.08 + 0.3, duration: 0.3 }}
        >
          {clinic.specialty}
        </motion.div>
      </div>

      <motion.div 
        className="px-4 py-3 border-t border-black/10"
        animate={{ 
          backgroundColor: isHovered ? "rgba(0, 0, 0, 0.02)" : "rgba(255, 255, 255, 1)" 
        }}
        transition={{ duration: 0.3 }}
      >
        <motion.button
          whileHover={{ x: 3 }}
          className="flex items-center justify-between w-full text-sm font-medium text-black hover:text-black"
        >
          View Details
          <motion.div
            animate={{
              x: isHovered ? 3 : 0,
              transition: { duration: 0.3 }
            }}
          >
            <IconChevronRight size={18} />
          </motion.div>
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

export const ClinicSearch = ({ className }: ClinicSearchProps) => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredClinics, setFilteredClinics] = useState<Clinic[]>(MOCK_CLINICS);
  const [displayedClinics, setDisplayedClinics] = useState<Clinic[]>([]);
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>("all");
  const [selectedDistance, setSelectedDistance] = useState<string>("any");
  const [showOpenOnly, setShowOpenOnly] = useState<boolean>(false);
  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [pageCount, setPageCount] = useState<number>(1);
  const itemsPerPage = 3;

  const filterRef = useRef<HTMLDivElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  // Smooth scroll for filter panel
  const scrollToResults = () => {
    if (resultsRef.current) {
      resultsRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  useEffect(() => {
    let results = MOCK_CLINICS;

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      results = results.filter(
        (clinic) =>
          clinic.name.toLowerCase().includes(query) ||
          clinic.specialty.toLowerCase().includes(query) ||
          clinic.location.toLowerCase().includes(query)
      );
    }

    if (selectedSpecialty !== "all") {
      results = results.filter((clinic) =>
        clinic.specialty.toLowerCase().includes(selectedSpecialty.toLowerCase())
      );
    }

    if (selectedDistance !== "any") {
      const maxDistance = parseInt(selectedDistance, 10);
      results = results.filter((clinic) => {
        const distance = parseFloat(clinic.distance.split(" ")[0]);
        return distance < maxDistance;
      });
    }

    if (showOpenOnly) {
      results = results.filter((clinic) => clinic.isOpen);
    }

    setFilteredClinics(results);
    setPageCount(1);
  }, [searchQuery, selectedSpecialty, selectedDistance, showOpenOnly]);

  // Handle pagination for displayed clinics
  useEffect(() => {
    setDisplayedClinics(filteredClinics.slice(0, itemsPerPage * pageCount));
  }, [filteredClinics, pageCount]);

  const handleLoadMore = () => {
    setIsLoading(true);
    
    // Simulate API call with delay
    setTimeout(() => {
      setPageCount(pageCount + 1);
      setIsLoading(false);
    }, 600);
  };

  const handleViewMore = () => {
    router.push('/all-clinics');
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    setSelectedSpecialty("all");
    setSelectedDistance("any");
    setShowOpenOnly(false);
    setIsFilterOpen(false);
  };

  // Track scroll position for parallax effects
  const { scrollY } = useScroll();
  const headerOpacity = useTransform(scrollY, [0, 150], [1, 0.97]);
  const headerScale = useTransform(scrollY, [0, 150], [1, 0.98]);
  const headerY = useTransform(scrollY, [0, 150], [0, -10]);
  
  // Spring animation for smoother parallax
  const springHeaderY = useSpring(headerY, { stiffness: 200, damping: 20 });

  return (
    <div className={cn("min-h-screen bg-white", className)}>
      <motion.div 
        className="pt-24 px-4 md:px-8 max-w-6xl mx-auto"
        style={{ 
          opacity: headerOpacity,
          scale: headerScale,
          y: springHeaderY
        }}
      >
        <motion.h1 
          className="text-3xl md:text-4xl font-bold text-black mb-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, type: "spring" }}
        >
          Top Rated Clinics
        </motion.h1>
        <motion.p 
          className="text-black/70 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, type: "spring" }}
        >
          Discover top-rated healthcare providers near you
        </motion.p>

        <motion.div 
          className="flex flex-col md:flex-row gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="relative flex-grow">
            <IconSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-black/50" />
            <motion.input
              type="text"
              placeholder="Search by clinic name, specialty, or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-black/10 focus:outline-none focus:ring-2 focus:ring-black bg-white placeholder-black/40 text-black shadow-sm transition-all"
              whileFocus={{ boxShadow: "0 0 0 2px rgba(0,0,0,0.1)" }}
              initial={{ boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}
            />
            {searchQuery && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                onClick={() => setSearchQuery("")}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-black/40 hover:text-black"
              >
                <IconX size={18} />
              </motion.button>
            )}
          </div>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-white border border-black/10 rounded-xl shadow-sm hover:shadow md:w-auto w-full text-black"
          >
            <IconFilter size={18} />
            <span>Filters</span>
            {(showOpenOnly ||
              selectedSpecialty !== "all" ||
              selectedDistance !== "any") && (
              <motion.span 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="flex items-center justify-center w-5 h-5 bg-black text-white text-xs rounded-full"
              >
                {Number(showOpenOnly) +
                  Number(selectedSpecialty !== "all") +
                  Number(selectedDistance !== "any")}
              </motion.span>
            )}
          </motion.button>
        </motion.div>

        <AnimatePresence>
          {isFilterOpen && (
            <motion.div
              ref={filterRef}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ 
                duration: 0.4,
                type: "spring",
                stiffness: 100,
                damping: 20 
              }}
              className="overflow-hidden mt-4"
            >
              <motion.div 
                className="p-6 bg-white rounded-xl border border-black/10 shadow-sm"
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1, duration: 0.4 }}
              >
                <div className="flex flex-wrap justify-between items-center mb-6">
                  <motion.h3 
                    className="text-lg font-semibold text-black"
                    initial={{ x: -10, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    Filters
                  </motion.h3>
                  <motion.button
                    initial={{ x: 10, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleClearFilters}
                    className="text-sm text-black/60 hover:text-black"
                  >
                    Clear all filters
                  </motion.button>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <motion.div
                    initial={{ x: -10, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <h4 className="font-medium mb-3 text-black">Specialty</h4>
                    <div className="flex flex-wrap gap-2">
                      {SPECIALTY_FILTERS.map((specialty, index) => (
                        <motion.div
                          key={specialty.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3 + index * 0.05 }}
                        >
                          <FilterButton
                            label={specialty.label}
                            isSelected={selectedSpecialty === specialty.id}
                            onClick={() => {
                              setSelectedSpecialty(specialty.id);
                              scrollToResults();
                            }}
                          />
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ x: 10, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <h4 className="font-medium mb-3 text-black">Distance</h4>
                    <div className="flex flex-wrap gap-2">
                      {DISTANCE_FILTERS.map((distance, index) => (
                        <motion.div
                          key={distance.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3 + index * 0.05 }}
                        >
                          <FilterButton
                            label={distance.label}
                            isSelected={selectedDistance === distance.id}
                            onClick={() => {
                              setSelectedDistance(distance.id);
                              scrollToResults();
                            }}
                          />
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                </div>

                <motion.div 
                  className="mt-6 flex items-center"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <label className="flex items-center cursor-pointer">
                    <div className="relative">
                      <input
                        type="checkbox"
                        className="sr-only"
                        checked={showOpenOnly}
                        onChange={() => {
                          setShowOpenOnly(!showOpenOnly);
                          scrollToResults();
                        }}
                      />
                      <motion.div
                        className={`w-10 h-6 rounded-full transition ${
                          showOpenOnly ? "bg-green-500" : "bg-black/10"
                        }`}
                        animate={{ 
                          backgroundColor: showOpenOnly ? "rgb(34, 197, 94)" : "rgba(0, 0, 0, 0.1)" 
                        }}
                        transition={{ duration: 0.2 }}
                      ></motion.div>
                      <motion.div
                        className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition"
                        animate={{ 
                          x: showOpenOnly ? 16 : 0,
                          backgroundColor: showOpenOnly ? "#FFFFFF" : "#FFFFFF" 
                        }}
                        transition={{ 
                          type: "spring", 
                          stiffness: 300, 
                          damping: 20 
                        }}
                      ></motion.div>
                    </div>
                    <span className="ml-3 text-black">Show open clinics only</span>
                  </label>
                </motion.div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Result */}
        <div className="pt-10 pb-24" ref={resultsRef}>
          <motion.div 
            className="flex justify-between items-center mb-6"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <h2 className="text-xl font-semibold text-black">
              {filteredClinics.length}{" "}
              {filteredClinics.length === 1 ? "Clinic" : "Clinics"} Found
            </h2>
          </motion.div>

          {filteredClinics.length > 0 ? (
            <>
              <motion.div 
                className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, staggerChildren: 0.1 }}
              >
                {displayedClinics.map((clinic, index) => (
                  <ClinicCard key={clinic.id} clinic={clinic} index={index} />
                ))}
              </motion.div>
              
              {/* Load More Button */}
              {displayedClinics.length < filteredClinics.length && (
                <motion.div 
                  className="mt-10 flex justify-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                >
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={handleLoadMore}
                    disabled={isLoading}
                    className="px-6 py-3 bg-white border border-black/10 rounded-xl shadow-sm hover:shadow-md flex items-center gap-2 text-black transition-all disabled:opacity-70"
                  >
                    {isLoading ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{
                            repeat: Infinity,
                            duration: 1,
                            ease: "linear",
                          }}
                        >
                          <IconLoader size={18} />
                        </motion.div>
                        <span>Loading...</span>
                      </>
                    ) : (
                      <>
                        <span>Load More Clinics</span>
                      </>
                    )}
                  </motion.button>
                </motion.div>
              )}
              
              {/* View More Button (routes to another page) */}
              <motion.div 
                className="mt-10 flex justify-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleViewMore}
                  className="px-8 py-4 bg-black text-white rounded-xl shadow-md hover:shadow-lg flex items-center gap-2 font-medium transition-all"
                >
                  <span>View All Clinics</span>
                  <motion.div
                    whileHover={{ x: 3 }}
                    transition={{ duration: 0.2 }}
                  >
                    <IconArrowRight size={18} />
                  </motion.div>
                </motion.button>
              </motion.div>
            </>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-16 text-center"
            >
              <motion.div 
                className="mb-4 text-black/40"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ 
                  duration: 0.6,
                  type: "spring",
                  stiffness: 100 
                }}
              >
                <IconSearch size={48} strokeWidth={1.5} className="mx-auto" />
              </motion.div>
              <motion.h3 
                className="text-xl font-medium text-black mb-2"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.4 }}
              >
                No clinics found
              </motion.h3>
              <motion.p 
                className="text-black/70 mb-6"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.4 }}
              >
                Try adjusting your search or filters to find what you're looking for
              </motion.p>
              <motion.button
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.4 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleClearFilters}
                className="px-4 py-2 bg-black/5 text-black rounded-lg hover:bg-black/10 transition"
              >
                Clear all filters
              </motion.button>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default ClinicSearch;