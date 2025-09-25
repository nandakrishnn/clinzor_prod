"use client";

import * as React from "react";
import { Box } from "@mui/joy";
import OrganizationManagement from "@/components/admin/organization/orglist";

export default function ExpertsSlots() {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>

      {/* Table Section */}
      <OrganizationManagement />
    </Box>
  );
}
