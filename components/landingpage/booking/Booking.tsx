"use client";

import React from "react";
import ExpertInfoPanel from "./ExpertInfoPanel";
import ScheduleConsultation from "./ScheduleConsultation";

const Booking = () => {
  return (
    <main className="min-h-full flex flex-col-reverse md:flex-row gap-7 md:gap-10 items-center justify-center overflow-hidden ">
       
      <ExpertInfoPanel />
      <ScheduleConsultation />
      <h2 className="text-balance text-2xl text-center  md:hidden  md:text-start md:text-4xl font-bold bg-clip-text">
        Are you confused about which service to choose? We offer a Free Expert Physiotherapy Consultation!
      </h2>
    </main>
  );
};

export default Booking;
