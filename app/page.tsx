"use client";

import ClinicSearch from "@/components/landingpage/clinclistings/clinclisting";
import { NavbarDemo } from "@/components/landingpage/navbar/navbar";
import ServicesWeOffer from "@/components/landingpage/Ourservice/ServicesWeOffer";
import FooterSection from "@/components/landingpage/footer/footer";
import HeroSection from "@/components/landingpage/hero/Hero";
import SearchBar from "@/components/landingpage/searchbar/searchbar";
import LogoCloud from "@/components/landingpage/LogoMarquee.tsx/Logo";
import WallOfLoveSection from "@/components/landingpage/testimonials/testimonals";
import FAQsTwo from "@/components/landingpage/faq/Faq";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white overflow-hidden">
      {/* Decorative Backgrounds */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-50">
        <svg
          className="absolute top-1/4 -right-32 sm:-right-40 w-[400px] h-[400px] md:w-[500px] md:h-[500px] text-blue-100"
          viewBox="0 0 200 200"
          aria-hidden
        >
          <circle cx="100" cy="100" r="100" fill="currentColor" />
        </svg>
        <svg
          className="absolute -left-20 top-1/3 w-56 h-56 text-indigo-100 opacity-70"
          viewBox="0 0 100 100"
          aria-hidden
        >
          <path
            d="M0,50 C20,30 40,70 60,50 C80,30 100,70 120,50"
            stroke="currentColor"
            strokeWidth="12"
            fill="none"
          />
        </svg>
        <div className="absolute inset-0 hidden md:block">
          <svg width="100%" height="100%" aria-hidden>
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
            <rect width="100%" height="100%" fill="url(#dots-pattern)" />
          </svg>
        </div>
      </div>

      {/* Navbar */}
      <NavbarDemo />

      <main className="z-10">
        {/* Hero + Search */}
        <section className="min-h-[70vh] sm:min-h-[80vh] flex flex-col justify-center items-center px-4 pt-20 sm:pt-28 pb-4">
          <HeroSection />
          <SearchBar />
        </section>

        {/* Clinic Listings */}
        <section className="bg-gradient-to-br from-white to-blue-50 px-4 sm:px-6 py-12">
          <LogoCloud />
          <div className="max-w-screen-xl mx-auto">
            <ClinicSearch />
          </div>
        </section>

        {/* Services */}
        <section className="bg-white py-10 sm:py-14 px-4 sm:px-6">
          <div className="max-w-screen-xl mx-auto relative">
            <ServicesWeOffer />
          </div>
        </section>

        {/* Testimonials */}
        <section className="bg-white py-10 sm:py-14 px-4 sm:px-6">
          <div className="max-w-screen-xl mx-auto relative">
            <WallOfLoveSection />
          </div>
        </section>

        {/* FAQs */}
        <section className="bg-white py-10 sm:py-14 px-4 sm:px-6">
          <div className="max-w-screen-xl mx-auto relative">
            <FAQsTwo />
          </div>
        </section>

        {/* Footer */}
        <section className="bg-white pt-6 pb-10 px-4 sm:px-6">
          <div className="max-w-screen-xl mx-auto">
            <FooterSection />
          </div>
        </section>
      </main>
    </div>
  );
}
