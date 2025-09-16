'use client'
import { getAService } from "@/service/user/sevicePage";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import ServiceDetailedVIewSkelton from "../skeltons/service/ServiceDetailedVIewSkelton";

type ServiceData = {
  image?: string | null;
  created_by: string;
  description: string;
  name: string;
  reason_for_rejection?: string | null;
  status: string;
  tags: string;
  uuid: string;
  rating?: string;
};

const ServiceDetailed = ({ id }: { id: string }) => {
  const [serviceData, setServiceData] = useState<ServiceData | undefined>(undefined)
  const [isLoading, setLoading] = useState(true)

  const getServiceData = async () => {
    try {
      const res = await getAService(id)

      if (res.status === 200) {
        setServiceData(res?.data)
      }
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getServiceData()
  }, []);

  if (isLoading) {
    return <ServiceDetailedVIewSkelton />
  }

  return (
    <div className="p-4 md:p-6 font-inter w-full md:w-[40%] bg-white shadow-xl rounded-xl">
      {/* Service Header Section */}
      <section className="flex flex-col gap-5 md:gap-10 items-start justify-start ">
        <div className="w-full max-h-[400px] md:min-h-[400px] overflow-hidden rounded-xl shadow-lg">
          <Image
            src={serviceData?.image ? serviceData?.image : "/bannerService.png"}
            alt="banner"
            width={500}
            height={500}
            className="w-full max-h-[400px] md:min-h-[400px] object-cover rounded-xl"
          />
        </div>
        <div className="w-full rounded-lg mb-8">
          <h1 className="text-3xl font-bold text-[#424141] mb-2 capitalize">
            {serviceData?.name}
          </h1>

          <div className="flex items-center mb-3">
            <div className="text-yellow-400 text-xl mr-2">★★★★☆</div>
            <span className="text-gray-600 text-sm">{serviceData?.rating ? serviceData?.rating : "428"} Reviews</span>
          </div>

          {/* <p className="italic text-gray-700 mb-4">
            Highly rated by patients for: expert care, diagnosis accuracy,
            treatment results
          </p> */}

          <div className="mb-4 space-y-3 text-gray-700 leading-relaxed">
            <p>
              {serviceData?.description}
            </p>
          </div>

          <div className="flex flex-wrap gap-3 mt-4 capitalize">
            {
              serviceData?.tags.split(',').map((tags, index) => (
                <span key={index} className="bg-primaryColor text-blue-100 px-3 py-1.5 rounded-full text-xs">
                  ✔️ {tags}
                </span>
              ))
            }
          </div>
        </div>
      </section>
    </div>
  );
};

export default ServiceDetailed;
