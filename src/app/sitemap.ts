import { MetadataRoute } from "next";
import { siteUrl } from "@/config/site";

const locales = ["en", "es"];

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

  // Generate URLs for each locale
  baseUrls.forEach((path) => {
    locales.forEach((locale) => {
      const url = locale === "en"
        ? new URL(path, siteUrl).toString()
        : new URL(`/${locale}${path === "/" ? "" : path}`, siteUrl).toString();

      sitemap.push({
        url,
        lastModified,
        changeFrequency: path === "/" ? "yearly" : "weekly",
        priority: path === "/" ? 1 : 0.6,
      });
    });
  });

  // Add static files
  sitemap.push(
    {
      url: new URL("/llms.txt", siteUrl).toString(),
      lastModified,
      changeFrequency: "monthly",
      priority: 0.2,
    },
    {
      url: new URL("/openapi.json", siteUrl).toString(),
      lastModified,
      changeFrequency: "monthly",
      priority: 0.2,
    }
  );

  return sitemap;
}
