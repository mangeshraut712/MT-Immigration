import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Privacy practices for the M&T Immigration website and intake tools.',
};

export default function PrivacyPage() {
  return (
    <div className="bg-white">
      <div className="container-wide py-24 md:py-32 max-w-4xl">
        <div className="mb-10">
          <p className="text-sm font-semibold tracking-[0.2em] uppercase text-blue-600">
            Privacy Policy
          </p>
          <h1 className="text-4xl md:text-5xl font-serif font-medium tracking-tight mt-4">
            Privacy and intake data
          </h1>
          <p className="text-lg text-zinc-600 mt-6 max-w-3xl leading-relaxed">
            This website is designed to help prospective clients request a consultation
            and ask general immigration questions. Information submitted through the
            site is used only to review your inquiry, respond to you, and improve the
            website experience.
          </p>
        </div>

        <div className="space-y-10 text-zinc-700 leading-relaxed">
          <section>
            <h2 className="text-2xl font-serif font-medium mb-3">What we collect</h2>
            <p>
              We may collect the information you choose to provide, including your
              name, email address, phone number, preferred language, case type, and
              summary of your immigration matter.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-medium mb-3">How the AI assistant works</h2>
            <p>
              The website chat assistant provides general educational information only.
              It is not a lawyer and does not create an attorney-client relationship.
              Chat content may be processed by our AI provider to generate responses.
              Do not submit passport numbers, A-numbers, Social Security numbers,
              payment details, or other highly sensitive identifiers through chat.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-medium mb-3">How we use your information</h2>
            <p>
              We use submitted information to review potential matters, respond to
              consultation requests, coordinate follow-up, and maintain site security,
              including spam and abuse prevention.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-medium mb-3">No attorney-client relationship</h2>
            <p>
              Sending information through this website does not make you a client and
              does not create an attorney-client relationship. Representation begins
              only after a signed engagement agreement.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-medium mb-3">Contact</h2>
            <p>
              If you have questions about this policy or want to update information you
              submitted through the website, please contact the office directly.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
