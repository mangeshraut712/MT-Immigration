type RateLimitResult = {
  ok: boolean;
  remaining: number;
  resetAt: number;
};

type RateLimitOptions = {
  scope: string;
  key: string;
  limit: number;
  windowMs: number;
};

const buckets = new Map<string, number[]>();

function getBucketKey(scope: string, key: string) {
  return `${scope}:${key}`;
}

export function takeRateLimitHit({
  scope,
  key,
  limit,
  windowMs,
}: RateLimitOptions): RateLimitResult {
  const now = Date.now();
  const bucketKey = getBucketKey(scope, key);
  const existing = buckets.get(bucketKey) ?? [];
  const freshHits = existing.filter((timestamp) => now - timestamp < windowMs);

  if (freshHits.length >= limit) {
    return {
      ok: false,
      remaining: 0,
      resetAt: freshHits[0] + windowMs,
    };
  }

  freshHits.push(now);
  buckets.set(bucketKey, freshHits);

  return {
    ok: true,
    remaining: Math.max(limit - freshHits.length, 0),
    resetAt: freshHits[0] + windowMs,
  };
}
