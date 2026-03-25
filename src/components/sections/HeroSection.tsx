"use client";

import { useTranslations } from "next-intl";
import { ArrowRight, Sparkles, Phone, Clock, FileText } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function HeroSection() {
  const tHero = useTranslations("hero");

  return (
    <section className="relative flex min-h-[calc(100svh-4rem)] items-center justify-center overflow-hidden bg-gradient-subtle md:min-h-[90vh]">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(15,23,42,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(15,23,42,0.03)_1px,transparent_1px)] bg-[size:72px_72px] opacity-70 [mask-image:radial-gradient(ellipse_60%_60%_at_50%_0%,black_40%,transparent_100%)]" />
      <div className="absolute left-1/2 top-0 h-[28rem] w-[28rem] -translate-x-1/2 rounded-full bg-zinc-200/45 blur-[110px]" />

      <div className="container-wide relative z-10 py-20 text-center sm:py-24 md:pt-32 md:pb-20">
        {/* Badge */}
        <div className="mb-8 inline-flex">
          <Badge
            variant="secondary"
            className="glass rounded-full border-border/70 px-5 py-2.5 text-sm font-medium text-muted-foreground shadow-sm backdrop-blur-xl"
          >
            <Sparkles className="mr-2 h-4 w-4 text-foreground fill-foreground/15" />
            {tHero("badge")}
          </Badge>
        </div>

        {/* Main headline */}
        <h1 className="mb-8 text-4xl font-serif font-medium leading-[1.02] tracking-tight sm:text-5xl md:text-7xl lg:text-8xl">
          <span className="text-foreground drop-shadow-sm">{tHero("title")}</span>
          <br />
          <span className="text-zinc-500 italic font-light">
            with{" "}
            <span className="relative inline-block font-medium text-foreground not-italic">
              {tHero("titleHighlight")}
              <span
                aria-hidden
                className="absolute -bottom-1 left-0 right-0 h-[2px] origin-left bg-zinc-300"
              />
            </span>
          </span>
        </h1>

        {/* Subheadline */}
        <p className="mx-auto mb-12 max-w-3xl text-balance text-lg leading-relaxed text-muted-foreground sm:text-xl md:text-2xl">
          {tHero("subtitle")}
        </p>

        {/* CTA Buttons */}
        <div className="mb-14 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:gap-4">
          <Button
            asChild
            size="lg"
            className="group h-12 rounded-full bg-foreground px-6 text-base font-semibold text-background shadow-xl shadow-zinc-900/10 transition-all hover:scale-[1.02] hover:opacity-92 hover:shadow-2xl hover:shadow-zinc-900/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 sm:h-14 sm:px-8 sm:text-lg sm:hover:scale-105"
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
            className="h-12 rounded-full border-border/70 bg-background/70 px-6 text-base font-semibold text-foreground shadow-sm backdrop-blur-sm transition-all hover:scale-[1.02] hover:bg-background hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 sm:h-14 sm:px-8 sm:text-lg sm:hover:scale-105"
          >
            <Link href="#services" className="flex items-center justify-center">
              {tHero("ctaSecondary")}
            </Link>
          </Button>
        </div>

        {/* Refined Trust indicators */}
        <div className="flex flex-col items-center justify-center gap-2 text-xs font-medium text-zinc-500 sm:flex-row sm:flex-wrap sm:gap-x-6 sm:gap-y-3 sm:text-sm">
          <div className="glass flex items-center gap-1.5 rounded-full px-3 py-1.5 sm:gap-2 sm:px-4 sm:py-2">
            <Phone size={14} className="text-foreground sm:hidden" />
            <Phone size={16} className="hidden text-foreground sm:block" />
            <span>{tHero("directAccess")}</span>
          </div>
          <div className="glass flex items-center gap-1.5 rounded-full px-3 py-1.5 sm:gap-2 sm:px-4 sm:py-2">
            <Clock size={14} className="text-foreground sm:hidden" />
            <Clock size={16} className="hidden text-foreground sm:block" />
            <span>{tHero("responseTime")}</span>
          </div>
          <div className="glass flex items-center gap-1.5 rounded-full px-3 py-1.5 sm:gap-2 sm:px-4 sm:py-2">
            <FileText size={14} className="text-foreground sm:hidden" />
            <FileText size={16} className="hidden text-foreground sm:block" />
            <span>{tHero("transparentFees")}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
