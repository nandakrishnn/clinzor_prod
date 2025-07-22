"use client";

import * as React from "react";
import { Box, Button, Typography, Breadcrumbs, Link } from "@mui/joy";
import OrganizationManagement from "@/components/admin/organization/orglist";

export default function ExpertsSlots() {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      {/* Breadcrumb Navigation */}

      {/* Table Section */}
      <OrganizationManagement />
    </Box>
  );
}
