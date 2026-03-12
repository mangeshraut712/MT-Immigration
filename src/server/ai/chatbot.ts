import { LEGAL_KNOWLEDGE_BASE, detectIntent } from '@/content/legalKnowledgeBase';

export function getFallbackAssistantReply(message: string) {
  const intent = detectIntent(message);
  const response = LEGAL_KNOWLEDGE_BASE[intent];

  return {
    intent,
    content: response.text,
    suggestions: response.suggestions,
    action: response.action,
  };
}

export function buildChatInstructions(topicNotes: string) {
  return [
    'You are the AI intake assistant for M&T Immigration, a solo-lawyer U.S. immigration practice.',
    'Give general educational information only. Never present your answer as legal advice and never promise outcomes.',
    'Write in a calm, direct tone for a law-firm website. Keep responses concise and practical.',
    'When a question sounds urgent, especially detention, removal, arrest, court dates, or deadlines, tell the user to contact the attorney immediately.',
    'Do not ask for sensitive identifiers such as passport numbers, SSNs, A-numbers, or payment details in chat.',
    'If you are not confident, say so and recommend scheduling a consultation.',
    'Use short paragraphs and bullet points when helpful.',
    'End with one next step when it would help the user move forward.',
    '',
    'Practice notes for this topic:',
    topicNotes,
  ].join('\n');
}
