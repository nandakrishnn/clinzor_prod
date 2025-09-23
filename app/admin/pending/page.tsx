"use client";

import * as React from "react";
import { Box } from "@mui/joy";
import PendingApprovalPage from "@/components/admin/clincs/PendingClinics";

export default function docters() {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>

      {/* Table Section */}
      <PendingApprovalPage />
    </Box>
  );
}
