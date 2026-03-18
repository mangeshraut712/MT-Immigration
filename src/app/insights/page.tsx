import type { Metadata } from 'next';

import { fallbackInsightsFeed } from '@/content/legalInsights';
import { InsightsPageClient } from '@/components/features/insights/InsightsPageClient';
import { buildCanonicalUrl, getLanguageAlternates } from '@/config/site';

export const metadata: Metadata = {
  title: 'Legal Insights & Journal',
  description:
    'A cleaner single-page journal for legal headlines, news, blog notes, and firm updates.',
  alternates: getLanguageAlternates('/insights'),
  openGraph: {
    title: 'Legal Insights & Journal',
    description:
      'Clean legal headlines, latest news, blog notes, and firm updates in a refined single-page editorial layout.',
    url: buildCanonicalUrl('/insights'),
  },
};

const insightsStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  name: 'Legal Insights & Journal',
  url: buildCanonicalUrl('/insights'),
  description:
    'A cleaner single-page journal for legal headlines, news, blog notes, and firm updates.',
  inLanguage: 'en-US',
};

export default function InsightsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(insightsStructuredData) }}
      />
      <InsightsPageClient initialFeed={fallbackInsightsFeed} />
    </>
  );
}
