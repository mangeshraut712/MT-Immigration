import type { Locale } from "@/i18n/config";
import en from "@/i18n/messages/en.json";
import hi from "@/i18n/messages/hi.json";
import mr from "@/i18n/messages/mr.json";

const dictionaries = {
  en,
  hi,
  mr,
};

export type Messages = typeof en;

export const getMessages = (locale: Locale): Messages => dictionaries[locale];

