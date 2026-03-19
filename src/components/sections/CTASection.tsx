"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Phone, ArrowRight, MessageCircle, Calendar } from "lucide-react";
import Link from "next/link";
import { firmConfig } from "@/config/firm";

export function CTASection() {
  const tCta = useTranslations("cta");
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="relative bg-black text-white py-16 md:py-32 overflow-hidden">
      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]" />

      <div className="container-wide relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.5 }}
            className="inline-flex mb-8"
          >
            <div className="px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-xs uppercase tracking-widest font-semibold text-zinc-300">
              {tCta("title")}
            </div>
          </motion.div>

          {/* Heading */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-serif font-medium tracking-tight mb-4 md:mb-6 leading-[1.1]">
              {tCta("heading")}
            </h2>
            <p className="text-base md:text-xl text-zinc-400 mb-8 md:mb-12 max-w-2xl mx-auto leading-relaxed">
              {tCta("subtitle")}
            </p>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center items-center mb-8 md:mb-12"
          >
            <Button
              asChild
              size="lg"
              className="h-12 md:h-14 px-6 md:px-8 text-base md:text-lg rounded-full font-semibold bg-white text-black hover:bg-zinc-200 shadow-xl shadow-white/10 hover:shadow-2xl hover:shadow-white/20 transition-all hover:scale-[1.02] sm:hover:scale-105 group"
            >
              <Link href="#contact" className="flex items-center">
                <Calendar className="mr-2 h-5 w-5" />
                {tCta("ctaPrimary")}
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="h-12 md:h-14 px-6 md:px-8 text-base md:text-lg rounded-full font-semibold border border-white/20 text-white bg-white/5 backdrop-blur-sm hover:bg-white hover:text-black transition-all hover:scale-[1.02] sm:hover:scale-105"
            >
              <a
                href={firmConfig.contact.phoneHref}
                className="flex items-center gap-2"
              >
                <Phone size={18} />
                {tCta("ctaSecondary")}
              </a>
            </Button>
          </motion.div>

          {/* Features grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto"
          >
            {[
              { icon: MessageCircle, text: tCta("feature1") },
              { icon: Calendar, text: tCta("feature2") },
              { icon: Phone, text: tCta("feature3") },
            ].map((item, i) => (
              <div
                key={i}
                className="flex items-center justify-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm"
              >
                <item.icon className="w-5 h-5 text-zinc-400" />
                <span className="text-sm font-medium text-zinc-300">
                  {item.text}
                </span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
