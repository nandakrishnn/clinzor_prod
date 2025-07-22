"use client";

import * as React from "react";
import { Box, Button, Typography, Breadcrumbs, Link } from "@mui/joy";
import DownloadRoundedIcon from "@mui/icons-material/DownloadRounded";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import UserManagementTable from "@/components/admin/usermanagement/Allusers";
import BlockedUsersTable from "@/components/admin/usermanagement/blockedusers";
import AllDoctorsTable from "@/components/admin/doctorslist/doctors";
import PaymentsTable from "@/components/admin/payments/payments";
import ServiceManagement from "@/components/admin/servicesmanagement/service";
import ClinicServices from "@/components/admin/servicesmanagement/clinicservice";
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
