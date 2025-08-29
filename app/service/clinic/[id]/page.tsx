import CommonHeroSection from "@/components/common/CommonHeroSection";
import FooterSection from "@/components/landingpage/footer/footer";
import { NavbarDemo } from "@/components/landingpage/navbar/navbar";
import ClinicDetailed from "@/components/service/clinic/ClinicDetailed";
import React from "react";

const ServiceBooking = () => {
  return (
    <div>
      {/* Nav bar section */}
      <nav>
        <NavbarDemo />
      </nav>

      {/* Hero section */}
      <section className="pb-10">
        <CommonHeroSection className="h-[15vh]" />
      </section>

      <section>
        <ClinicDetailed />
      </section>

      {/* Footer */}
      <section>
        <FooterSection />
      </section>
    </div>
  );
};

export default ServiceBooking;
