import "server-only";
import { firmConfig } from "@/config/firm";
import { joinSiteUrl } from "@/config/paths";
import { routing } from "@/i18n/routing";

const FALLBACK_SITE_URL = "https://mangeshraut712.github.io/MT-Immigration";

function isLocalDevelopmentUrl(value: string) {
  try {
    const parsed = new URL(value.startsWith("http") ? value : `https://${value}`);
    return parsed.hostname === "localhost" || parsed.hostname === "127.0.0.1";
  } catch {
    return false;
  }
}

function normalizeAbsoluteUrl(value: string) {
  const withProtocol = value.startsWith("http") ? value : `https://${value}`;
  return withProtocol.replace(/\/+$/, "");
}

export function getSiteUrl(): string {
  const envUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (envUrl && !(process.env.VERCEL && isLocalDevelopmentUrl(envUrl))) {
    return normalizeAbsoluteUrl(envUrl);
  }

  const productionUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim();
  if (productionUrl) {
    return normalizeAbsoluteUrl(productionUrl);
  }

  const vercelUrl = process.env.VERCEL_URL?.trim();
  if (vercelUrl && process.env.VERCEL_ENV === "production") {
    return normalizeAbsoluteUrl(`https://${vercelUrl}`);
  }

  return FALLBACK_SITE_URL;
}

export function isProductionIndexable() {
  if (process.env.GITHUB_PAGES === "true") {
    return process.env.NODE_ENV === "production";
  }

  if (process.env.VERCEL) {
    return process.env.VERCEL_ENV === "production";
  }

  return process.env.NODE_ENV === "production";
}

export const siteUrl = new URL(joinSiteUrl(getSiteUrl(), "/"));

export function buildCanonicalUrl(path = "/") {
  return joinSiteUrl(getSiteUrl(), path);
}

export function getLanguageAlternates(path = "/") {
  const localizedPath = path === "/" ? "" : path;
  const canonical = buildCanonicalUrl(
    `/${routing.defaultLocale}${localizedPath}`,
  );

  const languages = Object.fromEntries(
    routing.locales.map((locale) => {
      const localePath = `/${locale}${localizedPath}`;
      return [locale, buildCanonicalUrl(localePath)];
    }),
  );

  return {
    canonical,
    languages: {
      ...languages,
      "x-default": canonical,
    },
  } as const;
}

export const siteConfig = {
  name: firmConfig.name,
  defaultTitle:
    "M&T Immigration | Solo Immigration Counsel With Direct Attorney Access",
  description:
    "Boutique U.S. immigration representation for visitor, student, family, humanitarian, and urgent court-related matters. Clear strategy, transparent fees, and direct attorney communication.",
  keywords: [
    "immigration lawyer",
    "visa attorney",
    "green card",
    "asylum",
    "solo immigration counsel",
    "boutique immigration law firm",
    "immigration insights",
    "immigration news",
  ],
} as const;
