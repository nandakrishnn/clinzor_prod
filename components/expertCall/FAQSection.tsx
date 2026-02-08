import React, { useState, useEffect } from "react";
import { getFaq } from "@/service/user/home";

type FaqItem = {
  uuid: string;
  question: string;
  answer: string;
};

const FAQSection = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [faqs, setFaqs] = useState<FaqItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchFaqs = async () => {
    try {
      const res = await getFaq();
      if (res.status === 200 && res.data?.data?.length > 0) {
        setFaqs(res.data.data);
      } else {
        setFaqs([]);
      }
    } catch (error) {
      console.error("Error fetching FAQs:", error);
      setFaqs([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFaqs();
  }, []);

  const toggleFAQ = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primaryColor"></div>
      </div>
    );
  }

  if (faqs.length === 0) {
    return null; // Or show a default message if preferred
  }

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
            key={faq.uuid || index}
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
                className={`w-5 h-5 text-gray-500 transform transition-transform ${activeIndex === index ? "rotate-180" : ""
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
