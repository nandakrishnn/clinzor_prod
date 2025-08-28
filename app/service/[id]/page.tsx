import React from "react";
import ServiceDetailed from "@/components/service/ServiceDetailed";
import FooterSection from "@/components/landingpage/footer/footer";
import AvailableClinics from "@/components/service/AvailableClinics";
import CommonHeroSection from "@/components/common/CommonHeroSection";

import { NavbarDemo } from "@/components/landingpage/navbar/navbar";
import Review from "@/components/service/Review";

type ServiceDetailPageProps = {
  params: { id: string }
}

const ServiceDetailPage = ({ params }: ServiceDetailPageProps) => {
  return (
    <main className="">
      {/* Nav bar section */}
      <nav>
        <NavbarDemo />
      </nav>

      {/* Hero section */}
      <section className="pb-10 md:pb-16">
        <CommonHeroSection className="h-[15vh]" />
      </section>

      {/* Service Detailed */}
      <section className="max-w-screen-xl mx-auto pb-5 md:pb-20">
        <ServiceDetailed id={params?.id} />
      </section>

      {/* Available Clinic Section */}
      <div className="w-full bg-gray-50">
        <section className="max-w-screen-xl mx-auto py-10 md:py-20">
          <AvailableClinics id={params?.id} />
        </section>
      </div>

      {/* Review Part */}
      {/* <main className="max-w-screen-xl mx-auto py-10 md:py-20">
        <Review />
      </main> */}

      {/* Footer */}
      <section>
        <FooterSection />
      </section>
    </main>
  );
};

export default ServiceDetailPage;
