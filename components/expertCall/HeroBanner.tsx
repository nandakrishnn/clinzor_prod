"use client";

import Image from "next/image";
import banner from "../../public/ChatGPT Image Feb 8, 2026, 02_24_57 PM.png";

export default function HeroBanner({
  title = "Skip the travel!",
  subtitle = "Consult a Doctor Online",
  priceText = "Starts at just ₹199",
}) {
  const scrollToBooking = () => {
    document
      .getElementById("consult-section")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative w-full h-[420px] sm:h-full overflow-hidden">

      {/* BACKGROUND IMAGE */}
      <Image
        src={banner}
        alt="Online doctor consultation"
        fill
        priority
        quality={100}
        className="object-cover object-right"
        sizes="100vw"
      />

      {/* GRADIENT OVERLAY (for text readability) */}
      {/* <div className="absolute inset-0 bg-gradient-to-r from-white/90 via-white/70 to-white/0" /> */}

      {/* CONTENT */}
      <div className="relative z-10 max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex items-center">
        <div className="max-w-xl text-center lg:text-left">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 leading-tight">
            {title}
            <br />
            {subtitle}
          </h1>

          <p className="mt-4 text-sm sm:text-base md:text-lg text-slate-600">
            Private consultation · Audio & Video call
          </p>

          <p className="mt-2 text-sm sm:text-base md:text-lg font-semibold text-slate-900">
            {priceText}
          </p>

          <button
            onClick={scrollToBooking}
            className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl text-sm sm:text-base font-semibold shadow-lg transition"
          >
            Consult Now
          </button>
        </div>
      </div>
    </section>
  );
}
