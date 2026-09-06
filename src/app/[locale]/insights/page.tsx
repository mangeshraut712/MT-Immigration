import type { Metadata } from "next";
import Script from "next/script";

import { InsightsPageClient } from "@/components/features/insights/InsightsPageClient";
import { fallbackInsightsFeed } from "@/content/legalInsights";
import { buildCanonicalUrl, getLanguageAlternates } from "@/config/site";
import { generateLiveInsightsFeed } from "@/server/ai/insights";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Insights",
  description:
    "Case studies, immigration news, and practical analysis in one source-backed insights page.",
  alternates: getLanguageAlternates("/insights"),
  openGraph: {
    title: "Insights",
    description:
      "Case studies, immigration news, and practical analysis in one source-backed insights page.",
    url: buildCanonicalUrl("/insights"),
  },
};

const insightsStructuredData = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "Insights",
  url: buildCanonicalUrl("/insights"),
  description:
    "Case studies, immigration news, and practical analysis in one source-backed insights page.",
  inLanguage: "en-US",
};

export default async function InsightsPage() {
  let initialFeed = fallbackInsightsFeed;
  try {
    initialFeed = await generateLiveInsightsFeed();
  } catch {
    initialFeed = fallbackInsightsFeed;
  }

  return (
    <>
      <Script
        id="insights-structured-data"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(insightsStructuredData) }}
      />
      <InsightsPageClient
        initialFeed={initialFeed}
        initialView="all"
        returnHref="/"
      />
    </>
  );
}
