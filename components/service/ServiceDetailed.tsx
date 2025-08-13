import Image from "next/image";
import React from "react";

const ServiceDetailed = () => {
  return (
    <div className="p-4 md:p-6 font-sans">
      {/* Service Header Section */}
      <section className="flex flex-col md:flex-row gap-5 md:gap-10">
        <div className="w-full md:h-[400px] ">
          <Image
            src={"/admin.jpg"}
            alt=""
            width={500}
            height={500}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="rounded-lg mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2 capitalize">
            Cardiologist Consultation
          </h1>

          <div className="flex items-center mb-3">
            <div className="text-yellow-400 text-xl mr-2">★★★★☆</div>
            <span className="text-gray-600">428 Reviews</span>
          </div>

          <p className="italic text-gray-700 mb-4">
            Highly rated by patients for: expert care, diagnosis accuracy,
            treatment results
          </p>

          <div className="mb-4 space-y-3 text-gray-700 leading-relaxed">
            <p>
              A comprehensive skin examination by certified dermatologists. Our
              dermatology consultations include detailed analysis of skin
              conditions, personalized treatment plans, and follow-up
              recommendations. Services cover acne treatment, eczema, psoriasis,
              skin cancer screening, and cosmetic dermatology.
            </p>
            <p className="bg-blue-50 p-3 rounded italic">
              "The dermatologist was extremely thorough and explained everything
              clearly. My skin has improved significantly after just one visit."
              - Priya K.
            </p>
          </div>

          <div className="flex flex-wrap gap-3 mt-4 capitalize">
            <span className="bg-primaryColor text-blue-100 px-3 py-1 rounded-full text-sm">
              ✔️ heart
            </span>
            <span className="bg-primaryColor text-blue-100 px-3 py-1 rounded-full text-sm">
              ✔️ cardiology
            </span>
            <span className="bg-primaryColor text-blue-100 px-3 py-1 rounded-full text-sm">
              ✔️ blood pressure
            </span>
            <span className="bg-primaryColor text-blue-100 px-3 py-1 rounded-full text-sm">
              ✔️ chest pain
            </span>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ServiceDetailed;
