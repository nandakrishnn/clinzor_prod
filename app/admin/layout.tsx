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
import AdminSidebar from "@/components/admin/Sidebar";
import { AdminProvider } from "../Providers";

// Sidebar component
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
   <AdminProvider>

  
    <Box sx={{ display: "flex", height: "100dvh", overflow: "hidden" }} >
      <AdminSidebar />
      <Box
        component="main"
        className="MainContent p-5"
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          minWidth: 0,
          height: "100dvh",
          gap: 1,
          overflow: "auto", // enable scroll inside main content
          zIndex: 10, // ensure main content is above sidebar or overlays
        }}
      >

        {/* Main Page Content */}
        {children}
      </Box>
    </Box>
    </AdminProvider>
    </>
  );
}
