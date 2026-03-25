"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ChevronDown, Globe } from "lucide-react";

import { routing, stripLocalePrefix } from "@/i18n/routing";
import { isLocaleTranslationComplete } from "@/i18n/locale-status";

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
  const searchParams = useSearchParams();
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
    const corePath = stripLocalePrefix(pathname || "/");
    const search = searchParams.toString();
    const hash = typeof window !== "undefined" ? window.location.hash : "";
    const newPath =
      corePath === "/" ? `/${nextLocale}` : `/${nextLocale}${corePath}`;
    const target = `${newPath}${search ? `?${search}` : ""}${hash}`;

    startTransition(() => {
      router.push(target);
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
              {!isLocaleTranslationComplete(locale) ? (
                <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-amber-800">
                  Beta
                </span>
              ) : null}
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
