"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";
import { FileCheck, Shield, Gavel, Globe, Check } from "lucide-react";

const features = [
  "Transparent consultation fees",
  "Interpreter-friendly support",
  "Urgent matters prioritized",
];

export function StatsSection() {
  const tStats = useTranslations("stats");
  const shouldReduceMotion = useReducedMotion();
  const translatedHighlights = [
    {
      label: tStats("directAttorney"),
      description: tStats("directAttorneyDesc"),
      icon: Gavel,
    },
    {
      label: tStats("caseReady"),
      description: tStats("caseReadyDesc"),
      icon: FileCheck,
    },
    {
      label: tStats("security"),
      description: tStats("securityDesc"),
      icon: Shield,
    },
    {
      label: tStats("virtual"),
      description: tStats("virtualDesc"),
      icon: Globe,
    },
  ];

  return (
    <section className="relative overflow-hidden bg-zinc-950 py-12 md:py-20 text-white">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/20 to-transparent" />
      <div className="absolute inset-0 bg-[radial-gradient(#ffffff15_1px,transparent_1px)] [background-size:24px_24px] opacity-20" />

      <div className="container-wide relative z-10">
        <motion.div
          initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0 }}
          whileInView={shouldReduceMotion ? { opacity: 1 } : { opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          className="mb-12 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4"
        >
          {translatedHighlights.map((highlight, index) => (
            <motion.div
              key={highlight.label}
              initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                delay: shouldReduceMotion ? 0 : index * 0.08,
                duration: shouldReduceMotion ? 0 : 0.3,
                ease: "easeOut"
              }}
              className="rounded-xl md:rounded-2xl border border-white/10 bg-white/5 p-5 md:p-6 backdrop-blur-sm hover:bg-white/10 transition-colors duration-300"
            >
              <div className="mb-4 inline-flex rounded-2xl bg-white/10 p-4">
                <highlight.icon className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold tracking-tight">
                {highlight.label}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-white/70">
                {highlight.description}
              </p>
            </motion.div>
          ))}
        </motion.div>

        <div className="mb-8 h-px w-full bg-white/10" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="flex flex-wrap items-center justify-center gap-4 md:gap-10"
        >
          {features.map((feature) => (
            <div
              key={feature}
              className="flex items-center gap-2 text-white/80"
            >
              <Check className="h-5 w-5 text-green-400" />
              <span className="text-sm font-medium">{feature}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
