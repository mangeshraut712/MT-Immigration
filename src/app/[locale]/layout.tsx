import type { ReactNode } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AppProviders } from "@/app/providers";
import { GlobalLayout } from "@/components/GlobalLayout";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { isLocale, locales } from "@/i18n/config";
import { getMessages } from "next-intl/server";
import { Metadata } from "next";

// Generate static params for all supported locales
export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

// Generate metadata for each locale
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;

  if (!isLocale(locale)) {
    return {};
  }

  const messages = await getMessages({ locale });

  // Get translations for metadata
  const title = messages?.metadata?.title || "Vidya Raut | Energy Technology Analyst";
  const description = messages?.metadata?.description ||
    "Professional portfolio of Vidya Raut - Energy Technology Analyst specializing in market research, data analysis, and energy storage systems.";

  return {
    title,
    description,
    alternates: {
      canonical: `/${locale}`,
      languages: {
        'en': '/en',
        'hi': '/hi',
        'mr': '/mr',
      },
    },
    openGraph: {
      title,
      description,
      locale: locale === 'en' ? 'en_US' : locale === 'hi' ? 'hi_IN' : 'mr_IN',
      type: 'website',
    },
    twitter: {
      title,
      description,
      card: 'summary_large_image',
    },
  };
}

// Error fallback component for the locale layout
const LocaleLayoutError = ({ error, resetError }: { error?: Error; resetError: () => void }) => (
  <div className="min-h-screen flex items-center justify-center p-4 bg-background">
    <div className="text-center space-y-4 max-w-md">
      <h1 className="text-2xl font-bold text-foreground">Language Loading Error</h1>
      <p className="text-muted-foreground">
        There was an issue loading the content for this language. This might be due to missing translations or configuration issues.
      </p>
      {process.env.NODE_ENV === 'development' && error && (
        <p className="text-sm text-muted-foreground bg-muted p-2 rounded">
          {error.message}
        </p>
      )}
      <div className="flex gap-3 justify-center">
        <button
          onClick={resetError}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
        >
          Try Again
        </button>
        <Link
          href="/"
          className="px-4 py-2 border border-border rounded-lg hover:bg-secondary transition-colors"
        >
          Back to Portfolio
        </Link>
      </div>
    </div>
  </div>
)

export default async function LocaleLayout({ children, params }: { children: ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  // Validate locale
  if (!isLocale(locale)) {
    notFound();
  }

  // Load messages for the locale
  let messages;
  try {
    messages = await getMessages({ locale });
  } catch (error) {
    console.error(`Failed to load messages for locale ${locale}:`, error);
    // Return a basic layout with error boundary
    return (
      <div className="min-h-screen bg-background text-foreground">
        <ErrorBoundary fallback={LocaleLayoutError}>
          <GlobalLayout />
          <div className="container mx-auto px-4 py-8">
            <div className="text-center">
              <h1 className="text-2xl font-bold mb-4">Content Loading Error</h1>
              <p className="text-muted-foreground mb-4">
                Unable to load content for the selected language. Please try again or select a different language.
              </p>
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                Return to portfolio
              </Link>
            </div>
          </div>
        </ErrorBoundary>
      </div>
    );
  }

  return (
    <AppProviders locale={locale} messages={messages}>
      <div className="min-h-screen bg-background text-foreground">
        <GlobalLayout />
        {children}
      </div>
    </AppProviders>
  );
}
