"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform, useSpring, useInView } from "framer-motion";
import Image from "next/image";
import {
  IconMapPin,
  IconStar,
  IconClock,
  IconChevronRight,
  IconArrowRight,
} from "@tabler/icons-react";

interface Clinic {
  id: string;
  name: string;
  imageUrl: string;
  rating: number;
  location: string;
  specialty: string;
  distance: string;
  openHours: string;
  isOpen: boolean;
}

const DEFAULT_IMAGE = "/image.jpg";

const TOP_CLINICS: Clinic[] = [
  {
    id: "1",
    name: "GreenLife Medical Center",
    imageUrl: DEFAULT_IMAGE,
    rating: 4.8,
    location: "Downtown, 2.1 miles away",
    specialty: "General Practice",
    distance: "2.1 miles",
    openHours: "8:00 AM - 7:00 PM",
    isOpen: true,
  },
  {
    id: "2",
    name: "Advanced Dental Care",
    imageUrl: DEFAULT_IMAGE,
    rating: 4.6,
    location: "West End, 3.5 miles away",
    specialty: "Dentistry",
    distance: "3.5 miles",
    openHours: "9:00 AM - 5:00 PM",
    isOpen: true,
  },
  {
    id: "3",
    name: "Central Pediatrics",
    imageUrl: DEFAULT_IMAGE,
    rating: 4.9,
    location: "Northside, 1.8 miles away",
    specialty: "Pediatrics",
    distance: "1.8 miles",
    openHours: "8:30 AM - 6:00 PM",
    isOpen: false,
  },
  {
    id: "4",
    name: "Central Pediatrics",
    imageUrl: DEFAULT_IMAGE,
    rating: 4.9,
    location: "Northside, 1.8 miles away",
    specialty: "Pediatrics",
    distance: "1.8 miles",
    openHours: "8:30 AM - 6:00 PM",
    isOpen: false,
  },
  {
    id: "5",
    name: "City Heart Specialists",
    imageUrl: DEFAULT_IMAGE,
    rating: 4.7,
    location: "Eastside, 4.2 miles away",
    specialty: "Cardiology",
    distance: "4.2 miles",
    openHours: "7:30 AM - 6:30 PM",
    isOpen: true,
  },
  {
    id: "6",
    name: "Family Health Partners",
    imageUrl: DEFAULT_IMAGE,
    rating: 4.5,
    location: "Southend, 2.7 miles away",
    specialty: "Family Medicine",
    distance: "2.7 miles",
    openHours: "8:00 AM - 8:00 PM",
    isOpen: true,
  },
];

const ClinicCard = ({ clinic, index }: { clinic: Clinic; index: number }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "0px 0px -80px 0px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{
        delay: index * 0.1,
        duration: 0.6,
        type: "spring",
        stiffness: 100,
        damping: 18,
      }}
      whileHover={{ y: -4 }}
      className="flex flex-col rounded-xl overflow-hidden bg-white border border-black/10 shadow-sm hover:shadow-lg transition-all duration-300"
    >
      <div className="relative h-48 w-full overflow-hidden">
        <motion.div
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.5 }}
          className="h-full w-full"
        >
          <Image
            src={clinic.imageUrl}
            alt={clinic.name}
            fill
            className="object-cover transition-all duration-700"
          />
        </motion.div>
        <div className="absolute top-3 right-3 px-2 py-1 rounded-lg text-xs font-medium shadow bg-white/90">
          {clinic.isOpen ? (
            <span className="flex items-center gap-1 text-green-600">
              <span className="h-2 w-2 rounded-full bg-green-500"></span>
              Open Now
            </span>
          ) : (
            <span className="flex items-center gap-1 text-red-600">
              <span className="h-2 w-2 rounded-full bg-red-500"></span>
              Closed
            </span>
          )}
        </div>
      </div>

      <div className="p-4 flex flex-col gap-2">
        <div className="flex justify-between items-start">
          <h3 className="font-bold text-black text-lg">{clinic.name}</h3>
          <div className="flex items-center gap-1">
            <IconStar size={16} className="text-yellow-500 fill-yellow-500" />
            <span className="text-sm">{clinic.rating.toFixed(1)}</span>
          </div>
        </div>

        <div className="flex items-center gap-1 text-black/80 text-sm">
          <IconMapPin size={16} />
          <span>{clinic.location}</span>
        </div>

        <div className="flex items-center gap-1 text-black/80 text-sm">
          <IconClock size={16} />
          <span>{clinic.openHours}</span>
        </div>

        <div className="mt-2 text-sm font-medium px-2 py-1 rounded bg-black/5 w-fit text-black">
          {clinic.specialty}
        </div>
      </div>

      <div className="px-4 py-3 border-t border-black/10">
        <button className="flex items-center justify-between w-full text-sm font-medium text-black">
          View Details
          <IconChevronRight size={18} />
        </button>
      </div>
    </motion.div>
  );
};

export default function TopClinics() {
  const { scrollY } = useScroll();
  const headerOpacity = useTransform(scrollY, [0, 150], [1, 0.97]);
  const headerScale = useTransform(scrollY, [0, 150], [1, 0.98]);
  const headerY = useTransform(scrollY, [0, 150], [0, -10]);
  const springHeaderY = useSpring(headerY, { stiffness: 200, damping: 20 });

  return (
    <div className="min-h-screen">
      <motion.div
        className="pt-24 px-4 md:px-8 max-w-6xl mx-auto"
        style={{
          opacity: headerOpacity,
          scale: headerScale,
          y: springHeaderY,
        }}
      >
        <motion.h1
          className="text-3xl md:text-4xl font-bold text-black mb-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, type: "spring" }}
        >
          Top Rated Clinics
        </motion.h1>
        <motion.p
          className="text-black/70 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, type: "spring" }}
        >
          Explore the best-rated health providers in your area.
        </motion.p>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 pb-12">
          {TOP_CLINICS.map((clinic, index) => (
            <ClinicCard key={clinic.id} clinic={clinic} index={index} />
          ))}
        </div>

        <motion.div
          className="flex justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => console.log("View More Clicked")}
            
            className="px-6 py-3 bg-black text-white rounded-xl shadow-md hover:shadow-lg text-sm font-medium flex items-center gap-2 transition-all"
          >
            View More Clinics
            <motion.div whileHover={{ x: 4 }} transition={{ duration: 0.3 }}>
              <IconArrowRight size={18} />
            </motion.div>
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  );
}
