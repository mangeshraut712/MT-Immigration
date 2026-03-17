'use client';

import { motion } from 'framer-motion';
import {
  Briefcase,
  GraduationCap,
  Heart,
  Shield,
  FileText,
  Clock,
  Scale,
  BadgeCheck,
  ArrowRight,
} from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';

const reasons = [
  {
    icon: Scale,
    title: 'One Lawyer, One Strategy',
    description: 'The same attorney owns the case strategy from consultation through the next filing decision.',
  },
  {
    icon: Clock,
    title: 'Deadline-Focused Work',
    description: 'Urgent interviews, court dates, and government response deadlines are treated with priority.',
  },
  {
    icon: BadgeCheck,
    title: 'Clear Scope and Fees',
    description: 'Consultations, filing work, and next steps are framed in plain language before work begins.',
  },
  {
    icon: Shield,
    title: 'Disciplined Intake',
    description: 'The site now validates submissions, keeps the AI key server-side, and rate-limits public forms.',
  },
];

const practiceFocus = [
  {
    icon: Briefcase,
    title: 'Work and status matters',
    summary: 'H-1B, EAD, and change-of-status strategy.',
  },
  {
    icon: GraduationCap,
    title: 'Student pathways',
    summary: 'F-1 planning, status maintenance, and interview prep.',
  },
  {
    icon: Heart,
    title: 'Family-based cases',
    summary: 'Marriage-based filings and family reunification planning.',
  },
  {
    icon: FileText,
    title: 'Humanitarian relief',
    summary: 'Asylum, U visa, and urgent protection-focused matters.',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring' as const, stiffness: 100, damping: 15 },
  },
};

export function WhyChooseUsSection() {
  return (
    <section className="relative overflow-hidden bg-zinc-950 text-zinc-50 section-padding">
      <div className="pointer-events-none absolute -left-1/4 top-0 h-full w-1/2 rounded-full bg-blue-500/5 blur-[100px]" />
      <div className="pointer-events-none absolute -right-1/4 bottom-0 h-full w-1/2 rounded-full bg-indigo-500/5 blur-[100px]" />

      <div className="container-wide relative z-10">
        <div className="grid gap-16 lg:grid-cols-2 lg:gap-24">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ type: 'spring', stiffness: 50 }}
          >
            <div className="mb-6 flex items-center gap-3">
              <div className="h-px w-8 bg-zinc-500" />
              <span className="text-sm font-semibold uppercase tracking-widest text-zinc-400">
                Why Choose M&amp;T
              </span>
            </div>
            <h2 className="mt-4 text-4xl font-serif font-medium leading-[1.1] tracking-tight md:text-5xl lg:text-6xl">
              Solo-practice attention. <br />
              <span className="italic text-zinc-500">Clear legal judgment.</span>
            </h2>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="mt-8 grid gap-6"
            >
              {reasons.map((reason) => (
                <motion.div
                  key={reason.title}
                  variants={itemVariants}
                  className="group flex gap-5 rounded-2xl border border-white/5 bg-zinc-900/50 p-6 backdrop-blur-sm transition-colors hover:border-white/10 hover:bg-zinc-900"
                >
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-zinc-50 text-black shadow-lg shadow-white/10 transition-transform group-hover:scale-110">
                    <reason.icon size={22} />
                  </div>
                  <div>
                    <h3 className="mb-2 text-lg font-semibold">{reason.title}</h3>
                    <p className="text-sm leading-relaxed text-zinc-400">{reason.description}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 }}
              className="mt-10"
            >
              <Button
                asChild
                size="lg"
                className="group h-14 w-full rounded-full bg-white text-lg font-semibold text-zinc-950 shadow-lg transition-all hover:bg-white/90 hover:shadow-xl"
              >
                <Link href="#contact" className="flex items-center justify-center">
                  Request a Case Review
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ type: 'spring', stiffness: 50 }}
          >
            <div className="mb-6 flex items-center gap-3 lg:justify-end">
              <div className="h-px w-8 bg-zinc-500 lg:order-last" />
              <span className="text-sm font-semibold uppercase tracking-widest text-zinc-400">
                Practice Focus
              </span>
            </div>
            <h2 className="mt-4 text-4xl font-serif font-medium leading-[1.1] tracking-tight md:text-5xl lg:text-right lg:text-6xl">
              Built for the matters <br />
              <span className="italic text-zinc-500">people actually lose sleep over.</span>
            </h2>

            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {practiceFocus.map((area, index) => (
                <motion.div
                  key={area.title}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.08 }}
                  className="flex h-full flex-col justify-between rounded-2xl border border-white/5 bg-zinc-900/50 p-8 backdrop-blur-sm transition-all duration-300 hover:border-white/10 hover:bg-zinc-900"
                >
                  <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-zinc-800 text-white shadow-inner transition-colors">
                    <area.icon size={24} />
                  </div>
                  <div>
                    <h3 className="mb-2 text-xl font-medium text-zinc-100">{area.title}</h3>
                    <p className="text-sm leading-relaxed text-zinc-400">{area.summary}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="mt-6 rounded-3xl bg-gradient-to-br from-blue-600 to-blue-800 p-10 text-white shadow-2xl"
            >
              <p className="max-w-xl text-3xl font-serif font-medium leading-tight">
                A boutique practice works best when the lawyer stays close to the file,
                communicates early, and tells clients the hard parts before the filing goes out.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
