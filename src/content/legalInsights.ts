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

export type InsightDirectoryKind =
  | "featured"
  | "headline"
  | "news"
  | "blog"
  | "case-study";

export type InsightDirectoryEntry = {
  kind: InsightDirectoryKind;
  slug: string;
  category: string;
  title: string;
  publishedOn: string;
  sourceName: string;
  sourceUrl: string;
  summary?: string;
  readTime?: string;
  topic?: string;
};

export type InsightArticlePayload = {
  title: string;
  category: string;
  publishedOn: string;
  readTime: string;
  sourceName: string;
  sourceUrl: string;
  content: string;
  recommendations: { title: string; slug: string }[];
};

export type InsightsFeedData = {
  source: "live" | "fallback";
  overview: string;
  updatedAtLabel: string;
  topics: readonly string[];
  featured: InsightStory;
  headlines: readonly InsightHeadline[];
  news: readonly InsightStory[];
  blogs: readonly InsightStory[];
  caseStudies: readonly InsightStory[];
};

export function createInsightSlug(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export const fallbackInsightsFeed: InsightsFeedData = {
  source: "fallback",
  overview:
    "Public-source immigration coverage refreshed around current agency updates, official decisions, and reputable analysis. No private wins, no filler, and no duplicated desk items.",
  updatedAtLabel: "March 19, 2026",
  topics: [
    "Visa Bulletin",
    "Asylum EAD",
    "H-1B Cap",
    "Removal Defense",
    "SIJ Strategy",
    "EOIR Procedure",
  ],
  featured: {
    category: "Featured Analysis",
    title:
      "March visa-bulletin movement created optimism, but practitioners are warning clients not to overread it",
    summary:
      "Employment-based dates moved forward in the March 2026 bulletin, but practitioners are still warning readers to separate one-month movement from a durable trend before changing filing or travel plans.",
    publishedOn: "March 10, 2026",
    readTime: "6 min read",
    topic: "Visa Bulletin",
    sourceName: "CanAm",
    sourceUrl:
      "https://www.canamenterprises.com/2026/03/why-employment-based-priority-dates-advanced-in-march-2026-and-what-it-means-for-eb-5/",
  },
  headlines: [
    {
      category: "Visa Bulletin",
      title:
        "State Department published the March 2026 bulletin after notable employment-based movement",
      publishedOn: "March 2026 bulletin",
      sourceName: "U.S. Department of State",
      sourceUrl:
        "https://travel.state.gov/content/travel/en/legal/visa-law0/visa-bulletin/2026/visa-bulletin-for-march-2026.html",
    },
    {
      category: "Procedure",
      title:
        "EOIR shifted immigration filing-fee payments to electronic processing only",
      publishedOn: "February 23, 2026",
      sourceName: "EOIR",
      sourceUrl: "https://www.justice.gov/eoir/eoir-forms",
    },
    {
      category: "BIA",
      title:
        "Pinzon Rozo limited long-continuance arguments when SIJ approval still left visa availability remote",
      publishedOn: "March 11, 2026",
      sourceName: "BIA",
      sourceUrl: "https://www.justice.gov/eoir/media/1430766/dl?inline=",
    },
    {
      category: "Cap Season",
      title:
        "FY 2027 H-1B cap guidance focused employers on the weighted-selection season",
      publishedOn: "February 20, 2026",
      sourceName: "BAL",
      sourceUrl: "https://www.bal.com/perspectives/h-1b-cap-season-faq/",
    },
  ],
  news: [
    {
      category: "Rulemaking",
      title:
        "DHS proposed tighter asylum work-authorization timing and eligibility rules",
      summary:
        "The February 23 proposal would extend key asylum-based EAD timing rules and add more procedural friction, which is why it matters to applicants already navigating long affirmative or court timelines.",
      publishedOn: "February 23, 2026",
      readTime: "4 min read",
      topic: "Asylum EAD",
      sourceName: "Federal Register",
      sourceUrl:
        "https://www.govinfo.gov/content/pkg/FR-2026-02-23/pdf/2026-03595.pdf",
    },
    {
      category: "Procedure",
      title: "EOIR moved immigration filing fees to electronic payment only",
      summary:
        "As of February 23, 2026, EOIR no longer accepts checks or money orders for immigration fees. Appeals, motions, and related filings now need payment planning tied to the EOIR Payment Portal.",
      publishedOn: "February 23, 2026",
      readTime: "3 min read",
      topic: "EOIR Procedure",
      sourceName: "EOIR",
      sourceUrl: "https://www.justice.gov/eoir/eoir-forms",
    },
    {
      category: "Case Law",
      title:
        "BIA said U-visa backlogs alone do not justify leaving removal proceedings parked indefinitely",
      summary:
        "In Matter of Ibarra-Vega, the Board rejected continued administrative closure where a U visa was not likely to become available in the reasonably near future, making timing proof central to any collateral-relief strategy.",
      publishedOn: "February 27, 2026",
      readTime: "5 min read",
      topic: "Removal Defense",
      sourceName: "BIA",
      sourceUrl: "https://www.justice.gov/eoir/media/1429421/dl?inline=",
    },
    {
      category: "Case Law",
      title:
        "AAO said withdrawing an H-1B petition did not erase potential fraud findings already supported by the record",
      summary:
        "Matter of Texperts is a practical cap-season warning because the withdrawal of a petition did not prevent USCIS from preserving fraud findings that could affect future filings tied to the same facts.",
      publishedOn: "March 6, 2026",
      readTime: "5 min read",
      topic: "H-1B Compliance",
      sourceName: "AAO",
      sourceUrl: "https://www.justice.gov/eoir/media/1430151/dl?inline=",
    },
  ],
  blogs: [
    {
      category: "Analysis",
      title:
        "Why employment-based priority dates advanced in March 2026 and why that may not last",
      summary:
        "This March 10 analysis is useful because it treats the March bulletin as a demand-and-supply signal, not just a headline, and explains why one month of forward movement does not guarantee a stable trend.",
      publishedOn: "March 10, 2026",
      readTime: "6 min read",
      topic: "Visa Bulletin",
      sourceName: "CanAm",
      sourceUrl:
        "https://www.canamenterprises.com/2026/03/why-employment-based-priority-dates-advanced-in-march-2026-and-what-it-means-for-eb-5/",
    },
    {
      category: "Analysis",
      title:
        "What employers should take from the 2026 immigration landscape and the H-1B lottery shift",
      summary:
        "This March 3 roundup links the weighted H-1B selection model with broader compliance, travel, and enforcement pressure, which makes it more useful than a narrow registration checklist.",
      publishedOn: "March 3, 2026",
      readTime: "5 min read",
      topic: "Employer Planning",
      sourceName: "Thompson Coburn",
      sourceUrl:
        "https://www.jdsupra.com/legalnews/top-takeaways-on-2026-business-5061718/",
    },
    {
      category: "Analysis",
      title:
        "What the FY 2027 H-1B cap season FAQ gets right about weighted selection and timing",
      summary:
        "BAL’s February 20 FAQ turns the new weighted-selection model into filing-stage questions employers and beneficiaries actually need answered before cap season decisions are made.",
      publishedOn: "February 20, 2026",
      readTime: "5 min read",
      topic: "H-1B Cap",
      sourceName: "BAL",
      sourceUrl: "https://www.bal.com/perspectives/h-1b-cap-season-faq/",
    },
  ],
  caseStudies: [
    {
      category: "Case Study",
      title:
        "AAO kept fraud findings in play after an H-1B petitioner withdrew the case",
      summary:
        "Matter of Texperts shows a real-world integrity problem in cap filings: withdrawal did not automatically wipe out fraud concerns, and USCIS could preserve findings that may affect later filings if the record supported them.",
      publishedOn: "March 6, 2026",
      readTime: "5 min read",
      topic: "H-1B Compliance",
      sourceName: "AAO",
      sourceUrl: "https://www.justice.gov/eoir/media/1430151/dl?inline=",
    },
    {
      category: "Case Study",
      title:
        "BIA rejected a continuance strategy built only on an approved SIJ petition and a distant visa date",
      summary:
        "Matter of Pinzon Rozo is a useful SIJ case study because the approval alone was not enough. The Board focused on whether a visa would actually be available within a realistic period, not just whether one path to relief existed on paper.",
      publishedOn: "March 11, 2026",
      readTime: "4 min read",
      topic: "SIJ Strategy",
      sourceName: "BIA",
      sourceUrl: "https://www.justice.gov/eoir/media/1430766/dl?inline=",
    },
    {
      category: "Case Study",
      title:
        "BIA said generalized country violence cannot by itself defeat an asylum claim built on past persecution",
      summary:
        "Matter of R-B-E- matters in practice because the Board pushed back on loose country-conditions reasoning. If past persecution is established, the government still needs a real, claim-specific basis to rebut future risk.",
      publishedOn: "March 9, 2026",
      readTime: "5 min read",
      topic: "Asylum Litigation",
      sourceName: "BIA",
      sourceUrl: "https://www.justice.gov/eoir/media/1430191/dl?inline=",
    },
  ],
};

function isInsightStory(
  entry: InsightHeadline | InsightStory,
): entry is InsightStory {
  return "summary" in entry && "readTime" in entry && "topic" in entry;
}

function createDirectoryEntry(
  kind: InsightDirectoryKind,
  entry: InsightHeadline | InsightStory,
): InsightDirectoryEntry {
  return {
    kind,
    slug: createInsightSlug(entry.title),
    category: entry.category,
    title: entry.title,
    publishedOn: entry.publishedOn,
    sourceName: entry.sourceName,
    sourceUrl: entry.sourceUrl,
    ...(isInsightStory(entry)
      ? {
          summary: entry.summary,
          readTime: entry.readTime,
          topic: entry.topic,
        }
      : {}),
  };
}

function getDirectoryIdentity(entry: InsightDirectoryEntry) {
  return `${entry.slug}::${entry.sourceUrl}`;
}

export function buildInsightDirectory(feed: InsightsFeedData) {
  const allEntries = [
    createDirectoryEntry("featured", feed.featured),
    ...feed.headlines.map((entry) => createDirectoryEntry("headline", entry)),
    ...feed.news.map((entry) => createDirectoryEntry("news", entry)),
    ...feed.blogs.map((entry) => createDirectoryEntry("blog", entry)),
    ...feed.caseStudies.map((entry) =>
      createDirectoryEntry("case-study", entry),
    ),
  ];

  const seen = new Set<string>();
  return allEntries.filter((entry) => {
    const identity = getDirectoryIdentity(entry);
    if (seen.has(identity)) {
      return false;
    }
    seen.add(identity);
    return true;
  });
}

export const fallbackInsightDirectory =
  buildInsightDirectory(fallbackInsightsFeed);

export function getFallbackInsightBySlug(slug: string) {
  return fallbackInsightDirectory.find((entry) => entry.slug === slug) ?? null;
}

export function getInsightBySlug(feed: InsightsFeedData, slug: string) {
  return (
    buildInsightDirectory(feed).find((entry) => entry.slug === slug) ?? null
  );
}

export function buildInsightArticle(
  entry: InsightDirectoryEntry,
  directory: readonly InsightDirectoryEntry[],
): InsightArticlePayload {
  const recommendations = directory
    .filter((candidate) => candidate.slug !== entry.slug)
    .filter((candidate) =>
      entry.topic
        ? candidate.topic === entry.topic ||
          candidate.category === entry.category
        : true,
    )
    .slice(0, 3)
    .map((candidate) => ({
      title: candidate.title,
      slug: candidate.slug,
    }));

  const overview =
    entry.summary ||
    "This Knowledge Hub entry points directly to a public-source immigration update that the desk has already verified and linked.";
  const practicalFocus =
    entry.topic ||
    (entry.kind === "headline"
      ? "Current immigration developments"
      : "Immigration strategy");

  return {
    title: entry.title,
    category: entry.category,
    publishedOn: entry.publishedOn,
    readTime: entry.readTime || "4 min read",
    sourceName: entry.sourceName,
    sourceUrl: entry.sourceUrl,
    content: `
      <p>${escapeHtml(overview)}</p>
      <h2>What changed</h2>
      <p>This entry comes from the Knowledge Hub's ${escapeHtml(entry.kind.replace("-", " "))} stream and is framed around <strong>${escapeHtml(practicalFocus)}</strong>. It is intentionally tied to a real public source rather than a generic AI-generated article.</p>
      <h2>Why it matters in practice</h2>
      <p>Immigration strategy usually turns on timing, evidentiary posture, and which agency or tribunal controls the next step. Readers should compare this update against their current filing stage, interview schedule, travel plans, or court calendar before acting on it.</p>
      <h2>Source to review</h2>
      <p>The underlying source for this entry is <a href="${escapeHtml(entry.sourceUrl)}" target="_blank" rel="noreferrer noopener">${escapeHtml(entry.sourceName)}</a>. For case-specific action, the source should be reviewed together with the client’s notices, filing history, and present eligibility posture.</p>
      <h2>Suggested next move</h2>
      <ul>
        <li>Confirm whether the update affects a live filing, hearing, interview, or deadline.</li>
        <li>Read the source language directly rather than relying on a headline alone.</li>
        <li>Escalate to individualized legal advice before changing travel, filing, or work plans.</li>
      </ul>
    `,
    recommendations,
  };
}

export const firmAnnouncements = [
  {
    title: "Public-source desk only",
    detail:
      "Every card on the page is tied to a real official notice, public decision, or attributable immigration-analysis source.",
  },
  {
    title: "No private wins and no filler",
    detail:
      "The page no longer relies on placeholder success claims, made-up examples, or generic AI articles that are not grounded in a cited source.",
  },
  {
    title: "Live feed with snapshot honesty",
    detail:
      "When the live refresh fails, the page falls back to a dated public-source snapshot instead of pretending stale content is current.",
  },
] as const;

export const editorialNote =
  "Knowledge Hub updates are informational only. Case studies summarize public decisions and are not guarantees of outcome.";
