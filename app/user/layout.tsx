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
import CustomerSidebar from "@/components/Customer/appbar/appbar";

// Sidebar component

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <Box sx={{ display: "flex", height: "100dvh", overflow: "hidden" }}>
      <CustomerSidebar />
      <Box
        component="main"
        className="MainContent"
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          minWidth: 0,
          height: "100dvh",
          px: { xs: 2, md: 6 },
          pt: {
            xs: "calc(12px + var(--Header-height))",
            sm: "calc(12px + var(--Header-height))",
            md: 3,
          },
          pb: { xs: 2, sm: 2, md: 3 },
          gap: 1,
          overflow: "auto", // enable scroll inside main content
        }}
      >

        {/* Main Page Content */}
        {children}
      </Box>
    </Box>
  );
}
