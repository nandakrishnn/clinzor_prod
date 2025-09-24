"use client";

import * as React from "react";
import { Box } from "@mui/joy";
import PaymentRecordsDashboard from "@/components/admin/bookingmanagement/paymentrecords";

export default function docters() {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      {/* Table Section */}
      <PaymentRecordsDashboard />
    </Box>
  );
}
