"use client";

import * as React from "react";
import { Box, Button, Typography, Breadcrumbs, Link } from "@mui/joy";
import DownloadRoundedIcon from "@mui/icons-material/DownloadRounded";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import UserManagementTable from "@/components/admin/usermanagement/Allusers";
import AllClinicsTable from "@/components/admin/clincs/Allclinics";

export default function Usermanagement() {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <AllClinicsTable />
    </Box>
  );
}
