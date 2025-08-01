import React from "react";
import { NavbarDemo } from "@/components/landingpage/navbar/navbar";

import FooterSection from "@/components/landingpage/footer/footer";
import CommonHeroSection from "@/components/common/CommonHeroSection";
import ServiceListSection from "@/components/service/ServiceListSection";

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

      <footer>
        <FooterSection />
      </footer>
    </main>
  );
};

export default ServicePage;
