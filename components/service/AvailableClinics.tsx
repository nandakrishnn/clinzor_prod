"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FiChevronLeft, FiChevronRight, FiMapPin } from "react-icons/fi";
import { Clinic, clinicData } from "@/types/common";

import ClinicCard from "./ClinicCard";
import Title from "../ui/title";
import { getClinicListService } from "@/service/user/sevicePage";
import DataPlaceholder from "../common/DataPlaceholder";

const AvailableClinics = ({ id }: { id: string }) => {
  const router = useRouter();
  const [visibleCards, setVisibleCards] = useState(4);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [clinicList, setClinicList] = useState<Clinic[]>([]);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [isLocating, setIsLocating] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      let cards = 1;
      if (width >= 768) cards = 2;
      if (width >= 1024) cards = 4;
      setVisibleCards(cards);
      setCurrentIndex(0);
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

  const getClinicList = async () => {
    try {
      setIsLoading(true);
      // Pass user location if available, otherwise null
      const locationParams = userLocation
        ? { lat: userLocation.lat, lng: userLocation.lng }
        : null;

      const res = await getClinicListService(id, locationParams);
      console.log(res, "service related clinic");

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
    // Only fetch clinics once we have location (or know we can't get it)
    if (!isLocating) {
      getClinicList();
    }
  }, [isLocating, userLocation]);

  // Calculate total slides and current slide
  const totalSlides = Math.ceil(clinicList.length / visibleCards);
  const currentSlide = Math.floor(currentIndex / visibleCards);

  const handleNext = () => {
    setCurrentIndex((prev) => {
      const nextIndex = prev + visibleCards;
      return nextIndex >= clinicList.length ? 0 : nextIndex;
    });
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => {
      const prevIndex = prev - visibleCards;
      return prevIndex < 0 ? (totalSlides - 1) * visibleCards : prevIndex;
    });
  };

  const goToSlide = (slideIndex: number) => {
    setCurrentIndex(slideIndex * visibleCards);
  };

  const handleBookNow = (clinic: Clinic) => {
    router.push(`/service/clinic/${clinic?.clinic_uuid}?serviceId=${id}`);
  };

  // Calculate the subset of clinics to display
  const visibleClinics = clinicList.slice(
    currentIndex,
    currentIndex + visibleCards
  );

  return (
    <div className="p-4 md:p-6 font-inter max-w-7xl mx-auto">

      {locationError && (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 p-4 rounded-md mb-4 flex items-center">
          <FiMapPin className="mr-2" />
          {locationError}
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <>
          <div className="relative overflow-hidden">
            {clinicList.length === 0 ? (
              <DataPlaceholder
                title="No Clinics Available"
                description="There are no clinics available for this service in your area"
              />
            ) : (
              <div className="flex justify-start gap-4 w-full">
                {visibleClinics.map((clinic) => (
                  <div
                    key={clinic?.clinic_uuid}
                    className="flex-shrink-0 pb-5"
                    style={{
                      width: `calc(${100 / visibleCards}% - 1rem)`,
                      minWidth: "280px" // Ensures cards don't get too small
                    }}
                  >
                    <ClinicCard clinic={clinic} onBookNow={handleBookNow} />
                  </div>
                ))}
              </div>
            )}
          </div>

          {clinicList.length === 0 || totalSlides <= 1 ? null : (
            <div className="flex gap-2 md:gap-5 items-center justify-center mt-5">
              <button
                onClick={handlePrev}
                className="p-2 rounded-full bg-white border border-gray-200 hover:bg-gray-50 transition-colors"
                aria-label="Previous clinics"
              >
                <FiChevronLeft className="text-gray-700" />
              </button>
              <button
                onClick={handleNext}
                className="p-2 rounded-full bg-white border border-gray-200 hover:bg-gray-50 transition-colors"
                aria-label="Next clinics"
              >
                <FiChevronRight className="text-gray-700" />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AvailableClinics;