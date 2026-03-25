"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLocale } from "next-intl";
import { ArrowLeft, BookOpen, Clock3, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { localizeHref } from "@/i18n/routing";
import { getRuntimeUiLocale, runtimeUiCopy } from "@/i18n/runtime-ui";

export type ArticleData = {
  title: string;
  category: string;
  publishedOn: string;
  readTime: string;
  sourceName: string;
  sourceUrl: string;
  content: string;
  recommendations: { title: string; slug: string }[];
};

export function ArticlePageClient({ data }: { data: ArticleData }) {
  const locale = useLocale();
  const uiLocale = getRuntimeUiLocale(locale);
  const copy = runtimeUiCopy[uiLocale].article;
  const pathname = usePathname();

  return (
    <article className="bg-[#fcfbf9]">
      {/* Hero */}
      <header className="relative overflow-hidden border-b border-black/5 bg-white pt-32 sm:pt-40">
        <div className="container-wide relative z-10 pb-16 sm:pb-24">
          <div className="mx-auto max-w-3xl">
            <Link
              href={localizeHref(pathname, "/insights")}
              className="inline-flex items-center gap-2 text-sm font-medium text-zinc-500 transition-colors hover:text-black mb-8"
            >
              <ArrowLeft className="h-4 w-4" />
              {copy.backToInsights}
            </Link>
            <div className="mb-6 flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-widest text-zinc-500">
              <span className="rounded-full bg-zinc-100 px-3 py-1">
                {data.category}
              </span>
              <span>{data.publishedOn}</span>
              <span className="flex items-center gap-1.5">
                <Clock3 className="h-3.5 w-3.5" /> {data.readTime}
              </span>
            </div>
            <h1 className="font-serif text-4xl leading-[1.15] tracking-tight text-zinc-950 sm:text-5xl md:text-6xl">
              {data.title}
            </h1>
            <a
              href={data.sourceUrl}
              target={data.sourceUrl.startsWith("http") ? "_blank" : undefined}
              rel={
                data.sourceUrl.startsWith("http")
                  ? "noreferrer noopener"
                  : undefined
              }
              className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-zinc-500 transition-colors hover:text-black"
            >
              {copy.sourceLabel}: {data.sourceName}
            </a>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="container-wide py-16 sm:py-24">
        <div className="mx-auto grid max-w-6xl gap-16 lg:grid-cols-[minmax(0,1fr)_20rem]">
          {/* Main Reading area */}
          <div className="prose prose-zinc prose-a:text-black prose-a:underline hover:prose-a:text-zinc-600 max-w-none text-lg leading-relaxed text-zinc-700">
            <div dangerouslySetInnerHTML={{ __html: data.content }} />

            <div className="mt-16 flex items-center justify-between border-t border-black/10 pt-8">
              <div className="flex items-center gap-3">
                <Button variant="outline" size="sm" className="rounded-full">
                  <Share2 className="mr-2 h-4 w-4" /> {copy.share}
                </Button>
              </div>
            </div>
          </div>

          {/* Sidebar / Recommendations */}
          <aside className="space-y-8">
            <div className="rounded-[2rem] border border-black/5 bg-white p-6 shadow-sm">
              <div className="mb-6 flex items-center gap-2 font-serif text-xl font-medium tracking-tight text-zinc-900 border-b border-black/5 pb-4">
                <BookOpen className="h-5 w-5" /> {copy.relatedContent}
              </div>
              <ul className="space-y-6">
                {data.recommendations.map((rec, i) => (
                  <li key={i}>
                    <Link
                      href={localizeHref(pathname, `/insights/${rec.slug}`)}
                      className="group block"
                    >
                      <h4 className="text-base font-medium leading-tight text-zinc-800 transition-colors group-hover:text-black group-hover:underline">
                        {rec.title}
                      </h4>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-[2rem] bg-zinc-950 p-6 text-white shadow-xl">
              <h3 className="font-serif text-2xl tracking-tight">
                {copy.needCounsel}
              </h3>
              <p className="mt-4 text-sm leading-relaxed text-zinc-400">
                {copy.counselDesc}
              </p>
              <Button
                asChild
                className="mt-6 w-full rounded-full bg-white text-black hover:bg-zinc-200"
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
