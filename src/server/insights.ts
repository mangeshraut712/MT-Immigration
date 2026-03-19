import "server-only";

import {
  buildInsightArticle,
  buildInsightDirectory,
  fallbackInsightsFeed,
  getInsightBySlug,
  type InsightArticlePayload,
  type InsightsFeedData,
} from "@/content/legalInsights";
import { generateLiveInsightsFeed } from "@/server/ai/insights";

export async function resolveInsightFeed() {
  return generateLiveInsightsFeed();
}

export async function resolveInsightArticleBySlug(
  slug: string,
): Promise<InsightArticlePayload | null> {
  const liveFeed = await resolveInsightFeed();
  return buildInsightArticleFromFeeds(slug, liveFeed, fallbackInsightsFeed);
}

function buildInsightArticleFromFeeds(
  slug: string,
  liveFeed: InsightsFeedData,
  fallbackFeed: InsightsFeedData,
) {
  const liveEntry = getInsightBySlug(liveFeed, slug);
  const fallbackEntry = getInsightBySlug(fallbackFeed, slug);
  const matchedEntry = liveEntry || fallbackEntry;

  if (!matchedEntry) {
    return null;
  }

  const sourceFeed = liveEntry ? liveFeed : fallbackFeed;
  return buildInsightArticle(matchedEntry, buildInsightDirectory(sourceFeed));
}
