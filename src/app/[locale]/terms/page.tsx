import type { Metadata } from "next";
import Link from "next/link";
import { buildCanonicalUrl, getLanguageAlternates } from "@/config/site";
import { localizeHrefForLocale } from "@/i18n/routing";

export const metadata: Metadata = {
  title: "Terms of Use",
  description: "Terms governing use of the M&T Immigration website.",
  alternates: getLanguageAlternates("/terms"),
  openGraph: {
    title: "Terms of Use",
    description: "Terms governing use of the M&T Immigration website.",
    url: buildCanonicalUrl("/terms"),
  },
};

export default async function TermsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <div className="bg-white">
      <section className="relative overflow-hidden border-b border-black/5 bg-zinc-50">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(0,0,0,0.03),transparent_55%)]" />
        <div className="container-wide max-w-4xl py-24 md:py-28">
          <div className="relative">
            <div className="mb-6 flex flex-wrap gap-3 text-sm text-zinc-500">
              <Link
                href={localizeHrefForLocale(locale, "/")}
                className="transition-colors hover:text-black"
              >
                Home
              </Link>
              <span>/</span>
              <Link
                href={localizeHrefForLocale(locale, "/insights")}
                className="transition-colors hover:text-black"
              >
                Insights
              </Link>
              <span>/</span>
              <span className="text-zinc-900">Terms of Use</span>
            </div>
            <div className="inline-flex rounded-full border border-zinc-200 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-zinc-600 shadow-sm">
              Terms of Use
            </div>
            <h1 className="mt-6 text-4xl font-serif font-medium tracking-tight text-zinc-950 md:text-6xl">
              Website terms
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-relaxed text-zinc-600">
              By using this website, you agree to use it for lawful,
              informational purposes only. The website content is provided as
              general information and does not constitute legal advice.
            </p>
          </div>
        </div>
      </section>

      <div className="container-wide max-w-4xl py-16 md:py-20">
        <div className="space-y-10 text-zinc-700 leading-relaxed">
          <section>
            <h2 className="text-2xl font-serif font-medium mb-3">
              Informational use only
            </h2>
            <p>
              Nothing on this website should be treated as legal advice for your
              specific facts. Immigration outcomes depend on individual
              circumstances, government policy, and agency discretion.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-medium mb-3">
              No attorney-client relationship
            </h2>
            <p>
              Visiting the site, using the chat assistant, or sending an intake
              request does not create an attorney-client relationship.
              Representation begins only after a signed written agreement.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-medium mb-3">
              No guarantee of results
            </h2>
            <p>
              Prior outcomes, examples, and discussions on the website do not
              guarantee a similar result in any future matter.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-medium mb-3">
              Responsible use
            </h2>
            <p>
              You agree not to misuse the website, attempt to disrupt its
              operation, or submit misleading, unlawful, or abusive content
              through forms or chat.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-medium mb-3">Updates</h2>
            <p>
              These terms may be updated from time to time as the website,
              intake tools, or legal requirements change.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
