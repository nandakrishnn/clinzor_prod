import type { Metadata } from "next";
import CommonHeroSection from "@/components/common/CommonHeroSection";
import ContactSection from "@/components/contact/ContactSection";
import FooterSection from "@/components/landingpage/footer/footer";
import { NavbarDemo } from "@/components/landingpage/navbar/navbar";
import React from "react";

export const metadata: Metadata = {
  title: "Contact Clinzor | Get in Touch for Support & Inquiries",
  description: "Have questions about our services or need help booking an appointment? Contact the Clinzor team today for assistance with your healthcare needs.",
  keywords: "contact clinzor, healthcare support, clinic inquiries, patient assistance",
};

const ContactUs = () => {
  return (
    <main className="min-h-screen bg-gradient-to-b to-white overflow-hidden">
      {/* Nav bar section */}
      <nav>
        <NavbarDemo />
      </nav>

      {/* Hero section */}
      <section className="">
        <CommonHeroSection className="h-[15vh]" />
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
