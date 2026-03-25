import type { Metadata } from "next";
import Link from "next/link";
import { buildCanonicalUrl, getLanguageAlternates } from "@/config/site";
import { localizeHrefForLocale } from "@/i18n/routing";

const termsPageCopy = {
  en: {
    title: "Terms of Use",
    description: "Terms governing use of the M&T Immigration website.",
    breadcrumbCurrent: "Terms of Use",
    badge: "Terms of Use",
    heading: "Website terms",
    intro:
      "By using this website, you agree to use it for lawful, informational purposes only. The website content is provided as general information and does not constitute legal advice.",
    sections: [
      {
        title: "Informational use only",
        body: "Nothing on this website should be treated as legal advice for your specific facts. Immigration outcomes depend on individual circumstances, government policy, and agency discretion.",
      },
      {
        title: "No attorney-client relationship",
        body: "Visiting the site, using the chat assistant, or sending an intake request does not create an attorney-client relationship. Representation begins only after a signed written agreement.",
      },
      {
        title: "No guarantee of results",
        body: "Prior outcomes, examples, and discussions on the website do not guarantee a similar result in any future matter.",
      },
      {
        title: "Responsible use",
        body: "You agree not to misuse the website, attempt to disrupt its operation, or submit misleading, unlawful, or abusive content through forms or chat.",
      },
      {
        title: "Updates",
        body: "These terms may be updated from time to time as the website, intake tools, or legal requirements change.",
      },
    ],
  },
  hi: {
    title: "उपयोग की शर्तें",
    description: "M&T इमिग्रेशन वेबसाइट के उपयोग को नियंत्रित करने वाली शर्तें।",
    breadcrumbCurrent: "उपयोग की शर्तें",
    badge: "उपयोग की शर्तें",
    heading: "वेबसाइट शर्तें",
    intro:
      "इस वेबसाइट का उपयोग करके आप सहमत होते हैं कि इसका उपयोग केवल वैध और सूचनात्मक उद्देश्यों के लिए किया जाएगा। वेबसाइट की सामग्री सामान्य जानकारी के रूप में दी गई है और यह कानूनी सलाह नहीं है।",
    sections: [
      {
        title: "केवल सूचना हेतु उपयोग",
        body: "इस वेबसाइट की किसी भी सामग्री को आपके विशिष्ट तथ्यों के लिए कानूनी सलाह नहीं माना जाना चाहिए। इमिग्रेशन परिणाम व्यक्तिगत परिस्थितियों, सरकारी नीति और एजेंसी विवेक पर निर्भर करते हैं।",
      },
      {
        title: "कोई वकील-ग्राहक संबंध नहीं",
        body: "साइट पर आना, चैट सहायक का उपयोग करना या इंटेक अनुरोध भेजना वकील-ग्राहक संबंध नहीं बनाता। प्रतिनिधित्व केवल हस्ताक्षरित लिखित समझौते के बाद शुरू होता है।",
      },
      {
        title: "परिणाम की कोई गारंटी नहीं",
        body: "वेबसाइट पर बताए गए पूर्व परिणाम, उदाहरण या चर्चाएँ किसी भविष्य के मामले में समान परिणाम की गारंटी नहीं देतीं।",
      },
      {
        title: "जिम्मेदार उपयोग",
        body: "आप सहमत हैं कि वेबसाइट का दुरुपयोग नहीं करेंगे, उसके संचालन में बाधा डालने की कोशिश नहीं करेंगे, और फॉर्म या चैट के माध्यम से भ्रामक, अवैध या अपमानजनक सामग्री जमा नहीं करेंगे।",
      },
      {
        title: "अपडेट",
        body: "वेबसाइट, इंटेक टूल्स या कानूनी आवश्यकताओं में बदलाव के साथ ये शर्तें समय-समय पर अपडेट की जा सकती हैं।",
      },
    ],
  },
} as const;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const copy =
    termsPageCopy[locale as keyof typeof termsPageCopy] ?? termsPageCopy.en;

  return {
    title: copy.title,
    description: copy.description,
    alternates: getLanguageAlternates("/terms"),
    openGraph: {
      title: copy.title,
      description: copy.description,
      url: buildCanonicalUrl("/terms"),
    },
  };
};

export default async function TermsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const copy =
    termsPageCopy[locale as keyof typeof termsPageCopy] ?? termsPageCopy.en;

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
              <span className="text-zinc-900">{copy.breadcrumbCurrent}</span>
            </div>
            <div className="inline-flex rounded-full border border-zinc-200 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-zinc-600 shadow-sm">
              {copy.badge}
            </div>
            <h1 className="mt-6 text-4xl font-serif font-medium tracking-tight text-zinc-950 md:text-6xl">
              {copy.heading}
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-relaxed text-zinc-600">
              {copy.intro}
            </p>
          </div>
        </div>
      </section>

      <div className="container-wide max-w-4xl py-16 md:py-20">
        <div className="space-y-10 text-zinc-700 leading-relaxed">
          {copy.sections.map((section) => (
            <section key={section.title}>
              <h2 className="mb-3 text-2xl font-serif font-medium">
                {section.title}
              </h2>
              <p>{section.body}</p>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
