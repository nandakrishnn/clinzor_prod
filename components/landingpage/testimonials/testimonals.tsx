"use client";

import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";

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
      "Booking my appointment was effortless, and the clinic details were so clear. I found a pediatrician within 10 minutes.",
  },
  {
    name: "Rahul Singh",
    role: "Father & Caregiver",
    image: "https://randomuser.me/api/portraits/men/15.jpg",
    quote:
      "I didn’t even know there was a 24/7 clinic near me. This app helped me find it during an emergency at midnight!",
  },
  {
    name: "Linda George",
    role: "Fitness Coach",
    image: "https://randomuser.me/api/portraits/women/12.jpg",
    quote:
      "The platform filters are amazing. I could search based on specialties, services, and even distance. Super useful!",
  },
  {
    name: "Dr. Naveen Rao",
    role: "Cardiologist",
    image: "https://randomuser.me/api/portraits/men/22.jpg",
    quote:
      "Our clinic saw a 30% increase in bookings within the first month. This platform connects patients directly and seamlessly.",
  },
  {
    name: "Sara Thomas",
    role: "Expecting Mother",
    image: "https://randomuser.me/api/portraits/women/44.jpg",
    quote:
      "Found a maternity specialist just 2 miles away with available slots the same week. This has been a blessing.",
  },
  {
    name: "Vikram Patel",
    role: "Tech Consultant",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
    quote:
      "I finally stopped asking for clinic recommendations on WhatsApp. This made local discovery so easy and trustworthy.",
  },
];

const chunkArray = (array: Testimonial[], chunkSize: number): Testimonial[][] => {
  const result: Testimonial[][] = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    result.push(array.slice(i, i + chunkSize));
  }
  return result;
};

const testimonialChunks = chunkArray(testimonials, Math.ceil(testimonials.length / 3));

export default function WallOfLoveSection() {
  return (
    <section>
      <div className="py-16 md:py-32">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center">
            <motion.h2
              className="text-title text-3xl font-semibold"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false }}
              transition={{ duration: 0.6 }}
            >
              Trusted by Patients Everywhere
            </motion.h2>
            <motion.p
              className="text-body mt-6 text-muted-foreground"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              Real stories from users who’ve discovered, booked, and visited clinics through our platform.
            </motion.p>
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 md:mt-16">
            {testimonialChunks.map((chunk, chunkIndex) => (
              <div key={chunkIndex} className="space-y-6">
                {chunk.map(({ name, role, quote, image }, index) => {
                  const ref = useRef(null);
                  const isInView = useInView(ref, {
                    once: false, // 👈 scroll-triggered animation retriggers
                    margin: "0px 0px -50px 0px",
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
                      <Card className="border-none shadow-none bg-white dark:bg-zinc-900">
                        <CardContent className="grid grid-cols-[auto_1fr] gap-3 pt-6">
                          <Avatar className="size-9">
                            <AvatarImage alt={name} src={image} loading="lazy" />
                            <AvatarFallback>ST</AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-medium">{name}</h3>
                            <span className="text-muted-foreground block text-sm tracking-wide">{role}</span>
                            <blockquote className="mt-3">
                              <p className="text-gray-700 dark:text-gray-300">{quote}</p>
                            </blockquote>
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
      </div>
    </section>
  );
}
