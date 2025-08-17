import React from "react";

const ServiceCardSkeleton = () => {
  return (
    <div className="rounded-xl shadow-lg overflow-hidden border border-gray-100 bg-white">
      {/* Image placeholder */}
      <div className="relative h-48 bg-gray-100 overflow-hidden animate-pulse">
        {/* Popular badge placeholder */}
        <div className="absolute top-3 left-3 h-6 w-20 bg-gray-200 rounded-full"></div>
      </div>

      {/* Content placeholder */}
      <div className="p-4 md:p-5">
        {/* Title and price row */}
        <div className="flex justify-between items-start mb-3">
          <div className="h-6 w-3/4 bg-gray-100 rounded-full"></div>
          <div className="flex items-center gap-3">
            <div className="h-6 w-12 bg-gray-100 rounded-full"></div>
            <div className="h-5 w-8 bg-gray-100 rounded-full"></div>
          </div>
        </div>

        {/* Description placeholder */}
        <div className="space-y-2 mb-4">
          <div className="h-3 w-full bg-gray-100 rounded-full"></div>
          <div className="h-3 w-5/6 bg-gray-100 rounded-full"></div>
        </div>

        {/* Tags placeholder */}
        <div className="flex gap-2 mb-4">
          <div className="h-6 w-12 bg-gray-100 rounded-full"></div>
          <div className="h-6 w-14 bg-gray-100 rounded-full"></div>
        </div>

        {/* Button placeholder */}
        <div className="h-10 w-full bg-gray-100 rounded-lg"></div>
      </div>
    </div>
  );
};

export default ServiceCardSkeleton;