"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { ArrowRight, BookOpen, Briefcase, Newspaper } from "lucide-react";

import { Button } from "@/components/ui/button";
import { fallbackInsightsFeed } from "@/content/legalInsights";
import {
  fadeUpVariants,
  staggerContainerVariants,
  staggerItemVariants,
} from "@/lib/animations";
import { localizeHref } from "@/i18n/routing";

const previewGroupsBase = [
  {
    key: "case-studies",
    label: "Case Studies",
    title: fallbackInsightsFeed.caseStudies[0]?.title ?? "",
    summary: fallbackInsightsFeed.caseStudies[0]?.summary ?? "",
    sourceName: fallbackInsightsFeed.caseStudies[0]?.sourceName ?? "",
    href: "/insights?view=case-studies&from=home-insights",
    icon: Briefcase,
  },
  {
    key: "news",
    label: "News",
    title: fallbackInsightsFeed.news[0]?.title ?? "",
    summary: fallbackInsightsFeed.news[0]?.summary ?? "",
    sourceName: fallbackInsightsFeed.news[0]?.sourceName ?? "",
    href: "/insights?view=news&from=home-insights",
    icon: Newspaper,
  },
  {
    key: "analysis",
    label: "Analysis",
    title: fallbackInsightsFeed.blogs[0]?.title ?? "",
    summary: fallbackInsightsFeed.blogs[0]?.summary ?? "",
    sourceName: fallbackInsightsFeed.blogs[0]?.sourceName ?? "",
    href: "/insights?view=analysis&from=home-insights",
    icon: BookOpen,
  },
] as const;

export function InsightsPreviewSection() {
  const pathname = usePathname();
  const tInsightsPreview = useTranslations("insightsPreview");
  const previewGroups = [
    {
      ...previewGroupsBase[0],
      label: tInsightsPreview("caseStudies"),
    },
    {
      ...previewGroupsBase[1],
      label: tInsightsPreview("news"),
    },
    {
      ...previewGroupsBase[2],
      label: tInsightsPreview("analysis"),
    },
  ];

  return (
    <section
      id="insights"
      className="relative overflow-hidden border-t border-zinc-100 bg-white py-16 md:py-24"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(0,0,0,0.03),transparent_48%)]" />

      <div className="container-wide relative z-10">
        <motion.div
          variants={fadeUpVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mb-12 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between"
        >
          <div className="max-w-3xl">
            <div className="mb-4 flex items-center gap-3">
              <div className="h-px w-10 bg-zinc-300" />
              <span className="text-xs font-semibold uppercase tracking-[0.24em] text-zinc-500">
                {tInsightsPreview("title")}
              </span>
            </div>
            <h2 className="text-4xl font-serif font-medium leading-[1.08] tracking-tight text-zinc-950 md:text-5xl">
              {tInsightsPreview("heading").split(",")[0]},
              <br />
              <span className="text-zinc-400 italic font-light">
                {tInsightsPreview("heading").split(",").slice(1).join(",").trim()}
              </span>
            </h2>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-zinc-600">
              {tInsightsPreview("subtitle")}
            </p>
          </div>

          <Button
            asChild
            className="h-12 rounded-full bg-black px-7 text-white hover:bg-zinc-800"
          >
            <Link href={localizeHref(pathname, "/insights?from=home-insights")}>
              {tInsightsPreview("openAll")}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </motion.div>

        <motion.div
          variants={staggerContainerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid gap-6 lg:grid-cols-3"
        >
          {previewGroups.map((group) => (
            <motion.article
              key={group.key}
              variants={staggerItemVariants}
              className="rounded-[2rem] border border-zinc-200 bg-zinc-50 p-6 shadow-sm transition-all duration-300 hover:border-zinc-300 hover:bg-white hover:shadow-xl"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-zinc-200 bg-white text-zinc-900 shadow-sm">
                  <group.icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-zinc-500">
                    {group.label}
                  </p>
                  <p className="mt-1 text-xs text-zinc-400">{group.sourceName}</p>
                </div>
              </div>

              <h3 className="mt-6 text-2xl font-serif font-medium leading-tight text-zinc-950">
                {group.title}
              </h3>
              <p className="mt-4 text-base leading-relaxed text-zinc-600">
                {group.summary}
              </p>

              <Button
                asChild
                variant="outline"
                className="mt-6 h-11 rounded-full border-zinc-200 bg-white px-6 text-zinc-900 hover:bg-zinc-50"
              >
                <Link href={localizeHref(pathname, group.href)}>
                  {tInsightsPreview("seeMore")}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
