"use client";

import * as React from "react";
import { Box } from "@mui/joy";
import DuesManagement from "@/components/clinicportal/dues/duesmanagement";

export default function ClinicProfilePage() {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      {/* Table Section */}
      <DuesManagement />
    </Box>
  );
}
