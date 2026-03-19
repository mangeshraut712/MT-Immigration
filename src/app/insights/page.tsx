import type { Metadata } from "next";
import Script from "next/script";

import { InsightsPageClient } from "@/components/features/insights/InsightsPageClient";
import { buildCanonicalUrl, getLanguageAlternates } from "@/config/site";
import { generateLiveInsightsFeed } from "@/server/ai/insights";

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

export default async function InsightsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const initialFeed = await generateLiveInsightsFeed();
  const resolvedSearchParams = await searchParams;
  const initialView =
    typeof resolvedSearchParams.view === "string"
      ? resolvedSearchParams.view
      : "all";
  const from =
    typeof resolvedSearchParams.from === "string"
      ? resolvedSearchParams.from
      : "";

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
        initialView={initialView}
        returnHref={from === "home-insights" ? "/#insights" : "/"}
      />
    </>
  );
}
