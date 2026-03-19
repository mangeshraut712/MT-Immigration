import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Scale, Sparkles } from "lucide-react";

import { DocketZipGame } from "@/components/features/game/DocketZipGame";
import { Button } from "@/components/ui/button";
import { buildCanonicalUrl, getLanguageAlternates } from "@/config/site";

export const metadata: Metadata = {
  title: "Brief Break",
  description:
    "A playful law-themed puzzle room for moments of reset between serious immigration work.",
  alternates: getLanguageAlternates("/brief-break"),
  openGraph: {
    title: "Brief Break",
    description:
      "A playful law-themed puzzle room for moments of reset between serious immigration work.",
    url: buildCanonicalUrl("/brief-break"),
  },
};

export default function BriefBreakPage() {
  return (
    <div className="min-h-screen bg-white">
      <section className="relative overflow-hidden border-b border-black/5 bg-[#f6efe7]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(0,0,0,0.05),transparent_55%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.015)_1px,transparent_1px)] bg-[size:72px_72px] [mask-image:radial-gradient(ellipse_70%_65%_at_50%_10%,black_35%,transparent_100%)]" />

        <div className="container-wide relative py-20 md:py-28">
          <div className="mx-auto max-w-5xl">
            <div className="mb-8 flex flex-wrap items-center justify-center gap-3 text-sm text-zinc-500">
              <Link href="/" className="transition-colors hover:text-black">
                Home
              </Link>
              <span>/</span>
              <Link
                href="/insights"
                className="transition-colors hover:text-black"
              >
                Insights
              </Link>
              <span>/</span>
              <span className="text-zinc-900">Brief Break</span>
            </div>

            <div className="mx-auto max-w-4xl text-center">
              <div className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/70 px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.28em] text-zinc-600 shadow-sm backdrop-blur-sm">
                <Sparkles className="h-4 w-4 text-zinc-900" />
                Brief Break
              </div>

              <h1 className="mt-8 font-serif text-4xl leading-[0.98] tracking-tight text-zinc-950 md:text-7xl">
                Reset your head,
                <br />
                <span className="text-zinc-400 italic font-light">
                  not your standards.
                </span>
              </h1>

              <p className="mx-auto mt-8 max-w-3xl text-lg leading-relaxed text-zinc-600 md:text-xl">
                A quiet chamber for two or three minutes of focus between
                filings, drafts, and hard conversations. Same brand language,
                lower stakes, cleaner breathing room.
              </p>

              <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
                <Button
                  asChild
                  className="rounded-full bg-black text-white hover:bg-zinc-800"
                >
                  <Link href="#docket-zip">
                    Enter Today&apos;s Docket
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <div className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/70 px-4 py-2 text-sm text-zinc-700 backdrop-blur-sm">
                  <Scale className="h-4 w-4 text-zinc-900" />
                  Daily puzzle, practice docket selection, keyboard shortcuts,
                  and shareable results
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
