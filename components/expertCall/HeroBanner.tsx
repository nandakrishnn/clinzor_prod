"use client";

import Image from "next/image";
import banner from "../../public/ChatGPT Image Feb 8, 2026, 02_24_57 PM.png";

export default function HeroBanner({
  title = "Skip the travel!",
  subtitle = "Consult a Doctor Online",
  priceText = "Starts at just ₹199",
}) {
  const scrollToBooking = () => {
    const bookingSection = document.getElementById("consult-section");
    if (bookingSection) {
      const navbarHeight = 80; // Adjust this based on your navbar height
      const targetPosition = bookingSection.getBoundingClientRect().top + window.pageYOffset - navbarHeight;
      
      window.scrollTo({
        top: targetPosition,
        behavior: "smooth"
      });
    }
  };

  return (
    <section className="relative bg-[#F8E9E6] overflow-hidden w-full">
      {/* Fixed height container to prevent overflow */}
      <div className="relative w-full h-[600px] md:h-[650px]">
        
        {/* Content Container */}
        <div className="relative z-20 max-w-7xl mx-auto px-6 h-full flex items-center">
          {/* LEFT CONTENT */}
          <div className="max-w-xl">
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 leading-tight">
              {title} <br />
              {subtitle}
            </h1>

            <p className="mt-4 text-lg text-slate-600">
              Private consultation · Audio & Video call
            </p>

            <p className="mt-2 text-lg font-semibold text-slate-900">
              {priceText}
            </p>

            <button 
              onClick={scrollToBooking}
              className="mt-8 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
            >
              Consult Now
            </button>
          </div>
        </div>

        {/* RIGHT IMAGE (BACKGROUND STYLE) - Properly contained */}
        <div className="absolute right-0 top-0 bottom-0 w-[65%] hidden lg:block z-0">
          <div className="relative w-full h-full">
            <Image
              src={banner}
              alt="Online consultation"
              priority
              quality={100}
              fill
              className="object-cover object-right"
              sizes="65vw"
            />
          </div>
        </div>

        {/* FADE OVERLAY - Positioned correctly over the image */}
        <div className="absolute right-0 top-0 bottom-0 w-[65%] hidden lg:block z-10 bg-gradient-to-l from-[#F8E9E6]/0 via-[#F8E9E6]/70 to-[#F8E9E6] pointer-events-none" />
        
      </div>
    </section>
  );
}