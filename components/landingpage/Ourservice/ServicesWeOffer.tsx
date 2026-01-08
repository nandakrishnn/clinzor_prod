"use client";
import { ReactNode, useEffect, useState } from "react";
import { motion } from "framer-motion";

import CardTwo from "@/components/ui/cardTwo";
import Title from "@/components/ui/title";
import HealthAndSafetyIcon from "@mui/icons-material/HealthAndSafety";
import DataPlaceholder from "@/components/common/DataPlaceholder";
import { useRouter } from "next/navigation";
import { getServices } from "@/service/user/home";
import { CardSkelton } from "@/components/skeltons/home/HomeServiceSkelton";

export default function ServicesWeProvide() {
  const router = useRouter();
  const [serviceData, setService] = useState([]);
  const [isLoading, setLoading] = useState(true);

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

  const getServiceData = async () => {
    setLoading(true);
    try {
      const res = await getServices();
      if (res.status) {
        setService(res?.data?.data);
      }
    } catch (error) {
      console.log(error, "error form the home service list part");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getServiceData();
  }, []);

  if (isLoading) return <CardSkelton />;

  if (serviceData.length === 0) {
    return (
      <DataPlaceholder
        title="No Services Available"
        description="There are no services to display at this time."
      />
    );
  }

  return (
    <section className="overflow-hidden">
      <div className="@container mx-auto max-w-7xl px-6">
        <Title
          title={"Our Top Services"}
          subtitle={`We provide a wide range of services to keep you and your family
            healthy, safe, and informed.`}
          description="Comprehensive Physiotherapy & Health Services"
          variants={headingVariants}
        />

        <motion.div
          className="@min-4xl:max-w-full @min-4xl:grid-cols-4 mx-auto mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:mt-16"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          {serviceData?.slice(0, 4).map((service: any, index: any) => (
            <motion.div key={index} variants={itemVariants} whileHover="hover">
              <CardTwo
                className=""
                icon={<HealthAndSafetyIcon className="45" />}
                title={service?.name}
                content={service?.description}
                service={service}
              />
            </motion.div>
          ))}
        </motion.div>

        <div className="flex items-center justify-center w-full  mt-8">
          <button
            onClick={() => router.push("/service")}
            className="bg-primaryColor p-2.5 text-sm text-white rounded-full px-10"
          >
            See More
          </button>
        </div>
      </div>
    </section>
  );
}