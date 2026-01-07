"use client";

import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import Title from "@/components/ui/title";

type Testimonial = {
  name: string;
  role: string;
  image: string;
  quote: string;
};

const testimonials: Testimonial[] = [
  {
    name: "Aisha Menon",
    role: "Patient – GreenLife Clinic",
    image: "https://randomuser.me/api/portraits/women/21.jpg",
    quote:
      "Booking my appointment was effortless, and the clinic details were so clear. I found a pediatrician within 10 minutes."
  },
  {
    name: "Rahul Singh",
    role: "Father & Caregiver",
    image: "https://randomuser.me/api/portraits/men/15.jpg",
    quote:
      "I didn’t even know there was a 24/7 clinic near me. This app helped me find it during an emergency at midnight!"
  },
  {
    name: "Linda George",
    role: "Fitness Coach",
    image: "https://randomuser.me/api/portraits/women/12.jpg",
    quote:
      "The platform filters are amazing. I could search based on specialties, services, and even distance. Super useful!"
  }
];

const chunkArray = (
  array: Testimonial[],
  chunkSize: number
): Testimonial[][] => {
  const result: Testimonial[][] = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    result.push(array.slice(i, i + chunkSize));
  }
  return result;
};

const testimonialChunks = chunkArray(
  testimonials,
  Math.ceil(testimonials.length / 3)
);

export default function WallOfLoveSection() {
  return (
    <section>
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center">
          <Title
            title="Trusted by Patients Everywhere"
            subtitle="Real stories from users who’ve discovered, booked, and visited
            clinics through our platform."
            description="What Physiotherapy Customers Say About Clinzor"
          />
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 md:mt-16">
          {testimonialChunks.map((chunk, chunkIndex) => (
            <div key={chunkIndex} className="space-y-6">
              {chunk.map(({ name, role, quote, image }, index) => {
                const ref = useRef(null);
                const isInView = useInView(ref, {
                  once: false, // 👈 scroll-triggered animation retriggers
                  margin: "0px 0px -50px 0px"
                });

                return (
                  <motion.div
                    key={index}
                    ref={ref}
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    whileHover={{ scale: 1.01 }}
                  >
                    <Card className="shadow bg-white border-none">
                      <CardContent className=" gap-3 py-3">
                        <blockquote className="">
                          <p className="text-[#4B5563] text-sm">
                            {quote}
                          </p>
                        </blockquote>
                        <div className="flex items-center gap-3 mt-4">
                          <Avatar className="size-9">
                            <AvatarImage
                              alt={name}
                              src={image}
                              loading="lazy"
                            />
                            <AvatarFallback>ST</AvatarFallback>
                          </Avatar>

                          <div className="">
                            <h3 className="font-medium text-[#111827]">
                              {name}
                            </h3>
                            <span className="text-muted-foreground block text-sm tracking-wide text-[#6B7280] ">
                              {role}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
