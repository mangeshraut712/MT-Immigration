import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Scale, Sparkles } from "lucide-react";

import { DocketZipGame } from "@/components/features/game/DocketZipGame";
import { Button } from "@/components/ui/button";
import { buildCanonicalUrl, getLanguageAlternates } from "@/config/site";
import { localizeHrefForLocale } from "@/i18n/routing";

const briefBreakPageCopy = {
  en: {
    title: "Brief Break",
    description:
      "A playful law-themed puzzle room for moments of reset between serious immigration work.",
    breadcrumbCurrent: "Brief Break",
    badge: "Brief Break",
    headingStart: "Reset your head,",
    headingEnd: "not your standards.",
    intro:
      "A quiet chamber for two or three minutes of focus between filings, drafts, and hard conversations. Same brand language, lower stakes, cleaner breathing room.",
    cta: "Enter Today's Docket",
    pill:
      "Daily puzzle, practice docket selection, keyboard shortcuts, and shareable results",
  },
  hi: {
    title: "Brief Break",
    description:
      "गंभीर इमिग्रेशन काम के बीच थोड़ी राहत के लिए एक हल्का कानूनी-थीम वाला पहेली कक्ष।",
    breadcrumbCurrent: "Brief Break",
    badge: "Brief Break",
    headingStart: "अपना मन रीसेट करें,",
    headingEnd: "अपने मानक नहीं।",
    intro:
      "फाइलिंग, ड्राफ्ट और कठिन बातचीत के बीच दो-तीन मिनट के ध्यान के लिए एक शांत स्थान। वही ब्रांड भाषा, कम दबाव और थोड़ा साफ़ मानसिक विराम।",
    cta: "आज का डॉकेट खोलें",
    pill:
      "दैनिक पहेली, डॉकेट चयन अभ्यास, कीबोर्ड शॉर्टकट और साझा किए जा सकने वाले परिणाम",
  },
} as const;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const copy =
    briefBreakPageCopy[locale as keyof typeof briefBreakPageCopy] ??
    briefBreakPageCopy.en;

  return {
    title: copy.title,
    description: copy.description,
    alternates: getLanguageAlternates("/brief-break"),
    openGraph: {
      title: copy.title,
      description: copy.description,
      url: buildCanonicalUrl("/brief-break"),
    },
  };
};

export default async function BriefBreakPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const copy =
    briefBreakPageCopy[locale as keyof typeof briefBreakPageCopy] ??
    briefBreakPageCopy.en;

  return (
    <div className="min-h-screen bg-background">
      <section className="relative overflow-hidden border-b border-border/60 bg-gradient-subtle">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(15,23,42,0.06),transparent_55%)] dark:bg-[radial-gradient(circle_at_50%_0%,rgba(248,250,252,0.08),transparent_55%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(15,23,42,0.018)_1px,transparent_1px),linear-gradient(90deg,rgba(15,23,42,0.018)_1px,transparent_1px)] bg-[size:72px_72px] [mask-image:radial-gradient(ellipse_70%_65%_at_50%_10%,black_35%,transparent_100%)] dark:bg-[linear-gradient(rgba(248,250,252,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(248,250,252,0.04)_1px,transparent_1px)]" />

        <div className="container-wide relative py-20 md:py-28">
          <div className="mx-auto max-w-5xl">
            <div className="mb-8 flex flex-wrap items-center justify-center gap-3 text-sm text-muted-foreground">
              <Link href={localizeHrefForLocale(locale, "/")} className="transition-colors hover:text-foreground">
                Home
              </Link>
              <span>/</span>
              <Link
                href={localizeHrefForLocale(locale, "/insights")}
                className="transition-colors hover:text-foreground"
              >
                Insights
              </Link>
              <span>/</span>
              <span className="text-foreground">{copy.breadcrumbCurrent}</span>
            </div>

            <div className="mx-auto max-w-4xl text-center">
              <div className="surface-inset inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.28em] text-muted-foreground shadow-sm backdrop-blur-sm">
                <Sparkles className="h-4 w-4 text-foreground" />
                {copy.badge}
              </div>

              <h1 className="mt-8 font-serif text-4xl leading-[0.98] tracking-tight text-foreground md:text-7xl">
                {copy.headingStart}
                <br />
                <span className="text-zinc-400 italic font-light dark:text-zinc-500">
                  {copy.headingEnd}
                </span>
              </h1>

              <p className="mx-auto mt-8 max-w-3xl text-lg leading-relaxed text-muted-foreground md:text-xl">
                {copy.intro}
              </p>

              <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
                <Button
                  asChild
                  className="rounded-full bg-foreground text-background hover:opacity-92"
                >
                  <Link href="#docket-zip">
                    {copy.cta}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <div className="surface-inset inline-flex items-center gap-2 px-4 py-2 text-sm text-foreground backdrop-blur-sm">
                  <Scale className="h-4 w-4 text-foreground" />
                  {copy.pill}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div id="docket-zip" className="container-wide py-16 md:py-24">
        <DocketZipGame />
      </div>
    </div>
  );
}
