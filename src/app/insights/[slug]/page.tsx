import type { Metadata } from 'next';
import { ArticlePageClient } from '@/components/features/insights/ArticlePageClient';

export const metadata: Metadata = {
  title: 'Legal Insight | M&T Immigration',
  description: 'In-depth legal analysis, news, and client success stories.',
};

export default function ArticlePage({ params }: { params: { slug: string } }) {
  return <ArticlePageClient slug={params.slug} />;
}
