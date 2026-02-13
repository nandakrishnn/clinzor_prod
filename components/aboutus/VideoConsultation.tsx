"use client";
import { motion } from "framer-motion";
import { PlayCircle, UserCheck, TrendingUp, Layers } from "lucide-react";
import Title from "../ui/title";

export const VideoConsultation = () => (
  <section className=" bg-white">
    <div className="max-w-6xl mx-auto px-4">
      {/* Heading */}
      <Title
        title="Experience Real Physiotherapy Transformation with Clinzor"
        subtitle="Watch Patient Recovery Stories, Expert Physiotherapy Insights & Real Care in Action."
      />

      {/* Video */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative rounded-2xl overflow-hidden aspect-video shadow-lg mt-10 md:mt-20"
      >
        <img
          src="https://dummyimage.com/1280x720/cccccc/ffffff&text=Physiotherapy+Recovery+Stories"
          alt="Clinzor Physiotherapy Video"
          className="w-full h-full object-cover"
        />
        {/* <button className="absolute inset-0 flex items-center justify-center">
          <span className="bg-white p-4 rounded-full shadow-lg hover:scale-105 transition-transform">
            <PlayCircle className="w-14 h-14 text-blue-600" />
          </span>
        </button> */}
      </motion.div>
    </div>
  </section>
);
