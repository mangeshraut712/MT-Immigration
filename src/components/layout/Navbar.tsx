"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useTranslations } from "next-intl";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
} from "framer-motion";
import { Clock3, MapPin, Menu, Phone, X } from "lucide-react";
import clsx from "clsx";

import { SiteLogo } from "@/components/branding/SiteLogo";
import { Button } from "@/components/ui/button";
import { firmConfig } from "@/config/firm";
import { localizeHref, routing, stripLocalePrefix } from "@/i18n/routing";
import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher";
import { ThemeToggle } from "@/components/ui/theme-toggle";

const primaryNavItems = [
  { name: "Services", href: "/#services" },
  { name: "Reviews", href: "/#testimonials" },
  { name: "About", href: "/#about" },
  { name: "Fees", href: "/#pricing" },
  { name: "Insights", href: "/insights" },
  { name: "FAQ", href: "/#faq" },
] as const;

const utilityItems: ReadonlyArray<{
  icon: typeof MapPin;
  text: string;
  href?: string;
}> = [
  {
    icon: MapPin,
    text: `${firmConfig.contact.city} • ${firmConfig.contact.regionLabel}`,
  },
  {
    icon: Clock3,
    text: `${firmConfig.contact.hours} • ${firmConfig.contact.responseTime}`,
  },
  {
    icon: Phone,
    text: firmConfig.contact.phoneDisplay,
    href: firmConfig.contact.phoneHref,
  },
] as const;

export default function Navbar({ locale = "en" }: { locale?: string }) {
  const currentLocale = routing.locales.includes(
    locale as (typeof routing.locales)[number],
  )
    ? (locale as (typeof routing.locales)[number])
    : routing.defaultLocale;
  const tNav = useTranslations("nav");
  const tCommon = useTranslations("common");
  const pathname = usePathname();
  const normalizedPathname = stripLocalePrefix(pathname || "/");
  const [isOpen, setIsOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const menuWasOpenRef = useRef(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [currentHash, setCurrentHash] = useState("");
  const { scrollY } = useScroll();

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    const menuButton = menuButtonRef.current;
    document.body.style.overflow = "hidden";
    menuWasOpenRef.current = true;

    const focusable = () =>
      Array.from(
        menuRef.current?.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ) ?? [],
      );

    const focusTimer = window.setTimeout(() => {
      focusable()[0]?.focus();
    }, 0);

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
        return;
      }

      if (event.key !== "Tab") {
        return;
      }

      const items = focusable();
      if (items.length === 0) {
        return;
      }

      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
      window.clearTimeout(focusTimer);
      if (menuWasOpenRef.current) {
        menuButton?.focus();
        menuWasOpenRef.current = false;
      }
    };
  }, [isOpen]);

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 24);
  });

  useEffect(() => {
    const syncHash = () => {
      setCurrentHash(window.location.hash);
    };

    syncHash();
    window.addEventListener("hashchange", syncHash);
    return () => window.removeEventListener("hashchange", syncHash);
  }, []);

  function isActiveNavItem(href: string) {
    if (href === "/insights") {
      return normalizedPathname.startsWith("/insights");
    }

    if (normalizedPathname !== "/" || !href.startsWith("/#")) {
      return false;
    }

    if (!currentHash) {
      return false;
    }

    return href === `/${currentHash}`;
  }

  function closeMenu() {
    setIsOpen(false);
  }

  const homeHref = localizeHref(pathname, "/");
  const consultationHref = localizeHref(pathname, "/#contact");

  return (
    <nav aria-label="Primary">
      <motion.div
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className={clsx(
          "fixed left-0 right-0 top-0 z-50 transition-all duration-300",
          isScrolled
            ? "border-b border-border/70 bg-background/90 shadow-[0_18px_40px_-30px_rgba(15,23,42,0.28)] backdrop-blur-2xl"
            : "bg-background/75 backdrop-blur-xl",
        )}
      >
        <div className="hidden border-b border-border/60 lg:block">
          <div className="container-wide flex h-9 items-center justify-between gap-6 text-[11px] font-medium uppercase tracking-[0.18em] text-zinc-700 dark:text-zinc-300">
            <div className="flex min-w-0 items-center gap-6">
              {utilityItems.slice(0, 2).map((item) => (
                <div
                  key={item.text}
                  className="flex min-w-0 items-center gap-2 truncate"
                >
                  <item.icon className="h-3.5 w-3.5 shrink-0 text-zinc-600 dark:text-zinc-300" />
                  <span className="truncate">{item.text}</span>
                </div>
              ))}
            </div>

            <a
              href={firmConfig.contact.phoneHref}
              className="flex items-center gap-2 whitespace-nowrap transition-colors hover:text-foreground"
            >
              <Phone className="h-3.5 w-3.5 text-zinc-600 dark:text-zinc-300" />
              {firmConfig.contact.phoneDisplay}
            </a>
          </div>
        </div>

        <div className="container-wide">
          <div className="flex h-18 items-center justify-between gap-5">
            <Link href={homeHref} aria-label={firmConfig.shortName} className="group flex items-center gap-3">
              <motion.div
                whileHover={{ scale: 1.01 }}
                transition={{ type: "spring", stiffness: 280, damping: 22 }}
                className="transition-all"
              >
                <SiteLogo
                  imageClassName="border-black/5 dark:border-white/10"
                  nameClassName="hidden text-[1.65rem] leading-none text-foreground sm:block"
                  priority
                  decorative
                />
              </motion.div>
            </Link>

            <div className="hidden items-center gap-1 rounded-full border border-border/70 bg-background/90 px-2 py-1.5 shadow-[0_16px_36px_-30px_rgba(15,23,42,0.35)] backdrop-blur-xl lg:flex">
              {primaryNavItems.map((item) => {
                const isActive = isActiveNavItem(item.href);

                return (
                  <Link
                    key={item.name}
                    href={localizeHref(pathname, item.href)}
                    className={clsx(
                      "rounded-full px-4 py-2 text-sm font-medium transition-all",
                      isActive
                        ? "bg-foreground text-background shadow-xs"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground",
                    )}
                  >
                    {tNav(item.name.toLowerCase() as "services" | "reviews" | "about" | "fees" | "insights" | "faq")}
                  </Link>
                );
              })}
            </div>

            <div className="hidden items-center lg:flex gap-3">
              <LanguageSwitcher currentLocale={currentLocale} />
              <ThemeToggle />
              <Button
                asChild
                size="sm"
                className="h-10 rounded-full bg-foreground px-6 font-semibold text-background shadow-lg transition-all hover:opacity-92 hover:shadow-xl"
              >
                <Link href={consultationHref}>{tCommon("bookConsultation")}</Link>
              </Button>
            </div>

            <motion.button
              ref={menuButtonRef}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsOpen((currentValue) => !currentValue)}
              type="button"
              aria-expanded={isOpen}
              aria-controls="mobile-menu"
              aria-label={
                isOpen ? "Close navigation menu" : "Open navigation menu"
              }
              className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl border border-border/70 bg-background/90 p-3 text-foreground shadow-xs transition-colors hover:bg-muted focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 sm:p-3.5 lg:hidden"
            >
              <AnimatePresence mode="wait">
                {isOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X size={22} />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu size={22} />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.28, ease: "easeInOut" }}
              id="mobile-menu"
              ref={menuRef}
              role="dialog"
              aria-label="Mobile navigation"
              aria-modal="true"
              className="overflow-hidden border-t border-border/70 bg-background/96 backdrop-blur-xl lg:hidden"
            >
              <div className="container-wide space-y-6 py-6">
                <div className="surface-muted space-y-3 p-5">
                  {utilityItems.map((item) =>
                    item.href ? (
                      <a
                        key={item.text}
                        href={item.href}
                        className="flex items-center gap-3 text-sm text-muted-foreground transition-colors hover:text-foreground"
                      >
                        <item.icon className="h-4 w-4 text-zinc-600 dark:text-zinc-300" />
                        <span>{item.text}</span>
                      </a>
                    ) : (
                      <div
                        key={item.text}
                        className="flex items-start gap-3 text-sm text-muted-foreground"
                      >
                        <item.icon className="mt-0.5 h-4 w-4 shrink-0 text-zinc-600 dark:text-zinc-300" />
                        <span>{item.text}</span>
                      </div>
                    ),
                  )}
                </div>

                <div className="space-y-2">
                  {primaryNavItems.map((item, index) => {
                    const isActive = isActiveNavItem(item.href);

                    return (
                      <motion.div
                        key={item.name}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <Link
                          href={localizeHref(pathname, item.href)}
                          onClick={closeMenu}
                          className={clsx(
                            "block rounded-2xl px-5 py-4 text-base font-medium transition-all",
                            isActive
                              ? "bg-foreground text-background"
                              : "bg-background text-foreground hover:bg-muted",
                          )}
                        >
                          {tNav(item.name.toLowerCase() as "services" | "reviews" | "about" | "fees" | "insights" | "faq")}
                        </Link>
                      </motion.div>
                    );
                  })}
                </div>

                <div>
                  <div className="flex items-center gap-3">
                    <LanguageSwitcher currentLocale={currentLocale} />
                    <ThemeToggle />
                  </div>
                </div>

                <div>
                  <Button
                    asChild
                    className="h-12 w-full rounded-2xl bg-foreground text-background hover:opacity-92"
                  >
                    <Link href={consultationHref} onClick={closeMenu}>
                      {tCommon("bookConsultation")}
                    </Link>
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </nav>
  );
}
