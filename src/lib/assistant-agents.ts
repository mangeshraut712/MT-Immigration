import { assertUniqueBy } from "@/lib/collection-utils";

export type AssistantAgentId = "portfolio" | "market" | "opportunity" | "puzzle";

export type AssistantAgent = {
  id: AssistantAgentId;
  name: string;
  shortName: string;
  category: "recruiting" | "market" | "advisory" | "game";
  sortOrder: number;
  description: string;
  placeholder: string;
  welcome: string;
  quickActions: string[];
  homepageTitle: string;
  homepageSummary: string;
  starterPrompt: string;
  capabilityBullets: string[];
  systemFocus: string;
};

export const assistantAgents: AssistantAgent[] = assertUniqueBy([
  {
    id: "portfolio",
    name: "Portfolio Guide",
    shortName: "Guide",
    category: "recruiting",
    sortOrder: 1,
    description:
      "Explains Vidya's experience, education, strengths, and role fit with grounded portfolio facts.",
    placeholder: "Ask about Vidya's experience, education, or skills...",
    welcome:
      "Welcome to the Portfolio Guide. I can brief you on Vidya Raut’s experience, education, strengths, role fit, and contact details with grounded portfolio facts.",
    quickActions: [
      "Summarize her experience at CES",
      "What are her strongest technical skills?",
      "Tell me about her Energy Technology M.Tech",
      "How to contact Vidya directly?",
    ],
    homepageTitle: "Portfolio Guide",
    homepageSummary:
      "Answers recruiter, hiring manager, and collaborator questions with concise, fact-grounded replies.",
    starterPrompt: "Give me a concise summary of Vidya Raut's profile.",
    capabilityBullets: [
      "Summarizes experience with dates and scope",
      "Explains education and current M.Tech status",
      "Highlights analyst-role fit and strengths",
    ],
    systemFocus:
      "Focus ONLY on Vidya-specific facts. Use structured bullet points for readability. Give concise, actionable answers aimed at recruiters and collaborators.",
  },
  {
    id: "market",
    name: "Energy Market Agent",
    shortName: "Market",
    category: "market",
    sortOrder: 2,
    description:
      "Helps visitors understand energy storage, policy shifts, market sizing, and commercial context in plain language.",
    placeholder: "Ask about energy storage, solar, tariffs, market trends, or policy...",
    welcome:
      "Welcome to the Energy Market Agent. I can translate storage, policy, tariff, and market-structure questions into clear business language, and when live search is available I can also help with current market context.",
    quickActions: [
      "What is an Energy Storage System (ESS)?",
      "How do policy shifts affect green energy markets?",
      "How is battery degradation analyzed?",
      "Explain power market tariffs",
    ],
    homepageTitle: "Energy Market Agent",
    homepageSummary:
      "Makes energy-market topics easier to understand for customers, partners, and non-technical visitors.",
    starterPrompt:
      "Explain what an energy market analyst watches in battery storage and power markets.",
    capabilityBullets: [
      "Explains ESS, solar, hydrogen, tariffs, and market sizing",
      "Turns sector jargon into client-friendly language",
      "Supports current-market questions when OpenAI web search is configured",
    ],
    systemFocus:
      "Answer energy-market and sector questions clearly using plain language. Break complex topics into digestible steps. Separate general energy guidance from Vidya-specific portfolio facts.",
  },
  {
    id: "opportunity",
    name: "Opportunity Advisor",
    shortName: "Advisor",
    category: "advisory",
    sortOrder: 3,
    description:
      "Helps visitors understand where Vidya can add value on projects, reporting workflows, and market-research engagements.",
    placeholder: "Ask how Vidya can help a team, project, or customer problem...",
    welcome:
      "Welcome to the Opportunity Advisor. I can map Vidya’s background to reporting, market research, analyst, and energy-sector project needs so role fit becomes clearer fast.",
    quickActions: [
      "How can she improve a data dashboard?",
      "What value does she bring to market research?",
      "Draft a recruiter email for Vidya",
      "Match her skills to a Senior Analyst role",
    ],
    homepageTitle: "Opportunity Advisor",
    homepageSummary:
      "Frames Vidya’s strengths as services, deliverables, and project outcomes for teams and customers.",
    starterPrompt:
      "How can Vidya add value to an energy market research or reporting project?",
    capabilityBullets: [
      "Maps experience to business and research needs",
      "Suggests relevant project scopes and deliverables",
      "Helps visitors draft clearer outreach and role-fit questions",
    ],
    systemFocus:
      "Translate Vidya’s background into practical business value. Output clearly formatted, persuasive rationale for her inclusion in data strategy, research, or operational teams.",
  },
  {
    id: "puzzle",
    name: "Puzzle Helper",
    shortName: "Puzzle",
    category: "game",
    sortOrder: 4,
    description:
      "Helps solve crossword clues and puzzle prompts with hints first, then clearer answers when asked.",
    placeholder: "Paste a clue, puzzle text, or ask for a hint...",
    welcome:
      "Welcome to the Puzzle Helper. Paste a clue, describe the puzzle, or share your guessed answer and I’ll give hints, possible answers, or step-by-step solving guidance.",
    quickActions: [
      "Give me a hint for this Marathi crossword clue:",
      "Explain how to break down a crossword clue step by step",
      "Suggest possible answers for this puzzle text:",
      "Help me verify whether this answer fits the clue",
    ],
    homepageTitle: "Puzzle Helper",
    homepageSummary:
      "Supports inline puzzle play with clue analysis, hints, and answer-checking without leaving the portfolio.",
    starterPrompt:
      "Help me solve a crossword clue. Start with a hint instead of the direct answer.",
    capabilityBullets: [
      "Starts with hints before giving direct answers",
      "Works with pasted clues or puzzle descriptions",
      "Helps validate whether a guessed answer actually fits",
    ],
    systemFocus:
      "Help with crossword and puzzle-solving. Prefer hints, reasoning steps, and answer-checking before giving direct solutions unless the user explicitly asks for the answer.",
  },
], "assistant agent", (agent) => agent.id);

export const assistantAgentMap = Object.fromEntries(
  assistantAgents.map((agent) => [agent.id, agent])
) as Record<AssistantAgentId, AssistantAgent>;

export function isAssistantAgentId(value: string): value is AssistantAgentId {
  return value in assistantAgentMap;
}
