import React from "react";
import { motion } from "framer-motion";

const OfferCardSkeleton: React.FC = () => {
  return (
    <motion.div
      className="relative rounded-2xl overflow-hidden shadow-md h-full flex flex-col border border-gray-100 bg-gray-100"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, type: "spring" }}
    >
      {/* Tag Ribbon Skeleton - Top Right */}
      <div className="absolute top-0 right-4 bg-gray-300 h-6 w-16 rounded-b-lg z-10 animate-pulse" />

      {/* Image Section Skeleton */}
      <div className="h-48 w-full relative overflow-hidden bg-gray-300 animate-pulse" />

      {/* Content Section Skeleton */}
      <div className="bg-white p-5 flex-1 flex flex-col z-40">
        <div className="mb-3">
          {/* Title Skeleton */}
          <div className="h-6 bg-gray-300 rounded-md mb-2 animate-pulse" />
          <div className="w-10 h-1 bg-gray-300 my-2 rounded-full animate-pulse" />
        </div>

        {/* Description Skeleton */}
        <div className="space-y-2 mb-4 flex-1">
          <div className="h-4 bg-gray-300 rounded animate-pulse" />
          <div className="h-4 bg-gray-300 rounded animate-pulse w-3/4" />
          <div className="h-4 bg-gray-300 rounded animate-pulse w-1/2" />
        </div>

        {/* Button Skeleton */}
        <div className="mt-auto w-full py-2 bg-gray-300 rounded-lg animate-pulse h-10" />
      </div>
    </motion.div>
  );
};

export default OfferCardSkeleton;
