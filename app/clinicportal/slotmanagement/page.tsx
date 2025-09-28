"use client";

import * as React from "react";
import { Box} from "@mui/joy";
import SlotManagementView from "@/components/clinicportal/slotmanagement/slotmanagement";

export default function ClinicProfilePage() {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>

      {/* Table Section */}
      <SlotManagementView />
    </Box>
  );
}
