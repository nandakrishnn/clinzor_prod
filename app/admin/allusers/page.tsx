"use client";

import * as React from "react";
import { Box } from "@mui/joy";
import AllUsersPage from "@/components/admin/usermanagement/Allusers";

export default function Allusers() {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      {/* Breadcrumb Navigation */}
      <AllUsersPage />
    </Box>
  );
}
