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
import { CustomerProvider } from "../Providers";

// Sidebar component

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <CustomerProvider>

    <main>
        {/* Main Page Content */}
          {children}
        
    </main>
    </CustomerProvider>
  );
}
