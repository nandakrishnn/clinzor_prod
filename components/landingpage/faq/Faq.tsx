'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import Link from 'next/link';

export default function FAQsTwo() {
  const faqItems = [
    {
      id: 'item-1',
      question: 'How do I book an appointment?',
      answer:
        'You can search for clinics by specialty, service type, or location. Once you find the right provider, click “Book Appointment” and select your preferred date and time.',
    },
    {
      id: 'item-2',
      question: 'Is this platform free to use?',
      answer:
        'Yes! Browsing clinics and booking appointments is completely free for users. Clinics may charge fees for consultations, which will be displayed upfront.',
    },
    {
      id: 'item-3',
      question: 'Can I reschedule or cancel my booking?',
      answer:
        'Yes, you can reschedule or cancel from your profile dashboard. Changes are allowed up to 24 hours before your scheduled time, depending on clinic policies.',
    },
    {
      id: 'item-4',
      question: 'How do I know if a clinic is verified?',
      answer:
        'Verified clinics display a badge on their profile. Our team manually verifies credentials, licensing, and patient reviews to ensure quality and trust.',
    },
    {
      id: 'item-5',
      question: 'Are online consultations available?',
      answer:
        'Yes. Many clinics offer telehealth services. Use the filter “Online Consultation” when searching to find providers who support virtual appointments.',
    },
  ];

  return (
    <section className="py-16 md:py-24">
      <div className="mx-auto max-w-5xl px-4 md:px-6">
        <div className="mx-auto max-w-xl text-center">
          <h2 className="text-balance text-3xl font-bold md:text-4xl lg:text-5xl">
            Frequently Asked Questions
          </h2>
          <p className="text-muted-foreground mt-4 text-balance">
            Everything you need to know about using our clinic platform — from booking to rescheduling, and more.
          </p>
        </div>

        <div className="mx-auto mt-12 max-w-xl">
          <Accordion
            type="single"
            collapsible
            className="bg-card ring-muted w-full rounded-2xl border px-8 py-3 shadow-sm ring-4 dark:ring-0"
          >
            {faqItems.map((item) => (
              <AccordionItem key={item.id} value={item.id} className="border-dashed">
                <AccordionTrigger className="cursor-pointer text-base hover:no-underline">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent>
                  <p className="text-base">{item.answer}</p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <p className="text-muted-foreground mt-6 px-8 text-center">
            Still have questions? Reach out to our{' '}
            <Link href="#" className="text-primary font-medium hover:underline">
              support team
            </Link>{' '}
            — we're here to help.
          </p>
        </div>
      </div>
    </section>
  );
}
