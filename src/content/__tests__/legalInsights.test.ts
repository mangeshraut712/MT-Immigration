import {
  buildInsightArticle,
  fallbackInsightDirectory,
  type InsightDirectoryEntry,
} from "@/content/legalInsights";

describe("buildInsightArticle", () => {
  it("escapes overview text and drops unsafe source urls", () => {
    const entry: InsightDirectoryEntry = {
      kind: "news",
      slug: "unsafe-entry",
      category: "News",
      title: "<script>alert(1)</script>",
      publishedOn: "March 1, 2026",
      sourceName: "<img src=x>",
      sourceUrl: "javascript:alert(1)",
      summary: "<b>owned</b> this summary is long enough for the article.",
      readTime: "4 min read",
      topic: "Visa Bulletin",
    };

    const article = buildInsightArticle(entry, [entry]);

    expect(article.safeSourceUrl).toBeNull();
    expect(article.content).not.toContain("<script>");
    expect(article.content).not.toContain("javascript:");
    expect(article.content).toContain("&lt;b&gt;owned&lt;/b&gt;");
    expect(article.content).toContain("&lt;img src=x&gt;");
    expect(article.overview).toContain("<b>owned</b>");
  });

  it("keeps a real https source link", () => {
    const entry = fallbackInsightDirectory[0];
    const article = buildInsightArticle(entry, fallbackInsightDirectory);

    expect(article.safeSourceUrl).toMatch(/^https:\/\//);
    expect(article.content).toContain(`href="${article.safeSourceUrl}"`);
  });
});
