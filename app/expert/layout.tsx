"use client";

import * as React from "react";
import Box from "@mui/joy/Box";
import Button from "@mui/joy/Button";
import Breadcrumbs from "@mui/joy/Breadcrumbs";
import Link from "@mui/joy/Link";
import Typography from "@mui/joy/Typography";

// Icons
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import DownloadRoundedIcon from "@mui/icons-material/DownloadRounded";
import Sidebar from "@/components/admin/Sidebar";
import ExpertSidebar from "@/components/expert/Expertlayout";

// Sidebar component

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <Box sx={{ display: "flex", height: "100dvh", overflow: "hidden" }}>
      <ExpertSidebar />
      <Box
        component="main"
        className="MainContent"
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          minWidth: 0,
          height: "100dvh",
          overflow: "auto", 
        }}
      >

        {/* Main Page Content */}
        {children}
      </Box>
    </Box>
  );
}
