"use client";

import * as React from "react";
import { Box } from "@mui/joy";
import ServicesListView from "@/components/clinicportal/servicemanagement/servicelist";

export default function ClinicProfilePage() {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      {/* Table Section */}
      <ServicesListView />
    </Box>
  );
}
