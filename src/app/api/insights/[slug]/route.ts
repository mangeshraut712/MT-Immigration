import { NextResponse } from 'next/server';
import { getOpenAIClient, getOpenAIModel } from '@/server/ai/openai';

export const runtime = 'nodejs';
export const maxDuration = 20;

export async function GET(request: Request, context: { params: Promise<{ slug: string }> }) {
  const { slug } = await context.params;
  const client = getOpenAIClient();

  if (!client) {
    return NextResponse.json({ error: 'AI Client not configured' }, { status: 500 });
  }

  const topic = slug.replace(/-/g, ' ');

  try {
    const aiResponse = await client.chat.completions.create({
      model: getOpenAIModel(),
      messages: [
        {
          role: 'system',
          content: `You are an expert immigration attorney writing a structured blog article for your clients. Provide an immersive, distraction-free article reading experience. After the article, provide exactly 3 related short recommendations. Do NOT output markdown code block ticks. Output exactly valid JSON in this format: { "title": "...", "content": "Raw HTML content (using h2, p, ul, li tags without any html/head wrappers)...", "recommendations": [{ "title": "...", "slug": "..." }] }`,
        },
        {
          role: 'user',
          content: `Topic: ${topic}. Write a comprehensive, factual, and easy-to-read article emphasizing successful legal outcomes or industry updates.`,
        },
      ],
      max_tokens: 2000,
    });

    const parsed = JSON.parse(
      (aiResponse.choices[0].message.content || '').replace(/^```json/g, '').replace(/```$/g, '')
    );
    return NextResponse.json(parsed);
  } catch (error) {
    console.warn('Article generation failed, utilizing fallback demo content:', error);
    return NextResponse.json({
      title: `${topic} - Essential Analysis`,
      content: `<h2>Understanding the Nuances</h2><p>When navigating <strong>${topic}</strong>, timing and preparation are the most significant factors driving favorable outcomes. In our recent strategy discussions, we observed that proactive case management limits requests for evidence (RFEs) and accelerates the review timeline.</p><h2>Key Considerations</h2><ul><li><strong>Preparation:</strong> Compile required documents immediately.</li><li><strong>Timelines:</strong> Account for current agency processing backlog delays.</li><li><strong>Strategy:</strong> Present a coherent, unified narrative addressing all legal criteria affirmatively.</li></ul><p>For individuals facing shifting regulations, a preemptive review often isolates potential challenges before they trigger an agency denial.</p>`,
      recommendations: [
        { title: 'Navigating Processing Delays', slug: 'navigating-processing-delays' },
        { title: 'Essential Document Preparation', slug: 'essential-document-preparation' },
        { title: 'Understanding Consular Processing', slug: 'understanding-consular-processing' },
      ],
    });
  }
}
