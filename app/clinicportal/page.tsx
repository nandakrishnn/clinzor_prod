"use client";

import * as React from "react";
import { Box, Button, Typography, Breadcrumbs, Link } from "@mui/joy";
import Dashboard from "@/components/clinicportal/dashboard/Maingrid";


export default function ClinicProfilePage() {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      {/* Breadcrumb Navigation */}
      {/* Table Section */}
      <Dashboard />
    </Box>
  );
}
