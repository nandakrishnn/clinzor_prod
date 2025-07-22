'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import {
  IconStar,
  IconMapPin,
  IconClock,
  IconChevronDown,
  IconPhone,
  IconCalendarEvent,
  IconUser,
  IconArrowUpRight
} from '@tabler/icons-react';
import { Clinic } from './clinics';

interface ClinicCardProps {
  clinic: Clinic;
  index: number;
}

export default function ClinicCard({ clinic, index }: ClinicCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const appleEasing = [0.25, 0.1, 0.25, 1.0];

  const availableServices = ['Consultation', 'Checkup', 'Vaccination', 'Lab Tests'];
  const insuranceAccepted = ['Medicare', 'Blue Cross', 'Aetna', 'UnitedHealth'];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.6, ease: appleEasing }}
      whileHover={{ y: -4, transition: { duration: 0.3, ease: appleEasing } }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className={`flex flex-col rounded-2xl overflow-hidden bg-white border border-black/5 transition-all duration-300 ${
        isHovered ? 'shadow-xl' : 'shadow-md'
      }`}
    >
      <Link href={`/clinic/${clinic.id}`} className="contents">
        <div className="relative h-56 w-full overflow-hidden">
          <motion.div
            animate={{ scale: isHovered ? 1.05 : 1, filter: isHovered ? 'brightness(1.03)' : 'brightness(1)' }}
            transition={{ duration: 0.7, ease: appleEasing }}
            className="h-full w-full"
          >
            <Image
              src={clinic.imageUrl}
              alt={clinic.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              priority={index < 3}
            />
            <motion.div
              className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"
              animate={{ opacity: isHovered ? 0.3 : 0 }}
              transition={{ duration: 0.3 }}
            />
          </motion.div>

          <motion.div
            className="absolute top-4 right-4 px-3 py-1.5 bg-white/90 backdrop-blur-sm rounded-full text-xs font-medium shadow-sm"
            animate={{ scale: isHovered ? 1.05 : 1 }}
            transition={{ delay: 0.1, duration: 0.3 }}
          >
            {clinic.isOpen ? (
              <span className="flex items-center gap-1.5 text-black">
                <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                Open Now
              </span>
            ) : (
              <span className="flex items-center gap-1.5 text-black">
                <span className="h-2 w-2 rounded-full bg-red-500" />
                Closed
              </span>
            )}
          </motion.div>
        </div>

        <div className="p-6 flex flex-col gap-3 flex-grow">
          <div className="flex justify-between items-start">
            <motion.h3
              className="text-lg font-semibold text-black leading-tight"
              animate={{ scale: isHovered ? 1.01 : 1 }}
              transition={{ duration: 0.3 }}
            >
              {clinic.name}
            </motion.h3>
            <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-full">
              <IconStar size={14} className="text-yellow-500 fill-yellow-500" />
              <span className="text-sm font-medium text-black">{clinic.rating.toFixed(1)}</span>
            </div>
          </div>

          <div className="flex flex-col gap-2 text-black/80">
            <div className="flex items-center gap-2 text-sm">
              <IconMapPin size={16} className="text-black/60" stroke={1.5} />
              <span>{clinic.location}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <IconClock size={16} className="text-black/60" stroke={1.5} />
              <span>{clinic.openHours}</span>
            </div>
          </div>

          <motion.span
            className="inline-block mt-1 px-3 py-1.5 bg-black/5 text-sm font-medium rounded-full text-black w-fit"
            animate={{ scale: isHovered ? 1.02 : 1, backgroundColor: isHovered ? 'rgba(0,0,0,0.08)' : 'rgba(0,0,0,0.05)' }}
            transition={{ duration: 0.3 }}
          >
            {clinic.specialty}
          </motion.span>
        </div>
      </Link>

      <button
        onClick={(e) => {
          e.preventDefault();
          setIsExpanded(!isExpanded);
        }}
        className="px-6 py-4 border-t border-black/5 flex items-center justify-between text-sm font-medium text-black hover:bg-black/[0.02] transition-colors"
      >
        <span>{isExpanded ? 'Hide Details' : 'View Details'}</span>
        <motion.div animate={{ rotate: isExpanded ? 180 : 0 }} transition={{ duration: 0.3 }}>
          <IconChevronDown size={18} className="text-black" />
        </motion.div>
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1, transition: { height: { duration: 0.3 }, opacity: { duration: 0.3, delay: 0.1 } } }}
            exit={{ height: 0, opacity: 0, transition: { height: { duration: 0.3 }, opacity: { duration: 0.15 } } }}
            className="overflow-hidden border-t border-black/5"
          >
            <div className="p-6 bg-black/[0.01] space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                {/* Services */}
                <div>
                  <h4 className="text-xs uppercase tracking-wider text-black/50 mb-2">Services</h4>
                  <div className="flex flex-wrap gap-2">
                    {availableServices.map((service) => (
                      <span
                        key={service}
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-black bg-white border border-black/10 rounded-full text-sm font-medium hover:bg-black/[0.05] transition"
                      >
                        {service}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Insurance */}
                <div>
                  <h4 className="text-xs uppercase tracking-wider text-black/50 mb-2">Insurance</h4>
                  <div className="flex flex-wrap gap-2">
                    {insuranceAccepted.map((ins) => (
                      <span
                        key={ins}
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-black bg-white border border-black/10 rounded-full text-sm font-medium hover:bg-black/[0.05] transition"
                      >
                        {ins}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Contact Pills */}
              <div className="flex flex-wrap gap-2">
                <a
                  href={`tel:${clinic.phone}`}
                  className="inline-flex items-center gap-2 px-3 py-1.5 text-black bg-white border border-black/10 rounded-full text-sm font-medium hover:bg-black/[0.05] transition"
                >
                  <IconPhone size={16} className="text-black/60" stroke={1.5} />
                  {clinic.phone || '(555) 123-4567'}
                </a>

                <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-white text-black border border-black/10 rounded-full text-sm font-medium">
                  <IconUser size={16} className="text-black/60" stroke={1.5} />
                  Accepting new patients
                </span>

                <Link
                  href={`/clinic/${clinic.id}`}
                  className="inline-flex items-center gap-2 px-3 py-1.5 bg-black text-white rounded-full text-sm font-medium transition-transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  <IconCalendarEvent size={16} />
                  Book Appointment
                  <IconArrowUpRight size={16} />
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}






