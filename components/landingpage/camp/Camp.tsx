import Title from "@/components/ui/title";
import Image from "next/image";
import React from "react";
import { motion, Variants } from "framer-motion";

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

const Camp = () => {
  return (
    <section className="overflow-hidden">
      <div className="@container mx-auto max-w-7xl px-3 md:px-6 md:pb-20 flex flex-col md:flex-row gap-5 md:gap-14">
        <div className="h-[500px] rounded-2xl overflow-hidden w-full md:w-[60%] bg-red-500 relative">
          <Image
            src={"/dummy/banner.webp"}
            alt=""
            fill
            className="object-cover"
          />
        </div>

        <motion.div
          className="text-start w-full md:w-[50%] "
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={headingVariants}
        >
          <div className="text-start flex flex-col items-start">
            <h3 className="text-primaryColor font-semibold text-[18px] italic ">
              {"Clinic Camp"}
            </h3>
            <h2 className="w-full text-2xl md:text-4xl font-bold text-start pt-2 text-primaryColor leading-7">
              {"Lorem Ipsum is simply dummy text"}
            </h2>
            <p className="mt-4 text-[#4B5563] md:text-[16px] ">
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry. Lorem Ipsum has been the industry's standard dummy text
              ever since the 1500s, when an unknown printer took a galley of
              type and scrambled it to make a type specimen book. It has
              survived not only five centuries, but also the leap into
              electronic typesetting, remaining essentially unchanged. It was
              popularised in the 1960s with the release of Letraset sheets
              containing Lorem Ipsum passages, and more recently with desktop
              publishing software like Aldus PageMaker including versions of
              Lorem Ipsum.
            </p>
          </div>

          <button className="w-full bg-primaryColor  text-white p-2.5 rounded-lg mt-8">
            Register Now
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default Camp;
