"use client";
import React from "react";
import ExpertHeroSection from "@/components/expertCall/ExpertHeroSection";
import Navbar from "@/components/shared/NavBar";
import FAQSection from "@/components/expertCall/FAQSection";
import PricingSection from "@/components/expertCall/PricingSection";
import FooterSection from "@/components/landingpage/footer/footer";
import BookingFlow from "@/components/expertCall/BookingFlow";
import WallOfLoveSection from "@/components/landingpage/testimonials/testimonals";
import ExpertBenefits from "@/components/expertCall/ExpertBenefits";
import { HowItWorks } from "@/components/aboutus/HowItWorks";

const ExpertCall = () => {
  return (
    <main className="min-h-screen bg-gradient-to-b to-white ">
      <nav>
        <Navbar />
      </nav>

      <section className="pb-10 md:pb-16">
        <ExpertHeroSection />
      </section>

      <section className="pb-16 ">
        <HowItWorks />
      </section>

      <section className="py-16 bg-gray-50" >
        <ExpertBenefits />
      </section>

      <section className="py-16 bg-white" id="booking">
        <BookingFlow />
      </section>

      <section className="py-16  bg-gray-50">
        <WallOfLoveSection />
      </section>

      <section className="py-16 bg-white">
        <PricingSection />
      </section>

      <section className="py-16 bg-gray-50">
        <FAQSection />
      </section>

      <footer>
        <FooterSection />
      </footer>
    </main>
  );
};

export default ExpertCall;
