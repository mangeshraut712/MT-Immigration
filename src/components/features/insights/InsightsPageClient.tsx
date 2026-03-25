"use client";

import { startTransition, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Clock3,
  ExternalLink,
  Newspaper,
  RefreshCw,
  TrendingUp,
  BookOpen,
  Zap,
  Briefcase,
  Sparkles,
  ChevronRight,
} from "lucide-react";

import {
  createInsightSlug,
  editorialNote,
  firmAnnouncements,
  type InsightHeadline,
  type InsightStory,
  type InsightsFeedData,
} from "@/content/legalInsights";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";
import {
  fadeUpVariants,
  slideLeftVariants,
  staggerContainerVariants,
  staggerItemVariants,
} from "@/lib/animations";
import { localizeHref } from "@/i18n/routing";

const INSIGHTS_REQUEST_TIMEOUT_MS = 18_000;
const insightViews = [
  { key: "all", label: "All" },
  { key: "case-studies", label: "Case Studies" },
  { key: "news", label: "News" },
  { key: "analysis", label: "Analysis" },
] as const;

type InsightsApiResponse = InsightsFeedData | { error: string };
type InsightsView = (typeof insightViews)[number]["key"];

function StoryMeta({
  category,
  publishedOn,
  readTime,
}: {
  category: string;
  publishedOn: string;
  readTime?: string;
}) {
  return (
    <div className="flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-[0.22em] text-zinc-500">
      <span className="rounded-full border border-zinc-200 bg-zinc-100 px-3 py-1 text-zinc-700">
        {category}
      </span>
      <span>{publishedOn}</span>
      {readTime ? (
        <span className="flex items-center gap-1.5">
          <Clock3 className="h-3.5 w-3.5" />
          {readTime}
        </span>
      ) : null}
    </div>
  );
}

function SourceLink({
  sourceName,
  sourceUrl,
  compact = false,
  tone = "dark",
}: {
  sourceName: string;
  sourceUrl: string;
  compact?: boolean;
  tone?: "dark" | "light";
}) {
  const isExternal =
    sourceUrl.startsWith("http://") || sourceUrl.startsWith("https://");
  const toneClasses =
    tone === "light"
      ? "text-zinc-300 hover:text-white"
      : "text-zinc-700 hover:text-black";

  if (isExternal) {
    return (
      <a
        href={sourceUrl}
        target="_blank"
        rel="noreferrer noopener"
        className={cn(
          "inline-flex items-center gap-1.5 font-medium transition-colors",
          toneClasses,
          compact ? "text-xs" : "text-sm",
        )}
      >
        {sourceName}
        <ExternalLink className="h-3.5 w-3.5" />
      </a>
    );
  }

  return (
    <Link
      href={sourceUrl}
      className={cn(
        "inline-flex items-center gap-1.5 font-medium transition-colors",
        toneClasses,
        compact ? "text-xs" : "text-sm",
      )}
    >
      {sourceName}
    </Link>
  );
}

function NewsCard({ story }: { story: InsightStory }) {
  const pathname = usePathname();

  return (
    <motion.article
      variants={staggerItemVariants}
      className="group relative rounded-[2rem] border border-zinc-200 bg-white p-7 shadow-sm transition-all duration-300 hover:shadow-xl hover:shadow-zinc-200/50"
    >
      <StoryMeta
        category={story.category}
        publishedOn={story.publishedOn}
        readTime={story.readTime}
      />
      <Link
        href={localizeHref(pathname, `/insights/${createInsightSlug(story.title)}`)}
        className="group-hover:underline"
      >
        <h3 className="mt-5 text-2xl font-serif font-medium leading-tight text-zinc-950 transition-colors duration-200 group-hover:text-zinc-700">
          {story.title}
        </h3>
      </Link>
      <p className="mt-4 text-base leading-relaxed text-zinc-600">
        {story.summary}
      </p>
      <div className="mt-5 flex items-center justify-between gap-4 border-t border-zinc-100 pt-4">
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-600">
            {story.topic}
          </span>
        </div>
        <SourceLink
          sourceName={story.sourceName}
          sourceUrl={story.sourceUrl}
          compact
        />
      </div>
    </motion.article>
  );
}

function HeadlineList({
  headlines,
}: {
  headlines: readonly InsightHeadline[];
}) {
  const pathname = usePathname();

  return (
    <div className="mt-4 divide-y divide-zinc-100">
      {headlines.map((story, index) => (
        <motion.article
          key={`${story.title}-${story.publishedOn}`}
          variants={staggerItemVariants}
          className="group py-4 first:pt-0 last:pb-0"
        >
          <div className="flex gap-4">
            <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-zinc-50 border border-zinc-200 font-serif text-lg font-medium text-zinc-400">
              0{index + 1}
            </span>
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500">
                {story.category}
              </p>
              <Link
                href={localizeHref(pathname, `/insights/${createInsightSlug(story.title)}`)}
                className="group-hover:underline"
              >
                <h3 className="mt-1.5 text-lg font-semibold leading-snug text-zinc-900 transition-colors group-hover:text-zinc-600">
                  {story.title}
                </h3>
              </Link>
              <div className="mt-2 flex flex-wrap items-center gap-3">
                <p className="text-sm text-zinc-500">{story.publishedOn}</p>
                <SourceLink
                  sourceName={story.sourceName}
                  sourceUrl={story.sourceUrl}
                  compact
                />
              </div>
            </div>
          </div>
        </motion.article>
      ))}
    </div>
  );
}

function CaseStudyCard({ story }: { story: InsightStory }) {
  const pathname = usePathname();

  return (
    <motion.article
      variants={staggerItemVariants}
      className="rounded-[1.75rem] border border-white/10 bg-white/5 p-7 transition-all duration-300 hover:border-white/20 hover:bg-white/10"
    >
      <StoryMeta
        category={story.category}
        publishedOn={story.publishedOn}
        readTime={story.readTime}
      />
      <Link
        href={localizeHref(pathname, `/insights/${createInsightSlug(story.title)}`)}
        className="group block hover:underline"
      >
        <h3 className="mt-5 text-2xl font-serif font-medium leading-tight text-white">
          {story.title}
        </h3>
      </Link>
      <p className="mt-4 text-base leading-relaxed text-zinc-300">
        {story.summary}
      </p>
      <div className="mt-6 flex flex-col gap-3 border-t border-white/10 pt-5 sm:flex-row sm:items-center sm:justify-between">
        <span className="inline-flex w-fit rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-zinc-300">
          {story.topic}
        </span>
        <SourceLink
          sourceName={story.sourceName}
          sourceUrl={story.sourceUrl}
          compact
          tone="light"
        />
      </div>
    </motion.article>
  );
}

function findTopicHref(feed: InsightsFeedData, topic: string) {
  const entries = [
    feed.featured,
    ...feed.news,
    ...feed.blogs,
    ...feed.caseStudies,
  ];
  const normalizedTopic = topic.trim().toLowerCase();

  const matchedEntry = entries.find((entry) => {
    const title = entry.title.toLowerCase();
    const entryTopic = entry.topic.toLowerCase();
    const category = entry.category.toLowerCase();

    return (
      entryTopic === normalizedTopic ||
      title.includes(normalizedTopic) ||
      category.includes(normalizedTopic)
    );
  });

  return matchedEntry
    ? `/insights/${createInsightSlug(matchedEntry.title)}`
    : "#news";
}

export function InsightsPageClient({
  initialFeed,
  initialView = "all",
  returnHref,
}: {
  initialFeed: InsightsFeedData;
  initialView?: string;
  returnHref?: string;
}) {
  const pathname = usePathname();
  const [feed, setFeed] = useState(initialFeed);
  const [isRefreshing, setIsRefreshing] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [activeView, setActiveView] = useState<InsightsView>(
    insightViews.some((view) => view.key === initialView)
      ? (initialView as InsightsView)
      : "all",
  );

  useEffect(() => {
    let ignore = false;
    const controller = new AbortController();
    const timeout = window.setTimeout(
      () => controller.abort(),
      INSIGHTS_REQUEST_TIMEOUT_MS,
    );

    async function refreshInsights() {
      try {
        const response = await fetch("/api/insights", {
          method: "GET",
          cache: "no-store",
          signal: controller.signal,
        });

        const data = (await response
          .json()
          .catch(() => null)) as InsightsApiResponse | null;

        if (!response.ok) {
          const message =
            data && "error" in data
              ? data.error
              : `Could not refresh insights (${response.status}).`;
          throw new Error(message);
        }

        if (!data || "error" in data || ignore) {
          return;
        }

        startTransition(() => {
          setFeed(data);
        });
        setLoadError(null);
      } catch (error) {
        if (ignore) {
          return;
        }

        if (error instanceof DOMException && error.name === "AbortError") {
          setLoadError(
            "Refreshing the live public-source feed took too long. Showing the last verified snapshot.",
          );
          return;
        }

        setLoadError(
          error instanceof Error
            ? `${error.message} Showing the last verified snapshot.`
            : "Could not refresh the live public-source feed. Showing the last verified snapshot.",
        );
      } finally {
        if (!ignore) {
          setIsRefreshing(false);
        }
        window.clearTimeout(timeout);
      }
    }

    void refreshInsights();

    return () => {
      ignore = true;
      controller.abort();
      window.clearTimeout(timeout);
    };
  }, []);

  const isLive = feed.source === "live";
  const showAll = activeView === "all";
  const showCaseStudies = showAll || activeView === "case-studies";
  const showNews = showAll || activeView === "news";
  const showAnalysis = showAll || activeView === "analysis";

  return (
    <div className="bg-white">
      {/* ─── Hero Section ─── */}
      <section className="relative overflow-hidden pt-24 sm:pt-28 bg-[#fdfdfc]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(0,0,0,0.02),transparent_60%)]" />

        <div className="container-wide relative z-10 pb-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
            className="mx-auto max-w-4xl text-center"
          >
            <div className="inline-flex items-center gap-3 mb-8">
              <div className="px-5 py-2.5 text-xs font-semibold uppercase tracking-widest text-zinc-600 bg-white border border-zinc-200 rounded-full shadow-sm flex items-center gap-2">
                <Newspaper className="h-4 w-4 text-zinc-400" />
                Insights
                {isLive ? (
                  <span className="relative flex h-2 w-2 ml-1">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                  </span>
                ) : null}
              </div>
            </div>
            <div className="mb-6 flex justify-center">
              <Button
                asChild
                variant="outline"
                className="h-10 rounded-full border-zinc-200 bg-white px-5 text-zinc-900 hover:bg-zinc-50"
              >
                <Link href={returnHref || "/"}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to main site
                </Link>
              </Button>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-7xl font-serif font-medium tracking-tight text-foreground leading-[1.1]">
              Case studies, news,
              <br />
              <span className="text-zinc-400 italic font-light">
                and practical reads
              </span>{" "}
              <br className="sm:hidden" />
              in one place.
            </h1>

            <p className="mx-auto mt-8 max-w-3xl text-lg leading-relaxed text-zinc-500 sm:text-xl">
              {feed.overview}
            </p>

            {/* Topic pills */}
            <motion.div
              variants={staggerContainerVariants}
              initial="hidden"
              animate="visible"
              className="mt-10 flex flex-wrap justify-center gap-2"
            >
              {feed.topics.map((topic) => (
                <motion.span
                  key={topic}
                  variants={staggerItemVariants}
                  className="rounded-full border border-zinc-200 bg-zinc-50 px-4 py-2 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-900"
                >
                  {topic}
                </motion.span>
              ))}
            </motion.div>

            {/* Status bar */}
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <span
                className={cn(
                  "inline-flex items-center gap-2.5 rounded-full px-4 py-2 text-xs font-medium border uppercase tracking-widest",
                  isLive
                    ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                    : "border-zinc-200 bg-zinc-50 text-zinc-800",
                )}
              >
                {isRefreshing ? (
                  <Spinner className="size-3" />
                ) : (
                  <RefreshCw className="h-3 w-3" />
                )}
                {isLive
                  ? `Live public-source desk updated ${feed.updatedAtLabel}`
                  : `Verified public-source snapshot ${feed.updatedAtLabel}`}
              </span>
              {loadError ? (
                <span className="text-xs text-zinc-500 mt-2 sm:mt-0">
                  {loadError}
                </span>
              ) : null}
            </div>
          </motion.div>
        </div>
      </section>

      <section className="border-t border-zinc-100 bg-white py-6">
        <div className="container-wide">
          <div className="flex flex-wrap items-center justify-center gap-2">
            {insightViews.map((view) => {
              const isActive = activeView === view.key;

              return (
                <button
                  key={view.key}
                  type="button"
                  onClick={() => setActiveView(view.key)}
                  className={cn(
                    "rounded-full border px-4 py-2 text-sm font-medium transition-all",
                    isActive
                      ? "border-black bg-black text-white"
                      : "border-zinc-200 bg-zinc-50 text-zinc-600 hover:border-zinc-300 hover:bg-white hover:text-black",
                  )}
                >
                  {view.label}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── Featured + Sidebar ─── */}
      {showAll ? (
      <section className="pb-10 bg-zinc-50 pt-10 border-t border-zinc-100">
        <div className="container-wide">
          <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr] xl:items-start">
            <div className="space-y-6">
              {/* Featured story */}
              <motion.article
                id="featured-story"
                variants={fadeUpVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="group relative rounded-[2rem] border border-zinc-200 bg-white shadow-xl shadow-zinc-200/40 p-8 sm:p-10 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-3">
                    <span className="inline-flex items-center gap-2 rounded-full bg-black px-3.5 py-1.5 text-xs font-semibold uppercase tracking-widest text-white">
                      <TrendingUp className="h-3.5 w-3.5 text-zinc-400" />
                      Featured
                    </span>
                    <StoryMeta
                      category={feed.featured.category}
                      publishedOn={feed.featured.publishedOn}
                      readTime={feed.featured.readTime}
                    />
                  </div>

                  <Link
                    href={localizeHref(
                      pathname,
                      `/insights/${createInsightSlug(feed.featured.title)}`,
                    )}
                    className="hover:underline"
                  >
                    <h2 className="mt-6 max-w-3xl text-3xl font-serif font-medium leading-tight text-zinc-900 sm:text-5xl">
                      {feed.featured.title}
                    </h2>
                  </Link>

                  <p className="mt-4 max-w-3xl text-lg leading-relaxed text-zinc-500">
                    {feed.featured.summary}
                  </p>
                </div>

                <div className="mt-10 flex flex-col gap-4 border-t border-zinc-100 pt-6 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-3">
                    <span className="rounded-full bg-zinc-100 border border-zinc-200 px-3 py-1 text-xs font-medium uppercase tracking-widest text-zinc-600">
                      {feed.featured.topic}
                    </span>
                    <SourceLink
                      sourceName={feed.featured.sourceName}
                      sourceUrl={feed.featured.sourceUrl}
                    />
                  </div>
                  <Button
                    asChild
                    className="h-12 rounded-full bg-black px-8 text-white hover:bg-zinc-800 transition-all font-medium"
                  >
                    <Link href="#case-studies">
                      See case studies
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </motion.article>

              <motion.div
                variants={fadeUpVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="rounded-[2rem] border border-zinc-200 bg-white p-6 shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <Sparkles className="h-5 w-5 text-zinc-900" />
                  <h2 className="text-xl font-serif font-medium tracking-tight text-zinc-900">
                    Topic Tracks
                  </h2>
                </div>
                <p className="mt-3 max-w-3xl text-base leading-relaxed text-zinc-500">
                  Entry points tied to the source-backed stories already on this
                  page, not generic AI topic pages.
                </p>
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  {feed.topics.slice(0, 4).map((topic) => (
                    <Link
                      key={topic}
                      href={findTopicHref(feed, topic)}
                      className="group flex items-center justify-between rounded-xl border border-zinc-200 p-4 transition-all hover:border-black hover:bg-zinc-50"
                    >
                      <span className="font-medium text-zinc-800">{topic}</span>
                      <ChevronRight className="h-4 w-4 text-zinc-400 group-hover:text-black" />
                    </Link>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Sidebar — Headlines + Source Notes */}
            <div className="space-y-6">
              <motion.div
                id="top-headlines"
                variants={fadeUpVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="rounded-[2rem] border border-zinc-200 bg-white p-6 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500">
                    Source Watch
                  </p>
                  <Zap className="h-4 w-4 text-zinc-400" />
                </div>
                <motion.div
                  variants={staggerContainerVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                >
                  <HeadlineList headlines={feed.headlines} />
                </motion.div>
              </motion.div>

              <motion.div
                id="firm-notes"
                variants={fadeUpVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="rounded-[2rem] bg-black p-6 text-white shadow-xl shadow-zinc-900/10"
              >
                <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400">
                  Source Standards
                </p>
                <motion.div
                  variants={staggerContainerVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  className="mt-6 space-y-4"
                >
                  {firmAnnouncements.map((announcement) => (
                    <motion.div
                      key={announcement.title}
                      variants={staggerItemVariants}
                      className="group rounded-[1.5rem] border border-white/10 bg-white/5 p-4 transition-all duration-200 hover:bg-white/10"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <ArrowRight className="h-3 w-3 text-zinc-300 transition-transform group-hover:translate-x-0.5" />
                        </div>
                        <div>
                          <h3 className="text-sm font-semibold text-white">
                            {announcement.title}
                          </h3>
                          <p className="mt-1 text-sm leading-relaxed text-zinc-400">
                            {announcement.detail}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
      ) : null}

      {/* ─── Client Case Studies ─── */}
      {showCaseStudies ? (
      <section id="case-studies" className="py-16 bg-zinc-950 text-white">
        <div className="container-wide">
          <div className="mb-10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-px w-8 bg-zinc-700"></div>
              <span className="text-xs font-semibold tracking-widest uppercase text-zinc-400">
                Public Decisions
              </span>
            </div>
            <h2 className="text-3xl font-serif tracking-tight">Case Studies</h2>
          </div>
          <div className="mb-8 flex max-w-3xl items-start gap-3 rounded-[1.5rem] border border-white/10 bg-white/5 p-5">
            <Briefcase className="mt-0.5 h-5 w-5 flex-shrink-0 text-zinc-400" />
            <p className="text-sm leading-relaxed text-zinc-300">
              These cards summarize public decisions and real-world immigration
              fact patterns, not private client victories. They are meant to
              show how timing, evidence, and procedural posture affect outcomes
              in practice.
            </p>
          </div>
          <motion.div
            variants={staggerContainerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid gap-6 lg:grid-cols-3"
          >
            {feed.caseStudies.map((story) => (
              <CaseStudyCard
                key={`${story.title}-${story.publishedOn}`}
                story={story}
              />
            ))}
          </motion.div>
        </div>
      </section>
      ) : null}

      {/* ─── Latest News ─── */}
      {showNews ? (
      <section id="news" className="py-12 bg-white">
        <div className="container-wide">
          <motion.div
            variants={slideLeftVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mb-12 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between"
          >
            <div className="max-w-3xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-px w-8 bg-zinc-300"></div>
                <span className="text-xs font-semibold tracking-widest uppercase text-zinc-500">
                  Latest News
                </span>
              </div>
              <h2 className="mt-4 text-4xl md:text-5xl font-serif font-medium tracking-tight text-foreground leading-[1.1]">
                Agency changes and policy movement,{" "}
                <br className="hidden md:block" />
                <span className="text-zinc-400 italic font-light">
                  stripped to what matters.
                </span>
              </h2>
            </div>
            <p className="max-w-xl text-lg leading-relaxed text-zinc-500">
              Short reads focused on filings, timing, and procedural shifts that
              change what clients should do next.
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid gap-6 lg:grid-cols-2"
          >
            {feed.news.map((story) => (
              <NewsCard
                key={`${story.title}-${story.publishedOn}`}
                story={story}
              />
            ))}
          </motion.div>
        </div>
      </section>
      ) : null}

      {/* ─── Blog Notes ─── */}
      {showAnalysis ? (
      <section
        id="blogs"
        className="section-padding bg-zinc-50 border-t border-zinc-100"
      >
        <div className="container-wide">
          <motion.div
            variants={slideLeftVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mb-12 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between"
          >
            <div className="max-w-3xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-px w-8 bg-zinc-300"></div>
                <span className="text-xs font-semibold tracking-widest uppercase text-zinc-500">
                  Analysis & Blogs
                </span>
              </div>
              <h2 className="mt-4 text-4xl md:text-5xl font-serif font-medium tracking-tight text-foreground leading-[1.1]">
                Longer reads when the update <br className="hidden md:block" />
                <span className="text-zinc-400 italic font-light">
                  needs practical context.
                </span>
              </h2>
            </div>
            <p className="max-w-xl text-lg leading-relaxed text-zinc-500">
              Commentary chosen for strategy value, not content volume, so
              readers can move from headline to implication quickly.
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid gap-6 xl:grid-cols-3 lg:grid-cols-2"
          >
            {feed.blogs.map((story) => (
              <NewsCard
                key={`${story.title}-${story.publishedOn}`}
                story={story}
              />
            ))}
          </motion.div>
        </div>
      </section>
      ) : null}

      {/* ─── Editorial CTA ─── */}
      <section className="pb-16 pt-8 bg-zinc-50">
        <div className="container-wide">
          <motion.div
            variants={fadeUpVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-[2.5rem] bg-white border border-zinc-200 p-8 shadow-xl lg:p-14"
          >
            <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between z-10">
              <div className="max-w-3xl">
                <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500">
                  Editorial Note
                </p>
                <h2 className="mt-4 text-3xl md:text-5xl font-serif font-medium leading-[1.1] text-zinc-900">
                  Clean updates are useful. <br />
                  <span className="text-zinc-400 italic font-light">
                    Legal advice is still personal.
                  </span>
                </h2>
                <p className="mt-6 text-lg leading-relaxed text-zinc-500 mb-0">
                  {editorialNote}
                </p>
              </div>
              <Button
                asChild
                className="h-14 rounded-full bg-black px-8 text-lg font-medium text-white hover:bg-zinc-800 shadow-xl transition-all"
              >
                <Link href={localizeHref(pathname, "/#contact")}>
                  Request legal guidance
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>

            {/* Minimalist Watermark/Graphic */}
            <div className="absolute -right-8 -bottom-8 opacity-[0.03] pointer-events-none">
              <BookOpen className="w-96 h-96" />
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
