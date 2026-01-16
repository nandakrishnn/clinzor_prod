"use client";

import DataPlaceholder from "@/components/common/DataPlaceholder";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion";
import Title from "@/components/ui/title";
import { getFaq } from "@/service/user/home";
import { useEffect, useState } from "react";

type FaqItem = {
  uuid: string;
  question: string;
  answer: string;
};

const staticFaqs: FaqItem[] = [
  {
    uuid: "faq-1",
    question: "How can I book a physiotherapy home visit in Bengaluru through Clinzor?",
    answer: "Booking a home visit is simple. Enter your location in Bengaluru, select 'Physiotherapy' as the service, and browse through top-rated specialists available in your area. You can view their credentials and book a slot directly through the platform."
  },
  {
    uuid: "faq-2",
    question: "Are the physiotherapists on Clinzor certified professionals?",
    answer: "Yes, Clinzor exclusively partners with certified and verified physiotherapy specialists across Bengaluru. Every provider undergoes a rigorous credentialing process to ensure high-quality care and patient safety."
  },
  {
    uuid: "faq-3",
    question: "Do you offer online physiotherapy consultations for patients in Bengaluru?",
    answer: "Absolutely. Clinzor provides a secure telehealth platform for virtual consultations, allowing patients from anywhere in Bengaluru to connect with the best physiotherapists for expert guidance and exercise regimes."
  },
  {
    uuid: "faq-4",
    question: "What conditions do Clinzor's physiotherapy partners treat?",
    answer: "Our partners in Bengaluru specialize in a wide range of treatments, including post-operative rehab, sports injuries, chronic back pain, cervical spondylosis, and neurological rehabilitation."
  }
];

export default function FAQsTwo() {
  const [faq, setFaq] = useState<FaqItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const getAllFaq = async () => {
    try {
      const res = await getFaq();
      if (res.status === 200 && res.data?.data?.length > 0) {
        setFaq(res.data.data);
      } else {
        setFaq(staticFaqs);
      }
    } catch (error) {
      console.log(error, 'error from faq part');
      setFaq(staticFaqs);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getAllFaq()
  }, [])

  if (faq.length === 0) {
    return <DataPlaceholder />
  }

  return (
    <section className="">
      <div className="mx-auto max-w-5xl px-4 md:px-6 ">
        <Title
          title="Frequently Asked Questions"
          subtitle="Find answers to common questions about using our clinic platform."
          description="Frequently Asked Questions"
        />

        <div className="mx-auto mt-12 max-w-3xl ">
          <Accordion
            type="single"
            collapsible
            className="bg-card ring-muted w-full rounded-2xl border px-8 py-3 shadow-sm ring-4 dark:ring-0 bg-white"
          >
            {faq.map((item) => (
              <AccordionItem
                key={item?.uuid}
                value={item?.uuid}
                className="border-dashed"
              >
                <AccordionTrigger className="cursor-pointer text-base hover:no-underline">
                  {item?.question}
                </AccordionTrigger>
                <AccordionContent>
                  <p className="text-base">{item?.answer}</p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <p className="text-muted-foreground mt-6 px-8 text-center">
            Still have questions? Reach out to our{" "}
            <a href="#" className="text-primary font-medium hover:underline">
              support team
            </a>{" "}
            — we're here to help.
          </p>
        </div>
      </div>
    </section>
  );
}
