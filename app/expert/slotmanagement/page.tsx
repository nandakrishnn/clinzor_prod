"use client";

import * as React from "react";
import { Box } from "@mui/joy";
import ExpertSlotManagement from "@/components/expert/Slotmanagement/Slotmanagement";

export default function Slotmanagement() {
  return (
    <Box sx={{ display: "flex", flexDirection: "column" }}>

      {/* Table Section */}
      <ExpertSlotManagement />
    </Box>
  );
}
