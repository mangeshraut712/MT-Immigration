import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ArticlePageClient } from "@/components/features/insights/ArticlePageClient";
import { buildCanonicalUrl } from "@/config/site";
import {
  buildInsightArticle,
  fallbackInsightDirectory,
  getFallbackInsightBySlug,
} from "@/content/legalInsights";

export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return fallbackInsightDirectory.map((entry) => ({ slug: entry.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = getFallbackInsightBySlug(slug);

  if (!article) {
    return {
      title: "Knowledge Hub Article | M&T Immigration",
      description:
        "AI-assisted immigration analysis, current news, and public case-study takeaways.",
    };
  }

  return {
    title: article.title,
    description: `${article.category} from ${article.sourceName}. ${article.publishedOn}.`,
    alternates: {
      canonical: buildCanonicalUrl(`/insights/${slug}`),
    },
    openGraph: {
      title: article.title,
      description: `${article.category} from ${article.sourceName}. ${article.publishedOn}.`,
      url: buildCanonicalUrl(`/insights/${slug}`),
      type: "article",
    },
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = getFallbackInsightBySlug(slug);

  if (!article) {
    notFound();
  }

  return (
    <ArticlePageClient
      data={buildInsightArticle(article, fallbackInsightDirectory)}
    />
  );
}
