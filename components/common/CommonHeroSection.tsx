import { CommonHeroSectionProps } from "@/types/common";
import React from "react";

const CommonHeroSection: React.FC<CommonHeroSectionProps> = ({
  title,
  subTitle
}) => {
  return (
    <main className="bg-gradient-to-b from-[#1C3455] to-[#1C3455] h-full md:h-[60vh]">
      <div className="max-w-screen-xl mx-auto flex flex-col items-center justify-center">
        <h1 className="text-white text-4xl font-bold">{title}</h1>
        <p className="text-white text-lg">{subTitle}</p>
      </div>
    </main>
  );
};

export default CommonHeroSection;
