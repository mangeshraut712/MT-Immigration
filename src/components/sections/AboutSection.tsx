"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Quote, Award, Users, Globe, Scale } from "lucide-react";
import { SiteLogo } from "@/components/branding/SiteLogo";

export function AboutSection() {
  const tAbout = useTranslations("about");
  return (
    <section
      id="about"
      className="section-padding relative overflow-hidden bg-gradient-subtle"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(15,23,42,0.04),transparent_50%)] dark:bg-[radial-gradient(circle_at_30%_20%,rgba(248,250,252,0.08),transparent_50%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(15,23,42,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(15,23,42,0.02)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,black_20%,transparent_100%)] dark:bg-[linear-gradient(rgba(248,250,252,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(248,250,252,0.04)_1px,transparent_1px)]" />

      <div className="container-wide relative z-10">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-24 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 50, damping: 20 }}
            className="relative order-2 lg:order-1"
          >
            <div className="relative aspect-[4/5] max-w-md mx-auto lg:mx-0">
              {/* Decorative background elements */}
              <div className="absolute -inset-4 rotate-3 rounded-3xl bg-zinc-200/60 opacity-50 blur-xl dark:bg-zinc-800/60" />
              <div className="absolute -inset-2 -rotate-2 rounded-3xl bg-muted/70" />

              {/* Main image container */}
              <div className="surface-panel relative flex h-full items-center justify-center overflow-hidden rounded-3xl bg-gradient-to-br from-muted to-background">
                <div className="text-center p-8">
                  <div className="surface-inset mx-auto mb-6 w-fit p-5 shadow-lg">
                    <SiteLogo
                      imageClassName="shadow-none border-zinc-200"
                      nameClassName="hidden"
                    />
                  </div>
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-foreground">
                    {tAbout("attorneyLed")}
                  </p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Built for clients who want clarity before the filing goes
                    out.
                  </p>
                </div>
              </div>

              {/* Floating stats card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="surface-panel absolute -bottom-4 -right-4 p-4 md:-bottom-6 md:-right-6 md:p-6"
              >
                <div className="text-2xl font-bold text-foreground">
                  One strategy owner
                </div>
                <div className="text-sm font-medium text-muted-foreground">
                  No handoffs once the matter is underway
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 50, damping: 20 }}
            className="order-1 lg:order-2 space-y-8"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="h-px w-12 bg-border" />
              <span className="text-sm font-semibold tracking-widest uppercase text-muted-foreground">
                {tAbout("title")}
              </span>
            </div>

            <h2 className="text-3xl md:text-5xl lg:text-6xl font-serif font-medium tracking-tight leading-[1.1]">
              {tAbout("heading")}
            </h2>

            <div className="relative mt-8">
              <Quote className="absolute -top-4 -left-4 h-12 w-12 rotate-180 text-zinc-100 dark:text-zinc-800" />
              <blockquote className="border-l-4 border-border pl-4 font-serif text-lg font-light italic leading-relaxed text-foreground md:pl-8 md:text-2xl">
                &ldquo;{tAbout("quote")}&rdquo;
              </blockquote>
            </div>

            <p className="mt-8 text-lg leading-relaxed text-muted-foreground">
              {tAbout("description")}
            </p>

            {/* Credentials with icons */}
            <div className="mt-8 border-t border-border/70 pt-6">
              <h4 className="mb-6 text-sm font-bold uppercase tracking-widest text-muted-foreground">
                {tAbout("credentials")}
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { icon: Scale, text: tAbout("attorneyLed") },
                  { icon: Award, text: tAbout("filingRoadmap") },
                  { icon: Users, text: tAbout("boutique") },
                  { icon: Globe, text: tAbout("virtual") },
                ].map((cred, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 * i }}
                    className="surface-inset group flex items-center gap-3 p-3 transition-all hover:border-border hover:bg-card"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-border/70 bg-muted transition-colors group-hover:bg-foreground">
                      <cred.icon className="h-5 w-5 text-muted-foreground transition-colors group-hover:text-background" />
                    </div>
                    <span className="text-sm font-medium text-foreground">
                      {cred.text}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
