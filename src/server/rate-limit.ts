import "server-only";

import { Ratelimit, type Duration } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

type RateLimitResult = {
  ok: boolean;
  remaining: number;
  resetAt: number;
  reason?: "unconfigured" | "unavailable";
};

type RateLimitOptions = {
  scope: string;
  key: string;
  limit: number;
  windowMs: number;
};

type LocalBucket = {
  hits: number[];
  windowMs: number;
};

const buckets = new Map<string, LocalBucket>();
const ephemeralCache = new Map<string, number>();
let localCleanupCounter = 0;

let redisClient: Redis | null | undefined;
const rateLimiters = new Map<string, Ratelimit>();

function getBucketKey(scope: string, key: string) {
  return `${scope}:${key}`;
}

function hasSharedRateLimitConfig() {
  return Boolean(
    process.env.UPSTASH_REDIS_REST_URL?.trim() &&
      process.env.UPSTASH_REDIS_REST_TOKEN?.trim(),
  );
}

function getRateLimitMode() {
  if (hasSharedRateLimitConfig()) {
    return "upstash" as const;
  }

  return "memory" as const;
}

function getRedisClient() {
  if (redisClient !== undefined) {
    return redisClient;
  }

  if (!hasSharedRateLimitConfig()) {
    redisClient = null;
    return redisClient;
  }

  redisClient = Redis.fromEnv();
  return redisClient;
}

function formatWindow(windowMs: number): Duration {
  if (windowMs % 3_600_000 === 0) {
    return `${windowMs / 3_600_000} h`;
  }

  if (windowMs % 60_000 === 0) {
    return `${windowMs / 60_000} m`;
  }

  if (windowMs % 1_000 === 0) {
    return `${windowMs / 1_000} s`;
  }

  throw new Error(`Unsupported rate-limit window: ${windowMs}ms`);
}

function getSharedRatelimiter(scope: string, limit: number, windowMs: number) {
  const key = `${scope}:${limit}:${windowMs}`;
  const existing = rateLimiters.get(key);
  if (existing) {
    return existing;
  }

  const redis = getRedisClient();
  if (!redis) {
    return null;
  }

  const next = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(limit, formatWindow(windowMs)),
    prefix: `mt-immigration:${scope}`,
    ephemeralCache,
  });
  rateLimiters.set(key, next);
  return next;
}

function takeLocalRateLimitHit({
  scope,
  key,
  limit,
  windowMs,
}: RateLimitOptions): RateLimitResult {
  const now = Date.now();
  const bucketKey = getBucketKey(scope, key);
  const existing = buckets.get(bucketKey);
  const freshHits = (existing?.hits ?? []).filter(
    (timestamp) => now - timestamp < windowMs,
  );

  localCleanupCounter += 1;
  if (localCleanupCounter % 100 === 0) {
    for (const [cachedKey, bucket] of buckets.entries()) {
      const cachedFreshHits = bucket.hits.filter(
        (timestamp) => now - timestamp < bucket.windowMs,
      );

      if (cachedFreshHits.length === 0) {
        buckets.delete(cachedKey);
        continue;
      }

      if (cachedFreshHits.length !== bucket.hits.length) {
        buckets.set(cachedKey, {
          ...bucket,
          hits: cachedFreshHits,
        });
      }
    }
  }

  if (freshHits.length === 0) {
    buckets.delete(bucketKey);
  }

  if (freshHits.length >= limit) {
    return {
      ok: false,
      remaining: 0,
      resetAt: freshHits[0] + windowMs,
    };
  }

  freshHits.push(now);
  buckets.set(bucketKey, {
    hits: freshHits,
    windowMs,
  });

  return {
    ok: true,
    remaining: Math.max(limit - freshHits.length, 0),
    resetAt: freshHits[0] + windowMs,
  };
}

export async function takeRateLimitHit({
  scope,
  key,
  limit,
  windowMs,
}: RateLimitOptions): Promise<RateLimitResult> {
  const mode = getRateLimitMode();

  if (mode === "memory") {
    return takeLocalRateLimitHit({ scope, key, limit, windowMs });
  }

  try {
    const ratelimit = getSharedRatelimiter(scope, limit, windowMs);
    if (!ratelimit) {
      return takeLocalRateLimitHit({ scope, key, limit, windowMs });
    }

    const result = await ratelimit.limit(getBucketKey(scope, key));
    return {
      ok: result.success,
      remaining: result.remaining,
      resetAt: result.reset,
    };
  } catch (error) {
    console.error("Shared rate-limit backend error:", error);
    return takeLocalRateLimitHit({ scope, key, limit, windowMs });
  }
}
