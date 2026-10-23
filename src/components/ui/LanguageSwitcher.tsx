"use client";

import { useEffect, useId, useRef, useState, useTransition } from "react";
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
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuId = useId();

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const currentItem = dropdownRef.current?.querySelector<HTMLButtonElement>(
      "[aria-current='true']",
    );
    currentItem?.focus();
  }, [isOpen]);

  function closeMenu(restoreFocus = false) {
    setIsOpen(false);
    if (restoreFocus) {
      buttonRef.current?.focus();
    }
  }

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
    closeMenu();
  }

  function onMenuKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    const items = Array.from(
      dropdownRef.current?.querySelectorAll<HTMLButtonElement>(
        "[role='menuitem']",
      ) ?? [],
    );
    if (items.length === 0) {
      return;
    }

    const index = items.indexOf(document.activeElement as HTMLButtonElement);
    if (event.key === "Escape") {
      event.preventDefault();
      event.stopPropagation();
      closeMenu(true);
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      items[(index + 1) % items.length]?.focus();
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      items[(index - 1 + items.length) % items.length]?.focus();
      return;
    }

    if (event.key === "Home") {
      event.preventDefault();
      items[0]?.focus();
      return;
    }

    if (event.key === "End") {
      event.preventDefault();
      items[items.length - 1]?.focus();
    }
  }

  return (
    <div
      className="relative"
      ref={dropdownRef}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          setIsOpen(false);
        }
      }}
    >
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setIsOpen((currentValue) => !currentValue)}
        disabled={isPending}
        className="flex h-9 items-center gap-2 rounded-full px-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        aria-label={`Current language: ${localeNames[currentLocale]}. Change language.`}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-controls={menuId}
      >
        <Globe className="h-4 w-4" aria-hidden="true" />
        <span className="hidden sm:inline" aria-hidden="true">
          {localeFlags[currentLocale]}
        </span>
        <span className="hidden sm:inline">{localeNames[currentLocale]}</span>
        <ChevronDown
          className={`h-3 w-3 transition-transform ${isOpen ? "rotate-180" : ""}`}
          aria-hidden="true"
        />
      </button>

      {isOpen ? (
        <div
          id={menuId}
          role="menu"
          aria-label="Select Language"
          onKeyDown={onMenuKeyDown}
          className="absolute right-0 z-50 mt-2 max-h-80 w-56 overflow-y-auto rounded-xl border border-border/70 bg-card py-1 shadow-lg"
        >
          <div className="border-b border-border/70 px-3 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Select Language
          </div>
          {routing.locales.map((locale) => (
            <button
              key={locale}
              type="button"
              role="menuitem"
              onClick={() => onSelectChange(locale)}
              aria-current={locale === currentLocale ? "true" : undefined}
              className={`flex w-full items-center gap-3 px-3 py-2.5 text-left text-sm transition-colors hover:bg-muted focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring ${locale === currentLocale
                  ? "bg-muted font-medium text-foreground"
                  : "text-muted-foreground"
                }`}
            >
              <span className="text-lg" aria-hidden="true">
                {localeFlags[locale]}
              </span>
              <span>{localeNames[locale]}</span>
              {!isLocaleTranslationComplete(locale) ? (
                <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-amber-800">
                  Beta
                </span>
              ) : null}
              {locale === currentLocale ? (
                <span className="ml-auto text-muted-foreground">✓</span>
              ) : null}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
