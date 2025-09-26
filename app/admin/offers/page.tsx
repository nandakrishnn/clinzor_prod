"use client";

import * as React from "react";
import { Box} from "@mui/joy";
import OfferManagementTable from "@/components/admin/offers/offerslist";

export default function docters() {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      {/* Table Section */}
      <OfferManagementTable />
    </Box>
  );
}
