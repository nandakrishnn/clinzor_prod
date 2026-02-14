"use client";

import Image from "next/image";
import banner from "../../public/ChatGPT Image Feb 8, 2026, 02_24_57 PM.png";

export default function HeroBanner({
  title = "Skip the travel!",
  subtitle = "Consult an Expert Online",
  priceText = "Begin your journey at ₹0",
}) {
  const scrollToBooking = () => {
    const element = document.getElementById("consult-section");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative w-full h-[450px] sm:h-[500px] md:h-[550px] lg:h-[600px] overflow-hidden">
      {/* BACKGROUND IMAGE */}
      <Image
        src={banner}
        alt="Online doctor consultation"
        fill
        priority
        quality={100}
        className="object-cover object-center sm:object-right"
        sizes="100vw"
      />

      {/* CONTENT */}
      <div className="relative z-10 max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex items-center">
        <div className="w-full sm:max-w-xl  sm:bg-transparent p-6 sm:p-0 rounded-2xl sm:rounded-none ">
          <h1 className="text-3xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 leading-tight">
            {title}
            <br />
            {subtitle}
          </h1>

          <p className="mt-3 sm:mt-4 text-base sm:text-base md:text-lg text-slate-600">
            Private consultation · Audio & Video call
          </p>

          <p className="mt-2 text-base sm:text-base md:text-lg font-semibold text-slate-900">
            {priceText}
          </p>

          <button
            onClick={scrollToBooking}
            className="mt-5 sm:mt-6 w-full sm:w-auto bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white px-8 py-3 rounded-xl text-base font-semibold shadow-lg transition-colors"
          >
            Consult Now
          </button>
        </div>
      </div>
    </section>
  );
}