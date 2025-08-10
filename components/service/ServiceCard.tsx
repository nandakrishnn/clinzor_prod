import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Star, ArrowRight } from "lucide-react";

const ServiceCard = () => {
  return (
    <div className="rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group overflow-hidden border border-gray-100 hover:border-primary/20 bg-white hover:bg-gradient-to-br from-white to-primary/5">
      {/* Image with overlay effect */}
      <div className="relative h-48 overflow-hidden">
        <Image
          src={"/dummy/service1.png"}
          alt="Anti-Aging Treatment"
          width={500}
          height={500}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Badge for popular services */}
        <div className="absolute top-3 left-3 bg-blue-50 text-primaryColor text-xs font-semibold px-2 py-1 rounded-full">
          Most Popular
        </div>

        {/* Rating overlay */}
        <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full flex items-center gap-1">
          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
          <span className="text-sm font-medium">4.9</span>
          <span className="text-xs text-gray-500">(128)</span>
        </div>
      </div>

      {/* Card content */}
      <div className="p-4 md:p-5">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-bold text-lg text-gray-900 group-hover:text-primary">
            Anti-Aging Facial
          </h3>
          <div className="text-right flex  items-center gap-3">
            <p className="font-bold text-primary text-xl">₹989</p>
            <p className="text-sm text-gray-500 line-through">₹1120</p>
          </div>
        </div>

        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          Comprehensive anti-aging treatments to reduce fine lines, wrinkles,
          and restore skin elasticity with our premium collagen boost serum.
        </p>

        {/* Duration and category tags */}
        <div className="flex gap-2 mb-3">
          <span className="bg-blue-50 text-primaryColor text-xs px-2 py-1 rounded">
            60 mins
          </span>
          <span className="bg-blue-50 text-primaryColor text-xs px-2 py-1 rounded">
            Facial
          </span>
        </div>

        {/* Action buttons */}
        <div className="flex gap-2 w-full">
          <Link
            href="#"
            className="flex-1 bg-primaryColor hover:bg-primary-dark text-white font-medium py-2 px-4 rounded-lg text-sm text-center transition-colors flex items-center justify-center gap-1"
          >
            Book Now
            <ArrowRight className="w-4 h-4" />
          </Link>
          {/* <Link
            href="#"
            title="View details"
            className="w-10 h-10 flex items-center justify-center border border-gray-300 hover:border-primary rounded-lg text-primary transition-colors"
          >
            <ArrowRight className="w-5 h-5" />
          </Link> */}
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;
