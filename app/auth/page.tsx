"use client";

import { NavbarDemo } from "@/components/landingpage/navbar/navbar";
import Footer from "@/components/landingpage/footer/footer";
import AuthenticationGateway from "@/components/authentication/login";

export default function AuthenticationPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white text-black">
      {/* Navbar */}
      <header className="z-50">
        <NavbarDemo />
      </header>


      {/* Main Content */}
      <main className="flex-grow flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <AuthenticationGateway />
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}