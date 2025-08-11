import CommonHeroSection from "@/components/common/CommonHeroSection";
import ContactSection from "@/components/contact/ContactSection";
import FooterSection from "@/components/landingpage/footer/footer";
import { NavbarDemo } from "@/components/landingpage/navbar/navbar";
import React from "react";

const ContactUs = () => {
  return (
    <main className="min-h-screen bg-gradient-to-b to-white overflow-hidden">
      {/* Nav bar section */}
      <nav>
        <NavbarDemo />
      </nav>

      {/* Hero section */}
      <section className="">
        <CommonHeroSection
          title="Contact Us"
          subTitle="We’d love to hear from you. Fill out the form below or reach out using
          the contact details."
        />
      </section>

      {/* Main Section */}
      <section className="bg-white  py-10 md:pb-20 sm:px-6">
        <ContactSection />
      </section>

      {/* Footer */}
      <footer>
        <FooterSection />
      </footer>
    </main>
  );
};

export default ContactUs;
