import React from "react";
import { motion, Variants } from "framer-motion";

interface TitleProps {
  title: string;
  subtitle: string;
  variants?: Variants;
}

const Title: React.FC<TitleProps> = ({ title, subtitle, variants }) => {
  return (
    <div>
      <motion.div
        className="text-center"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={variants}
      >
        <h2 className="text-balance text-2xl md:text-4xl font-bold bg-clip-text">
          {title}
        </h2>
        <p className="mt-4 text-[#4B5563] text-lg">{subtitle}</p>
      </motion.div>
    </div>
  );
};

export default Title;
