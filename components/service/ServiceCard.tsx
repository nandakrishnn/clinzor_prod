import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

type ServiceCardProps = {
  uuid: string;
  name: string;
  description: string;
  tags?: string;
  created_by?: string;
  image?: string;
};

const ServiceCard: React.FC<ServiceCardProps> = ({
  uuid,
  name,
  description,
  tags,
  created_by,
  image,
}) => {
  // Convert tags string into an array (max 2 tags to keep UI clean)
  const tagList = tags ? tags.split(",").slice(0, 2) : [];

  return (
    <div className="rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group overflow-hidden border border-gray-100 hover:border-primary/20 bg-white hover:bg-gradient-to-br from-white to-primary/5">
      {/* Image with overlay effect */}
      <div className="relative h-48 overflow-hidden">
        <Image
          src={image || "/service.png"}
          alt={name}
          width={500}
          height={500}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Badge example (you can customize conditionally) */}
        {created_by?.includes("admin") && (
          <div className="absolute top-3 left-3 bg-blue-50 text-primaryColor text-xs font-semibold px-2 py-1 rounded-full">
            Admin Service
          </div>
        )}
      </div>

      {/* Card content */}
      <div className="p-4 md:p-5">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-bold text-lg text-gray-900 group-hover:text-primary line-clamp-1 capitalize">
            {name}
          </h3>
        </div>

        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {description}
        </p>

        {/* Tags */}
        {tagList.length > 0 && (
          <div className="flex gap-2 mb-3 flex-wrap">
            {tagList.map((tag, idx) => (
              <span
                key={idx}
                className="bg-blue-50 text-primaryColor text-xs px-2 py-1 rounded"
              >
                {tag.trim()}
              </span>
            ))}
          </div>
        )}

        {/* Action button */}
        <div className="flex gap-2 w-full">
          <Link
            href={`/service/${uuid}`}
            className="flex-1 bg-primaryColor hover:bg-primary-dark text-white font-medium py-2 px-4 rounded-lg text-sm text-center transition-colors flex items-center justify-center gap-1"
          >
            View clinic
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;
