import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ArticlePageClient } from "@/components/features/insights/ArticlePageClient";
import { buildCanonicalUrl } from "@/config/site";
import { resolveInsightArticleBySlug } from "@/server/insights";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = await resolveInsightArticleBySlug(slug);

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
  const article = await resolveInsightArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  return <ArticlePageClient data={article} />;
}
