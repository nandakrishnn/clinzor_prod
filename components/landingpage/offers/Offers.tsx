import Title from "@/components/ui/title";
import React from "react";
import OfferCard from "./OfferCard";

const Offers = () => {
  const offers = [
    {
      title: "Comprehensive Health Checkup",
      description:
        "Full body examination including blood tests, ECG, and doctor consultation.",
      image:
        "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
      discount: "30% OFF",
      tag: "Popular"
    },
    {
      title: "Dental Care Package",
      description:
        "Complete dental checkup, cleaning, and whitening session with our specialists.",
      image:
        "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
      discount: "25% OFF",
      tag: "Limited"
    },
    {
      title: "Family Wellness Plan",
      description:
        "Special package for families including pediatric and adult checkups.",
      image:
        "https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
      discount: "20% OFF",
      tag: "Family"
    }
  ];

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
      <div className="@container mx-auto max-w-7xl px-3 md:px-6 md:pb-10">
        <Title
          title={"Special Offers & Packages"}
          subtitle={`Exclusive healthcare packages designed for your wellness needs. Save on comprehensive care.`}
          variants={headingVariants}
        />

        {/* Offer cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10 md:mt-16">
          {offers.map((offer, index) => (
            <OfferCard
              key={index}
              title={offer.title}
              description={offer.description}
              image={offer.image}
              discount={offer.discount}
              tag={offer.tag}
            />
          ))}
        </div>

        {/* CTA Button */}
        <div className="text-center mt-12">
          <button className="px-5 p-2.5 bg-primaryColor hover:bg-primaryColorDark text-white font-medium text-sm rounded-full transition-all duration-300 shadow-lg hover:shadow-xl">
            View All Offers
          </button>
        </div>
      </div>
    </section>
  );
};

export default Offers;
