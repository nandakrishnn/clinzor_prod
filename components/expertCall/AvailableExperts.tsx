import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Title from "../ui/title";

const AvailableExperts = () => {
  const experts = [
    {
      id: 1,
      name: "Dr. Sarah Johnson",
      title: "Career Coach",
      expertise: "Career Transition, Resume Building",
      rating: 4.9,
      sessions: 245,
      image: "/images/expert1.jpg"
    },
    {
      id: 2,
      name: "Mark Williams",
      title: "Tech Consultant",
      expertise: "Software Development, Cloud Architecture",
      rating: 4.8,
      sessions: 189,
      image: "/images/expert2.jpg"
    },
    {
      id: 3,
      name: "Lisa Chen",
      title: "Business Strategist",
      expertise: "Startup Funding, Growth Hacking",
      rating: 4.7,
      sessions: 156,
      image: "/images/expert3.jpg"
    },
    {
      id: 4,
      name: "David Rodriguez",
      title: "Financial Advisor",
      expertise: "Investment Strategies, Retirement Planning",
      rating: 4.9,
      sessions: 212,
      image: "/images/expert4.jpg"
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-10 md:mb-16">
        <Title
          title="User Benefits"
          description={"Our Featured Experts"}
          subtitle={`Connect with professionals across various industries and specialties.`}
        />
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
        {experts.map((expert) => (
          <div
            key={expert.id}
            className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow"
          >
            <div className="relative h-48">
              <Image
                src={expert.image}
                alt={expert.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900">{expert.name}</h3>
              <p className="text-blue-600 font-medium">{expert.title}</p>
              <p className="text-gray-600 text-sm mt-2">{expert.expertise}</p>
              <div className="flex items-center mt-4">
                <div className="flex items-center text-yellow-500">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(expert.rating)
                          ? "fill-current"
                          : "stroke-current"
                      }`}
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  ))}
                  <span className="text-gray-600 ml-1">{expert.rating}</span>
                </div>
                <span className="text-gray-500 text-sm ml-2">
                  ({expert.sessions} sessions)
                </span>
              </div>
              <Button className="w-full mt-4 text-white bg-primaryColor hover:bg-primaryColor">
                Book Session
              </Button>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center mt-12">
        <Button
          variant="outline"
          className="border-primaryColor text-primaryColor"
        >
          View All Experts
        </Button>
      </div>
    </div>
  );
};

export default AvailableExperts;
