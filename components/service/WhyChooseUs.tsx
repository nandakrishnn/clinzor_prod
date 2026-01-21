"use client";

import {
  UserCheck,
  Activity,
  Stethoscope,
  ShieldCheck,
  Video,
  TrendingUp
} from "lucide-react";
import { motion } from "framer-motion";

const WhyChooseUs = () => {
  const features = [
    {
      title: "Verified Expert Physiotherapists",
      description: "Certified specialists for clinical pain management, posture correction, and rehabilitation.",
      icon: <UserCheck className="w-6 h-6" />,
      colors: {
        bg: "bg-blue-50",
        iconBg: "bg-blue-100",
        iconText: "text-blue-600"
      }
    },
    {
      title: "Custom Recovery Plans",
      description: "Personalized physiotherapy treatment programs tailored to your specific health goals.",
      icon: <Activity className="w-6 h-6" />,
      colors: {
        bg: "bg-green-50",
        iconBg: "bg-green-100",
        iconText: "text-green-600"
      }
    },
    {
      title: "Advanced Clinical Techniques",
      description: "Evidence based manual therapy and expert exercise rehabilitation for faster healing.",
      icon: <Stethoscope className="w-6 h-6" />,
      colors: {
        bg: "bg-purple-50",
        iconBg: "bg-purple-100",
        iconText: "text-purple-600"
      }
    },
    {
      title: "Safe Proven Protocols",
      description: "Clinically guided physiotherapy ensuring safe, effective, and ethical patient recovery.",
      icon: <ShieldCheck className="w-6 h-6" />,
      colors: {
        bg: "bg-amber-50",
        iconBg: "bg-amber-100",
        iconText: "text-amber-600"
      }
    },
    {
      title: "Seamless Hybrid Care",
      description: "Convenient access to online video consultations and nearby physiotherapy clinic treatments.",
      icon: <Video className="w-6 h-6" />,
      colors: {
        bg: "bg-pink-50",
        iconBg: "bg-pink-100",
        iconText: "text-pink-600"
      }
    },
    {
      title: "Measurable Health Results",
      description: "Noticeable improvements in pain relief, body mobility, and long term posture.",
      icon: <TrendingUp className="w-6 h-6" />,
      colors: {
        bg: "bg-teal-50",
        iconBg: "bg-teal-100",
        iconText: "text-teal-600"
      }
    }
  ];

  return (
    <section className="py-20 bg-white rounded-3xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 space-y-4">
          <span className="inline-block px-3 py-1 text-sm font-medium text-primaryColor bg-blue-50 rounded-full">
            Elite Healthcare Network
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
            Why Bangalore's Best Choose <span className="text-primaryColor">Clinzor</span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Join thousands of Bangaloreans who have skipped the commute and found professional, effective, and ethical physiotherapy care.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`${feature.colors.bg} p-8 rounded-2xl hover:shadow-lg transition-all duration-300 border border-transparent hover:border-white/50`}
            >
              <div className="flex items-center mb-4">
                <div className={`${feature.colors.iconBg} p-3 rounded-full mr-4 ${feature.colors.iconText}`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 leading-tight">
                  {feature.title}
                </h3>
              </div>
              <p className="text-gray-600 text-base leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;