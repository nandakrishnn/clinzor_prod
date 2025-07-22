"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { TextEffect } from "./text-effect";
import { AnimatedGroup } from "./animated-group";
import { useEffect, useState } from "react";

// Animation variants
const transitionVariants = {
  item: {
    hidden: { opacity: 0, y: 12 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", bounce: 0.1, duration: 0.01 },
    },
  },
};

export default function HeroSection() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  return (
    <div className="relative  overflow-hidden px-4 sm:px-6 lg:px-8 py-10 sm:py-14 lg:py-20">
      {/* Animated background circles */}
      {mounted && (
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 hidden lg:block opacity-30 pointer-events-none"
        >
          <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-blue-100 rounded-full blur-3xl" />
          <div className="absolute bottom-1/3 right-1/3 w-56 h-56 bg-green-50 rounded-full blur-2xl" />
        </div>
      )}

      {/* Content Container */}
      <div className="mx-auto max-w-screen-xl text-center flex flex-col items-center gap-6">
        {/* CTA Link */}
        <AnimatedGroup variants={transitionVariants}>
          <Link
            href="#search"
            className="group inline-flex items-center gap-2 rounded-full border border-gray-200 px-4 py-1.5 text-sm font-medium hover:bg-gray-50 transition-colors"
            aria-label="Jump to search section"
          >
            <span>Search Clinics Near You</span>
            <div className="flex overflow-hidden rounded-full bg-blue-900 p-1 group-hover:bg-blue-800 transition-colors">
              <ArrowRight
                size={14}
                className="text-white transform transition-transform group-hover:translate-x-0.5"
              />
            </div>
          </Link>
        </AnimatedGroup>

        {/* Heading */}
        <TextEffect
          preset="fade-in-blur"
          speedSegment={1.5}
          delay={0}
          as="h1"
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 tracking-tight"
        >
          Discover Trusted Healthcare Providers
        </TextEffect>

        {/* Subtitle */}
        <TextEffect
          preset="fade-in-blur"
          speedSegment={1.5}
          delay={0.05}
          as="p"
          className="max-w-2xl text-sm sm:text-base md:text-lg text-gray-600"
        >
          Instantly find clinics, book telehealth consultations, or schedule
          home visits with top specialists in your area.
        </TextEffect>

        {/* Search Bar */}
      
         

      </div>
    </div>
  );
}
