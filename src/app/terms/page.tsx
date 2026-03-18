import type { Metadata } from 'next';
import Link from 'next/link';
import { buildCanonicalUrl, getLanguageAlternates } from '@/config/site';

export const metadata: Metadata = {
  title: 'Terms of Use',
  description: 'Terms governing use of the M&T Immigration website.',
  alternates: getLanguageAlternates('/terms'),
  openGraph: {
    title: 'Terms of Use',
    description: 'Terms governing use of the M&T Immigration website.',
    url: buildCanonicalUrl('/terms'),
  },
};

export default function TermsPage() {
  return (
    <div className="bg-white">
      <div className="container-wide py-24 md:py-32 max-w-4xl">
        <div className="mb-10">
          <div className="mb-6 flex flex-wrap gap-3 text-sm text-zinc-500">
            <Link href="/" className="transition-colors hover:text-blue-700">Home</Link>
            <span>/</span>
            <Link href="/insights" className="transition-colors hover:text-blue-700">Insights</Link>
            <span>/</span>
            <Link href="/#contact" className="transition-colors hover:text-blue-700">Contact</Link>
          </div>
          <p className="text-sm font-semibold tracking-[0.2em] uppercase text-blue-600">
            Terms of Use
          </p>
          <h1 className="text-4xl md:text-5xl font-serif font-medium tracking-tight mt-4">
            Website terms
          </h1>
          <p className="text-lg text-zinc-600 mt-6 max-w-3xl leading-relaxed">
            By using this website, you agree to use it for lawful, informational
            purposes only. The website content is provided as general information and
            does not constitute legal advice.
          </p>
        </div>

        <div className="space-y-10 text-zinc-700 leading-relaxed">
          <section>
            <h2 className="text-2xl font-serif font-medium mb-3">Informational use only</h2>
            <p>
              Nothing on this website should be treated as legal advice for your
              specific facts. Immigration outcomes depend on individual circumstances,
              government policy, and agency discretion.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-medium mb-3">No attorney-client relationship</h2>
            <p>
              Visiting the site, using the chat assistant, or sending an intake request
              does not create an attorney-client relationship. Representation begins
              only after a signed written agreement.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-medium mb-3">No guarantee of results</h2>
            <p>
              Prior outcomes, examples, and discussions on the website do not guarantee
              a similar result in any future matter.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-medium mb-3">Responsible use</h2>
            <p>
              You agree not to misuse the website, attempt to disrupt its operation, or
              submit misleading, unlawful, or abusive content through forms or chat.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-medium mb-3">Updates</h2>
            <p>
              These terms may be updated from time to time as the website, intake tools,
              or legal requirements change.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
