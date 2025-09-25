"use client";

import * as React from "react";
import { Box } from "@mui/joy";
import DueManagement from "@/components/admin/dues/dueslist";

export default function dues() {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      {/* Table Section */}
      <DueManagement />
    </Box>
  );
}
