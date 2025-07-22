"use client";
import dynamicImport from "next/dynamic";
import { Box } from "@mui/joy";

const ClinicSettingsDashboard = dynamicImport(
  () => import("@/components/clinicportal/layout/Profile"),
  { ssr: false }
);

export const dynamic = "force-dynamic";

export default function ClinicProfilePage() {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      {/* Table Section */}
      <ClinicSettingsDashboard />
    </Box>
  );
}
