"use client";
import Title from "@/components/ui/title";
import React, { useEffect, useState } from "react";
import OfferCard from "./OfferCard";
import { getAllOffers } from "@/service/user/home";
import DataPlaceholder from "@/components/common/DataPlaceholder";
import OfferCardSkeleton from "@/components/skeltons/home/HomeOfferSkelton";

type Offer = {
  title: string;
  description: string;
  image: string;
  discount_percentage?: string;
  valid_from?: string;
  valid_to?: string;
  offer_type?: string;
};

const Offers = () => {
  const [offerData, setOfferData] = useState<Offer[]>([]);
  const [isLoading, setIsLoading] = useState(true)

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

  const getOffers = async () => {
    setIsLoading(true);
    try {
      const res = await getAllOffers();
      if (res.status === 200) {
        const today = new Date();

        // filter offers: show only valid ones
        const validOffers = res?.data?.data.filter((offer: Offer) => {
          const validFrom = offer.valid_from ? new Date(offer.valid_from) : null;
          const validTo = offer.valid_to ? new Date(offer.valid_to) : null;

          return (
            (!validFrom || today >= validFrom) && // starts already
            (!validTo || today <= validTo)        // not expired
          );
        });

        setOfferData(validOffers);
      }
    } catch (error) {
      console.log(error, "error from the get offer component");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getOffers();
  }, []);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10 md:mt-16">
        {Array.from({ length: 3 }).map((_, index) => (
          <OfferCardSkeleton key={index} />
        ))}
      </div>
    )
  }

  if (offerData.length === 0) {
    return (
      <DataPlaceholder
        title="Currently No Offers Are Available"
        description="There's no offers to display at the moment."
      />
    );
  }

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
          {
            // Show actual offer cards when data is available
            offerData.map((offer, index) => (
              <OfferCard
                key={index}
                title={offer?.title}
                description={offer?.description}
                image={offer?.image}
                discount_percentage={offer?.discount_percentage}
                valid_from={offer?.valid_from ?? ""}
                valid_to={offer?.valid_to ?? ""}
                offer_type={offer?.offer_type ?? ""}
              />
            ))}
        </div>

        {/* CTA Button */}
        {/* <div className="text-center mt-8">
          <button className="px-5 p-2.5 bg-primaryColor hover:bg-primaryColorDark text-white font-medium text-sm rounded-full transition-all duration-300 shadow-lg hover:shadow-xl">
            View All Offers
          </button>
        </div> */}
      </div>
    </section>
  );
};

export default Offers;
