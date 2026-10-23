import {
  containsRestrictedContent,
  isSafeContactHref,
  productionRateLimitBlock,
  safeAssistantText,
  sanitizeChatAction,
  sanitizeInternalPath,
  sanitizePublicHttpsUrl,
  serializeJsonLd,
} from "../security";

describe("serializeJsonLd", () => {
  it("escapes characters that can break out of a script tag", () => {
    const serialized = serializeJsonLd({
      name: '</script><script>alert("x")</script>',
    });

    expect(serialized).not.toContain("<");
    expect(serialized).not.toContain(">");
    expect(serialized).toContain("\\u003c");
  });
});

describe("sanitizePublicHttpsUrl", () => {
  it("allows https urls and root-relative paths", () => {
    expect(sanitizePublicHttpsUrl("https://travel.state.gov/content/travel")).toBe(
      "https://travel.state.gov/content/travel",
    );
    expect(sanitizePublicHttpsUrl("/insights/visa-bulletin")).toBe(
      "/insights/visa-bulletin",
    );
  });

  it("rejects scriptable and insecure urls", () => {
    expect(sanitizePublicHttpsUrl("javascript:alert(1)")).toBeNull();
    expect(sanitizePublicHttpsUrl("http://example.com")).toBeNull();
    expect(sanitizePublicHttpsUrl("https://user:pass@example.com/a")).toBeNull();
    expect(sanitizePublicHttpsUrl("//evil.example")).toBeNull();
    expect(sanitizePublicHttpsUrl("https://127.0.0.1/admin")).toBeNull();
  });
});

describe("chat link and content guards", () => {
  const fallback = { label: "Request Case Review", link: "/#contact" };

  it("keeps only same-site action links", () => {
    expect(
      sanitizeChatAction(
        { label: "Read more", link: "/insights" },
        fallback,
      ),
    ).toEqual({ label: "Read more", link: "/insights" });
    expect(
      sanitizeChatAction(
        { label: "Go", link: "javascript:alert(1)" },
        fallback,
      ),
    ).toEqual(fallback);
    expect(sanitizeInternalPath("https://evil.example")).toBeNull();
  });

  it("replaces restricted assistant text with the fallback", () => {
    const result = safeAssistantText(
      "Your SSN is 123-45-6789 and I guarantee the outcome.",
      "Use the consultation form.",
    );

    expect(result.blocked).toBe(true);
    expect(result.content).toBe("Use the consultation form.");
    expect(containsRestrictedContent("A-123456789")).toBe(true);
  });
});

describe("contact hrefs and production rate limits", () => {
  it("accepts only tel and mailto urls", () => {
    expect(isSafeContactHref("tel:+15551234567", "tel")).toBe(true);
    expect(isSafeContactHref("javascript:alert(1)", "tel")).toBe(false);
    expect(isSafeContactHref("mailto:help@mtimmigration.com", "mailto")).toBe(
      true,
    );
  });

  it("fails closed only in production when shared limiting is missing", () => {
    const previousVercelEnv = process.env.VERCEL_ENV;
    process.env.VERCEL_ENV = "production";

    expect(
      productionRateLimitBlock({
        hasSharedConfig: false,
        backendFailed: false,
      }),
    ).toBe("unconfigured");
    expect(
      productionRateLimitBlock({
        hasSharedConfig: true,
        backendFailed: true,
      }),
    ).toBe("unavailable");

    delete process.env.VERCEL_ENV;
    expect(
      productionRateLimitBlock({
        hasSharedConfig: false,
        backendFailed: false,
      }),
    ).toBeNull();

    process.env.VERCEL_ENV = previousVercelEnv;
  });
});
