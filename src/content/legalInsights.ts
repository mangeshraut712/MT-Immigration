export type InsightHeadline = {
  category: string;
  title: string;
  publishedOn: string;
  sourceName: string;
  sourceUrl: string;
};

export type InsightStory = InsightHeadline & {
  summary: string;
  readTime: string;
  topic: string;
};

export type InsightsFeedData = {
  source: 'live' | 'fallback';
  overview: string;
  updatedAtLabel: string;
  topics: readonly string[];
  featured: InsightStory;
  headlines: readonly InsightHeadline[];
  news: readonly InsightStory[];
  blogs: readonly InsightStory[];
};

export const fallbackInsightsFeed: InsightsFeedData = {
  source: 'fallback',
  overview:
    'A calmer editorial page for featured analysis, latest news, blog notes, and firm updates.',
  updatedAtLabel: 'March 18, 2026',
  topics: ['Regulatory Watch', 'Industry News', 'Client Updates', 'Digital Strategy', 'Blog Notes'],
  featured: {
    category: 'Regulatory Watch',
    title: 'What changed recently, and what clients should actually pay attention to',
    summary:
      'The best legal updates do not just repeat the news. They separate what changed, who it affects, and whether any action is actually needed right now.',
    publishedOn: 'March 18, 2026',
    readTime: '5 min read',
    topic: 'Client-facing legal updates',
    sourceName: 'M&T Editorial Desk',
    sourceUrl: '/insights',
  },
  headlines: [
    {
      category: 'Industry News',
      title: 'Premium legal websites are getting quieter, faster, and clearer',
      publishedOn: 'March 15, 2026',
      sourceName: 'M&T Editorial Desk',
      sourceUrl: '/insights',
    },
    {
      category: 'Firm Update',
      title: 'Shorter client updates are replacing long status emails',
      publishedOn: 'March 13, 2026',
      sourceName: 'M&T Editorial Desk',
      sourceUrl: '/insights',
    },
    {
      category: 'Regulatory Watch',
      title: 'Not every legal headline requires immediate action',
      publishedOn: 'March 10, 2026',
      sourceName: 'M&T Editorial Desk',
      sourceUrl: '/insights',
    },
    {
      category: 'Industry News',
      title: 'Mobile-first payment and intake flows now shape trust early',
      publishedOn: 'March 8, 2026',
      sourceName: 'M&T Editorial Desk',
      sourceUrl: '/insights',
    },
  ],
  news: [
    {
      category: 'Industry News',
      title: 'Premium legal websites are getting quieter, faster, and clearer',
      summary:
        'Leading firms are cutting clutter, tightening copy, and making core actions easier to reach.',
      publishedOn: 'March 15, 2026',
      readTime: '3 min read',
      topic: 'Digital strategy',
      sourceName: 'M&T Editorial Desk',
      sourceUrl: '/insights',
    },
    {
      category: 'Firm Update',
      title: 'Shorter client updates are replacing long status emails',
      summary:
        'Clients respond better when updates explain the next step first and the background second.',
      publishedOn: 'March 13, 2026',
      readTime: '3 min read',
      topic: 'Client communication',
      sourceName: 'M&T Editorial Desk',
      sourceUrl: '/insights',
    },
    {
      category: 'Regulatory Watch',
      title: 'Not every legal headline requires immediate action',
      summary:
        'The strongest alerts distinguish between general industry movement and changes that actually affect a live matter.',
      publishedOn: 'March 10, 2026',
      readTime: '4 min read',
      topic: 'Policy triage',
      sourceName: 'M&T Editorial Desk',
      sourceUrl: '/insights',
    },
    {
      category: 'Industry News',
      title: 'Mobile-first payment and intake flows now shape trust early',
      summary:
        'Clients expect the same simplicity from a law firm that they get from premium consumer experiences online.',
      publishedOn: 'March 8, 2026',
      readTime: '4 min read',
      topic: 'User experience',
      sourceName: 'M&T Editorial Desk',
      sourceUrl: '/insights',
    },
  ],
  blogs: [
    {
      category: 'Blog',
      title: 'How better consultation design lowers stress before legal review',
      summary:
        'Calmer layouts, clearer instructions, and smaller decisions reduce friction before the legal work even begins.',
      publishedOn: 'March 5, 2026',
      readTime: '6 min read',
      topic: 'Consultation design',
      sourceName: 'M&T Editorial Desk',
      sourceUrl: '/insights',
    },
    {
      category: 'Blog',
      title: 'Why boutique firms still win when communication stays direct',
      summary:
        'Clients notice the difference when the person shaping strategy is also the person speaking with them.',
      publishedOn: 'March 2, 2026',
      readTime: '5 min read',
      topic: 'Boutique law firms',
      sourceName: 'M&T Editorial Desk',
      sourceUrl: '/insights',
    },
    {
      category: 'Blog',
      title: 'Writing legal updates in plain English without losing precision',
      summary:
        'The strongest legal writing stays accurate while making it obvious what the reader needs to do next.',
      publishedOn: 'February 27, 2026',
      readTime: '7 min read',
      topic: 'Legal writing',
      sourceName: 'M&T Editorial Desk',
      sourceUrl: '/insights',
    },
  ],
};

export const firmAnnouncements = [
  {
    title: 'Cleaner reading experience',
    detail:
      'The journal is now organized around headlines, news, blog notes, and firm updates instead of long uninterrupted copy.',
  },
  {
    title: 'More direct headlines',
    detail:
      'Each card is written to be easier to scan on mobile and faster to understand on first read.',
  },
  {
    title: 'Topics-first structure',
    detail:
      'Readers can quickly understand what is trending across news, analysis, and client-facing legal updates.',
  },
] as const;

export const editorialNote =
  'Updates on this page are informational and are not a substitute for case-specific legal advice.';
