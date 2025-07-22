// app/clinics/page.tsx
'use client';

import React from 'react';

import ClinicListing from '@/components/cliniclisting/clinicspage';
import { NavbarDemo } from '@/components/landingpage/navbar/navbar';

export default function ClinicPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white overflow-hidden">
      
      {/* Background SVG Elements */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <svg
          className="absolute top-1/4 -right-56 w-[600px] h-[600px] text-blue-100"
          viewBox="0 0 200 200"
        >
          <circle cx="100" cy="100" r="100" fill="currentColor" />
        </svg>

        <svg
          className="absolute -left-32 top-1/3 w-64 h-64 text-indigo-100 opacity-70"
          viewBox="0 0 100 100"
        >
          <path
            d="M0,50 C20,30 40,70 60,50 C80,30 100,70 120,50"
            stroke="currentColor"
            strokeWidth="12"
            fill="none"
          />
        </svg>

        <div className="absolute inset-0">
          <svg width="100%" height="100%">
            <pattern
              id="dots-pattern"
              x="0"
              y="0"
              width="40"
              height="40"
              patternUnits="userSpaceOnUse"
            >
              <circle cx="2" cy="2" r="1" fill="#BFDBFE" />
            </pattern>
            <rect
              x="0"
              y="0"
              width="100%"
              height="100%"
              fill="url(#dots-pattern)"
            />
          </svg>
        </div>
      </div>

      {/* Navigation */}
      <NavbarDemo />

      <main className="mt-20 relative z-10">
        {/* Standalone clinic listing */}
        <ClinicListing />
      </main>
    </div>
  );
}
