"use client";

import * as React from "react";
import { Box, Button, Typography, Breadcrumbs, Link } from "@mui/joy";
import DownloadRoundedIcon from "@mui/icons-material/DownloadRounded";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import UserManagementTable from "@/components/admin/usermanagement/Allusers";
import BlockedUsersTable from "@/components/admin/usermanagement/blockedusers";
import AllDoctorsTable from "@/components/admin/doctorslist/doctors";
import SettlementTracker from "@/components/admin/settlementtracker/Tracker";

export default function settlements() {
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
           Blocked Users
          </Link>
        </Breadcrumbs>
      </Box>

      {/* Header Action Row */}
      <Box
        sx={{
          display: "flex",
          gap: 1,
          flexDirection: { xs: "column", sm: "row" },
          alignItems: { xs: "flex-start", sm: "center" },
          justifyContent: "space-between",
          flexWrap: "wrap",
        }}
      >
        <Typography level="h4" fontWeight="lg">
          All Users
        </Typography>
        <Button
          color="primary"
          startDecorator={<DownloadRoundedIcon />}
          size="sm"
        >
          Download PDF
        </Button>
      </Box>

      {/* Table Section */}
      <SettlementTracker />
    </Box>
  );
}
