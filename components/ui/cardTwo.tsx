import { cn } from "@/lib/utils";
import React, { ReactNode } from "react";

interface CardProps {
  className?: string;
  icon?: ReactNode;
  title: string;
  content: string;
}

const CardTwo: React.FC<CardProps> = ({ className, icon, title, content }) => {
  return (
    <div
      className={cn(
        "rounded-[8px] h-[220px] p-6 pb-10 flex flex-col items-center justify-center ",
        className
      )}
      style={{
        boxShadow: "4px 0px 6px -2px rgba(0,0,0,0.1), -4px 0px 6px -2px rgba(0,0,0,0.1)",
      }}
    >
      <div className="bg-[#DBEAFE] p-3 rounded-full text-[#033C8D] ">
        {icon}
      </div>
      <div className="text-center">
        <h2 className="font-semibold text-[18px] md:text-[20px] mt-5">
          {title}
        </h2>
        <p className="mt-3 text-[#4B5563] text-sm md:text-[15px] md:leading-6 line-clamp-2 capitalize">{content}</p>
      </div>
    </div>
  );
};

export default CardTwo;
