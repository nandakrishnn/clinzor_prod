import React from "react";
import { motion, Variants } from "framer-motion";

interface TitleProps {
  title: string;
  subtitle: string;
  variants?: Variants;
  description?: string;
}

const Title: React.FC<TitleProps> = ({
  title,
  subtitle,
  description,
  variants
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
          <h3 className="text-primaryColor font-semibold text-[18px] italic ">
            {title}
          </h3>
          <h2 className="w-full text-2xl md:text-4xl font-bold text-center pt-2 text-primaryColor leading-7">
            {description ||
              "Lorem Ipsum is simply dummy text of the printing. "}
          </h2>
          <p className="mt-4 text-[#4B5563] md:text-lg md:w-[45%]">{subtitle}</p>
        </div>
      </motion.div>
    </div>
  );
};

export default Title;
