"use client";
import React from "react";
import MetaPixel from "../connect-with-us/_components/MetaPixel";
import ExpertHeroSection from "@/components/expertCall/ExpertHeroSection";
import FAQSection from "@/components/expertCall/FAQSection";
import PricingSection from "@/components/expertCall/PricingSection";
import FooterSection from "@/components/landingpage/footer/footer";
import BookingFlow from "@/components/expertCall/BookingFlow";
import WallOfLoveSection from "@/components/landingpage/testimonials/testimonals";
import ExpertBenefits from "@/components/expertCall/ExpertBenefits";
import { HowItWorks } from "@/components/aboutus/HowItWorks";
import { NavbarDemo } from "@/components/landingpage/navbar/navbar";
import CommonHeroSection from "@/components/common/CommonHeroSection";
import Booking from "@/components/landingpage/booking/Booking";
import FAQsTwo from "@/components/landingpage/faq/Faq";
import HeroBanner from "@/components/expertCall/HeroBanner";

const ExpertCall = () => {
  return (
    <main className="min-h-screen bg-gradient-to-b to-white ">
      <MetaPixel />
      <nav>
        {/* Navbar */}
        <NavbarDemo />
      </nav>
      {/* Hero section */}
      <section className="">
        <CommonHeroSection className="h-[15vh]" />
      </section>
      
      <section >
          <main className="h-fit md:h-[70vh] overflow-hidden">
          <HeroBanner/>
          </main>
          </section>
    


     

       <section className="py-16 bg-white" id="consult-section">
        <BookingFlow />
      </section>

      <section className="py-16 bg-gray-50" >
        <ExpertBenefits />
      </section>

     

      <section className="py-16  bg-gray-50">
        <WallOfLoveSection />
      </section>

      {/* <section className="py-16 bg-white">
        <PricingSection />
      </section> */}

      {/* <section className="py-16 bg-gray-50">
        <FAQSection />
      </section> */}
      <section className="bg-white py-10 sm:py-14 sm:px-6">
        <div className="max-w-screen-xl mx-auto relative mt-5">
          <FAQsTwo />
        </div>
      </section>

      <footer>
        <FooterSection />
      </footer>


    </main>
  );
};

export default ExpertCall;
