"use client";

import React, { useCallback, useEffect, useState } from "react";
import { getAllService } from "@/service/user/sevicePage";
import { useRouter, useSearchParams } from "next/navigation";
import ServiceCard from "./ServiceCard";
import ServiceCardSkeleton from "./ServiceSkelton";
import DataPlaceholder from "../common/DataPlaceholder";
import { ChevronRight, Loader, Search } from "lucide-react";
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
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [services, setServices] = useState<Service[]>([]);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");
  const [isSearching, setIsSearching] = useState(false);

  const fetchServices = useCallback(async (pageNum: number, query: string = "") => {
    setIsLoading(true);
    try {
      const res = await getAllService(pageNum, query);

      if (res?.status === 200) {
        const totalPages = res.data?.total_pages || 1;
        setTotalPage(totalPages);
        setHasMore(pageNum < totalPages);

        const pageData = res.data?.data || [];

        if (pageNum === 1) {
          setServices(pageData);
        } else {
          setServices((prev) => [...prev, ...pageData]);
        }
      } else {
        console.error("Failed to fetch services:", res?.message);
        setServices([]);
      }
    } catch (error) {
      console.error("Error fetching services:", error);
      setServices([]);
    } finally {
      setIsLoading(false);
      setIsSearching(false);
    }
  }, []);

  useEffect(() => {
    const search = searchParams.get("search") || "";
    setSearchQuery(search);
    fetchServices(1, search);
  }, []);

  const handleLoadMore = () => {
    if (page < totalPage && !isLoading) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchServices(nextPage, searchQuery);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleSearch = () => {
    // Update URL with search query
    const params = new URLSearchParams(searchParams.toString());
    if (searchQuery) {
      params.set("search", searchQuery);
    } else {
      params.delete("search");
    }

    router.push(`?${params.toString()}`, { scroll: false });

    // Reset to first page when searching
    setPage(1);
    setIsSearching(true);
    fetchServices(1, searchQuery);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  // Loading Skelton
  if (isLoading && services.length === 0) {
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

  return (
    <div className="space-y-8">
      {/* Service Search part */}
      <div className="mb-12 max-w-2xl mx-auto">
        <div className="relative">
          <input
            type="text"
            placeholder="Search Service..."
            value={searchQuery}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            className="w-full px-6 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-primaryColor"
          />
          <button
            onClick={handleSearch}
            disabled={isSearching}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 disabled:opacity-50"
          >
            {isSearching ? (
              <Loader size={20} className="animate-spin" />
            ) : (
              <Search size={20} />
            )}
          </button>
        </div>
      </div>

      {/* No Data Placeholder */}
      {services.length === 0 && !isLoading ? (
        <DataPlaceholder title={searchQuery ? `No services found for "${searchQuery}"` : "No services available"} />
      ) : (
        <>
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
          {hasMore && services.length > 0 && (
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
        </>
      )}
    </div>
  );
};

export default ServiceListSection;