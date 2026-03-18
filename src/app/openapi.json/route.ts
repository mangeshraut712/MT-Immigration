import { NextResponse } from 'next/server';

import { getSiteUrl } from '@/config/site';
import { siteConfig } from '@/config/site';

export const runtime = 'edge';

export function GET() {
  const base = getSiteUrl();

  const spec = {
    openapi: '3.1.0',
    info: {
      title: `${siteConfig.name} API`,
      version: '1.0.0',
      description:
        'Public website endpoints for intake, AI chat, and legal insights refresh.',
    },
    servers: [{ url: base }],
    externalDocs: {
      description: 'Primary website',
      url: `${base}/`,
    },
    paths: {
      '/api/chat': {
        get: {
          summary: 'Get chat service status',
          responses: { '200': { description: 'Status payload' } },
        },
        post: {
          summary: 'Submit a chat conversation for assistant response',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['messages'],
                  properties: {
                    messages: {
                      type: 'array',
                      minItems: 1,
                      items: {
                        type: 'object',
                        required: ['role', 'content'],
                        properties: {
                          role: {
                            type: 'string',
                            enum: ['user', 'assistant'],
                          },
                          content: { type: 'string', maxLength: 3000 },
                        },
                      },
                    },
                    agent: {
                      type: 'string',
                      enum: ['screening', 'documents', 'deadlines', 'strategy'],
                    },
                  },
                },
              },
            },
          },
          responses: {
            '200': { description: 'Chat response payload' },
            '429': { description: 'Rate limited' },
          },
        },
      },
      '/api/intake': {
        get: {
          summary: 'Get intake route status',
          responses: { '200': { description: 'Status payload' } },
        },
        post: {
          summary: 'Submit a consultation intake request',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: [
                    'name',
                    'email',
                    'phone',
                    'language',
                    'caseType',
                    'summary',
                    'hasPassport',
                    'hasReceipts',
                    'consent',
                  ],
                  properties: {
                    name: { type: 'string', maxLength: 120 },
                    email: { type: 'string', format: 'email', maxLength: 160 },
                    phone: { type: 'string', maxLength: 40 },
                    language: { type: 'string', maxLength: 60 },
                    caseType: { type: 'string', maxLength: 120 },
                    summary: { type: 'string', maxLength: 2000 },
                    hasPassport: { type: 'boolean' },
                    hasReceipts: { type: 'boolean' },
                    consent: { type: 'boolean' },
                    website: { type: 'string', maxLength: 0 },
                  },
                },
              },
            },
          },
          responses: {
            '200': { description: 'Submission accepted' },
            '429': { description: 'Rate limited' },
          },
        },
      },
      '/api/insights': {
        get: {
          summary: 'Get the current legal insights feed',
          responses: {
            '200': { description: 'Insights feed payload' },
            '429': { description: 'Rate limited' },
          },
        },
      },
    },
  };

  return NextResponse.json(spec, {
    headers: {
      'Cache-Control':
        'public, max-age=0, s-maxage=86400, stale-while-revalidate=43200',
    },
  });
}
