from __future__ import annotations

import logging
import os
import re
import time
from typing import Literal

import httpx
from fastapi import Depends, FastAPI, Header, HTTPException, Request
from fastapi.responses import JSONResponse
from pydantic import BaseModel

app = FastAPI(title="Vidya Raut AI Backend", version="1.0.0")
logger = logging.getLogger("vidyaraut.fastapi")

RATE_LIMIT: dict[str, dict[str, float]] = {}
RATE_LIMIT_WINDOW_MS = 60_000
RATE_LIMIT_MAX_REQUESTS = 10
MAX_HISTORY_MESSAGES = 6
OPENAI_RESPONSES_API_URL = "https://api.openai.com/v1/responses"
OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions"
DEFAULT_DEV_CHAT_UPSTREAM_URL = "https://vidyaraut-five.vercel.app/api/chat"
REMOTE_CHAT_TIMEOUT_SECONDS = 12.0
MARKET_WEB_SEARCH_PATTERN = re.compile(
    r"\b(today|latest|current|recent|news|market|price|policy|tariff|trend|outlook)\b",
    re.IGNORECASE,
)

AGENTS = {
    "portfolio": {
        "name": "Portfolio Guide",
        "system_focus": (
            "Focus on Vidya-specific facts. Give concise, decision-useful answers for recruiters, "
            "collaborators, and visitors."
        ),
    },
    "market": {
        "name": "Energy Market Agent",
        "system_focus": (
            "Answer energy-market and sector questions clearly. Separate general energy guidance "
            "from Vidya-specific portfolio facts."
        ),
    },
    "opportunity": {
        "name": "Opportunity Advisor",
        "system_focus": (
            "Translate Vidya's background into practical project value, role fit, and collaboration "
            "opportunities without inventing unsupported claims."
        ),
    },
    "puzzle": {
        "name": "Puzzle Helper",
        "system_focus": (
            "Help with crossword and puzzle-solving. Prefer hints, clue breakdowns, and answer-checking "
            "before giving direct solutions unless the user explicitly asks for the answer."
        ),
    },
}

PORTFOLIO_FACTS = """
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
""".strip()


class ChatMessage(BaseModel):
    role: Literal["user", "assistant", "system"]
    content: str


class ChatRequest(BaseModel):
    messages: list[ChatMessage]
    agent: Literal["portfolio", "market", "opportunity", "puzzle"] = "portfolio"
    previousResponseId: str | None = None


def get_client_ip(request: Request) -> str:
    forwarded_for = request.headers.get("x-forwarded-for")
    if forwarded_for:
        return forwarded_for.split(",")[0].strip()
    real_ip = request.headers.get("x-real-ip")
    if real_ip:
        return real_ip.strip()
    return request.client.host if request.client else "unknown"


def check_rate_limit(ip: str) -> bool:
    now = time.time() * 1000
    user_limit = RATE_LIMIT.get(ip)

    if not user_limit or now > user_limit["reset_time"]:
        RATE_LIMIT[ip] = {"count": 1, "reset_time": now + RATE_LIMIT_WINDOW_MS}
        return True

    if user_limit["count"] >= RATE_LIMIT_MAX_REQUESTS:
        return False

    user_limit["count"] += 1
    return True


def get_remote_chat_url() -> str | None:
    value = (os.getenv("CHAT_UPSTREAM_URL") or "").strip()
    if value:
        return value.rstrip("/")

    if os.getenv("NODE_ENV", "development") != "production":
        return DEFAULT_DEV_CHAT_UPSTREAM_URL

    return None


def build_system_prompt(agent: str) -> str:
    active_agent = AGENTS[agent]
    return (
        f"<role>\nYou are {active_agent['name']} for Vidya Raut's portfolio website.\n</role>\n\n"
        f"<primary_goal>\n{active_agent['system_focus']}\n</primary_goal>\n\n"
        "<response_rules>\n"
        "- For Vidya-specific questions, use only the provided portfolio facts.\n"
        "- Do not invent degrees, employers, skills, certifications, project results, tools, or metrics that are not in the portfolio facts.\n"
        "- If a detail is not in the portfolio facts, say that clearly and suggest contacting Vidya directly.\n"
        "- If the user asks a general energy or market question, answer helpfully but separate general guidance from Vidya-specific information.\n"
        "- Prefer short paragraphs or bullets with high signal.\n"
        "- If you discuss current or recent market conditions, clearly label them as live market guidance only when runtime search data is available.\n"
        "- Do not claim to have used live search, tools, or current data unless the runtime actually provides it.\n"
        "</response_rules>\n\n"
        "<runtime_notes>\n"
        "- This chat replays only a short recent history unless the OpenAI Responses API preserves previous_response_id state.\n"
        "- If earlier context seems missing or ambiguous, ask one short clarifying question instead of guessing.\n"
        "- Treat the knowledge base below as the source of truth for Vidya-specific facts.\n"
        "</runtime_notes>\n\n"
        f"<knowledge_base>\n{PORTFOLIO_FACTS}\n</knowledge_base>"
    )


def sanitize_messages(messages: list[ChatMessage]) -> list[ChatMessage]:
    sanitized = [
        message
        for message in messages
        if message.role in {"user", "assistant"} and message.content.strip()
    ]
    return sanitized[-MAX_HISTORY_MESSAGES:]


def build_portfolio_messages(messages: list[ChatMessage], agent: str) -> list[dict[str, str]]:
    sanitized = sanitize_messages(messages)
    return [
        {"role": "system", "content": build_system_prompt(agent)},
        *[{"role": message.role, "content": message.content} for message in sanitized],
    ]


def should_use_market_web_search(agent: str, latest_user_message: str) -> bool:
    return agent == "market" and bool(MARKET_WEB_SEARCH_PATTERN.search(latest_user_message))


def extract_output_text(result: dict) -> str:
    chunks: list[str] = []

    for item in result.get("output", []):
        if item.get("type") != "message":
            continue

        for content_item in item.get("content", []):
            if content_item.get("type") == "output_text":
                text = (content_item.get("text") or "").strip()
                if text:
                    chunks.append(text)

    if not chunks:
        raise ValueError("No text content returned from OpenAI Responses API")

    return "\n\n".join(chunks)


async def create_openai_response(
    messages: list[ChatMessage],
    agent: str,
    previous_response_id: str | None = None,
) -> dict[str, str]:
    openai_key = os.getenv("OPENAI_API_KEY")
    if not openai_key:
        raise RuntimeError("OpenAI API key not configured")

    sanitized_messages = sanitize_messages(messages)
    latest_user_message = next(
        (message.content for message in reversed(sanitized_messages) if message.role == "user"),
        "",
    )

    if previous_response_id and latest_user_message:
        input_payload: str | list[dict[str, object]] = latest_user_message
    else:
        input_payload = [
            {
                "role": message.role,
                "content": [{"type": "input_text", "text": message.content}],
            }
            for message in sanitized_messages
        ]

    tools = [{"type": "web_search_preview"}] if should_use_market_web_search(agent, latest_user_message) else []

    async with httpx.AsyncClient(timeout=20.0) as client:
        response = await client.post(
            OPENAI_RESPONSES_API_URL,
            headers={
                "Authorization": f"Bearer {openai_key}",
                "Content-Type": "application/json",
            },
            json={
                "model": os.getenv("OPENAI_MODEL", "gpt-5.4"),
                "instructions": build_system_prompt(agent),
                "input": input_payload,
                "previous_response_id": previous_response_id,
                "reasoning": {"effort": "none"},
                "text": {"format": {"type": "text"}},
                "tool_choice": "auto",
                "tools": tools,
                "store": False,
                "truncation": "auto",
            },
        )

    if response.status_code >= 400:
        detail = response.text
        if previous_response_id and "previous_response_id" in detail.lower():
            return await create_openai_response(messages, agent, None)
        raise RuntimeError(f"OpenAI Responses API error: {response.status_code} - {detail}")

    result = response.json()
    return {
        "response": extract_output_text(result),
        "provider": "openai",
        "responseId": result["id"],
    }


async def create_openrouter_response(messages: list[ChatMessage], agent: str) -> dict[str, str]:
    openrouter_key = os.getenv("OPENROUTER_API_KEY")
    if not openrouter_key:
        raise RuntimeError("OpenRouter API key not configured")

    site_url = (
        os.getenv("NEXT_PUBLIC_SITE_URL")
        or (f"https://{os.getenv('VERCEL_URL')}" if os.getenv("VERCEL_URL") else "http://localhost:3000")
    )

    async with httpx.AsyncClient(timeout=20.0) as client:
        response = await client.post(
            OPENROUTER_API_URL,
            headers={
                "Authorization": f"Bearer {openrouter_key}",
                "HTTP-Referer": site_url,
                "X-Title": os.getenv("NEXT_PUBLIC_SITE_NAME", "Vidya Raut Portfolio"),
                "Content-Type": "application/json",
            },
            json={
                "model": os.getenv("OPENROUTER_MODEL", "openai/gpt-3.5-turbo"),
                "temperature": 0.2,
                "messages": build_portfolio_messages(messages, agent),
            },
        )

    if response.status_code >= 400:
        raise RuntimeError(f"OpenRouter API error: {response.status_code} - {response.text}")

    result = response.json()
    if not result.get("choices"):
        raise RuntimeError("No response from OpenRouter model")

    return {
        "response": result["choices"][0]["message"]["content"],
        "provider": "openrouter",
    }


async def proxy_remote_chat(
    messages: list[ChatMessage],
    agent: str,
    previous_response_id: str | None = None,
) -> dict[str, str]:
    remote_chat_url = get_remote_chat_url()
    if not remote_chat_url:
        raise RuntimeError("Remote chat upstream not configured")

    async with httpx.AsyncClient(timeout=REMOTE_CHAT_TIMEOUT_SECONDS) as client:
        response = await client.post(
            remote_chat_url,
            headers={"Accept": "application/json", "Content-Type": "application/json"},
            json={
                "messages": [{"role": message.role, "content": message.content} for message in messages],
                "agent": agent,
                "previousResponseId": previous_response_id,
            },
        )

    if response.status_code >= 400:
        raise RuntimeError(f"Remote chat upstream error: {response.status_code} - {response.text}")

    payload = response.json()
    if not isinstance(payload, dict) or not payload.get("response"):
        raise RuntimeError("Remote chat upstream returned an invalid payload")

    return {
        "response": str(payload["response"]),
        "provider": "remote",
        "responseId": str(payload["responseId"]) if payload.get("responseId") else None,
    }


async def fetch_remote_health() -> dict | None:
    remote_chat_url = get_remote_chat_url()
    if not remote_chat_url:
        return None

    async with httpx.AsyncClient(timeout=REMOTE_CHAT_TIMEOUT_SECONDS) as client:
        response = await client.get(remote_chat_url, headers={"Accept": "application/json"})

    if response.status_code >= 400:
        raise RuntimeError(f"Remote chat health error: {response.status_code} - {response.text}")

    payload = response.json()
    if not isinstance(payload, dict):
        raise RuntimeError("Remote chat health returned an invalid payload")

    return payload


async def send_chat_message(
    messages: list[ChatMessage],
    agent: str,
    previous_response_id: str | None = None,
) -> dict[str, str]:
    if os.getenv("OPENAI_API_KEY"):
        try:
            return await create_openai_response(messages, agent, previous_response_id)
        except Exception:
            logger.exception("OpenAI Responses API error")
            if not os.getenv("OPENROUTER_API_KEY"):
                raise

    if not os.getenv("OPENROUTER_API_KEY"):
        return await proxy_remote_chat(messages, agent, previous_response_id)

    return await create_openrouter_response(messages, agent)


def get_fallback_response(user_message: str, agent: str = "portfolio") -> str:
    msg = user_message.lower().strip()

    if agent == "market":
        if re.search(r"\b(storage|battery|ess)\b", msg):
            return (
                "Energy storage markets are usually assessed through demand drivers, policy support, "
                "project economics, technology maturity, and grid-use cases."
            )
        if re.search(r"\b(policy|tariff|regulation)\b", msg):
            return (
                "Policy and tariff shifts can affect project viability, market timing, and adoption speed. "
                "Vidya's focus includes policy tracking and competitive intelligence in energy markets."
            )
        return (
            "I can explain energy storage, solar, hydrogen, tariffs, and market-analysis concepts. "
            "For live market data or current news, configure an AI provider key for this backend."
        )

    if agent == "opportunity":
        return (
            "Vidya is best suited for energy-market research, analyst support, dashboard reporting, "
            "and projects that need structured sector insight."
        )

    if agent == "puzzle":
        return (
            "Start by isolating the key clue words, then test possible answers against the clue length "
            "and theme. If you paste the exact puzzle text, I can give a hint first and only reveal a "
            "direct answer if you want it."
        )

    if re.search(r"\b(experience|work|job|career|role)\b", msg):
        return (
            "Vidya's recent roles include Market Research Analyst at Customized Energy Solutions, "
            "Laboratory Intern there, Data Analyst there, and Teaching Professional at S.S.V.M. & Jr. College."
        )

    if re.search(r"\b(skill|expertise|competence|strength)\b", msg):
        return (
            "Vidya's documented skills include Advanced Excel, Power BI, market research, data analysis, "
            "battery testing, report writing, laboratory safety, presentation, communication, and mentoring."
        )

    if re.search(r"\b(contact|email|phone|reach|linkedin|location)\b", msg):
        return (
            "You can contact Vidya at vidyaraut17297@gmail.com, on LinkedIn at linkedin.com/in/vidyaraut17, "
            "or by phone at +91 8446495690."
        )

    return (
        "Vidya Raut is an energy and power market analyst focused on turning sector data into concise, "
        "decision-ready insights."
    )


async def build_health_payload() -> dict:
    openai_configured = bool(os.getenv("OPENAI_API_KEY"))
    openrouter_configured = bool(os.getenv("OPENROUTER_API_KEY"))
    remote_upstream = False
    message = "FastAPI backend running in fallback-only mode"
    status = "degraded"

    if openai_configured:
        status = "active"
        message = "FastAPI backend ready with OpenAI Responses API"
    elif openrouter_configured:
        status = "active"
        message = "FastAPI backend ready with OpenRouter fallback"
    else:
        try:
            remote_health = await fetch_remote_health()
            remote_upstream = bool(remote_health and remote_health.get("status") == "active")
            if remote_upstream:
                status = "active"
                message = "FastAPI backend proxying to remote chat upstream"
        except Exception:
            logger.exception("FastAPI remote upstream health check failed")

    return {
        "status": status,
        "message": message,
        "providers": {
            "openai": openai_configured,
            "openrouter": openrouter_configured,
            "remote": remote_upstream,
        },
        "timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
        "backend": "fastapi",
    }


def verify_internal_token(x_internal_token: str | None = Header(default=None)) -> None:
    expected = os.getenv("FASTAPI_INTERNAL_TOKEN", "").strip()
    if expected and x_internal_token != expected:
        raise HTTPException(status_code=401, detail="Unauthorized")


@app.get("/")
async def root() -> dict:
    return {"service": "vidyaraut-fastapi", **await build_health_payload()}


@app.get("/health")
async def health() -> dict:
    return await build_health_payload()


@app.post("/chat")
async def chat(
    payload: ChatRequest,
    request: Request,
    _: None = Depends(verify_internal_token),
) -> JSONResponse:
    client_ip = get_client_ip(request)
    if not check_rate_limit(client_ip):
        raise HTTPException(status_code=429, detail="Rate limit exceeded. Please try again later.")

    sanitized_messages = sanitize_messages(payload.messages)
    if not sanitized_messages:
        raise HTTPException(status_code=400, detail="At least one valid chat message is required")

    last_user_message = sanitized_messages[-1].content

    try:
        result = await send_chat_message(
            sanitized_messages,
            payload.agent,
            payload.previousResponseId,
        )
        result["backend"] = "fastapi"
        return JSONResponse(result)
    except RuntimeError as error:
        logger.warning("FastAPI chat backend fallback: %s", error)
        return JSONResponse(
            {
                "response": get_fallback_response(last_user_message, payload.agent),
                "fallback": True,
                "backend": "fastapi",
            }
        )
    except Exception:
        logger.exception("FastAPI chat backend error")
        return JSONResponse(
            {
                "response": get_fallback_response(last_user_message, payload.agent),
                "fallback": True,
                "backend": "fastapi",
            }
        )
