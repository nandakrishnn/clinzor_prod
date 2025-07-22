"use client";

import * as React from "react";
import { Box, Button, Typography, Breadcrumbs, Link } from "@mui/joy";
import DuesManagement from "@/components/clinicportal/dues/duesmanagement";

export default function ClinicProfilePage() {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      {/* Breadcrumb Navigation */}
      <Box sx={{ display: "flex", alignItems: "center" }}>
      </Box>

      {/* Table Section */}
      <DuesManagement />
    </Box>
  );
}
