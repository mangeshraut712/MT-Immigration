"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useLocale } from "next-intl";
import { ArrowLeft, BookOpen, Clock3, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { localizeHref } from "@/i18n/routing";
import { getRuntimeUiLocale, runtimeUiCopy } from "@/i18n/runtime-ui";
import type { InsightArticlePayload } from "@/content/legalInsights";

export type ArticleData = InsightArticlePayload;

export function ArticlePageClient({ data }: { data: ArticleData }) {
  const locale = useLocale();
  const uiLocale = getRuntimeUiLocale(locale);
  const copy = runtimeUiCopy[uiLocale].article;
  const pathname = usePathname();
  const [shareStatus, setShareStatus] = useState<string | null>(null);

  async function shareArticle() {
    const shareUrl = window.location.href;
    try {
      if (typeof navigator.share === "function") {
        await navigator.share({ title: data.title, url: shareUrl });
        return;
      }
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        return;
      }
    }

    try {
      await navigator.clipboard.writeText(shareUrl);
      setShareStatus(copy.shareCopied);
    } catch {
      setShareStatus(copy.shareUnavailable);
    }
  }

  return (
    <article className="bg-background text-foreground">
      {/* Hero */}
      <header className="bg-gradient-subtle relative overflow-hidden border-b border-border/70 pt-32 sm:pt-40">
        <div className="container-wide relative z-10 pb-16 sm:pb-24">
          <div className="mx-auto max-w-3xl">
            <Link
              href={localizeHref(pathname, "/insights")}
              className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
              {copy.backToInsights}
            </Link>
            <div className="mb-6 flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              <span className="rounded-full bg-muted px-3 py-1 text-foreground">
                {data.category}
              </span>
              <span>{data.publishedOn}</span>
              <span className="flex items-center gap-1.5">
                <Clock3 className="h-3.5 w-3.5" /> {data.readTime}
              </span>
            </div>
            <h1 className="font-serif text-4xl leading-[1.15] tracking-tight text-foreground sm:text-5xl md:text-6xl">
              {data.title}
            </h1>
            {data.safeSourceUrl ? (
              <a
                href={data.safeSourceUrl}
                target="_blank"
                rel="noreferrer noopener"
                className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                {copy.sourceLabel}: {data.sourceName}
              </a>
            ) : (
              <p className="mt-6 text-sm font-medium text-muted-foreground">
                {copy.sourceLabel}: {data.sourceName}
              </p>
            )}
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="container-wide py-16 sm:py-24">
        <div className="mx-auto grid max-w-6xl gap-16 lg:grid-cols-[minmax(0,1fr)_20rem]">
          {/* Main Reading area */}
          <div className="prose prose-zinc max-w-none text-lg leading-relaxed text-muted-foreground prose-a:text-foreground prose-a:underline hover:prose-a:text-foreground dark:prose-invert">
            <p>{data.overview}</p>
            <h2>What changed</h2>
            <p>
              This entry comes from the Knowledge Hub&apos;s {data.kindLabel}{" "}
              stream and is framed around <strong>{data.practicalFocus}</strong>.
              It is intentionally tied to a real public source rather than a
              generic AI-generated article.
            </p>
            <h2>Why it matters in practice</h2>
            <p>
              Immigration strategy usually turns on timing, evidentiary posture,
              and which agency or tribunal controls the next step. Readers
              should compare this update against their current filing stage,
              interview schedule, travel plans, or court calendar before acting
              on it.
            </p>
            <h2>Source to review</h2>
            <p>
              The underlying source for this entry is{" "}
              {data.safeSourceUrl ? (
                <a
                  href={data.safeSourceUrl}
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  {data.sourceName}
                </a>
              ) : (
                data.sourceName
              )}
              . For case-specific action, the source should be reviewed together
              with the client’s notices, filing history, and present eligibility
              posture.
            </p>
            <h2>Suggested next move</h2>
            <ul>
              <li>
                Confirm whether the update affects a live filing, hearing,
                interview, or deadline.
              </li>
              <li>
                Read the source language directly rather than relying on a
                headline alone.
              </li>
              <li>
                Escalate to individualized legal advice before changing travel,
                filing, or work plans.
              </li>
            </ul>

            <div className="mt-16 flex items-center justify-between border-t border-border/70 pt-8">
              <div className="flex flex-col items-start gap-3">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="rounded-full"
                  onClick={() => {
                    void shareArticle();
                  }}
                >
                  <Share2 className="mr-2 h-4 w-4" /> {copy.share}
                </Button>
                {shareStatus ? (
                  <p role="status" className="text-sm text-muted-foreground">
                    {shareStatus}
                  </p>
                ) : null}
              </div>
            </div>
          </div>

          {/* Sidebar / Recommendations */}
          <aside className="space-y-8">
            <div className="surface-panel p-6">
              <div className="mb-6 flex items-center gap-2 border-b border-border/70 pb-4 font-serif text-xl font-medium tracking-tight text-foreground">
                <BookOpen className="h-5 w-5" /> {copy.relatedContent}
              </div>
              <ul className="space-y-6">
                {data.recommendations.map((rec, i) => (
                  <li key={i}>
                    <Link
                      href={localizeHref(pathname, `/insights/${rec.slug}`)}
                      className="group block"
                    >
                      <h4 className="text-base font-medium leading-tight text-foreground transition-colors group-hover:text-foreground group-hover:underline">
                        {rec.title}
                      </h4>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-4xl border border-border/70 bg-foreground p-6 text-background shadow-xl shadow-black/20">
              <h3 className="font-serif text-2xl tracking-tight">
                {copy.needCounsel}
              </h3>
              <p className="mt-4 text-sm leading-relaxed text-background/70">
                {copy.counselDesc}
              </p>
              <Button
                asChild
                className="mt-6 w-full rounded-full bg-background text-foreground hover:bg-background/90"
              >
                <Link href={localizeHref(pathname, "/#contact")}>
                  {copy.bookConsultation}
                </Link>
              </Button>
            </div>
          </aside>
        </div>
      </div>
    </article>
  );
}
