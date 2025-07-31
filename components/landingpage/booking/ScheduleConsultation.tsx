"use client";

import { useState } from "react";

const DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const TIME_SLOTS = [
  "09:00 AM",
  "09:30 AM",
  "10:00 AM",
  "10:30 AM",
  "11:00 AM",
  "11:30 AM"
];

export default function ScheduleConsultation() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState("10:00 AM");
  const [weekOffset, setWeekOffset] = useState(0); // each offset = 2 weeks

  const getTwoWeekDates = () => {
    const today = new Date();
    const startDate = new Date(
      today.setDate(today.getDate() + weekOffset * 14)
    );

    return Array.from({ length: 14 }, (_, i) => {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      return date;
    });
  };

  const twoWeekDays = getTwoWeekDates();

  const formatDate = (date: Date) => {
    return date.toISOString().split("T")[0];
  };

  const selectedDateStr = formatDate(selectedDate);

  // Get the current visible month from the middle date
  const midIndex = Math.floor(twoWeekDays.length / 2);
  const currentMonthLabel = twoWeekDays[midIndex].toLocaleString("default", {
    month: "long",
    year: "numeric"
  });

  return (
    <section className="flex flex-col gap-5 px-5 md:px-8 py-10 bg-white rounded-xl shadow-md w-full overflow-hidden">
      <h2 className="text-xl font-bold md:text-center">
        Schedule Your Consultation
      </h2>

      {/* Specialty */}
      <div>
        <label className="block text-gray-500 mb-1">Select Specialty</label>
        <div className="mb-4 font-medium mt-2">Dermatology</div>
      </div>

      {/* Navigation and Month Display */}
      <div className="flex justify-between items-center ">
        <button
          className="text-blueText font-medium"
          onClick={() => setWeekOffset((prev) => prev - 1)}
        >
          ← Previous
        </button>
        <div className="text-gray-800 font-semibold text-sm">
          {currentMonthLabel}
        </div>
        <button
          className="text-blueText font-medium"
          onClick={() => setWeekOffset((prev) => prev + 1)}
        >
          Next →
        </button>
      </div>

      {/* Calendar Grid */}
      <div>
        <label className="block text-gray-500 mb-1">Select a Date</label>

        {/* Days of the week header (fixed 7 items) */}
        <div className="grid grid-cols-7 gap-2 text-sm text-center font-medium text-gray-500 mt-2">
          {DAYS.map((day) => (
            <div key={day}>{day}</div>
          ))}
        </div>

        {/* 14 days as 2-week date picker */}
        <div className="grid grid-cols-7 gap-2 mt-2">
          {twoWeekDays.map((date) => {
            const dateStr = formatDate(date);
            const selected = dateStr === selectedDateStr;

            return (
              <button
                key={dateStr}
                onClick={() => setSelectedDate(date)}
                aria-pressed={selected}
                className={`flex items-center justify-center text-[14px] font-bold p-2 rounded-lg border-2 transition min-h-[42px] ${
                  selected
                    ? "bg-blue-100 border-blueLight text-blueText"
                    : "border-transparent text-gray-700 hover:bg-gray-100"
                }`}
              >
                {date.getDate()}
              </button>
            );
          })}
        </div>
      </div>

      {/* Time Slot Selection */}
      <div>
        <label className="block text-gray-500 mb-1">Select a Time Slot</label>
        <div className="grid grid-cols-3 gap-3 mt-2">
          {TIME_SLOTS.map((slot) => (
            <button
              key={slot}
              className={`py-2 rounded transition border-2 ${
                selectedTime === slot
                  ? "bg-primaryColor text-white border-primaryColor"
                  : "bg-gray-100 text-gray-800 border-transparent hover:bg-blue-100"
              }`}
              onClick={() => setSelectedTime(slot)}
              aria-pressed={selectedTime === slot}
            >
              {slot}
            </button>
          ))}
        </div>
      </div>

      {/* Confirm Button */}
      <button
        className="mt-4 w-full py-3 rounded-md bg-primaryColor text-white text-[16px] font-semibold hover:bg-primaryColor transition"
        onClick={() => {
          alert(`Booked: Dermatology on ${selectedDateStr} at ${selectedTime}`);
        }}
      >
        Confirm Booking
      </button>
    </section>
  );
}
