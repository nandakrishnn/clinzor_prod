import Image from "next/image";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

import placeHolderImage from "../../../public/offer.png";
import { getClinicDetail } from "@/service/user/home";
interface OfferCardProps {
  title: string;
  description: string;
  image?: string;
  discount_percentage?: string;
  flat_discount_amt?: string;
  valid_from: string;
  valid_to: string;
  offer_type: string;
  clinic:string|undefined|null
}

interface ClinicName {
  name: string;
}


const OfferCard: React.FC<OfferCardProps> = ({
  title,
  description,
  image,
  discount_percentage,
  flat_discount_amt,
  valid_from,
  valid_to,
  offer_type,
  clinic
}) => {
  

const [clinicDetail,setClinicDetail] = useState<null|string>(null)

useEffect(()=>{
  if(typeof clinic === "string"){
    getClinicDetail(clinic).then((response)=>{
      setClinicDetail(response.data.clinic.name)
    })
  }

},[clinic])





  return (
    <motion.div
      className="relative rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 group h-full flex flex-col border border-gray-100"
      whileHover={{ y: -8, scale: 1.02 }}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, type: "spring" }}
    >
      {/* Tag Ribbon - Top Right */}
      {offer_type &&
        <div className="absolute top-0 right-4 bg-primaryColor text-white font-bold px-3 py-1 rounded-b-lg z-10 text-xs uppercase tracking-wide">
          {offer_type==="ADMIN"?"Applicable for All clinics":`Specific ${offer_type}`}
        </div>}

      {/* Image Section */}
      <div className="h-48 w-full relative overflow-hidden">
        <Image
          src={placeHolderImage}
          alt={title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          quality={90}
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />

        {/* Discount Badge - Bottom Left */}
        <div className="z-40 absolute bottom-4 left-4 bg-white  text-primaryColor font-bold w-14 h-14 rounded-full flex items-center justify-center shadow-md border-2 border-primaryColor/80">
          <div className="text-xs text-center tracking-wide ">
            {discount_percentage && !isNaN(Number(discount_percentage))
              ? `${Math.round(Number(discount_percentage))} % offer`
              : flat_discount_amt && !isNaN(Number(discount_percentage))
                ? `₹ ${Math.round(Number(flat_discount_amt))} offer`
                : "No offer"}
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="bg-white p-5 flex-1 flex flex-col z-40">
        <div className="mb-3">
          <h2 className="text-xl font-bold text-gray-800 line-clamp-2 leading-tight">
            {title}
          </h2>
          <div className="w-10 h-1 bg-primaryColor my-2 rounded-full" />
        </div>

        <p className="capitalize text-gray-600 text-sm mb-4 line-clamp-3 flex-">
          {description} Valid From {valid_from?.split("T")[0]} to{" "}
          {valid_to?.split("T")[0]}
        </p>
         <p className=" text-gray-600 text-sm mb-4 line-clamp-3 flex-1 font-bold">
      { `  ${clinicDetail?"Offer Applicable for : ":""} ${clinicDetail?clinicDetail:"Applicable for All clinic And services"}`}
        </p>

        {/* View Details Button */}
        {/* <button className="mt-auto w-full py-2 bg-gray-50 hover:bg-primaryColor/10 text-primaryColor font-medium rounded-lg text-sm transition-colors duration-300 flex items-center justify-center gap-1 border border-gray-200 group-hover:border-primaryColor/30">
          View Details
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 transition-transform group-hover:translate-x-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button> */}
      </div>

      {/* Hover Overlay Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-primaryColor/90 to-primaryColorDark/90 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none flex items-end p-5" />
    </motion.div>
  );
};

export default OfferCard;
