"use client";

import React, { useEffect, useState } from "react";
import { getAllService } from "@/service/user/sevicePage";

import ServiceCard from "./ServiceCard";
import ServiceCardSkeleton from "./ServiceSkelton";
import DataPlaceholder from "../common/DataPlaceholder";
import { ChevronRight, Loader } from "lucide-react";
import { SearchSkeleton } from "../blog/skeltons/SearchSkeleton";

type Service = {
  uuid: string;
  name: string;
  description: string;
  tags: string;
  created_by: string;
  image: string;
};

const ServiceListSection = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [services, setServices] = useState<Service[]>([]);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchServices = async (pageNum: number) => {
    setIsLoading(true);
    try {
      const res = await getAllService(pageNum);

      const totalPages = res?.data?.total_pages || 1;
      setTotalPage(totalPages);

      setHasMore(pageNum < totalPages);

      const pageData = res?.data?.data || [];

      if (pageNum === 1) {
        setServices(pageData);
      } else {
        setServices((prev) => [...prev, ...pageData]);
      }

    } catch (error) {
      console.error("Error fetching services:", error);
    } finally {
      setIsLoading(false);
    }
  };

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


  // Loading Skelton
  if (isLoading) {
    return (
      <>
      <SearchSkeleton />
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-9">
        {Array.from({ length: 3 }).map((_, i) => (
          <ServiceCardSkeleton key={`skeleton-${i}`} />
        ))}
      </div>
        </>
    )
  }

  // No Data Placeholder
  if (services.length === 0) {
    return <DataPlaceholder />
  }

  return (
    <div className="space-y-8">

      {/* Blog Search part */}
      <div className="mb-12 max-w-2xl mx-auto">
        <div className="relative">
          <input
            type="text"
            placeholder="Search Service..."
            className="w-full px-6 py-3 border border-gray-300 rounded-full focus:outline-none"
          />
          <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </button>
        </div>
      </div>

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

      {/* Load More button - Only show if there are more pages and not loading */}
      {hasMore && !isLoading && services.length > 0 && (
        <div className="flex justify-center mt-8">

          <button
            onClick={handleLoadMore}
            disabled={isLoading}
            className="p-2.5 px-5 bg-primaryColor flex items-center justify-center text-white rounded-full text-sm hover:bg-primaryColor/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader size={18} className="animate-spin mr-2" />
                Loading...
              </>
            ) : (
              <>
                Load More
                <ChevronRight size={18} className="ml-2" />
              </>
            )}
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