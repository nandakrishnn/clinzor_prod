"use client";

import { NavbarDemo } from "@/components/landingpage/navbar/navbar";
import FooterSection from "@/components/landingpage/footer/footer";

import Footer from "@/components/landingpage/footer/footer";
import BlogTiles from "@/components/blog/blog";

export default function BlogPage() {
  return (
    <div className="min-h-screen ">
      <NavbarDemo />

      <main className="mt-20 relative z-10">
        <section className="w-full flex flex-col justify-center items-center text-center px-4">
          <BlogTiles />
        </section>

      </main>

      <Footer />
    </div>
  );
}
