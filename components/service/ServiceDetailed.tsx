'use client'
import { getAllService, getAService } from "@/service/user/sevicePage";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import ServiceDetailedVIewSkelton from "../skeltons/service/ServiceDetailedVIewSkelton";
import useLocalStorage from "@/hooks/useLocalStorage.ts";

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
   const {getItem} = useLocalStorage()

  const getServiceData = async () => {
  try {
    if (id !== null) {
      const res = await getAService(getItem(id));
      if (res.status === 200) {
        setServiceData(res?.data)
        setServiceData(res.data);
      }
    }
  } catch (error) {
    console.log(error);
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    getServiceData()
  }, []);


  return (
    <div className="w-full  sm:min-w-[30%] mb-10">
      {/* {isLoading && <ServiceDetailedVIewSkelton />} */}
      {/* Service Header Section */}
      <section className="flex flex-col gap-5 items-start justify-start font-inter shadow-xl p-4 md:p-6 rounded-xl ">
        <div className="w-full max-h-[200px] md:min-h-[200px] overflow-hidden rounded-xl shadow-lg">
          <Image
            src={serviceData?.image ? serviceData?.image : "/bannerService.png"}
            alt="banner"
            width={500}
            height={500}
            className="w-full max-h-[200px] md:min-h-[200px] object-cover rounded-xl"
          />
        </div>
        <div className="w-full rounded-lg mb-8">
          <h1 className="text-[18px] md:text-[22px] font-bold text-[#424141] mb-1 capitalize">
            {serviceData?.name}
          </h1>

          {/* <div className="flex items-center mb-1">
            <div className="text-yellow-400 text-xl mr-2">★★★★☆</div>
            <span className="text-gray-600 text-sm">{serviceData?.rating ? serviceData?.rating : "428"} Reviews</span>
          </div> */}

          <div className="mb-4 space-y-3 text-gray-700 leading-relaxed">
            <p className="text-[13px] text-justify text-gray-700">
              {serviceData?.description}
            </p>
          </div>

          <div className="flex flex-wrap gap-3 mt-4 capitalize">
            {
              serviceData?.tags.split(',').map((tags, index) => (
                <span key={index} className="bg-primaryColor text-blue-100 px-3 py-1.5 rounded-full text-[10px]">
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
