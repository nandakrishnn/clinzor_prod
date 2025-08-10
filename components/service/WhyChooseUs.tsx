import React from "react";
import Image from "next/image";
import { CheckCircle2 } from "lucide-react";

const WhyChooseUs = () => {
  const features = [
    {
      title: "Expert Professionals",
      description: "Our team consists of certified beauty specialists with years of experience."
    },
    {
      title: "Personalized Care",
      description: "Tailored treatments designed specifically for your unique needs."
    },
    {
      title: "Advanced Techniques",
      description: "We use the latest technology and methods in the beauty industry."
    },
    {
      title: "Safe & Effective",
      description: "All treatments are FDA-approved and clinically tested."
    },
    {
      title: "Luxury Experience",
      description: "Relax in our premium facilities designed for your comfort."
    },
    {
      title: "Visible Results",
      description: "See noticeable improvements after just one session."
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
              alt="Beauty Clinic Services" 
              width={600} 
              height={800} 
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-6 left-6 bg-white/90 backdrop-blur-sm p-4 rounded-lg shadow-md max-w-xs">
              <h3 className="text-lg font-semibold text-gray-800">15+ Years Experience</h3>
              <p className="text-sm text-gray-600 mt-1">Trusted by thousands of clients</p>
            </div>
          </div>

          {/* Right Column - Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <span className="inline-block px-3 py-1 text-sm font-medium text-primaryColor bg-blue-50 rounded-full">
                Why Choose Us
              </span>
              <h2 className="text-4xl font-bold text-gray-900">
                Discover why we're the <span className="text-primaryColor">beauty</span> experts
              </h2>
              <p className="text-lg text-gray-600">
                At our clinic, expertise meets compassion. Our skilled professionals use advanced 
                techniques and personalized care to deliver safe, stunning results.
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
                    <p className="text-gray-600">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-gray-100">
              <div className="text-center">
                <p className="text-3xl font-bold text-primaryColor">10,000+</p>
                <p className="text-sm text-gray-500">Happy Clients</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-primaryColor">50+</p>
                <p className="text-sm text-gray-500">Treatments</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-primaryColor">98%</p>
                <p className="text-sm text-gray-500">Satisfaction Rate</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;