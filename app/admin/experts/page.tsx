"use client";

import * as React from "react";
import { Box } from "@mui/joy";

import ExpertSlotsTable from "@/components/admin/expertslotsmangement/SlotsManagementExperts";

export default function ExpertsSlots() {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      {/* Table Section */}
      <ExpertSlotsTable />
    </Box>
  );
}
