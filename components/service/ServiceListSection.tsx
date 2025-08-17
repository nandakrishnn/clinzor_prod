"use client";

import React, { useEffect, useState } from "react";
import ServiceCard from "./ServiceCard";
import ServiceCardSkeleton from "./ServiceSkelton";

type Service = {
  id: number;
  title: string;
  description: string;
};

const ServiceListSection = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [services, setServices] = useState<Service[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // Mock fetch function - replace with your actual API call
  const fetchServices = async (pageNum: number) => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock data - replace with your actual API call
      const newServices = Array.from({ length: 6 }, (_, i) => ({
        id: i + (pageNum - 1) * 6,
        title: `Service ${i + (pageNum - 1) * 6 + 1}`,
        description: `Description for service ${i + (pageNum - 1) * 6 + 1}`,
      }));

      // In a real app, you would get this from your API response
      const moreDataAvailable = pageNum < 3; 

      setServices(prev => [...prev, ...newServices]);
      setHasMore(moreDataAvailable);
      setPage(prev => prev + 1);
    } catch (error) {
      console.error("Error fetching services:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchServices(1);
  }, []);

  const handleLoadMore = () => {
    if (!isLoading && hasMore) {
      fetchServices(page);
    }
  };

  if (isLoading && services.length === 0) {
    return (
      <div className="space-y-8">
        <section className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-9">
          {Array.from({ length: 6 }).map((_, i) => (
            <ServiceCardSkeleton key={i} />
          ))}
        </section>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <section className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-9">
        {services.map((service) => (
          <ServiceCard />
        ))}
      </section>

      {isLoading && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-9">
          {Array.from({ length: 3 }).map((_, i) => (
            <ServiceCardSkeleton key={`skeleton-${i}`} />
          ))}
        </div>
      )}

      {hasMore && !isLoading && (
        <div className="flex justify-center mt-8">
          <button
            onClick={handleLoadMore}
            className="p-2.5 px-5 bg-primaryColor text-white rounded-full text-sm hover:bg-primaryColor/90 transition-colors"
            disabled={isLoading}
          >
            Load More
          </button>
        </div>
      )}
    </div>
  );
};

export default ServiceListSection;