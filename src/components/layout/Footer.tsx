"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { ArrowUpRight, Phone, Mail, MapPin } from "lucide-react";
import { firmConfig } from "@/config/firm";
import { SiteLogo } from "@/components/branding/SiteLogo";
import { localizeHref } from "@/i18n/routing";

type FooterLinkGroup = {
  name: string;
  href: string;
};

export default function Footer() {
  const tFooter = useTranslations("footer");
  const pathname = usePathname();
  const homeHref = localizeHref(pathname, "/");
  const footerLinks = tFooter.raw("links") as Record<
    "services" | "company" | "support" | "legal",
    FooterLinkGroup[]
  >;

  return (
    <footer className="border-t border-border/70 bg-card text-card-foreground">
      {/* Main Footer */}
      <div className="container-wide py-12 md:py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6 md:gap-6">
          {/* Brand Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="col-span-2 md:col-span-1"
          >
            <Link href={homeHref} className="flex items-center gap-3 mb-5 group">
              <SiteLogo
                imageClassName="border-white/10 shadow-md group-hover:scale-105 transition-transform"
                nameClassName="text-base text-zinc-50"
              />
            </Link>
            <p className="mb-5 text-sm leading-relaxed text-muted-foreground">
              {tFooter("tagline")}
            </p>
            <div className="space-y-2">
              <a
                href={firmConfig.contact.emailHref}
                className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
                aria-label={tFooter("emailAria", {
                  email: firmConfig.contact.email,
                })}
              >
                <Mail size={14} />
                {firmConfig.contact.email}
              </a>
              <a
                href={firmConfig.contact.phoneHref}
                className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
                aria-label={tFooter("phoneAria", {
                  phone: firmConfig.contact.phoneDisplay,
                })}
              >
                <Phone size={14} />
                {firmConfig.contact.phoneDisplay}
              </a>
              <p className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin size={14} />
                {firmConfig.contact.city}
              </p>
            </div>
          </motion.div>

          {/* Services Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.05 }}
          >
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-wide text-foreground">
              {tFooter("services")}
            </h3>
            <ul className="space-y-2">
              {footerLinks.services.map((link, i) => (
                <li key={i}>
                  <Link
                    href={localizeHref(pathname, link.href)}
                    className="group inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.name}
                    <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Company Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-wide text-foreground">
              {tFooter("company")}
            </h3>
            <ul className="space-y-2">
              {footerLinks.company.map((link, i) => (
                <li key={i}>
                  <Link
                    href={localizeHref(pathname, link.href)}
                    className="group inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.name}
                    <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Support Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
          >
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-wide text-foreground">
              {tFooter("support")}
            </h3>
            <ul className="space-y-2">
              {footerLinks.support.map((link, i) => (
                <li key={i}>
                  <Link
                    href={localizeHref(pathname, link.href)}
                    className="group inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.name}
                    <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Legal Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-wide text-foreground">
              {tFooter("legal")}
            </h3>
            <ul className="space-y-2">
              {footerLinks.legal.map((link, i) => (
                <li key={i}>
                  <Link
                    href={localizeHref(pathname, link.href)}
                    className="group inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.name}
                    <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>

      {/* Bottom Bar - Apple Style */}
      <div className="border-t border-border/70">
        <div className="container-wide py-6">
          {/* Disclaimer */}
          <p className="mb-4 text-xs leading-relaxed text-muted-foreground">
            {tFooter("disclaimer")}
          </p>

          {/* Copyright & Links */}
          <div className="flex flex-col items-start justify-between gap-3 text-xs text-muted-foreground md:flex-row md:items-center">
            <p>
              {tFooter("copyright", {
                year: new Date().getFullYear(),
                name: firmConfig.name,
              })}
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <Link
                href={localizeHref(pathname, "/privacy")}
                className="transition-colors hover:text-foreground"
              >
                {tFooter("privacy")}
              </Link>
              <span className="text-border">|</span>
              <Link
                href={localizeHref(pathname, "/terms")}
                className="transition-colors hover:text-foreground"
              >
                {tFooter("terms")}
              </Link>
              <span className="text-border">|</span>
              <Link
                href={localizeHref(pathname, "/insights")}
                className="transition-colors hover:text-foreground"
              >
                {tFooter("insights")}
              </Link>
              <span className="text-border">|</span>
              <Link
                href="/sitemap.xml"
                className="transition-colors hover:text-foreground"
              >
                {tFooter("siteMap")}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
