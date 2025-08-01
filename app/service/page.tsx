import React from "react";
import { NavbarDemo } from "@/components/landingpage/navbar/navbar";

import FooterSection from "@/components/landingpage/footer/footer";
import CommonHeroSection from "@/components/common/CommonHeroSection";
import ServiceListSection from "@/components/service/ServiceListSection";
import WhyChooseUs from "@/components/service/WhyChooseUs";
import WallOfLoveSection from "@/components/landingpage/testimonials/testimonals";
import FAQsTwo from "@/components/landingpage/faq/Faq";

const ServicePage = () => {
  return (
    <main className="min-h-screen bg-gradient-to-b to-white overflow-hidden">
      {/* Nav bar section */}
      <nav>
        <NavbarDemo />
      </nav>

      {/* Hero section */}
      <section className="pb-10 md:pb-20">
        <CommonHeroSection
          title="Our Service"
          subTitle="We offer a wide range of services to our clients"
        />
      </section>

      {/* Service List Section */}
      <section className="pb-10 md:pb-20 max-w-screen-xl mx-auto p-5">
        <ServiceListSection />
      </section>

      {/* why choose us  */}
      <section className="bg-bgLight py-10 md:py-20">
        <div className="max-w-screen-xl mx-auto p-5">
          <WhyChooseUs />
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

      <footer>
        <FooterSection />
      </footer>
    </main>
  );
};

export default ServicePage;
