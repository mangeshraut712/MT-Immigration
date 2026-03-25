import type { Metadata } from "next";
import Link from "next/link";
import { buildCanonicalUrl, getLanguageAlternates } from "@/config/site";
import { localizeHrefForLocale } from "@/i18n/routing";

const privacyPageCopy = {
  en: {
    title: "Privacy Policy",
    description:
      "Privacy practices for the M&T Immigration website and intake tools.",
    breadcrumbCurrent: "Privacy Policy",
    badge: "Privacy Policy",
    heading: "Privacy and intake data",
    intro:
      "This website is designed to help prospective clients request a consultation and ask general immigration questions. Information submitted through the site is used only to review your inquiry, respond to you, and improve the website experience.",
    sections: [
      {
        title: "What we collect",
        body: "We may collect the information you choose to provide, including your name, email address, phone number, preferred language, case type, and summary of your immigration matter.",
      },
      {
        title: "How the AI assistant works",
        body: "The website chat assistant provides general educational information only. It is not a lawyer and does not create an attorney-client relationship. Chat content may be processed by our AI provider to generate responses. Do not submit passport numbers, A-numbers, Social Security numbers, payment details, or other highly sensitive identifiers through chat.",
      },
      {
        title: "How we use your information",
        body: "We use submitted information to review potential matters, respond to consultation requests, coordinate follow-up, and maintain site security, including spam and abuse prevention.",
      },
      {
        title: "No attorney-client relationship",
        body: "Sending information through this website does not make you a client and does not create an attorney-client relationship. Representation begins only after a signed engagement agreement.",
      },
      {
        title: "Contact",
        body: "If you have questions about this policy or want to update information you submitted through the website, please contact the office directly.",
      },
    ],
  },
  hi: {
    title: "गोपनीयता नीति",
    description:
      "M&T इमिग्रेशन वेबसाइट और इंटेक टूल्स के लिए गोपनीयता प्रथाएँ।",
    breadcrumbCurrent: "गोपनीयता नीति",
    badge: "गोपनीयता नीति",
    heading: "गोपनीयता और इंटेक डेटा",
    intro:
      "यह वेबसाइट संभावित क्लाइंट्स को परामर्श का अनुरोध करने और सामान्य इमिग्रेशन प्रश्न पूछने में मदद करने के लिए बनाई गई है। वेबसाइट के माध्यम से भेजी गई जानकारी केवल आपकी पूछताछ की समीक्षा करने, आपको उत्तर देने और वेबसाइट अनुभव सुधारने के लिए उपयोग की जाती है।",
    sections: [
      {
        title: "हम क्या एकत्र करते हैं",
        body: "हम वह जानकारी एकत्र कर सकते हैं जो आप स्वयं प्रदान करते हैं, जैसे आपका नाम, ईमेल पता, फोन नंबर, पसंदीदा भाषा, मामले का प्रकार और आपके इमिग्रेशन मामले का सार।",
      },
      {
        title: "AI सहायक कैसे काम करता है",
        body: "वेबसाइट चैट सहायक केवल सामान्य शैक्षिक जानकारी प्रदान करता है। यह वकील नहीं है और वकील-ग्राहक संबंध नहीं बनाता। प्रतिक्रियाएँ तैयार करने के लिए चैट सामग्री हमारे AI प्रदाता द्वारा संसाधित की जा सकती है। कृपया चैट में पासपोर्ट नंबर, A-नंबर, सोशल सिक्योरिटी नंबर, भुगतान विवरण या अन्य अत्यधिक संवेदनशील पहचानकर्ता साझा न करें।",
      },
      {
        title: "हम आपकी जानकारी का उपयोग कैसे करते हैं",
        body: "हम प्राप्त जानकारी का उपयोग संभावित मामलों की समीक्षा करने, परामर्श अनुरोधों का जवाब देने, फॉलो-अप समन्वय करने और स्पैम तथा दुरुपयोग रोकथाम सहित वेबसाइट सुरक्षा बनाए रखने के लिए करते हैं।",
      },
      {
        title: "कोई वकील-ग्राहक संबंध नहीं",
        body: "इस वेबसाइट के माध्यम से जानकारी भेजने से आप क्लाइंट नहीं बन जाते और न ही वकील-ग्राहक संबंध बनता है। प्रतिनिधित्व केवल हस्ताक्षरित एंगेजमेंट समझौते के बाद शुरू होता है।",
      },
      {
        title: "संपर्क",
        body: "यदि इस नीति के बारे में आपके प्रश्न हैं या आप वेबसाइट के माध्यम से भेजी गई जानकारी को अपडेट करना चाहते हैं, तो कृपया सीधे कार्यालय से संपर्क करें।",
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
    privacyPageCopy[locale as keyof typeof privacyPageCopy] ??
    privacyPageCopy.en;

  return {
    title: copy.title,
    description: copy.description,
    alternates: getLanguageAlternates("/privacy"),
    openGraph: {
      title: copy.title,
      description: copy.description,
      url: buildCanonicalUrl("/privacy"),
    },
  };
};

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const copy =
    privacyPageCopy[locale as keyof typeof privacyPageCopy] ??
    privacyPageCopy.en;

  return (
    <div className="bg-background text-foreground">
      <section className="bg-gradient-subtle relative overflow-hidden border-b border-border/70">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(0,0,0,0.03),transparent_55%)] dark:bg-[radial-gradient(circle_at_50%_0%,rgba(248,250,252,0.08),transparent_55%)]" />
        <div className="container-wide max-w-4xl py-24 md:py-28">
          <div className="relative">
            <div className="mb-6 flex flex-wrap gap-3 text-sm text-muted-foreground">
              <Link
                href={localizeHrefForLocale(locale, "/")}
                className="transition-colors hover:text-foreground"
              >
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
            <div className="inline-flex rounded-full border border-border/70 bg-card px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground shadow-sm">
              {copy.badge}
            </div>
            <h1 className="mt-6 text-4xl font-serif font-medium tracking-tight text-foreground md:text-6xl">
              {copy.heading}
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-relaxed text-muted-foreground">
              {copy.intro}
            </p>
          </div>
        </div>
      </section>

      <div className="container-wide max-w-4xl py-16 md:py-20">
        <div className="space-y-10 leading-relaxed text-muted-foreground">
          {copy.sections.map((section) => (
            <section key={section.title}>
              <h2 className="mb-3 text-2xl font-serif font-medium text-foreground">
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
