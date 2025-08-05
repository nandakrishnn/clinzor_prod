import React from "react";
import Image from "next/image";

import CallMadeIcon from "@mui/icons-material/CallMade";
import Link from "next/link";

const ServiceCard = () => {
  return (
    <section className="rounded-lg md:rounded-xl shadow-xl hover:bg-primaryColor ease-in-out duration-300 group overflow-hidden">
      <div className="relative flex item-center justify-center">
        <Image
          src={"/dummy/service1.png"}
          alt="Service Image"
          title="Service 1"
          //   fill
          width={500}
          height={500}
          className="w-full object-cover h-[250px]"
        />
        <div className="absolute top-[40%] cursor-pointer bg-hButton rounded-full p-2 hidden group-hover:block  text-primaryColor">
          <Link href={"#"} title="service detailed page">
            <CallMadeIcon />
          </Link>
        </div>
      </div>
      <div className=" p-3 pb-6 md:p-6 ">
        <h2 className="font-bold text-[16px] md:text-lg text-primaryColor group-hover:text-white">
        Services Title
        </h2>
        <p className="py-1 pb-4 text-[14px] text-[#7B798C] group-hover:text-white line-clamp-1 md:line-clamp-2">
          Comprehensive anti-aging treatments to reduce fine lines, wrinkles,
          and restore skin elasticity.
        </p>
      </div>
    </section>
  );
};

export default ServiceCard;
