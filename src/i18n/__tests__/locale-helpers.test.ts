import { speechRecognitionLang } from "@/i18n/speech-lang";
import { getTextDirection } from "@/i18n/text-direction";
import { runtimeUiCopy } from "@/i18n/runtime-ui";

describe("locale helpers", () => {
  it("marks Arabic, Persian, and Urdu as right-to-left", () => {
    expect(getTextDirection("ar")).toBe("rtl");
    expect(getTextDirection("fa")).toBe("rtl");
    expect(getTextDirection("ur")).toBe("rtl");
    expect(getTextDirection("en")).toBe("ltr");
    expect(getTextDirection("es")).toBe("ltr");
  });

  it("selects a speech-recognition language for each supported locale", () => {
    expect(speechRecognitionLang("es")).toBe("es-ES");
    expect(speechRecognitionLang("zh")).toBe("zh-CN");
    expect(speechRecognitionLang("ko")).toBe("ko-KR");
    expect(speechRecognitionLang("vi")).toBe("vi-VN");
    expect(speechRecognitionLang("unknown")).toBe("en-US");
  });

  it("keeps intake language and case-type choices aligned in every locale", () => {
    for (const copy of Object.values(runtimeUiCopy)) {
      expect(copy.intake.languages).toHaveLength(5);
      expect(copy.intake.caseTypes).toHaveLength(copy.intake.caseTypeLabels.length);
      expect(copy.chatbot.retryAfter).toContain("{seconds}");
      expect(copy.article.shareCopied.length).toBeGreaterThan(0);
    }
  });
});
