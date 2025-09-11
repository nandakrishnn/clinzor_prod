import Image from "next/image";
import React from "react";
import { motion, Variants } from "framer-motion";

import HealthAndSafetyIcon from "@mui/icons-material/HealthAndSafety";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

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

// Dummy images for the carousel
const carouselImages = [
  "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=1280",
  "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=1280", // assuming you have these images
  "https://images.unsplash.com/photo-1551190822-a9333d879b1f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=1280",
  "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=1280"
];

const Camp = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: false,
    pauseOnHover: true,
  };

  return (
    <section className="overflow-hidden">
      <div className="@container mx-auto max-w-7xl px-3 md:px-6 md:pb-20 flex flex-col md:flex-row gap-5 md:gap-14">
        <div className="md:h-[550px] rounded-2xl overflow-hidden w-full md:w-[60%]  relative shadow-lg ">
          <Slider {...settings}>
            {carouselImages.map((image, index) => (
              <div key={index} className="h-[235px] md:h-[550px] relative">
                <Image
                  src={image}
                  alt={`Camp image ${index + 1}`}
                  fill
                  className="object-cover"
                  priority={index === 0}
                />
              </div>
            ))}
          </Slider>
        </div>

        <motion.div
          className="text-start w-full md:w-[50%] flex flex-col items-center justify-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={headingVariants}
        >
          <div className="text-start flex flex-col items-start justify-center">
            <h3 className="font-semibold text-[18px] italic ">
              {"Clinic Camp"}
            </h3>
            <h2 className="w-full text-2xl md:text-3xl text-start font-bold text-[#424141] leading-7">
              {"Lorem Ipsum is simply dummy"}
            </h2>
            <ul className="space-y-5 my-3 md:my-0 pt-5 md:pt-6">
              <li className="flex gap-3 items-start">
                <span className="text-primaryColor text-xl bg-blueLight/20 rounded-full w-8 h-8 flex items-center justify-center p-5">
                  <HealthAndSafetyIcon className="45" />
                </span>
                <div>
                  <strong>1. Find Your Expert</strong>
                  <p className="text-gray-500 text-sm">
                    Search for specialists based on their expertise and patient
                    reviews.
                  </p>
                </div>
              </li>
              <li className="flex gap-3 items-start">
                <span className="text-primaryColor text-xl bg-blueLight/20 rounded-full w-8 h-8 flex items-center justify-center p-5">
                  <HealthAndSafetyIcon className="45" />
                </span>
                <div>
                  <strong>2. Select a Slot</strong>
                  <p className="text-gray-500 text-sm">
                    Choose a date and time that works for you from the expert’s
                    available slots.
                  </p>
                </div>
              </li>
              <li className="flex gap-3 items-start">
                <span className="text-primaryColor text-xl bg-blueLight/20 rounded-full w-8 h-8 flex items-center justify-center p-5">
                  <HealthAndSafetyIcon className="45" />
                </span>
                <div>
                  <strong>3. Join the Call</strong>
                  <p className="text-gray-500 text-sm">
                    Receive a secure link to join your video consultation at the
                    scheduled time.
                  </p>
                </div>
              </li>
            </ul>
          </div>

          <button className="w-full bg-primaryColor text-white p-2.5 text-sm rounded-full mt-8">
            Register Now
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default Camp;
