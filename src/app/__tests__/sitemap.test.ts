import sitemap from "@/app/sitemap";
import { fallbackInsightDirectory } from "@/content/legalInsights";

describe("sitemap", () => {
  it("lists localized pages and insight articles with trailing slashes", () => {
    const urls = sitemap().map((entry) => entry.url);
    const articleSlug = fallbackInsightDirectory[0]?.slug;

    expect(urls.some((url) => url.endsWith("/en/"))).toBe(true);
    expect(urls.some((url) => url.includes(`/en/insights/${articleSlug}/`))).toBe(
      true,
    );
    expect(urls.some((url) => url.endsWith("/es/privacy/"))).toBe(true);
    expect(urls.filter((url) => url.endsWith("/openapi.json"))).toHaveLength(1);
  });
});
