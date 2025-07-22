"use client";

import * as React from "react";
import { Box, Button, Typography, Breadcrumbs, Link } from "@mui/joy";
import AdminDashboard from "@/components/admin/dashboard/Main"

export default function AdminOverview() {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      {/* Breadcrumb Navigation */}
      <Box sx={{ display: "flex", alignItems: "center" }}>
      </Box>

      <AdminDashboard/>
      
    </Box>
  );
}
