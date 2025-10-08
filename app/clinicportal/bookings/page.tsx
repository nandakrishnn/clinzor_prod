"use client";

import * as React from "react";
import { Box } from "@mui/joy";
import BookingManagementTable from "@/components/clinicportal/bookingmanagement/bookingmanagement";

export default function Bookingmanagement() {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <BookingManagementTable />
    </Box>
  );
}
