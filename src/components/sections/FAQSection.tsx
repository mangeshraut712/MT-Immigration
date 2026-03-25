"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { HelpCircle } from "lucide-react";

type FaqCategory = {
  category: string;
  faqs: {
    question: string;
    answer: string;
  }[];
};

export function FAQSection() {
  const tFaq = useTranslations("faq");
  const faqCategories = tFaq.raw("categories") as FaqCategory[];

  return (
    <section
      id="faq"
      className="section-padding bg-white relative overflow-hidden"
    >
      {/* Solid White Background */}
      <div className="absolute inset-0 bg-white" />

      <div className="container-wide relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16 max-w-3xl mx-auto"
        >
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="h-px w-12 bg-zinc-300"></div>
            <span className="text-sm font-semibold tracking-widest uppercase text-zinc-500">
              {tFaq("title")}
            </span>
            <div className="h-px w-12 bg-zinc-300"></div>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-medium tracking-tight text-foreground mb-6 leading-[1.1]">
            {tFaq("heading").split(" ").slice(0, 2).join(" ")} <br />
            <span className="text-zinc-400 italic">
              {tFaq("heading").split(" ").slice(2).join(" ")}
            </span>
          </h2>
          <p className="text-xl text-zinc-500 leading-relaxed max-w-2xl mx-auto">
            {tFaq("subtitle")}
          </p>
        </motion.div>

        {/* FAQ Categories */}
        <div className="space-y-12 max-w-4xl mx-auto">
          {faqCategories.map((category, categoryIndex) => (
            <motion.div
              key={categoryIndex}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: categoryIndex * 0.1 }}
            >
              {/* Category Header */}
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-zinc-100 flex items-center justify-center">
                  <HelpCircle className="w-5 h-5 text-zinc-900" />
                </div>
                <h3 className="text-2xl font-serif font-medium text-foreground">
                  {category.category}
                </h3>
              </div>

              {/* FAQs */}
              <Accordion type="single" collapsible className="space-y-4">
                {category.faqs.map((faq, faqIndex) => (
                  <motion.div
                    key={faqIndex}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: faqIndex * 0.05 }}
                  >
                    <AccordionItem
                      value={`${categoryIndex}-${faqIndex}`}
                      className="bg-white border border-zinc-100 rounded-2xl px-4 md:px-6 shadow-sm hover:border-zinc-200 transition-all duration-300 data-[state=open]:border-zinc-300 data-[state=open]:shadow-md data-[state=open]:bg-zinc-50"
                    >
                      <AccordionTrigger className="text-left text-base md:text-lg font-semibold hover:text-black transition-colors py-5 md:py-6 hover:no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-inset rounded-lg">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground leading-relaxed pb-5 md:pb-6 text-base px-4 md:px-0">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  </motion.div>
                ))}
              </Accordion>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
