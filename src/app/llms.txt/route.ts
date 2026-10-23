import { buildCanonicalUrl, siteConfig } from "@/config/site";
import { routing } from "@/i18n/routing";
import { withApiHeaders } from "@/lib/security";

export const dynamic = "force-static";

export function GET() {
  const home = buildCanonicalUrl(`/${routing.defaultLocale}`);
  const insights = buildCanonicalUrl(`/${routing.defaultLocale}/insights`);
  const privacy = buildCanonicalUrl(`/${routing.defaultLocale}/privacy`);
  const terms = buildCanonicalUrl(`/${routing.defaultLocale}/terms`);
  const body = [
    `# ${siteConfig.name}`,
    "",
    `> ${siteConfig.description}`,
    "",
    "## Preferred URLs",
    `- ${home}`,
    `- ${insights}`,
    `- ${privacy}`,
    `- ${terms}`,
    "",
    "## Machine-Readable Resources",
    `- ${buildCanonicalUrl("/openapi.json")}`,
    `- ${buildCanonicalUrl("/sitemap.xml")}`,
    `- ${buildCanonicalUrl("/robots.txt")}`,
    "",
    "## Primary User Actions",
    `- ${home}#contact`,
    `- ${home}#payments`,
    "",
    "## Notes",
    "- Chat and intake routes are server-side and rate limited.",
    "- Website content is informational and does not create an attorney-client relationship.",
    "",
  ].join("\n");

  return new Response(body, {
    headers: withApiHeaders({
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control":
        "public, max-age=0, s-maxage=86400, stale-while-revalidate=43200",
    }),
  });
}
