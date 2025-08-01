"use client";

import { NavbarDemo } from "@/components/landingpage/navbar/navbar";
import ServicesWeOffer from "@/components/landingpage/Ourservice/ServicesWeOffer";
import FooterSection from "@/components/landingpage/footer/footer";
import HeroSection from "@/components/landingpage/hero/Hero";
import SearchBar from "@/components/landingpage/searchbar/searchbar";
import WallOfLoveSection from "@/components/landingpage/testimonials/testimonals";
import FAQsTwo from "@/components/landingpage/faq/Faq";
import Booking from "@/components/landingpage/booking/Booking";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b  to-white overflow-hidden">
      {/* Decorative Backgrounds */}
      {/* <div className="fixed inset-0 pointer-events-none z-0 opacity-50">
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
      </div> */}
      {/* Navbar */}
      <NavbarDemo />

      <main className="z-10">
        {/* Hero + Search */}
        <section className="sm:min-h-[120vh] relative flex flex-col items-center ">
          <div className="min-h-[70vh] sm:min-h-[95vh] w-full flex flex-col justify-center items-center px-4 pt-20 pb-4 bg-gradient-to-t from-[#3A68AA] to-[#1C3455]">
            <HeroSection />
          </div>
          <div className="md:max-w-screen-6xl mx-auto md:absolute md:bottom-10 bg-white md:p-5 pt-5 md:pt-8 rounded-2xl">
            <SearchBar />
          </div>
        </section>

        {/* Services */}
        <section className="bg-white py-10 sm:py-14 mb-20  sm:px-6">
          <div className="max-w-screen-[1480px] mx-auto relative mt-16 md:mt-8">
            <ServicesWeOffer />
          </div>
        </section>

        {/* Dummy Booking */}
        <section className="bg-bgLight py-5 sm:py-14 pb-28 px-4 sm:px-6">
          <div className="max-w-screen-xl mx-auto relative mt-16 md:mt-10 overflow-hidden">
            <Booking />
          </div>
        </section>

        {/* Testimonials */}
        <section className="bg-white py-10 sm:py-14  sm:px-6">
          <div className="max-w-screen-[1480px] mx-auto relative my-20">
            <WallOfLoveSection />
          </div>
        </section>

        {/* FAQs */}
        <section className="bg-bgLight py-10 sm:py-14 sm:px-6">
          <div className="max-w-screen-xl mx-auto relative mt-20">
            <FAQsTwo />
          </div>
        </section>

        {/* Footer */}
        <section>
          <FooterSection />
        </section>
      </main>
    </div>
  );
}
