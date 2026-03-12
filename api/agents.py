import os
from typing import Literal

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field

try:
    from openai import OpenAI
except Exception:  # pragma: no cover - allows syntax checks without deps installed
    OpenAI = None


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


AGENT_CATALOG: dict[AgentName, AgentCard] = {
    "screening": AgentCard(
        key="screening",
        title="Case Screening Agent",
        description="Handles general intake, matter scoping, and first-step recommendations.",
    ),
    "documents": AgentCard(
        key="documents",
        title="Document Review Agent",
        description="Focuses on evidence checklists, missing documents, translations, and filing prep.",
    ),
    "deadlines": AgentCard(
        key="deadlines",
        title="Urgent Deadline Agent",
        description="Prioritizes removal, court, detention, interview notices, and filing deadlines.",
    ),
    "strategy": AgentCard(
        key="strategy",
        title="Immigration Strategy Agent",
        description="Handles visa, green card, humanitarian, and citizenship pathway questions.",
    ),
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
        "action": {"label": "Request Case Review", "link": "#contact"},
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
        "action": {"label": "Prepare Documents", "link": "#contact"},
    },
    "deadlines": {
        "content": (
            "If your matter involves a hearing date, removal issue, detention, arrest, or a government deadline, "
            "timing matters.\n\n"
            "• Do not rely on general website content alone for urgent matters.\n"
            "• Gather every notice, charging document, or interview letter you have.\n"
            "• Request an urgent consultation so the attorney can assess deadlines and available options."
        ),
        "suggestions": [
            "I have an immigration court date",
            "I received a deadline from USCIS",
            "Someone is detained or at risk of removal",
        ],
        "action": {"label": "Urgent Consultation", "link": "#contact"},
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
        "action": {"label": "Book Strategy Consult", "link": "#contact"},
    },
}


app = FastAPI(
    title="M&T Immigration Agents API",
    version="1.0.0",
    description="FastAPI-based specialist agents for immigration intake and triage.",
)


def get_openai_client():
    api_key = os.environ.get("OPENAI_API_KEY", "").strip()
    if not api_key or OpenAI is None:
        return None
    return OpenAI(api_key=api_key)


def get_model() -> str:
    return os.environ.get("OPENAI_MODEL", "gpt-5.4").strip() or "gpt-5.4"


def get_reasoning_effort() -> str:
    value = os.environ.get("OPENAI_REASONING_EFFORT", "low").strip().lower()
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

    agent_instructions = {
        "screening": (
            "You are the Case Screening Agent. Focus on clarifying the type of matter, the likely next step, "
            "and what the attorney will need to review."
        ),
        "documents": (
            "You are the Document Review Agent. Focus on checklists, missing evidence, translations, and how "
            "to organize filing materials."
        ),
        "deadlines": (
            "You are the Urgent Deadline Agent. Focus on court dates, removal risk, detention, interview notices, "
            "and any time-sensitive filing deadlines."
        ),
        "strategy": (
            "You are the Immigration Strategy Agent. Focus on pathway-level educational guidance for visas, "
            "family-based cases, humanitarian relief, work authorization, and citizenship."
        ),
    }

    return f"{shared}\n\n{agent_instructions[agent_key]}\n\nFormat replies in short paragraphs and bullets when useful. End with one concrete next step."


def fallback_payload(agent_key: AgentName) -> dict[str, object]:
    return {
        **FALLBACK_RESPONSES[agent_key],
        "agent": agent_key,
        "source": "fallback",
    }


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
        "configured": bool(os.environ.get("OPENAI_API_KEY", "").strip()),
        "model": get_model(),
        "agents": list(AGENT_CATALOG),
    }


@app.get("/catalog")
def catalog() -> dict[str, object]:
    return {
        "agents": [card.model_dump() for card in AGENT_CATALOG.values()],
    }


@app.post("/chat")
def chat(payload: AgentChatRequest) -> dict[str, object]:
    latest_user_message = next(
        (message for message in reversed(payload.messages) if message.role == "user"),
        None,
    )

    if latest_user_message is None:
        raise HTTPException(status_code=400, detail="A user message is required.")

    agent_key = pick_agent(latest_user_message.content, payload.agent)
    client = get_openai_client()

    if client is None:
        return fallback_payload(agent_key)

    try:
        response = client.responses.create(
            model=get_model(),
            instructions=build_instructions(agent_key),
            input=[
                {
                    "role": message.role,
                    "content": [{"type": "input_text", "text": message.content}],
                }
                for message in payload.messages
            ],
            max_output_tokens=600,
            reasoning={"effort": get_reasoning_effort()},
            store=False,
        )
    except Exception as error:  # pragma: no cover - external API failures
        return {
            **fallback_payload(agent_key),
            "error": str(error),
        }

    content = (getattr(response, "output_text", "") or "").strip()
    if not content:
        return fallback_payload(agent_key)

    fallback = FALLBACK_RESPONSES[agent_key]
    return {
        "content": content,
        "suggestions": fallback["suggestions"],
        "action": fallback["action"],
        "agent": agent_key,
        "source": "openai",
        "model": getattr(response, "model", get_model()),
    }
