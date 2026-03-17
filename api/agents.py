import hmac
import os
from typing import Literal

from fastapi import FastAPI, Header, HTTPException
from pydantic import BaseModel, Field

try:
    from openrouter import OpenRouter
except Exception:  # pragma: no cover - allows syntax checks without deps installed
    OpenRouter = None


AgentName = Literal["screening", "documents", "deadlines", "strategy"]


class ChatMessage(BaseModel):
    role: Literal["user", "assistant"]
    content: str = Field(min_length=1, max_length=3000)


class AgentChatRequest(BaseModel):
    messages: list[ChatMessage] = Field(min_length=1, max_length=16)
    agent: AgentName | None = None


class AgentCard(BaseModel):
    key: AgentName
    title: str
    description: str
    system_prompt: str


AGENT_CATALOG: dict[AgentName, AgentCard] = {
    "screening": AgentCard(
        key="screening",
        title="Intake Clerk",
        description="Best for first-step questions, consultation prep, and identifying what kind of matter is involved.",
        system_prompt="Act like an experienced intake clerk. Focus on matter spotting, first-step recommendations, consultation readiness, and clarifying what the attorney needs first.",
    ),
    "documents": AgentCard(
        key="documents",
        title="Document Counsel",
        description="Best for evidence checklists, translations, USCIS notices, and organizing filing materials.",
        system_prompt="Act like a lawyer focused on evidence and filings. Focus on evidence checklists, translations, USCIS notices, filing materials, and how to organize a clean case file.",
    ),
    "deadlines": AgentCard(
        key="deadlines",
        title="Hearing Clerk",
        description="Best for court dates, removal issues, detention, interview notices, and urgent deadlines.",
        system_prompt="Act like a court-focused clerk. Focus on court dates, RFEs, removal risk, detention, interview notices, and any time-sensitive action items.",
    ),
    "strategy": AgentCard(
        key="strategy",
        title="Lead Counsel",
        description="Best for visa options, green card pathways, humanitarian relief, and citizenship questions.",
        system_prompt="Act like lead counsel. Focus on pathway-level educational guidance for visas, green cards, humanitarian relief, work authorization, and citizenship.",
    ),
}

BENCH_REVIEWER = {
    "title": "Bench Review",
    "description": "A final safety and clarity pass that checks whether the draft is cautious, clear, and appropriate for a law-firm website.",
}

FALLBACK_RESPONSES: dict[AgentName, dict[str, object]] = {
    "screening": {
        "content": (
            "I can help you identify the type of immigration matter involved, the likely next step, "
            "and what information the attorney will need for a consultation.\n\n"
            "• Share your current status, your goal, and any deadline or interview notice.\n"
            "• Do not send passport numbers, A-numbers, Social Security numbers, or payment details.\n"
            "• If a hearing, detention, or removal issue is involved, request an urgent consultation."
        ),
        "suggestions": [
            "What information should I bring to a consultation?",
            "How do I know if my issue is urgent?",
            "What case types do you handle?",
        ],
        "action": {"label": "Request Case Review", "link": "/#contact"},
    },
    "documents": {
        "content": (
            "For most immigration matters, document preparation is one of the biggest drivers of case quality.\n\n"
            "• Start with identity documents, prior notices, and any prior applications or denials.\n"
            "• Include certified translations when a document is not in English.\n"
            "• Bring copies of interview notices, RFEs, court paperwork, and receipts if you have them."
        ),
        "suggestions": [
            "What if my documents are not in English?",
            "Do I need originals or copies?",
            "Which prior USCIS notices matter most?",
        ],
        "action": {"label": "Prepare Documents", "link": "/#contact"},
    },
    "deadlines": {
        "content": (
            "If your matter involves a hearing date, removal issue, detention, arrest, or a government deadline, "
            "timing matters.\n\n"
            "• Do not rely on general website content alone for urgent matters.\n"
            "• Gather every notice, charging document, RFE, or interview letter you have.\n"
            "• Request an urgent consultation so the attorney can assess deadlines and available options."
        ),
        "suggestions": [
            "I have an immigration court date",
            "I received a deadline from USCIS",
            "I have an interview notice next week",
        ],
        "action": {"label": "Urgent Consultation", "link": "/#contact"},
    },
    "strategy": {
        "content": (
            "I can help explain common immigration pathways and what issues typically affect strategy.\n\n"
            "• Ask about visas, family-based immigration, humanitarian relief, work authorization, or citizenship.\n"
            "• I can provide general educational information, not legal advice.\n"
            "• If your situation is complex, fact-specific, or time-sensitive, the next step should be a consultation."
        ),
        "suggestions": [
            "What options might fit my situation?",
            "How do consultations work?",
            "What affects filing strategy most?",
        ],
        "action": {"label": "Book Strategy Consult", "link": "/#contact"},
    },
}


app = FastAPI(
    title="M&T Immigration Agents API",
    version="1.0.0",
    description="FastAPI-based specialist agents for immigration intake and triage.",
)


def get_agent_shared_secret() -> str:
    return os.environ.get("FASTAPI_AGENT_SHARED_SECRET", "").strip()


def require_agent_secret(provided_secret: str | None) -> None:
    expected_secret = get_agent_shared_secret()
    if not expected_secret:
        raise HTTPException(
            status_code=503,
            detail="Agents service unavailable: shared secret not configured.",
        )

    if not provided_secret or not hmac.compare_digest(provided_secret, expected_secret):
        raise HTTPException(status_code=401, detail="Unauthorized agent request.")


def get_public_agent_catalog() -> list[dict[str, str]]:
    return [
        {
            "key": card.key,
            "title": card.title,
            "description": card.description,
        }
        for card in AGENT_CATALOG.values()
    ]


def get_openrouter_client():
    api_key = os.environ.get("OPENROUTER_API_KEY", "").strip()
    if not api_key or OpenRouter is None:
        return None
    return OpenRouter(
        api_key=api_key,
        http_referer=os.environ.get("OPENROUTER_SITE_URL", "").strip() or None,
        x_title=os.environ.get("OPENROUTER_APP_NAME", "").strip() or None,
        server_url=os.environ.get("OPENROUTER_BASE_URL", "").strip() or None,
    )


def is_chat_ready() -> bool:
    return bool(
        os.environ.get("OPENROUTER_API_KEY", "").strip()
        and get_agent_shared_secret()
        and OpenRouter is not None
    )


def get_model() -> str:
    return os.environ.get("OPENROUTER_MODEL", "").strip() or "openai/gpt-4.1-mini"


def get_reasoning_effort() -> str:
    value = (
        os.environ.get("OPENROUTER_REASONING_EFFORT", "").strip().lower()
        or os.environ.get("OPENAI_REASONING_EFFORT", "low").strip().lower()
    )
    if value in {"none", "minimal", "low", "medium", "high", "xhigh"}:
        return value
    return "low"


def pick_agent(message: str, preferred: AgentName | None) -> AgentName:
    if preferred is not None:
        return preferred

    lowered = message.lower()

    if any(
        keyword in lowered
        for keyword in (
            "court",
            "removal",
            "deport",
            "deadline",
            "detained",
            "detention",
            "hearing",
            "urgent",
            "arrest",
            "judge",
            "interview",
        )
    ):
        return "deadlines"

    if any(
        keyword in lowered
        for keyword in (
            "document",
            "evidence",
            "passport",
            "receipt",
            "translation",
            "birth certificate",
            "marriage certificate",
            "rfe",
            "notice",
            "affidavit",
            "supporting documents",
        )
    ):
        return "documents"

    if any(
        keyword in lowered
        for keyword in (
            "visa",
            "green card",
            "citizenship",
            "asylum",
            "h1b",
            "h-1b",
            "f1",
            "f-1",
            "marriage",
            "work permit",
            "status",
            "pathway",
            "option",
            "eligible",
        )
    ):
        return "strategy"

    return "screening"


def build_instructions(agent_key: AgentName) -> str:
    shared = (
        "You are an AI assistant for a solo U.S. immigration law practice. "
        "Provide general educational information only. Do not claim to be a lawyer, "
        "do not give legal advice, and do not promise outcomes. Keep replies concise, "
        "practical, and appropriate for a law-firm website. Do not ask for highly sensitive "
        "identifiers such as Social Security numbers, A-numbers, passport numbers, or payment details. "
        "If the matter sounds urgent, tell the user to request a consultation immediately."
    )

    agent_card = AGENT_CATALOG[agent_key]
    return (
        f"{shared}\n\n"
        f"Active specialist: {agent_card.title}.\n"
        f"{agent_card.system_prompt}\n\n"
        "Format replies in short paragraphs and bullets when useful. End with one concrete next step."
    )


def fallback_payload(agent_key: AgentName) -> dict[str, object]:
    agent_card = AGENT_CATALOG[agent_key]
    return {
        **FALLBACK_RESPONSES[agent_key],
        "agent": agent_key,
        "agentTitle": agent_card.title,
        "agentDescription": agent_card.description,
        "reviewedBy": BENCH_REVIEWER["title"],
        "source": "fallback",
        "degraded": True,
    }


def build_bench_review_instructions(agent_key: AgentName) -> str:
    agent_card = AGENT_CATALOG[agent_key]
    return (
        "You are the final bench reviewer for a solo U.S. immigration law practice website.\n\n"
        f"You are reviewing a draft prepared by {agent_card.title}.\n"
        "Keep the answer cautious, clear, concise, and appropriate for a law-firm website.\n"
        "Do not allow the draft to become legal advice, overpromise outcomes, or omit urgency when deadlines, detention, removal, or court risk are involved.\n"
        "Revise the draft directly and return only the improved final answer.\n"
        f"Final reviewer name: {BENCH_REVIEWER['title']}."
    )


def extract_response_text(response: object) -> str:
    choices = getattr(response, "choices", None) or []
    if not choices:
        return ""

    message = getattr(choices[0], "message", None)
    content = getattr(message, "content", "")

    if isinstance(content, str):
        return content.strip()

    if isinstance(content, list):
        parts: list[str] = []
        for item in content:
            if isinstance(item, str) and item.strip():
                parts.append(item.strip())
                continue

            text = getattr(item, "text", None)
            if isinstance(text, str) and text.strip():
                parts.append(text.strip())
                continue

            if isinstance(item, dict):
                item_text = item.get("text")
                if isinstance(item_text, str) and item_text.strip():
                    parts.append(item_text.strip())

        return "\n".join(parts).strip()

    return ""


def response_model_name(response: object) -> str:
    model = getattr(response, "model", None)
    return model if isinstance(model, str) and model.strip() else get_model()


def success_payload(
    agent_key: AgentName,
    content: str,
    *,
    model: str,
    reviewed_by: str | None = BENCH_REVIEWER["title"],
) -> dict[str, object]:
    fallback = FALLBACK_RESPONSES[agent_key]
    payload: dict[str, object] = {
        "content": content,
        "suggestions": fallback["suggestions"],
        "action": fallback["action"],
        "agent": agent_key,
        "agentTitle": AGENT_CATALOG[agent_key].title,
        "agentDescription": AGENT_CATALOG[agent_key].description,
        "source": "openrouter",
        "degraded": False,
        "model": model,
    }

    if reviewed_by:
        payload["reviewedBy"] = reviewed_by

    return payload


@app.get("/")
def root() -> dict[str, object]:
    return {
        "name": app.title,
        "version": app.version,
        "routes": ["/health", "/catalog", "/chat"],
    }


@app.get("/health")
def health() -> dict[str, object]:
    return {
        "ok": True,
        "configured": bool(os.environ.get("OPENROUTER_API_KEY", "").strip()),
        "agentAuthConfigured": bool(get_agent_shared_secret()),
        "providerAvailable": OpenRouter is not None,
        "ready": is_chat_ready(),
        "model": get_model(),
        "agents": get_public_agent_catalog(),
        "reviewedBy": BENCH_REVIEWER["title"],
    }


@app.get("/catalog")
def catalog() -> dict[str, object]:
    return {
        "agents": get_public_agent_catalog(),
        "reviewedBy": BENCH_REVIEWER["title"],
    }


@app.post("/chat")
def chat(
    payload: AgentChatRequest,
    x_agent_shared_secret: str | None = Header(
        default=None,
        alias="x-agent-shared-secret",
    ),
) -> dict[str, object]:
    require_agent_secret(x_agent_shared_secret)

    latest_user_message = next(
        (message for message in reversed(payload.messages) if message.role == "user"),
        None,
    )

    if latest_user_message is None:
        raise HTTPException(status_code=400, detail="A user message is required.")

    agent_key = pick_agent(latest_user_message.content, payload.agent)
    client = get_openrouter_client()

    if client is None:
        return fallback_payload(agent_key)

    try:
        specialist_response = client.chat.send(
            model=get_model(),
            messages=[
                {"role": "system", "content": build_instructions(agent_key)},
                *[
                    {
                        "role": message.role,
                        "content": message.content,
                    }
                    for message in payload.messages
                ],
            ],
            reasoning={"effort": get_reasoning_effort()},
        )
    except Exception as error:  # pragma: no cover - external API failures
        return {
            **fallback_payload(agent_key),
            "error": str(error),
        }

    draft = extract_response_text(specialist_response)
    if not draft:
        return fallback_payload(agent_key)

    try:
        bench_review = client.chat.send(
            model=get_model(),
            messages=[
                {"role": "system", "content": build_bench_review_instructions(agent_key)},
                {"role": "user", "content": draft},
            ],
            reasoning={"effort": "minimal"},
        )
    except Exception as error:  # pragma: no cover
        return success_payload(
            agent_key,
            draft,
            model=response_model_name(specialist_response),
            reviewed_by=None,
        )

    content = extract_response_text(bench_review) or draft

    return success_payload(
        agent_key,
        content,
        model=response_model_name(bench_review),
    )
