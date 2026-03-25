import json
import urllib.request
import urllib.parse
import time
import os
import re

def translate_text(text, target_lang):
    if not isinstance(text, str) or not text.strip():
        return text
    
    url = f"https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl={target_lang}&dt=t&q={urllib.parse.quote(text)}"
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req) as response:
            result = json.loads(response.read().decode('utf-8'))
            translated = "".join([sentence[0] for sentence in result[0] if sentence[0]])
            return translated
    except Exception as e:
        time.sleep(1) # wait and retry once
        try:
             req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
             with urllib.request.urlopen(req) as response:
                 result = json.loads(response.read().decode('utf-8'))
                 translated = "".join([sentence[0] for sentence in result[0] if sentence[0]])
                 return translated
        except:
             return text

def translate_dict(d, target_lang):
    translated_dict = {}
    for k, v in d.items():
        if isinstance(v, dict):
            translated_dict[k] = translate_dict(v, target_lang)
        elif isinstance(v, list):
            new_list = []
            for item in v:
                if isinstance(item, dict):
                    new_list.append(translate_dict(item, target_lang))
                elif isinstance(item, str):
                    translated_val = translate_text(item, target_lang)
                    new_list.append(translated_val)
                    time.sleep(0.1)
                else:
                    new_list.append(item)
            translated_dict[k] = new_list
        elif isinstance(v, str):
            translated_val = translate_text(v, target_lang)
            translated_dict[k] = translated_val
            time.sleep(0.1)
        else:
             translated_dict[k] = v
    return translated_dict

en_ui = {
    "chatbot": {
      "openChat": "Open chat",
      "title": "M&T Immigration AI",
      "subtitle": "Specialist routing + review",
      "closeChat": "Close chat",
      "generalInfoOnly": "General info only • No attorney-client relationship",
      "routeTo": "Route To",
      "autoRoutingByIssue": "Auto-routing by issue",
      "auto": "Auto",
      "routingAndReviewing": "Routing & Reviewing",
      "respondingSuffix": "responding",
      "askQuestion": "Ask an immigration question",
      "placeholder": "Ask about visas, green cards or deadlines...",
      "startDictation": "Start dictation",
      "stopDictation": "Stop dictation",
      "dictationUnsupported": "Dictation is not supported in this browser",
      "dictationStopped": "Dictation stopped.",
      "dictationUnavailable": "Dictation is not supported in this browser.",
      "dictationCaptured": "Dictation captured. Review the message before sending.",
      "dictationDenied": "Microphone permission was denied.",
      "dictationFailed": "Dictation could not be completed.",
      "dictationListening: "Listening. Speak your question clearly.",
      "generalGuidanceOnly": "General guidance only",
      "messagesLengthError": "Messages must be between 1 and {max} characters.",
      "aiUnavailable": "AI is temporarily unavailable. Showing general guidance only.",
      "timeoutError": "The assistant took too long to respond. Please try again.",
      "requestFailed": "We could not complete the chat request.",
      "emptyResponse": "The assistant returned an empty response.",
      "sendMessage": "Send message",
      "enterToSend": "Enter to send, Shift + Enter for gap.",
      "requestReview": "Ready to proceed? Request a case review",
      "fallbackAgents": {
        "screening": {
          "title": "Intake Clerk",
          "suggestions": [
            "What should I prepare before a consultation?",
            "How do I know if my issue is urgent?",
            "What case types do you handle?"
          ],
          "actionLabel": "Request Case Review"
        },
        "documents": {
          "title": "Document Counsel",
          "suggestions": [
            "What if my documents are not in English?",
            "Do I need originals or copies?",
            "Which prior USCIS notices matter most?"
          ],
          "actionLabel": "Prepare Documents"
        },
        "deadlines": {
          "title": "Hearing Clerk",
          "suggestions": [
            "I have an immigration court date",
            "I received a deadline from USCIS",
            "I have an interview notice next week"
          ],
          "actionLabel": "Urgent Consultation"
        },
        "strategy": {
          "title": "Lead Counsel",
          "suggestions": [
            "What options might fit my situation?",
            "How do consultations work?",
            "What affects filing strategy most?"
          ],
          "actionLabel": "Book Strategy Consult"
        }
      }
    },
    "intake": {
      "steps": ["Contact", "Case Details", "Review"],
      "errors": {
        "name": "Enter the full name you want us to use.",
        "email": "Enter a valid email address.",
        "phone": "Enter a phone number we can reach.",
        "language": "Choose the language you prefer.",
        "caseType": "Choose the matter you want help with.",
        "summary": "Add a short summary with enough detail for a review.",
        "consent": "You must confirm the intake disclosure before submitting."
      },
      "toasts": {
        "completeRequired": "Please complete the required fields before continuing.",
        "confirmDisclosure": "Please confirm the disclosure before submitting.",
        "reviewFields": "Please review the highlighted intake fields and try again.",
        "submitError": "We could not submit your request.",
        "success": "Consultation request received.",
        "successSent": "We sent a confirmation email and will follow up using your preferred contact details.",
        "successDefault": "We will review your information and follow up using your preferred contact details."
      },
      "contactInfoTitle": "Contact Information",
      "contactInfoDesc": "Start with the best way for the attorney to reach you.",
      "fullName": "Full Name",
      "emailAddress": "Email Address",
      "phone": "Phone",
      "preferredLanguage": "Preferred Language",
      "select": "Select",
      "caseDetailsTitle": "Case Details",
      "caseDetailsDesc": "Tell us enough to evaluate the matter and the next step.",
      "caseType": "Case Type",
      "selectServiceType": "Select service type",
      "summary": "Brief Summary",
      "summaryPlaceholder": "Describe your current status, deadlines, and the help you need.",
      "summaryHelp": "Include deadlines, prior filings, and any urgent hearing dates.",
      "documentsAvailable": "Documents Available",
      "passport": "Passport",
      "receipts": "USCIS receipts or notices",
      "reviewTitle": "Review & Submit",
      "reviewDesc": "Confirm the intake details before sending them to the office.",
      "reviewLabels": {
        "name": "Name",
        "email": "Email",
        "phone": "Phone",
        "language": "Language",
        "caseType": "Case Type",
        "summary": "Summary"
      },
      "consentPrefix": "I understand this form is for intake review only, does not create an attorney-client relationship, and is subject to the",
      "privacyPolicy": "Privacy Policy",
      "back": "Back",
      "continue": "Continue",
      "submitting": "Submitting...",
      "pleaseWait": "Please wait {seconds}s",
      "submitRequest": "Submit Request",
      "languages": ["English", "Spanish", "Urdu", "Punjabi", "French"],
      "caseTypes": [
        "Visitor Visa",
        "Student Visa",
        "Change of Status",
        "Marriage-Based",
        "Work Permit",
        "Asylum",
        "Removal Defense"
      ],
      "caseTypeLabels": [
        "Visitor Visa (B1/B2)",
        "Student Visa (F-1)",
        "Change of Status",
        "Marriage-Based Green Card",
        "Work Permit (EAD)",
        "Asylum",
        "Removal / Court Matter"
      ]
    },
    "insights": {
      "filters": { "all": "All", "case-studies": "Case Studies", "news": "News", "analysis": "Analysis" },
      "refreshTimeout": "Refreshing the live public-source feed took too long. Showing the last verified snapshot.",
      "refreshSnapshot": "Showing the last verified snapshot.",
      "refreshDefault": "Could not refresh the live public-source feed. Showing the last verified snapshot.",
      "heroBadge": "Insights",
      "backToSite": "Back to main site",
      "headingStart": "Case studies, news,",
      "headingHighlight": "and practical reads",
      "headingEnd": "in one place.",
      "liveDesk": "Live public-source desk updated {date}",
      "snapshotDesk": "Verified public-source snapshot {date}",
      "featured": "Featured",
      "seeCaseStudies": "See case studies",
      "topicTracks": "Topic Tracks",
      "topicTracksDesc": "Entry points tied to the source-backed stories already on this page, not generic AI topic pages.",
      "sourceWatch": "Source Watch",
      "sourceStandards": "Source Standards",
      "publicDecisions": "Public Decisions",
      "caseStudies": "Case Studies",
      "caseStudiesDesc: "These cards summarize public decisions and real-world immigration fact patterns, not private client victories. They are meant to show how timing, evidence, and procedural posture affect outcomes in practice.",
      "latestNews": "Latest News",
      "latestNewsHeadingStart": "Agency changes and policy movement,",
      "latestNewsHeadingHighlight": "stripped to what matters.",
      "latestNewsDesc": "Short reads focused on filings, timing, and procedural shifts that change what clients should do next.",
      "analysisBlogs": "Analysis & Blogs",
      "analysisHeadingStart": "Longer reads when the update",
      "analysisHeadingHighlight": "needs practical context.",
      "analysisDesc": "Commentary chosen for strategy value, not content volume, so readers can move from headline to implication quickly.",
      "editorialNote": "Editorial Note",
      "editorialHeadingStart": "Clean updates are useful.",
      "editorialHeadingHighlight": "Legal advice is still personal.",
      "requestLegalGuidance": "Request legal guidance"
    },
    "article": {
      "backToInsights": "Back to Insights",
      "sourceLabel": "Source",
      "share": "Share",
      "relatedContent": "Related Content",
      "needCounsel": "Need specific counsel?",
      "counselDesc": "Book a consultation to discuss your specific immigration matter with our lead attorney.",
      "bookConsultation": "Book Consultation"
    }
}

target_file = "src/i18n/runtime-ui.ts"
with open(target_file, "r", encoding="utf-8") as f:
    ts_code = f.read()

langs = ['ar', 'bn', 'fa', 'ko', 'pa', 'tl', 'vi', 'zh']

all_json_generated = {}
for lang in langs:
    gt_lang = lang
    if lang == 'zh': gt_lang = 'zh-CN'
    print(f"Translating runtime-ui entries for {lang}...")
    translated = translate_dict(en_ui, gt_lang)
    all_json_generated[lang] = translated

def to_ts_object(d, indent=4):
    lines = []
    gap = " " * indent
    for k, v in d.items():
        if isinstance(v, dict):
            lines.append(f'{gap}"{k}": {{\n{to_ts_object(v, indent+2)}\n{gap}}},')
        elif isinstance(v, list):
            items = []
            for item in v:
                if isinstance(item, str):
                    s = item.replace('"', '\\"')
                    items.append(f'"{s}"')
                elif isinstance(item, dict):
                    items.append(f'{{\n{to_ts_object(item, indent+2)}\n{gap}}}')
                else: 
                    items.append(str(item))
            lines.append(f'{gap}"{k}": [{", ".join(items)}],')
        elif isinstance(v, str):
            s = v.replace('"', '\\"')
            lines.append(f'{gap}"{k}": "{s}",')
        else:
            lines.append(f'{gap}"{k}": {v},')
    return "\n".join(lines).rstrip(",")

new_blocks = []
for lang, d in all_json_generated.items():
    s = f"  {lang}: {{\n{to_ts_object(d, 4)}\n  }}"
    new_blocks.append(s)

ts_replacement = ",\n" + ",\n".join(new_blocks) + "\n} as const;\n\nexport type RuntimeUiCopy ="
ts_code = ts_code.replace("} as const;\n\nexport type RuntimeUiCopy =", ts_replacement)

# Update the union and get function at the top
ts_code = re.sub(
    r'export type RuntimeUiLocale = "en" \| "hi" \| "ur" \| "es";',
    'export type RuntimeUiLocale = "en" | "hi" | "ur" | "es" | "ar" | "bn" | "fa" | "ko" | "pa" | "tl" | "vi" | "zh";',
    ts_code
)
ts_code = re.sub(
    r'if \(locale === "hi" \|\| locale === "ur" \|\| locale === "es"\) {',
    'if (["hi", "ur", "es", "ar", "bn", "fa", "ko", "pa", "tl", "vi", "zh"].includes(locale)) {',
    ts_code
)

with open(target_file, "w", encoding="utf-8") as f:
    f.write(ts_code)

print("Finished updating runtime-ui.ts")
