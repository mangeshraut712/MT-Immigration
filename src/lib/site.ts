import "server-only";

const FALLBACK_SITE_URL = "https://mt-immigration.vercel.app";

export function getSiteUrl(): string {
  const envUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (envUrl) {
    return envUrl.startsWith("http") ? envUrl : `https://${envUrl}`;
  }

  const vercelUrl = process.env.VERCEL_URL;
  if (vercelUrl) {
    return `https://${vercelUrl}`;
  }

  return FALLBACK_SITE_URL;
}

export const siteUrl = new URL(getSiteUrl());

export const siteConfig = {
  name: "M&T Immigration Law Firm",
  defaultTitle: "M&T Immigration Law Firm | Affordable Immigration Legal Services",
  description:
    "Low-bono immigration support for visitor, student, marriage-based, and humanitarian cases. Honest guidance, affordable prices.",
  keywords: [
    "immigration lawyer",
    "visa attorney",
    "green card",
    "asylum",
    "low-bono legal services",
  ],
} as const;

