"use client";

import * as React from "react";
import { Box } from "@mui/joy";
import ServiceManagement from "@/components/admin/servicesmanagement/service";

export default function docters() {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      {/* Table Section */}
      <ServiceManagement />
    </Box>
  );
}
