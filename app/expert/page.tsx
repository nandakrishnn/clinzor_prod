"use client";

import * as React from "react";
import { Box } from "@mui/joy";
import ExpertBookingManager from "@/components/expert/BookingManagement/BookingManagment";

export default function Slotmanagement() {
  return (
    <Box sx={{ display: "flex", flexDirection: "column" }}>

      {/* Table Section */}
      <ExpertBookingManager />
    </Box>
  );
}
