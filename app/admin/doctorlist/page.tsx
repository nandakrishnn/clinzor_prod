"use client";

import * as React from "react";
import { Box, Button, Typography, Breadcrumbs, Link } from "@mui/joy";
import DownloadRoundedIcon from "@mui/icons-material/DownloadRounded";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import UserManagementTable from "@/components/admin/usermanagement/Allusers";
import BlockedUsersTable from "@/components/admin/usermanagement/blockedusers";
import AllDoctorsTable from "@/components/admin/doctorslist/doctors";
import DoctorApprovalApp from "@/components/admin/doctorsmanagment/Doctorslist";

export default function docters() {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      {/* Breadcrumb Navigation */}



      {/* Table Section */}
      <DoctorApprovalApp />
    </Box>
  );
}
