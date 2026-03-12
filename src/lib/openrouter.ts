import {
  assistantAgentMap,
  type AssistantAgentId,
} from "@/lib/assistant-agents";

export interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

type ConversationMessage = {
  role: "user" | "assistant";
  content: string;
};

export interface OpenRouterResponse {
  id: string;
  choices: Array<{
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }>;
  model: string;
}

type OpenAIResponsesOutputItem = {
  type: string;
  content?: Array<{
    type: string;
    text?: string;
  }>;
};

type OpenAIResponsesResult = {
  id: string;
  output?: OpenAIResponsesOutputItem[];
};

type OpenAIResponsesInputMessage = {
  role: "user" | "assistant";
  content: Array<{
    type: "input_text";
    text: string;
  }>;
};

export type ChatCompletionResult = {
  content: string;
  provider: "openai" | "openrouter";
  responseId?: string;
};

type SendChatMessageParams = {
  messages: ChatMessage[];
  agent: AssistantAgentId;
  previousResponseId?: string;
};

const OPENAI_RESPONSES_API_URL = "https://api.openai.com/v1/responses";
const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";
const MAX_HISTORY_MESSAGES = 6;
const MARKET_WEB_SEARCH_PATTERN =
  /\b(today|latest|current|recent|news|market|price|policy|tariff|trend|outlook)\b/i;

const PORTFOLIO_FACTS = `
VIDYA RAUT
- Role: Energy & power market analyst.
- Focus: Turning sector data into concise insights and decision-ready dashboards.
- Location: Pune/Pimpri-Chinchwad Area, Maharashtra, India.
- Email: vidyaraut17297@gmail.com
- Phone: +91 8446495690
- LinkedIn: https://www.linkedin.com/in/vidyaraut17/

EDUCATION
- M.Tech in Energy Technology, Savitribai Phule Pune University, July 2025 to May 2027, currently pursuing.
- B.Ed in Science & Mathematics, Shri Shivaji Maratha Society's Adhyapak Mahavidyalaya, 2020 to 2022.
- M.Sc in Physics, H.V.Desai Senior College, 2018 to 2020.
- B.Sc in Physics, PES Modern College, 2014 to 2017.

EXPERIENCE
1. Market Research Analyst, Customized Energy Solutions, July 2023 to June 2024.
   - Analyzed 500+ energy sector reports.
   - Created strategic Excel dashboards.
   - Supported decisions worth $10M+.
   - Reduced report generation time by 40%.
   - Skills used: Excel, Market Research, Data Analysis, Report Writing.

2. Laboratory Intern, Customized Energy Solutions, January 2023 to June 2023.
   - Conducted 200+ battery tests.
   - Assisted with R&D material characterization.
   - Maintained lab safety protocols.
   - Analyzed battery performance data.
   - Skills used: Battery Testing, Lab Safety, Data Analysis.

3. Data Analyst, Customized Energy Solutions, November 2017 to April 2018.
   - Developed interactive Excel dashboards.
   - Presented findings to management.
   - Improved decision-making through data presentation.
   - Skills used: Excel, Power BI, Data Visualization.

4. Teaching Professional, S.S.V.M. & Jr. College, May 2021 to October 2021.
   - Taught Science and Mathematics.
   - Developed lesson plans.
   - Mentored students.
   - Skills used: Communication, Presentation, Mentoring.

CORE SKILLS
- Advanced Excel
- Power BI
- Market Research
- Data Analysis
- Battery Testing
- Report Writing
- Laboratory Safety
- Presentation and communication
- Teaching and mentoring

FOCUS AREAS
- Energy storage systems and power markets
- Hydrogen fuel technologies
- Solar PV management
- Competitive intelligence
- Policy and tariff tracking
- Market sizing
- Dashboard development

ADDITIONAL PORTFOLIO NOTES
- The portfolio includes project themes such as Global Energy Market Dashboard, Battery Performance Analytics, and EV Charging Infrastructure Study.
- Certifications and academic items shown on the site include International Conference (MHMEE-2020), NCC Cadet participation, and MS-CIT.
`.trim();

function buildSystemPrompt(agent: AssistantAgentId): string {
  const activeAgent = assistantAgentMap[agent];

  return `
<role>
You are ${activeAgent.name} for Vidya Raut's portfolio website.
</role>

<primary_goal>
${activeAgent.systemFocus}
</primary_goal>

<response_rules>
- For Vidya-specific questions, use only the provided portfolio facts.
- Do not invent degrees, employers, skills, certifications, project results, tools, or metrics that are not in the portfolio facts.
- If a detail is not in the portfolio facts, say that clearly and suggest contacting Vidya directly.
- If the user asks a general energy or market question, answer helpfully but separate general guidance from Vidya-specific information.
- Prefer short paragraphs or bullets with high signal.
- If you discuss current or recent market conditions, clearly label them as live market guidance only when runtime search data is available.
- Do not claim to have used live search, tools, or current data unless the runtime actually provides it.
</response_rules>

<runtime_notes>
- This chat replays only a short recent history unless the OpenAI Responses API preserves previous_response_id state.
- If earlier context seems missing or ambiguous, ask one short clarifying question instead of guessing.
- Treat the knowledge base below as the source of truth for Vidya-specific facts.
</runtime_notes>

<knowledge_base>
${PORTFOLIO_FACTS}
</knowledge_base>
`.trim();
}

function sanitizeMessages(messages: ChatMessage[]): ConversationMessage[] {
  return messages
    .filter(
      (message): message is ConversationMessage =>
        (message.role === "user" || message.role === "assistant") &&
        typeof message.content === "string" &&
        message.content.trim().length > 0
    )
    .slice(-MAX_HISTORY_MESSAGES);
}

export function buildPortfolioMessages(
  messages: ChatMessage[],
  agent: AssistantAgentId
): ChatMessage[] {
  return [
    { role: "system", content: buildSystemPrompt(agent) },
    ...sanitizeMessages(messages),
  ];
}

function shouldUseMarketWebSearch(agent: AssistantAgentId, latestUserMessage: string) {
  return agent === "market" && MARKET_WEB_SEARCH_PATTERN.test(latestUserMessage);
}

class OpenAIResponsesRequestError extends Error {
  status: number;
  responseText: string;

  constructor(status: number, responseText: string) {
    super(`OpenAI Responses API error: ${status} - ${responseText}`);
    this.name = "OpenAIResponsesRequestError";
    this.status = status;
    this.responseText = responseText;
  }
}

function buildOpenAIInput(
  messages: ChatMessage[],
  previousResponseId?: string
): string | OpenAIResponsesInputMessage[] {
  const sanitizedMessages = sanitizeMessages(messages);

  if (previousResponseId) {
    const latestUserMessage =
      [...sanitizedMessages].reverse().find((message) => message.role === "user")?.content ?? "";

    if (latestUserMessage) {
      return latestUserMessage;
    }
  }

  return sanitizedMessages.map((message) => ({
    role: message.role,
    content: [{ type: "input_text", text: message.content }],
  }));
}

async function createOpenAIResponse({
  input,
  agent,
  previousResponseId,
}: {
  input: string | OpenAIResponsesInputMessage[];
  agent: AssistantAgentId;
  previousResponseId?: string;
}): Promise<ChatCompletionResult> {
  const openAiKey = process.env.OPENAI_API_KEY;

  if (!openAiKey) {
    throw new Error("OpenAI API key not configured");
  }

  const latestUserMessage =
    typeof input === "string"
      ? input
      : [...input].reverse().find((message) => message.role === "user")?.content[0]?.text ?? "";
  const tools = shouldUseMarketWebSearch(agent, latestUserMessage)
    ? [{ type: "web_search_preview" as const }]
    : [];

  const response = await fetch(OPENAI_RESPONSES_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${openAiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL || "gpt-5.4",
      instructions: buildSystemPrompt(agent),
      input,
      previous_response_id: previousResponseId || undefined,
      reasoning: { effort: "none" },
      text: { format: { type: "text" } },
      tool_choice: "auto",
      tools,
      store: false,
      truncation: "auto",
    }),
  });

  if (!response.ok) {
    throw new OpenAIResponsesRequestError(response.status, await response.text());
  }

  const result: OpenAIResponsesResult = await response.json();

  return {
    content: extractOutputText(result),
    provider: "openai",
    responseId: result.id,
  };
}

function shouldRetryWithoutPreviousResponseId(error: unknown): error is OpenAIResponsesRequestError {
  return (
    error instanceof OpenAIResponsesRequestError &&
    error.status >= 400 &&
    error.status < 500 &&
    /previous_response_id|previous response/i.test(error.responseText)
  );
}

function extractOutputText(result: OpenAIResponsesResult): string {
  const chunks =
    result.output
      ?.flatMap((item) =>
        item.type === "message"
          ? (item.content ?? [])
              .filter((contentItem) => contentItem.type === "output_text")
              .map((contentItem) => contentItem.text?.trim() ?? "")
          : []
      )
      .filter(Boolean) ?? [];

  if (!chunks.length) {
    throw new Error("No text content returned from OpenAI Responses API");
  }

  return chunks.join("\n\n");
}

async function sendOpenAIResponsesMessage({
  messages,
  agent,
  previousResponseId,
}: SendChatMessageParams): Promise<ChatCompletionResult> {
  const input = buildOpenAIInput(messages, previousResponseId);

  try {
    return await createOpenAIResponse({
      input,
      agent,
      previousResponseId,
    });
  } catch (error) {
    if (previousResponseId && shouldRetryWithoutPreviousResponseId(error)) {
      return createOpenAIResponse({
        input: buildOpenAIInput(messages),
        agent,
      });
    }

    throw error;
  }
}

async function sendOpenRouterMessage({
  messages,
  agent,
}: SendChatMessageParams): Promise<ChatCompletionResult> {
  const key = process.env.OPENROUTER_API_KEY;

  if (!key) {
    throw new Error("OpenRouter API key not configured");
  }

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

  const response = await fetch(OPENROUTER_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "HTTP-Referer": siteUrl,
      "X-Title": process.env.NEXT_PUBLIC_SITE_NAME || "Vidya Raut Portfolio",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: process.env.OPENROUTER_MODEL || "openai/gpt-3.5-turbo",
      temperature: 0.2,
      messages: buildPortfolioMessages(messages, agent),
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`OpenRouter API error: ${response.status} - ${errorText}`);
  }

  const data: OpenRouterResponse = await response.json();

  if (!data.choices?.length) {
    throw new Error("No response from OpenRouter model");
  }

  return {
    content: data.choices[0].message.content,
    provider: "openrouter",
  };
}

export async function sendChatMessage(
  params: SendChatMessageParams
): Promise<ChatCompletionResult> {
  if (process.env.OPENAI_API_KEY) {
    try {
      return await sendOpenAIResponsesMessage(params);
    } catch (error) {
      console.error("OpenAI Responses API Error:", error);
      if (!process.env.OPENROUTER_API_KEY) {
        throw error;
      }
    }
  }

  return sendOpenRouterMessage(params);
}

export function getFallbackResponse(
  userMessage: string,
  agent: AssistantAgentId = "portfolio"
): string {
  const msg = userMessage.toLowerCase().trim();

  if (agent === "market") {
    if (msg.match(/\b(storage|battery|ess)\b/)) {
      return (
        "**Energy Storage System (ESS) Analysis:**\n" +
        "Markets are usually assessed through demand drivers, policy support, project economics, " +
        "technology maturity, and grid-use cases.\n\n" +
        "Vidya's experience includes direct exposure to:\n" +
        "- **ESS market research**\n- **Battery testing (200+ lab tests)**\n- **Data analysis & Dashboard creation**"
      );
    }

    if (msg.match(/\b(policy|tariff|regulation|shifts)\b/)) {
      return (
        "**Policy & Tariff Impacts:**\n" +
        "Shifts in policy and tariffs can significantly affect project viability, market timing, and adoption speed.\n\n" +
        "Vidya's focus areas include **policy tracking**, **tariff analysis**, and **competitive intelligence** across power markets."
      );
    }

    return (
      "I can explain energy storage, green hydrogen, tariffs, and market-analysis concepts.\n\n" +
      "*(For live market data or current news, ensure the active API allows web search queries.)*"
    );
  }

  if (agent === "opportunity") {
    if (msg.match(/\b(dashboard|reporting|quality)\b/)) {
      return (
        "Vidya brings high value to **Dashboard Creation & Reporting**:\n" +
        "- Reduced report generation time by **40%** at CES.\n" +
        "- Builds interactive **Power BI** and **Advanced Excel** dashboards.\n" +
        "- Turns raw market data into crisp, decision-ready data models."
      );
    }

    if (msg.match(/\b(draft|email|outreach|match|skills)\b/)) {
      return (
        "**Draft Outreach Concept:**\n\n" +
        "\"Hi Vidya, saw your portfolio. We are actively looking for an Energy Analyst skilled in Power BI and market mapping. Your background at CES handling 500+ reports seems like a great fit. Let's talk!\"\n\n" +
        "Her skills perfectly match roles demanding structured data synthesis, market monitoring, and presentation."
      );
    }

    return (
      "**Project & Role Fit:**\n" +
      "Vidya is best suited for energy-market research, analyst support, and projects needing structured reporting.\n" +
      "She adds value through report synthesis, operational modeling, and reliable business logic."
    );
  }

  if (agent === "puzzle") {
    return (
      "Start by isolating the key clue words, then test possible answers against the clue length and theme. " +
      "If you paste the exact puzzle text, I can give a hint first and only reveal a direct answer if you want it."
    );
  }

  if (msg.match(/\b(hello|hi|hey|good\s+(morning|afternoon|evening)|howdy|hiya)\b/)) {
    return (
      "Hello. I can help with Vidya Raut's experience, education, skills, and contact details. " +
      "Ask about her roles at Customized Energy Solutions, her M.Tech studies, or how to reach her."
    );
  }

  if (msg.match(/\b(experience|work|job|career|employment|professional|role|position|ces)\b/)) {
    return (
      "**Vidya's Recent Roles:**\n\n" +
      "- **Market Research Analyst** @ Customized Energy Solutions (Jul 2023 - Jun 2024)\n" +
      "- **Laboratory Intern** @ CES (Jan 2023 - Jun 2023)\n" +
      "- **Data Analyst** @ CES (Nov 2017 - Apr 2018)\n" +
      "- **Teaching Professional** @ S.S.V.M. (May 2021 - Oct 2021)\n\n" +
      "*Highlight: Analyzed 500+ sector reports and optimized time-to-report by 40%.*"
    );
  }

  if (msg.match(/\b(skill|expertise|competence|proficiency|ability|strength|capability)\b/)) {
    return (
      "Vidya's documented skills include Advanced Excel, Power BI, market research, data analysis, battery testing, " +
      "report writing, laboratory safety, presentation, communication, and mentoring."
    );
  }

  if (msg.match(/\b(education|study|degree|qualification|academic|university|college|school)\b/)) {
    return (
      "Vidya is currently pursuing an M.Tech in Energy Technology at Savitribai Phule Pune University (July 2025 to May 2027). " +
      "Her completed degrees include a B.Ed in Science & Mathematics, an M.Sc in Physics, and a B.Sc in Physics."
    );
  }

  if (msg.match(/\b(contact|email|phone|reach|call|message|linkedin|location|address)\b/)) {
    return (
      "You can contact Vidya at vidyaraut17297@gmail.com, on LinkedIn at linkedin.com/in/vidyaraut17, " +
      "or by phone at +91 8446495690. She is based in Pune/Pimpri-Chinchwad Area, Maharashtra, India."
    );
  }

  if (msg.match(/\b(project|portfolio|achievement|accomplishment)\b/)) {
    return (
      "The portfolio highlights work themes such as a Global Energy Market Dashboard, Battery Performance Analytics, " +
      "and an EV Charging Infrastructure Study. For deeper project details, the Projects page and direct contact are the best next steps."
    );
  }

  if (msg.match(/\b(about|background|summary|overview|profile|bio)\b/)) {
    return (
      "Vidya Raut is an energy and power market analyst focused on turning sector data into concise, decision-ready insights. " +
      "Her background combines physics, education, and current graduate study in energy technology."
    );
  }

  if (msg.match(/\b(available|consult|hire|freelance|work with|collaboration|opportunity)\b/)) {
    return (
      "Vidya's portfolio states that she is open to Market and Energy Analyst opportunities. " +
      "For availability or role fit, contact her directly at vidyaraut17297@gmail.com."
    );
  }

  return (
    "I can help with Vidya Raut's experience, education, skills, portfolio themes, and contact details. " +
    "If you need something more specific, ask a narrower question."
  );
}
