import {
  IconStethoscope,
  IconHeart,
  IconTool,
  IconBrain,
  IconUserCheck,
  IconHospital
} from "@tabler/icons-react";
import { ReactNode } from "react";
import { motion } from "framer-motion";

import CardTwo from "@/components/ui/cardTwo";
import Title from "@/components/ui/title";
import HealthAndSafetyIcon from "@mui/icons-material/HealthAndSafety";

export default function ServicesWeProvide() {
  const services = [
    {
      title: "General Consultation",
      description:
        "Get professional advice for your health concerns from certified physicians.",
      icon: IconStethoscope
    },
    {
      title: "Cardiology",
      description:
        "Heart health assessments, ECGs, and specialist referrals at your fingertips.",
      icon: IconHeart
    },
    {
      title: "Dental Care",
      description:
        "Routine checkups, cleanings, and cosmetic dentistry from top dentists.",
      icon: IconTool
    },
    {
      title: "Neurology",
      description:
        "Advanced diagnosis and treatment for neurological disorders.",
      icon: IconBrain
    },
    {
      title: "Family Medicine",
      description:
        "Holistic care for every member of your family, all in one place.",
      icon: IconUserCheck
    },
    {
      title: "Emergency Services",
      description:
        "Round-the-clock urgent care and emergency response facilities.",
      icon: IconHospital
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10
      }
    },
    hover: {
      scale: 1.03,
      transition: { type: "spring", stiffness: 400, damping: 10 }
    }
  };

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

  return (
    <section className="overflow-hidden">
      <div className="@container mx-auto max-w-7xl px-6 ">
        <Title
          title={"Our Top Services"}
          subtitle={`We provide a wide range of services to keep you and your family
            healthy, safe, and informed.`}
          variants={headingVariants}
        />

        <motion.div
          className="@min-4xl:max-w-full @min-4xl:grid-cols-3 mx-auto mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:mt-16"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          {services.map((service, index) => (
            <motion.div key={index} variants={itemVariants} whileHover="hover">
              <CardTwo
                className="bg-[#F2F5FF] "
                icon={<HealthAndSafetyIcon className="45" />}
                title="General Consultation"
                content="Get expert medical advice for your
                general health concerns from
                experienced doctors."
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

const CardDecorator = ({ children }: { children: ReactNode }) => (
  <motion.div
    className="relative mx-auto size-36 duration-200 [--color-border:color-mix(in_oklab,var(--color-zinc-950)10%,transparent)] group-hover:[--color-border:color-mix(in_oklab,var(--color-zinc-950)20%,transparent)] dark:[--color-border:color-mix(in_oklab,var(--color-white)15%,transparent)] dark:group-hover:bg-white/5 dark:group-hover:[--color-border:color-mix(in_oklab,var(--color-white)20%,transparent)]"
    whileHover={{
      rotate: [0, -2, 0],
      transition: { repeat: 0, duration: 0.5 }
    }}
  >
    <div
      aria-hidden
      className="absolute inset-0 bg-[linear-gradient(to_right,var(--color-border)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-border)_1px,transparent_1px)] bg-[size:24px_24px]"
    />
    <div
      aria-hidden
      className="bg-radial to-background absolute inset-0 from-transparent to-75%"
    />
    <motion.div
      className="dark:bg-zinc-900 absolute inset-0 m-auto flex size-12 items-center justify-center border-l border-t bg-white shadow-sm"
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 400, damping: 10 }}
    >
      <motion.div
        initial={{ opacity: 0.7 }}
        whileHover={{ opacity: 1, scale: 1.1 }}
        transition={{ type: "spring", stiffness: 400, damping: 10 }}
      >
        {children}
      </motion.div>
    </motion.div>
  </motion.div>
);
