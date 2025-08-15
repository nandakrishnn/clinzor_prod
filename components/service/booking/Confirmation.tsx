"use client";

import React from "react";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import { useRouter } from "next/navigation";

export const Confirmation = () => {
  const route = useRouter();
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 text-center">
      {/* Success Icon */}
      <div className="relative mb-6">
        <div className="absolute inset-0 animate-ping bg-green-200 rounded-full"></div>
        <CheckCircleIcon className="w-20 h-20 text-green-500 relative z-10" />
      </div>

      {/* Heading */}
      <h2 className="text-3xl font-bold text-green-600 mb-2">
        Appointment Confirmed!
      </h2>

      {/* Description */}
      <p className="text-gray-600 max-w-md mb-6">
        Your appointment has been successfully booked. We’ve sent you a
        confirmation email with all the details. Thank you for choosing our
        service!
      </p>

      {/* Appointment Details Card */}
      <div className="bg-white shadow-lg rounded-xl p-6 mb-8 w-full max-w-md border">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Booking Summary
        </h3>
        <div className="space-y-2 text-gray-600 text-sm">
          <p>
            <strong>Service:</strong> Cardiologist Consultation
          </p>
          <p>
            <strong>Date:</strong> 20 Aug 2025
          </p>
          <p>
            <strong>Time:</strong> 10:00 AM
          </p>
          <p>
            <strong>Doctor:</strong> Dr. Priya Sharma (Female)
          </p>
          <p>
            <strong>Mode:</strong> Physical Visit
          </p>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-4">
        <a
          href="/"
          className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium shadow-md"
        >
          Go to Home
        </a>
        <a
          href="/booking"
          className="px-6 py-3 bg-primaryColor text-white rounded-lg hover:bg-primaryColor transition font-medium shadow-md"
        >
          Book Another
        </a>
      </div>
    </div>
  );
};
