
'use client'
import { motion } from "framer-motion";
import { ArrowRight, HeartPulse, Stethoscope, Video } from "lucide-react";
import Title from "../ui/title";

export const PlatformIntro = () => (
  <section className="pt-10">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-16"
      >
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Redefining Health in <span className="text-primaryColor">Namma Bengaluru</span>
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto text-lg italic">
          "Why battle Silk Board traffic when expert care can come to you?"
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-blue-50 p-8 rounded-2xl hover:shadow-xl transition-shadow cursor-default"
        >
          <div className="flex items-center mb-4">
            <div className="bg-blue-100 p-3 rounded-full mr-4">
              <Stethoscope className="text-blue-600 w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 leading-tight">
              Smart Clinic Discovery
            </h3>
          </div>
          <p className="text-gray-600 mb-4">
            Skip the endless searching. Find top-rated clinics in Koramangala, Indiranagar, or HSR Layout at your fingertips.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-green-50 p-8 rounded-2xl hover:shadow-xl transition-shadow cursor-default"
        >
          <div className="flex items-center mb-4">
            <div className="bg-green-100 p-3 rounded-full mr-4">
              <Video className="text-green-600 w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 leading-tight">
              Virtual Expert Desk
            </h3>
          </div>
          <p className="text-gray-600 mb-4">
            Consult with Bangalore's best specialists from your home or office. Quality healthcare that fits your tech-city schedule.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="bg-purple-50 p-8 rounded-2xl hover:shadow-xl transition-shadow cursor-default"
        >
          <div className="flex items-center mb-4">
            <div className="bg-purple-100 p-3 rounded-full mr-4">
              <HeartPulse className="text-purple-600 w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 leading-tight">VIP Home Visits</h3>
          </div>
          <p className="text-gray-600 mb-4">
            Can't make it to the clinic? Our certified physiotherapists and doctors bring the hospital-grade care right to your doorstep.
          </p>
        </motion.div>
      </div>
    </div>
  </section>
);
