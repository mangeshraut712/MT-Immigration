jest.mock("@upstash/ratelimit", () => ({
  Ratelimit: class Ratelimit {
    static slidingWindow() {
      return {};
    }
  },
}));

jest.mock("@upstash/redis", () => ({
  Redis: {
    fromEnv() {
      return {};
    },
  },
}));

describe("takeRateLimitHit", () => {
  const originalVercelEnv = process.env.VERCEL_ENV;
  const originalUrl = process.env.UPSTASH_REDIS_REST_URL;
  const originalToken = process.env.UPSTASH_REDIS_REST_TOKEN;

  afterEach(() => {
    process.env.VERCEL_ENV = originalVercelEnv;
    process.env.UPSTASH_REDIS_REST_URL = originalUrl;
    process.env.UPSTASH_REDIS_REST_TOKEN = originalToken;
    jest.resetModules();
  });

  it("uses the in-memory limiter outside production", async () => {
    jest.resetModules();
    delete process.env.VERCEL_ENV;
    delete process.env.UPSTASH_REDIS_REST_URL;
    delete process.env.UPSTASH_REDIS_REST_TOKEN;

    const { takeRateLimitHit } = await import("@/server/rate-limit");
    const result = await takeRateLimitHit({
      scope: "unit",
      key: "203.0.113.10",
      limit: 1,
      windowMs: 60_000,
    });

    expect(result.ok).toBe(true);
    expect(result.reason).toBeUndefined();
  });

  it("fails closed in production when shared rate limiting is not configured", async () => {
    jest.resetModules();
    process.env.VERCEL_ENV = "production";
    delete process.env.UPSTASH_REDIS_REST_URL;
    delete process.env.UPSTASH_REDIS_REST_TOKEN;

    const { takeRateLimitHit } = await import("@/server/rate-limit");
    const result = await takeRateLimitHit({
      scope: "intake",
      key: "203.0.113.11",
      limit: 5,
      windowMs: 60_000,
    });

    expect(result).toMatchObject({
      ok: false,
      reason: "unconfigured",
    });
  });
});
