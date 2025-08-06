import Image from "next/image";
import React from "react";

const OfferCard = () => {
  return (
    <div className="w-ful rounded-xl bg-white border border-gray-100 hover:bg-primaryColor ease-in-out duration-500 group p-5 md:p-8">
      <div>
        <h2 className="text-primaryColor group-hover:text-white ease-in-out duration-500 font-bold mb-1 text-2xl">
          Offer Card Title
        </h2>
        <p className="text-[16px] text-[#7B798C] group-hover:text-white ease-in-out duration-500 line-clamp-2 md:leading-5">
          Growing chemical-free crops with methods for healthier, sustainable
          farming.
        </p>
      </div>
      <div className="mt-5 max-h-[200px] rounded-xl overflow-hidden">
        <Image
          src={"/dummy/offer2.jpg"}
          alt=""
          width={500}
          height={500}
          objectFit="contain "
        />
      </div>
    </div>
  );
};

export default OfferCard;
