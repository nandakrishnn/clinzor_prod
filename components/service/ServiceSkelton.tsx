import React from "react";

const ServiceCardSkeleton = () => {
  return (
    <div className="rounded-lg md:rounded-2xl p-5 md:p-6 bg-[#E7E7E9] animate-pulse">
      {/* Title placeholder */}
      <div className="h-5 w-1/3 bg-gray-300 rounded mb-2"></div>

      {/* Description placeholders */}
      <div className="h-4 w-full bg-gray-300 rounded mb-1"></div>
      <div className="h-4 w-5/6 bg-gray-300 rounded mb-4"></div>

      {/* Image area placeholder */}
      <div className="relative w-full h-[250px] bg-gray-300 rounded-2xl  flex items-center justify-center">
        {/* Simulated floating icon */}
        <div className="absolute top-[40%] h-18 w-18 rounded-full bg-gray-400" />
      </div>
    </div>
  );
};

export default ServiceCardSkeleton;
