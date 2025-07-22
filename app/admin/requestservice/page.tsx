"use client";

import * as React from "react";
import { Box, Button, Typography, Breadcrumbs, Link } from "@mui/joy";
import ClinicServiceRequests from "@/components/admin/servicesmanagement/requestedservices";

export default function docters() {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      {/* Breadcrumb Navigation */}

      {/* Table Section */}
      <ClinicServiceRequests />
    </Box>
  );
}
