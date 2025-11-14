"use client";

import { NavbarDemo } from "@/components/landingpage/navbar/navbar";
import Footer from "@/components/landingpage/footer/footer";
import AuthenticationGateway from "@/components/authentication/login";
import CommonHeroSection from "@/components/common/CommonHeroSection";
import { Suspense } from "react";

export default function AuthenticationPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="min-h-screen flex flex-col bg-white text-black">
        {/* Navbar */}
        <header className="z-50">
          <NavbarDemo />
        </header>

        {/* Hero section */}
        <section className="">
          <CommonHeroSection className="h-[15vh]" />
        </section>

        {/* Main Content */}
        <main className="flex-grow flex items-center justify-center px-4 pb-12">
          <div className="w-full max-w-md">
            <AuthenticationGateway />
          </div>
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </Suspense>
  );
}
