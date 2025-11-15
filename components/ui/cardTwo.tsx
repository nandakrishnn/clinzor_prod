import useLocalStorage from "@/hooks/useLocalStorage.ts";
import { useRouter } from "next/navigation";
import React from "react";

interface CardProps {
  className?: string;
  icon?: React.ReactNode;
  title: string;
  content: string;
  service: any;
}

const CardTwo: React.FC<CardProps> = ({ className, icon, title, content, service }) => {
  const router = useRouter();
  const { setItem } = useLocalStorage()
  const tags = service?.tags?.split(",") || [];

  return (
    <div
      key={service?.uuid}
      className={`group bg-white rounded-2xl shadow-md hover:shadow-2xl overflow-hidden transition-all duration-300 cursor-pointer md:h-[350px] ${className}`}
      onClick={() => {
         setItem("slugId", service?.uuid);
          router.push(`/service/${service?.slug}`)
      }}
    >
      <div className="relative w-full h-48 overflow-hidden">
        <img
          src={service?.image}
          alt={service?.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-60 group-hover:opacity-70 transition-all duration-300"></div>
      </div>

      <div className="p-5 space-y-3">
        <h3 className="text-lg font-semibold text-gray-900 line-clamp-1 capitalize">
          {service?.name}
        </h3>

        <p className="text-sm text-gray-600 line-clamp-2">
          {content}
        </p>

        {/* Tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {tags.slice(0,2)?.map((tag: any, index: any) => (
              <span
                key={index}
                className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full font-medium capitalize"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CardTwo;
