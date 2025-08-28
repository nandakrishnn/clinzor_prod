"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { Clinic, clinicData } from "@/types/common";

import ClinicCard from "./ClinicCard";
import Title from "../ui/title";

const AvailableClinics = ({id}: {id:string}) => {
  const router = useRouter();
  const [visibleCards, setVisibleCards] = useState(4);
  const [currentIndex, setCurrentIndex] = useState(0);

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

  // Calculate total slides and current slide
  const totalSlides = Math.ceil(clinicData.length / visibleCards);
  const currentSlide = Math.floor(currentIndex / visibleCards);

  const handleNext = () => {
    setCurrentIndex((prev) => {
      const nextIndex = prev + visibleCards;
      return nextIndex >= clinicData.length ? 0 : nextIndex;
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
    router.push(`/service/booking/${clinic.id}`);
  };

  // Calculate the subset of clinics to display
  const visibleClinics = clinicData.slice(
    currentIndex,
    currentIndex + visibleCards
  );

  return (
    <div className="p-4 md:p-6 font-inter max-w-7xl mx-auto">
      <div className="flex justify-center items-center mb-6 w-full ">
        <Title
          title="Select your Clinic"
          description="Available at these clinics"
          subtitle=""
        />
      </div>

      <div className="relative overflow-hidden">
        <div className="flex justify-start gap-4">
          {visibleClinics.map((clinic) => (
            <div
              key={clinic.id}
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
      </div>
      {totalSlides > 1 && (
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

      {/* {totalSlides > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          {Array.from({ length: totalSlides }).map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2 h-2 rounded-full transition-colors ${
                currentSlide === index ? "bg-blue-600" : "bg-gray-300"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )} */}
    </div>
  );
};

export default AvailableClinics;
