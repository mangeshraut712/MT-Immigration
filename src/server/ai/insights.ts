import 'server-only';

import OpenAI from 'openai';

import {
  fallbackInsightsFeed,
  type InsightsFeedData,
} from '@/content/legalInsights';
import { insightsFeedSchema } from '@/server/schemas/insights';

const DEFAULT_INSIGHTS_MODEL = 'gpt-4.1-mini';
const DEFAULT_INSIGHTS_REASONING_EFFORT = 'low' as const;
const INSIGHTS_TIMEOUT_MS = 20_000;

/**
 * Dedicated OpenAI client for the insights route.
 *
 * Insights require `web_search_preview`, an OpenAI-only feature, so we
 * resolve directly from OPENAI_API_KEY instead of the shared provider
 * resolver (which prefers OpenRouter when both keys are present).
 */
let _insightsClient: OpenAI | null | undefined;

function getInsightsClient(): OpenAI | null {
  if (process.env.NODE_ENV === 'production' && _insightsClient !== undefined) {
    return _insightsClient;
  }

  const apiKey = process.env.OPENAI_API_KEY?.trim();
  const client = apiKey
    ? new OpenAI({ apiKey, timeout: INSIGHTS_TIMEOUT_MS, maxRetries: 1 })
    : null;

  if (process.env.NODE_ENV === 'production') {
    _insightsClient = client;
  }

  return client;
}

function getInsightsModel(): string {
  return process.env.OPENAI_INSIGHTS_MODEL?.trim() || DEFAULT_INSIGHTS_MODEL;
}

function getInsightsReasoningEffort() {
  const effort = process.env.OPENAI_INSIGHTS_REASONING_EFFORT?.trim()
    || process.env.OPENAI_REASONING_EFFORT?.trim();
  const valid = new Set(['none', 'minimal', 'low', 'medium', 'high', 'xhigh']);
  if (effort && valid.has(effort)) {
    return effort as 'none' | 'minimal' | 'low' | 'medium' | 'high' | 'xhigh';
  }
  return DEFAULT_INSIGHTS_REASONING_EFFORT;
}

const INSIGHTS_FUNCTION_NAME = 'publish_legal_insights';
const LIVE_INSIGHTS_PROMPT = [
  'You are the editorial intelligence layer for a premium U.S. legal website.',
  'Use web search to gather current legal headlines, legal industry news, regulatory updates, and high-quality legal blog or analysis pieces.',
  'Prioritize reputable legal publications, official sources, bar associations, government announcements, major business/legal outlets, and credible law firm blogs.',
  'Avoid gossip, duplicate stories, weak SEO content, and stale items unless they are still clearly newsworthy.',
  'Prefer items published within the last 30 days whenever possible.',
  'Write for clients and sophisticated readers, not lawyers writing for each other.',
  'Headlines should be concise and modern. Summaries should be 1-2 sentences and easy to scan.',
  'Topics should be short labels such as "Regulatory Watch" or "Law Firm News".',
  'Blogs should lean analytical. News items should lean timely.',
  'For every item include a real source name and direct source URL.',
  'Use exact absolute dates like "March 18, 2026".',
  `After searching, call ${INSIGHTS_FUNCTION_NAME} with the final structured result and do not output prose.`,
].join(' ');

const insightsTool = {
  type: 'function',
  name: INSIGHTS_FUNCTION_NAME,
  description: 'Publish the structured content for the legal insights page.',
  strict: true,
  parameters: {
    type: 'object',
    additionalProperties: false,
    properties: {
      overview: {
        type: 'string',
        description: 'A short overview sentence for the insights hero.',
      },
      topics: {
        type: 'array',
        description: 'Current topical labels for the page.',
        minItems: 4,
        maxItems: 8,
        items: { type: 'string' },
      },
      featured: {
        type: 'object',
        additionalProperties: false,
        properties: {
          category: { type: 'string' },
          title: { type: 'string' },
          summary: { type: 'string' },
          publishedOn: { type: 'string' },
          readTime: { type: 'string' },
          topic: { type: 'string' },
          sourceName: { type: 'string' },
          sourceUrl: { type: 'string' },
        },
        required: [
          'category',
          'title',
          'summary',
          'publishedOn',
          'readTime',
          'topic',
          'sourceName',
          'sourceUrl',
        ],
      },
      headlines: {
        type: 'array',
        minItems: 4,
        maxItems: 4,
        items: {
          type: 'object',
          additionalProperties: false,
          properties: {
            category: { type: 'string' },
            title: { type: 'string' },
            publishedOn: { type: 'string' },
            sourceName: { type: 'string' },
            sourceUrl: { type: 'string' },
          },
          required: ['category', 'title', 'publishedOn', 'sourceName', 'sourceUrl'],
        },
      },
      news: {
        type: 'array',
        minItems: 3,
        maxItems: 4,
        items: {
          type: 'object',
          additionalProperties: false,
          properties: {
            category: { type: 'string' },
            title: { type: 'string' },
            summary: { type: 'string' },
            publishedOn: { type: 'string' },
            readTime: { type: 'string' },
            topic: { type: 'string' },
            sourceName: { type: 'string' },
            sourceUrl: { type: 'string' },
          },
          required: [
            'category',
            'title',
            'summary',
            'publishedOn',
            'readTime',
            'topic',
            'sourceName',
            'sourceUrl',
          ],
        },
      },
      blogs: {
        type: 'array',
        minItems: 3,
        maxItems: 3,
        items: {
          type: 'object',
          additionalProperties: false,
          properties: {
            category: { type: 'string' },
            title: { type: 'string' },
            summary: { type: 'string' },
            publishedOn: { type: 'string' },
            readTime: { type: 'string' },
            topic: { type: 'string' },
            sourceName: { type: 'string' },
            sourceUrl: { type: 'string' },
          },
          required: [
            'category',
            'title',
            'summary',
            'publishedOn',
            'readTime',
            'topic',
            'sourceName',
            'sourceUrl',
          ],
        },
      },
    },
    required: ['overview', 'topics', 'featured', 'headlines', 'news', 'blogs'],
  },
} as const;

function formatUpdatedAtLabel(date = new Date()) {
  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'long',
    timeStyle: 'short',
    timeZone: 'UTC',
  }).format(date);
}

function buildFallbackInsightsFeed(): InsightsFeedData {
  return {
    ...fallbackInsightsFeed,
    source: 'fallback',
    updatedAtLabel: fallbackInsightsFeed.updatedAtLabel,
  };
}

export async function generateLiveInsightsFeed(): Promise<InsightsFeedData> {
  const client = getInsightsClient();

  if (!client) {
    return buildFallbackInsightsFeed();
  }

  try {
    const response = await client.responses.create({
      model: getInsightsModel(),
      instructions: LIVE_INSIGHTS_PROMPT,
      input:
        'Refresh the legal insights page with current legal headlines, timely legal news, and fresh legal blog analysis.',
      tools: [
        { type: 'web_search_preview', search_context_size: 'medium' },
        insightsTool,
      ],
      tool_choice: 'auto',
      max_output_tokens: 2_000,
      reasoning: {
        effort: getInsightsReasoningEffort(),
      },
      store: false,
    });

    const functionCall = response.output.find(
      (item: { type: string; name?: string }) =>
        item.type === 'function_call' && item.name === INSIGHTS_FUNCTION_NAME,
    );

    if (!functionCall || functionCall.type !== 'function_call') {
      return buildFallbackInsightsFeed();
    }

    const parsedArguments = JSON.parse(functionCall.arguments);
    const structuredFeed = insightsFeedSchema.parse(parsedArguments);

    return {
      ...structuredFeed,
      source: 'live',
      updatedAtLabel: formatUpdatedAtLabel(),
    };
  } catch (error) {
    console.error('Insights generation error:', error);
    return buildFallbackInsightsFeed();
  }
}

