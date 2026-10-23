const SPEECH_RECOGNITION_LANG: Record<string, string> = {
  en: "en-US",
  es: "es-ES",
  ur: "ur-PK",
  hi: "hi-IN",
  bn: "bn-BD",
  pa: "pa-IN",
  ar: "ar-SA",
  fa: "fa-IR",
  tl: "fil-PH",
  zh: "zh-CN",
  vi: "vi-VN",
  ko: "ko-KR",
};

export function speechRecognitionLang(locale: string) {
  return SPEECH_RECOGNITION_LANG[locale] ?? "en-US";
}
