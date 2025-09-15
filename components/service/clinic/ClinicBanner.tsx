"use client";

import Image from "next/image";
import React, { useState, useEffect } from "react";
import Slider from "react-slick";

const ClinicBanner = ({ images }: { images: string[] | null }) => {
  const [loading, setLoading] = useState(true);

  // Ensure we always have at least one image
  const bannerImages =
    images && images.length > 0 ? images : ["/clinic.png"];

  useEffect(() => {
    // Fake small delay for skeleton (better UX)
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const settings = {
    dots: true,
    infinite: true,
    autoplay: true,
    speed: 800,
    autoplaySpeed: 3000,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
  };

  if (loading) {
    return (
      <div className="h-[50vh] rounded-xl overflow-hidden animate-pulse bg-gray-200 flex items-center justify-center">
        <div className="w-3/4 h-3/4 bg-gray-300 rounded-xl" />
      </div>
    );
  }

  return (
    <div className="h-[50vh] rounded-xl overflow-hidden">
      <Slider {...settings}>
        {bannerImages.map((src, i) => (
          <div key={i} className="h-[50vh]">
            <Image
              src={src}
              alt={`Banner ${i + 1}`}
              width={1920}
              height={1080}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default ClinicBanner;
