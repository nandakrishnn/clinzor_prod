import CommonHeroSection from "@/components/common/CommonHeroSection";
import FooterSection from "@/components/landingpage/footer/footer";
import { NavbarDemo } from "@/components/landingpage/navbar/navbar";
import BookingPage from "@/components/service/booking/BookingPage";
import ClinicDetailedView from "@/components/service/booking/ClinicDetailedView";
import Carousal from "@/components/service/clinicDetailed/Carousal";
import ClinicCarousal from "@/components/service/clinicDetailed/ClinicCarousal";
import React from "react";

const ServiceBooking = () => {
  return (
    <div>
      {/* Nav bar section */}
      <nav>
        <NavbarDemo />
      </nav>

      {/* Hero section */}
      <section className="pb-10 md:pb-16">
        <CommonHeroSection className="h-[15vh]" />
      </section>

       
      <section className="max-w-screen-xl mx-auto pb-5">
        <ClinicCarousal />
      </section>

      <section className="">
        <ClinicDetailedView />
      </section>

      {/* Available Clinic Section */}
      <section className="max-w-screen-xl mx-auto pb-10 md:pb-20">
        <BookingPage />
      </section>

      {/* Footer */}
      <section>
        <FooterSection />
      </section>
    </div>
  );
};

export default ServiceBooking;
