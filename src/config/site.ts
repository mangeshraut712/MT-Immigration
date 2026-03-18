import "server-only";
import { firmConfig } from "@/config/firm";

const FALLBACK_SITE_URL = "https://mt-immigration.vercel.app";

export function getSiteUrl(): string {
  const envUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (envUrl) {
    return envUrl.startsWith("http") ? envUrl : `https://${envUrl}`;
  }

  const productionUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim();
  if (productionUrl) {
    return productionUrl.startsWith("http") ? productionUrl : `https://${productionUrl}`;
  }

  const vercelUrl = process.env.VERCEL_URL?.trim();
  if (vercelUrl && process.env.VERCEL_ENV === "production") {
    return `https://${vercelUrl}`;
  }

  return FALLBACK_SITE_URL;
}

export function isProductionIndexable() {
  if (process.env.VERCEL) {
    return process.env.VERCEL_ENV === "production";
  }

  return process.env.NODE_ENV === "production";
}

export const siteUrl = new URL(getSiteUrl());

export function buildCanonicalUrl(path = '/') {
  return new URL(path, siteUrl).toString();
}

export function getLanguageAlternates(path = '/') {
  const canonical = buildCanonicalUrl(path);

  return {
    canonical,
    languages: {
      'en-US': canonical,
      'x-default': canonical,
    },
  } as const;
}

export const siteConfig = {
  name: firmConfig.name,
  defaultTitle: "M&T Immigration | Solo Immigration Counsel With Direct Attorney Access",
  description:
    "Boutique U.S. immigration representation for visitor, student, family, humanitarian, and urgent court-related matters. Clear strategy, transparent fees, and direct attorney communication.",
  keywords: [
    "immigration lawyer",
    "visa attorney",
    "green card",
    "asylum",
    "solo immigration counsel",
    "boutique immigration law firm",
    "legal insights",
    "legal news",
  ],
} as const;
