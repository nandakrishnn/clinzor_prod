"use client";
import React, { useState } from "react";

const FAQSection = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: "How do I choose the right expert for my needs?",
      answer:
        "Browse expert profiles to review their qualifications, experience, and areas of expertise. You can also read reviews from previous clients. If you're unsure, our matching algorithm can suggest the best experts based on your needs."
    },
    {
      question: "What technology do I need for the session?",
      answer:
        "You'll need a stable internet connection, a webcam, and a microphone. Most sessions are conducted via our secure video platform (no downloads required) or Zoom. We'll send you all the details after booking."
    },
    {
      question: "Can I reschedule or cancel my session?",
      answer:
        "Yes, you can reschedule or cancel up to 24 hours before your session for a full refund. Late cancellations may incur a fee depending on the expert's policy."
    },
    {
      question: "What if I'm not satisfied with my session?",
      answer:
        "We want you to be completely satisfied. If your session didn't meet expectations, contact us within 48 hours and we'll work to make it right, which may include a partial refund or connecting you with another expert."
    },
    {
      question: "Are the sessions confidential?",
      answer:
        "Absolutely. All sessions are private and confidential. Experts are bound by strict confidentiality agreements, and we never share your information without your consent."
    }
  ];

  const toggleFAQ = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Frequently Asked Questions
        </h2>
        <p className="text-xl text-gray-600">
          Everything you need to know about expert calls.
        </p>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="border border-gray-200 rounded-lg overflow-hidden"
          >
            <button
              className="w-full px-6 py-4 text-left flex justify-between items-center bg-white hover:bg-gray-50 transition-colors"
              onClick={() => toggleFAQ(index)}
            >
              <h3 className="text-lg font-medium text-gray-900">
                {faq.question}
              </h3>
              <svg
                className={`w-5 h-5 text-gray-500 transform transition-transform ${
                  activeIndex === index ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
            {activeIndex === index && (
              <div className="px-6 pb-4 bg-white">
                <p className="text-gray-600">{faq.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQSection;
