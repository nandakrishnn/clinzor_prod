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

export default function FAQsTwo() {
  const [faq, setFaq] = useState<FaqItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const getAllFaq = async () => {
    try {
      const res = await getFaq();
      if (res.status === 200 && res.data?.data?.length > 0) {
        setFaq(res.data.data);
      } else {
        setFaq([]);
      }
    } catch (error) {
      console.log(error, 'error from faq part');
      setFaq([]);
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
