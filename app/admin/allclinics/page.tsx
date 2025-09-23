"use client";

import * as React from "react";
import { Box } from "@mui/joy";
import AllClinicsTable from "@/components/admin/clincs/Allclinics";

export default function Usermanagement() {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <AllClinicsTable />
    </Box>
  );
}
