"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  CreditCard,
  Check,
  ChevronRight,
  ChevronDown,
  ArrowRight,
} from "lucide-react";

// Interfaces
interface User {
  id: string;
  name: string;
  email: string;
}

interface Appointment {
  id: string;
  datetime: string;
  service: string;
  user: User;
  amount: number;
}

// ✅ Apple-style header with logo
const StickyHeader = ({ title }: { title: string }) => (
  <header className="w-full bg-white border-b border-gray-200 sticky top-0 z-10">
    <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <img src="assets/logo/logo.png" alt="Company Logo" className="h-8 w-auto" />
        <button
          onClick={() => window.history.back()}
          className="text-black text-sm hover:underline"
        >
          ← Back
        </button>
      </div>
      <span className="text-sm font-medium text-black">{title}</span>
      <div className="w-10" />
    </div>
  </header>
);

export default function CheckoutPage({
  appointmentId,
}: {
  appointmentId?: string;
}) {
  const id = appointmentId || "dummy-id";

  const dummyAppointment: Appointment = {
    id,
    datetime: "2025-05-10T10:00:00Z",
    service: "General Checkup",
    user: {
      id: "u1",
      name: "John Doe",
      email: "john@example.com",
    },
    amount: 500,
  };

  const [appointment] = useState(dummyAppointment);
  const [method, setMethod] = useState<"card" | "clinic">("card");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [showOrderSummary, setShowOrderSummary] = useState(true);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    };
    return date.toLocaleDateString("en-US", options);
  };

  const handlePay = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsComplete(true);
    }, 1500);
  };

  if (isComplete) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center">
        <StickyHeader title="Confirmation" />
        <div className="w-full max-w-xl px-6 py-16">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="mb-12 text-center"
          >
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="mx-auto mb-8 w-20 h-20 bg-black rounded-full flex items-center justify-center"
            >
              <Check className="text-white" size={32} />
            </motion.div>
            <h1 className="text-3xl font-medium text-black mb-4">
              Thank you for your order.
            </h1>
            <p className="text-gray-600 text-sm">
              A confirmation has been sent to {appointment.user.email}
            </p>
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-gray-50 rounded-xl overflow-hidden mb-10"
          >
            <div className="border-b border-gray-200 px-6 py-5">
              <h3 className="text-sm font-medium text-black">Order Information</h3>
            </div>
            <div className="px-6 py-5 border-b border-gray-200">
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm text-gray-600">Order Number</span>
                <span className="text-sm text-black font-medium">
                  {appointment.id}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Payment Method</span>
                <span className="text-sm text-black font-medium">
                  {method === "card" ? "Credit Card" : "Pay at Clinic"}
                </span>
              </div>
            </div>
            <div className="px-6 py-5">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="text-sm font-medium text-black">
                    {appointment.service}
                  </h4>
                  <p className="text-xs text-gray-600 mt-1">
                    {formatDate(appointment.datetime)}
                  </p>
                </div>
                <span className="text-sm font-medium text-black">
                  ₹{appointment.amount}
                </span>
              </div>
            </div>
          </motion.div>

          <div className="space-y-4">
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-black text-white text-sm py-4 rounded-xl font-medium flex items-center justify-center"
              onClick={() => (window.location.href = "/appointments")}
            >
              View My Appointments
              <ArrowRight size={16} className="ml-2" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-gray-100 text-black text-sm py-4 rounded-xl font-medium"
              onClick={() => (window.location.href = "/dashboard")}
            >
              Go to Dashboard
            </motion.button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <StickyHeader title="Checkout" />

      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-5 gap-10">
          <div className="md:col-span-3">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-sm mb-8 overflow-hidden"
            >
              <div className="px-6 py-6 border-b border-gray-200">
                <h2 className="text-xl font-medium text-black">Pay with</h2>
              </div>

              <div className="p-6 space-y-5">
                {[
                  {
                    key: "card",
                    label: "Credit or Debit Card",
                    icon: <CreditCard size={16} />,
                  },
                  { key: "clinic", label: "Pay at Clinic" },
                ].map((opt) => (
                  <motion.div
                    key={opt.key}
                    whileTap={{ scale: 0.99 }}
                    className={`flex items-center rounded-xl border-2 px-5 py-4 cursor-pointer ${
                      method === opt.key ? "border-black bg-gray-50" : "border-gray-200"
                    }`}
                    onClick={() => setMethod(opt.key as any)}
                  >
                    <div className="flex-1 flex items-center">
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          method === opt.key ? "border-black" : "border-gray-400"
                        }`}
                      >
                        {method === opt.key && (
                          <div className="w-3 h-3 rounded-full bg-black" />
                        )}
                      </div>
                      <div className="ml-4 flex items-center">
                        {opt.icon && (
                          <div className="bg-black text-white rounded-lg px-3 py-1.5">
                            {opt.icon}
                          </div>
                        )}
                        <span className="ml-3 text-sm font-medium text-black">
                          {opt.label}
                        </span>
                      </div>
                    </div>
                    <ChevronRight size={16} className="text-gray-500" />
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-black text-white py-4 rounded-xl font-medium text-sm flex items-center justify-center"
              onClick={handlePay}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="w-5 h-5 border-2 border-gray-600 border-t-white rounded-full animate-spin"
                />
              ) : (
                <>
                  {method === "card" ? "Pay with Card" : "Confirm at Clinic"}
                  <ArrowRight size={16} className="ml-2" />
                </>
              )}
            </motion.button>
          </div>

          <div className="md:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-xl shadow-sm overflow-hidden mb-6"
            >
              <div
                className="px-6 py-5 border-b border-gray-200 flex items-center justify-between cursor-pointer"
                onClick={() => setShowOrderSummary(!showOrderSummary)}
              >
                <h3 className="text-sm font-medium text-black">Order Summary</h3>
                <ChevronDown
                  size={16}
                  className={`text-gray-500 transition-transform ${
                    showOrderSummary ? "rotate-180" : ""
                  }`}
                />
              </div>
              <motion.div
                initial={false}
                animate={{
                  height: showOrderSummary ? "auto" : 0,
                  opacity: showOrderSummary ? 1 : 0,
                }}
                className="origin-top overflow-hidden"
              >
                <div className="px-6 py-5 border-b border-gray-200">
                  <div className="flex justify-between mb-3">
                    <span className="text-sm text-black">{appointment.service}</span>
                    <span className="text-sm text-black font-medium">
                      ₹{appointment.amount}
                    </span>
                  </div>
                  <div className="text-xs text-gray-600">
                    {formatDate(appointment.datetime)}
                  </div>
                </div>
              </motion.div>
              <div className="px-6 py-5">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-sm font-medium text-black">Total</span>
                  <span className="text-xl font-medium text-black">
                    ₹{appointment.amount}
                  </span>
                </div>
                <div className="mt-4 text-xs text-gray-600">
                  <div className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                    <span>Appointment available</span>
                  </div>
                </div>
              </div>
            </motion.div>

            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
              <h3 className="text-sm font-medium text-black mb-4">Booking Details</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Customer</span>
                  <span className="text-sm text-black">{appointment.user.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Email</span>
                  <span className="text-sm text-black">{appointment.user.email}</span>
                </div>
              </div>
            </div>

            <div className="mt-6 text-xs text-gray-600 px-1">
              <p>
                By completing this purchase, you agree to our{" "}
                <span className="text-black font-medium">Terms of Service</span> and
                acknowledge our{" "}
                <span className="text-black font-medium">Privacy Policy</span>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
