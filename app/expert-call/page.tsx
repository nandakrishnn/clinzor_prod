import React from "react";
import { NavbarDemo } from "@/components/landingpage/navbar/navbar";
import ExpertHeroSection from "@/components/expertCall/ExpertHeroSection";
import Navbar from "@/components/shared/NavBar";

const ExpertCall = () => {
  return (
    <main className="min-h-screen bg-gradient-to-b to-white overflow-hidden">
      <nav>
        <Navbar />
      </nav>

      <section className="pb-10 md:pb-16">
        <ExpertHeroSection />
      </section>
    </main>
  );
};

export default ExpertCall;
