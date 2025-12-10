import dynamic from 'next/dynamic';
import { HeroSection } from '@/components/sections/HeroSection';
const StatsSection = dynamic(() => import('@/components/sections/StatsSection').then(mod => mod.StatsSection));

// Dynamic imports for better performance (code splitting)
const ProcessSection = dynamic(() => import('@/components/sections/ProcessSection').then(mod => mod.ProcessSection));
const ServicesSection = dynamic(() => import('@/components/sections/ServicesSection').then(mod => mod.ServicesSection));
const WhyChooseUsSection = dynamic(() => import('@/components/sections/WhyChooseUsSection').then(mod => mod.WhyChooseUsSection));
const TestimonialsSection = dynamic(() => import('@/components/sections/TestimonialsSection').then(mod => mod.TestimonialsSection));
const AboutSection = dynamic(() => import('@/components/sections/AboutSection').then(mod => mod.AboutSection));
const PricingSection = dynamic(() => import('@/components/sections/PricingSection').then(mod => mod.PricingSection));
const FAQSection = dynamic(() => import('@/components/sections/FAQSection').then(mod => mod.FAQSection));
const CTASection = dynamic(() => import('@/components/sections/CTASection').then(mod => mod.CTASection));
const ContactSection = dynamic(() => import('@/components/sections/ContactSection').then(mod => mod.ContactSection));

export default function Home() {
  return (
    <div className="flex flex-col w-full">
      <HeroSection />
      <StatsSection />
      <ProcessSection />
      <ServicesSection />
      <WhyChooseUsSection />
      <TestimonialsSection />
      <AboutSection />
      <PricingSection />
      <FAQSection />
      <CTASection />
      <ContactSection />
    </div>
  );
}
