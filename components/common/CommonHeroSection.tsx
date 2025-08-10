import React from "react";
import { CommonHeroSectionProps } from "@/types/common";

const CommonHeroSection: React.FC<CommonHeroSectionProps> = ({
  title,
  subTitle
}) => {
  return (
    <section className="bg-gradient-to-b from-[#1C3455] to-[#1C3455] text-white h-[40vh] p-5 pb-10 relative">
      <div className="max-w-screen-xl mx-auto h-full flex flex-col items-center justify-end">
        <h1 className="text-white text-4xl font-bold ">{title}</h1>
        <p className="text-white md:text-lg italic mt-2">{subTitle}</p>
      </div>
    </section>
  );
};

export default CommonHeroSection;
