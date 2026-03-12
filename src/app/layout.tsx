import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import "@fontsource/geist/400.css";
import "@fontsource/geist/500.css";
import "@fontsource/geist/600.css";
import "@fontsource/geist/700.css";
import "@fontsource/geist-mono/400.css";
import "@fontsource/geist-mono/500.css";
import "@fontsource/cormorant-garamond/500.css";
import "@fontsource/cormorant-garamond/600.css";
import "@fontsource/cormorant-garamond/700.css";
import "./globals.css";

// Viewport configuration - separated in Next.js 14+
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
};

// Comprehensive SEO metadata
export const metadata: Metadata = {
  title: {
    default: "Vidya Raut | Energy Technology & Market Analyst",
    template: "%s | Vidya Raut Portfolio",
  },
  description:
    "Professional portfolio of Vidya Raut - Energy Technology Analyst specializing in market research, data analysis, and energy storage systems. 4+ years of experience driving insights in the energy sector.",
  applicationName: "Vidya Raut Portfolio",
  keywords: [
    "Energy Technology Analyst",
    "Market Research",
    "Data Analysis",
    "Energy Storage Systems",
    "Battery Testing",
    "Power BI",
    "Excel Analytics",
    "Vidya Raut",
    "Portfolio",
    "Pune",
    "India",
    "ESS",
    "Energy Sector",
  ],
  authors: [{ name: "Vidya Raut", url: "https://vidyaraut.vercel.app" }],
  creator: "Vidya Raut",
  publisher: "Vidya Raut",
  metadataBase: new URL("https://vidyaraut.vercel.app"),
  alternates: {
    canonical: "/",
    languages: {
      "en": "/en",
      "hi": "/hi",
      "mr": "/mr",
    },
  },
  openGraph: {
    title: "Vidya Raut | Energy Technology & Market Analyst",
    description:
      "Professional portfolio of Vidya Raut - Energy Technology Analyst specializing in market research, data analysis, and energy storage systems.",
    url: "https://vidyaraut.vercel.app",
    siteName: "Vidya Raut Portfolio",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Vidya Raut - Energy Technology Analyst",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Vidya Raut | Energy Technology & Market Analyst",
    description:
      "Energy Technology Analyst specializing in market research, data analysis, and energy storage systems.",
    images: ["/og-image.png"],
    creator: "@vidyaraut",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/logo.png", sizes: "32x32", type: "image/png" },
      { url: "/logo.png", sizes: "16x16", type: "image/png" },
    ],
    apple: [{ url: "/logo.png", sizes: "180x180", type: "image/png" }],
  },
  manifest: "/manifest.json",
  category: "portfolio",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const enableVercelTelemetry = Boolean(process.env.VERCEL);

  return (
    <html lang="en" suppressHydrationWarning data-scroll-behavior="smooth" className="scroll-smooth scroll-pt-24">
      <head>
        {/* Preconnect for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        {/* DNS Prefetch for external resources */}
        <link rel="dns-prefetch" href="https://vercel.live" />

        {/* Structured Data for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              "name": "Vidya Raut",
              "jobTitle": "Energy Technology Analyst",
              "description": "Energy Technology Analyst specializing in market research, data analysis, and energy storage systems with 4+ years of experience.",
              "url": "https://vidyaraut.vercel.app",
              "image": "https://vidyaraut.vercel.app/home picture.jpeg",
              "sameAs": [
                "https://www.linkedin.com/in/vidyaraut17/"
              ],
              "address": {
                "@type": "PostalAddress",
                "addressLocality": "Pune",
                "addressRegion": "Maharashtra",
                "addressCountry": "India"
              },
              "alumniOf": [
                {
                  "@type": "EducationalOrganization",
                  "name": "Savitribai Phule Pune University",
                  "description": "M.Tech in Energy Technology (Currently pursuing)"
                },
                {
                  "@type": "EducationalOrganization",
                  "name": "H.V.Desai Senior College",
                  "description": "M.Sc in Physics"
                }
              ],
              "hasOccupation": {
                "@type": "Occupation",
                "name": "Energy Technology Analyst",
                "occupationLocation": {
                  "@type": "City",
                  "name": "Pune",
                  "addressCountry": "India"
                },
                "skills": [
                  "Market Research",
                  "Data Analysis",
                  "Excel (Advanced)",
                  "Power BI",
                  "Energy Storage Systems",
                  "Battery Testing",
                  "Report Writing"
                ]
              },
              "knowsAbout": [
                "Energy Storage Systems",
                "Market Research",
                "Data Analysis",
                "Battery Technology",
                "Renewable Energy",
                "Power BI",
                "Excel Analytics"
              ]
            })
          }}
        />
      </head>
      <body
        className="font-geist antialiased bg-background text-foreground"
        suppressHydrationWarning
      >
        <ErrorBoundary>
          {children}
        </ErrorBoundary>
        {enableVercelTelemetry ? <Analytics /> : null}
        {enableVercelTelemetry ? <SpeedInsights /> : null}
      </body>
    </html>
  );
}
