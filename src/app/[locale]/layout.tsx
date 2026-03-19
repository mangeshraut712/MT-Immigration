import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import "../globals.css";
import clsx from "clsx";


import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { BackToTop } from "@/components/layout/BackToTop";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import { ScrollProgress } from "@/components/ui/scroll-progress";
import { Toaster } from "@/components/ui/sonner";
import { WebVitals } from "@/components/ui/web-vitals";
import { SiteStructuredData } from "@/components/seo/SiteStructuredData";

import Providers from "../providers";

import { DynamicChatBot } from "@/components/features/chatbot/DynamicChatBot";
import { Inter, DM_Serif_Display } from "next/font/google";


// SF Pro alternative - Inter is the closest Google Font
const inter = Inter({
    variable: "--font-sans",
    subsets: ["latin"],
    display: "swap",
    preload: true,
});

// Elegant Serif for headings - Apple-like premium feel
const dmSerif = DM_Serif_Display({
    variable: "--font-serif",
    weight: ["400"],
    subsets: ["latin"],
    display: "optional",
    preload: false,
});

// Ensure static params for all locales
export function generateStaticParams() {
    return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;

    // Ensure that the incoming `locale` is valid
    const validLocale = routing.locales.includes(locale as typeof routing.locales[number]);
    if (!validLocale) {
        notFound();
    }

    // Providing all messages to the client
    // side is the easiest way to get started
    const messages = await getMessages();

    return (
        <html
            lang={locale}
            className={clsx(inter.variable, dmSerif.variable, "scroll-smooth")}
            data-scroll-behavior="smooth"
            suppressHydrationWarning
        >
            <head>
                {/* Performance optimizations */}
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link
                    rel="preconnect"
                    href="https://fonts.gstatic.com"
                    crossOrigin="anonymous"
                />
                <link rel="dns-prefetch" href="//vitals.vercel-insights.com" />
                <link rel="dns-prefetch" href="//vitals.vercel-analytics.com" />

                {/* Critical resource hints */}
                <link
                    rel="preload"
                    href="/brand/mtlogo.png"
                    as="image"
                    type="image/png"
                />

                {/* PWA */}
                <link rel="manifest" href="/manifest.json" />
                <meta name="theme-color" content="#000000" />
                <meta name="apple-mobile-web-app-capable" content="yes" />
                <meta name="apple-mobile-web-app-status-bar-style" content="default" />
                <meta name="apple-mobile-web-app-title" content="M&T Immigration" />
                <link rel="apple-touch-icon" href="/brand/mtlogo.png" />

                {/* Performance meta tags */}
                <meta name="format-detection" content="telephone=no" />
                <meta name="mobile-web-app-capable" content="yes" />
                <meta name="msapplication-TileColor" content="#000000" />
                <meta name="msapplication-config" content="/browserconfig.xml" />
            </head>
            <body
                className="antialiased bg-background text-foreground font-sans"
                suppressHydrationWarning
            >
                <NextIntlClientProvider messages={messages}>
                    <Providers>
                        <SiteStructuredData />
                        <WebVitals />
                        <ScrollProgress />
                        <a
                            href="#main-content"
                            className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:rounded-md focus:bg-background focus:px-4 focus:py-2 focus:text-sm focus:shadow-md focus-ring"
                        >
                            Skip to content
                        </a>
                        <Navbar locale={locale} />
                        <main id="main-content" className="min-h-screen">
                            <ErrorBoundary>{children}</ErrorBoundary>
                        </main>
                        <Footer />
                        <BackToTop />
                        <DynamicChatBot />
                        <Toaster position="bottom-right" richColors closeButton />
                    </Providers>
                </NextIntlClientProvider>
            </body>
        </html>
    );
}
