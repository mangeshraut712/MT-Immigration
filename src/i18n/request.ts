import { getRequestConfig } from "next-intl/server";

import { routing } from "./routing";

type Messages = Record<string, unknown>;
type Locale = (typeof routing.locales)[number];

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function mergeMessages(base: Messages, override: Messages): Messages {
  const merged: Messages = { ...base };

  for (const [key, value] of Object.entries(override)) {
    const existing = merged[key];

    if (isPlainObject(existing) && isPlainObject(value)) {
      merged[key] = mergeMessages(existing, value);
      continue;
    }

    merged[key] = value;
  }

  return merged;
}

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  if (!locale || !routing.locales.includes(locale as Locale)) {
    locale = routing.defaultLocale;
  }

  const finalLocale = locale as Locale;
  const baseMessages = (await import(`../messages/en.json`)).default as Messages;
  const localeMessages =
    finalLocale === "en"
      ? {}
      : ((await import(`../messages/${finalLocale}.json`)).default as Messages);

  return {
    locale: finalLocale,
    messages: mergeMessages(baseMessages, localeMessages),
  };
});
