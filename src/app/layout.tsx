import type { Metadata } from "next";
import { Inter, DM_Serif_Display } from "next/font/google";
import "./globals.css";
import clsx from "clsx";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { BackToTop } from "@/components/layout/BackToTop";
import { Toaster } from "@/components/ui/sonner";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import Providers from "./providers";
import { siteConfig, siteUrl } from "@/lib/site";
import { ScrollProgress } from "@/components/ui/scroll-progress";

import { DynamicChatBot } from "@/components/features/chatbot/DynamicChatBot";

// SF Pro alternative - Inter is the closest Google Font
const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

// Elegant Serif for headings - Apple-like premium feel
const dmSerif = DM_Serif_Display({
  variable: "--font-serif",
  weight: ["400"],
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: siteUrl,
  title: {
    default: siteConfig.defaultTitle,
    template: "%s | M&T Immigration Law Firm",
  },
  description: siteConfig.description,
  keywords: [...siteConfig.keywords],
  authors: [{ name: siteConfig.name }],
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    title: siteConfig.defaultTitle,
    description: siteConfig.description,
    url: siteUrl,
    siteName: siteConfig.name,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.defaultTitle,
    description: siteConfig.description,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={clsx(inter.variable, dmSerif.variable, "scroll-smooth")} suppressHydrationWarning>
      <body className="antialiased bg-background text-foreground font-sans" suppressHydrationWarning>
        <Providers>
          <ScrollProgress />
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:rounded-md focus:bg-background focus:px-4 focus:py-2 focus:text-sm focus:shadow-md focus-ring"
          >
            Skip to content
          </a>
          <Navbar />
          <main id="main-content" className="min-h-screen">
            {children}
          </main>
          <Footer />
          <BackToTop />
          <DynamicChatBot />
          <Toaster position="bottom-right" richColors closeButton />
          <Analytics />
          <SpeedInsights />
        </Providers>
      </body>
    </html>
  );
}
