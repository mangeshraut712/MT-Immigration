"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";
import { CheckCircle2 } from "lucide-react";

import {
  fadeUpVariants,
  scaleVariants,
  staggerContainerVariants,
} from "@/lib/animations";

type ClientExpectation = {
  title: string;
  description: string;
  label: string;
};

export function TestimonialsSection() {
  const tTestimonials = useTranslations("testimonials");
  const shouldReduceMotion = useReducedMotion();
  const clientExpectations = tTestimonials.raw("items") as ClientExpectation[];

  return (
    <section
      id="testimonials"
      className="relative overflow-hidden bg-zinc-50 section-padding"
    >
      <div className="absolute inset-0 bg-white/50" />
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-zinc-100 blur-[100px]" />

      <div className="container-wide relative z-10">
        <motion.div
          initial={shouldReduceMotion ? "visible" : "hidden"}
          whileInView="visible"
          viewport={{ once: true }}
          variants={shouldReduceMotion ? {} : fadeUpVariants}
          className="mx-auto mb-16 max-w-3xl text-center"
        >
          <div className="mb-6 flex items-center justify-center gap-3">
            <div className="h-px w-12 bg-zinc-300" />
            <span className="text-sm font-semibold uppercase tracking-widest text-zinc-500">
              {tTestimonials("title")}
            </span>
            <div className="h-px w-12 bg-zinc-300" />
          </div>
          <h2 className="mb-6 text-3xl md:text-5xl lg:text-6xl font-serif font-medium leading-[1.1] text-foreground">
            {tTestimonials("heading").split(". ")[0]} <br />
            <span className="italic text-zinc-400">
              {tTestimonials("heading").split(". ").slice(1).join(". ")}
            </span>
          </h2>
          <p className="mx-auto max-w-2xl text-xl leading-relaxed text-zinc-500 text-balance">
            {tTestimonials("subtitle")}
          </p>
        </motion.div>

        <motion.div
          variants={shouldReduceMotion ? {} : staggerContainerVariants}
          initial={shouldReduceMotion ? "visible" : "hidden"}
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid gap-8 md:grid-cols-2"
        >
          {clientExpectations.map((item) => (
            <motion.div key={item.title} variants={scaleVariants}>
              <div className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-zinc-100 bg-white p-6 md:p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-full bg-zinc-100 text-zinc-900">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-600">
                  {item.label}
                </p>
                <h3 className="mt-3 text-2xl font-serif font-medium text-foreground">
                  {item.title}
                </h3>
                <p className="mt-4 text-lg leading-relaxed text-zinc-600">
                  {item.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
