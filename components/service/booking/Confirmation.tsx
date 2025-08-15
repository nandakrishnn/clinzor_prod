"use client";
import React from "react";
import { CheckCircleIcon, CalendarIcon, ClockIcon, UserIcon, HomeIcon, DevicePhoneMobileIcon } from "@heroicons/react/24/solid";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export const Confirmation = () => {
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
      {/* Animated Confirmation */}
      <motion.div 
        className="relative mb-8"
        variants={itemVariants}
      >
        <div className="absolute inset-0 bg-blue-100 rounded-full animate-ping opacity-75"></div>
        <div className="relative z-10 p-4 bg-white rounded-full shadow-lg">
          <CheckCircleIcon className="w-16 h-16 text-blue-900" />
        </div>
      </motion.div>

      {/* Heading with animation */}
      <motion.h2 
        className="text-3xl md:text-4xl font-bold text-gray-800 mb-4 text-center"
        variants={itemVariants}
      >
        Appointment Confirmed!
      </motion.h2>

      {/* Description with animation */}
      <motion.p 
        className="text-lg text-gray-600 max-w-lg mb-8 text-center"
        variants={itemVariants}
      >
        Your appointment has been successfully booked. We've sent a confirmation to your email with all the details.
      </motion.p>

      {/* Confetti effect (visual only) */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-blue-400 rounded-full"
            initial={{ 
              y: -50,
              x: Math.random() * window.innerWidth,
              opacity: 0,
              scale: 0
            }}
            animate={{
              y: window.innerHeight,
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
              rotate: Math.random() * 360
            }}
            transition={{
              duration: 1.5,
              delay: i * 0.05,
              repeatDelay: 5,
              repeat: Infinity
            }}
          />
        ))}
      </div>

      {/* Appointment Card */}
      <motion.div 
        className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md border border-gray-100 mb-8"
        variants={itemVariants}
      >
        <h3 className="text-xl font-bold text-gray-800 mb-6 pb-2 border-b border-gray-100 flex items-center">
          <CalendarIcon className="w-5 h-5 text-primaryColor mr-2" />
          Appointment Details
        </h3>
        
        <div className="space-y-4">
          <div className="flex items-start">
            <div className="bg-blue-100 p-2 rounded-lg mr-4">
              <UserIcon className="w-5 h-5 text-primaryColor" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Doctor</p>
              <p className="font-medium">Dr. Priya Sharma (Cardiologist)</p>
            </div>
          </div>

          <div className="flex items-start">
            <div className="bg-primary-100 p-2 rounded-lg mr-4">
              <CalendarIcon className="w-5 h-5 text-primaryColor" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Date & Time</p>
              <p className="font-medium">20 Aug 2025 at 10:00 AM</p>
            </div>
          </div>

          <div className="flex items-start">
            <div className="bg-blue-100 p-2 rounded-lg mr-4">
              <HomeIcon className="w-5 h-5 text-primaryColor" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Location</p>
              <p className="font-medium">HeartCare Clinic, Bengaluru</p>
              <p className="text-sm text-gray-500 mt-1">123 Medical Street, 560001</p>
            </div>
          </div>

          <div className="flex items-start">
            <div className="bg-blue-100 p-2 rounded-lg mr-4">
              <DevicePhoneMobileIcon className="w-5 h-5 text-primaryColor" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Confirmation Sent To</p>
              <p className="font-medium">user@example.com</p>
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
          className="flex-1 px-6 py-3 bg-primaryColor hover:bg-primaryColor text-white rounded-lg font-medium shadow-md transition-all transform hover:scale-105"
        >
          Back to Home
        </button>
        <button
          onClick={() => router.push("/service")}
          className="flex-1 px-6 py-3 bg-white border border-blue-600 text-primaryColor hover:bg-green-50 rounded-lg font-medium shadow-md transition-all transform hover:scale-105"
        >
          Book Another
        </button>
      </motion.div>

      {/* Additional Help */}
      <motion.div 
        className="mt-8 text-center text-sm text-gray-500"
        variants={itemVariants}
      >
        Need help? <a href="/contact" className="text-primaryColor hover:underline">Contact our support</a>
      </motion.div>
    </motion.div>
  );
};