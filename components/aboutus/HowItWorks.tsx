"use client";
import {
  CheckCircle2,
  MapPin,
  CalendarCheck,
  PhoneCall,
  UserCheck
} from "lucide-react";
import { motion } from "framer-motion";
import Title from "../ui/title";

export const HowItWorks = () => {
  const steps = [
    {
      icon: <MapPin className="w-8 h-8" />,
      title: "Find Nearby Clinics",
      description:
        "Search and discover clinics in your area with our intuitive location-based service",
      color: "bg-blue-100 text-blue-600",
      borderColor: "border-blue-200"
    },
    {
      icon: <CalendarCheck className="w-8 h-8" />,
      title: "Book Appointments",
      description:
        "Easily schedule visits with real-time availability from healthcare providers",
      color: "bg-green-100 text-green-600",
      borderColor: "border-green-200"
    },
    {
      icon: <PhoneCall className="w-8 h-8" />,
      title: "Expert Call Support",
      description:
        "Get personalized assistance from our healthcare concierge team",
      color: "bg-purple-100 text-purple-600",
      borderColor: "border-purple-200"
    },
    {
      icon: <UserCheck className="w-8 h-8" />,
      title: "Choose Consultation Type",
      description:
        "Select between in-person, video call, or home visit options",
      color: "bg-amber-100 text-amber-600",
      borderColor: "border-amber-200"
    }
  ];

  return (
    <section className="py-16 md:pt-24 ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          {/* <span className="inline-block px-3 py-1 text-sm font-medium rounded-full bg-blue-100 text-blue-600 mb-4">
            Simple Process
          </span> */}
          <Title
            title=" How Our Platform Works"
            subtitle=" Simple steps to connect you with the healthcare services you need"
          />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 + 0.2 }}
              whileHover={{ y: -5 }}
              className="group relative"
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-200 to-purple-200 rounded-xl opacity-0 group-hover:opacity-30 blur transition duration-200"></div>
              <div
                className={`relative bg-white p-8 rounded-xl border ${step.borderColor} hover:border-transparent transition-all duration-200 h-full flex flex-col`}
              >
                <div
                  className={`w-14 h-14 rounded-full ${step.color} flex items-center justify-center mb-6`}
                >
                  {step.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {step.title}
                </h3>
                <p className="text-gray-600 mb-6 flex-grow">
                  {step.description}
                </p>
                <div className="flex items-center text-sm font-medium">
                  <span
                    className={`w-6 h-6 rounded-full flex items-center justify-center mr-2 ${step.color}`}
                  >
                    {index + 1}
                  </span>
                  <span className="text-gray-500">Step {index + 1}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-16 text-center"
        >
          <button className="px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105">
            Get Started Today
          </button>
        </motion.div>
      </div>
    </section>
  );
};
