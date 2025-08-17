"use client";

import Image from "next/image";
import React from "react";

interface BookingTypeSelectorProps {
  bookingType: "physical" | "online" | "home" | null;
  setBookingType: (type: "physical" | "online" | "home" | null) => void;
  preferFemaleDoctor: boolean;
  setPreferFemaleDoctor: (value: boolean) => void;
}

const data = [
  {
    id: 1,
    name: "Physical Visit",
    type: "physical",
    image: "#AFCFED",
    description: "Book the nearest clinic."
  },
  {
    id: 2,
    name: "Online Consultation",
    type: "online",
    image: "#98CBD6",
    description: "Connect within 60sec"
  },
  {
    id: 3,
    name: "Home Visit",
    type: "home",
    image: "#D5D8FC",
    description: "Book to reach your home"
  }
];

export const BookingTypeSelector: React.FC<BookingTypeSelectorProps> = ({
  bookingType,
  setBookingType,
  preferFemaleDoctor,
  setPreferFemaleDoctor
}) => {
  return (
    <div className="mb-8 font-">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        Select Booking Type
      </h2>
      <div className="flex flex-col md:flex-row gap-4">
        {data.map((item) => (
          <div
            key={item.id}
            onClick={() =>
              setBookingType(item.type as "physical" | "online" | "home")
            }
            className="rounded-2xl shadow-xl overflow-hidden w-full md:w-[190px] h-[280px] cursor-pointer group"
          >
            <div
              style={{ backgroundColor: item.image }}
              className="h-[60%] relative overflow-hidden"
            >
              {/* <Image
                src={"/admin.jpg"}
                alt="image"
                className=""
                width={500}
                height={500}
              /> */}
            </div>
            <div className="h-[45%] w-full p-5">
              <h2 className="text-18 md:text-[108x] font-bold capitalize">
                {item.name}
              </h2>
              <p className="text-[13px]">Connect within 60sec</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 md:mt-6 flex items-center">
        <input
          type="checkbox"
          id="preferFemaleDoctor"
          checked={preferFemaleDoctor}
          onChange={() => setPreferFemaleDoctor(!preferFemaleDoctor)}
          className="mr-2"
        />
        <label htmlFor="preferFemaleDoctor" className="text-gray-700 text-sm">
          Prefer Female Doctor
        </label>
      </div>
    </div>
  );
};
