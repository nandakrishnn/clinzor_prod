"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FiChevronLeft, FiChevronRight, FiMapPin } from "react-icons/fi";
import { Clinic } from "@/types/common";

import ClinicCard from "./ClinicCard";
import { getClinicListService, getIdByServiceName } from "@/service/user/sevicePage";
import DataPlaceholder from "../common/DataPlaceholder";
import useLocalStorage from "@/hooks/useLocalStorage.ts";

const AvailableClinics = ({ id, search, type, distance }: { id: string; search?: string, type: string, distance: number }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [clinicList, setClinicList] = useState<Clinic[]>([]);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [isLocating, setIsLocating] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const { getItem, setItem } = useLocalStorage();

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      let columns = 1;
      if (width >= 768) columns = 2;
      if (width >= 1024) columns = 3;
      if (width >= 1280) columns = 4;
      setItemsPerPage(columns * 5); // 5 rows
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Get user's current location
  useEffect(() => {
    if ("geolocation" in navigator) {
      setIsLocating(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          setIsLocating(false);
        },
        (error) => {
          console.error("Error getting location:", error);
          setLocationError("Unable to get your location. Showing all clinics.");
          setIsLocating(false);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000
        }
      );
    } else {
      setLocationError("Geolocation is not supported by your browser. Showing all clinics.");
      setIsLocating(false);
    }
  }, []);

  const getClinicList = async (slugId: string) => {
    try {
      setIsLoading(true);
      const locationParams = userLocation
        ? { lat: userLocation.lat, lng: userLocation.lng }
        : null;

      const res = await getClinicListService(slugId, distance, locationParams, search, type);

      if (res.status === 200) {
        setClinicList(res?.data?.data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetchClinics = async () => {
      if (!isLocating) {
        const slugId = getItem("slugId");
        if (!slugId) {
          const clinicData = await getIdByServiceName(id);
          getClinicList(clinicData.uuid);
        } else {
          getClinicList(slugId);
        }
      }
    };

    fetchClinics();
  }, [isLocating, userLocation, search, type, distance]);

  const handleBookNow = (clinic: Clinic) => {
    setItem("clinicId", clinic?.clinic_uuid);
    router.push(`/service/clinic/${clinic.slug}/${id}`);
  };

  // Pagination calculations
  const totalPages = Math.ceil(clinicList.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentClinics = clinicList.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="w-full px-3 py-4 sm:px-4 sm:py-5 md:px-6 md:py-6 lg:min-w-[70%] font-inter">
      {locationError && (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 p-3 sm:p-4 rounded-md mb-4 flex items-start sm:items-center text-sm sm:text-base">
          <FiMapPin className="mr-2 flex-shrink-0 mt-0.5 sm:mt-0" />
          <span>{locationError}</span>
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center items-center h-48 sm:h-56 md:h-64">
          <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <>
          <div className="relative overflow-hidden">
            {clinicList.length === 0 ? (
              <DataPlaceholder
                title="Coming Soon to Your Area"
                description="We're working hard to bring our clinics near you!"
              />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 w-full">
                {currentClinics.map((clinic) => (
                  <div
                    key={clinic?.clinic_uuid}
                    className="w-full min-w-0"
                  >
                    <ClinicCard clinic={clinic} onBookNow={handleBookNow} />
                  </div>
                ))}
              </div>
            )}
          </div>

          {clinicList.length > 0 && totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between mt-6 gap-4">
              <div className="text-sm text-gray-600">
                Showing {startIndex + 1} to {Math.min(endIndex, clinicList.length)} of {clinicList.length} clinics
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-3 py-2 rounded-md bg-white border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
                  aria-label="Previous page"
                >
                  Previous
                </button>
                
                <div className="flex gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                    // Show first page, last page, current page, and pages around current
                    if (
                      page === 1 ||
                      page === totalPages ||
                      (page >= currentPage - 1 && page <= currentPage + 1)
                    ) {
                      return (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          className={`px-3 py-2 rounded-md text-sm transition-colors ${
                            currentPage === page
                              ? 'bg-blue-500 text-white'
                              : 'bg-white border border-gray-200 hover:bg-gray-50'
                          }`}
                        >
                          {page}
                        </button>
                      );
                    } else if (
                      page === currentPage - 2 ||
                      page === currentPage + 2
                    ) {
                      return <span key={page} className="px-2 py-2">...</span>;
                    }
                    return null;
                  })}
                </div>
                
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-3 py-2 rounded-md bg-white border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
                  aria-label="Next page"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AvailableClinics;