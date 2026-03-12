"use client"

import React, { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useLocale, useTranslations } from "next-intl"
import { useTheme } from "next-themes"
import { motion, AnimatePresence } from "framer-motion"
import {
  Briefcase,
  Code,
  Globe,
  GraduationCap,
  Home,
  Mail,
  Menu,
  Moon,
  Puzzle,
  Sparkles,
  Sun,
  X,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false)
  const { resolvedTheme, setTheme } = useTheme()
  const pathname = usePathname()
  const router = useRouter()
  const currentLocale = useLocale()
  const t = useTranslations("nav")
  const heroTitle = useTranslations("hero")("title")

  const isHomePage =
    pathname === `/${currentLocale}` || pathname === "/" || pathname === `/${currentLocale}/`

  const navigation = [
    { name: t("home"), href: "#home", icon: Home },
    { name: t("skills"), href: "#skills", icon: Sparkles },
    { name: t("projects"), href: "#projects", icon: Code },
    { name: t("experience"), href: "#experience", icon: Briefcase },
    { name: t("education"), href: "#education", icon: GraduationCap },
    { name: t("contact"), href: "#contact", icon: Mail },
    { name: t("game"), href: "#game", icon: Puzzle },
  ]

  const getSectionHref = (href: string) =>
    isHomePage || !href.startsWith("#") ? href : `/${currentLocale}${href}`

  const switchLanguage = (newLocale: string) => {
    const segments = pathname.split("/")
    segments[1] = newLocale
    router.push(segments.join("/"))
    setIsLangMenuOpen(false)
    setIsOpen(false)
  }

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleScrollTo = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault()
    setIsOpen(false)

    if (!href.startsWith("#")) {
      router.push(href)
      return
    }

    if (!isHomePage && href.startsWith("#")) {
      router.push(`/${currentLocale}${href}`)
      return
    }

    setTimeout(() => {
      const element = document.querySelector(href)
      if (!element) return

      const headerOffset = 88
      const elementPosition = element.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.scrollY - headerOffset

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      })
    }, 200)
  }

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={cn(
        "fixed left-0 right-0 top-0 z-50 transition-all duration-300 border-b",
        scrolled || !isHomePage
          ? "border-border bg-background shadow-sm"
          : "border-transparent bg-transparent"
      )}
    >
      <div className="container mx-auto px-6 md:px-8">
        <div className="flex h-16 md:h-20 items-center justify-between">
          <Link
            href={isHomePage ? "#home" : `/${currentLocale}`}
            onClick={isHomePage ? (e) => handleScrollTo(e, "#home") : undefined}
            className="group flex items-center gap-4"
          >
            <div className="relative h-10 w-10 overflow-hidden border border-foreground/10 bg-background">
              <Image
                src="/logo.png"
                alt="VR"
                width={40}
                height={40}
                className="object-cover transition-transform group-hover:scale-110"
              />
            </div>
            <div className="block min-w-0 max-w-[15rem] md:max-w-[19rem] lg:max-w-[24rem]">
              <p className="truncate text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
                Vidya Raut
              </p>
              <p className="line-clamp-1 text-sm font-medium leading-5 text-foreground/80 max-sm:hidden">
                {heroTitle}
              </p>
            </div>
          </Link>

          <div className="hidden items-center gap-1 min-[900px]:flex">
            {navigation.map((item) => (
              <a
                key={item.name}
                href={getSectionHref(item.href)}
                onClick={(e) => handleScrollTo(e, item.href)}
                className="rounded-full px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-primary/8 hover:text-foreground"
              >
                {item.name}
              </a>
            ))}

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
              className="ml-2 rounded-full text-muted-foreground hover:bg-primary/5 hover:text-foreground"
              aria-label="Toggle theme"
            >
              <>
                <Sun className="hidden h-4 w-4 dark:block" />
                <Moon className="h-4 w-4 dark:hidden" />
              </>
            </Button>

            <div className="relative ml-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsLangMenuOpen((prev) => !prev)}
                className="rounded-full text-muted-foreground hover:bg-primary/5 hover:text-foreground"
                aria-label="Change language"
              >
                <Globe className="h-4 w-4" />
              </Button>

              <AnimatePresence>
                {isLangMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 top-full mt-3 w-36 overflow-hidden rounded-2xl border border-border/70 bg-card shadow-xl"
                  >
                    {["en", "hi", "mr"].map((lang) => (
                      <button
                        key={lang}
                        onClick={() => switchLanguage(lang)}
                        className={cn(
                          "w-full px-4 py-2 text-left text-sm transition-colors hover:bg-primary/5 hover:text-primary",
                          currentLocale === lang
                            ? "bg-primary/5 font-bold text-primary"
                            : "text-muted-foreground"
                        )}
                      >
                        {lang === "en" ? "English" : lang === "hi" ? "Hindi" : "Marathi"}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="flex items-center gap-2 min-[900px]:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
              className="rounded-full text-muted-foreground hover:bg-primary/5 hover:text-foreground"
              aria-label="Toggle theme"
            >
              <>
                <Sun className="hidden h-4 w-4 dark:block" />
                <Moon className="h-4 w-4 dark:hidden" />
              </>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen((prev) => !prev)}
              className="rounded-full text-muted-foreground hover:bg-primary/5 hover:text-foreground"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-3 overflow-hidden rounded-[1.75rem] border border-border bg-background shadow-2xl min-[900px]:hidden"
          >
            <div className="container mx-auto max-h-[calc(100vh-4rem)] space-y-2 overflow-y-auto px-4 py-4">
              {navigation.map((item) => {
                const Icon = item.icon
                return (
                  <a
                    key={item.name}
                    href={getSectionHref(item.href)}
                    onClick={(e) => handleScrollTo(e, item.href)}
                    className="flex items-center gap-3 rounded-2xl px-4 py-3 transition-colors hover:bg-primary/5 hover:text-primary"
                  >
                    <Icon className="h-5 w-5" />
                    <span className="font-medium">{item.name}</span>
                  </a>
                )
              })}

              <div className="my-2 border-t border-border pt-3">
                <div className="px-4 py-2 text-sm font-semibold text-muted-foreground">
                  Language
                </div>
                <div className="grid grid-cols-3 gap-2 px-4">
                  {["en", "hi", "mr"].map((lang) => (
                    <button
                      key={lang}
                      onClick={() => switchLanguage(lang)}
                      className={cn(
                        "rounded-lg border border-border/50 py-2 text-sm font-medium transition-colors",
                        currentLocale === lang
                          ? "border-primary bg-primary text-primary-foreground"
                          : "bg-card text-foreground hover:bg-primary/5 hover:text-primary"
                      )}
                    >
                      {lang === "en" ? "EN" : lang === "hi" ? "HI" : "MR"}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}
