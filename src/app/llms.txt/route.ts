import { getSiteUrl } from "@/config/site";
import { siteConfig } from "@/config/site";

export const runtime = "edge";

export function GET() {
  const base = getSiteUrl();

  const body = [
    `# ${siteConfig.name}`,
    "",
    `> ${siteConfig.description}`,
    "",
    "## Preferred URLs",
    `- ${base}/`,
    `- ${base}/insights`,
    `- ${base}/privacy`,
    `- ${base}/terms`,
    "",
    "## Machine-Readable Resources",
    `- ${base}/openapi.json`,
    `- ${base}/sitemap.xml`,
    `- ${base}/robots.txt`,
    "",
    "## Primary User Actions",
    `- ${base}/#contact`,
    `- ${base}/#payments`,
    "",
    "## Notes",
    "- Chat and intake routes are server-side and rate limited.",
    "- Website content is informational and does not create an attorney-client relationship.",
    "",
  ].join("\n");

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control":
        "public, max-age=0, s-maxage=86400, stale-while-revalidate=43200",
    },
  });
}
