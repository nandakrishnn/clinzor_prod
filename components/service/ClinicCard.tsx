"use client";

import { Clinic } from "@/types/common";
import Image from "next/image";
import { FiStar } from "react-icons/fi";

interface ClinicCardProps {
  clinic: Clinic;
  onBookNow: (clinic: Clinic) => void;
}

const ClinicCard = ({ clinic, onBookNow }: ClinicCardProps) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden h-full flex flex-col ">
      <div className="relative h-40 w-full flex-shrink-0">
        <Image
          src={clinic.image}
          alt={clinic.name}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />
        <div className="absolute bottom-2 left-2 bg-white/90 px-2 py-1 rounded-md flex items-center">
          <FiStar className="text-yellow-400 mr-1" />
          <span className="text-sm font-medium">{clinic.rating}</span>
          <span className="text-xs text-gray-500 ml-1">({clinic.reviews})</span>
        </div>
      </div>
      
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="font-semibold text-lg mb-1 line-clamp-1">{clinic.name}</h3>
        
        <div className="flex items-center text-sm text-gray-500 mb-2 flex-wrap">
          <span className="line-clamp-1">{clinic.distance}</span>
          <span className="mx-2">•</span>
          <span className="line-clamp-1">{clinic.address.split(',')[0]}</span>
        </div>
        
        {clinic.femaleDoctors && (
          <div className="bg-pink-50 text-pink-700 text-xs px-2 py-1 rounded-full inline-flex items-center mb-3">
            Female doctors available
          </div>
        )}
        
        <div className="mt-auto flex justify-between items-center">
          <span className="font-bold ">{clinic.price}</span>
          <button 
            onClick={() => onBookNow(clinic)}
            className="bg-primaryColor hover:bg-primaryColor text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClinicCard;