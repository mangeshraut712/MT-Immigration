import 'server-only';

import OpenAI from 'openai';

const DEFAULT_MODEL = 'gpt-5.4';
const DEFAULT_REASONING_EFFORT = 'low' as const;
const REASONING_EFFORTS = new Set([
  'none',
  'minimal',
  'low',
  'medium',
  'high',
  'xhigh',
]);

let openAIClient: OpenAI | null | undefined;

export function getOpenAIClient() {
  if (openAIClient !== undefined) {
    return openAIClient;
  }

  const apiKey = process.env.OPENAI_API_KEY?.trim();
  openAIClient = apiKey ? new OpenAI({ apiKey }) : null;

  return openAIClient;
}

export function getOpenAIModel() {
  return process.env.OPENAI_MODEL?.trim() || DEFAULT_MODEL;
}

export function getOpenAIReasoningEffort() {
  const configuredEffort = process.env.OPENAI_REASONING_EFFORT?.trim();

  if (configuredEffort && REASONING_EFFORTS.has(configuredEffort)) {
    return configuredEffort as
      | 'none'
      | 'minimal'
      | 'low'
      | 'medium'
      | 'high'
      | 'xhigh';
  }

  return DEFAULT_REASONING_EFFORT;
}
