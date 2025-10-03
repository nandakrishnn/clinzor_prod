"use client";

import * as React from "react";
import Box from "@mui/joy/Box";

// Icons
import ClinzorSidebar from "@/components/clinicportal/layout/clinicsidebar";
import { ClinicProvider } from "../Providers";

// Sidebar component

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
    <ClinicProvider>
    <Box sx={{ display: "flex", height: "100dvh", overflow: { xs: "auto", md: "hidden" } }}>
      <ClinzorSidebar />
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
    </ClinicProvider>
    </>
  );
}
