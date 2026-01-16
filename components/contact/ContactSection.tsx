"use client";
import React from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send } from "lucide-react";

export default function ContactSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-4 md:py-12">
      {/* Animated gradient background shapes */}
      {/* <div className="absolute top-0 left-0 w-96 h-96 bg-blue-300/30 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-pink-300/30 rounded-full blur-3xl animate-pulse" /> */}

      <div className="relative z-10 max-w-6xl w-full grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-8">
        {/* Contact Info */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="backdrop-blur-lg bg-white/40 rounded-xl md:rounded-2xl border overflow-hidden"
        >
          {/* Image on top */}
          <div className="flex justify-center">
            <img
              src="/assets/contact.jpg"
              alt="Contact Illustration"
              className="w-full object-cover shadow-lg "
            />
          </div>
          <div className="p-4 py-8 md:p-8 flex flex-col justify-center space-y-6 border border-white/30">
            <div className="flex items-center space-x-4">
              <div className="bg-blue-500/10 p-3 rounded-full">
                <Phone className="text-blue-500" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-800">Phone</h4>
                <p className="text-gray-600">+91 98765 43210</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-green-500/10 p-3 rounded-full">
                <Mail className="text-green-500" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-800">Email</h4>
                <p className="text-gray-600">contact@yourcompany.com</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-pink-500/10 p-3 rounded-full">
                <MapPin className="text-pink-500" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-800">Address</h4>
                <p className="text-gray-600">Bengaluru</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Contact Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="lg:col-span-2 backdrop-blur-lg bg-white/40 rounded-xl md:rounded-2xl p-4 py-8 md:p-8 border "
        >
          <h3 className="text-2xl font-semibold text-primaryColor mb-6 ">
            Send us a Message
          </h3>

          <form className="space-y-6">
            <div>
              <label className="block mb-1 font-medium text-gray-700">
                Name
              </label>
              <input
                type="text"
                placeholder="Your name"
                className="w-full rounded-lg px-4 py-3 bg-white/70 border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"
              />
            </div>
            <div>
              <label className="block mb-1 font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                placeholder="Your email"
                className="w-full rounded-lg px-4 py-3 bg-white/70 border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"
              />
            </div>
            <div>
              <label className="block mb-1 font-medium text-gray-700">
                Message
              </label>
              <textarea
                rows={5}
                placeholder="Write your message..."
                className="w-full rounded-lg px-4 py-3 bg-white/70 border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition resize-none"
              ></textarea>
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="w-full flex items-center justify-center gap-2 bg-primaryColor hover:opacity-90 text-white py-3 rounded-lg font-medium shadow-lg transition-all"
            >
              <Send size={18} /> Send Message
            </motion.button>
          </form>
        </motion.div>
      </div>
    </section>
  );
}
