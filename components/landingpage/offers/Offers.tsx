import Title from "@/components/ui/title";
import React from "react";
import OfferCard from "./OfferCard";

const Offers = () => {
  const headingVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10,
        duration: 0.6
      }
    }
  };
  return (
    <section className="overflow-hidden">
      <div className="@container mx-auto max-w-7xl px-3 md:px-6 md:pb-20">
        <Title
          title={"Clinic offers"}
          subtitle={`We provide a wide range of services to keep you and your family
            healthy, safe, and informed.`}
          variants={headingVariants}
        />

        {/* Offer cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-10 mt-10 md:mt-16">
          {Array.from({ length: 3 }).map((_, index) => (
            <OfferCard key={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Offers;
