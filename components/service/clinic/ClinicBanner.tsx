"use client";

import Image from "next/image";
import React from "react";
import Slider from "react-slick";

const ClinicBanner = () => {
  const banners = [
    "/admin.jpg",
    "/banner.png",
    "/blogs.png",
  ];

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

  return (
    <div className="h-[50vh] rounded-xl overflow-hidden">
      <Slider {...settings}>
        {banners.map((src, i) => (
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
