import "server-only";

import OpenAI from "openai";

import {
  fallbackInsightsFeed,
  type InsightsFeedData,
} from "@/content/legalInsights";
import { hasConfiguredOpenAIKey } from "@/server/ai/openai";
import { insightsFeedSchema } from "@/server/schemas/insights";
import type { InsightsFeedInput } from "@/server/schemas/insights";

const DEFAULT_INSIGHTS_MODEL = "gpt-4.1-mini";
const DEFAULT_INSIGHTS_REASONING_EFFORT = "low" as const;
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
  if (process.env.NODE_ENV === "production" && _insightsClient !== undefined) {
    return _insightsClient;
  }

  const apiKey = hasConfiguredOpenAIKey()
    ? process.env.OPENAI_API_KEY?.trim() || null
    : null;
  const client = apiKey
    ? new OpenAI({ apiKey, timeout: INSIGHTS_TIMEOUT_MS, maxRetries: 1 })
    : null;

  if (process.env.NODE_ENV === "production") {
    _insightsClient = client;
  }

  return client;
}

function getInsightsModel(): string {
  return process.env.OPENAI_INSIGHTS_MODEL?.trim() || DEFAULT_INSIGHTS_MODEL;
}

function getInsightsReasoningEffort() {
  const effort =
    process.env.OPENAI_INSIGHTS_REASONING_EFFORT?.trim() ||
    process.env.OPENAI_REASONING_EFFORT?.trim();
  const valid = new Set(["none", "minimal", "low", "medium", "high", "xhigh"]);
  if (effort && valid.has(effort)) {
    return effort as "none" | "minimal" | "low" | "medium" | "high" | "xhigh";
  }
  return DEFAULT_INSIGHTS_REASONING_EFFORT;
}

const INSIGHTS_FUNCTION_NAME = "publish_legal_insights";
const LIVE_INSIGHTS_PROMPT = [
  "You are the editorial intelligence layer for a premium U.S. immigration law website.",
  "Use web search to gather current U.S. immigration headlines, agency updates, visa-bulletin movement, policy changes, public decisions, and high-quality immigration analysis.",
  "Prioritize official sources first: USCIS, EOIR, DOJ, DHS, DOS, Travel.State.Gov, CBP, DOL, and the Federal Register.",
  "Use AILA, BAL, Fragomen, Ogletree, National Law Review, and other reputable immigration-analysis outlets for blog coverage and practical commentary when official sources need context.",
  "Avoid gossip, duplicate stories, weak SEO content, stale items, and generic legal-industry coverage that is not materially useful to immigration clients.",
  "Headlines and news should usually come from the last 30 days. Blogs should be current and analytical. Case studies may use public AAO or BIA decisions, agency examples, or clearly attributed published practitioner case writeups from the last 12 months when necessary.",
  "Case studies must feel real-world and practical. Never invent client names, law firm wins, or outcomes. If a source is a public decision, write it as a practical case-study takeaway for clients and practitioners.",
  "Do not repeat the same story, decision, or article across sections. Every title and source URL in featured, headlines, news, blogs, and case studies must refer to a distinct item.",
  "Write for immigration clients and sophisticated readers, not lawyers writing for each other.",
  "Headlines should be concise and modern. Summaries should be 1-2 sentences, concrete, and easy to scan.",
  'Topics should be short labels such as "Visa Bulletin" or "Removal Defense".',
  "Blogs should lean analytical. News items should lean timely. Case studies should explain what happened and why it matters in practice.",
  "For every item include a real source name and a direct source URL.",
  'Use exact absolute dates like "March 18, 2026".',
  `After searching, call ${INSIGHTS_FUNCTION_NAME} with the final structured result and do not output prose.`,
].join(" ");

const insightsTool = {
  type: "function",
  name: INSIGHTS_FUNCTION_NAME,
  description: "Publish the structured content for the insights page.",
  strict: true,
  parameters: {
    type: "object",
    additionalProperties: false,
    properties: {
      overview: {
        type: "string",
        description: "A short overview sentence for the insights hero.",
      },
      topics: {
        type: "array",
        description: "Current topical labels for the page.",
        minItems: 4,
        maxItems: 8,
        items: { type: "string" },
      },
      featured: {
        type: "object",
        additionalProperties: false,
        properties: {
          category: { type: "string" },
          title: { type: "string" },
          summary: { type: "string" },
          publishedOn: { type: "string" },
          readTime: { type: "string" },
          topic: { type: "string" },
          sourceName: { type: "string" },
          sourceUrl: { type: "string" },
        },
        required: [
          "category",
          "title",
          "summary",
          "publishedOn",
          "readTime",
          "topic",
          "sourceName",
          "sourceUrl",
        ],
      },
      headlines: {
        type: "array",
        minItems: 4,
        maxItems: 4,
        items: {
          type: "object",
          additionalProperties: false,
          properties: {
            category: { type: "string" },
            title: { type: "string" },
            publishedOn: { type: "string" },
            sourceName: { type: "string" },
            sourceUrl: { type: "string" },
          },
          required: [
            "category",
            "title",
            "publishedOn",
            "sourceName",
            "sourceUrl",
          ],
        },
      },
      news: {
        type: "array",
        minItems: 3,
        maxItems: 4,
        items: {
          type: "object",
          additionalProperties: false,
          properties: {
            category: { type: "string" },
            title: { type: "string" },
            summary: { type: "string" },
            publishedOn: { type: "string" },
            readTime: { type: "string" },
            topic: { type: "string" },
            sourceName: { type: "string" },
            sourceUrl: { type: "string" },
          },
          required: [
            "category",
            "title",
            "summary",
            "publishedOn",
            "readTime",
            "topic",
            "sourceName",
            "sourceUrl",
          ],
        },
      },
      blogs: {
        type: "array",
        minItems: 3,
        maxItems: 3,
        items: {
          type: "object",
          additionalProperties: false,
          properties: {
            category: { type: "string" },
            title: { type: "string" },
            summary: { type: "string" },
            publishedOn: { type: "string" },
            readTime: { type: "string" },
            topic: { type: "string" },
            sourceName: { type: "string" },
            sourceUrl: { type: "string" },
          },
          required: [
            "category",
            "title",
            "summary",
            "publishedOn",
            "readTime",
            "topic",
            "sourceName",
            "sourceUrl",
          ],
        },
      },
      caseStudies: {
        type: "array",
        minItems: 3,
        maxItems: 3,
        items: {
          type: "object",
          additionalProperties: false,
          properties: {
            category: { type: "string" },
            title: { type: "string" },
            summary: { type: "string" },
            publishedOn: { type: "string" },
            readTime: { type: "string" },
            topic: { type: "string" },
            sourceName: { type: "string" },
            sourceUrl: { type: "string" },
          },
          required: [
            "category",
            "title",
            "summary",
            "publishedOn",
            "readTime",
            "topic",
            "sourceName",
            "sourceUrl",
          ],
        },
      },
    },
    required: [
      "overview",
      "topics",
      "featured",
      "headlines",
      "news",
      "blogs",
      "caseStudies",
    ],
  },
} as const;

function formatUpdatedAtLabel(date = new Date()) {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "long",
    timeStyle: "short",
    timeZone: "UTC",
  }).format(date);
}

function buildFallbackInsightsFeed(): InsightsFeedData {
  return {
    ...fallbackInsightsFeed,
    source: "fallback",
    updatedAtLabel: fallbackInsightsFeed.updatedAtLabel,
  };
}

function hasDuplicateItems(feed: InsightsFeedInput | InsightsFeedData) {
  const seen = new Set<string>();
  const entries = [
    feed.featured,
    ...feed.headlines,
    ...feed.news,
    ...feed.blogs,
    ...feed.caseStudies,
  ];

  for (const entry of entries) {
    const identity = `${entry.title.trim().toLowerCase()}::${entry.sourceUrl.trim().toLowerCase()}`;
    if (seen.has(identity)) {
      return true;
    }
    seen.add(identity);
  }

  return false;
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
        "Refresh the immigration knowledge hub with current immigration headlines, timely policy news, analytical blog coverage, and real-world public case studies.",
      tools: [
        { type: "web_search_preview", search_context_size: "medium" },
        insightsTool,
      ],
      tool_choice: "auto",
      max_output_tokens: 2_000,
      reasoning: {
        effort: getInsightsReasoningEffort(),
      },
      store: false,
    });

    const functionCall = response.output.find(
      (item: { type: string; name?: string }) =>
        item.type === "function_call" && item.name === INSIGHTS_FUNCTION_NAME,
    );

    if (!functionCall || functionCall.type !== "function_call") {
      return buildFallbackInsightsFeed();
    }

    const parsedArguments = JSON.parse(functionCall.arguments);
    const structuredFeed = insightsFeedSchema.parse(parsedArguments);

    if (hasDuplicateItems(structuredFeed)) {
      return buildFallbackInsightsFeed();
    }

    return {
      ...structuredFeed,
      source: "live",
      updatedAtLabel: formatUpdatedAtLabel(),
    };
  } catch (error) {
    console.error("Insights generation error:", error);
    return buildFallbackInsightsFeed();
  }
}
