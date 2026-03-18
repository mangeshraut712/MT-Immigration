import { z } from 'zod';

const sourceUrlSchema = z
  .string()
  .trim()
  .min(1)
  .refine(
    (value) => value.startsWith('http://') || value.startsWith('https://') || value.startsWith('/'),
    'Source URL must be absolute or root-relative.',
  );

export const insightHeadlineSchema = z.object({
  category: z.string().trim().min(2).max(40),
  title: z.string().trim().min(8).max(180),
  publishedOn: z.string().trim().min(6).max(40),
  sourceName: z.string().trim().min(2).max(80),
  sourceUrl: sourceUrlSchema,
});

export const insightStorySchema = insightHeadlineSchema.extend({
  summary: z.string().trim().min(20).max(320),
  readTime: z.string().trim().min(4).max(20),
  topic: z.string().trim().min(2).max(50),
});

export const insightsFeedSchema = z.object({
  overview: z.string().trim().min(20).max(220),
  topics: z.array(z.string().trim().min(2).max(32)).min(4).max(8),
  featured: insightStorySchema,
  headlines: z.array(insightHeadlineSchema).length(4),
  news: z.array(insightStorySchema).min(3).max(4),
  blogs: z.array(insightStorySchema).length(3),
});

export const insightsResponseSchema = insightsFeedSchema.extend({
  source: z.enum(['live', 'fallback']),
  updatedAtLabel: z.string().trim().min(4).max(80),
});

export type InsightsFeedInput = z.infer<typeof insightsFeedSchema>;
export type InsightsResponse = z.infer<typeof insightsResponseSchema>;
