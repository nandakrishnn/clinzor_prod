"use client";

import { Clinic } from "@/types/common";
import Image from "next/image";
import { useState, useRef } from "react";
import { FiStar } from "react-icons/fi";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";

interface ClinicCardProps {
  clinic: Clinic;
  onBookNow: (clinic: Clinic) => void;
}

const ClinicCard = ({ clinic, onBookNow }: ClinicCardProps) => {
  const [daySelect, setDaySelect] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const getClinicImage = (images?: string[]) => {
    if (
      images &&
      images.length > 0 &&
      (images[0].startsWith('http://') || images[0].startsWith('https://'))
    ) {
      return images[0];
    }
    return '/clinic.png'; // fallback image
  };

  const formatTime = (time?: string | null): string => {
    if (!time) return '';

    const [hourStr, minute] = time.split(':');
    let hour = Number(hourStr);

    const period = hour >= 12 ? 'PM' : 'AM';
    hour = hour % 12 || 12;

    return `${hour}:${minute} ${period}`;
  };

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 150;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden h-full flex flex-col">
      <div className="relative h-40 w-full flex-shrink-0">
        <Image
          src={getClinicImage(clinic?.clinic_images)}
          alt={clinic?.name}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />
        <div className="absolute bottom-2 left-2 bg-white/90 px-2 py-1 rounded-md flex items-center">
          <FiStar className="text-yellow-400 mr-1" />
          <span className="text-sm font-medium">{clinic?.avg_rating ? clinic.avg_rating.toFixed(1) : "0"}</span>
          <span className="text-xs text-gray-500 ml-1">({clinic.total_reviews})</span>
        </div>
      </div>

      <div className="p-4 flex flex-col flex-grow">
        <h3 className="font-semibold text-md mb-2 line-clamp-1">
          {clinic?.clinic_name}
        </h3>

        {/* Timing Section */}
        <div className="mb-3">
          <div className="relative">
            <button
              onClick={() => scroll('left')}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-1 shadow-md hover:bg-gray-50 transition-colors"
              aria-label="Scroll left"
            >
              <IoChevronBack className="w-4 h-4 text-gray-600" />
            </button>

            <div 
              ref={scrollRef}
              className="flex items-center gap-2 overflow-x-auto px-8 scrollbar-hide"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {clinic.timings.map((time, index) => (
                <button
                  key={index}
                  onClick={() => setDaySelect(index)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all duration-200 flex-shrink-0 ${
                    daySelect === index
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {time.day.substring(0, 3)}
                </button>
              ))}
            </div>

            <button
              onClick={() => scroll('right')}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-1 shadow-md hover:bg-gray-50 transition-colors"
              aria-label="Scroll right"
            >
              <IoChevronForward className="w-4 h-4 text-gray-600" />
            </button>
          </div>

          <div className="text-xs text-gray-600 bg-blue-50 px-3 py-2 rounded-lg mt-2">
            <span className="font-medium">Opens:</span>{" "}
            <span className="font-semibold text-blue-600">
              {formatTime(clinic.timings[daySelect].opening_time)}
            </span>
            {" "}-{" "}
            <span className="font-semibold text-blue-600">
              {formatTime(clinic.timings[daySelect].closing_time)}
            </span>
          </div>
        </div>

        {/* Address Section */}
         <div className="flex items-center text-xs text-gray-500 mb-2 flex-wrap">
          <span className="line-clamp-1">{clinic.distance} KM</span>
          <span className="line-clamp-1">{clinic.address}</span>
        </div>

        {/* Female Doctors Badge */}
        {clinic.femaleDoctors && (
          <div className="bg-pink-50 text-pink-700 text-xs px-3 py-1 rounded-full inline-flex items-center mb-3 w-fit">
            Female doctors available
          </div>
        )}

        {/* Price and Book Button */}
        <div className="mt-auto pt-3 border-t border-gray-100 flex justify-between items-center">
          <div>
            <span className="text-xs text-gray-500">Starting from</span>
            <div className="font-semibold text-lg text-gray-800">₹{clinic.min_price}</div>
          </div>
          <button
            onClick={() => onBookNow(clinic)}
            className="bg-primaryColor hover:bg-primaryColor/90 text-white px-6 py-2.5 text-sm font-medium rounded-full transition-all duration-200 shadow-sm hover:shadow-md"
          >
            Book Now
          </button>
        </div>
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default ClinicCard;