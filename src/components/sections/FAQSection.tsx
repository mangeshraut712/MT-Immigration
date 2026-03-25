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
      className="section-padding relative overflow-hidden bg-background"
    >
      <div className="absolute inset-0 bg-gradient-subtle" />

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
            <div className="h-px w-12 bg-border"></div>
            <span className="text-sm font-semibold tracking-widest uppercase text-muted-foreground">
              {tFaq("title")}
            </span>
            <div className="h-px w-12 bg-border"></div>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-medium tracking-tight text-foreground mb-6 leading-[1.1]">
            {tFaq("heading").split(" ").slice(0, 2).join(" ")} <br />
            <span className="text-zinc-400 italic dark:text-zinc-500">
              {tFaq("heading").split(" ").slice(2).join(" ")}
            </span>
          </h2>
          <p className="mx-auto max-w-2xl text-xl leading-relaxed text-muted-foreground">
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
                <div className="flex h-10 w-10 items-center justify-center rounded-full border border-border/70 bg-muted">
                  <HelpCircle className="h-5 w-5 text-foreground" />
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
                      className="surface-panel rounded-2xl px-4 shadow-sm transition-all duration-300 hover:border-border md:px-6 data-[state=open]:border-border data-[state=open]:shadow-md data-[state=open]:bg-muted/35"
                    >
                      <AccordionTrigger className="rounded-lg py-5 text-left text-base font-semibold text-foreground transition-colors hover:text-foreground hover:no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset md:py-6 md:text-lg">
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
