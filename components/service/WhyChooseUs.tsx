import React from "react";
import Image from "next/image";
import { CheckCircle2 } from "lucide-react";

const WhyChooseUs = () => {
  const features = [
    {
      title: "Certified Physiotherapy Experts",
      description: "Clinzor partners with licensed and experienced physiotherapists specializing in pain management, posture correction, sports rehabilitation, and post-surgical recovery."
    },
    {
      title: "Personalized Physiotherapy Care Plans",
      description: "Every patient receives a customized physiotherapy treatment plan based on their condition, lifestyle, and recovery goals — ensuring faster and sustainable results."
    },
    {
      title: "Advanced Physiotherapy Techniques",
      description: "We use modern physiotherapy methods, including manual therapy, movement correction, exercise therapy, and evidence-based rehabilitation protocols for optimal recovery."
    },
    {
      title: "Safe, Clinically Guided & Effective",
      description: "All physiotherapy programs follow clinically approved practices, ensuring patient safety, ethical care, and measurable improvement in mobility and pain reduction."
    },
    {
      title: "Comfort-Focused Care Experience",
      description: "Whether online or in-clinic, Clinzor ensures a comfortable, professional, and stress-free physiotherapy experience, designed to support long-term wellness."
    },
    {
      title: "Visible Recovery & Lasting Results",
      description: "Patients experience noticeable improvements in pain relief, posture, flexibility, and movement with consistent physiotherapy care — often from the very first few sessions."
    }
  ];

  return (
    <section className="py-20 bg-white rounded-3xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Left Column - Image */}
          <div className="relative h-full rounded-2xl overflow-hidden shadow-xl">
            <Image
              src="/dummy/service1.png"
              alt="Physiotherapy Experts"
              width={600}
              height={800}
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-6 left-6 bg-white/90 backdrop-blur-sm p-4 rounded-lg shadow-md max-w-xs">
              <h3 className="text-lg font-semibold text-gray-800">Trusted Choice</h3>
              <p className="text-sm text-gray-600 mt-1">Trusted by thousands of patients</p>
            </div>
          </div>

          {/* Right Column - Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <span className="inline-block px-3 py-1 text-sm font-medium text-primaryColor bg-blue-50 rounded-full">
                Why Choose Us
              </span>
              <h2 className="text-4xl font-bold text-gray-900">
                Discover Why Clinzor Is Trusted by <span className="text-primaryColor">Physiotherapy</span> Experts
              </h2>
              <h3 className="text-xl font-semibold text-gray-800">
                Where Clinical Expertise Meets Compassionate Physiotherapy Care
              </h3>
              <p className="text-lg text-gray-600">
                At Clinzor, evidence-based physiotherapy meets personalized care. Our platform connects patients with certified physiotherapists and rehabilitation specialists who use advanced techniques to deliver safe, effective, and long-lasting recovery results.
              </p>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <div className="flex-shrink-0 mt-1">
                    <CheckCircle2 className="h-6 w-6 text-primaryColor" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">{feature.title}</h3>
                    <p className="text-gray-600 text-sm">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom Summary */}
            <div className="pt-6 border-t border-gray-100">
              <h4 className="font-bold text-lg text-gray-900 mb-3">Why Patients Choose Clinzor for Physiotherapy</h4>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-600">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primaryColor"></div>
                  Trusted network of certified physiotherapists
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primaryColor"></div>
                  Personalized recovery & rehabilitation programs
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primaryColor"></div>
                  Focus on long-term pain relief & prevention
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primaryColor"></div>
                  Seamless online & clinic-based care
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;