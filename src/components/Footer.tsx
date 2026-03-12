"use client"

import Image from "next/image"
import Link from "next/link"
import { Github, Linkedin, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useLocale, useTranslations } from "next-intl"

const CURRENT_YEAR = new Date().getFullYear()

const socialLinks = [
  {
    name: "LinkedIn",
    href: "https://www.linkedin.com/in/vidyaraut17/",
    icon: Linkedin,
    iconClassName: "text-[#0A66C2]",
    hoverClassName: "hover:border-[#0A66C2]/40 hover:bg-[#0A66C2]/8",
  },
  {
    name: "GitHub",
    href: "https://github.com/vidyaraut17297",
    icon: Github,
    iconClassName: "text-[#181717] dark:text-white",
    hoverClassName: "hover:border-foreground/30 hover:bg-foreground/5",
  },
  {
    name: "Email",
    href: "mailto:vidyaraut17297@gmail.com",
    icon: Mail,
    iconClassName: "text-[#EA4335]",
    hoverClassName: "hover:border-[#EA4335]/35 hover:bg-[#EA4335]/8",
  },
]

const quickLinks = [
  { label: "Portfolio", href: "", isAnchor: false },
  { label: "Skills", href: "skills", isAnchor: false },
  { label: "Projects", href: "projects", isAnchor: false },
  { label: "Certifications", href: "certifications", isAnchor: false },
]

export function Footer() {
  const t = useTranslations("footer")
  const locale = useLocale()

  return (
    <footer className="relative border-t border-border/40 bg-background pt-8 pb-6">
      <div className="container relative mx-auto max-w-6xl grid gap-10 px-6 md:px-8 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:items-start">
        <div className="max-w-xl">
          <div className="mb-6 flex items-center gap-4">
            <div className="relative h-12 w-12 overflow-hidden rounded-2xl border border-foreground/10 bg-background shadow-sm transition-colors hover:border-foreground/30">
              <Image
                src="/logo.png"
                alt="Vidya Raut logo"
                fill
                sizes="48px"
                className="object-cover"
              />
            </div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">
              Vidya Raut Portfolio
            </p>
          </div>
          <Link
            href={`/${locale}`}
            className="font-display inline-block text-4xl sm:text-5xl font-medium tracking-tight text-foreground transition-colors hover:text-foreground/70"
          >
            Vidya Raut
          </Link>
          <p className="mt-5 max-w-lg text-[15px] leading-relaxed text-muted-foreground font-light">
            {t("summary")}
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[190px_minmax(0,1fr)] lg:items-start lg:pt-5">
          <div className="grid content-start gap-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-foreground/80">
              Explore
            </p>
            <div className="grid gap-3">
              {quickLinks.map((link) => (
                <Link
                  key={link.label}
                  href={
                    link.isAnchor
                      ? `/${locale}${link.href}`
                      : link.href
                        ? `/${locale}/${link.href}`
                        : `/${locale}`
                  }
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="grid gap-5 lg:max-w-[420px]">
            <div className="surface-soft rounded-[1.75rem] p-7">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-foreground/80">
                Connect & Collaborate
              </p>
              <div className="mt-5 flex gap-4">
                {socialLinks.map((social) => {
                  const Icon = social.icon
                  return (
                    <a
                      key={social.name}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex h-12 w-12 items-center justify-center border border-border/70 bg-background transition-all duration-300 ${social.hoverClassName}`}
                      aria-label={social.name}
                    >
                      <Icon className={`h-4 w-4 ${social.iconClassName}`} />
                    </a>
                  )
                })}
              </div>
            </div>

            <Button asChild className="btn-premium rounded-full h-12 px-8">
              <a href="mailto:vidyaraut17297@gmail.com">
                <Mail className="mr-2 h-4 w-4" />
                {t("cta")}
              </a>
            </Button>
            <p className="text-xs leading-6 text-muted-foreground">
              Prefer email? Start a conversation directly with Vidya and get a reply without filling
              out a separate form.
            </p>
          </div>
        </div>
      </div>

      <div className="container relative mx-auto mt-10 max-w-6xl px-6 md:px-8">
        <div className="flex flex-col gap-4 border-t border-border/50 py-6 text-sm text-muted-foreground font-medium md:flex-row md:items-center md:justify-between">
          <p>{t("rights", { year: CURRENT_YEAR })}</p>
          <p className="flex items-center gap-1.5 opacity-80">
            {t("builtWith")}
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
          </p>
        </div>
      </div>
    </footer>
  )
}
