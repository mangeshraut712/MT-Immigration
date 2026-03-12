export const locales = ["en", "hi", "mr"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

export const rtlLocales = new Set<Locale>([]);

export const isLocale = (value: string): value is Locale =>
  locales.includes(value as Locale);

export const isRtlLocale = (value: Locale) => rtlLocales.has(value);

