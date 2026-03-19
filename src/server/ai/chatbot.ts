import {
  LEGAL_KNOWLEDGE_BASE,
  detectIntent,
} from "@/content/legalKnowledgeBase";
import { benchReviewer, chatAgentCards } from "@/content/chatAgents";
import type { ChatAgentKey } from "@/server/schemas/chat";

const CHAT_AGENT_FALLBACKS: Record<
  ChatAgentKey,
  {
    content: string;
    suggestions: string[];
    action: { label: string; link: string };
  }
> = {
  screening: {
    content:
      "I can help identify the kind of immigration issue involved, the most likely next step, and what the attorney will want to review first.\n\n• Share your current status, your goal, and whether any deadline or interview notice is involved.\n• Keep the message high level. Do not include passport numbers, A-numbers, or payment details.\n• If timing is critical, request a consultation right away.",
    suggestions: [
      "What should I prepare before a consultation?",
      "How do I know if my issue is urgent?",
      "What case types do you handle?",
    ],
    action: { label: "Request Case Review", link: "/#contact" },
  },
  documents: {
    content:
      "For most immigration matters, document preparation is one of the biggest drivers of case quality.\n\n• Start with identity documents, prior notices, and copies of any earlier applications or denials.\n• Include certified translations when a document is not in English.\n• Bring interview notices, RFEs, court paperwork, and receipts if you have them.",
    suggestions: [
      "What if my documents are not in English?",
      "Do I need originals or copies?",
      "Which prior USCIS notices matter most?",
    ],
    action: { label: "Prepare Documents", link: "/#contact" },
  },
  deadlines: {
    content:
      "If your matter involves a hearing date, removal issue, detention, arrest, interview notice, or filing deadline, timing matters.\n\n• Do not rely on general website content alone for urgent matters.\n• Gather every notice, charging document, RFE, or interview letter you have.\n• Request an urgent consultation so the attorney can assess deadlines and available options.",
    suggestions: [
      "I have an immigration court date",
      "I received a deadline from USCIS",
      "I have an interview notice next week",
    ],
    action: { label: "Urgent Consultation", link: "/#contact" },
  },
  strategy: {
    content:
      "I can help explain common immigration pathways and the issues that usually affect strategy.\n\n• Ask about visas, family-based immigration, humanitarian relief, work authorization, or citizenship.\n• I can provide general educational information, not legal advice.\n• If your situation is complex or time-sensitive, the next step should be a consultation.",
    suggestions: [
      "What options might fit my situation?",
      "How do consultations work?",
      "What affects filing strategy most?",
    ],
    action: { label: "Book Strategy Consult", link: "/#contact" },
  },
};

const intentAgentMap = {
  greeting: "screening",
  visa_b1b2: "strategy",
  visa_f1: "strategy",
  visa_h1b: "strategy",
  green_card_marriage: "strategy",
  green_card_family: "strategy",
  green_card_employment: "strategy",
  asylum: "deadlines",
  citizenship: "strategy",
  deportation: "deadlines",
  pricing: "screening",
  consultation: "screening",
  timeline: "deadlines",
  documents: "documents",
  contact: "screening",
  unknown: "screening",
} as const;

export function getAgentCard(agentKey: ChatAgentKey) {
  return chatAgentCards[agentKey];
}

export function pickAgentForMessage(
  message: string,
  preferredAgent?: ChatAgentKey,
) {
  if (preferredAgent) {
    return preferredAgent;
  }

  return intentAgentMap[detectIntent(message)];
}

export function getFallbackAssistantReply(
  message: string,
  preferredAgent?: ChatAgentKey,
) {
  const intent = detectIntent(message);
  const agent = pickAgentForMessage(message, preferredAgent);
  const response = preferredAgent
    ? CHAT_AGENT_FALLBACKS[preferredAgent]
    : {
        content: LEGAL_KNOWLEDGE_BASE[intent].text,
        suggestions: LEGAL_KNOWLEDGE_BASE[intent].suggestions,
        action: LEGAL_KNOWLEDGE_BASE[intent].action,
      };

  return {
    intent,
    agent,
    agentCard: getAgentCard(agent),
    content: response.content,
    suggestions: response.suggestions,
    action: response.action,
  };
}

export function buildChatInstructions(
  topicNotes: string,
  agentKey: ChatAgentKey,
) {
  const agentCard = getAgentCard(agentKey);

  return [
    "You are the AI intake assistant for M&T Immigration, a solo-lawyer U.S. immigration practice.",
    "Give general educational information only. Never present your answer as legal advice and never promise outcomes.",
    "Write in a calm, direct tone for a law-firm website. Keep responses concise and practical.",
    "When a question sounds urgent, especially detention, removal, arrest, court dates, or deadlines, tell the user to contact the attorney immediately.",
    "Do not ask for sensitive identifiers such as passport numbers, SSNs, A-numbers, or payment details in chat.",
    "If you are not confident, say so and recommend scheduling a consultation.",
    "Use short paragraphs and bullet points when helpful.",
    "End with one next step when it would help the user move forward.",
    "",
    `Active specialist: ${agentCard.title}.`,
    agentCard.systemPrompt,
    "",
    "Practice notes for this topic:",
    topicNotes,
  ].join("\n");
}

export function buildBenchReviewInstructions(agentKey: ChatAgentKey) {
  const agentCard = getAgentCard(agentKey);

  return [
    "You are the final bench reviewer for a solo U.S. immigration law practice website.",
    `You are reviewing a draft prepared by ${agentCard.title}.`,
    "Your job is to keep the answer cautious, clear, concise, and appropriate for a law-firm website.",
    "Do not allow the draft to become legal advice, overpromise outcomes, or omit urgency when deadlines, detention, removal, or court risk are involved.",
    "Revise the draft directly and return only the improved final answer.",
    `Final reviewer name: ${benchReviewer.title}.`,
  ].join("\n");
}
