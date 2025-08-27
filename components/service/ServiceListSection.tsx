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
  const [nextUrl, setNextUrl] = useState<string | null>(null);

  const fetchServices = async (url?: string) => {
    try {
      setIsLoading(true);

      // 👇 first call or next page call
      const res = url ? await getAllService(url) : await getAllService();

      // ✅ API shape: res.data.data.data = [10 services]
      const pageData = res?.data?.data;
      const serviceData: Service[] = pageData?.data || [];
      const next = pageData?.next || null;

      // ✅ append only the fresh 10 items
      setServices((prev) => [...prev, ...serviceData]);
      setNextUrl(next);

      console.log("Fetched services count:", serviceData.length);
      console.log("Total in state now:", [...services, ...serviceData].length);
    } catch (error) {
      console.error("Error fetching services:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // initial load (page 1)
  useEffect(() => {
    fetchServices();
  }, []);

  const handleLoadMore = () => {
    if (nextUrl) {
      fetchServices(nextUrl); // page 2, page 3 ...
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

      {/* Load More button */}
      {nextUrl && !isLoading && (
        <div className="flex justify-center mt-8">
          <button
            onClick={handleLoadMore}
            className="p-2.5 px-5 bg-primaryColor text-white rounded-full text-sm hover:bg-primaryColor/90 transition-colors"
          >
            Load More
          </button>
        </div>
      )}
    </div>
  );
};

export default ServiceListSection;
