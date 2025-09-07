"use client";

import { NavbarDemo } from "@/components/landingpage/navbar/navbar";
import ServicesWeOffer from "@/components/landingpage/Ourservice/ServicesWeOffer";
import FooterSection from "@/components/landingpage/footer/footer";
import HeroSection from "@/components/landingpage/hero/Hero";
import SearchBar from "@/components/landingpage/searchbar/searchbar";
import WallOfLoveSection from "@/components/landingpage/testimonials/testimonals";
import FAQsTwo from "@/components/landingpage/faq/Faq";
import Booking from "@/components/landingpage/booking/Booking";
import Offers from "@/components/landingpage/offers/Offers";
import Camp from "@/components/landingpage/camp/Camp";
import BlogComponent from "@/components/blog/BlogComponent";
import FloatingBanner from "@/components/FloatingBanner";
import { useSession } from "next-auth/react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b  to-white overflow-hidden">
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
        <section className="bg-white py-10 sm:py-14 mb-20 sm:px-6">
          <div className="max-w-screen-[1480px] mx-auto relative mt-16 md:mt-8">
            <ServicesWeOffer />
          </div>
        </section>

        {/* Offers */}
        <section className="bg-gray-50 py-5 sm:py-14 pb-28 px-4 sm:px-6">
          <div className="max-w-screen-xl mx-auto relative mt-16 md:mt-10 overflow-hidden">
            <Offers />
          </div>
        </section>

        {/* Camp */}
        <section className="bg-white py-5 sm:py-14 pb-28 px-4 sm:px-6">
          <div className="max-w-screen-xl mx-auto relative mt-16 md:mt-10 overflow-hidden">
            <Camp />
          </div>
        </section>

        {/* Dummy Booking */}
        <section className="bg-gray-50 py-5 sm:py-14 pb-28 px-4 sm:px-6">
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

        {/* Blogs */}
        <section className="bg-gray-50 py-10 sm:py-14 sm:px-6">
          <div className="max-w-screen-xl mx-auto relative my-10">
            <BlogComponent />
          </div>
        </section>

        {/* FAQs */}
        <section className="bg-white py-10 sm:py-14 sm:px-6">
          <div className="max-w-screen-xl mx-auto relative mt-20">
            <FAQsTwo />
          </div>
        </section>

        {/* Footer */}
        <section>
          <FooterSection />
        </section>
      </main>

      <FloatingBanner />
    </div>
  );
}
