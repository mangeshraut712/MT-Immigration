import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { ArrowUpRight, Mail, MapPin, Phone } from "lucide-react";

import { SiteLogo } from "@/components/branding/SiteLogo";
import { firmConfig } from "@/config/firm";
import { localizeHrefForLocale } from "@/i18n/routing";

type FooterLinkGroup = {
  name: string;
  href: string;
};

export default async function Footer({ locale }: { locale: string }) {
  const tFooter = await getTranslations({ locale, namespace: "footer" });
  const footerLinks = tFooter.raw("links") as Record<
    "services" | "company" | "support" | "legal",
    FooterLinkGroup[]
  >;
  const homeHref = localizeHrefForLocale(locale, "/");

  return (
    <footer className="border-t border-border/70 bg-card text-card-foreground">
      <div className="container-wide py-12 md:py-16">
        <div className="grid grid-cols-2 gap-6 md:grid-cols-5 md:gap-6">
          <div className="col-span-2 md:col-span-1">
            <Link href={homeHref} className="group mb-5 flex items-center gap-3">
              <SiteLogo
                imageClassName="border-white/10 shadow-md transition-transform group-hover:scale-105"
                nameClassName="text-base text-foreground"
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
          </div>

          {(["services", "company", "support", "legal"] as const).map((group) => (
            <div key={group}>
              <h3 className="mb-4 text-xs font-semibold uppercase tracking-wide text-foreground">
                {tFooter(group)}
              </h3>
              <ul className="space-y-2">
                {footerLinks[group].map((link, index) => (
                  <li key={`${group}-${link.href}-${link.name}-${index}`}>
                    <Link
                      href={localizeHrefForLocale(locale, link.href)}
                      className="group inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.name}
                      <ArrowUpRight className="h-3 w-3 opacity-0 transition-opacity group-hover:opacity-100" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-border/70">
        <div className="container-wide py-6">
          <p className="mb-4 text-xs leading-relaxed text-muted-foreground">
            {tFooter("disclaimer")}
          </p>

          <div className="flex flex-col items-start justify-between gap-3 text-xs text-muted-foreground md:flex-row md:items-center">
            <p>
              {tFooter("copyright", {
                year: new Date().getFullYear(),
                name: firmConfig.name,
              })}
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <Link
                href={localizeHrefForLocale(locale, "/privacy")}
                className="transition-colors hover:text-foreground"
              >
                {tFooter("privacy")}
              </Link>
              <span className="text-border">|</span>
              <Link
                href={localizeHrefForLocale(locale, "/terms")}
                className="transition-colors hover:text-foreground"
              >
                {tFooter("terms")}
              </Link>
              <span className="text-border">|</span>
              <Link
                href={localizeHrefForLocale(locale, "/insights")}
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
