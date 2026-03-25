import dynamic from "next/dynamic";

import { HeroSection } from "@/components/sections/HeroSection";
import { HomeDeferredSections } from "@/components/sections/HomeDeferredSections";

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
