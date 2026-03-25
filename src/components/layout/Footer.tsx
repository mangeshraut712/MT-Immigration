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
    <footer className="bg-black text-white">
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
                nameClassName="text-base text-white"
              />
            </Link>
            <p className="text-sm text-zinc-400 leading-relaxed mb-5">
              {tFooter("tagline")}
            </p>
            <div className="space-y-2">
              <a
                href={firmConfig.contact.emailHref}
                className="flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors"
                aria-label={tFooter("emailAria", {
                  email: firmConfig.contact.email,
                })}
              >
                <Mail size={14} />
                {firmConfig.contact.email}
              </a>
              <a
                href={firmConfig.contact.phoneHref}
                className="flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors"
                aria-label={tFooter("phoneAria", {
                  phone: firmConfig.contact.phoneDisplay,
                })}
              >
                <Phone size={14} />
                {firmConfig.contact.phoneDisplay}
              </a>
              <p className="flex items-center gap-2 text-sm text-zinc-400">
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
            <h3 className="font-semibold text-xs text-white uppercase tracking-wide mb-4">
              {tFooter("services")}
            </h3>
            <ul className="space-y-2">
              {footerLinks.services.map((link, i) => (
                <li key={i}>
                  <Link
                    href={localizeHref(pathname, link.href)}
                    className="text-sm text-zinc-400 hover:text-white transition-colors inline-flex items-center gap-1 group"
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
            <h3 className="font-semibold text-xs text-white uppercase tracking-wide mb-4">
              {tFooter("company")}
            </h3>
            <ul className="space-y-2">
              {footerLinks.company.map((link, i) => (
                <li key={i}>
                  <Link
                    href={localizeHref(pathname, link.href)}
                    className="text-sm text-zinc-400 hover:text-white transition-colors inline-flex items-center gap-1 group"
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
            <h3 className="font-semibold text-xs text-white uppercase tracking-wide mb-4">
              {tFooter("support")}
            </h3>
            <ul className="space-y-2">
              {footerLinks.support.map((link, i) => (
                <li key={i}>
                  <Link
                    href={localizeHref(pathname, link.href)}
                    className="text-sm text-zinc-400 hover:text-white transition-colors inline-flex items-center gap-1 group"
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
            <h3 className="font-semibold text-xs text-white uppercase tracking-wide mb-4">
              Legal
            </h3>
            <ul className="space-y-2">
              {footerLinks.legal.map((link, i) => (
                <li key={i}>
                  <Link
                    href={localizeHref(pathname, link.href)}
                    className="text-sm text-zinc-400 hover:text-white transition-colors inline-flex items-center gap-1 group"
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
      <div className="border-t border-zinc-800">
        <div className="container-wide py-6">
          {/* Disclaimer */}
          <p className="text-xs text-zinc-500 leading-relaxed mb-4">
            {tFooter("disclaimer")}
          </p>

          {/* Copyright & Links */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 text-xs text-zinc-500">
            <p>
              {tFooter("copyright", {
                year: new Date().getFullYear(),
                name: firmConfig.name,
              })}
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <Link
                href={localizeHref(pathname, "/privacy")}
                className="hover:text-white transition-colors"
              >
                {tFooter("privacy")}
              </Link>
              <span className="text-zinc-700">|</span>
              <Link
                href={localizeHref(pathname, "/terms")}
                className="hover:text-white transition-colors"
              >
                {tFooter("terms")}
              </Link>
              <span className="text-zinc-700">|</span>
              <Link
                href={localizeHref(pathname, "/insights")}
                className="hover:text-white transition-colors"
              >
                {tFooter("insights")}
              </Link>
              <span className="text-zinc-700">|</span>
              <Link
                href="/sitemap.xml"
                className="hover:text-white transition-colors"
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
