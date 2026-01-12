import React from "react";
import Image from "next/image";
import { CheckCircle2 } from "lucide-react";

const WhyChooseUs = () => {
  const features = [
    {
      title: "Verified Expert Physiotherapists",
      description: "Certified specialists for clinical pain management, posture correction, and rehabilitation."
    },
    {
      title: "Custom Recovery Plans",
      description: "Personalized physiotherapy treatment programs tailored to your specific health goals."
    },
    {
      title: "Advanced Clinical Techniques",
      description: "Evidence based manual therapy and expert exercise rehabilitation for faster healing."
    },
    {
      title: "Safe Proven Protocols",
      description: "Clinically guided physiotherapy ensuring safe, effective, and ethical patient recovery."
    },
    {
      title: "Seamless Hybrid Care",
      description: "Convenient access to online video consultations and nearby physiotherapy clinic treatments."
    },
    {
      title: "Measurable Health Results",
      description: "Noticeable improvements in pain relief, body mobility, and long term posture."
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
                Why Physiotherapy Experts Trust <span className="text-primaryColor">Clinzor</span>
              </h2>
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
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;