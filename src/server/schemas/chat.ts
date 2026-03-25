import { z } from "zod";

import { sanitizeMultilineText } from "@/lib/sanitize";
import { routing } from "@/i18n/routing";

export const CHAT_MESSAGE_MAX_LENGTH = 3_000;

export const chatAgentSchema = z.enum([
  "screening",
  "documents",
  "deadlines",
  "strategy",
]);

export const chatMessageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.preprocess(
    (value) =>
      typeof value === "string" ? sanitizeMultilineText(value) : value,
    z.string().min(1).max(CHAT_MESSAGE_MAX_LENGTH),
  ),
});

export const chatRequestSchema = z.object({
  messages: z.array(chatMessageSchema).min(1).max(16),
  agent: chatAgentSchema.optional(),
  locale: z.enum(routing.locales).optional(),
});

export type ChatMessageInput = z.infer<typeof chatMessageSchema>;
export type ChatAgentKey = z.infer<typeof chatAgentSchema>;
