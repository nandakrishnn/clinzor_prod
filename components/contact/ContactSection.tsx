"use client";
import React from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send } from "lucide-react";

export default function ContactSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-4 py-12 md:py-16 bg-white">
      <div className="relative z-10 max-w-7xl w-full">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
            Get In <span className="text-primaryColor">Touch</span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Have questions? We'd love to hear from you. Send us a message and
            we'll respond as soon as possible.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Contact Info Cards */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-2 space-y-3"
          >
            {/* Image Card */}
            <div className="relative overflow-hidden rounded-xl shadow-lg">
              <img
                src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&auto=format&fit=crop"
                alt="Healthcare Professional"
                className="w-full h-48 object-cover"
              />
            </div>

            {/* Contact Info Cards */}
            <motion.div
              whileHover={{ y: -3 }}
              className="bg-white rounded-xl p-4 shadow-lg border border-gray-100 hover:shadow-xl transition-all"
            >
              <div className="flex items-center space-x-3">
                <div className="bg-blue-500/10 p-2.5 rounded-full">
                  <Phone className="text-blue-500" size={20} />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 text-sm mb-0.5">
                    Phone
                  </h4>
                  <a
                    href="tel:+917411096006"
                    className="text-gray-600 text-sm hover:text-blue-500 transition"
                  >
                    +91 7411096006
                  </a>
                </div>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ y: -3 }}
              className="bg-white rounded-xl p-4 shadow-lg border border-gray-100 hover:shadow-xl transition-all"
            >
              <div className="flex items-center space-x-3">
                <div className="bg-green-500/10 p-2.5 rounded-full">
                  <Mail className="text-green-500" size={20} />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 text-sm mb-0.5">
                    Email
                  </h4>
                  <a
                    href="mailto:contact@clinzor.com"
                    className="text-gray-600 text-sm hover:text-green-500 transition"
                  >
                    contact@clinzor.com
                  </a>
                </div>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ y: -3 }}
              className="bg-white rounded-xl p-4 shadow-lg border border-gray-100 hover:shadow-xl transition-all"
            >
              <div className="flex items-center space-x-3">
                <div className="bg-pink-500/10 p-2.5 rounded-full">
                  <MapPin className="text-pink-500" size={20} />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 text-sm mb-0.5">
                    Address
                  </h4>
                  <p className="text-gray-600 text-sm">
                    Bengaluru
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-3 bg-white rounded-2xl p-5 md:p-6 shadow-2xl border border-gray-100"
          >
            <h3 className="text-xl font-bold text-gray-800 mb-1">
              Send us a Message
            </h3>
            <p className="text-gray-600 text-sm mb-4">
              Fill out the form below and we'll get back to you shortly
            </p>

            <form className="space-y-3">
              <div>
                <label className="block mb-1 font-medium text-gray-700 text-sm">
                  Name
                </label>
                <input
                  type="text"
                  placeholder="Your name"
                  className="w-full rounded-lg px-3 py-2 text-sm bg-gray-50 border border-gray-200 focus:border-primaryColor focus:ring-2 focus:ring-primaryColor/20 focus:bg-white outline-none transition"
                />
              </div>

              <div>
                <label className="block mb-1 font-medium text-gray-700 text-sm">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="Your email"
                  className="w-full rounded-lg px-3 py-2 text-sm bg-gray-50 border border-gray-200 focus:border-primaryColor focus:ring-2 focus:ring-primaryColor/20 focus:bg-white outline-none transition"
                />
              </div>

              <div>
                <label className="block mb-1 font-medium text-gray-700 text-sm">
                  Message
                </label>
                <textarea
                  rows={5}
                  placeholder="Write your message..."
                  className="w-full rounded-lg px-3 py-2 text-sm bg-gray-50 border border-gray-200 focus:border-primaryColor focus:ring-2 focus:ring-primaryColor/20 focus:bg-white outline-none transition resize-none"
                ></textarea>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full flex items-center justify-center gap-2 bg-primaryColor hover:bg-primaryColor/90 text-white py-2.5 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all"
              >
                <Send size={18} /> Send Message
              </motion.button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}