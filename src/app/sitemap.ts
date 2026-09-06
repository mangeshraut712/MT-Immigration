import { MetadataRoute } from "next";
import { buildCanonicalUrl } from "@/config/site";
import { routing } from "@/i18n/routing";

const locales = routing.locales as readonly string[];

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const baseUrls = [
    "/",
    "/privacy",
    "/terms",
    "/brief-break",
    "/insights",
  ];

  const sitemap: MetadataRoute.Sitemap = [];

  baseUrls.forEach((path) => {
    locales.forEach((locale) => {
      const localePath = path === "/" ? `/${locale}` : `/${locale}${path}`;

      sitemap.push({
        url: buildCanonicalUrl(localePath),
        lastModified,
        changeFrequency: path === "/" ? "yearly" : "weekly",
        priority: path === "/" ? 1 : 0.6,
      });
    });
  });

  sitemap.push(
    {
      url: buildCanonicalUrl("/llms.txt"),
      lastModified,
      changeFrequency: "monthly",
      priority: 0.2,
    },
    {
      url: buildCanonicalUrl("/openapi.json"),
      lastModified,
      changeFrequency: "monthly",
      priority: 0.2,
    }
  );

  return sitemap;
}
