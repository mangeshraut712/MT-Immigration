import type { Metadata } from "next";
import Script from "next/script";

import { InsightsPageClient } from "@/components/features/insights/InsightsPageClient";
import { fallbackInsightsFeed } from "@/content/legalInsights";
import { getLanguageAlternates } from "@/config/site";
import { serializeJsonLd } from "@/lib/security";
import { generateLiveInsightsFeed } from "@/server/ai/insights";

export const dynamic = "force-static";

const insightAlternates = getLanguageAlternates("/insights");

export const metadata: Metadata = {
  title: "Insights",
  description:
    "Case studies, immigration news, and practical analysis in one source-backed insights page.",
  alternates: insightAlternates,
  openGraph: {
    title: "Insights",
    description:
      "Case studies, immigration news, and practical analysis in one source-backed insights page.",
    url: insightAlternates.canonical,
  },
};

const insightsStructuredData = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "Insights",
  url: insightAlternates.canonical,
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
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(insightsStructuredData) }}
      />
      <InsightsPageClient
        initialFeed={initialFeed}
        initialView="all"
        returnHref="/"
      />
    </>
  );
}
