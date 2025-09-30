"use client";

import * as React from "react";
import { Box } from "@mui/joy";

import DoctorManagement from "@/components/clinicportal/doctormanagement/doctormanagement";


export default function ClinicProfilePage() {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      {/* Table Section */}
      <DoctorManagement />
    </Box>
  );
}
