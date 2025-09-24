"use client";

import * as React from "react";
import { Box } from "@mui/joy";
import BookingDashboard from "@/components/admin/bookingmanagement/PatientBookings";



export default function blockedUsers() {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <BookingDashboard />
    </Box>
  );
}
