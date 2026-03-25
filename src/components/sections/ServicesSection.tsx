"use client";

import { motion, useReducedMotion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import {
  Heart,
  GraduationCap,
  Shield,
  Briefcase,
  Plane,
  RefreshCw,
  Zap,
  FileText,
  Globe,
  ArrowRight,
  CheckCircle2,
  Clock,
  ChevronRight,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Link from "next/link";
import { localizeHref } from "@/i18n/routing";

const serviceIcons = {
  visitor: Plane,
  student: GraduationCap,
  marriage: Heart,
  "change-status": RefreshCw,
  "work-permit": Briefcase,
  asylum: Shield,
  "u-visa": FileText,
  "advance-parole": Globe,
  expedite: Zap,
} as const;

type ServiceItem = {
  id: keyof typeof serviceIcons;
  title: string;
  description: string;
  timeline: string;
  price: string;
  features: string[];
  requirements: string[];
  stat: string;
};

export function ServicesSection() {
  const pathname = usePathname();
  const tServices = useTranslations("services");
  const shouldReduceMotion = useReducedMotion();
  const services = (tServices.raw("items") as ServiceItem[]).map((service) => ({
    ...service,
    icon: serviceIcons[service.id],
  }));

  return (
    <section
      id="services"
      className="section-padding relative overflow-hidden bg-gradient-subtle"
    >
      <div className="absolute left-1/2 top-0 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-zinc-100/70 blur-[100px] pointer-events-none" />

      <div className="container-wide relative z-10">
        {/* Header */}
        <motion.div
          initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: shouldReduceMotion ? 0 : 0.4 }}
          className="max-w-3xl mb-16 md:mb-24"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="h-px w-12 bg-primary"></div>
            <span className="text-sm font-semibold tracking-widest uppercase text-primary">
              {tServices("title")}
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-medium text-foreground mb-8 leading-[1.1]">
            {tServices("heading").split(",")[0]}, <br />
            <span className="text-zinc-400 italic">
              {tServices("heading").split(",").slice(1).join(",").trim()}
            </span>
          </h2>
          <p className="text-xl text-zinc-500 leading-relaxed max-w-2xl text-balance">
            {tServices("subtitle")}
          </p>
        </motion.div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {services.map((service, index) => (
            <Dialog key={service.id}>
              <DialogTrigger asChild>
                <motion.button
                  type="button"
                  initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: shouldReduceMotion ? 0 : index * 0.05, duration: shouldReduceMotion ? 0 : 0.3 }}
                  whileHover={shouldReduceMotion ? {} : { y: -4 }}
                  className="surface-panel group relative flex h-full flex-col rounded-2xl p-6 text-left transition-all duration-300 hover:border-border hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 md:p-8"
                >
                  <div className="mb-6 inline-flex rounded-xl bg-muted p-3 text-foreground transition-all duration-300 group-hover:scale-110 group-hover:bg-foreground group-hover:text-background">
                    <service.icon size={28} strokeWidth={1.5} />
                  </div>

                  <h3 className="text-2xl font-serif font-medium mb-3 group-hover:text-black transition-colors">
                    {service.title}
                  </h3>

                  <p className="text-zinc-500 mb-6 leading-relaxed flex-grow">
                    {service.description}
                  </p>

                  <div className="flex items-center justify-between pt-6 border-t border-zinc-50 mt-auto">
                    <Badge
                      variant="secondary"
                      className="bg-zinc-100 text-zinc-600 font-normal"
                    >
                      {service.timeline}
                    </Badge>
                    <div className="flex items-center text-sm font-semibold text-zinc-900 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                      {tServices("details")}{" "}
                      <ChevronRight size={16} className="ml-1" />
                    </div>
                  </div>
                </motion.button>
              </DialogTrigger>

              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto sm:max-h-none">
                <DialogHeader>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 rounded-xl bg-zinc-100 text-zinc-900">
                      <service.icon size={32} />
                    </div>
                    <div>
                      <DialogTitle className="text-2xl font-serif">
                        {service.title}
                      </DialogTitle>
                      <DialogDescription className="text-base mt-1">
                        {service.description}
                      </DialogDescription>
                    </div>
                  </div>
                </DialogHeader>

                <div className="grid md:grid-cols-2 gap-8 py-4">
                  {/* Features */}
                  <div className="space-y-4">
                    <h4 className="font-semibold text-foreground flex items-center gap-2">
                      <CheckCircle2 size={18} className="text-zinc-600" />
                      {tServices("whatWeHandle")}
                    </h4>
                    <ul className="space-y-3">
                      {service.features.map((feature, i) => (
                        <li
                          key={i}
                          className="text-sm text-zinc-600 flex items-start gap-2"
                        >
                          <span className="block w-1.5 h-1.5 rounded-full bg-zinc-300 mt-1.5 shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Requirements & Info */}
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                        <FileText size={18} className="text-zinc-600" />
                        {tServices("keyRequirements")}
                      </h4>
                      <ul className="space-y-2">
                        {service.requirements.map((req, i) => (
                          <li
                            key={i}
                            className="mr-2 mb-2 inline-block rounded-md bg-muted px-3 py-1.5 text-sm text-muted-foreground"
                          >
                            {req}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="surface-muted rounded-xl p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-zinc-500 flex items-center gap-2">
                          <Clock size={14} /> {tServices("estimatedTimeline")}
                        </span>
                        <span className="font-semibold text-foreground">
                          {service.timeline}
                        </span>
                      </div>
                      <div className="h-px bg-zinc-200 my-3" />
                      <div className="flex items-center gap-2 text-sm text-zinc-600">
                        <Star
                          size={14}
                          className="text-zinc-600 fill-zinc-600"
                        />
                        <span className="italic">{service.stat}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-zinc-100 mt-4">
                  <Button
                    asChild
                    className="h-12 flex-1 rounded-xl bg-foreground text-base text-background hover:opacity-92"
                  >
                    <Link href={localizeHref(pathname, "/#contact")}>
                      {tServices("bookConsultation")}
                      <ArrowRight size={16} className="ml-2" />
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-12 flex-1 rounded-xl border-border/70 text-base hover:bg-muted"
                    asChild
                  >
                    <Link href={localizeHref(pathname, "/#pricing")}>
                      {tServices("viewPricing", { price: service.price })}
                    </Link>
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          ))}
        </div>
      </div>
    </section>
  );
}
