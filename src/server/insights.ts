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

const INSIGHTS_CACHE_TTL_MS = 20 * 60_000;

let cachedInsights: {
  expiresAt: number;
  payload: Awaited<ReturnType<typeof generateLiveInsightsFeed>>;
} | null = null;
let inFlightInsights: Promise<
  Awaited<ReturnType<typeof generateLiveInsightsFeed>>
> | null = null;

export async function resolveInsightFeed() {
  const now = Date.now();

  if (cachedInsights && cachedInsights.expiresAt > now) {
    return cachedInsights.payload;
  }

  if (!inFlightInsights) {
    inFlightInsights = generateLiveInsightsFeed()
      .then((payload) => {
        cachedInsights = {
          payload,
          expiresAt: Date.now() + INSIGHTS_CACHE_TTL_MS,
        };
        return payload;
      })
      .finally(() => {
        inFlightInsights = null;
      });
  }

  return inFlightInsights;
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
