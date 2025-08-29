import React from "react";
import { NavbarDemo } from "@/components/landingpage/navbar/navbar";
import { PlatformIntro } from "@/components/aboutus/PlatformIntro";
import { HowItWorks } from "@/components/aboutus/HowItWorks";
import { VideoConsultation } from "@/components/aboutus/VideoConsultation";

import FAQsTwo from "@/components/landingpage/faq/Faq";
import FooterSection from "@/components/landingpage/footer/footer";
import CommonHeroSection from "@/components/common/CommonHeroSection";
import WallOfLoveSection from "@/components/landingpage/testimonials/testimonals";

const AboutPage = () => {
  return (
    <main className="min-h-screen bg-gradient-to-b to-white overflow-hidden">
      {/* Nav bar section */}
      <nav>
        <NavbarDemo />
      </nav>

      {/* Hero section */}
      <section className="">
        <CommonHeroSection className="h-[15vh]"/>
      </section>

      {/* About*/}
      <section className="bg-white pb-10">
        <div className="max-w-screen-[1480px] mx-auto relative ">
          <PlatformIntro />
        </div>
      </section>
      <section className="bg-bgLight pb-10 md:pb-20">
        <div className="max-w-screen-[1480px] mx-auto relative pt-14 mt-12">
          <HowItWorks />
        </div>
      </section>
      <section className="bg-white  py-10 md:pb-20 sm:px-6">
        <div className="max-w-screen-[1480px] mx-auto relative mt-20">
          <VideoConsultation />
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-bgLight py-10 md:pb-20 sm:px-6">
        <div className="max-w-screen-[1480px] mx-auto relative mt-20">
          <WallOfLoveSection />
        </div>
      </section>

      {/* FAQs */}
      <section className="bg-white py-10 md:pb-20 sm:px-6">
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

export default AboutPage;
