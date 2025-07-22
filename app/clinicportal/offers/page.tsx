"use client";

import * as React from "react";
import { Box, Button, Typography, Breadcrumbs, Link } from "@mui/joy";
import SlotManagementView from "@/components/clinicportal/slotmanagement/slotmanagement";
import ClinicOffersManager from "@/components/clinicportal/offermanagement/offersmanagement";

export default function ClinicProfilePage() {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      {/* Breadcrumb Navigation */}
      <Box sx={{ display: "flex", alignItems: "center" }}>
      </Box>

      {/* Table Section */}
      <ClinicOffersManager />
    </Box>
  );
}
