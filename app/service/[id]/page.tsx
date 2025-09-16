import React from "react";
import FooterSection from "@/components/landingpage/footer/footer";
import CommonHeroSection from "@/components/common/CommonHeroSection";

import { NavbarDemo } from "@/components/landingpage/navbar/navbar";
import Review from "@/components/service/Review";
import ServiceDetailedViewComponents from "@/components/service/ServiceDetailedViewComponents";

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
      <section className="pb-10 md:pb-10">
        <CommonHeroSection className="h-[15vh]" />
      </section>

      {/* Service Detailed && Available Clinic Section  */}
      <section className="max-w-screen-xl mx-auto pb-5 md:pb-10 flex flex-col md:flex-row">
        <ServiceDetailedViewComponents id={params?.id} />
      </section>


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
