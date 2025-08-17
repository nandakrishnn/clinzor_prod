import Image from "next/image";
import React from "react";
import { motion, Variants } from "framer-motion";
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
        <div className="h-[550px] rounded-2xl overflow-hidden w-full md:w-[60%]  relative shadow-lg">
          <Slider {...settings}>
            {carouselImages.map((image, index) => (
              <div key={index} className="h-[550px] relative">
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

          <button className="w-full bg-primaryColor text-white p-2.5 text-sm rounded-full mt-8">
            Register Now
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default Camp;
