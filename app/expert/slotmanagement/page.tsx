"use client";

import * as React from "react";
import { Box, Button, Typography, Breadcrumbs, Link } from "@mui/joy";
import ExpertSlotManagement from "@/components/expert/Slotmanagement/Slotmanagement";

export default function Slotmanagement() {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      {/* Breadcrumb Navigation */}
      <Box sx={{ display: "flex", alignItems: "center" }}>
      </Box>

      {/* Table Section */}
      <ExpertSlotManagement />
    </Box>
  );
}
