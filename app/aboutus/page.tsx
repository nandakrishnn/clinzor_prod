import CommonHeroSection from "@/components/common/CommonHeroSection";
import FAQsTwo from "@/components/landingpage/faq/Faq";
import FooterSection from "@/components/landingpage/footer/footer";
import { NavbarDemo } from "@/components/landingpage/navbar/navbar";
import WallOfLoveSection from "@/components/landingpage/testimonials/testimonals";
import React from "react";

const AboutPage = () => {
  return (
    <main className="min-h-screen bg-gradient-to-b to-white overflow-hidden">
      {/* Nav bar section */}
      <nav>
        <NavbarDemo />
      </nav>

      {/* Hero section */}
      <section className="pb-10 md:pb-20">
        <CommonHeroSection
          title="About Us"
          subTitle="We offer a wide range of services to our clients"
        />
      </section>

      {/* Testimonials */}
      <section className="bg-white py-10 sm:py-14 sm:px-6">
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

      <footer>
        <FooterSection />
      </footer>
    </main>
  );
};

export default AboutPage;
