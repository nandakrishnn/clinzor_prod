import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import React, { ReactNode } from "react";

interface CardProps {
  className?: string;
  icon?: ReactNode;
  title: string;
  content: string;
  service: any;
}

const CardTwo: React.FC<CardProps> = ({ className, icon, title, content, service }) => {
  const router = useRouter()
  return (
    <div
      className={cn(
        "rounded-[8px] h-[220px] p-6 pb-10 flex flex-col cursor-pointer items-center justify-center bg-[#F2F5FF] shadow",
        className
      )}
      onClick={() => router.push(`/service/${service?.uuid}`)}
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
