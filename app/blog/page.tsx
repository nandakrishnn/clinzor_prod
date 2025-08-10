"use client";

import { NavbarDemo } from "@/components/landingpage/navbar/navbar";

import Footer from "@/components/landingpage/footer/footer";
import Blogs from "@/components/blog/blog";
import CommonHeroSection from "@/components/common/CommonHeroSection";
import FAQsTwo from "@/components/landingpage/faq/Faq";

export default function BlogPage() {
  return (
    <div className="min-h-screen ">
      <NavbarDemo />

      {/* Hero section */}
      <section className="pb-10 ">
        <CommonHeroSection
          title="Blogs"
          subTitle="We offer a wide range of services to our clients"
        />
      </section>

      <main className="relative z-10">
        <section className="w-full flex flex-col justify-center items-center text-center px-4">
          <Blogs />
        </section>
      </main>

      {/* FAQs */}
      <section className="bg-bgLight py-10 sm:py-14 sm:px-6">
        <div className="max-w-screen-xl mx-auto relative mt-20">
          <FAQsTwo />
        </div>
      </section>

      <Footer />
    </div>
  );
}
