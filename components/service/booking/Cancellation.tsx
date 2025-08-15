"use client";
import React from "react";
import { XCircleIcon, CalendarIcon, ClockIcon, UserIcon, HomeIcon, ArrowPathIcon } from "@heroicons/react/24/solid";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export const Cancellation = () => {
  const router = useRouter();
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <motion.div 
      className="min-h-[80vh] flex flex-col items-center justify-center bg-gradient-to-b  px-4 py-12"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Animated Cancellation Icon */}
      <motion.div 
        className="relative mb-8"
        variants={itemVariants}
      >
        <div className="absolute inset-0 bg-red-100 rounded-full animate-ping opacity-75"></div>
        <div className="relative z-10 p-4 bg-white rounded-full shadow-lg">
          <XCircleIcon className="w-16 h-16 text-red-500" />
        </div>
      </motion.div>

      {/* Heading with animation */}
      <motion.h2 
        className="text-3xl md:text-4xl font-bold text-gray-800 mb-4 text-center"
        variants={itemVariants}
      >
        Appointment Cancelled
      </motion.h2>

      {/* Description with animation */}
      <motion.p 
        className="text-lg text-gray-600 max-w-lg mb-8 text-center"
        variants={itemVariants}
      >
        Your appointment has been successfully cancelled. If this was a mistake, you can rebook using the button below.
      </motion.p>

      {/* Cancelled Appointment Card */}
      <motion.div 
        className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md border border-gray-100 mb-8"
        variants={itemVariants}
      >
        <h3 className="text-xl font-bold text-gray-800 mb-6 pb-2 border-b border-gray-100 flex items-center">
          <CalendarIcon className="w-5 h-5 text-red-500 mr-2" />
          Cancelled Appointment
        </h3>
        
        <div className="space-y-4">
          <div className="flex items-start">
            <div className="bg-red-100 p-2 rounded-lg mr-4">
              <UserIcon className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Doctor</p>
              <p className="font-medium">Dr. Priya Sharma (Cardiologist)</p>
            </div>
          </div>

          <div className="flex items-start">
            <div className="bg-red-100 p-2 rounded-lg mr-4">
              <CalendarIcon className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Date & Time</p>
              <p className="font-medium">20 Aug 2025 at 10:00 AM</p>
            </div>
          </div>

          <div className="flex items-start">
            <div className="bg-red-100 p-2 rounded-lg mr-4">
              <HomeIcon className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Location</p>
              <p className="font-medium">HeartCare Clinic, Bengaluru</p>
              <p className="text-sm text-gray-500 mt-1">123 Medical Street, 560001</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Buttons */}
      <motion.div 
        className="flex flex-col sm:flex-row gap-4 w-full max-w-md"
        variants={itemVariants}
      >
        <button
          onClick={() => router.back()}
          className="flex-1 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium shadow-md transition-all transform hover:scale-105 flex items-center justify-center"
        >
          <ArrowPathIcon className="w-5 h-5 mr-2" />
          Rebook 
        </button>
        <button
          onClick={() => router.push("/")}
          className="flex-1 px-6 py-3 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg font-medium shadow-md transition-all transform hover:scale-105"
        >
          Back to Home
        </button>
      </motion.div>

      {/* Additional Help */}
      <motion.div 
        className="mt-8 text-center text-sm text-gray-500"
        variants={itemVariants}
      >
        Need help? <a href="/contact" className="text-red-600 hover:underline">Contact our support</a>
      </motion.div>
    </motion.div>
  );
};