import CommonHeroSection from "@/components/common/CommonHeroSection";
import FooterSection from "@/components/landingpage/footer/footer";
import { NavbarDemo } from "@/components/landingpage/navbar/navbar";
import ClinicDetailed from "@/components/service/clinic/ClinicDetailed";
import ReviewSection from "@/components/service/Review";
import React from "react";

type ServiceClinicBookingProps = {
  params: { id: string }
}

const ServiceBooking = ({ params }: ServiceClinicBookingProps) => {
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
        <ClinicDetailed id={params.id} />
      </section>

      {/* Review Part */}
      <main className="max-w-screen-xl mx-auto mb-10 md:mb-20">
        <ReviewSection id={params.id} />
      </main>

      {/* Footer */}
      <section>
        <FooterSection />
      </section>
    </div>
  );
};

export default ServiceBooking;
