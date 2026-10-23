import dynamic from "next/dynamic";
import type { Metadata } from "next";

import { HeroSection } from "@/components/sections/HeroSection";
import { HomeDeferredSections } from "@/components/sections/HomeDeferredSections";
import { getLanguageAlternates, siteConfig } from "@/config/site";

const StatsSection = dynamic(() =>
  import("@/components/sections/StatsSection").then((mod) => mod.StatsSection),
);

const ProcessSection = dynamic(() =>
  import("@/components/sections/ProcessSection").then(
    (mod) => mod.ProcessSection,
  ),
);

const ServicesSection = dynamic(() =>
  import("@/components/sections/ServicesSection").then(
    (mod) => mod.ServicesSection,
  ),
);

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const alternates = getLanguageAlternates("/");

  return {
    title: siteConfig.defaultTitle,
    description: siteConfig.description,
    alternates,
    openGraph: {
      title: siteConfig.defaultTitle,
      description: siteConfig.description,
      url: alternates.canonical,
      locale,
    },
  };
}

export default function Home() {
  return (
    <div className="flex w-full flex-col">
      <HeroSection />
      <StatsSection />
      <ProcessSection />
      <ServicesSection />
      <HomeDeferredSections />
    </div>
  );
}
