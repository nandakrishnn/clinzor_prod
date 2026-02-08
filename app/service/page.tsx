import type { Metadata } from "next";
import React from "react";
import { NavbarDemo } from "@/components/landingpage/navbar/navbar";

import FooterSection from "@/components/landingpage/footer/footer";
import CommonHeroSection from "@/components/common/CommonHeroSection";
import ServiceListSection from "@/components/service/ServiceListSection";
import WhyChooseUs from "@/components/service/WhyChooseUs";
import Booking from "@/components/landingpage/booking/Booking";
import WallOfLoveSection from "@/components/landingpage/testimonials/testimonals";
import FAQsTwo from "@/components/landingpage/faq/Faq";

export const metadata: Metadata = {
  title: "Clinzor Services | Physiotherapy, Clinic Visits & Home Care",
  description: "Explore our wide range of healthcare services, including specialized physiotherapy, instant clinic bookings, and qualified home healthcare visits.",
  keywords: "physiotherapy services, clinic booking, home healthcare, physical therapy, Clinzor services",
};

const ServicePage = () => {
  return (
    <main className="min-h-screen bg-gradient-to-b to-white overflow-hidden">
      {/* Nav bar section */}
      <nav>
        <NavbarDemo />
      </nav>

      {/* Hero section */}
      <section className="pb-10 md:pb-16">
        <CommonHeroSection className="h-[15vh]" />
      </section>

      {/* Service List Section */}
      <section className="pb-10 md:pb-20 max-w-screen-xl mx-auto p-5">
        <ServiceListSection />
      </section>

      {/* why choose us  */}
      <section className="bg-gray-50 py-10 md:py-20">
        <div className="max-w-screen-xl mx-auto p-5">
          <WhyChooseUs />
        </div>
      </section>

      {/* <section className="bg-white py-10 md:py-20 px-4 sm:px-6">
        <div className="max-w-screen-xl mx-auto relative overflow-hidden ">
          <Booking />
        </div>
      </section> */}

      {/* Testimonials */}
      <section className="bg-white py-10 sm:py-14 sm:px-6">
        <div className="max-w-screen-[1480px] mx-auto relative my-20">
          <WallOfLoveSection />
        </div>
      </section>

      {/* FAQs */}
      <section className="bg-gray-50 py-10 sm:py-14 sm:px-6">
        <div className="max-w-screen-xl mx-auto relative mt-20">
          <FAQsTwo />
        </div>
      </section>

      <footer>
        <FooterSection />
      </footer>
    </main>
  );
};

export default ServicePage;
