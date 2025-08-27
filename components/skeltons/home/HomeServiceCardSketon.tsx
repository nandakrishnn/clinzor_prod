// components/ui/CardTwoSkeleton.tsx
import React from "react";
import { cn } from "@/lib/utils";

interface CardTwoSkeletonProps {
  className?: string;
  count?: number;
}

const CardTwoSkeleton: React.FC<CardTwoSkeletonProps> = ({
  className,
  count = 6
}) => {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className={cn(
            "rounded-[8px] p-6 pb-10 flex flex-col items-center justify-center bg-[#F2F5FF] animate-pulse",
            className
          )}
        >
          {/* Icon placeholder */}
          <div className="bg-gray-300 p-3 rounded-full w-12 h-12"></div>

          {/* Title placeholder */}
          <div className="text-center w-full mt-5">
            <div className="h-6 bg-gray-300 rounded-md mx-auto w-3/4 mb-3"></div>

            {/* Content placeholder */}
            <div className="space-y-2">
              <div className="h-4 bg-gray-300 rounded-md w-full"></div>
              <div className="h-4 bg-gray-300 rounded-md w-5/6 mx-auto"></div>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default CardTwoSkeleton;
