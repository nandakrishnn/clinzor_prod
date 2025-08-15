"use client";

import React from "react";

interface TimeSlotSelectorProps {
  timeSlots: string[];
  selectedSlot: string | null;
  setSelectedSlot: (slot: string) => void;
}

export const TimeSlotSelector: React.FC<TimeSlotSelectorProps> = ({
  timeSlots,
  selectedSlot,
  setSelectedSlot
}) => {
  return (
    <div className="mb-8 md:mt-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        Select Time Slot
      </h2>
      <div className="flex flex-wrap gap-4">
        {timeSlots.map((slot) => (
          <button
            key={slot}
            className={`px-4 py-2 rounded-lg border ${
              selectedSlot === slot
                ? "bg-primaryColor text-white"
                : "bg-white text-gray-800"
            }`}
            onClick={() => setSelectedSlot(slot)}
          >
            {slot}
          </button>
        ))}
      </div>
    </div>
  );
};
