"use client";

import * as React from "react";
import { Box} from "@mui/joy";
import CampManagement from "@/components/admin/camps/campmanagement";

export default function docters() {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      {/* Breadcrumb Navigation */}

      {/* Table Section */}
      <CampManagement />
    </Box>
  );
}
