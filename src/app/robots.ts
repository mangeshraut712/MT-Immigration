import { MetadataRoute } from "next";
import { buildCanonicalUrl, isProductionIndexable, siteUrl } from "@/config/site";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  const isIndexable = isProductionIndexable();
  return {
    rules: isIndexable
      ? {
          userAgent: "*",
          allow: "/",
        }
      : {
          userAgent: "*",
          disallow: "/",
        },
    sitemap: buildCanonicalUrl("/sitemap.xml"),
    host: siteUrl.toString(),
  };
}
