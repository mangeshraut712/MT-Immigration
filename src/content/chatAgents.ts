import type { ChatAgentKey } from "@/server/schemas/chat";

export type ChatAgentCard = {
  key: ChatAgentKey;
  title: string;
  shortTitle: string;
  description: string;
  systemPrompt: string;
};

export const chatAgentCards: Record<ChatAgentKey, ChatAgentCard> = {
  screening: {
    key: "screening",
    title: "Intake Clerk",
    shortTitle: "Clerk",
    description:
      "Best for first-step questions, consultation prep, and identifying what kind of matter is involved.",
    systemPrompt:
      "Act like an experienced intake clerk. Focus on matter spotting, consultation readiness, and what facts the attorney needs first.",
  },
  documents: {
    key: "documents",
    title: "Document Counsel",
    shortTitle: "Docs",
    description:
      "Best for evidence checklists, translations, USCIS notices, and organizing filing materials.",
    systemPrompt:
      "Act like a lawyer focused on evidence and filings. Focus on checklists, translations, USCIS notices, filing materials, and how to organize a clean case file.",
  },
  deadlines: {
    key: "deadlines",
    title: "Hearing Clerk",
    shortTitle: "Urgent",
    description:
      "Best for court dates, removal issues, detention, interview notices, and urgent deadlines.",
    systemPrompt:
      "Act like a court-focused clerk. Focus on urgency, deadlines, hearings, detention, removal risk, and immediate next actions.",
  },
  strategy: {
    key: "strategy",
    title: "Lead Counsel",
    shortTitle: "Counsel",
    description:
      "Best for visa options, green card pathways, humanitarian relief, and citizenship questions.",
    systemPrompt:
      "Act like lead counsel. Focus on pathway-level educational guidance for visas, green cards, humanitarian matters, work authorization, and citizenship.",
  },
};

export const chatAgentOrder: ChatAgentKey[] = [
  "screening",
  "documents",
  "deadlines",
  "strategy",
];

export const benchReviewer = {
  title: "Bench Review",
  description:
    "A final safety and clarity pass that checks whether the draft is cautious, clear, and appropriate for a law-firm website.",
} as const;
