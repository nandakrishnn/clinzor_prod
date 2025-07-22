"use client";

import * as React from "react";
import { Box, Button, Typography, Breadcrumbs, Link } from "@mui/joy";
import DownloadRoundedIcon from "@mui/icons-material/DownloadRounded";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import UserManagementTable from "@/components/admin/usermanagement/Allusers";
import PendingClinics from "@/components/admin/clincs/PendingClinics";


export default function Usermanagement() {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      {/* Breadcrumb Navigation */}
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Breadcrumbs
          size="sm"
          aria-label="breadcrumbs"
          separator={<ChevronRightRoundedIcon fontSize="small" />}
          sx={{ pl: 0 }}
        >
          <Link underline="none" color="neutral" href="/admin/dashboard">
            <HomeRoundedIcon />
          </Link>
          <Link
            underline="hover"
            color="neutral"
            href="/admin/membermanagement"
            sx={{ fontSize: 12, fontWeight: 500 }}
          >
            Clinic Management
          </Link>
        </Breadcrumbs>
      </Box>

      <PendingClinics />
    </Box>
  );
}
