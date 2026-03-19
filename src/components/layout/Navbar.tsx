"use client";

import { useEffect, useState } from "react";
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
import { localizeHref } from "@/i18n/routing";
import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher";

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
  const tNav = useTranslations("nav");
  const tCommon = useTranslations("common");
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [currentHash, setCurrentHash] = useState("");
  const { scrollY } = useScroll();

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleEscape);
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
      return pathname.startsWith("/insights");
    }

    if (pathname !== "/" || !href.startsWith("/#")) {
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
            ? "border-b border-black/5 bg-white/90 shadow-sm backdrop-blur-xl"
            : "bg-white/82 backdrop-blur-lg",
        )}
      >
        <div className="hidden border-b border-black/5 lg:block">
          <div className="container-wide flex h-9 items-center justify-between gap-6 text-[11px] font-medium uppercase tracking-[0.18em] text-zinc-500">
            <div className="flex min-w-0 items-center gap-6">
              {utilityItems.slice(0, 2).map((item) => (
                <div
                  key={item.text}
                  className="flex min-w-0 items-center gap-2 truncate"
                >
                  <item.icon className="h-3.5 w-3.5 flex-shrink-0 text-zinc-400" />
                  <span className="truncate">{item.text}</span>
                </div>
              ))}
            </div>

            <a
              href={firmConfig.contact.phoneHref}
              className="flex items-center gap-2 whitespace-nowrap transition-colors hover:text-black"
            >
              <Phone className="h-3.5 w-3.5 text-zinc-400" />
              {firmConfig.contact.phoneDisplay}
            </a>
          </div>
        </div>

        <div className="container-wide">
          <div className="flex h-[4.5rem] items-center justify-between gap-5">
            <Link href={homeHref} className="group flex items-center gap-3">
              <motion.div
                whileHover={{ scale: 1.01 }}
                transition={{ type: "spring", stiffness: 280, damping: 22 }}
                className="transition-all"
              >
                <SiteLogo
                  imageClassName="border-black/5"
                  nameClassName="hidden text-[1.65rem] leading-none text-zinc-950 sm:block"
                  priority
                />
              </motion.div>
            </Link>

            <div className="hidden items-center gap-1 rounded-full border border-zinc-200 bg-white px-2 py-1.5 shadow-sm lg:flex">
              {primaryNavItems.map((item) => {
                const isActive = isActiveNavItem(item.href);

                return (
                  <Link
                    key={item.name}
                    href={localizeHref(pathname, item.href)}
                    className={clsx(
                      "rounded-full px-4 py-2 text-sm font-medium transition-all",
                      isActive
                        ? "bg-black text-white"
                        : "text-zinc-600 hover:bg-zinc-100 hover:text-black",
                    )}
                  >
                    {tNav(item.name.toLowerCase() as "services" | "reviews" | "about" | "fees" | "insights" | "faq")}
                  </Link>
                );
              })}
            </div>

            <div className="hidden items-center lg:flex gap-3">
              <LanguageSwitcher currentLocale={locale as "en" | "es"} />
              <Button
                asChild
                size="sm"
                className="h-10 rounded-full bg-black px-6 font-semibold text-white shadow-lg transition-all hover:bg-zinc-800 hover:shadow-xl"
              >
                <Link href={consultationHref}>{tCommon("bookConsultation")}</Link>
              </Button>
            </div>

            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsOpen((currentValue) => !currentValue)}
              type="button"
              aria-expanded={isOpen}
              aria-controls="mobile-menu"
              aria-label={
                isOpen ? "Close navigation menu" : "Open navigation menu"
              }
              className="rounded-xl border border-zinc-200 bg-white p-3 sm:p-3.5 text-foreground shadow-sm transition-colors hover:bg-zinc-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 focus-visible:ring-offset-2 lg:hidden min-h-[44px] min-w-[44px] flex items-center justify-center"
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
              aria-label="Mobile navigation"
              aria-modal="true"
              className="overflow-hidden border-t border-zinc-200 bg-white lg:hidden"
            >
              <div className="container-wide space-y-6 py-6">
                <div className="space-y-3 rounded-[1.75rem] border border-zinc-200 bg-zinc-50 p-5">
                  {utilityItems.map((item) =>
                    item.href ? (
                      <a
                        key={item.text}
                        href={item.href}
                        className="flex items-center gap-3 text-sm text-zinc-700 transition-colors hover:text-black"
                      >
                        <item.icon className="h-4 w-4 text-zinc-400" />
                        <span>{item.text}</span>
                      </a>
                    ) : (
                      <div
                        key={item.text}
                        className="flex items-start gap-3 text-sm text-zinc-700"
                      >
                        <item.icon className="mt-0.5 h-4 w-4 flex-shrink-0 text-zinc-400" />
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
                              ? "bg-black text-white"
                              : "bg-white text-zinc-900 hover:bg-zinc-50",
                          )}
                        >
                          {tNav(item.name.toLowerCase() as "services" | "reviews" | "about" | "fees" | "insights" | "faq")}
                        </Link>
                      </motion.div>
                    );
                  })}
                </div>

                <div>
                  <Button
                    asChild
                    className="h-12 w-full rounded-2xl bg-black text-white hover:bg-zinc-800"
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
