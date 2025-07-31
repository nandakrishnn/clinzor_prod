import { cn } from "@/lib/utils";
import { HealthAndSafety } from "@mui/icons-material";

import { Shield, ShieldEllipsis } from "lucide-react";
import React, { ReactNode } from "react";

interface CardProps {
  className: string;
  icon: ReactNode;
  title: string;
  content: string;
}

const CardTwo: React.FC<CardProps> = ({ className, icon, title, content }) => {
  return (
    <div
      className={cn(
        "rounded-[8px] p-6 pb-10 flex flex-col items-center justify-center",
        className
      )}
    >
      <div className="bg-[#DBEAFE] p-3 rounded-full text-[#033C8D] ">
        {icon}
      </div>
      <div className="text-center">
        <h2 className="font-semibold text-[18px] md:text-[20px] mt-5">{title}</h2>
        <p className="mt-3 text-[#4B5563] text-sm md:text-[16px]">{content}</p>
      </div>
    </div>
  );
};

export default CardTwo;
