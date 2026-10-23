const RTL_LOCALES = new Set(["ar", "fa", "ur"]);

export function getTextDirection(locale: string): "rtl" | "ltr" {
  return RTL_LOCALES.has(locale) ? "rtl" : "ltr";
}
