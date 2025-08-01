"use client";

import React, { useState } from "react";
import ServiceCard from "./ServiceCard";
import ServiceCardSkeleton from "./ServiceSkelton";

const ServiceListSection = () => {
  const [isLoading, setLoading] = useState(false);

  if (isLoading) {
    return (
      <section className="grid grid-cols-2 md:grid-cols-4 gap-5 md:gap-9 ">
        {Array.from({ length: 8 }).map((_, i) => (
          <ServiceCardSkeleton />
        ))}
      </section>
    );
  }

  return (
    <section className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-9 ">
      {Array.from({ length: 10 }).map((_, i) => (
        <ServiceCard key={i} />
      ))}
    </section>
  );
};

export default ServiceListSection;
