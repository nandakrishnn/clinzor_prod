"use client";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { BookingTypeSelector } from "./BookingTypeSelector";
import { ServiceDetailsCard } from "./ServiceDetailsCard";
import { Calendar } from "./Calendar";
import { TimeSlotSelector } from "./SlotSelector.tsx";
import { DoctorSelector } from "./DoctorSelector";
import { Confirmation } from "./Confirmation";

const BookingPage = () => {
  const router = useRouter();
  const [bookingType, setBookingType] = useState<
    "physical" | "online" | "home" | null
  >(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [preferFemaleDoctor, setPreferFemaleDoctor] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Sample data
  const serviceDetails = {
    title: "Cardiologist Consultation",
    description:
      "Comprehensive heart health consultation with certified cardiologists. Includes detailed analysis, personalized treatment plans, and follow-up recommendations.Comprehensive heart health consultation with certified cardiologists. Includes detailed analysis, personalized treatment plans, and follow-up recommendations.",
    duration: "30 mins",
    price: "₹800",
    rating: "4.2 (428 reviews)"
  };

  const timeSlots = [
    "09:00 AM",
    "10:30 AM",
    "12:00 PM",
    "02:00 PM",
    "03:30 PM",
    "05:00 PM"
  ];

  const doctors = [
    {
      id: 1,
      name: "Dr. Rajesh Kumar",
      gender: "male",
      specialization: "Cardiology",
      experience: "12 years"
    },
    {
      id: 2,
      name: "Dr. Priya Sharma",
      gender: "female",
      specialization: "Cardiology",
      experience: "8 years"
    },
    {
      id: 3,
      name: "Dr. Amit Patel",
      gender: "male",
      specialization: "Cardiology",
      experience: "15 years"
    }
  ];

  const handleDateSelect = (date: Date) => {
    if (date.getMonth() !== currentMonth.getMonth()) return;
    setSelectedDate(date.toISOString().split("T")[0]);
    setSelectedSlot(null);
  };

  const changeMonth = (increment: number) => {
    setCurrentMonth(
      new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth() + increment,
        1
      )
    );
  };

  const handleBookAppointment = () => {
    setShowConfirmation(true);
  };

  return (
    <div className="p-4 md:p-6 Connect within 60sec max-w-7xl mx-auto">
      <div className="w-full">
        {!showConfirmation ? (
          <>
            {/* <h1 className="text-3xl font-bold text-gray-800 mb-8">
              Book Appointment
            </h1> */}

            <BookingTypeSelector
              bookingType={bookingType}
              setBookingType={setBookingType}
              preferFemaleDoctor={preferFemaleDoctor}
              setPreferFemaleDoctor={setPreferFemaleDoctor}
            />

            {bookingType && (
              <>
                <h2 className="text-2xl font-bold text-gray-800 mb-4 md:pt-4">
                  Service Details
                </h2>
                <div className="flex gap-5 flex-col md:flex-row">
                  <Calendar
                    currentMonth={currentMonth}
                    selectedDate={selectedDate}
                    changeMonth={changeMonth}
                    handleDateSelect={handleDateSelect}
                  />
                  <ServiceDetailsCard {...serviceDetails} />
                </div>

                {selectedDate && (
                  <TimeSlotSelector
                    timeSlots={timeSlots}
                    selectedSlot={selectedSlot}
                    setSelectedSlot={setSelectedSlot}
                  />
                )}
                {selectedSlot && (
                  <DoctorSelector
                    doctors={doctors}
                    preferFemaleDoctor={preferFemaleDoctor}
                  />
                )}

                {selectedSlot && (
                  <button
                    className="w-full md:w-auto px-6 py-3 bg-primaryColor text-white rounded-full hover:bg-blue-900 font-medium text-md"
                    onClick={handleBookAppointment}
                  >
                    Book Appointment Now
                  </button>
                )}
              </>
            )}
          </>
        ) : (
          <Confirmation />
        )}
      </div>
    </div>
  );
};

export default BookingPage;
