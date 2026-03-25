"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { usePathname, useRouter } from "next/navigation";
import { ChevronDown, Globe } from "lucide-react";

import { routing, getLocalePrefix } from "@/i18n/routing";

type SupportedLocale = (typeof routing.locales)[number];

const localeNames: Record<SupportedLocale, string> = {
  en: "English",
  es: "Español",
  ur: "اردو",
  hi: "हिन्दी",
  bn: "বাংলা",
  pa: "ਪੰਜਾਬੀ",
  ar: "العربية",
  fa: "فارسی",
  tl: "Tagalog",
  zh: "中文",
  vi: "Tiếng Việt",
  ko: "한국어",
};

const localeFlags: Record<SupportedLocale, string> = {
  en: "🇺🇸",
  es: "🇲🇽",
  ur: "🇵🇰",
  hi: "🇮🇳",
  bn: "🇧🇩",
  pa: "🇮🇳",
  ar: "🇸🇦",
  fa: "🇮🇷",
  tl: "🇵🇭",
  zh: "🇨🇳",
  vi: "🇻🇳",
  ko: "🇰🇷",
};

export function LanguageSwitcher({
  currentLocale,
}: {
  currentLocale: SupportedLocale;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function onSelectChange(nextLocale: SupportedLocale) {
    const prefix = getLocalePrefix(pathname);
    
    // Remove the current locale prefix from pathname to get the core path
    let corePath = pathname;
    if (prefix && pathname.startsWith(prefix)) {
        corePath = pathname.slice(prefix.length) || "/";
    }

    if (!corePath.startsWith("/")) {
        corePath = "/" + corePath;
    }

    // Next-intl prefix default strategy means the defaultLocale can optionally omit its path?
    // Usually next-intl prefixes all locales in strictly 'always' or 'as-needed' strategy.
    // So we prefix with nextLocale
    const nextPrefix = nextLocale === "en" ? "/en" : `/${nextLocale}`;
    
    // Construct new path
    let newPath = `${nextPrefix}${corePath === "/" ? "" : corePath}`;
    
    if (newPath === "") newPath = "/";

    startTransition(() => {
      router.push(newPath);
      // We also enforce router.refresh() in some setups to clear RSC payload caching for language,
      // but standard push works smoothly.
    });
    setIsOpen(false);
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen((currentValue) => !currentValue)}
        disabled={isPending}
        className="flex h-9 items-center gap-2 rounded-full px-3 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 focus-visible:ring-offset-2"
        aria-label={`Current language: ${localeNames[currentLocale]}. Click to change language.`}
        aria-expanded={isOpen}
      >
        <Globe className="h-4 w-4" />
        <span className="hidden sm:inline">{localeFlags[currentLocale]}</span>
        <span className="hidden sm:inline">{localeNames[currentLocale]}</span>
        <ChevronDown
          className={`h-3 w-3 transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen ? (
        <div className="absolute right-0 z-50 mt-2 max-h-80 w-56 overflow-y-auto rounded-xl border border-zinc-100 bg-white py-1 shadow-lg">
          <div className="border-b border-zinc-100 px-3 py-2 text-xs font-semibold uppercase tracking-wider text-zinc-400">
            Select Language
          </div>
          {routing.locales.map((locale) => (
            <button
              key={locale}
              type="button"
              onClick={() => onSelectChange(locale)}
              className={`flex w-full items-center gap-3 px-3 py-2.5 text-left text-sm transition-colors hover:bg-zinc-50 ${locale === currentLocale
                  ? "bg-zinc-50 font-medium text-zinc-900"
                  : "text-zinc-600"
                }`}
            >
              <span className="text-lg">{localeFlags[locale]}</span>
              <span>{localeNames[locale]}</span>
              {locale === currentLocale ? (
                <span className="ml-auto text-zinc-400">✓</span>
              ) : null}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
