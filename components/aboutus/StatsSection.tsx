'use client'
import { motion } from "framer-motion";

export const StatsSection = () => {
  const stats = [
    { value: "10,000+", label: "Happy Patients" },
    { value: "500+", label: "Partner Clinics" },
    { value: "24/7", label: "Support Available" },
    { value: "98%", label: "Satisfaction Rate" }
  ];

  return (
    <section className="py-16 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="text-center"
            >
              <div className="text-4xl font-bold mb-2">{stat.value}</div>
              <div className="text-lg font-medium text-blue-100">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};