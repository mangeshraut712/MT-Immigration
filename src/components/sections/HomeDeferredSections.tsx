"use client";

import dynamic from "next/dynamic";

function DeferredSection() {
  return <div aria-hidden="true" className="min-h-24" />;
}

const WhyChooseUsSection = dynamic(
  () =>
    import("@/components/sections/WhyChooseUsSection").then(
      (mod) => mod.WhyChooseUsSection,
    ),
  { ssr: false, loading: DeferredSection },
);
const TestimonialsSection = dynamic(
  () =>
    import("@/components/sections/TestimonialsSection").then(
      (mod) => mod.TestimonialsSection,
    ),
  { ssr: false, loading: DeferredSection },
);
const AboutSection = dynamic(
  () =>
    import("@/components/sections/AboutSection").then(
      (mod) => mod.AboutSection,
    ),
  { ssr: false, loading: DeferredSection },
);
const PricingSection = dynamic(
  () =>
    import("@/components/sections/PricingSection").then(
      (mod) => mod.PricingSection,
    ),
  { ssr: false, loading: DeferredSection },
);
const PaymentSection = dynamic(
  () =>
    import("@/components/sections/PaymentSection").then(
      (mod) => mod.PaymentSection,
    ),
  { ssr: false, loading: DeferredSection },
);
const InsightsPreviewSection = dynamic(
  () =>
    import("@/components/sections/InsightsPreviewSection").then(
      (mod) => mod.InsightsPreviewSection,
    ),
  { ssr: false, loading: DeferredSection },
);
const FAQSection = dynamic(
  () =>
    import("@/components/sections/FAQSection").then(
      (mod) => mod.FAQSection,
    ),
  { ssr: false, loading: DeferredSection },
);
const CTASection = dynamic(
  () =>
    import("@/components/sections/CTASection").then(
      (mod) => mod.CTASection,
    ),
  { ssr: false, loading: DeferredSection },
);
const ContactSection = dynamic(
  () =>
    import("@/components/sections/ContactSection").then(
      (mod) => mod.ContactSection,
    ),
  { ssr: false, loading: DeferredSection },
);
const BriefBreakSection = dynamic(
  () =>
    import("@/components/sections/BriefBreakSection").then(
      (mod) => mod.BriefBreakSection,
    ),
  { ssr: false, loading: DeferredSection },
);

export function HomeDeferredSections() {
  return (
    <>
      <WhyChooseUsSection />
      <TestimonialsSection />
      <AboutSection />
      <PricingSection />
      <PaymentSection />
      <InsightsPreviewSection />
      <FAQSection />
      <CTASection />
      <ContactSection />
      <BriefBreakSection />
    </>
  );
}
