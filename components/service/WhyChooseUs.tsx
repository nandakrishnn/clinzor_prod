import React from "react";
import Image from "next/image";

const WhyChooseUs = () => {
  return (
    <section className="h-[100vh] flex">
      <div>
        <h3>Why choose us</h3>
        <h2>Discover why we’re beauty</h2>
        <p>
          At our clinic, expertise meets compassion. Our skilled professionals
          use advanced techniques and personalized care to deliver safe,
          stunning result.
        </p>
        <Image src={"/dummy/service1.png"} alt="" title="" width={500} height={500} className="" />
      </div>
      <div>
        section 2
        <Image src={"/dummy/service1.png"} alt="" title="" width={500} height={500} className="" />
      </div>
    </section>
  );
};

export default WhyChooseUs;
