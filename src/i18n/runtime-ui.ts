export type RuntimeUiLocale = "en" | "hi" | "ur" | "es" | "ar" | "bn" | "fa" | "ko" | "pa" | "tl" | "vi" | "zh";

export function getRuntimeUiLocale(locale: string): RuntimeUiLocale {
  const supported: RuntimeUiLocale[] = ["en", "hi", "ur", "es", "ar", "bn", "fa", "ko", "pa", "tl", "vi", "zh"];
  if (supported.includes(locale as RuntimeUiLocale)) {
    return locale as RuntimeUiLocale;
  }
  return "en";
}

type ChatAgentFallbackCopy = {
  title: string;
  suggestions: string[];
  actionLabel: string;
};

export const runtimeUiCopy = {
  en: {
    chatbot: {
      openChat: "Open chat",
      title: "M&T Immigration AI",
      subtitle: "Specialist routing + review",
      closeChat: "Close chat",
      generalInfoOnly: "General info only • No attorney-client relationship",
      routeTo: "Route To",
      autoRoutingByIssue: "Auto-routing by issue",
      auto: "Auto",
      routingAndReviewing: "Routing & Reviewing",
      respondingSuffix: "responding",
      askQuestion: "Ask an immigration question",
      placeholder: "Ask about visas, green cards or deadlines...",
      startDictation: "Start dictation",
      stopDictation: "Stop dictation",
      dictationUnsupported: "Dictation is not supported in this browser",
      dictationStopped: "Dictation stopped.",
      dictationUnavailable: "Dictation is not supported in this browser.",
      dictationCaptured: "Dictation captured. Review the message before sending.",
      dictationDenied: "Microphone permission was denied.",
      dictationFailed: "Dictation could not be completed.",
      dictationListening: "Listening. Speak your question clearly.",
      generalGuidanceOnly: "General guidance only",
      messagesLengthError: "Messages must be between 1 and {max} characters.",
      aiUnavailable: "AI is temporarily unavailable. Showing general guidance only.",
      timeoutError: "The assistant took too long to respond. Please try again.",
      requestFailed: "We could not complete the chat request.",
      emptyResponse: "The assistant returned an empty response.",
      sendMessage: "Send message",
      enterToSend: "Enter to send, Shift + Enter for gap.",
      requestReview: "Ready to proceed? Request a case review",
      fallbackAgents: {
        screening: {
          title: "Intake Clerk",
          suggestions: [
            "What should I prepare before a consultation?",
            "How do I know if my issue is urgent?",
            "What case types do you handle?"
          ],
          actionLabel: "Request Case Review"
        },
        documents: {
          title: "Document Counsel",
          suggestions: [
            "What if my documents are not in English?",
            "Do I need originals or copies?",
            "Which prior USCIS notices matter most?"
          ],
          actionLabel: "Prepare Documents"
        },
        deadlines: {
          title: "Hearing Clerk",
          suggestions: [
            "I have an immigration court date",
            "I received a deadline from USCIS",
            "I have an interview notice next week"
          ],
          actionLabel: "Urgent Consultation"
        },
        strategy: {
          title: "Lead Counsel",
          suggestions: [
            "What options might fit my situation?",
            "How do consultations work?",
            "What affects filing strategy most?"
          ],
          actionLabel: "Book Strategy Consult"
        }
      } satisfies Record<string, ChatAgentFallbackCopy>
    },
    intake: {
      steps: ["Contact", "Case Details", "Review"],
      errors: {
        name: "Enter the full name you want us to use.",
        email: "Enter a valid email address.",
        phone: "Enter a phone number we can reach.",
        language: "Choose the language you prefer.",
        caseType: "Choose the matter you want help with.",
        summary: "Add a short summary with enough detail for a review.",
        consent: "You must confirm the intake disclosure before submitting."
      },
      toasts: {
        completeRequired: "Please complete the required fields before continuing.",
        confirmDisclosure: "Please confirm the disclosure before submitting.",
        reviewFields: "Please review the highlighted intake fields and try again.",
        submitError: "We could not submit your request.",
        success: "Consultation request received.",
        successSent: "We sent a confirmation email and will follow up using your preferred contact details.",
        successDefault: "We will review your information and follow up using your preferred contact details."
      },
      contactInfoTitle: "Contact Information",
      contactInfoDesc: "Start with the best way for the attorney to reach you.",
      fullName: "Full Name",
      emailAddress: "Email Address",
      phone: "Phone",
      preferredLanguage: "Preferred Language",
      select: "Select",
      caseDetailsTitle: "Case Details",
      caseDetailsDesc: "Tell us enough to evaluate the matter and the next step.",
      caseType: "Case Type",
      selectServiceType: "Select service type",
      summary: "Brief Summary",
      summaryPlaceholder: "Describe your current status, deadlines, and the help you need.",
      summaryHelp: "Include deadlines, prior filings, and any urgent hearing dates.",
      documentsAvailable: "Documents Available",
      passport: "Passport",
      receipts: "USCIS receipts or notices",
      reviewTitle: "Review & Submit",
      reviewDesc: "Confirm the intake details before sending them to the office.",
      reviewLabels: {
        name: "Name",
        email: "Email",
        phone: "Phone",
        language: "Language",
        caseType: "Case Type",
        summary: "Summary"
      },
      consentPrefix: "I understand this form is for intake review only, does not create an attorney-client relationship, and is subject to the",
      privacyPolicy: "Privacy Policy",
      back: "Back",
      continue: "Continue",
      submitting: "Submitting...",
      pleaseWait: "Please wait {seconds}s",
      submitRequest: "Submit Request",
      languages: ["English", "Spanish", "Urdu", "Punjabi", "French"],
      caseTypes: [
        "Visitor Visa",
        "Student Visa",
        "Change of Status",
        "Marriage-Based",
        "Work Permit",
        "Asylum",
        "Removal Defense"
      ],
      caseTypeLabels: [
        "Visitor Visa (B1/B2)",
        "Student Visa (F-1)",
        "Change of Status",
        "Marriage-Based Green Card",
        "Work Permit (EAD)",
        "Asylum",
        "Removal / Court Matter"
      ]
    },
    insights: {
      filters: { all: "All", "case-studies": "Case Studies", news: "News", analysis: "Analysis" },
      refreshTimeout: "Refreshing the live public-source feed took too long. Showing the last verified snapshot.",
      refreshSnapshot: "Showing the last verified snapshot.",
      refreshDefault: "Could not refresh the live public-source feed. Showing the last verified snapshot.",
      heroBadge: "Insights",
      backToSite: "Back to main site",
      headingStart: "Case studies, news,",
      headingHighlight: "and practical reads",
      headingEnd: "in one place.",
      liveDesk: "Live public-source desk updated {date}",
      snapshotDesk: "Verified public-source snapshot {date}",
      featured: "Featured",
      seeCaseStudies: "See case studies",
      topicTracks: "Topic Tracks",
      topicTracksDesc: "Entry points tied to the source-backed stories already on this page, not generic AI topic pages.",
      sourceWatch: "Source Watch",
      sourceStandards: "Source Standards",
      publicDecisions: "Public Decisions",
      caseStudies: "Case Studies",
      caseStudiesDesc: "These cards summarize public decisions and real-world immigration fact patterns, not private client victories. They are meant to show how timing, evidence, and procedural posture affect outcomes in practice.",
      latestNews: "Latest News",
      latestNewsHeadingStart: "Agency changes and policy movement,",
      latestNewsHeadingHighlight: "stripped to what matters.",
      latestNewsDesc: "Short reads focused on filings, timing, and procedural shifts that change what clients should do next.",
      analysisBlogs: "Analysis & Blogs",
      analysisHeadingStart: "Longer reads when the update",
      analysisHeadingHighlight: "needs practical context.",
      analysisDesc: "Commentary chosen for strategy value, not content volume, so readers can move from headline to implication quickly.",
      editorialNote: "Editorial Note",
      editorialHeadingStart: "Clean updates are useful.",
      editorialHeadingHighlight: "Legal advice is still personal.",
      requestLegalGuidance: "Request legal guidance"
    },
    article: {
      backToInsights: "Back to Insights",
      sourceLabel: "Source",
      share: "Share",
      relatedContent: "Related Content",
      needCounsel: "Need specific counsel?",
      counselDesc: "Book a consultation to discuss your specific immigration matter with our lead attorney.",
      bookConsultation: "Book Consultation"
    }
  },
  hi: {
    chatbot: {
      openChat: "चैट खोलें",
      title: "M&T इमिग्रेशन AI",
      subtitle: "विशेषज्ञ रूटिंग + समीक्षा",
      closeChat: "चैट बंद करें",
      generalInfoOnly: "केवल सामान्य जानकारी • कोई वकील-ग्राहक संबंध नहीं",
      routeTo: "रूट करें",
      autoRoutingByIssue: "मुद्दे के आधार पर स्वतः रूटिंग",
      auto: "ऑटो",
      routingAndReviewing: "रूटिंग और समीक्षा",
      respondingSuffix: "जवाब दे रहा है",
      askQuestion: "इमिग्रेशन संबंधी प्रश्न पूछें",
      placeholder: "वीज़ा, ग्रीन कार्ड या समयसीमाओं के बारे में पूछें...",
      startDictation: "डिक्टेशन शुरू करें",
      stopDictation: "डिक्टेशन बंद करें",
      dictationUnsupported: "इस ब्राउज़र में डिक्टेशन समर्थित नहीं है",
      dictationStopped: "डिक्टेशन बंद कर दिया गया।",
      dictationUnavailable: "इस ब्राउज़र में डिक्टेशन समर्थित नहीं है।",
      dictationCaptured: "डिक्टेशन रिकॉर्ड हो गया। भेजने से पहले संदेश जाँच लें।",
      dictationDenied: "माइक्रोफोन की अनुमति अस्वीकार कर दी गई।",
      dictationFailed: "डिक्टेशन पूरा नहीं हो सका।",
      dictationListening: "सुन रहा है। कृपया अपना प्रश्न स्पष्ट बोलें।",
      generalGuidanceOnly: "केवल सामान्य मार्गदर्शन",
      messagesLengthError: "संदेश 1 से {max} अक्षरों के बीच होना चाहिए।",
      aiUnavailable: "AI अस्थायी रूप से उपलब्ध नहीं है। केवल सामान्य मार्गदर्शन दिखाया जा रहा है।",
      timeoutError: "सहायक को उत्तर देने में बहुत समय लगा। कृपया फिर प्रयास करें।",
      requestFailed: "हम चैट अनुरोध पूरा नहीं कर सके।",
      emptyResponse: "सहायक ने खाली उत्तर लौटाया।",
      sendMessage: "संदेश भेजें",
      enterToSend: "भेजने के लिए Enter दबाएँ, नई पंक्ति के लिए Shift + Enter।",
      requestReview: "क्या आप आगे बढ़ने के लिए तैयार हैं? केस समीक्षा का अनुरोध करें",
      fallbackAgents: {
        screening: {
          title: "इंटेक क्लर्क",
          suggestions: [
            "परामर्श से पहले मुझे क्या तैयार करना चाहिए?",
            "मुझे कैसे पता चले कि मेरा मामला आपात है?",
            "आप किन प्रकार के मामलों को संभालते हैं?"
          ],
          actionLabel: "केस समीक्षा का अनुरोध करें"
        },
        documents: {
          title: "दस्तावेज़ परामर्श",
          suggestions: [
            "अगर मेरे दस्तावेज़ अंग्रेज़ी में नहीं हैं तो क्या होगा?",
            "क्या मुझे मूल दस्तावेज़ चाहिए या प्रतियाँ?",
            "कौन-से पुराने USCIS नोटिस सबसे महत्वपूर्ण हैं?"
          ],
          actionLabel: "दस्तावेज़ तैयार करें"
        },
        deadlines: {
          title: "हियरिंग क्लर्क",
          suggestions: [
            "मेरी इमिग्रेशन कोर्ट की तारीख है",
            "मुझे USCIS से समयसीमा मिली है",
            "अगले सप्ताह मेरा इंटरव्यू नोटिस है"
          ],
          actionLabel: "आपात परामर्श"
        },
        strategy: {
          title: "लीड काउंसल",
          suggestions: [
            "मेरी स्थिति के लिए कौन-से विकल्प उपयुक्त हो सकते हैं?",
            "परामर्श कैसे काम करता है?",
            "फाइलिंग रणनीति को सबसे अधिक क्या प्रभावित करता है?"
          ],
          actionLabel: "रणनीति परामर्श बुक करें"
        }
      }
    },
    intake: {
      steps: ["संपर्क", "मामले का विवरण", "समीक्षा"],
      errors: {
        name: "वह पूरा नाम दर्ज करें जिसे आप चाहते हैं कि हम उपयोग करें।",
        email: "एक वैध ईमेल पता दर्ज करें।",
        phone: "ऐसा फोन नंबर दर्ज करें जिस पर हम आपसे संपर्क कर सकें।",
        language: "अपनी पसंदीदा भाषा चुनें।",
        caseType: "बताएँ कि आपको किस मामले में मदद चाहिए।",
        summary: "समीक्षा के लिए पर्याप्त विवरण के साथ एक छोटा सार जोड़ें।",
        consent: "सबमिट करने से पहले आपको यह पुष्टि करनी होगी।"
      },
      toasts: {
        completeRequired: "आगे बढ़ने से पहले आवश्यक फ़ील्ड पूरी करें।",
        confirmDisclosure: "सबमिट करने से पहले घोषणा की पुष्टि करें।",
        reviewFields: "हाइलाइट किए गए इंटेक फ़ील्ड की समीक्षा करें और फिर प्रयास करें।",
        submitError: "हम आपका अनुरोध जमा नहीं कर सके।",
        success: "परामर्श अनुरोध प्राप्त हो गया।",
        successSent: "हमने एक पुष्टि ईमेल भेजा है और आपकी पसंदीदा संपर्क जानकारी के अनुसार आपसे संपर्क करेंगे।",
        successDefault: "हम आपकी जानकारी की समीक्षा करेंगे और आपकी पसंदीदा संपर्क जानकारी के अनुसार आपसे संपर्क करेंगे।"
      },
      contactInfoTitle: "संपर्क जानकारी",
      contactInfoDesc: "वकील आप तक पहुँच सके, इसके लिए सबसे अच्छा माध्यम यहाँ से शुरू करें।",
      fullName: "पूरा नाम",
      emailAddress: "ईमेल पता",
      phone: "फोन",
      preferredLanguage: "पसंदीदा भाषा",
      select: "चुनें",
      caseDetailsTitle: "मामले का विवरण",
      caseDetailsDesc: "हमें इतनी जानकारी दें कि हम मामले और अगले कदम का मूल्यांकन कर सकें।",
      caseType: "मामले का प्रकार",
      selectServiceType: "सेवा का प्रकार चुनें",
      summary: "संक्षिप्त सार",
      summaryPlaceholder: "अपनी वर्तमान स्थिति, समयसीमाएँ और जिस सहायता की ज़रूरत है उसका वर्णन करें।",
      summaryHelp: "समयसीमाएँ, पूर्व फाइलिंग और किसी भी आपात सुनवाई की तारीख शामिल करें।",
      documentsAvailable: "उपलब्ध दस्तावेज़",
      passport: "पासपोर्ट",
      receipts: "USCIS रसीदें या नोटिस",
      reviewTitle: "समीक्षा और सबमिट",
      reviewDesc: "कार्यालय को भेजने से पहले इंटेक विवरण की पुष्टि करें।",
      reviewLabels: {
        name: "नाम",
        email: "ईमेल",
        phone: "फोन",
        language: "भाषा",
        caseType: "मामले का प्रकार",
        summary: "सार"
      },
      consentPrefix: "मैं समझता/समझती हूँ कि यह फॉर्म केवल इंटेक समीक्षा के लिए है, इससे वकील-ग्राहक संबंध नहीं बनता, और यह",
      privacyPolicy: "गोपनीयता नीति",
      back: "वापस",
      continue: "जारी रखें",
      submitting: "जमा किया जा रहा है...",
      pleaseWait: "कृपया {seconds} सेकंड प्रतीक्षा करें",
      submitRequest: "अनुरोध सबमिट करें",
      languages: ["अंग्रेज़ी", "स्पेनिश", "उर्दू", "पंजाबी", "फ़्रेंच"],
      caseTypes: ["आगंतुक वीज़ा", "स्टूडेंट वीज़ा", "स्थिति परिवर्तन", "विवाह-आधारित", "वर्क परमिट", "आश्रय", "रिमूवल डिफेंस"],
      caseTypeLabels: [
        "आगंतुक वीज़ा (B1/B2)",
        "स्टूडेंट वीज़ा (F-1)",
        "स्थिति परिवर्तन",
        "विवाह-आधारित ग्रीन कार्ड",
        "वर्क परमिट (EAD)",
        "आश्रय",
        "रिमूवल / कोर्ट मामला"
      ]
    },
    insights: {
      filters: { all: "सभी", "case-studies": "केस स्टडी", news: "समाचार", analysis: "विश्लेषण" },
      refreshTimeout: "लाइव सार्वजनिक-स्रोत फ़ीड को रीफ़्रेश करने में बहुत समय लगा। अंतिम सत्यापित स्नैपशॉट दिखाया जा रहा है।",
      refreshSnapshot: "अंतिम सत्यापित स्नैपशॉट दिखाया जा रहा है।",
      refreshDefault: "लाइव सार्वजनिक-स्रोत फ़ीड रीफ़्रेश नहीं हो सकी। अंतिम सत्यापित स्नैपशॉट दिखाया जा रहा है।",
      heroBadge: "इनसाइट्स",
      backToSite: "मुख्य साइट पर वापस जाएँ",
      headingStart: "केस स्टडी, समाचार,",
      headingHighlight: "और उपयोगी लेख",
      headingEnd: "एक ही जगह।",
      liveDesk: "लाइव सार्वजनिक-स्रोत डेस्क {date} पर अपडेट हुई",
      snapshotDesk: "सत्यापित सार्वजनिक-स्रोत स्नैपशॉट {date}",
      featured: "मुख्य",
      seeCaseStudies: "केस स्टडी देखें",
      topicTracks: "टॉपिक ट्रैक्स",
      topicTracksDesc: "वे एंट्री पॉइंट जो पहले से इस पेज पर मौजूद स्रोत-आधारित कहानियों से जुड़े हैं, न कि सामान्य AI विषय पेजों से।",
      sourceWatch: "स्रोत निगरानी",
      sourceStandards: "स्रोत मानक",
      publicDecisions: "सार्वजनिक निर्णय",
      caseStudies: "केस स्टडी",
      caseStudiesDesc: "ये कार्ड सार्वजनिक निर्णयों और वास्तविक इमिग्रेशन तथ्य पैटर्न का सार देते हैं, निजी क्लाइंट जीतों का नहीं। इनका उद्देश्य दिखाना है कि समय, साक्ष्य और प्रक्रिया की स्थिति परिणामों को कैसे प्रभावित करती है।",
      latestNews: "ताज़ा समाचार",
      latestNewsHeadingStart: "एजेंसी बदलाव और नीतिगत हलचल,",
      latestNewsHeadingHighlight: "केवल वही जो वास्तव में मायने रखता है।",
      latestNewsDesc: "संक्षिप्त लेख जो फाइलिंग, समय और प्रक्रियात्मक बदलावों पर केंद्रित हैं और जो क्लाइंट के अगले कदम को प्रभावित करते हैं।",
      analysisBlogs: "विश्लेषण और ब्लॉग",
      analysisHeadingStart: "लंबे लेख जब अपडेट को",
      analysisHeadingHighlight: "व्यावहारिक संदर्भ की आवश्यकता हो।",
      analysisDesc: "ऐसी टिप्पणी जो रणनीतिक मूल्य के आधार पर चुनी गई है, न कि केवल सामग्री की मात्रा के आधार पर।",
      editorialNote: "संपादकीय टिप्पणी",
      editorialHeadingStart: "स्पष्ट अपडेट उपयोगी हैं।",
      editorialHeadingHighlight: "कानूनी सलाह फिर भी व्यक्तिगत होती है।",
      requestLegalGuidance: "कानूनी मार्गदर्शन का अनुरोध करें"
    },
    article: {
      backToInsights: "इनसाइट्स पर वापस जाएँ",
      sourceLabel: "स्रोत",
      share: "साझा करें",
      relatedContent: "संबंधित सामग्री",
      needCounsel: "क्या आपको विशिष्ट कानूनी सलाह चाहिए?",
      counselDesc: "अपने विशेष इमिग्रेशन मामले पर हमारे प्रमुख वकील से चर्चा करने के लिए परामर्श बुक करें।",
      bookConsultation: "परामर्श बुक करें"
    }
  },
  ur: {
    chatbot: {
      openChat: "چیٹ کھولیں",
      title: "M&T امیگریشن AI",
      subtitle: "اسپیشلسٹ روٹنگ + ریویو",
      closeChat: "چیٹ بند کریں",
      generalInfoOnly: "صرف عمومی معلومات • وکیل-کلائنٹ تعلق قائم نہیں ہوتا",
      routeTo: "روٹ کریں",
      autoRoutingByIssue: "مسئلے کے مطابق خودکار روٹنگ",
      auto: "آٹو",
      routingAndReviewing: "روٹنگ اور ریویو",
      respondingSuffix: "جواب دے رہا ہے",
      askQuestion: "امیگریشن سے متعلق سوال پوچھیں",
      placeholder: "ویزا، گرین کارڈ یا ڈیڈ لائنز کے بارے میں پوچھیں...",
      startDictation: "ڈکٹیشن شروع کریں",
      stopDictation: "ڈکٹیشن بند کریں",
      dictationUnsupported: "یہ براؤزر ڈکٹیشن کو سپورٹ نہیں کرتا",
      dictationStopped: "ڈکٹیشن بند کر دی گئی۔",
      dictationUnavailable: "یہ براؤزر ڈکٹیشن کو سپورٹ نہیں کرتا۔",
      dictationCaptured: "ڈکٹیشن محفوظ ہو گئی۔ بھیجنے سے پہلے پیغام دیکھ لیں۔",
      dictationDenied: "مائیکروفون کی اجازت مسترد کر دی گئی۔",
      dictationFailed: "ڈکٹیشن مکمل نہیں ہو سکی۔",
      dictationListening: "سن رہا ہے۔ براہ کرم اپنا سوال واضح طور پر بولیں۔",
      generalGuidanceOnly: "صرف عمومی رہنمائی",
      messagesLengthError: "پیغامات 1 سے {max} حروف کے درمیان ہونے چاہئیں۔",
      aiUnavailable: "AI عارضی طور پر دستیاب نہیں ہے۔ صرف عمومی رہنمائی دکھائی جا رہی ہے۔",
      timeoutError: "اسسٹنٹ کو جواب دینے میں زیادہ وقت لگا۔ براہ کرم دوبارہ کوشش کریں۔",
      requestFailed: "ہم چیٹ درخواست مکمل نہیں کر سکے۔",
      emptyResponse: "اسسٹنٹ نے خالی جواب دیا۔",
      sendMessage: "پیغام بھیجیں",
      enterToSend: "بھیجنے کے لئے Enter دبائیں، نئی سطر کے لئے Shift + Enter۔",
      requestReview: "آگے بڑھنے کے لئے تیار ہیں؟ کیس ریویو کی درخواست کریں",
      fallbackAgents: {
        screening: {
          title: "انٹیک کلرک",
          suggestions: [
            "مشاورت سے پہلے مجھے کیا تیار کرنا چاہئے؟",
            "مجھے کیسے پتہ چلے کہ میرا معاملہ فوری ہے؟",
            "آپ کون سے کیسز سنبھالتے ہیں؟"
          ],
          actionLabel: "کیس ریویو کی درخواست کریں"
        },
        documents: {
          title: "دستاویزی مشاورت",
          suggestions: [
            "اگر میرے دستاویزات انگریزی میں نہ ہوں تو کیا ہوگا؟",
            "کیا مجھے اصل دستاویزات چاہئیں یا نقول؟",
            "کون سے پچھلے USCIS نوٹس سب سے اہم ہیں؟"
          ],
          actionLabel: "دستاویزات تیار کریں"
        },
        deadlines: {
          title: "ہیرنگ کلرک",
          suggestions: [
            "میری امیگریشن کورٹ کی تاریخ ہے",
            "مجھے USCIS سے ڈیڈ لائن ملی ہے",
            "اگلے ہفتے میرا انٹرویو نوٹس ہے"
          ],
          actionLabel: "فوری مشاورت"
        },
        strategy: {
          title: "لیڈ کاؤنسل",
          suggestions: [
            "میری صورتحال کے لئے کون سے آپشن مناسب ہو سکتے ہیں؟",
            "مشاورت کیسے کام کرتی ہے؟",
            "فائلنگ اسٹریٹیجی پر سب سے زیادہ کیا اثر انداز ہوتا ہے؟"
          ],
          actionLabel: "اسٹریٹیجی مشاورت بک کریں"
        }
      }
    },
    intake: {
      steps: ["رابطہ", "کیس کی تفصیل", "جائزہ"],
      errors: {
        name: "وہ مکمل نام درج کریں جسے آپ چاہتے ہیں کہ ہم استعمال کریں۔",
        email: "ایک درست ای میل ایڈریس درج کریں۔",
        phone: "ایسا فون نمبر درج کریں جس پر ہم آپ سے رابطہ کر سکیں۔",
        language: "اپنی پسندیدہ زبان منتخب کریں۔",
        caseType: "بتائیں کہ آپ کس معاملے میں مدد چاہتے ہیں۔",
        summary: "جائزے کے لئے کافی تفصیل کے ساتھ مختصر خلاصہ شامل کریں۔",
        consent: "جمع کرانے سے پہلے آپ کو اس اعلان کی تصدیق کرنا ہوگی۔"
      },
      toasts: {
        completeRequired: "آگے بڑھنے سے پہلے ضروری فیلڈز مکمل کریں۔",
        confirmDisclosure: "جمع کرانے سے پہلے اعلان کی تصدیق کریں۔",
        reviewFields: "نمایاں کردہ انٹیک فیلڈز کا جائزہ لیں اور دوبارہ کوشش کریں۔",
        submitError: "ہم آپ کی درخواست جمع نہیں کر سکے۔",
        success: "مشاورت کی درخواست موصول ہو گئی۔",
        successSent: "ہم نے تصدیقی ای میل بھیج دی ہے اور آپ کی پسندیدہ رابطہ معلومات کے مطابق رابطہ کریں گے۔",
        successDefault: "ہم آپ کی معلومات کا جائزہ لے کر آپ کی پسندیدہ رابطہ معلومات کے مطابق رابطہ کریں گے۔"
      },
      contactInfoTitle: "رابطے کی معلومات",
      contactInfoDesc: "وکیل آپ تک پہنچ سکے، اس کے لئے بہترین طریقہ یہاں سے شروع کریں۔",
      fullName: "پورا نام",
      emailAddress: "ای میل ایڈریس",
      phone: "فون",
      preferredLanguage: "ترجیحی زبان",
      select: "منتخب کریں",
      caseDetailsTitle: "کیس کی تفصیل",
      caseDetailsDesc: "اتنی معلومات دیں کہ ہم معاملے اور اگلے قدم کا جائزہ لے سکیں۔",
      caseType: "معاملے کی قسم",
      selectServiceType: "سروس کی قسم منتخب کریں",
      summary: "مختصر خلاصہ",
      summaryPlaceholder: "اپنی موجودہ حیثیت، ڈیڈ لائنز اور مطلوبہ مدد کی وضاحت کریں۔",
      summaryHelp: "ڈیڈ لائنز، سابقہ فائلنگز اور کسی بھی فوری سماعت کی تاریخ شامل کریں۔",
      documentsAvailable: "دستیاب دستاویزات",
      passport: "پاسپورٹ",
      receipts: "USCIS رسیدیں یا نوٹس",
      reviewTitle: "جائزہ اور جمع کرائیں",
      reviewDesc: "دفتر کو بھیجنے سے پہلے انٹیک تفصیلات کی تصدیق کریں۔",
      reviewLabels: {
        name: "نام",
        email: "ای میل",
        phone: "فون",
        language: "زبان",
        caseType: "معاملے کی قسم",
        summary: "خلاصہ"
      },
      consentPrefix: "میں سمجھتا/سمجھتی ہوں کہ یہ فارم صرف انٹیک جائزے کے لئے ہے، اس سے وکیل-کلائنٹ تعلق قائم نہیں ہوتا، اور یہ",
      privacyPolicy: "پرائیویسی پالیسی",
      back: "واپس",
      continue: "جاری رکھیں",
      submitting: "جمع کیا جا رہا ہے...",
      pleaseWait: "براہ کرم {seconds} سیکنڈ انتظار کریں",
      submitRequest: "درخواست جمع کرائیں",
      languages: ["انگریزی", "ہسپانوی", "اردو", "پنجابی", "فرانسیسی"],
      caseTypes: ["وزیٹر ویزا", "اسٹوڈنٹ ویزا", "اسٹیٹس کی تبدیلی", "شادی پر مبنی", "ورک پرمٹ", "پناہ", "ریموول ڈیفنس"],
      caseTypeLabels: [
        "وزیٹر ویزا (B1/B2)",
        "اسٹوڈنٹ ویزا (F-1)",
        "اسٹیٹس کی تبدیلی",
        "شادی پر مبنی گرین کارڈ",
        "ورک پرمٹ (EAD)",
        "پناہ",
        "ریموول / کورٹ معاملہ"
      ]
    },
    insights: {
      filters: { all: "سب", "case-studies": "کیس اسٹڈیز", news: "خبریں", analysis: "تجزیہ" },
      refreshTimeout: "لائیو پبلک سورس فیڈ کو ریفریش کرنے میں زیادہ وقت لگا۔ آخری تصدیق شدہ اسنیپ شاٹ دکھایا جا رہا ہے۔",
      refreshSnapshot: "آخری تصدیق شدہ اسنیپ شاٹ دکھایا جا رہا ہے۔",
      refreshDefault: "لائیو پبلک سورس فیڈ ریفریش نہیں ہو سکی۔ آخری تصدیق شدہ اسنیپ شاٹ دکھایا جا رہا ہے۔",
      heroBadge: "انسائٹس",
      backToSite: "مرکزی سائٹ پر واپس جائیں",
      headingStart: "کیس اسٹڈیز، خبریں،",
      headingHighlight: "اور کارآمد مضامین",
      headingEnd: "ایک ہی جگہ۔",
      liveDesk: "لائیو پبلک سورس ڈیسک {date} کو اپ ڈیٹ ہوئی",
      snapshotDesk: "تصدیق شدہ پبلک سورس اسنیپ شاٹ {date}",
      featured: "نمایاں",
      seeCaseStudies: "کیس اسٹڈیز دیکھیں",
      topicTracks: "موضوعاتی راستے",
      topicTracksDesc: "وہ انٹری پوائنٹس جو اسی صفحے پر موجود سورس-بیکڈ کہانیوں سے جڑے ہیں، نہ کہ عمومی AI موضوعاتی صفحات سے۔",
      sourceWatch: "سورس واچ",
      sourceStandards: "سورس معیارات",
      publicDecisions: "عوامی فیصلے",
      caseStudies: "کیس اسٹڈیز",
      caseStudiesDesc: "یہ کارڈز عوامی فیصلوں اور حقیقی امیگریشن حالات کا خلاصہ پیش کرتے ہیں، نجی کلائنٹ کامیابیوں کا نہیں۔ ان کا مقصد یہ دکھانا ہے کہ وقت، شواہد اور طریقہ کار کی حالت عملی نتائج کو کیسے متاثر کرتی ہے۔",
      latestNews: "تازہ خبریں",
      latestNewsHeadingStart: "ایجنسی تبدیلیاں اور پالیسی کی حرکت،",
      latestNewsHeadingHighlight: "صرف وہ جو واقعی اہم ہو۔",
      latestNewsDesc: "مختصر مضامین جو فائلنگ، وقت اور طریقہ کار کی تبدیلیوں پر مرکوز ہیں، جو اگلے عملی قدم کو متاثر کرتے ہیں۔",
      analysisBlogs: "تجزیہ اور بلاگز",
      analysisHeadingStart: "طویل مضامین جب اپ ڈیٹ کو",
      analysisHeadingHighlight: "عملی سیاق و سباق کی ضرورت ہو۔",
      analysisDesc: "ایسی تبصراتی تحریریں جو حکمتِ عملی کی قدر کی بنیاد پر منتخب کی گئی ہوں، صرف مواد کی مقدار کی بنیاد پر نہیں۔",
      editorialNote: "ادارتی نوٹ",
      editorialHeadingStart: "واضح اپ ڈیٹس مفید ہوتی ہیں۔",
      editorialHeadingHighlight: "قانونی مشورہ پھر بھی ذاتی ہوتا ہے۔",
      requestLegalGuidance: "قانونی رہنمائی کی درخواست کریں"
    },
    article: {
      backToInsights: "انسائٹس پر واپس جائیں",
      sourceLabel: "ماخذ",
      share: "شیئر کریں",
      relatedContent: "متعلقہ مواد",
      needCounsel: "کیا آپ کو مخصوص قانونی مشورہ چاہیے?",
      counselDesc: "اپنے مخصوص امیگریشن معاملے پر ہمارے مرکزی وکیل سے گفتگو کے لئے مشاورت بک کریں۔",
      bookConsultation: "مشاورت بک کریں"
    }
  },
  es: {
    chatbot: {
      openChat: "Abrir chat",
      title: "M&T AI de Inmigración",
      subtitle: "Enrutamiento y revisión por especialista",
      closeChat: "Cerrar chat",
      generalInfoOnly: "Solo información general • Sin relación abogado-cliente",
      routeTo: "Enrutar a",
      autoRoutingByIssue: "Enrutamiento automático según el tema",
      auto: "Automático",
      routingAndReviewing: "Enrutando y Revisando",
      respondingSuffix: "respondiendo",
      askQuestion: "Haga una pregunta sobre inmigración",
      placeholder: "Pregunte sobre visas, residencias o plazos...",
      startDictation: "Iniciar dictado",
      stopDictation: "Detener dictado",
      dictationUnsupported: "El dictado no es compatible con este navegador",
      dictationStopped: "Dictado detenido.",
      dictationUnavailable: "El dictado no está disponible en este navegador.",
      dictationCaptured: "Dictado capturado. Revise el mensaje antes de enviar.",
      dictationDenied: "Permiso de micrófono denegado.",
      dictationFailed: "No se pudo completar el dictado.",
      dictationListening: "Escuchando. Hable su pregunta con claridad.",
      generalGuidanceOnly: "Solo orientación general",
      messagesLengthError: "Los mensajes deben tener entre 1 y {max} caracteres.",
      aiUnavailable: "La IA no está disponible temporalmente. Mostrando solo orientación general.",
      timeoutError: "El asistente tardó demasiado en responder. Por favor, intente de nuevo.",
      requestFailed: "No pudimos completar la solicitud de chat.",
      emptyResponse: "El asistente devolvió una respuesta vacía.",
      sendMessage: "Enviar mensaje",
      enterToSend: "Presione Enter para enviar, Shift + Enter para salto de línea.",
      requestReview: "¿Listo para proceder? Solicite revisión de caso",
      fallbackAgents: {
        screening: {
          title: "Intake",
          suggestions: [
            "¿Qué debo preparar antes de una consulta?",
            "¿Cómo sé si mi problema es urgente?",
            "¿Qué tipos de casos manejan?"
          ],
          actionLabel: "Solicitar Revisión"
        },
        documents: {
          title: "Revisión Documental",
          suggestions: [
            "¿Qué pasa si mis documentos no están en inglés?",
            "¿Necesito originales o copias?",
            "¿Qué notificaciones anteriores de USCIS importan más?"
          ],
          actionLabel: "Preparar Documentos"
        },
        deadlines: {
          title: "Audiencias",
          suggestions: [
            "Tengo una fecha en la corte de inmigración",
            "Recibí una fecha límite de USCIS",
            "Tengo una notificación de entrevista la próxima semana"
          ],
          actionLabel: "Consulta Urgente"
        },
        strategy: {
          title: "Abogado Titular",
          suggestions: [
            "¿Qué opciones podrían ajustarse a mi situación?",
            "¿Cómo funcionan las consultas?",
            "¿Qué afecta más la estrategia de presentación?"
          ],
          actionLabel: "Agendar Consulta Estratégica"
        }
      }
    },
    intake: {
      steps: ["Contacto", "Detalles", "Revisión"],
      errors: {
        name: "Ingrese el nombre completo que desea que utilicemos.",
        email: "Ingrese un correo electrónico válido.",
        phone: "Ingrese un número de teléfono donde podamos contactarle.",
        language: "Elija el idioma de su preferencia.",
        caseType: "Elija el tema con el que desea ayuda.",
        summary: "Agregue un breve resumen con suficientes detalles para una revisión.",
        consent: "Debe confirmar la declaración de admisión antes de enviar."
      },
      toasts: {
        completeRequired: "Por favor, complete los campos obligatorios antes de continuar.",
        confirmDisclosure: "Por favor, confirme la declaración antes de enviar.",
        reviewFields: "Por favor, revise los campos resaltados e intente de nuevo.",
        submitError: "No pudimos enviar su solicitud.",
        success: "Solicitud de consulta recibida.",
        successSent: "Hemos enviado un correo electrónico de confirmación y nos pondremos en contacto con los detalles proporcionados.",
        successDefault: "Revisaremos su información y nos comunicaremos utilizando sus datos de contacto preferidos."
      },
      contactInfoTitle: "Información de Contacto",
      contactInfoDesc: "Comience indicando la mejor forma en que el abogado puede localizarle.",
      fullName: "Nombre Completo",
      emailAddress: "Correo Electrónico",
      phone: "Teléfono",
      preferredLanguage: "Idioma Preferido",
      select: "Seleccionar",
      caseDetailsTitle: "Detalles del Caso",
      caseDetailsDesc: "Bríndenos información suficiente para evaluar el asunto y el siguiente paso.",
      caseType: "Tipo de Caso",
      selectServiceType: "Seleccione el tipo de servicio",
      summary: "Breve Resumen",
      summaryPlaceholder: "Describa su estatus actual, los plazos y la ayuda que necesita.",
      summaryHelp: "Incluya los plazos, presentaciones anteriores y cualquier fecha de audiencia urgente.",
      documentsAvailable: "Documentos Disponibles",
      passport: "Pasaporte",
      receipts: "Recibos o notificaciones de USCIS",
      reviewTitle: "Revisar y Enviar",
      reviewDesc: "Confirme los detalles del caso antes de enviarlos a la oficina.",
      reviewLabels: {
        name: "Nombre",
        email: "Correo Electrónico",
        phone: "Teléfono",
        language: "Idioma",
        caseType: "Tipo de Caso",
        summary: "Resumen"
      },
      consentPrefix: "Entiendo que este formulario es solo para una evaluación inicial, no crea una relación abogado-cliente y está sujeto a la",
      privacyPolicy: "Política de Privacidad",
      back: "Atrás",
      continue: "Continuar",
      submitting: "Enviando...",
      pleaseWait: "Por favor, espere {seconds}s",
      submitRequest: "Enviar Solicitud",
      languages: ["Inglés", "Español", "Urdu", "Punjabí", "Francés"],
      caseTypes: [
        "Visa de Visitante",
        "Visa de Estudiante",
        "Cambio de Estatus",
        "Por Matrimonio",
        "Permiso de Trabajo",
        "Asilo",
        "Defensa de Deportación"
      ],
      caseTypeLabels: [
        "Visa de Visitante (B1/B2)",
        "Visa de Estudiante (F-1)",
        "Cambio de Estatus",
        "Residencia por Matrimonio",
        "Permiso de Trabajo (EAD)",
        "Asilo",
        "Defensa de Deportación / Corte"
      ]
    },
    insights: {
      filters: { all: "Todos", "case-studies": "Casos", news: "Noticias", analysis: "Análisis" },
      refreshTimeout: "Actualizar las noticias en tiempo real tardó demasiado. Mostrando la última versión verificada.",
      refreshSnapshot: "Mostrando la última versión verificada.",
      refreshDefault: "No se pudo actualizar el resumen en vivo. Mostrando la última versión verificada.",
      heroBadge: "Artículos y Análisis",
      backToSite: "Volver al sitio web",
      headingStart: "Estudios de casos y lectura",
      headingHighlight: "sobre temas prácticos",
      headingEnd: "en un solo lugar.",
      liveDesk: "Monitoreo en vivo alimentado por fuentes públicas, actualizado: {date}",
      snapshotDesk: "Último registro verificado de fuentes públicas el {date}",
      featured: "Destacado",
      seeCaseStudies: "Ver estudios de caso",
      topicTracks: "Explorar Temas",
      topicTracksDesc: "Puntos de partida basados en los temas de los artículos en esta página.",
      sourceWatch: "Revisar Fuente",
      sourceStandards: "Criterios",
      publicDecisions: "Decisiones Públicas",
      caseStudies: "Estudios de Casos",
      caseStudiesDesc: "Estos resúmenes se basan en decisiones públicas sobre inmigración en EE.UU. Su propósito no es simular el éxito confidencial de un cliente, sino brindarles claridad procesal a las familias y solicitantes.",
      latestNews: "Noticias Agencias",
      latestNewsHeadingStart: "Procedimientos de agencias,",
      latestNewsHeadingHighlight: "despojados al análisis necesario.",
      latestNewsDesc: "Lecturas sobre regulaciones y temas procesales que podrían cambiar el rumbo de los procesos de asilo, el alivio en los tribunales o los formularios presentados.",
      analysisBlogs: "Análisis Adicionales",
      analysisHeadingStart: "Aportes más profundos cuando",
      analysisHeadingHighlight: "los hechos exigen un contexto amplio.",
      analysisDesc: "Notas diseñadas no por su volumen sino en virtud del posible efecto estratégico para un caso real.",
      editorialNote: "Nota Editorial",
      editorialHeadingStart: "Estar bien informado ayuda.",
      editorialHeadingHighlight: "El asesoramiento legal siempre es privado.",
      requestLegalGuidance: "Solicitar asesoramiento"
    },
    article: {
      backToInsights: "Volver a Artículos",
      sourceLabel: "Fuente",
      share: "Compartir",
      relatedContent: "Contenido Relacionado",
      needCounsel: "¿Necesita ayuda específica de un abogado?",
      counselDesc: "Agende una consulta directa para recibir un análisis y una perspectiva de una estrategia para su expediente migratorio.",
      bookConsultation: "Agendar Consulta"
    }
  },
  ar: {
    chatbot: {
      openChat: "افتح الدردشة",
      title: "M&T الهجرة الذكاء الاصطناعي",
      subtitle: "التوجيه المتخصص + المراجعة",
      closeChat: "إغلاق الدردشة",
      generalInfoOnly: "معلومات عامة فقط • لا توجد علاقة بين المحامي وموكله",
      routeTo: "الطريق إلى",
      autoRoutingByIssue: "التوجيه التلقائي حسب المشكلة",
      auto: "آلي",
      routingAndReviewing: "التوجيه والمراجعة",
      respondingSuffix: "الاستجابة",
      askQuestion: "طرح سؤال الهجرة",
      placeholder: "اسأل عن التأشيرات أو البطاقات الخضراء أو المواعيد النهائية...",
      startDictation: "بدء الإملاء",
      stopDictation: "توقف عن الإملاء",
      dictationUnsupported: "الإملاء غير مدعوم في هذا المتصفح",
      dictationStopped: "توقف الإملاء.",
      dictationUnavailable: "الإملاء غير مدعوم في هذا المتصفح.",
      dictationCaptured: "تم التقاط الإملاء. قم بمراجعة الرسالة قبل إرسالها.",
      dictationDenied: "تم رفض إذن الميكروفون.",
      dictationFailed: "لا يمكن إكمال الإملاء.",
      dictationListening: "الاستماع. تحدث عن سؤالك بوضوح.",
      generalGuidanceOnly: "إرشادات عامة فقط",
      messagesLengthError: "يجب أن تتراوح الرسائل بين 1 و{max} حرف.",
      aiUnavailable: "الذكاء الاصطناعي غير متاح مؤقتًا. عرض الإرشادات العامة فقط.",
      timeoutError: "استغرق المساعد وقتًا طويلاً للرد. يرجى المحاولة مرة أخرى.",
      requestFailed: "لم نتمكن من إكمال طلب الدردشة.",
      emptyResponse: "عاد المساعد إجابة فارغة.",
      sendMessage: "أرسل رسالة",
      enterToSend: "أدخل للإرسال، Shift + Enter للسطر الجديد.",
      requestReview: "هل أنت مستعد للمضي قدمًا؟ طلب مراجعة الحالة",
      fallbackAgents: {
        screening: {
          title: "كاتب المدخول",
          suggestions: ["ما الذي يجب علي تحضيره قبل الاستشارة؟", "كيف أعرف إذا كانت مشكلتي ملحة؟", "ما هي أنواع الحالات التي تتعامل معها؟"],
          actionLabel: "طلب مراجعة الحالة"
        },
        documents: {
          title: "مستشار الوثيقة",
          suggestions: [
            "ماذا لو لم تكن المستندات الخاصة بي باللغة الإنجليزية؟",
            "هل أحتاج إلى النسخ الأصلية أو النسخ؟",
            "ما هي إشعارات إدارة خدمات المواطنة والهجرة الأمريكية السابقة الأكثر أهمية؟"
          ],
          actionLabel: "تحضير المستندات"
        },
        deadlines: {
          title: "كاتب السمع",
          suggestions: [
            "لدي موعد في محكمة الهجرة",
            "لقد تلقيت موعدًا نهائيًا من إدارة خدمات المواطنة والهجرة في الولايات المتحدة (USCIS).",
            "لدي إشعار للمقابلة الأسبوع المقبل"
          ],
          actionLabel: "استشارة عاجلة"
        },
        strategy: {
          title: "المستشار الرئيسي",
          suggestions: ["ما هي الخيارات التي قد تناسب وضعي؟", "كيف تتم المشاورات؟", "ما الذي يؤثر على استراتيجية حفظ الملفات أكثر؟"],
          actionLabel: "كتاب الاستشارة الإستراتيجية"
        }
      }
    },
    intake: {
      steps: ["اتصال", "تفاصيل القضية", "مراجعة"],
      errors: {
        name: "أدخل الاسم الكامل الذي تريد منا أن نستخدمه.",
        email: "أدخل عنوان بريد إلكتروني صالحًا.",
        phone: "أدخل رقم هاتف يمكننا الوصول إليه.",
        language: "اختر اللغة التي تفضلها.",
        caseType: "اختر المسألة التي تريد المساعدة فيها.",
        summary: "أضف ملخصًا قصيرًا يحتوي على تفاصيل كافية للمراجعة.",
        consent: "يجب عليك تأكيد الكشف عن المدخول قبل الإرسال."
      },
      toasts: {
        completeRequired: "يرجى إكمال الحقول المطلوبة قبل المتابعة.",
        confirmDisclosure: "يرجى تأكيد الإفصاح قبل الإرسال.",
        reviewFields: "يرجى مراجعة حقول الإدخال المميزة والمحاولة مرة أخرى.",
        submitError: "لم نتمكن من تقديم طلبك.",
        success: "تم استلام طلب الاستشارة.",
        successSent: "لقد أرسلنا رسالة تأكيد بالبريد الإلكتروني وسنقوم بالمتابعة باستخدام تفاصيل الاتصال المفضلة لديك.",
        successDefault: "سنقوم بمراجعة معلوماتك والمتابعة باستخدام تفاصيل الاتصال المفضلة لديك."
      },
      contactInfoTitle: "معلومات الاتصال",
      contactInfoDesc: "ابدأ بأفضل طريقة للوصول إليك.",
      fullName: "الاسم الكامل",
      emailAddress: "عنوان البريد الإلكتروني",
      phone: "هاتف",
      preferredLanguage: "اللغة المفضلة",
      select: "يختار",
      caseDetailsTitle: "تفاصيل القضية",
      caseDetailsDesc: "أخبرنا بما يكفي لتقييم الأمر والخطوة التالية.",
      caseType: "نوع الحالة",
      selectServiceType: "اختر نوع الخدمة",
      summary: "ملخص موجز",
      summaryPlaceholder: "قم بوصف حالتك الحالية والمواعيد النهائية والمساعدة التي تحتاجها.",
      summaryHelp: "قم بتضمين المواعيد النهائية والإيداعات السابقة وأي مواعيد جلسة استماع عاجلة.",
      documentsAvailable: "الوثائق المتاحة",
      passport: "جواز سفر",
      receipts: "إيصالات أو إشعارات إدارة خدمات المواطنة والهجرة الأمريكية",
      reviewTitle: "المراجعة والإرسال",
      reviewDesc: "تأكد من تفاصيل المدخول قبل إرسالها إلى المكتب.",
      reviewLabels: {
        name: "اسم",
        email: "بريد إلكتروني",
        phone: "هاتف",
        language: "لغة",
        caseType: "نوع الحالة",
        summary: "ملخص"
      },
      consentPrefix: "أدرك أن هذا النموذج مخصص لمراجعة القبول فقط، ولا ينشئ علاقة بين المحامي وموكله، ويخضع لـ",
      privacyPolicy: "سياسة الخصوصية",
      back: "خلف",
      continue: "يكمل",
      submitting: "تقديم...",
      pleaseWait: "يرجى الانتظار لمدة {ثانية}.",
      submitRequest: "إرسال الطلب",
      languages: ["إنجليزي", "الأسبانية", "الأردية", "البنجابية", "فرنسي"],
      caseTypes: ["تأشيرة زائر", "تأشيرة الطالب", "تغيير الحالة", "على أساس الزواج", "تصريح العمل", "اللجوء", "الدفاع عن الإزالة"],
      caseTypeLabels: [
        "تأشيرة زائر (B1/B2)",
        "تأشيرة الطالب (F-1)",
        "تغيير الحالة",
        "البطاقة الخضراء القائمة على الزواج",
        "تصريح العمل (EAD)",
        "اللجوء",
        "إزالة / مسألة المحكمة"
      ]
    },
    insights: {
      filters: {
        all: "الجميع",
        "case-studies": "دراسات الحالة",
        news: "أخبار",
        analysis: "تحليل"
      },
      refreshTimeout: "استغرق تحديث البث المباشر وقتًا طويلاً. عرض آخر لقطة تم التحقق منها.",
      refreshSnapshot: "عرض آخر لقطة تم التحقق منها.",
      refreshDefault: "تعذر تحديث البث المباشر. عرض آخر لقطة تم التحقق منها.",
      heroBadge: "رؤى",
      backToSite: "العودة إلى الموقع الرئيسي",
      headingStart: "دراسات حالة، أخبار،",
      headingHighlight: "والقراءات العملية",
      headingEnd: "في مكان واحد.",
      liveDesk: "تم تحديث مكتب المصدر العام المباشر في {التاريخ}",
      snapshotDesk: "تم التحقق من لقطة المصدر العام {التاريخ}",
      featured: "مميز",
      seeCaseStudies: "انظر دراسات الحالة",
      topicTracks: "مسارات الموضوع",
      topicTracksDesc: "نقاط الدخول مرتبطة بالقصص المدعومة بالمصدر في هذه الصفحة.",
      sourceWatch: "مراقبة المصدر",
      sourceStandards: "معايير المصدر",
      publicDecisions: "القرارات العامة",
      caseStudies: "دراسات الحالة",
      caseStudiesDesc: "تلخص هذه البطاقات القرارات العامة وأنماط حقائق الهجرة في العالم الحقيقي.",
      latestNews: "آخر الأخبار",
      latestNewsHeadingStart: "تغييرات الوكالة وحركة السياسة،",
      latestNewsHeadingHighlight: "جردت إلى ما يهم.",
      latestNewsDesc: "ركزت القراءات القصيرة على التسجيلات والتوقيت والتحولات الإجرائية.",
      analysisBlogs: "التحليل والمدونات",
      analysisHeadingStart: "يقرأ لفترة أطول عند التحديث",
      analysisHeadingHighlight: "يحتاج إلى سياق عملي.",
      analysisDesc: "تم اختيار التعليق لقيمة الإستراتيجية، وليس لحجم المحتوى.",
      editorialNote: "ملاحظة تحريرية",
      editorialHeadingStart: "التحديثات النظيفة مفيدة.",
      editorialHeadingHighlight: "المشورة القانونية لا تزال شخصية.",
      requestLegalGuidance: "طلب التوجيه القانوني"
    },
    article: {
      backToInsights: "العودة إلى الرؤى",
      sourceLabel: "مصدر",
      share: "يشارك",
      relatedContent: "المحتوى ذو الصلة",
      needCounsel: "هل تحتاج إلى مشورة محددة؟",
      counselDesc: "قم بحجز استشارة لمناقشة مسألة الهجرة الخاصة بك مع محامينا الرئيسي.",
      bookConsultation: "استشارة حول كتاب"
    }
  },
  bn: {
    chatbot: {
      openChat: "খোলা চ্যাট",
      title: "এম অ্যান্ড টি ইমিগ্রেশন এআই",
      subtitle: "বিশেষজ্ঞ রাউটিং + পর্যালোচনা",
      closeChat: "চ্যাট বন্ধ করুন",
      generalInfoOnly: "শুধুমাত্র সাধারণ তথ্য • কোন অ্যাটর্নি-ক্লায়েন্ট সম্পর্ক নেই",
      routeTo: "রুট টু",
      autoRoutingByIssue: "সমস্যা অনুসারে স্বয়ংক্রিয়-রাউটিং",
      auto: "অটো",
      routingAndReviewing: "রাউটিং এবং পর্যালোচনা",
      respondingSuffix: "প্রতিক্রিয়া",
      askQuestion: "একটি অভিবাসন প্রশ্ন জিজ্ঞাসা করুন",
      placeholder: "ভিসা, গ্রিন কার্ড বা সময়সীমা সম্পর্কে জিজ্ঞাসা করুন...",
      startDictation: "ডিক্টেশন শুরু করুন",
      stopDictation: "ডিকটেশন বন্ধ করুন",
      dictationUnsupported: "এই ব্রাউজারে ডিকটেশন সমর্থিত নয়",
      dictationStopped: "শ্রুতিমধুর বন্ধ।",
      dictationUnavailable: "এই ব্রাউজারে ডিকটেশন সমর্থিত নয়।",
      dictationCaptured: "ডিকটেশন বন্দী। পাঠানোর আগে বার্তাটি পর্যালোচনা করুন।",
      dictationDenied: "মাইক্রোফোন অনুমতি অস্বীকার করা হয়েছে.",
      dictationFailed: "ডিক্টেশন সম্পূর্ণ করা যায়নি।",
      dictationListening: "শুনছেন। আপনার প্রশ্ন স্পষ্টভাবে বলুন.",
      generalGuidanceOnly: "শুধুমাত্র সাধারণ নির্দেশিকা",
      messagesLengthError: "বার্তাগুলি অবশ্যই 1 এবং {max} অক্ষরের মধ্যে হতে হবে৷",
      aiUnavailable: "AI সাময়িকভাবে অনুপলব্ধ। শুধুমাত্র সাধারণ নির্দেশিকা দেখানো হচ্ছে।",
      timeoutError: "সহকারী সাড়া দিতে অনেক সময় নিয়েছে। আবার চেষ্টা করুন.",
      requestFailed: "আমরা চ্যাট অনুরোধ সম্পূর্ণ করতে পারিনি.",
      emptyResponse: "সহকারী খালি জবাব দিল।",
      sendMessage: "বার্তা পাঠান",
      enterToSend: "পাঠাতে এন্টার করুন, নতুন লাইনের জন্য Shift + Enter করুন।",
      requestReview: "এগিয়ে যেতে প্রস্তুত? একটি মামলা পর্যালোচনা অনুরোধ",
      fallbackAgents: {
        screening: {
          title: "ইনটেক ক্লার্ক",
          suggestions: [
            "পরামর্শের আগে আমার কী প্রস্তুতি নেওয়া উচিত?",
            "আমার সমস্যা জরুরী হলে আমি কিভাবে জানব?",
            "আপনি কি ধরনের কেস পরিচালনা করেন?"
          ],
          actionLabel: "কেস পর্যালোচনার অনুরোধ করুন"
        },
        documents: {
          title: "নথি পরামর্শ",
          suggestions: [
            "আমার নথি ইংরেজিতে না হলে কী হবে?",
            "আমার কি আসল বা কপি দরকার?",
            "কোন পূর্ববর্তী USCIS বিজ্ঞপ্তিগুলি সবচেয়ে গুরুত্বপূর্ণ?"
          ],
          actionLabel: "নথি প্রস্তুত করুন"
        },
        deadlines: {
          title: "শ্রবণ ক্লার্ক",
          suggestions: [
            "আমি একটি অভিবাসন আদালতের তারিখ আছে",
            "আমি USCIS থেকে একটি সময়সীমা পেয়েছি",
            "আমি পরের সপ্তাহে একটি ইন্টারভিউ বিজ্ঞপ্তি আছে"
          ],
          actionLabel: "জরুরী পরামর্শ"
        },
        strategy: {
          title: "প্রধান পরামর্শদাতা",
          suggestions: [
            "কোন বিকল্পগুলি আমার পরিস্থিতির সাথে মানানসই হতে পারে?",
            "পরামর্শ কিভাবে কাজ করে?",
            "কি ফাইলিং কৌশল সবচেয়ে প্রভাবিত করে?"
          ],
          actionLabel: "বই কৌশল পরামর্শ"
        }
      }
    },
    intake: {
      steps: ["যোগাযোগ", "মামলার বিবরণ", "পর্যালোচনা"],
      errors: {
        name: "আপনি আমাদের ব্যবহার করতে চান পুরো নাম লিখুন.",
        email: "একটি বৈধ ইমেল ঠিকানা লিখুন.",
        phone: "আমরা যোগাযোগ করতে পারি এমন একটি ফোন নম্বর লিখুন।",
        language: "আপনার পছন্দের ভাষা চয়ন করুন।",
        caseType: "আপনি যে বিষয়ে সাহায্য চান সেটি বেছে নিন।",
        summary: "একটি পর্যালোচনার জন্য যথেষ্ট বিশদ সহ একটি সংক্ষিপ্ত সারসংক্ষেপ যোগ করুন।",
        consent: "জমা দেওয়ার আগে আপনাকে অবশ্যই গ্রহণের প্রকাশ নিশ্চিত করতে হবে।"
      },
      toasts: {
        completeRequired: "চালিয়ে যাওয়ার আগে অনুগ্রহ করে প্রয়োজনীয় ক্ষেত্রগুলি পূরণ করুন৷",
        confirmDisclosure: "জমা দেওয়ার আগে প্রকাশ নিশ্চিত করুন.",
        reviewFields: "অনুগ্রহ করে হাইলাইট করা খাওয়ার ক্ষেত্রগুলি পর্যালোচনা করুন এবং আবার চেষ্টা করুন।",
        submitError: "আমরা আপনার অনুরোধ জমা দিতে পারিনি.",
        success: "পরামর্শ অনুরোধ গৃহীত.",
        successSent: "আমরা একটি নিশ্চিতকরণ ইমেল পাঠিয়েছি এবং আপনার পছন্দের যোগাযোগের বিবরণ ব্যবহার করে অনুসরণ করব।",
        successDefault: "আমরা আপনার তথ্য পর্যালোচনা করব এবং আপনার পছন্দের যোগাযোগের বিবরণ ব্যবহার করে অনুসরণ করব।"
      },
      contactInfoTitle: "যোগাযোগের তথ্য",
      contactInfoDesc: "অ্যাটর্নি আপনার কাছে পৌঁছানোর সর্বোত্তম উপায় দিয়ে শুরু করুন।",
      fullName: "পুরো নাম",
      emailAddress: "ইমেইল ঠিকানা",
      phone: "ফোন",
      preferredLanguage: "পছন্দের ভাষা",
      select: "নির্বাচন করুন",
      caseDetailsTitle: "মামলার বিবরণ",
      caseDetailsDesc: "বিষয়টি এবং পরবর্তী পদক্ষেপ মূল্যায়ন করার জন্য যথেষ্ট বলুন।",
      caseType: "কেস টাইপ",
      selectServiceType: "পরিষেবার ধরন নির্বাচন করুন",
      summary: "সংক্ষিপ্ত সারাংশ",
      summaryPlaceholder: "আপনার বর্তমান অবস্থা, সময়সীমা এবং আপনার প্রয়োজনীয় সহায়তা বর্ণনা করুন।",
      summaryHelp: "সময়সীমা, পূর্বের ফাইলিং এবং যেকোনো জরুরি শুনানির তারিখ অন্তর্ভুক্ত করুন।",
      documentsAvailable: "নথি উপলব্ধ",
      passport: "পাসপোর্ট",
      receipts: "USCIS রসিদ বা নোটিশ",
      reviewTitle: "পর্যালোচনা এবং জমা দিন",
      reviewDesc: "তাদের অফিসে পাঠানোর আগে গ্রহণের বিবরণ নিশ্চিত করুন।",
      reviewLabels: {
        name: "নাম",
        email: "ইমেইল",
        phone: "ফোন",
        language: "ভাষা",
        caseType: "কেস টাইপ",
        summary: "সারাংশ"
      },
      consentPrefix: "আমি বুঝি এই ফর্মটি শুধুমাত্র গ্রহণের পর্যালোচনার জন্য, এটি কোনো অ্যাটর্নি-ক্লায়েন্ট সম্পর্ক তৈরি করে না এবং",
      privacyPolicy: "গোপনীয়তা নীতি",
      back: "ফিরে",
      continue: "চালিয়ে যান",
      submitting: "জমা দেওয়া হচ্ছে...",
      pleaseWait: "অনুগ্রহ করে {সেকেন্ড} সেকেন্ড অপেক্ষা করুন",
      submitRequest: "অনুরোধ জমা দিন",
      languages: ["ইংরেজি", "স্প্যানিশ", "উর্দু", "পাঞ্জাবি", "ফরাসি"],
      caseTypes: ["ভিজিটর ভিসা", "স্টুডেন্ট ভিসা", "অবস্থার পরিবর্তন", "বিবাহ-ভিত্তিক", "ওয়ার্ক পারমিট", "আশ্রয়", "অপসারণ প্রতিরক্ষা"],
      caseTypeLabels: [
        "ভিজিটর ভিসা (B1/B2)",
        "স্টুডেন্ট ভিসা (F-1)",
        "অবস্থার পরিবর্তন",
        "বিবাহ-ভিত্তিক গ্রীন কার্ড",
        "ওয়ার্ক পারমিট (EAD)",
        "আশ্রয়",
        "অপসারণ / কোর্ট ম্যাটার"
      ]
    },
    insights: {
      filters: {
        all: "সব",
        "case-studies": "কেস স্টাডিজ",
        news: "খবর",
        analysis: "বিশ্লেষণ"
      },
      refreshTimeout: "লাইভ ফিড রিফ্রেশ করতে অনেক সময় লেগেছে। শেষ যাচাইকৃত স্ন্যাপশট দেখানো হচ্ছে।",
      refreshSnapshot: "শেষ যাচাইকৃত স্ন্যাপশট দেখানো হচ্ছে।",
      refreshDefault: "লাইভ ফিড রিফ্রেশ করা যায়নি. শেষ যাচাইকৃত স্ন্যাপশট দেখানো হচ্ছে।",
      heroBadge: "অন্তর্দৃষ্টি",
      backToSite: "মূল সাইটে ফিরে যান",
      headingStart: "কেস স্টাডি, খবর,",
      headingHighlight: "এবং ব্যবহারিক পড়া",
      headingEnd: "এক জায়গায়",
      liveDesk: "লাইভ পাবলিক সোর্স ডেস্ক আপডেট করা হয়েছে {date}",
      snapshotDesk: "যাচাইকৃত পাবলিক সোর্স স্ন্যাপশট {date}",
      featured: "বৈশিষ্ট্যযুক্ত",
      seeCaseStudies: "কেস স্টাডি দেখুন",
      topicTracks: "বিষয় ট্র্যাক",
      topicTracksDesc: "এই পৃষ্ঠায় উত্স-সমর্থিত গল্পের সাথে আবদ্ধ এন্ট্রি পয়েন্ট।",
      sourceWatch: "সোর্স ওয়াচ",
      sourceStandards: "সোর্স স্ট্যান্ডার্ড",
      publicDecisions: "পাবলিক সিদ্ধান্ত",
      caseStudies: "কেস স্টাডিজ",
      caseStudiesDesc: "এই কার্ডগুলি জনসাধারণের সিদ্ধান্ত এবং বাস্তব-বিশ্বের অভিবাসন তথ্যের নিদর্শনগুলিকে সংক্ষিপ্ত করে৷",
      latestNews: "সর্বশেষ খবর",
      latestNewsHeadingStart: "এজেন্সি পরিবর্তন এবং নীতি আন্দোলন,",
      latestNewsHeadingHighlight: "যা গুরুত্বপূর্ণ তা ছিনিয়ে নেওয়া।",
      latestNewsDesc: "ফাইলিং, সময়, এবং পদ্ধতিগত পরিবর্তনের উপর ফোকাস করা সংক্ষিপ্ত পাঠ।",
      analysisBlogs: "বিশ্লেষণ এবং ব্লগ",
      analysisHeadingStart: "আপডেট হলে আর পড়া হয়",
      analysisHeadingHighlight: "ব্যবহারিক প্রসঙ্গ প্রয়োজন।",
      analysisDesc: "কমেন্টারি কৌশল মান জন্য নির্বাচিত, বিষয়বস্তু ভলিউম নয়.",
      editorialNote: "সম্পাদকীয় নোট",
      editorialHeadingStart: "পরিষ্কার আপডেট দরকারী.",
      editorialHeadingHighlight: "আইনি পরামর্শ এখনও ব্যক্তিগত.",
      requestLegalGuidance: "আইনি নির্দেশিকা অনুরোধ করুন"
    },
    article: {
      backToInsights: "অন্তর্দৃষ্টিতে ফিরে যান",
      sourceLabel: "উৎস",
      share: "শেয়ার করুন",
      relatedContent: "সম্পর্কিত বিষয়বস্তু",
      needCounsel: "নির্দিষ্ট পরামর্শ প্রয়োজন?",
      counselDesc: "আমাদের প্রধান অ্যাটর্নির সাথে আপনার নির্দিষ্ট অভিবাসন বিষয় নিয়ে আলোচনা করার জন্য একটি পরামর্শ বুক করুন।",
      bookConsultation: "বই পরামর্শ"
    }
  },
  fa: {
    chatbot: {
      openChat: "گپ را باز کنید",
      title: "هوش مصنوعی مهاجرت M&T",
      subtitle: "مسیریابی تخصصی + بررسی",
      closeChat: "بستن چت",
      generalInfoOnly: "فقط اطلاعات عمومی • بدون رابطه وکیل و موکل",
      routeTo: "مسیر به",
      autoRoutingByIssue: "مسیریابی خودکار بر اساس مشکل",
      auto: "خودکار",
      routingAndReviewing: "مسیریابی و بازبینی",
      respondingSuffix: "پاسخ دادن",
      askQuestion: "یک سوال مهاجرتی بپرسید",
      placeholder: "در مورد ویزا، گرین کارت یا مهلت بپرسید...",
      startDictation: "دیکته را شروع کنید",
      stopDictation: "دیکته را متوقف کنید",
      dictationUnsupported: "دیکته در این مرورگر پشتیبانی نمی شود",
      dictationStopped: "دیکته متوقف شد",
      dictationUnavailable: "دیکته در این مرورگر پشتیبانی نمی شود.",
      dictationCaptured: "دیکته گرفته شد. قبل از ارسال پیام را مرور کنید.",
      dictationDenied: "اجازه میکروفون رد شد.",
      dictationFailed: "دیکته تکمیل نشد.",
      dictationListening: "گوش دادن. سوال خود را واضح بیان کنید",
      generalGuidanceOnly: "فقط راهنمایی عمومی",
      messagesLengthError: "پیام ها باید بین 1 تا {حداکثر} کاراکتر باشند.",
      aiUnavailable: "هوش مصنوعی به طور موقت در دسترس نیست. نمایش فقط راهنمایی کلی.",
      timeoutError: "پاسخ دستیار خیلی طول کشید. لطفا دوباره امتحان کنید.",
      requestFailed: "ما نتوانستیم درخواست چت را تکمیل کنیم.",
      emptyResponse: "دستیار پاسخی خالی داد.",
      sendMessage: "ارسال پیام",
      enterToSend: "برای ارسال، Shift + Enter را برای خط جدید وارد کنید.",
      requestReview: "آماده ادامه دادن هستید؟ درخواست بررسی پرونده",
      fallbackAgents: {
        screening: {
          title: "منشی ورودی",
          suggestions: ["قبل از مشاوره چه چیزی را باید آماده کنم؟", "چگونه بفهمم مشکل من فوری است؟", "چه نوع پرونده هایی را اداره می کنید؟"],
          actionLabel: "درخواست بررسی پرونده"
        },
        documents: {
          title: "مشاور سند",
          suggestions: ["اگر مدارک من انگلیسی نباشد چه؟", "آیا به اصل یا کپی نیاز دارم؟", "کدام اخطارهای قبلی USCIS بیشتر اهمیت دارد؟"],
          actionLabel: "اسناد را آماده کنید"
        },
        deadlines: {
          title: "منشی شنوایی",
          suggestions: ["من تاریخ دادگاه مهاجرت دارم", "من یک مهلت از USCIS دریافت کردم", "هفته آینده اطلاعیه مصاحبه دارم"],
          actionLabel: "مشاوره فوری"
        },
        strategy: {
          title: "مشاور رهبری",
          suggestions: [
            "چه گزینه هایی ممکن است با شرایط من مناسب باشد؟",
            "مشاوره چگونه کار می کند؟",
            "چه چیزی بیشتر بر استراتژی پرونده سازی تأثیر می گذارد؟"
          ],
          actionLabel: "مشاوره استراتژی کتاب"
        }
      }
    },
    intake: {
      steps: ["تماس بگیرید", "جزئیات مورد", "بررسی کنید"],
      errors: {
        name: "نام کاملی را که می خواهید استفاده کنیم وارد کنید.",
        email: "یک آدرس ایمیل معتبر وارد کنید.",
        phone: "شماره تلفنی را وارد کنید که بتوانیم با آن تماس بگیریم.",
        language: "زبان مورد نظر خود را انتخاب کنید.",
        caseType: "موضوعی را که در آن کمک می خواهید انتخاب کنید.",
        summary: "یک خلاصه کوتاه با جزئیات کافی برای بررسی اضافه کنید.",
        consent: "قبل از ارسال باید افشای مصرف را تأیید کنید."
      },
      toasts: {
        completeRequired: "لطفاً قبل از ادامه، فیلدهای لازم را تکمیل کنید.",
        confirmDisclosure: "لطفاً قبل از ارسال، افشا را تأیید کنید.",
        reviewFields: "لطفاً فیلدهای دریافت مشخص شده را مرور کنید و دوباره امتحان کنید.",
        submitError: "ما نتوانستیم درخواست شما را ارسال کنیم.",
        success: "درخواست مشاوره دریافت شد",
        successSent: "ما یک ایمیل تأیید ارسال کردیم و با استفاده از اطلاعات تماس دلخواه شما را پیگیری خواهیم کرد.",
        successDefault: "ما اطلاعات شما را بررسی می کنیم و با استفاده از اطلاعات تماس دلخواه شما را پیگیری می کنیم."
      },
      contactInfoTitle: "اطلاعات تماس",
      contactInfoDesc: "با بهترین راه برای رسیدن وکیل به شما شروع کنید.",
      fullName: "نام کامل",
      emailAddress: "آدرس ایمیل",
      phone: "تلفن",
      preferredLanguage: "زبان برگزیده",
      select: "انتخاب کنید",
      caseDetailsTitle: "جزئیات مورد",
      caseDetailsDesc: "به اندازه کافی برای ارزیابی موضوع و مرحله بعدی به ما بگویید.",
      caseType: "نوع مورد",
      selectServiceType: "نوع خدمات را انتخاب کنید",
      summary: "خلاصه مختصر",
      summaryPlaceholder: "وضعیت فعلی، ضرب الاجل ها و کمکی که نیاز دارید را شرح دهید.",
      summaryHelp: "ضرب‌الاجل‌ها، پرونده‌های قبلی و هر گونه تاریخ رسیدگی فوری را شامل شود.",
      documentsAvailable: "اسناد موجود",
      passport: "پاسپورت",
      receipts: "رسیدها یا اعلامیه های USCIS",
      reviewTitle: "بررسی و ارسال",
      reviewDesc: "قبل از ارسال آنها به دفتر، جزئیات دریافت را تأیید کنید.",
      reviewLabels: {
        name: "نام",
        email: "ایمیل",
        phone: "تلفن",
        language: "زبان",
        caseType: "نوع مورد",
        summary: "خلاصه"
      },
      consentPrefix: "من می دانم که این فرم فقط برای بررسی پذیرش است، رابطه وکیل و موکل ایجاد نمی کند و مشمول این است",
      privacyPolicy: "سیاست حفظ حریم خصوصی",
      back: "برگشت",
      continue: "ادامه دهید",
      submitting: "در حال ارسال...",
      pleaseWait: "لطفاً {ثانیه} ثانیه صبر کنید",
      submitRequest: "ارسال درخواست",
      languages: ["انگلیسی", "اسپانیایی", "اردو", "پنجابی", "فرانسوی"],
      caseTypes: ["ویزای بازدید کننده", "ویزای دانشجویی", "تغییر وضعیت", "مبتنی بر ازدواج", "مجوز کار", "پناهندگی", "دفاع حذفی"],
      caseTypeLabels: [
        "ویزای بازدید کننده (B1/B2)",
        "ویزای دانشجویی (F-1)",
        "تغییر وضعیت",
        "گرین کارت ازدواج مبتنی بر",
        "مجوز کار (EAD)",
        "پناهندگی",
        "حذف / موضوع دادگاه"
      ]
    },
    insights: {
      filters: {
        all: "همه",
        "case-studies": "مطالعات موردی",
        news: "اخبار",
        analysis: "تجزیه و تحلیل"
      },
      refreshTimeout: "تازه کردن فید زنده خیلی طول کشید. نمایش آخرین عکس فوری تأیید شده.",
      refreshSnapshot: "نمایش آخرین عکس فوری تأیید شده.",
      refreshDefault: "فید زنده بازخوانی نشد. نمایش آخرین عکس فوری تأیید شده.",
      heroBadge: "بینش ها",
      backToSite: "بازگشت به سایت اصلی",
      headingStart: "مطالعات موردی، اخبار،",
      headingHighlight: "و عملی می خواند",
      headingEnd: "در یک مکان",
      liveDesk: "میز با منبع عمومی زنده به روز شد {date}",
      snapshotDesk: "عکس فوری منبع عمومی تأیید شده {date}",
      featured: "برجسته",
      seeCaseStudies: "مطالعات موردی را ببینید",
      topicTracks: "آهنگ های موضوع",
      topicTracksDesc: "نقاط ورودی مرتبط با داستان های پشتوانه منبع در این صفحه است.",
      sourceWatch: "منبع دیده بان",
      sourceStandards: "استانداردهای منبع",
      publicDecisions: "تصمیمات عمومی",
      caseStudies: "مطالعات موردی",
      caseStudiesDesc: "این کارت ها تصمیمات عمومی و الگوهای واقعی مهاجرت در دنیای واقعی را خلاصه می کنند.",
      latestNews: "آخرین اخبار",
      latestNewsHeadingStart: "تغییرات آژانس و حرکت سیاست،",
      latestNewsHeadingHighlight: "به آنچه اهمیت دارد برهنه شده است.",
      latestNewsDesc: "خواندن های کوتاه متمرکز بر پرونده ها، زمان بندی و تغییرات رویه ای.",
      analysisBlogs: "تجزیه و تحلیل و وبلاگ ها",
      analysisHeadingStart: "زمان به روز رسانی طولانی تر خوانده می شود",
      analysisHeadingHighlight: "نیاز به زمینه عملی دارد",
      analysisDesc: "تفسیر برای ارزش استراتژی انتخاب شده است، نه حجم محتوا.",
      editorialNote: "یادداشت تحریریه",
      editorialHeadingStart: "به روز رسانی های پاک مفید هستند.",
      editorialHeadingHighlight: "مشاوره حقوقی هنوز شخصی است.",
      requestLegalGuidance: "درخواست راهنمایی حقوقی"
    },
    article: {
      backToInsights: "بازگشت به Insights",
      sourceLabel: "منبع",
      share: "به اشتراک بگذارید",
      relatedContent: "مطالب مرتبط",
      needCounsel: "به مشاوره خاصی نیاز دارید؟",
      counselDesc: "برای بحث در مورد موضوع مهاجرت خود با وکیل اصلی ما یک مشاوره رزرو کنید.",
      bookConsultation: "مشاوره کتاب"
    }
  },
  ko: {
    chatbot: {
      openChat: "오픈채팅",
      title: "M&T 이민 AI",
      subtitle: "전문가 라우팅 + 검토",
      closeChat: "채팅 닫기",
      generalInfoOnly: "일반 정보만 제공됨 • 변호사-의뢰인 관계 없음",
      routeTo: "라우팅 대상",
      autoRoutingByIssue: "문제별 자동 라우팅",
      auto: "자동",
      routingAndReviewing: "라우팅 및 검토",
      respondingSuffix: "응답",
      askQuestion: "이민 질문을 해보세요",
      placeholder: "비자, 영주권 또는 마감일에 대해 문의하세요...",
      startDictation: "받아쓰기 시작",
      stopDictation: "받아쓰기 중지",
      dictationUnsupported: "이 브라우저에서는 받아쓰기가 지원되지 않습니다.",
      dictationStopped: "받아쓰기가 중지되었습니다.",
      dictationUnavailable: "이 브라우저에서는 받아쓰기가 지원되지 않습니다.",
      dictationCaptured: "받아쓰기가 캡처되었습니다. 보내기 전에 메시지를 검토하세요.",
      dictationDenied: "마이크 권한이 거부되었습니다.",
      dictationFailed: "음성기록을 완료할 수 없습니다.",
      dictationListening: "청취. 질문을 명확하게 말하세요.",
      generalGuidanceOnly: "일반 지침만",
      messagesLengthError: "메시지는 1~{max}자 사이여야 합니다.",
      aiUnavailable: "AI를 일시적으로 사용할 수 없습니다. 일반 지침만 표시됩니다.",
      timeoutError: "어시스턴트가 응답하는 데 시간이 너무 오래 걸렸습니다. 다시 시도해 주세요.",
      requestFailed: "채팅 요청을 완료할 수 없습니다.",
      emptyResponse: "어시스턴트가 빈 응답을 반환했습니다.",
      sendMessage: "메시지 보내기",
      enterToSend: "보내려면 Enter를 누르고 새 줄을 만들려면 Shift + Enter를 누르세요.",
      requestReview: "계속할 준비가 되셨나요? 사례 검토 요청",
      fallbackAgents: {
        screening: {
          title: "접수 담당자",
          suggestions: ["상담 전 무엇을 준비해야 하나요?", "내 문제가 긴급한지 어떻게 알 수 있나요?", "어떤 유형의 케이스를 처리하시나요?"],
          actionLabel: "사례 검토 요청"
        },
        documents: {
          title: "문서 상담",
          suggestions: ["내 문서가 영어로 작성되지 않은 경우 어떻게 해야 합니까?", "원본이나 사본이 필요합니까?", "어떤 사전 USCIS 통지가 가장 중요합니까?"],
          actionLabel: "서류 준비"
        },
        deadlines: {
          title: "청문관",
          suggestions: ["이민 법원 날짜가 있어요", "USCIS로부터 마감일을 받았습니다.", "다음주에 면접 공고가 있어요"],
          actionLabel: "긴급상담"
        },
        strategy: {
          title: "수석 변호사",
          suggestions: ["내 상황에 맞는 옵션은 무엇입니까?", "상담은 어떻게 진행되나요?", "파일링 전략에 가장 큰 영향을 미치는 것은 무엇입니까?"],
          actionLabel: "도서 전략 상담"
        }
      }
    },
    intake: {
      steps: ["연락하다", "사례 세부정보", "검토"],
      errors: {
        name: "사용하려는 이름을 입력하세요.",
        email: "유효한 이메일 주소를 입력하세요.",
        phone: "연락 가능한 전화번호를 입력하세요.",
        language: "원하는 언어를 선택하세요.",
        caseType: "도움을 받고 싶은 문제를 선택하세요.",
        summary: "검토하기에 충분한 세부정보가 포함된 짧은 요약을 추가하세요.",
        consent: "제출하기 전에 섭취 공개를 확인해야 합니다."
      },
      toasts: {
        completeRequired: "계속하기 전에 필수 필드를 작성하십시오.",
        confirmDisclosure: "제출하기 전에 공개 내용을 확인하시기 바랍니다.",
        reviewFields: "강조 표시된 접수 필드를 검토하고 다시 시도하십시오.",
        submitError: "귀하의 요청을 제출할 수 없습니다.",
        success: "상담요청이 접수되었습니다.",
        successSent: "확인 이메일을 보냈으며 귀하가 선호하는 연락처 정보를 사용하여 후속 조치를 취하겠습니다.",
        successDefault: "귀하의 정보를 검토한 후 귀하가 선호하는 연락처 정보를 사용하여 후속 조치를 취하겠습니다."
      },
      contactInfoTitle: "연락처 정보",
      contactInfoDesc: "변호사가 귀하에게 연락할 수 있는 가장 좋은 방법부터 시작하십시오.",
      fullName: "성명",
      emailAddress: "이메일 주소",
      phone: "핸드폰",
      preferredLanguage: "선호하는 언어",
      select: "선택하다",
      caseDetailsTitle: "사례 세부정보",
      caseDetailsDesc: "문제와 다음 단계를 평가할 수 있도록 충분히 알려주십시오.",
      caseType: "케이스 유형",
      selectServiceType: "서비스 유형 선택",
      summary: "간략한 요약",
      summaryPlaceholder: "현재 상태, 마감일, 필요한 도움을 설명하세요.",
      summaryHelp: "마감일, 사전 제출 서류, 긴급 청문회 날짜를 포함하세요.",
      documentsAvailable: "사용 가능한 문서",
      passport: "여권",
      receipts: "USCIS 영수증 또는 통지서",
      reviewTitle: "검토 및 제출",
      reviewDesc: "접수내역을 확인하신 후 사무실로 보내주세요.",
      reviewLabels: {
        name: "이름",
        email: "이메일",
        phone: "핸드폰",
        language: "언어",
        caseType: "케이스 유형",
        summary: "요약"
      },
      consentPrefix: "본인은 이 양식이 접수 검토용일 뿐 변호사-의뢰인 관계를 형성하지 않으며 다음 사항이 적용된다는 점을 이해합니다.",
      privacyPolicy: "개인 정보 보호 정책",
      back: "뒤쪽에",
      continue: "계속하다",
      submitting: "제출 중...",
      pleaseWait: "{seconds}초 동안 기다려 주십시오.",
      submitRequest: "요청 제출",
      languages: ["영어", "스페인 사람", "우르두어", "펀자브어", "프랑스 국민"],
      caseTypes: ["방문자 비자", "학생 비자", "상태 변경", "결혼 기반", "취업 허가", "보호 시설", "제거 방어"],
      caseTypeLabels: ["방문 비자(B1/B2)", "학생 비자(F-1)", "상태 변경", "결혼 기반 영주권", "취업 허가(EAD)", "보호 시설", "삭제/법원 문제"]
    },
    insights: {
      filters: {
        all: "모두",
        "case-studies": "사례 연구",
        news: "소식",
        analysis: "분석"
      },
      refreshTimeout: "라이브 피드를 새로 고치는 데 시간이 너무 오래 걸렸습니다. 마지막으로 확인된 스냅샷을 표시합니다.",
      refreshSnapshot: "마지막으로 확인된 스냅샷을 표시합니다.",
      refreshDefault: "라이브 피드를 새로고침할 수 없습니다. 마지막으로 확인된 스냅샷을 표시합니다.",
      heroBadge: "통찰력",
      backToSite: "기본 사이트로 돌아가기",
      headingStart: "사례 연구, 뉴스,",
      headingHighlight: "그리고 실용적인 독서",
      headingEnd: "한 곳에서.",
      liveDesk: "실시간 공개 소스 데스크가 업데이트되었습니다. {날짜}",
      snapshotDesk: "확인된 공개 소스 스냅샷 {date}",
      featured: "추천",
      seeCaseStudies: "사례 연구 보기",
      topicTracks: "주제 트랙",
      topicTracksDesc: "이 페이지의 소스 기반 스토리와 연결된 진입점입니다.",
      sourceWatch: "소스 감시",
      sourceStandards: "소스 표준",
      publicDecisions: "공개 결정",
      caseStudies: "사례 연구",
      caseStudiesDesc: "이 카드에는 공공 결정과 실제 이민 사실 패턴이 요약되어 있습니다.",
      latestNews: "최신 뉴스",
      latestNewsHeadingStart: "기관변경 및 정책추진,",
      latestNewsHeadingHighlight: "중요한 것은 제거되었습니다.",
      latestNewsDesc: "서류 제출, 시기, 절차 변화에 초점을 맞춘 짧은 읽기입니다.",
      analysisBlogs: "분석 및 블로그",
      analysisHeadingStart: "업데이트 시 읽는 시간이 길어집니다.",
      analysisHeadingHighlight: "실용적인 맥락이 필요합니다.",
      analysisDesc: "콘텐츠의 양이 아닌 전략 가치를 위해 선택된 해설입니다.",
      editorialNote: "편집 메모",
      editorialHeadingStart: "깨끗한 업데이트가 유용합니다.",
      editorialHeadingHighlight: "법적 조언은 여전히 ​​개인적인 것입니다.",
      requestLegalGuidance: "법률 자문 요청"
    },
    article: {
      backToInsights: "통찰력으로 돌아가기",
      sourceLabel: "원천",
      share: "공유하다",
      relatedContent: "관련 콘텐츠",
      needCounsel: "구체적인 조언이 필요하신가요?",
      counselDesc: "귀하의 특정 이민 문제에 대해 저희 수석 변호사와 상담을 예약하세요.",
      bookConsultation: "도서상담"
    }
  },
  pa: {
    chatbot: {
      openChat: "ਚੈਟ ਖੋਲ੍ਹੋ",
      title: "M&T ਇਮੀਗ੍ਰੇਸ਼ਨ AI",
      subtitle: "ਮਾਹਰ ਰੂਟਿੰਗ + ਸਮੀਖਿਆ",
      closeChat: "ਚੈਟ ਬੰਦ ਕਰੋ",
      generalInfoOnly: "ਸਿਰਫ਼ ਆਮ ਜਾਣਕਾਰੀ • ਕੋਈ ਅਟਾਰਨੀ-ਗਾਹਕ ਸਬੰਧ ਨਹੀਂ",
      routeTo: "ਨੂੰ ਰੂਟ",
      autoRoutingByIssue: "ਮੁੱਦੇ ਦੁਆਰਾ ਆਟੋ-ਰੂਟਿੰਗ",
      auto: "ਆਟੋ",
      routingAndReviewing: "ਰੂਟਿੰਗ ਅਤੇ ਸਮੀਖਿਆ",
      respondingSuffix: "ਜਵਾਬ ਦੇਣਾ",
      askQuestion: "ਇੱਕ ਇਮੀਗ੍ਰੇਸ਼ਨ ਸਵਾਲ ਪੁੱਛੋ",
      placeholder: "ਵੀਜ਼ਾ, ਗ੍ਰੀਨ ਕਾਰਡ ਜਾਂ ਡੈੱਡਲਾਈਨ ਬਾਰੇ ਪੁੱਛੋ...",
      startDictation: "ਡਿਕਸ਼ਨ ਸ਼ੁਰੂ ਕਰੋ",
      stopDictation: "ਡਿਕਸ਼ਨ ਬੰਦ ਕਰੋ",
      dictationUnsupported: "ਇਸ ਬ੍ਰਾਊਜ਼ਰ ਵਿੱਚ ਡਿਕਸ਼ਨ ਸਮਰਥਿਤ ਨਹੀਂ ਹੈ",
      dictationStopped: "ਡਿਕਸ਼ਨ ਬੰਦ ਹੋ ਗਿਆ।",
      dictationUnavailable: "ਇਸ ਬ੍ਰਾਊਜ਼ਰ ਵਿੱਚ ਡਿਕਸ਼ਨ ਸਮਰਥਿਤ ਨਹੀਂ ਹੈ।",
      dictationCaptured: "ਡਿਕਸ਼ਨ ਹਾਸਲ ਕੀਤਾ। ਭੇਜਣ ਤੋਂ ਪਹਿਲਾਂ ਸੁਨੇਹੇ ਦੀ ਸਮੀਖਿਆ ਕਰੋ।",
      dictationDenied: "ਮਾਈਕ੍ਰੋਫ਼ੋਨ ਇਜਾਜ਼ਤ ਅਸਵੀਕਾਰ ਕੀਤੀ ਗਈ ਸੀ।",
      dictationFailed: "ਡਿਕਸ਼ਨ ਪੂਰਾ ਨਹੀਂ ਕੀਤਾ ਜਾ ਸਕਿਆ।",
      dictationListening: "ਸੁਣ ਰਿਹਾ ਹੈ। ਆਪਣੇ ਸਵਾਲ ਨੂੰ ਸਾਫ਼-ਸਾਫ਼ ਬੋਲੋ।",
      generalGuidanceOnly: "ਸਿਰਫ਼ ਆਮ ਮਾਰਗਦਰਸ਼ਨ",
      messagesLengthError: "ਸੁਨੇਹੇ 1 ਅਤੇ {max} ਅੱਖਰਾਂ ਦੇ ਵਿਚਕਾਰ ਹੋਣੇ ਚਾਹੀਦੇ ਹਨ।",
      aiUnavailable: "AI ਅਸਥਾਈ ਤੌਰ 'ਤੇ ਉਪਲਬਧ ਨਹੀਂ ਹੈ। ਸਿਰਫ਼ ਆਮ ਮਾਰਗਦਰਸ਼ਨ ਦਿਖਾ ਰਿਹਾ ਹੈ।",
      timeoutError: "ਸਹਾਇਕ ਨੇ ਜਵਾਬ ਦੇਣ ਵਿੱਚ ਬਹੁਤ ਸਮਾਂ ਲਿਆ। ਕਿਰਪਾ ਕਰਕੇ ਦੁਬਾਰਾ ਕੋਸ਼ਿਸ਼ ਕਰੋ।",
      requestFailed: "ਅਸੀਂ ਚੈਟ ਬੇਨਤੀ ਨੂੰ ਪੂਰਾ ਨਹੀਂ ਕਰ ਸਕੇ।",
      emptyResponse: "ਸਹਾਇਕ ਨੇ ਖਾਲੀ ਜਵਾਬ ਵਾਪਸ ਕਰ ਦਿੱਤਾ।",
      sendMessage: "ਸੁਨੇਹਾ ਭੇਜੋ",
      enterToSend: "ਭੇਜਣ ਲਈ ਐਂਟਰ ਕਰੋ, ਨਵੀਂ ਲਾਈਨ ਲਈ ਸ਼ਿਫਟ + ਐਂਟਰ ਕਰੋ।",
      requestReview: "ਅੱਗੇ ਵਧਣ ਲਈ ਤਿਆਰ ਹੋ? ਕੇਸ ਦੀ ਸਮੀਖਿਆ ਲਈ ਬੇਨਤੀ ਕਰੋ",
      fallbackAgents: {
        screening: {
          title: "ਇਨਟੇਕ ਕਲਰਕ",
          suggestions: [
            "ਸਲਾਹ ਮਸ਼ਵਰੇ ਤੋਂ ਪਹਿਲਾਂ ਮੈਨੂੰ ਕੀ ਤਿਆਰ ਕਰਨਾ ਚਾਹੀਦਾ ਹੈ?",
            "ਮੈਨੂੰ ਕਿਵੇਂ ਪਤਾ ਲੱਗੇਗਾ ਕਿ ਮੇਰਾ ਮੁੱਦਾ ਜ਼ਰੂਰੀ ਹੈ?",
            "ਤੁਸੀਂ ਕਿਸ ਕਿਸਮ ਦੇ ਕੇਸਾਂ ਨੂੰ ਸੰਭਾਲਦੇ ਹੋ?"
          ],
          actionLabel: "ਕੇਸ ਦੀ ਸਮੀਖਿਆ ਲਈ ਬੇਨਤੀ ਕਰੋ"
        },
        documents: {
          title: "ਦਸਤਾਵੇਜ਼ ਸਲਾਹਕਾਰ",
          suggestions: [
            "ਜੇ ਮੇਰੇ ਦਸਤਾਵੇਜ਼ ਅੰਗਰੇਜ਼ੀ ਵਿੱਚ ਨਹੀਂ ਹਨ ਤਾਂ ਕੀ ਹੋਵੇਗਾ?",
            "ਕੀ ਮੈਨੂੰ ਅਸਲੀ ਜਾਂ ਕਾਪੀਆਂ ਦੀ ਲੋੜ ਹੈ?",
            "ਕਿਹੜੇ ਪੁਰਾਣੇ USCIS ਨੋਟਿਸ ਸਭ ਤੋਂ ਮਹੱਤਵਪੂਰਨ ਹਨ?"
          ],
          actionLabel: "ਦਸਤਾਵੇਜ਼ ਤਿਆਰ ਕਰੋ"
        },
        deadlines: {
          title: "ਸੁਣਵਾਈ ਕਲਰਕ",
          suggestions: [
            "ਮੇਰੇ ਕੋਲ ਇਮੀਗ੍ਰੇਸ਼ਨ ਅਦਾਲਤ ਦੀ ਤਾਰੀਖ ਹੈ",
            "ਮੈਨੂੰ USCIS ਤੋਂ ਇੱਕ ਡੈੱਡਲਾਈਨ ਪ੍ਰਾਪਤ ਹੋਈ ਹੈ",
            "ਮੇਰੇ ਕੋਲ ਅਗਲੇ ਹਫ਼ਤੇ ਇੰਟਰਵਿਊ ਨੋਟਿਸ ਹੈ"
          ],
          actionLabel: "ਜ਼ਰੂਰੀ ਸਲਾਹ"
        },
        strategy: {
          title: "ਲੀਡ ਸਲਾਹਕਾਰ",
          suggestions: [
            "ਕਿਹੜੇ ਵਿਕਲਪ ਮੇਰੀ ਸਥਿਤੀ ਦੇ ਅਨੁਕੂਲ ਹੋ ਸਕਦੇ ਹਨ?",
            "ਸਲਾਹ-ਮਸ਼ਵਰੇ ਕਿਵੇਂ ਕੰਮ ਕਰਦੇ ਹਨ?",
            "ਸਭ ਤੋਂ ਵੱਧ ਫਾਈਲਿੰਗ ਰਣਨੀਤੀ ਨੂੰ ਕੀ ਪ੍ਰਭਾਵਿਤ ਕਰਦਾ ਹੈ?"
          ],
          actionLabel: "ਬੁੱਕ ਰਣਨੀਤੀ ਸਲਾਹ"
        }
      }
    },
    intake: {
      steps: ["ਸੰਪਰਕ ਕਰੋ", "ਕੇਸ ਦੇ ਵੇਰਵੇ", "ਸਮੀਖਿਆ"],
      errors: {
        name: "ਪੂਰਾ ਨਾਮ ਦਾਖਲ ਕਰੋ ਜੋ ਤੁਸੀਂ ਚਾਹੁੰਦੇ ਹੋ ਕਿ ਅਸੀਂ ਵਰਤੀਏ।",
        email: "ਇੱਕ ਵੈਧ ਈਮੇਲ ਪਤਾ ਦਰਜ ਕਰੋ।",
        phone: "ਇੱਕ ਫ਼ੋਨ ਨੰਬਰ ਦਾਖਲ ਕਰੋ ਜਿਸ ਤੱਕ ਅਸੀਂ ਪਹੁੰਚ ਸਕਦੇ ਹਾਂ।",
        language: "ਆਪਣੀ ਪਸੰਦ ਦੀ ਭਾਸ਼ਾ ਚੁਣੋ।",
        caseType: "ਉਹ ਮਾਮਲਾ ਚੁਣੋ ਜਿਸ ਵਿੱਚ ਤੁਸੀਂ ਮਦਦ ਚਾਹੁੰਦੇ ਹੋ।",
        summary: "ਸਮੀਖਿਆ ਲਈ ਕਾਫ਼ੀ ਵੇਰਵੇ ਦੇ ਨਾਲ ਇੱਕ ਛੋਟਾ ਸਾਰਾਂਸ਼ ਸ਼ਾਮਲ ਕਰੋ।",
        consent: "ਸਬਮਿਟ ਕਰਨ ਤੋਂ ਪਹਿਲਾਂ ਤੁਹਾਨੂੰ ਦਾਖਲੇ ਦੇ ਖੁਲਾਸੇ ਦੀ ਪੁਸ਼ਟੀ ਕਰਨੀ ਚਾਹੀਦੀ ਹੈ।"
      },
      toasts: {
        completeRequired: "ਜਾਰੀ ਰੱਖਣ ਤੋਂ ਪਹਿਲਾਂ ਕਿਰਪਾ ਕਰਕੇ ਲੋੜੀਂਦੇ ਖੇਤਰਾਂ ਨੂੰ ਪੂਰਾ ਕਰੋ।",
        confirmDisclosure: "ਕਿਰਪਾ ਕਰਕੇ ਸਪੁਰਦ ਕਰਨ ਤੋਂ ਪਹਿਲਾਂ ਖੁਲਾਸੇ ਦੀ ਪੁਸ਼ਟੀ ਕਰੋ।",
        reviewFields: "ਕਿਰਪਾ ਕਰਕੇ ਹਾਈਲਾਈਟ ਕੀਤੇ ਇਨਟੇਕ ਖੇਤਰਾਂ ਦੀ ਸਮੀਖਿਆ ਕਰੋ ਅਤੇ ਦੁਬਾਰਾ ਕੋਸ਼ਿਸ਼ ਕਰੋ।",
        submitError: "ਅਸੀਂ ਤੁਹਾਡੀ ਬੇਨਤੀ ਦਰਜ ਨਹੀਂ ਕਰ ਸਕੇ।",
        success: "ਸਲਾਹ-ਮਸ਼ਵਰੇ ਦੀ ਬੇਨਤੀ ਪ੍ਰਾਪਤ ਹੋਈ।",
        successSent: "ਅਸੀਂ ਇੱਕ ਪੁਸ਼ਟੀਕਰਨ ਈਮੇਲ ਭੇਜੀ ਹੈ ਅਤੇ ਤੁਹਾਡੇ ਪਸੰਦੀਦਾ ਸੰਪਰਕ ਵੇਰਵਿਆਂ ਦੀ ਵਰਤੋਂ ਕਰਕੇ ਪਾਲਣਾ ਕਰਾਂਗੇ।",
        successDefault: "ਅਸੀਂ ਤੁਹਾਡੀ ਜਾਣਕਾਰੀ ਦੀ ਸਮੀਖਿਆ ਕਰਾਂਗੇ ਅਤੇ ਤੁਹਾਡੇ ਪਸੰਦੀਦਾ ਸੰਪਰਕ ਵੇਰਵਿਆਂ ਦੀ ਵਰਤੋਂ ਕਰਕੇ ਅਨੁਸਰਣ ਕਰਾਂਗੇ।"
      },
      contactInfoTitle: "ਸੰਪਰਕ ਜਾਣਕਾਰੀ",
      contactInfoDesc: "ਅਟਾਰਨੀ ਦੇ ਤੁਹਾਡੇ ਤੱਕ ਪਹੁੰਚਣ ਦੇ ਸਭ ਤੋਂ ਵਧੀਆ ਤਰੀਕੇ ਨਾਲ ਸ਼ੁਰੂ ਕਰੋ।",
      fullName: "ਪੂਰਾ ਨਾਂਮ",
      emailAddress: "ਈਮੇਲ ਪਤਾ",
      phone: "ਫ਼ੋਨ",
      preferredLanguage: "ਤਰਜੀਹੀ ਭਾਸ਼ਾ",
      select: "ਚੁਣੋ",
      caseDetailsTitle: "ਕੇਸ ਦੇ ਵੇਰਵੇ",
      caseDetailsDesc: "ਮਾਮਲੇ ਅਤੇ ਅਗਲੇ ਕਦਮ ਦਾ ਮੁਲਾਂਕਣ ਕਰਨ ਲਈ ਸਾਨੂੰ ਕਾਫ਼ੀ ਦੱਸੋ।",
      caseType: "ਕੇਸ ਦੀ ਕਿਸਮ",
      selectServiceType: "ਸੇਵਾ ਦੀ ਕਿਸਮ ਚੁਣੋ",
      summary: "ਸੰਖੇਪ ਸੰਖੇਪ",
      summaryPlaceholder: "ਆਪਣੀ ਮੌਜੂਦਾ ਸਥਿਤੀ, ਸਮਾਂ-ਸੀਮਾਵਾਂ ਅਤੇ ਤੁਹਾਨੂੰ ਲੋੜੀਂਦੀ ਮਦਦ ਦਾ ਵਰਣਨ ਕਰੋ।",
      summaryHelp: "ਅੰਤਮ ਤਾਰੀਖਾਂ, ਪਹਿਲਾਂ ਦੀਆਂ ਫਾਈਲਿੰਗਾਂ, ਅਤੇ ਕੋਈ ਵੀ ਜ਼ਰੂਰੀ ਸੁਣਵਾਈ ਦੀਆਂ ਤਾਰੀਖਾਂ ਸ਼ਾਮਲ ਕਰੋ।",
      documentsAvailable: "ਦਸਤਾਵੇਜ਼ ਉਪਲਬਧ ਹਨ",
      passport: "ਪਾਸਪੋਰਟ",
      receipts: "USCIS ਰਸੀਦਾਂ ਜਾਂ ਨੋਟਿਸ",
      reviewTitle: "ਸਮੀਖਿਆ ਕਰੋ ਅਤੇ ਸਪੁਰਦ ਕਰੋ",
      reviewDesc: "ਦਫ਼ਤਰ ਨੂੰ ਭੇਜਣ ਤੋਂ ਪਹਿਲਾਂ ਦਾਖਲੇ ਦੇ ਵੇਰਵਿਆਂ ਦੀ ਪੁਸ਼ਟੀ ਕਰੋ।",
      reviewLabels: {
        name: "ਨਾਮ",
        email: "ਈਮੇਲ",
        phone: "ਫ਼ੋਨ",
        language: "ਭਾਸ਼ਾ",
        caseType: "ਕੇਸ ਦੀ ਕਿਸਮ",
        summary: "ਸੰਖੇਪ"
      },
      consentPrefix: "ਮੈਂ ਸਮਝਦਾ/ਸਮਝਦੀ ਹਾਂ ਕਿ ਇਹ ਫਾਰਮ ਸਿਰਫ ਦਾਖਲੇ ਦੀ ਸਮੀਖਿਆ ਲਈ ਹੈ, ਕੋਈ ਅਟਾਰਨੀ-ਕਲਾਇੰਟ ਰਿਸ਼ਤਾ ਨਹੀਂ ਬਣਾਉਂਦਾ, ਅਤੇ ਇਸ ਦੇ ਅਧੀਨ ਹੈ",
      privacyPolicy: "ਪਰਾਈਵੇਟ ਨੀਤੀ",
      back: "ਪਿੱਛੇ",
      continue: "ਜਾਰੀ ਰੱਖੋ",
      submitting: "ਸਪੁਰਦ ਕੀਤਾ ਜਾ ਰਿਹਾ ਹੈ...",
      pleaseWait: "ਕਿਰਪਾ ਕਰਕੇ {ਸੈਕਿੰਡ} ਉਡੀਕ ਕਰੋ",
      submitRequest: "ਬੇਨਤੀ ਦਰਜ ਕਰੋ",
      languages: ["ਅੰਗਰੇਜ਼ੀ", "ਸਪੇਨੀ", "ਉਰਦੂ", "ਪੰਜਾਬੀ", "ਫ੍ਰੈਂਚ"],
      caseTypes: ["ਵਿਜ਼ਟਰ ਵੀਜ਼ਾ", "ਵਿਦਿਆਰਥੀ ਵੀਜ਼ਾ", "ਸਥਿਤੀ ਦੀ ਤਬਦੀਲੀ", "ਵਿਆਹ-ਆਧਾਰਿਤ", "ਵਰਕ ਪਰਮਿਟ", "ਸ਼ਰਣ", "ਹਟਾਉਣ ਦੀ ਰੱਖਿਆ"],
      caseTypeLabels: [
        "ਵਿਜ਼ਟਰ ਵੀਜ਼ਾ (B1/B2)",
        "ਵਿਦਿਆਰਥੀ ਵੀਜ਼ਾ (F-1)",
        "ਸਥਿਤੀ ਦੀ ਤਬਦੀਲੀ",
        "ਵਿਆਹ-ਅਧਾਰਤ ਗ੍ਰੀਨ ਕਾਰਡ",
        "ਵਰਕ ਪਰਮਿਟ (EAD)",
        "ਸ਼ਰਣ",
        "ਹਟਾਉਣਾ / ਅਦਾਲਤੀ ਮਾਮਲਾ"
      ]
    },
    insights: {
      filters: {
        all: "ਸਾਰੇ",
        "case-studies": "ਕੇਸ ਸਟੱਡੀਜ਼",
        news: "ਖ਼ਬਰਾਂ",
        analysis: "ਵਿਸ਼ਲੇਸ਼ਣ"
      },
      refreshTimeout: "ਲਾਈਵ ਫੀਡ ਨੂੰ ਤਾਜ਼ਾ ਕਰਨ ਵਿੱਚ ਬਹੁਤ ਸਮਾਂ ਲੱਗਾ। ਆਖਰੀ ਪ੍ਰਮਾਣਿਤ ਸਨੈਪਸ਼ਾਟ ਦਿਖਾ ਰਿਹਾ ਹੈ।",
      refreshSnapshot: "ਆਖਰੀ ਪ੍ਰਮਾਣਿਤ ਸਨੈਪਸ਼ਾਟ ਦਿਖਾ ਰਿਹਾ ਹੈ।",
      refreshDefault: "ਲਾਈਵ ਫੀਡ ਨੂੰ ਤਾਜ਼ਾ ਨਹੀਂ ਕੀਤਾ ਜਾ ਸਕਿਆ। ਆਖਰੀ ਪ੍ਰਮਾਣਿਤ ਸਨੈਪਸ਼ਾਟ ਦਿਖਾ ਰਿਹਾ ਹੈ।",
      heroBadge: "ਇਨਸਾਈਟਸ",
      backToSite: "ਮੁੱਖ ਸਾਈਟ 'ਤੇ ਵਾਪਸ ਜਾਓ",
      headingStart: "ਕੇਸ ਸਟੱਡੀਜ਼, ਖ਼ਬਰਾਂ,",
      headingHighlight: "ਅਤੇ ਵਿਹਾਰਕ ਪੜ੍ਹਨਾ",
      headingEnd: "ਇੱਕ ਜਗ੍ਹਾ ਵਿੱਚ.",
      liveDesk: "ਲਾਈਵ ਪਬਲਿਕ-ਸਰੋਤ ਡੈਸਕ ਅੱਪਡੇਟ ਕੀਤਾ ਗਿਆ {date}",
      snapshotDesk: "ਪ੍ਰਮਾਣਿਤ ਜਨਤਕ-ਸਰੋਤ ਸਨੈਪਸ਼ਾਟ {date}",
      featured: "ਫੀਚਰਡ",
      seeCaseStudies: "ਕੇਸ ਅਧਿਐਨ ਵੇਖੋ",
      topicTracks: "ਵਿਸ਼ਾ ਟਰੈਕ",
      topicTracksDesc: "ਇਸ ਪੰਨੇ 'ਤੇ ਸਰੋਤ-ਬੈਕਡ ਕਹਾਣੀਆਂ ਨਾਲ ਜੁੜੇ ਐਂਟਰੀ ਪੁਆਇੰਟ।",
      sourceWatch: "ਸਰੋਤ ਵਾਚ",
      sourceStandards: "ਸਰੋਤ ਮਿਆਰ",
      publicDecisions: "ਜਨਤਕ ਫੈਸਲੇ",
      caseStudies: "ਕੇਸ ਸਟੱਡੀਜ਼",
      caseStudiesDesc: "ਇਹ ਕਾਰਡ ਜਨਤਕ ਫੈਸਲਿਆਂ ਅਤੇ ਅਸਲ-ਸੰਸਾਰ ਇਮੀਗ੍ਰੇਸ਼ਨ ਤੱਥਾਂ ਦੇ ਪੈਟਰਨਾਂ ਦਾ ਸਾਰ ਦਿੰਦੇ ਹਨ।",
      latestNews: "ਤਾਜ਼ਾ ਖ਼ਬਰਾਂ",
      latestNewsHeadingStart: "ਏਜੰਸੀ ਤਬਦੀਲੀਆਂ ਅਤੇ ਨੀਤੀ ਅੰਦੋਲਨ,",
      latestNewsHeadingHighlight: "ਕੀ ਮਾਇਨੇ ਰੱਖਦਾ ਹੈ.",
      latestNewsDesc: "ਫਾਈਲਿੰਗਜ਼, ਟਾਈਮਿੰਗ, ਅਤੇ ਪ੍ਰਕਿਰਿਆਤਮਕ ਸ਼ਿਫਟਾਂ 'ਤੇ ਕੇਂਦ੍ਰਿਤ ਛੋਟੇ ਰੀਡਸ।",
      analysisBlogs: "ਵਿਸ਼ਲੇਸ਼ਣ ਅਤੇ ਬਲੌਗ",
      analysisHeadingStart: "ਅੱਪਡੇਟ ਹੋਣ 'ਤੇ ਜ਼ਿਆਦਾ ਪੜ੍ਹਿਆ ਜਾਂਦਾ ਹੈ",
      analysisHeadingHighlight: "ਵਿਹਾਰਕ ਸੰਦਰਭ ਦੀ ਲੋੜ ਹੈ।",
      analysisDesc: "ਰਣਨੀਤੀ ਮੁੱਲ ਲਈ ਚੁਣੀ ਗਈ ਟਿੱਪਣੀ, ਸਮੱਗਰੀ ਵਾਲੀਅਮ ਲਈ ਨਹੀਂ।",
      editorialNote: "ਸੰਪਾਦਕੀ ਨੋਟ",
      editorialHeadingStart: "ਸਾਫ਼ ਅੱਪਡੇਟ ਲਾਭਦਾਇਕ ਹਨ.",
      editorialHeadingHighlight: "ਕਾਨੂੰਨੀ ਸਲਾਹ ਅਜੇ ਵੀ ਨਿੱਜੀ ਹੈ।",
      requestLegalGuidance: "ਕਾਨੂੰਨੀ ਮਾਰਗਦਰਸ਼ਨ ਲਈ ਬੇਨਤੀ ਕਰੋ"
    },
    article: {
      backToInsights: "ਇਨਸਾਈਟਸ 'ਤੇ ਵਾਪਸ ਜਾਓ",
      sourceLabel: "ਸਰੋਤ",
      share: "ਸ਼ੇਅਰ ਕਰੋ",
      relatedContent: "ਸੰਬੰਧਿਤ ਸਮੱਗਰੀ",
      needCounsel: "ਖਾਸ ਸਲਾਹ ਦੀ ਲੋੜ ਹੈ?",
      counselDesc: "ਸਾਡੇ ਲੀਡ ਅਟਾਰਨੀ ਨਾਲ ਆਪਣੇ ਖਾਸ ਇਮੀਗ੍ਰੇਸ਼ਨ ਮਾਮਲੇ 'ਤੇ ਚਰਚਾ ਕਰਨ ਲਈ ਇੱਕ ਸਲਾਹ ਬੁੱਕ ਕਰੋ।",
      bookConsultation: "ਬੁੱਕ ਸਲਾਹ"
    }
  },
  tl: {
    chatbot: {
      openChat: "Buksan ang chat",
      title: "M&T Immigration AI",
      subtitle: "Espesyalistang pagruruta + pagsusuri",
      closeChat: "Isara ang chat",
      generalInfoOnly: "Pangkalahatang impormasyon lamang • Walang relasyong abogado-kliyente",
      routeTo: "Ruta Papunta",
      autoRoutingByIssue: "Auto-routing ayon sa isyu",
      auto: "Auto",
      routingAndReviewing: "Pagruruta at Pagsusuri",
      respondingSuffix: "tumutugon",
      askQuestion: "Magtanong ng tanong sa imigrasyon",
      placeholder: "Magtanong tungkol sa mga visa, green card o mga deadline...",
      startDictation: "Simulan ang pagdidikta",
      stopDictation: "Itigil ang pagdidikta",
      dictationUnsupported: "Hindi sinusuportahan ang pagdidikta sa browser na ito",
      dictationStopped: "Natigil ang pagdidikta.",
      dictationUnavailable: "Hindi sinusuportahan ang pagdidikta sa browser na ito.",
      dictationCaptured: "Nakuha ang diktasyon. Suriin ang mensahe bago ipadala.",
      dictationDenied: "Tinanggihan ang pahintulot sa mikropono.",
      dictationFailed: "Hindi makumpleto ang pagdidikta.",
      dictationListening: "Nakikinig. Sabihin nang malinaw ang iyong tanong.",
      generalGuidanceOnly: "Pangkalahatang patnubay lamang",
      messagesLengthError: "Ang mga mensahe ay dapat nasa pagitan ng 1 at {max} na mga character.",
      aiUnavailable: "Pansamantalang hindi available ang AI. Ipinapakita lamang ang pangkalahatang patnubay.",
      timeoutError: "Masyadong matagal bago sumagot ang assistant. Pakisubukang muli.",
      requestFailed: "Hindi namin makumpleto ang kahilingan sa chat.",
      emptyResponse: "Walang laman na tugon ang ibinalik ng katulong.",
      sendMessage: "Magpadala ng mensahe",
      enterToSend: "Enter para ipadala, Shift + Enter para sa bagong linya.",
      requestReview: "Handa nang magpatuloy? Humiling ng pagsusuri sa kaso",
      fallbackAgents: {
        screening: {
          title: "Clerk ng Intake",
          suggestions: [
            "Ano ang dapat kong ihanda bago ang isang konsultasyon?",
            "Paano ko malalaman kung apurahan ang aking isyu?",
            "Anong mga uri ng kaso ang iyong pinangangasiwaan?"
          ],
          actionLabel: "Humiling ng Pagsusuri ng Kaso"
        },
        documents: {
          title: "Tagapayo ng Dokumento",
          suggestions: [
            "Paano kung ang aking mga dokumento ay wala sa Ingles?",
            "Kailangan ko ba ng mga orihinal o kopya?",
            "Aling mga naunang abiso ng USCIS ang pinakamahalaga?"
          ],
          actionLabel: "Maghanda ng mga Dokumento"
        },
        deadlines: {
          title: "Hearing Clerk",
          suggestions: ["May immigration court date ako", "Nakatanggap ako ng deadline mula sa USCIS", "May interview notice ako next week"],
          actionLabel: "Apurahang Konsultasyon"
        },
        strategy: {
          title: "Pangunahing Tagapayo",
          suggestions: [
            "Anong mga opsyon ang maaaring magkasya sa aking sitwasyon?",
            "Paano gumagana ang mga konsultasyon?",
            "Ano ang higit na nakakaapekto sa diskarte sa pag-file?"
          ],
          actionLabel: "Konsulta sa Diskarte sa Aklat"
        }
      }
    },
    intake: {
      steps: ["Makipag-ugnayan", "Mga Detalye ng Kaso", "Balik-aral"],
      errors: {
        name: "Ilagay ang buong pangalan na gusto mong gamitin namin.",
        email: "Maglagay ng wastong email address.",
        phone: "Maglagay ng numero ng telepono na maaari naming maabot.",
        language: "Piliin ang wikang gusto mo.",
        caseType: "Piliin ang bagay na gusto mo ng tulong.",
        summary: "Magdagdag ng maikling buod na may sapat na detalye para sa pagsusuri.",
        consent: "Dapat mong kumpirmahin ang pagsisiwalat ng paggamit bago isumite."
      },
      toasts: {
        completeRequired: "Mangyaring kumpletuhin ang mga kinakailangang field bago magpatuloy.",
        confirmDisclosure: "Mangyaring kumpirmahin ang pagbubunyag bago isumite.",
        reviewFields: "Pakisuri ang naka-highlight na mga field ng paggamit at subukang muli.",
        submitError: "Hindi namin maisumite ang iyong kahilingan.",
        success: "Natanggap ang kahilingan sa konsultasyon.",
        successSent: "Nagpadala kami ng email ng kumpirmasyon at mag-follow up gamit ang iyong gustong mga detalye sa pakikipag-ugnayan.",
        successDefault: "Susuriin namin ang iyong impormasyon at mag-follow up gamit ang iyong gustong mga detalye sa pakikipag-ugnayan."
      },
      contactInfoTitle: "Impormasyon sa Pakikipag-ugnayan",
      contactInfoDesc: "Magsimula sa pinakamahusay na paraan para maabot ka ng abogado.",
      fullName: "Buong Pangalan",
      emailAddress: "Email Address",
      phone: "Telepono",
      preferredLanguage: "Ginustong Wika",
      select: "Pumili",
      caseDetailsTitle: "Mga Detalye ng Kaso",
      caseDetailsDesc: "Sabihin sa amin ang sapat upang suriin ang bagay at ang susunod na hakbang.",
      caseType: "Uri ng Kaso",
      selectServiceType: "Piliin ang uri ng serbisyo",
      summary: "Maikling Buod",
      summaryPlaceholder: "Ilarawan ang iyong kasalukuyang katayuan, mga deadline, at ang tulong na kailangan mo.",
      summaryHelp: "Isama ang mga deadline, naunang pag-file, at anumang agarang petsa ng pagdinig.",
      documentsAvailable: "Magagamit ang mga Dokumento",
      passport: "Pasaporte",
      receipts: "Mga resibo o abiso ng USCIS",
      reviewTitle: "Suriin at Isumite",
      reviewDesc: "Kumpirmahin ang mga detalye ng paggamit bago ipadala ang mga ito sa opisina.",
      reviewLabels: {
        name: "Pangalan",
        email: "Email",
        phone: "Telepono",
        language: "Wika",
        caseType: "Uri ng Kaso",
        summary: "Buod"
      },
      consentPrefix: "Naiintindihan ko na ang form na ito ay para lamang sa pagsusuri sa paggamit, hindi gumagawa ng relasyon ng abogado-kliyente, at napapailalim sa",
      privacyPolicy: "Patakaran sa Privacy",
      back: "Bumalik",
      continue: "Magpatuloy",
      submitting: "Isinusumite...",
      pleaseWait: "Mangyaring maghintay ng {segundo}s",
      submitRequest: "Isumite ang Kahilingan",
      languages: ["Ingles", "Espanyol", "Urdu", "Punjabi", "Pranses"],
      caseTypes: [
        "Visa ng Bisita",
        "Visa ng Mag-aaral",
        "Pagbabago ng Katayuan",
        "Batay sa Kasal",
        "Work Permit",
        "Asylum",
        "Depensa sa Pag-alis"
      ],
      caseTypeLabels: [
        "Visa ng Bisita (B1/B2)",
        "Student Visa (F-1)",
        "Pagbabago ng Katayuan",
        "Green Card na Nakabatay sa Kasal",
        "Work Permit (EAD)",
        "Asylum",
        "Pag-aalis / Usapin sa Korte"
      ]
    },
    insights: {
      filters: {
        all: "Lahat",
        "case-studies": "Pag-aaral ng Kaso",
        news: "Balita",
        analysis: "Pagsusuri"
      },
      refreshTimeout: "Masyadong matagal ang pag-refresh ng live feed. Ipinapakita ang huling na-verify na snapshot.",
      refreshSnapshot: "Ipinapakita ang huling na-verify na snapshot.",
      refreshDefault: "Hindi ma-refresh ang live feed. Ipinapakita ang huling na-verify na snapshot.",
      heroBadge: "Mga Insight",
      backToSite: "Bumalik sa pangunahing site",
      headingStart: "Pag-aaral ng kaso, balita,",
      headingHighlight: "at praktikal na pagbabasa",
      headingEnd: "sa isang lugar.",
      liveDesk: "Na-update ang live na pampublikong-source desk noong {date}",
      snapshotDesk: "Na-verify na public-source snapshot {date}",
      featured: "Itinatampok",
      seeCaseStudies: "Tingnan ang case study",
      topicTracks: "Mga Track ng Paksa",
      topicTracksDesc: "Mga entry point na nakatali sa source-backed stories sa page na ito.",
      sourceWatch: "Pinagmulan Panoorin",
      sourceStandards: "Mga Pamantayan ng Pinagmulan",
      publicDecisions: "Mga Pampublikong Desisyon",
      caseStudies: "Pag-aaral ng Kaso",
      caseStudiesDesc: "Ang mga card na ito ay nagbubuod ng mga pampublikong desisyon at mga pattern ng katotohanan ng imigrasyon sa totoong mundo.",
      latestNews: "Pinakabagong Balita",
      latestNewsHeadingStart: "Mga pagbabago sa ahensya at paggalaw ng patakaran,",
      latestNewsHeadingHighlight: "hinubaran sa kung ano ang mahalaga.",
      latestNewsDesc: "Mga maiikling pagbabasa na nakatuon sa mga pag-file, timing, at mga pagbabago sa pamamaraan.",
      analysisBlogs: "Pagsusuri at Blog",
      analysisHeadingStart: "Mas mahaba ang pagbabasa kapag nag-update",
      analysisHeadingHighlight: "nangangailangan ng praktikal na konteksto.",
      analysisDesc: "Pinili ang komento para sa halaga ng diskarte, hindi dami ng nilalaman.",
      editorialNote: "Editoryal na Tala",
      editorialHeadingStart: "Ang mga malinis na update ay kapaki-pakinabang.",
      editorialHeadingHighlight: "Ang legal na payo ay personal pa rin.",
      requestLegalGuidance: "Humiling ng legal na patnubay"
    },
    article: {
      backToInsights: "Bumalik sa Insights",
      sourceLabel: "Pinagmulan",
      share: "Ibahagi",
      relatedContent: "Kaugnay na Nilalaman",
      needCounsel: "Kailangan ng tiyak na payo?",
      counselDesc: "Mag-book ng konsultasyon upang talakayin ang iyong partikular na bagay sa imigrasyon sa aming nangungunang abogado.",
      bookConsultation: "Konsultasyon sa Aklat"
    }
  },
  vi: {
    chatbot: {
      openChat: "Mở trò chuyện",
      title: "AI nhập cư M&T",
      subtitle: "Chuyên gia định tuyến + đánh giá",
      closeChat: "Đóng trò chuyện",
      generalInfoOnly: "Chỉ thông tin chung • Không có mối quan hệ luật sư-khách hàng",
      routeTo: "Tuyến đường tới",
      autoRoutingByIssue: "Tự động định tuyến theo vấn đề",
      auto: "Tự động",
      routingAndReviewing: "Định tuyến & Đánh giá",
      respondingSuffix: "đáp ứng",
      askQuestion: "Đặt câu hỏi về nhập cư",
      placeholder: "Hỏi về thị thực, thẻ xanh hoặc thời hạn...",
      startDictation: "Bắt đầu đọc chính tả",
      stopDictation: "Dừng đọc chính tả",
      dictationUnsupported: "Đọc chính tả không được hỗ trợ trong trình duyệt này",
      dictationStopped: "Việc đọc chính tả đã dừng lại.",
      dictationUnavailable: "Đọc chính tả không được hỗ trợ trong trình duyệt này.",
      dictationCaptured: "Đã ghi lại chính tả. Xem lại tin nhắn trước khi gửi.",
      dictationDenied: "Quyền sử dụng micrô đã bị từ chối.",
      dictationFailed: "Không thể hoàn thành việc viết chính tả.",
      dictationListening: "Lắng nghe. Nói rõ câu hỏi của bạn.",
      generalGuidanceOnly: "Chỉ hướng dẫn chung",
      messagesLengthError: "Tin nhắn phải có từ 1 đến {max} ký tự.",
      aiUnavailable: "AI tạm thời không khả dụng. Chỉ hiển thị hướng dẫn chung.",
      timeoutError: "Trợ lý mất quá nhiều thời gian để trả lời. Vui lòng thử lại.",
      requestFailed: "Chúng tôi không thể hoàn thành yêu cầu trò chuyện.",
      emptyResponse: "Người trợ lý trả lời trống rỗng.",
      sendMessage: "Gửi tin nhắn",
      enterToSend: "Enter để gửi, Shift + Enter cho dòng mới.",
      requestReview: "Sẵn sàng để tiếp tục? Yêu cầu xem xét trường hợp",
      fallbackAgents: {
        screening: {
          title: "Thư ký tiếp nhận",
          suggestions: [
            "Tôi nên chuẩn bị gì trước khi tư vấn?",
            "Làm cách nào để biết liệu vấn đề của tôi có khẩn cấp hay không?",
            "Bạn xử lý những loại trường hợp nào?"
          ],
          actionLabel: "Yêu cầu xem xét trường hợp"
        },
        documents: {
          title: "Tư vấn tài liệu",
          suggestions: [
            "Nếu tài liệu của tôi không phải bằng tiếng Anh thì sao?",
            "Tôi cần bản gốc hay bản sao?",
            "Thông báo nào trước đây của USCIS quan trọng nhất?"
          ],
          actionLabel: "Chuẩn bị tài liệu"
        },
        deadlines: {
          title: "Thư ký điều trần",
          suggestions: ["Tôi có ngày ra tòa di trú", "Tôi đã nhận được thời hạn từ USCIS", "Tôi có thông báo phỏng vấn vào tuần tới"],
          actionLabel: "Tư vấn khẩn cấp"
        },
        strategy: {
          title: "Luật sư trưởng",
          suggestions: [
            "Những lựa chọn nào có thể phù hợp với tình huống của tôi?",
            "Việc tư vấn diễn ra như thế nào?",
            "Điều gì ảnh hưởng đến chiến lược nộp đơn nhất?"
          ],
          actionLabel: "Sách Tư vấn chiến lược"
        }
      }
    },
    intake: {
      steps: ["Liên hệ", "Chi tiết trường hợp", "Ôn tập"],
      errors: {
        name: "Nhập tên đầy đủ mà bạn muốn chúng tôi sử dụng.",
        email: "Nhập địa chỉ email hợp lệ.",
        phone: "Nhập số điện thoại chúng tôi có thể liên hệ.",
        language: "Chọn ngôn ngữ bạn thích.",
        caseType: "Chọn vấn đề bạn muốn được trợ giúp.",
        summary: "Thêm một bản tóm tắt ngắn với đủ chi tiết để đánh giá.",
        consent: "Bạn phải xác nhận việc tiết lộ thông tin trước khi gửi."
      },
      toasts: {
        completeRequired: "Vui lòng hoàn thành các trường bắt buộc trước khi tiếp tục.",
        confirmDisclosure: "Vui lòng xác nhận tiết lộ trước khi gửi.",
        reviewFields: "Vui lòng xem lại các trường tiếp nhận được đánh dấu và thử lại.",
        submitError: "Chúng tôi không thể gửi yêu cầu của bạn.",
        success: "Đã nhận được yêu cầu tư vấn.",
        successSent: "Chúng tôi đã gửi email xác nhận và sẽ theo dõi bằng cách sử dụng chi tiết liên hệ ưa thích của bạn.",
        successDefault: "Chúng tôi sẽ xem xét thông tin của bạn và theo dõi bằng cách sử dụng chi tiết liên hệ ưa thích của bạn."
      },
      contactInfoTitle: "Thông tin liên hệ",
      contactInfoDesc: "Bắt đầu với cách tốt nhất để luật sư tiếp cận bạn.",
      fullName: "Tên đầy đủ",
      emailAddress: "Địa chỉ email",
      phone: "Điện thoại",
      preferredLanguage: "Ngôn ngữ ưa thích",
      select: "Lựa chọn",
      caseDetailsTitle: "Chi tiết trường hợp",
      caseDetailsDesc: "Hãy cho chúng tôi biết đủ để đánh giá vấn đề và bước tiếp theo.",
      caseType: "Loại trường hợp",
      selectServiceType: "Chọn loại dịch vụ",
      summary: "Tóm tắt ngắn gọn",
      summaryPlaceholder: "Mô tả tình trạng hiện tại, thời hạn và sự trợ giúp bạn cần.",
      summaryHelp: "Bao gồm thời hạn, hồ sơ nộp trước và bất kỳ ngày điều trần khẩn cấp nào.",
      documentsAvailable: "Tài liệu có sẵn",
      passport: "Hộ chiếu",
      receipts: "Biên nhận hoặc thông báo của USCIS",
      reviewTitle: "Xem xét và gửi",
      reviewDesc: "Xác nhận các chi tiết tiếp nhận trước khi gửi chúng đến văn phòng.",
      reviewLabels: {
        name: "Tên",
        email: "E-mail",
        phone: "Điện thoại",
        language: "Ngôn ngữ",
        caseType: "Loại trường hợp",
        summary: "Bản tóm tắt"
      },
      consentPrefix: "Tôi hiểu biểu mẫu này chỉ dùng để xem xét tiếp nhận, không tạo ra mối quan hệ giữa luật sư và khách hàng và phải tuân theo",
      privacyPolicy: "Chính sách bảo mật",
      back: "Mặt sau",
      continue: "Tiếp tục",
      submitting: "Đang gửi...",
      pleaseWait: "Vui lòng đợi {giây} giây",
      submitRequest: "Gửi yêu cầu",
      languages: ["Tiếng Anh", "tiếng Tây Ban Nha", "tiếng Urdu", "Tiếng Punjab", "người Pháp"],
      caseTypes: [
        "Visa du lịch",
        "Visa sinh viên",
        "Thay đổi trạng thái",
        "Dựa trên hôn nhân",
        "Giấy phép lao động",
        "tị nạn",
        "phòng thủ loại bỏ"
      ],
      caseTypeLabels: [
        "Visa du lịch (B1/B2)",
        "Visa sinh viên (F-1)",
        "Thay đổi trạng thái",
        "Thẻ xanh dựa trên hôn nhân",
        "Giấy phép làm việc (EAD)",
        "tị nạn",
        "Loại bỏ / Vấn đề tòa án"
      ]
    },
    insights: {
      filters: {
        all: "Tất cả",
        "case-studies": "Nghiên cứu điển hình",
        news: "Tin tức",
        analysis: "Phân tích"
      },
      refreshTimeout: "Việc làm mới nguồn cấp dữ liệu trực tiếp mất quá nhiều thời gian. Hiển thị ảnh chụp nhanh được xác minh lần cuối.",
      refreshSnapshot: "Hiển thị ảnh chụp nhanh được xác minh lần cuối.",
      refreshDefault: "Không thể làm mới nguồn cấp dữ liệu trực tiếp. Hiển thị ảnh chụp nhanh được xác minh lần cuối.",
      heroBadge: "Thông tin chi tiết",
      backToSite: "Quay lại trang web chính",
      headingStart: "Nghiên cứu trường hợp, tin tức,",
      headingHighlight: "và các bài đọc thực tế",
      headingEnd: "ở một nơi.",
      liveDesk: "Bàn nguồn công cộng trực tiếp đã cập nhật {date}",
      snapshotDesk: "Ảnh chụp nhanh nguồn công cộng đã được xác minh {date}",
      featured: "Nổi bật",
      seeCaseStudies: "Xem nghiên cứu điển hình",
      topicTracks: "Bài hát chủ đề",
      topicTracksDesc: "Điểm đầu vào gắn liền với các câu chuyện được hỗ trợ từ nguồn trên trang này.",
      sourceWatch: "Xem nguồn",
      sourceStandards: "Tiêu chuẩn nguồn",
      publicDecisions: "Quyết định công",
      caseStudies: "Nghiên cứu điển hình",
      caseStudiesDesc: "Những thẻ này tóm tắt các quyết định công và các mô hình thực tế về nhập cư trong thế giới thực.",
      latestNews: "Tin tức mới nhất",
      latestNewsHeadingStart: "Thay đổi cơ quan và phong trào chính sách,",
      latestNewsHeadingHighlight: "lột bỏ những gì quan trọng.",
      latestNewsDesc: "Các bài đọc ngắn tập trung vào hồ sơ, thời gian và các thay đổi về thủ tục.",
      analysisBlogs: "Phân tích & Blog",
      analysisHeadingStart: "Đọc lâu hơn khi cập nhật",
      analysisHeadingHighlight: "cần bối cảnh thực tế.",
      analysisDesc: "Bình luận được chọn vì giá trị chiến lược chứ không phải khối lượng nội dung.",
      editorialNote: "Ghi chú biên tập",
      editorialHeadingStart: "Cập nhật sạch sẽ rất hữu ích.",
      editorialHeadingHighlight: "Tư vấn pháp lý vẫn mang tính cá nhân.",
      requestLegalGuidance: "Yêu cầu hướng dẫn pháp lý"
    },
    article: {
      backToInsights: "Quay lại Thông tin chi tiết",
      sourceLabel: "Nguồn",
      share: "Chia sẻ",
      relatedContent: "Nội dung liên quan",
      needCounsel: "Cần tư vấn cụ thể?",
      counselDesc: "Đặt lịch tư vấn để thảo luận về vấn đề nhập cư cụ thể của bạn với luật sư chính của chúng tôi.",
      bookConsultation: "Tư vấn sách"
    }
  },
  zh: {
    chatbot: {
      openChat: "打开聊天",
      title: "M&T移民人工智能",
      subtitle: "专业路由+审核",
      closeChat: "关闭聊天",
      generalInfoOnly: "仅提供一般信息 • 没有律师-委托人关系",
      routeTo: "路线至",
      autoRoutingByIssue: "按问题自动路由",
      auto: "汽车",
      routingAndReviewing: "路由和审查",
      respondingSuffix: "回应",
      askQuestion: "问一个移民问题",
      placeholder: "询问签证、绿卡或截止日期......",
      startDictation: "开始听写",
      stopDictation: "停止听写",
      dictationUnsupported: "此浏览器不支持听写",
      dictationStopped: "听写停止了。",
      dictationUnavailable: "此浏览器不支持听写。",
      dictationCaptured: "听写捕获。发送前查看消息。",
      dictationDenied: "麦克风权限被拒绝。",
      dictationFailed: "听写无法完成。",
      dictationListening: "倾听。清楚地说出你的问题。",
      generalGuidanceOnly: "仅提供一般指导",
      messagesLengthError: "消息长度必须介于 1 到 {max} 个字符之间。",
      aiUnavailable: "AI暂时无法使用。仅显示一般指导。",
      timeoutError: "助理过了好久才反应过来。请再试一次。",
      requestFailed: "我们无法完成聊天请求。",
      emptyResponse: "助理给出了空洞的回应。",
      sendMessage: "发送消息",
      enterToSend: "Enter 发送，Shift + Enter 换行。",
      requestReview: "准备好继续了吗？请求案件审查",
      fallbackAgents: {
        screening: {
          title: "接待员",
          suggestions: ["咨询前我应该准备什么？", "我如何知道我的问题是否紧急？", "你们处理什么类型的案件？"],
          actionLabel: "请求案例审查"
        },
        documents: {
          title: "文件顾问",
          suggestions: ["如果我的文件不是英文怎么办？", "我需要原件还是复印件？", "哪些先前的 USCIS 通知最重要？"],
          actionLabel: "准备文件"
        },
        deadlines: {
          title: "听证会书记员",
          suggestions: ["我有移民法庭约会", "我收到了 USCIS 的截止日期", "我下周收到面试通知"],
          actionLabel: "紧急咨询"
        },
        strategy: {
          title: "首席法律顾问",
          suggestions: ["哪些选项可能适合我的情况？", "咨询如何进行？", "什么对申请策略影响最大？"],
          actionLabel: "预订策略咨询"
        }
      }
    },
    intake: {
      steps: ["接触", "案例详情", "审查"],
      errors: {
        name: "输入您希望我们使用的全名。",
        email: "输入有效的电子邮件地址。",
        phone: "输入我们可以联系到的电话号码。",
        language: "选择您喜欢的语言。",
        caseType: "选择您需要帮助的问题。",
        summary: "添加包含足够详细信息的简短摘要以供审核。",
        consent: "您必须在提交之前确认摄入量披露。"
      },
      toasts: {
        completeRequired: "请先填写必填字段，然后再继续。",
        confirmDisclosure: "请在提交前确认披露内容。",
        reviewFields: "请检查突出显示的摄入字段并重试。",
        submitError: "我们无法提交您的请求。",
        success: "收到咨询请求。",
        successSent: "我们发送了一封确认电子邮件，并将使用您首选的联系方式进行跟进。",
        successDefault: "我们将审核您的信息并使用您首选的联系方式进行跟进。"
      },
      contactInfoTitle: "联系信息",
      contactInfoDesc: "从律师联系您的最佳方式开始。",
      fullName: "姓名",
      emailAddress: "电子邮件",
      phone: "电话",
      preferredLanguage: "首选语言",
      select: "选择",
      caseDetailsTitle: "案例详情",
      caseDetailsDesc: "告诉我们足够的信息来评估此事和下一步。",
      caseType: "案例类型",
      selectServiceType: "选择服务类型",
      summary: "简要总结",
      summaryPlaceholder: "描述您当前的状态、截止日期以及您需要的帮助。",
      summaryHelp: "包括截止日期、事先提交的文件以及任何紧急听证会日期。",
      documentsAvailable: "可用文件",
      passport: "护照",
      receipts: "USCIS 收据或通知",
      reviewTitle: "审核并提交",
      reviewDesc: "在将其发送到办公室之前确认接收详细信息。",
      reviewLabels: {
        name: "姓名",
        email: "电子邮件",
        phone: "电话",
        language: "语言",
        caseType: "案例类型",
        summary: "概括"
      },
      consentPrefix: "我了解此表格仅供审查之用，不会建立律师与委托人的关系，并且须遵守",
      privacyPolicy: "隐私政策",
      back: "后退",
      continue: "继续",
      submitting: "正在提交...",
      pleaseWait: "请等待{秒}秒",
      submitRequest: "提交请求",
      languages: ["英语", "西班牙语", "乌尔都语", "旁遮普语", "法语"],
      caseTypes: ["访客签证", "学生签证", "身份变更", "以婚姻为基础", "工作许可证", "庇护", "移除防御"],
      caseTypeLabels: ["访客签证（B1/B2）", "学生签证（F-1）", "身份变更", "婚姻绿卡", "工作许可证（EAD）", "庇护", "搬迁/法庭事宜"]
    },
    insights: {
      filters: {
        all: "全部",
        "case-studies": "案例研究",
        news: "消息",
        analysis: "分析"
      },
      refreshTimeout: "刷新实时提要花费的时间太长。显示最后验证的快照。",
      refreshSnapshot: "显示最后验证的快照。",
      refreshDefault: "无法刷新实时供稿。显示最后验证的快照。",
      heroBadge: "见解",
      backToSite: "返回主站点",
      headingStart: "案例研究、新闻、",
      headingHighlight: "和实用读物",
      headingEnd: "在一个地方。",
      liveDesk: "实时公共资源服务台更新于 {date}",
      snapshotDesk: "已验证的公共源快照 {date}",
      featured: "精选",
      seeCaseStudies: "查看案例研究",
      topicTracks: "主题曲目",
      topicTracksDesc: "与此页面上的来源支持的故事相关的入口点。",
      sourceWatch: "来源观察",
      sourceStandards: "来源标准",
      publicDecisions: "公共决策",
      caseStudies: "案例研究",
      caseStudiesDesc: "这些卡片总结了公共决策和现实世界的移民事实模式。",
      latestNews: "最新消息",
      latestNewsHeadingStart: "机构变化和政策变动，",
      latestNewsHeadingHighlight: "剥离到重要的事情上。",
      latestNewsDesc: "简短的阅读重点是申请、时间安排和程序转变。",
      analysisBlogs: "分析与博客",
      analysisHeadingStart: "更新时阅读时间更长",
      analysisHeadingHighlight: "需要实际背景。",
      analysisDesc: "选择评论是为了策略价值，而不是内容量。",
      editorialNote: "编者按",
      editorialHeadingStart: "干净的更新很有用。",
      editorialHeadingHighlight: "法律建议仍然是个人的。",
      requestLegalGuidance: "请求法律指导"
    },
    article: {
      backToInsights: "返回见解",
      sourceLabel: "来源",
      share: "分享",
      relatedContent: "相关内容",
      needCounsel: "需要具体建议吗？",
      counselDesc: "预约咨询，与我们的首席律师讨论您的具体移民问题。",
      bookConsultation: "预约咨询"
    }
  }
} as const;

export type RuntimeUiCopy = typeof runtimeUiCopy.en;
