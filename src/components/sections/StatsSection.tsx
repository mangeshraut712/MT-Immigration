'use client';

import { motion } from 'framer-motion';
import { FileCheck, Shield, Gavel, Globe, Check } from 'lucide-react';

const highlights = [
  {
    label: 'Direct Attorney Access',
    description: 'You speak with the lawyer responsible for strategy and filing decisions.',
    icon: Gavel,
  },
  {
    label: 'Case-Ready Intake',
    description: 'Structured intake helps surface deadlines, filings, and urgent issues early.',
    icon: FileCheck,
  },
  {
    label: 'Security-First Communication',
    description: 'Forms and chat now run through validated server-side routes with rate limiting.',
    icon: Shield,
  },
  {
    label: 'Virtual Nationwide',
    description: 'Consultations can be handled remotely for clients across the United States.',
    icon: Globe,
  },
];

const features = ['Transparent consultation fees', 'Interpreter-friendly support', 'Urgent matters prioritized'];

export function StatsSection() {
  return (
    <section className="relative overflow-hidden bg-zinc-950 py-16 text-white md:py-20">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/20 to-transparent" />
      <div className="absolute inset-0 bg-[radial-gradient(#ffffff15_1px,transparent_1px)] [background-size:24px_24px] opacity-20" />

      <div className="container-wide relative z-10">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: '-100px' }}
          className="mb-12 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4"
        >
          {highlights.map((highlight, index) => (
            <motion.div
              key={highlight.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08, type: 'spring', stiffness: 100 }}
              className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm"
            >
              <div className="mb-4 inline-flex rounded-2xl bg-white/10 p-4">
                <highlight.icon className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold tracking-tight">{highlight.label}</h3>
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
          className="flex flex-wrap items-center justify-center gap-6 md:gap-10"
        >
          {features.map((feature) => (
            <div key={feature} className="flex items-center gap-2 text-white/80">
              <Check className="h-5 w-5 text-green-400" />
              <span className="text-sm font-medium">{feature}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
