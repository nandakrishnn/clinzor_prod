import React from "react";
import Title from "../ui/title";

const HowItWorks = () => {
  const steps = [
    {
      id: 1,
      title: "Choose Your Expert",
      description:
        "Browse our directory of professionals and select the perfect match for your needs.",
      icon: ""
    },
    {
      id: 2,
      title: "Schedule Your Session",
      description:
        "Pick a convenient time slot that works for both you and the expert.",
      icon: ""
    },
    {
      id: 3,
      title: "Make Payment",
      description:
        "Secure payment ensures your session is confirmed and protected.",
      icon: ""
    },
    {
      id: 4,
      title: "Connect & Learn",
      description:
        "Join the video call at your scheduled time and get the advice you need.",
      icon: ""
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-16">
        <Title
          title={" How Expert Calls Work"}
          description={""}
          subtitle={`Getting expert advice has never been easier. Follow these simple steps
          to book your session.`}
        />
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
        {steps.map((step) => (
          <div
            key={step.id}
            className="bg-gray-50 p-8 rounded-xl border border-gray-200 hover:shadow-lg transition-shadow"
          >
            <div className="text-4xl mb-4">{step.icon}</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {step.title}
            </h3>
            <p className="text-gray-600">{step.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HowItWorks;
