"use client";
import React from "react";
import { useParams } from "next/navigation";
import AdminClinicDetail from "@/components/admin/clincs/AdminClinicDetail";

export default function AdminClinicDetailPage() {
  const params = useParams();
  const clinicId = params?.id as string;
  return <AdminClinicDetail clinicId={clinicId} />;
} 