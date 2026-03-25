"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import IntakeForm from "@/components/features/intake/IntakeForm";
import { Mail, Phone, MapPin, Clock } from "lucide-react";
import { firmConfig } from "@/config/firm";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const contactIcons = [Phone, Mail, MapPin, Clock] as const;

type ContactInfo = {
  label: string;
  tooltip: string;
  value: string;
  href?: string;
};

type FeeOption = {
  label: string;
  price: string;
};

export function ContactSection() {
  const tContact = useTranslations("contact");
  const contactInfo = (tContact.raw("cards") as Omit<ContactInfo, "value" | "href">[])
    .map((item, index) => ({
      ...item,
      value: [
        firmConfig.contact.phoneDisplay,
        firmConfig.contact.email,
        firmConfig.contact.city,
        firmConfig.contact.responseTime,
      ][index],
      href: [
        firmConfig.contact.phoneHref,
        firmConfig.contact.emailHref,
        undefined,
        undefined,
      ][index],
      icon: contactIcons[index],
    }));
  const feeOptions = tContact.raw("feeOptions") as FeeOption[];

  return (
    <section
      id="contact"
      className="section-padding relative overflow-hidden bg-gradient-subtle"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(15,23,42,0.04),transparent_38%)]" />

      <div className="container-wide relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16 max-w-3xl mx-auto"
        >
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="h-px w-12 bg-zinc-300"></div>
            <span className="text-sm font-semibold tracking-widest uppercase text-zinc-500">
              {tContact("title")}
            </span>
            <div className="h-px w-12 bg-zinc-300"></div>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-medium tracking-tight text-foreground mb-6 leading-[1.1]">
            {tContact("heading")}
          </h2>
          <p className="text-xl text-zinc-500 leading-relaxed max-w-2xl mx-auto">
            {tContact("subtitle")}
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8 lg:gap-12 items-start">
          {/* Contact Info Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="lg:col-span-1 space-y-6"
          >
            {/* Contact Cards */}
            <div className="surface-panel space-y-6 p-6 transition-shadow duration-500 hover:shadow-2xl md:space-y-8 md:p-8">
              <h3 className="text-lg md:text-xl font-serif font-bold text-foreground border-b border-border pb-3 md:pb-4">
                {tContact("contactInfo")}
              </h3>

              <TooltipProvider>
                <div className="space-y-6">
                  {contactInfo.map((item, index) =>
                    item.href ? (
                      <Tooltip key={index}>
                        <TooltipTrigger asChild>
                          <motion.a
                            href={item.href}
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="group flex items-start gap-4"
                          >
                            <motion.div
                              whileHover={{ scale: 1.1, rotate: 5 }}
                              className="rounded-xl bg-muted p-3 text-muted-foreground transition-all duration-300 group-hover:bg-foreground group-hover:text-background"
                            >
                              <item.icon size={20} strokeWidth={1.5} />
                            </motion.div>
                            <div>
                              <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-1">
                                {item.label}
                              </p>
                              <p className="text-lg font-medium text-foreground transition-colors">
                                {item.value}
                              </p>
                            </div>
                          </motion.a>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{item.tooltip}</p>
                        </TooltipContent>
                      </Tooltip>
                    ) : (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-start gap-4"
                      >
                        <div className="rounded-xl bg-muted p-3 text-muted-foreground">
                          <item.icon size={20} strokeWidth={1.5} />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-1">
                            {item.label}
                          </p>
                          <p className="text-lg font-medium text-foreground">
                            {item.value}
                          </p>
                        </div>
                      </motion.div>
                    ),
                  )}
                </div>
              </TooltipProvider>
            </div>

            {/* Pricing Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="relative overflow-hidden rounded-2xl bg-zinc-950 p-6 text-white shadow-xl md:rounded-[2rem] md:p-8"
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.2),transparent_50%)]" />
              <h3 className="text-xl font-serif font-bold mb-6 relative z-10">
                {tContact("consultationFees")}
              </h3>
              <div className="space-y-4 relative z-10">
                {feeOptions.map((option) => (
                  <div
                    key={option.label}
                    className="flex justify-between items-center p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/5 group-hover:bg-white/15 transition-colors"
                  >
                    <span className="font-medium">{option.label}</span>
                    <span className="text-2xl font-bold font-serif">
                      {option.price}
                    </span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-zinc-400 mt-6 relative z-10 text-center">
                {tContact("feeCredit")}
              </p>
            </motion.div>
          </motion.div>

          {/* Intake Form */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-2"
          >
            <IntakeForm />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
