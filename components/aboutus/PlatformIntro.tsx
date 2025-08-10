
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
        {/* <Title
            title=" Revolutionizing Healthcare Access"
            subtitle=" Connecting patients with the best healthcare providers through our
          innovative platform"
          /> */}
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-blue-50 p-8 rounded-xl"
        >
          <div className="flex items-center mb-4">
            <div className="bg-blue-100 p-3 rounded-full mr-4">
              <Stethoscope className="text-blue-600 w-6 h-6" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900">
              Clinic Discovery
            </h3>
          </div>
          <p className="text-gray-600 mb-4">
            Find the nearest clinics with detailed information about services,
            doctors, and availability.
          </p>
          <a
            href="#"
            className="text-blue-600 font-medium inline-flex items-center"
          >
            Learn more <ArrowRight className="ml-1 w-4 h-4" />
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-green-50 p-8 rounded-xl"
        >
          <div className="flex items-center mb-4">
            <div className="bg-green-100 p-3 rounded-full mr-4">
              <Video className="text-green-600 w-6 h-6" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900">
              Virtual Consultations
            </h3>
          </div>
          <p className="text-gray-600 mb-4">
            Connect with healthcare professionals through secure video calls
            from the comfort of your home.
          </p>
          <a
            href="#"
            className="text-green-600 font-medium inline-flex items-center"
          >
            Learn more <ArrowRight className="ml-1 w-4 h-4" />
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="bg-purple-50 p-8 rounded-xl"
        >
          <div className="flex items-center mb-4">
            <div className="bg-purple-100 p-3 rounded-full mr-4">
              <HeartPulse className="text-purple-600 w-6 h-6" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900">Home Visits</h3>
          </div>
          <p className="text-gray-600 mb-4">
            Schedule qualified healthcare professionals to visit you at home for
            comprehensive check-ups.
          </p>
          <a
            href="#"
            className="text-purple-600 font-medium inline-flex items-center"
          >
            Learn more <ArrowRight className="ml-1 w-4 h-4" />
          </a>
        </motion.div>
      </div>
    </div>
  </section>
);
