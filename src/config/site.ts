import "server-only";
import { firmConfig } from "@/config/firm";

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
  ],
} as const;
