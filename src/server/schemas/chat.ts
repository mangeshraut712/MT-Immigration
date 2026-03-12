import { z } from 'zod';

export const chatAgentSchema = z.enum(['screening', 'documents', 'deadlines', 'strategy']);

export const chatMessageSchema = z.object({
  role: z.enum(['user', 'assistant']),
  content: z.string().trim().min(1).max(3_000),
});

export const chatRequestSchema = z.object({
  messages: z.array(chatMessageSchema).min(1).max(16),
  agent: chatAgentSchema.optional(),
});

export type ChatMessageInput = z.infer<typeof chatMessageSchema>;
export type ChatAgentKey = z.infer<typeof chatAgentSchema>;
