"use client";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Calendar, ShieldCheck, Zap, ArrowRight } from "lucide-react";
import Image from "next/image";

const ExpertBookingShowcase = () => {
  const features = [
    {
      icon: <Zap className="w-5 h-5" />,
      title: "Instant Connect",
      description: "24/7 access to top specialists",
      color: "text-purple-600",
      bg: "bg-purple-100"
    },
    {
      icon: <ShieldCheck className="w-5 h-5" />,
      title: "Verified Experts",
      description: "100+ certified doctors",
      color: "text-blue-600",
      bg: "bg-blue-100"
    },
    {
      icon: <Calendar className="w-5 h-5" />,
      title: "Flexible Slots",
      description: "Book anytime that works",
      color: "text-emerald-600",
      bg: "bg-emerald-100"
    }
  ];

  return (
    <section className="relative overflow-hidden py-16 px-4 sm:px-6 bg-gradient-to-br from-gray-50 to-white">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              x: [0, 100 * (i % 2 === 0 ? 1 : -1)],
              y: [0, 50 * (i % 3 === 0 ? 1 : -1)],
              opacity: [0.3, 0.8, 0.3]
            }}
            transition={{
              duration: 15 + i * 3,
              repeat: Infinity,
              ease: "linear"
            }}
            className={`absolute rounded-full opacity-30 ${
              i % 2 === 0 ? "bg-primaryColor" : "bg-secondaryColor"
            }`}
            style={{
              width: `${100 + i * 20}px`,
              height: `${100 + i * 20}px`,
              top: `${10 + i * 10}%`,
              left: `${5 + i * 10}%`
            }}
          />
        ))}
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header with video preview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col lg:flex-row items-center gap-10 mb-16"
        >
          <div className="lg:w-1/2">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primaryColor to-blue-600">
                Expert Medical Consultations
              </span>
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Real-time video consultations with top specialists across 15+
              specialties
            </p>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative overflow-hidden group px-8 py-4 bg-gradient-to-r from-primaryColor to-blue-600 text-white font-medium rounded-xl text-lg flex items-center gap-3 shadow-lg"
            >
              <span className="relative z-10">Book Now</span>
              <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
              <span className="absolute inset-0 bg-gradient-to-r from-blue-600 to-primaryColor opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </motion.button>
          </div>

          <div className="lg:w-1/2 relative">
            <div className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl border-4 border-white">
              <Image
                src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1080&q=80"
                alt="Doctor consultation"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="w-20 h-20 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center cursor-pointer"
                >
                  <Play className="w-8 h-8 text-primaryColor fill-primaryColor" />
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Interactive feature cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
              className="bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-all relative overflow-hidden group"
            >
              <div
                className={`w-12 h-12 rounded-lg ${feature.bg} ${feature.color} flex items-center justify-center mb-4`}
              >
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-800">
                {feature.title}
              </h3>
              <p className="text-gray-600 mb-4">{feature.description}</p>
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primaryColor to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </motion.div>
          ))}
        </div>

        {/* Stats counter */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-16 bg-gradient-to-r from-primaryColor to-blue-600 rounded-2xl p-8 text-white shadow-xl"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="flex flex-col items-center">
              <div className="text-4xl font-bold mb-2">
                <AnimatePresence>
                  <motion.span
                    key={100}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    100+
                  </motion.span>
                </AnimatePresence>
              </div>
              <div className="text-sm opacity-90">Specialists</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-4xl font-bold mb-2">
                <AnimatePresence>
                  <motion.span
                    key={24}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                  >
                    24/7
                  </motion.span>
                </AnimatePresence>
              </div>
              <div className="text-sm opacity-90">Availability</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-4xl font-bold mb-2">
                <AnimatePresence>
                  <motion.span
                    key={15}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  >
                    15+
                  </motion.span>
                </AnimatePresence>
              </div>
              <div className="text-sm opacity-90">Specialties</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-4xl font-bold mb-2">
                <AnimatePresence>
                  <motion.span
                    key={98}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                  >
                    98%
                  </motion.span>
                </AnimatePresence>
              </div>
              <div className="text-sm opacity-90">Satisfaction</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ExpertBookingShowcase;
