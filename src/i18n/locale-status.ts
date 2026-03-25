import { routing } from "@/i18n/routing";

type Locale = (typeof routing.locales)[number];

const fullyTranslatedLocales = new Set<Locale>([
  "en", "es", "ur", "hi", "bn", "pa", "ar", "fa", "tl", "zh", "vi", "ko"
]);

export function isLocaleTranslationComplete(locale: string): locale is Locale {
  return fullyTranslatedLocales.has(locale as Locale);
}

export function getLocaleTranslationNotice(locale: string) {
  void locale;
  return null;
}
