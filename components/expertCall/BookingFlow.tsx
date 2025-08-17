"use client";
import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  Check,
  Clock,
  User,
  Mail,
  Phone
} from "lucide-react";
import { format } from "date-fns";
import { CustomCalendar } from "../ui/calender";
import Image from "next/image";
import Title from "../ui/title";

const BookingFlow = () => {
  const [step, setStep] = useState<number>(1);
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    phone: ""
  });

  const availableTimeSlots = [
    "08:00 AM",
    "09:00 AM",
    "10:00 AM",
    "11:00 AM",
    "12:00 PM",
    "01:00 PM",
    "02:00 PM",
    "03:00 PM",
    "04:00 PM",
    "05:00 PM",
    "06:00 PM"
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Booking submitted:", { date, selectedTime, userData });
    setStep(4);
  };

  return (
    <div className="">
      <div className="mb-10 md:mb-16">
        <Title
          title="Expert Booking"
          description={"Book Your Expert Calls!"}
          subtitle={`Get the guidance you need from professionals who've been where you are.`}
        />
      </div>
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-8 px-4">
        {/* Progress indicator - added to show booking progress */}
        <div className="hidden md:block w-64">
          <div className="sticky top-24 ">
            <div className="space-y-2">
              {[1, 2, 3].map((stepNumber) => (
                <div
                  key={stepNumber}
                  className={`flex items-center space-x-3 p-3 rounded-lg ${
                    step === stepNumber
                      ? "bg-blue-50 border-l-4 border-primaryColor"
                      : "text-gray-500"
                  }`}
                >
                  <div
                    className={`flex items-center justify-center w-6 h-6 rounded-full ${
                      step === stepNumber
                        ? "bg-primaryColor text-white"
                        : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {stepNumber}
                  </div>
                  <span
                    className={
                      step === stepNumber ? "font-medium" : "font-normal"
                    }
                  >
                    {stepNumber === 1 && "Personal Info"}
                    {stepNumber === 2 && "Date & Time"}
                    {stepNumber === 3 && "Confirmation"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 w-full">
          {/* Step 1: Personal Information */}
          {step === 1 && (
            <div className="p-6 flex gap-5">
              <div className="w-full hidden md:block">
                <div className="h-full min-w-[200px] bg-[#AFCFED] rounded-xl"></div>
                {/* <Image
                  src={"/dummy/experbanner.webp"}
                  alt=""
                  width={500}
                  height={500}
                  className="w-full h-fit object-cover rounded-xl"
                /> */}
              </div>
              <div className="space-y-4 w-full">
                <h2 className="text-lg font-semibold text-gray-900">
                  Personal Information
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type="text"
                        name="name"
                        value={userData.name}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:bg-none text-sm"
                        placeholder="Enter your full name"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type="email"
                        name="email"
                        value={userData.email}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:bg-none text-sm "
                        placeholder="Enter your email"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type="tel"
                        name="phone"
                        value={userData.phone}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-md focus:bg-none focus:outline-none text-sm "
                        placeholder="Enter your phone number"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <Button
                    onClick={() => setStep(2)}
                    disabled={
                      !userData.name || !userData.email || !userData.phone
                    }
                    className="bg-primaryColor hover:bg-primaryColor text-white px-6 py-2"
                  >
                    Next <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Date & Time Selection - Combined View */}
          {step === 2 && (
            <div className="flex flex-col lg:flex-row">
              {/* Left Sidebar - Time Slots - Hidden on mobile as requested */}
              <div className="hidden lg:block lg:w-72 border-r border-gray-200 p-4 lg:p-6">
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Select Slot
                  </h3>
                  <p className="text-sm text-gray-600">
                    Select date and time slot for your appointment.
                  </p>
                </div>

                <div className="space-y-2">
                  {availableTimeSlots.map((time) => (
                    <button
                      key={time}
                      onClick={() => setSelectedTime(time)}
                      className={`w-full flex items-center justify-between p-3 rounded-md border transition-all ${
                        selectedTime === time
                          ? "bg-blue-50 border-blue-200 text-primaryColor"
                          : "bg-white border-gray-200 hover:bg-gray-50 text-gray-700"
                      }`}
                    >
                      <div className="flex items-center">
                        <Clock
                          className={`h-4 w-4 mr-3  ${
                            selectedTime === time
                              ? "text-primaryColor"
                              : "text-gray-400"
                          }`}
                        />
                        <span className="font-medium">{time}</span>
                      </div>
                      {selectedTime === time && (
                        <Check className="h-4 w-4 text-primaryColor" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Right Side - Calendar */}
              <div className="flex-1 p-4 lg:p-6">
                {/* <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    {date ? format(date, "MMMM yyyy") : "Select Date"}
                  </h3>
                </div> */}

                <CustomCalendar
                  selectedDate={date}
                  onSelect={(selectedDate) => {
                    setDate(selectedDate);
                  }}
                />

                {/* Selected Time Slots Display */}
                {date && (
                  <div className="mt-6">
                    <h4 className="text-sm font-medium text-gray-700 mb-3">
                      Available times for {format(date, "EEEE, MMMM do")}
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                      {availableTimeSlots.map((time) => (
                        <button
                          key={time}
                          onClick={() => setSelectedTime(time)}
                          className={`p-2 text-xs sm:text-sm rounded border transition-all ${
                            selectedTime === time
                              ? "bg-primaryColor text-white border-primaryColor"
                              : "bg-white border-gray-200 hover:bg-gray-50 text-gray-700"
                          }`}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex flex-col sm:flex-row justify-between gap-3 sm:gap-0 mt-8">
                  <Button
                    variant="outline"
                    onClick={() => setStep(1)}
                    className="px-6 py-2 order-2 sm:order-1"
                  >
                    <ChevronLeft className="mr-2 h-4 w-4" /> Back
                  </Button>
                  <div className="flex flex-col sm:flex-row gap-2 order-1 sm:order-2">
                    <Button
                      variant="outline"
                      className="px-6 py-2 bg-transparent"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={() => setStep(3)}
                      disabled={!date || !selectedTime}
                      className="bg-primaryColor hover:bg-primaryColor text-white px-6 py-2"
                    >
                      Next <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Confirmation */}
          {step === 3 && (
            <div className="p-6 flex gap-5">
              <div className="w-full hidden md:block">
                <div className="h-full min-w-[200px] bg-[#D5D8FC] rounded-xl"></div>
              </div>
              <div className="w-full ">
                <h2 className="text-lg font-semibold text-gray-900 mb-3">
                  Confirm Booking
                </h2>

                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <h3 className="font-medium text-gray-900 mb-4">
                    Booking Details
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Name:</span>
                      <span className="text-gray-900">{userData.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Email:</span>
                      <span className="text-gray-900">{userData.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Phone:</span>
                      <span className="text-gray-900">{userData.phone}</span>
                    </div>
                    <hr className="my-2" />
                    <div className="flex justify-between">
                      <span className="text-gray-600">Date:</span>
                      <span className="text-gray-900">
                        {date && format(date, "EEEE, MMMM do, yyyy")}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Time:</span>
                      <span className="text-gray-900">{selectedTime}</span>
                    </div>
                  </div>
                </div>

                <form onSubmit={handleSubmit}>
                  <div className="flex justify-between">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setStep(2)}
                      className="px-6 py-2"
                    >
                      <ChevronLeft className="mr-2 h-4 w-4" /> Back
                    </Button>
                    <Button
                      type="submit"
                      className="bg-primaryColor hover:bg-primaryColor text-white px-6 py-2"
                    >
                      Confirm Booking
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Step 4: Success */}
          {step === 4 && (
            <div className="p-6 text-center flex gap-5">
              <div className="w-full hidden md:block">
                <div className="h-full min-w-[200px] bg-[#98CBD6] rounded-xl"></div>
              </div>
              <div className="max-w-md mx-auto">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                  <Check className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Booking Confirmed!
                </h3>
                <p className="text-gray-600 mb-6">
                  Your appointment is scheduled for{" "}
                  {date && format(date, "MMMM do")} at {selectedTime}.
                  Confirmation sent to {userData.email}.
                </p>
                <Button
                  onClick={() => {
                    setStep(1);
                    setUserData({ name: "", email: "", phone: "" });
                    setDate(new Date());
                    setSelectedTime(null);
                  }}
                  className="bg-primaryColor text-white px-6 py-2"
                >
                  Book Another
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingFlow;
