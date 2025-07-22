"use client";

import * as React from "react";
import { Box, Button, Typography, Breadcrumbs, Link } from "@mui/joy";
import BookingManagement from "@/components/expert/BookingManagement/BookingManagment";
import AllUsersPage from "@/components/admin/usermanagement/Allusers";

export default function Allusers() {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      {/* Breadcrumb Navigation */}
      <AllUsersPage />
    </Box>
  );
}
