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
      className={`group bg-white rounded-2xl shadow-md hover:shadow-2xl overflow-hidden transition-all duration-300 cursor-pointer h-[380px] flex flex-col ${className}`}
      onClick={() => {
         setItem(service?.slug, service?.uuid);
          router.push(`/service/${service?.slug}`)
      }}
    >
      <div className="relative w-full h-48 overflow-hidden flex-shrink-0">
        <img
          src={service?.image}
          alt={service?.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-60 group-hover:opacity-70 transition-all duration-300"></div>
      </div>

      <div className="p-5 flex flex-col flex-grow">
        <h3 className="text-lg font-semibold text-gray-900 line-clamp-1 capitalize mb-2">
          {service?.name}
        </h3>

        <p className="text-sm text-gray-600 line-clamp-2 mb-3">
          {content}
        </p>

        {/* Tags - Fixed height container */}
        <div className="mt-auto pt-2">
          {tags.length > 0 ? (
            <div className="flex flex-wrap gap-2 items-start">
              {tags.slice(0, 2)?.map((tag: any, index: any) => (
                <span
                  key={index}
                  className="px-3 py-1.5 bg-blue-50 text-blue-700 text-xs rounded-full font-medium capitalize whitespace-nowrap"
                  title={tag.trim()}
                >
                  {tag.trim()}
                </span>
              ))}
            </div>
          ) : (
            <div className="h-[32px]"></div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CardTwo;