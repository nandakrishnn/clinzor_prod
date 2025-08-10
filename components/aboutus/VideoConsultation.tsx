"use client";
import { motion } from "framer-motion";
import { PlayCircle, UserCheck, TrendingUp, Layers } from "lucide-react";
import Title from "../ui/title";

export const VideoConsultation = () => (
  <section className=" bg-white">
    <div className="max-w-6xl mx-auto px-4">
      {/* Heading */}
      <Title
        title="  Experience beauty transform through"
        subtitle=" Watch real patient stories, expert insights, and behind-the-scenes
          moments that showcase our commitment to natural beauty"
      />

      {/* Video */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative rounded-2xl overflow-hidden aspect-video shadow-lg mt-10 md:mt-20"
      >
        <img
          src="https://dummyimage.com/1280x720/cccccc/ffffff&text=Video+Thumbnail"
          alt="Video Thumbnail"
          className="w-full h-full object-cover"
        />
        <button className="absolute inset-0 flex items-center justify-center">
          <span className="bg-white p-4 rounded-full shadow-lg hover:scale-105 transition-transform">
            <PlayCircle className="w-14 h-14 text-blue-600" />
          </span>
        </button>
      </motion.div>

      {/* Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
        <div className="flex items-start space-x-3">
          <UserCheck className="w-6 h-6 text-blue-600 flex-shrink-0" />
          <div>
            <h4 className="font-semibold text-gray-900">
              Patient Testimonials
            </h4>
            <p className="text-gray-600 text-sm">
              Real stories from clients who beautiful, confident
              transformations.
            </p>
          </div>
        </div>

        <div className="flex items-start space-x-3">
          <TrendingUp className="w-6 h-6 text-blue-600 flex-shrink-0" />
          <div>
            <h4 className="font-semibold text-gray-900">
              Enhanced Performance
            </h4>
            <p className="text-gray-600 text-sm">
              Real stories from clients who beautiful, confident
              transformations.
            </p>
          </div>
        </div>

        <div className="flex items-start space-x-3">
          <Layers className="w-6 h-6 text-blue-600 flex-shrink-0" />
          <div>
            <h4 className="font-semibold text-gray-900">Advanced System</h4>
            <p className="text-gray-600 text-sm">
              Real stories from clients who beautiful, confident
              transformations.
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
);
