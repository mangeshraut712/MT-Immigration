"use client";

import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { useTranslations } from "next-intl";
import { ArrowRight, Sparkles, Phone, Clock, FileText } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { popIn } from "@/lib/animations";

export function HeroSection() {
  const tHero = useTranslations("hero");
  const shouldReduceMotion = useReducedMotion();
  const { scrollY } = useScroll();
  const opacity = useTransform(
    scrollY,
    [0, 260],
    [1, shouldReduceMotion ? 1 : 0.78],
  );
  const y = useTransform(scrollY, [0, 260], [0, shouldReduceMotion ? 0 : 40]);

  return (
    <section className="relative flex min-h-[calc(100svh-4rem)] items-center justify-center overflow-hidden bg-white md:min-h-[90vh]">
      {/* Simple, Clean Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(0,0,0,0.03),transparent_50%)]" />

      {/* Subtle Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.01)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_0%,black_40%,transparent_100%)]" />

      <motion.div
        style={{ opacity, y }}
        className="container-wide relative z-10 py-20 text-center sm:py-24 md:pt-32 md:pb-20"
      >
        {/* Badge */}
        <motion.div
          variants={popIn}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.1 }}
          className="inline-flex mb-8"
        >
          <Badge
            variant="secondary"
            className="px-5 py-2.5 text-sm font-medium glass rounded-full text-zinc-600 border-zinc-200/60 shadow-sm backdrop-blur-xl"
          >
            <Sparkles className="w-4 h-4 mr-2 text-zinc-900 fill-zinc-900/20" />
            {tHero("badge")}
          </Badge>
        </motion.div>

        {/* Main headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.25, 0.1, 0.25, 1] }}
          className="mb-8 text-4xl font-serif font-medium tracking-tight leading-[1.02] sm:text-5xl md:text-7xl lg:text-8xl"
        >
          <span className="text-foreground drop-shadow-sm">{tHero("title")}</span>
          <br />
          <span className="text-zinc-400 italic font-light">
            with{" "}
            <span className="relative inline-block font-medium text-zinc-900 not-italic">
              {tHero("titleHighlight")}
              {/* Simple subtle underline */}
              <motion.span
                aria-hidden
                className="absolute -bottom-1 left-0 right-0 h-[2px] bg-zinc-300 origin-left"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{
                  delay: 0.8,
                  duration: 0.5,
                  ease: [0.22, 1, 0.36, 1],
                }}
              />
            </span>
          </span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="mx-auto mb-12 max-w-3xl text-lg leading-relaxed text-zinc-500 text-balance sm:text-xl md:text-2xl"
        >
          {tHero("subtitle")}
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="mb-14 flex flex-col sm:flex-row items-stretch justify-center gap-3 sm:gap-4"
        >
          <Button
            asChild
            size="lg"
            className="group h-12 sm:h-14 px-6 sm:px-8 text-base sm:text-lg rounded-full font-semibold bg-zinc-900 text-white hover:bg-zinc-800 shadow-xl shadow-zinc-900/10 hover:shadow-2xl hover:shadow-zinc-900/20 transition-all hover:scale-[1.02] sm:hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 focus-visible:ring-offset-2"
          >
            <Link href="#contact" className="flex items-center justify-center">
              {tHero("cta")}
              <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="h-12 sm:h-14 px-6 sm:px-8 text-base sm:text-lg rounded-full font-semibold border-zinc-200 text-zinc-800 bg-white/50 backdrop-blur-sm hover:bg-white hover:text-zinc-900 transition-all hover:scale-[1.02] sm:hover:scale-105 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-2"
          >
            <Link href="#services" className="flex items-center justify-center">
              {tHero("ctaSecondary")}
            </Link>
          </Button>
        </motion.div>

        {/* Refined Trust indicators */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.3 }}
          className="flex flex-col items-center justify-center gap-2 sm:gap-3 text-xs sm:text-sm font-medium text-zinc-500 sm:flex-row sm:flex-wrap sm:gap-x-6 sm:gap-y-3"
        >
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.55 }}
            className="flex items-center gap-1.5 sm:gap-2 rounded-full bg-white/40 px-3 sm:px-4 py-1.5 sm:py-2 glass"
          >
            <Phone size={14} className="text-zinc-900 sm:hidden" />
            <Phone size={16} className="text-zinc-900 hidden sm:block" />
            <span>{tHero("directAccess")}</span>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="flex items-center gap-1.5 sm:gap-2 rounded-full bg-white/40 px-3 sm:px-4 py-1.5 sm:py-2 glass"
          >
            <Clock size={14} className="text-zinc-900 sm:hidden" />
            <Clock size={16} className="text-zinc-900 hidden sm:block" />
            <span>{tHero("responseTime")}</span>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.65 }}
            className="flex items-center gap-1.5 sm:gap-2 rounded-full bg-white/40 px-3 sm:px-4 py-1.5 sm:py-2 glass"
          >
            <FileText size={14} className="text-zinc-900 sm:hidden" />
            <FileText size={16} className="text-zinc-900 hidden sm:block" />
            <span>{tHero("transparentFees")}</span>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}
