"use client";

import React, { useEffect, useState } from "react";
import ServiceCard from "./ServiceCard";
import ServiceCardSkeleton from "./ServiceSkelton";
import { getAllService } from "@/service/user/sevicePage";

type Service = {
  uuid: string;
  name: string;
  description: string;
  tags: string;
  created_by: string;
  image: string;
};

const ServiceListSection = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [services, setServices] = useState<Service[]>([]);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchServices = async (pageNum: number) => {
    try {
      setIsLoading(true);

      const res = await getAllService(pageNum);
      console.log(res, "from the service listing part");

      const totalPages = res?.data?.total_pages || 1;
      setTotalPage(totalPages);
      
      // Check if there are more pages
      setHasMore(pageNum < totalPages);

      // ✅ API shape: res.data.data = [10 services]
      const pageData = res?.data?.data || [];

      console.log(pageData, "from the data");

      // ✅ For page 1, replace the data. For other pages, append to existing data
      if (pageNum === 1) {
        setServices(pageData);
      } else {
        setServices((prev) => [...prev, ...pageData]);
      }

      console.log("Fetched services count:", pageData.length);
    } catch (error) {
      console.error("Error fetching services:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // initial load (page 1)
  useEffect(() => {
    fetchServices(1);
  }, []);

  const handleLoadMore = () => {
    if (page < totalPage) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchServices(nextPage);
    }
  };

  return (
    <div className="space-y-8">
      {/* Services grid */}
      <section className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-9">
        {services.map((service) => (
          <ServiceCard
            key={service.uuid}
            uuid={service.uuid}
            name={service.name}
            description={service.description}
            tags={service.tags}
            image={service.image}
          />
        ))}
      </section>

      {/* Skeleton loading */}
      {isLoading && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-9">
          {Array.from({ length: 3 }).map((_, i) => (
            <ServiceCardSkeleton key={`skeleton-${i}`} />
          ))}
        </div>
      )}

      {/* Load More button - Only show if there are more pages and not loading */}
      {hasMore && !isLoading && services.length > 0 && (
        <div className="flex justify-center mt-8">
          <button
            onClick={handleLoadMore}
            disabled={isLoading}
            className="p-2.5 px-5 bg-primaryColor text-white rounded-full text-sm hover:bg-primaryColor/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Load More
          </button>
        </div>
      )}

      {/* Show message when no more services to load */}
      {!hasMore && services.length > 0 && (
        <div className="text-center text-gray-500 mt-8">
          No more services to load
        </div>
      )}
    </div>
  );
};

export default ServiceListSection;