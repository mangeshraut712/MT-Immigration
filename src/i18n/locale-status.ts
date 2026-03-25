import { routing } from "@/i18n/routing";

type Locale = (typeof routing.locales)[number];

const fullyTranslatedLocales = new Set<Locale>(["en", "es"]);

const partialTranslationNotices: Record<Exclude<Locale, "en" | "es">, string> = {
  ar: "بعض أقسام الموقع ما زالت تظهر بالإنجليزية بينما نُكمل مراجعة الترجمة.",
  bn: "অনুবাদ সম্পূর্ণ না হওয়ায় সাইটের কিছু অংশ এখনও ইংরেজিতে দেখা যেতে পারে।",
  fa: "برخی بخش‌های سایت هنوز به انگلیسی نمایش داده می‌شوند تا ترجمه‌ها کامل و بازبینی شوند.",
  hi: "अनुवाद पूरा होने तक साइट के कुछ भाग अभी भी अंग्रेज़ी में दिखाई दे सकते हैं।",
  ko: "번역을 마무리하는 동안 사이트의 일부 섹션은 아직 영어로 표시될 수 있습니다.",
  pa: "ਜਦੋਂ ਤੱਕ ਅਨੁਵਾਦ ਪੂਰੇ ਨਹੀਂ ਹੁੰਦੇ, ਸਾਈਟ ਦੇ ਕੁਝ ਹਿੱਸੇ ਹਾਲੇ ਵੀ ਅੰਗਰੇਜ਼ੀ ਵਿੱਚ ਦਿਖ ਸਕਦੇ ਹਨ।",
  tl: "May ilang bahagi ng site na maaaring manatili munang nasa English habang kinukumpleto ang mga salin.",
  ur: "جب تک ترجمہ مکمل نہیں ہو جاتا، ویب سائٹ کے کچھ حصے ابھی بھی انگریزی میں نظر آ سکتے ہیں۔",
  vi: "Một số phần của trang web có thể vẫn hiển thị bằng tiếng Anh trong khi bản dịch đang được hoàn thiện.",
  zh: "在翻译完善之前，网站的部分内容可能仍会以英文显示。",
};

export function isLocaleTranslationComplete(locale: string): locale is Locale {
  return fullyTranslatedLocales.has(locale as Locale);
}

export function getLocaleTranslationNotice(locale: string) {
  if (isLocaleTranslationComplete(locale)) {
    return null;
  }

  return partialTranslationNotices[locale as Exclude<Locale, "en" | "es">] ?? null;
}

