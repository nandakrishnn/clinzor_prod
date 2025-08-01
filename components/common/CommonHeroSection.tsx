import React from "react";
import { CommonHeroSectionProps } from "@/types/common";

const CommonHeroSection: React.FC<CommonHeroSectionProps> = ({
  title,
  subTitle
}) => {
  return (
    <section className="bg-gradient-to-b from-[#1C3455] to-[#1C3455] text-white h-full md:h-[70vh]">
      <div className="max-w-screen-xl mx-auto flex flex-col items-center justify-center  h-full">
        <h1 className="text-white text-4xl font-bold">{title}</h1>
        <p className="text-white text-lg italic mt-2">{subTitle}</p>
      </div>
    </section>
  );
};

export default CommonHeroSection;
