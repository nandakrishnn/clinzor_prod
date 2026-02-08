"use client";

import React from "react";
import ExpertInfoPanel from "./ExpertInfoPanel";
import ScheduleConsultation from "./ScheduleConsultation";

const Booking = () => {
  return (
    <main className="min-h-full flex flex-col md:flex-row gap-7 md:gap-10 items-center justify-center overflow-hidden ">
      <ExpertInfoPanel />
      <ScheduleConsultation />
    </main>
  );
};

export default Booking;
