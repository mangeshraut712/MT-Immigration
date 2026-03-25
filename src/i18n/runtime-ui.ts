export type RuntimeUiLocale = "en" | "hi" | "ur" | "es";

export function getRuntimeUiLocale(locale: string): RuntimeUiLocale {
  if (locale === "hi" || locale === "ur" || locale === "es") {
    return locale;
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
  }
} as const;

export type RuntimeUiCopy = typeof runtimeUiCopy.en;

