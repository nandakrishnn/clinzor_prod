"use client";

import React from "react";
import {
  ClockIcon,
  CurrencyRupeeIcon,
  StarIcon
} from "@heroicons/react/24/solid";
import Image from "next/image";

interface ServiceDetailsProps {
  title: string;
  description: string;
  duration: string;
  price: string;
  rating: string;
  imageUrl?: string;
}

export const ServiceDetailsCard: React.FC<ServiceDetailsProps> = ({
  title,
  description,
  duration,
  price,
  rating,
  imageUrl = "/dummy/doc.jpg" // default image
}) => {
  return (
    <div className="mb-8 w-full">
      <div className="bg-white md:h-[375px] rounded-lg overflow-hidden  border border-gray-200 flex flex-col md:flex-row ">
        {/* Left Image */}
        <div className="relative md:w-1/3 w-full h-56 md:h-auto">
          <Image
            src={"/dummy/doc.jpg"}
            alt={title}
            width={500}
            height={500}
            className="object-cover h-full"
          />
          <div className="absolute top-4 left-4 bg-gradient-to-r from-primaryColor to-blue-500 text-white text-sm px-3 py-1 rounded-full shadow">
            Featured Service
          </div>
        </div>

        {/* Right Content */}
        <div className="flex-1 flex flex-col justify-between p-6 space-y-4">
          {/* Title */}
          <div>
            <h3 className="text-2xl font-bold text-gray-900">{title}</h3>
            {/* Description */}
            <p className="text-gray-700 leading-relaxed pt-5">{description}</p>
          </div>{" "}
          {/* Info row */}
          <div className="flex flex-wrap gap-6 text-sm text-gray-700 pt-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 rounded-full">
                <ClockIcon className="w-6 h-6 text-primaryColor" />
              </div>
              <div>
                <p className="text-gray-500 text-xs">Duration</p>
                <p className="font-semibold">{duration}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-100 rounded-full">
                <CurrencyRupeeIcon className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-gray-500 text-xs">Price</p>
                <p className="font-semibold">{price}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-3 bg-yellow-100 rounded-full">
                <StarIcon className="w-6 h-6 text-yellow-500" />
              </div>
              <div>
                <p className="text-gray-500 text-xs">Rating</p>
                <p className="font-semibold">{rating}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
