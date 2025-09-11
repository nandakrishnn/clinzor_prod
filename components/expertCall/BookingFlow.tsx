"use client";
import type React from "react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  Check,
  Clock,
  User,
  Mail,
  Phone,
  Calendar,
  Users
} from "lucide-react";
import { format, addDays } from "date-fns";
import { CustomCalendar } from "../ui/calender";
import Image from "next/image";
import Title from "../ui/title";
import { useSession } from "next-auth/react";
import { getAllExpertService, getExpertSlotBookingService, getExpertSlotService } from "@/service/user/expert";

// Types for API responses
interface Expert {
  uuid: string;
  name: string;
  phone_number: string;
  profile_url: string | null;
}

interface SlotDetail {
  uuid: string;
  start_time: string;
  end_time: string;
  is_booked: boolean;
}

interface SlotData {
  slot_date: string;
  slot_details: SlotDetail[];
}

interface BookingResponse {
  uuid: string;
  customer_meeting_link: string;
  start_time: string;
  end_time: string;
}

const BookingFlow = () => {
  const [step, setStep] = useState<number>(1);
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedTime, setSelectedTime] = useState<SlotDetail | null>(null);
  const [selectedExpert, setSelectedExpert] = useState<Expert | null>(null);
  const [experts, setExperts] = useState<Expert[]>([]);
  const [slots, setSlots] = useState<SlotData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<any>();

  // get session user data
  const { data: session } = useSession()

  // User State 
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    phone: ""
  });

  // user data from session on component mount
  useEffect(() => {
    setUserData({
      name: session?.user?.name || "",
      email: session?.user?.email || "",
      phone: session?.user?.phone_number || ""
    });
  }, [session]);

  // Fetch experts list
  useEffect(() => {
    const fetchExperts = async () => {
      try {
        setLoading(true);
        const data = await getAllExpertService();

        if (data.status === 200) {
          setExperts(data?.data?.data);
        } else {
          setError("Failed to load experts");
        }
      } catch (err: any) {
        setError(err?.response?.data[0] || "Failed to connect to server");
        console.error("Error fetching experts:", err);
      } finally {
        setLoading(false);
      }
    };

    if (step === 2) {
      fetchExperts();
    }
  }, [step]);

  // Fetch available slots when expert is selected and date changes
  useEffect(() => {
    const fetchSlots = async () => {
      if (!selectedExpert || !date) return;

      try {
        setLoading(true);
        const fromDate = new Date(date);
        const toDate = addDays(date, 7); // Get slots for next 7 days

        const data = await getExpertSlotService(selectedExpert.uuid, fromDate.toISOString(), toDate.toISOString());

        console.log(data, 'available data')

        if (data.status === 200) {
          setSlots(data.data);
        } else {
          setError("Failed to load available slots");
        }
      } catch (err: any) {
        setError(err?.response?.data[0] || "Failed to connect to server");
        console.error("Error fetching slots:", err);
      } finally {
        setLoading(false);
      }
    };

    if (selectedExpert && date && step === 2) {
      fetchSlots();
    }
  }, [selectedExpert, date, step]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  const handleExpertSelect = (expert: Expert) => {
    setSelectedExpert(expert);
  };

  const handleTimeSelect = (slot: SlotDetail) => {
    setSelectedTime(slot);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedTime) {
      setError("Please select a time slot");
      return;
    }

    try {
      setLoading(true);
      const data = await getExpertSlotBookingService(selectedTime.uuid);

      if (data.status === 200) {
        console.log("Booking successful:", data.data);
        setStep(4);
      } else {
        setError(data.message || "Booking failed");
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to complete booking");
      console.error("Booking error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Get available time slots for selected date
  const getTimeSlotsForDate = (selectedDate: Date | undefined) => {
    if (!selectedDate || !slots.length) return [];

    const dateString = format(selectedDate, 'yyyy-MM-dd');
    const slotData = slots.find(slot => slot.slot_date === dateString);

    return slotData ? slotData.slot_details.filter(slot => !slot.is_booked) : [];
  };

  const availableTimeSlots = getTimeSlotsForDate(date);

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
        {/* Progress indicator */}
        <div className="hidden md:block w-64">
          <div className="sticky top-24 ">
            <div className="space-y-2">
              {[1, 2, 3].map((stepNumber, index) => (
                <div
                  key={index}
                  className={`flex items-center space-x-3 p-3 rounded-lg ${step === stepNumber
                    ? "bg-blue-50 border-l-4 border-primaryColor"
                    : "text-gray-500"
                    }`}
                >
                  <div
                    className={`flex items-center justify-center w-6 h-6 rounded-full ${step === stepNumber
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
                    {stepNumber === 2 && "Select Expert"}
                    {stepNumber === 3 && "Confirmation"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 w-full">
          {/* Error message */}
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Step 1: Personal Information */}
          {step === 1 && (
            <div className="p-6 flex gap-5">
              <div className="w-full hidden md:block">
                <div className="h-full min-w-[200px] bg-[#AFCFED] rounded-xl"></div>
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

          {/* Step 2: Expert Selection & Date/Time */}
          {step === 2 && (
            <div className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">
                Select Expert & Time
              </h2>

              {/* Expert Selection */}
              <div className="mb-8">
                <h3 className="text-md font-medium text-gray-700 mb-4 flex items-center">
                  <Users className="mr-2 h-5 w-5" /> Select an Expert
                </h3>

                {loading ? (
                  <div className="flex justify-center py-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primaryColor"></div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {experts.map((expert) => (
                      <div
                        key={expert?.uuid}
                        className={`border rounded-lg p-4 cursor-pointer transition-all ${selectedExpert?.uuid === expert.uuid
                          ? "border-primaryColor bg-blue-50"
                          : "border-gray-200 hover:border-gray-300"
                          }`}
                        onClick={() => handleExpertSelect(expert)}
                      >
                        <div className="flex items-center">
                          <div className="h-12 w-12 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                            {expert?.profile_url ? (

                              <img src={"/clinic.png"} alt={expert?.name} className="w-full h-full object-cover rounded-full" />
                            ) : (
                              <User className="h-6 w-6 text-gray-400" />
                            )}
                          </div>
                          <div>
                            <h4 className="font-medium">{expert?.name}</h4>
                            <p className="text-sm text-gray-500">{expert?.phone_number}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Date and Time Selection - Only show if expert is selected */}
              {selectedExpert && (
                <>
                  <hr className="my-6" />

                  <h3 className="text-md font-medium text-gray-700 mb-4 flex items-center">
                    <Calendar className="mr-2 h-5 w-5" /> Select Date & Time
                  </h3>

                  <div className="flex flex-col lg:flex-row gap-6">
                    <div className="lg:w-1/2">
                      <CustomCalendar
                        selectedDate={date}
                        onSelect={(selectedDate) => {
                          setDate(selectedDate);
                          setSelectedTime(null);
                        }}
                      />
                    </div>

                    <div className="lg:w-1/2">
                      {/* Selected Time Slots Display */}
                      {date && (
                        <div className="">
                          <h4 className="text-sm font-medium text-gray-700 mb-3">
                            Available times for {format(date, "EEEE, MMMM do")}
                          </h4>

                          {loading ? (
                            <div className="flex justify-center py-4">
                              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primaryColor"></div>
                            </div>
                          ) : availableTimeSlots.length > 0 ? (
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                              {availableTimeSlots.map((slot,index) => (
                                <button
                                  key={slot?.uuid}
                                  onClick={() => handleTimeSelect(slot)}
                                  className={`p-2 text-xs sm:text-sm rounded border transition-all ${selectedTime?.uuid === slot.uuid
                                    ? "bg-primaryColor text-white border-primaryColor"
                                    : "bg-white border-gray-200 hover:bg-gray-50 text-gray-700"
                                    }`}
                                >
                                  {format(new Date(slot.start_time), "hh:mm a")}
                                </button>
                              ))}
                            </div>
                          ) : (
                            <p className="text-gray-500 text-sm py-4">
                              No available slots for this date. Please select another date.
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </>
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
                    disabled={!selectedExpert || !date || !selectedTime}
                    className="bg-primaryColor hover:bg-primaryColor text-white px-6 py-2"
                  >
                    Next <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Confirmation */}
          {step === 3 && selectedExpert && (
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
                      <span className="text-gray-600">Expert:</span>
                      <span className="text-gray-900">{selectedExpert.name}</span>
                    </div>
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
                      <span className="text-gray-900">
                        {selectedTime && format(new Date(selectedTime.start_time), "hh:mm a")}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Duration:</span>
                      <span className="text-gray-900">
                        {selectedTime &&
                          `${(new Date(selectedTime.end_time).getTime() -
                            new Date(selectedTime.start_time).getTime()) / (1000 * 60)
                          } minutes`
                        }
                      </span>
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
                      disabled={loading}
                      className="bg-primaryColor hover:bg-primaryColor text-white px-6 py-2"
                    >
                      {loading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Processing...
                        </>
                      ) : (
                        "Confirm Booking"
                      )}
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
                  Your appointment with {selectedExpert?.name} is scheduled for{" "}
                  {date && format(date, "MMMM do")} at{" "}
                  {selectedTime && format(new Date(selectedTime.start_time), "hh:mm a")}.
                  Confirmation sent to {userData.email}.
                </p>
                <Button
                  onClick={() => {
                    setStep(1);
                    setSelectedExpert(null);
                    setDate(new Date());
                    setSelectedTime(null);
                    setError(null);
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