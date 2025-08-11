import React from "react";
import { CommonHeroSectionProps } from "@/types/common";
import { cn } from "@/lib/utils";

const CommonHeroSection: React.FC<CommonHeroSectionProps> = ({
  title,
  subTitle,
  className
}) => {
  return (
    <section className={cn("bg-gradient-to-b from-[#1C3455] to-[#1C3455] text-white h-[40vh] p-5 pb-10 relative",className)}>
      <div className="max-w-screen-xl mx-auto h-full flex flex-col items-center justify-end text-center">
        <h1 className="text-white text-4xl font-bold ">{title}</h1>
        <p className="text-white md:text-lg italic mt-2">{subTitle}</p>
      </div>
    </section>
  );
};

export default CommonHeroSection;
