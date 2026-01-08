import React from "react";
import { motion, Variants } from "framer-motion";

interface TitleProps {
  title?: string;
  subtitle?: string;
  variants?: Variants;
  description?: string;
}

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

const Title: React.FC<TitleProps> = ({
  title,
  subtitle,
  description,
  variants = { headingVariants }
}) => {
  return (
    <div>
      <motion.div
        className="text-center "
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={variants}
      >
        <div className="text-center w-full flex flex-col items-center">
          <h3 className="font-semibold text-[18px] italic ">
            {title}
          </h3>
          <h2 className="w-full text-[#424141] text-2xl md:text-3xl font-bold text-center pt-2 leading-7">
            {description}
          </h2>
          <p className="mt-4 text-[#4B5563] md:text-lg md:w-[55%]">
            {subtitle}
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Title;
