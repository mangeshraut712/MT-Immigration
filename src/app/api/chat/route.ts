import { NextRequest, NextResponse } from "next/server"
import { isAssistantAgentId, type AssistantAgentId } from "@/lib/assistant-agents"
import { getFallbackResponse, sendChatMessage, type ChatMessage } from "@/lib/openrouter"

const rateLimit = new Map<string, { count: number; resetTime: number }>()
const RATE_LIMIT_WINDOW = 60 * 1000
const RATE_LIMIT_MAX_REQUESTS = 10
const FASTAPI_TIMEOUT_MS = 15_000
const REMOTE_CHAT_TIMEOUT_MS = 15_000
const DEFAULT_DEV_CHAT_UPSTREAM_URL = "https://vidyaraut-five.vercel.app/api/chat"

type HealthPayload = {
  status: "active" | "degraded"
  message: string
  providers?: {
    openai: boolean
    openrouter: boolean
  }
  timestamp: string
  backend: "nextjs" | "fastapi" | "remote"
}

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const userLimit = rateLimit.get(ip)

  if (!userLimit || now > userLimit.resetTime) {
    rateLimit.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW })
    return true
  }

  if (userLimit.count >= RATE_LIMIT_MAX_REQUESTS) {
    return false
  }

  userLimit.count++
  return true
}

function getClientIp(request: NextRequest): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip")?.trim() ||
    "unknown"
  )
}

function getFastApiUrl(): string | null {
  const value = process.env.FASTAPI_URL?.trim()
  return value ? value.replace(/\/$/, "") : null
}

function getRemoteChatApiUrl(): string | null {
  const value = process.env.CHAT_UPSTREAM_URL?.trim()

  if (value) {
    return value.replace(/\/$/, "")
  }

  if (process.env.NODE_ENV !== "production") {
    return DEFAULT_DEV_CHAT_UPSTREAM_URL
  }

  return null
}

function getFastApiHeaders(contentType = false): HeadersInit {
  const headers: Record<string, string> = {
    Accept: "application/json",
  }

  if (contentType) {
    headers["Content-Type"] = "application/json"
  }

  if (process.env.FASTAPI_INTERNAL_TOKEN) {
    headers["X-Internal-Token"] = process.env.FASTAPI_INTERNAL_TOKEN
  }

  return headers
}

function hasLocalProviders(): boolean {
  return Boolean(process.env.OPENAI_API_KEY || process.env.OPENROUTER_API_KEY)
}

async function parseProxyResponse(response: Response): Promise<unknown> {
  const contentType = response.headers.get("content-type") || ""

  if (contentType.includes("application/json")) {
    return response.json()
  }

  const text = await response.text()
  return text ? { error: text } : {}
}

async function proxyJsonEndpoint(url: string, timeoutMs: number, init: RequestInit = {}) {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), timeoutMs)

  try {
    const response = await fetch(url, {
      ...init,
      cache: "no-store",
      signal: controller.signal,
    })
    const payload = await parseProxyResponse(response)

    return { response, payload }
  } finally {
    clearTimeout(timeout)
  }
}

async function proxyFastApi(path: string, init: RequestInit = {}) {
  const fastApiUrl = getFastApiUrl()

  if (!fastApiUrl) {
    return null
  }

  return proxyJsonEndpoint(`${fastApiUrl}${path}`, FASTAPI_TIMEOUT_MS, init)
}

async function proxyRemoteChat(init: RequestInit = {}) {
  const remoteChatApiUrl = getRemoteChatApiUrl()

  if (!remoteChatApiUrl) {
    return null
  }

  return proxyJsonEndpoint(remoteChatApiUrl, REMOTE_CHAT_TIMEOUT_MS, {
    ...init,
    headers: {
      Accept: "application/json",
      ...(init.headers ?? {}),
    },
  })
}

function buildLocalHealth(): HealthPayload {
  const openaiConfigured = Boolean(process.env.OPENAI_API_KEY)
  const openrouterConfigured = Boolean(process.env.OPENROUTER_API_KEY)

  return {
    status: openaiConfigured || openrouterConfigured ? "active" : "degraded",
    message: openaiConfigured
      ? "Chat API ready with OpenAI Responses API"
      : openrouterConfigured
        ? "Chat API ready with OpenRouter fallback"
        : "Chat API running in fallback-only mode",
    providers: {
      openai: openaiConfigured,
      openrouter: openrouterConfigured,
    },
    timestamp: new Date().toISOString(),
    backend: "nextjs",
  }
}

function sanitizeMessages(messages: unknown): ChatMessage[] {
  if (!Array.isArray(messages)) {
    return []
  }

  return messages.filter(
    (message): message is ChatMessage =>
      Boolean(message) &&
      typeof message === "object" &&
      "role" in message &&
      "content" in message &&
      (message.role === "user" || message.role === "assistant") &&
      typeof message.content === "string"
  )
}

export async function POST(request: NextRequest) {
  const ip = getClientIp(request)

  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { error: "Rate limit exceeded. Please try again later." },
      { status: 429 }
    )
  }

  let lastUserMessage = ""
  let activeAgent: AssistantAgentId = "portfolio"

  try {
    const { messages, agent, previousResponseId } = await request.json()

    if (typeof agent === "string" && isAssistantAgentId(agent)) {
      activeAgent = agent
    }

    const sanitizedMessages = sanitizeMessages(messages)

    if (sanitizedMessages.length === 0) {
      return NextResponse.json(
        { error: "At least one valid chat message is required" },
        { status: 400 }
      )
    }

    lastUserMessage = sanitizedMessages.at(-1)?.content || ""

    const proxyBody = {
      messages: sanitizedMessages,
      agent: activeAgent,
      previousResponseId:
        typeof previousResponseId === "string" ? previousResponseId : undefined,
    }

    if (getFastApiUrl()) {
      try {
        const proxied = await proxyFastApi("/chat", {
          method: "POST",
          headers: getFastApiHeaders(true),
          body: JSON.stringify(proxyBody),
        })

        if (proxied?.response.ok) {
          return NextResponse.json(proxied.payload, { status: proxied.response.status })
        }

        if (proxied) {
          console.error("FastAPI chat proxy error:", proxied.payload)
        }
      } catch (error) {
        console.error("FastAPI chat proxy request failed:", error)
      }
    }

    if (!hasLocalProviders()) {
      try {
        const proxied = await proxyRemoteChat({
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(proxyBody),
        })

        if (proxied?.response.ok) {
          const payload =
            typeof proxied.payload === "object" && proxied.payload
              ? { ...(proxied.payload as Record<string, unknown>), backend: "remote" }
              : { response: proxied.payload, backend: "remote" }

          return NextResponse.json(payload, { status: proxied.response.status })
        }

        if (proxied) {
          console.error("Remote chat proxy error:", proxied.payload)
        }
      } catch (error) {
        console.error("Remote chat proxy request failed:", error)
      }
    }

    const result = await sendChatMessage(proxyBody)

    return NextResponse.json({
      response: result.content,
      provider: result.provider,
      responseId: result.responseId,
      backend: "nextjs",
    })
  } catch (error) {
    console.error("Chat API error:", error)

    return NextResponse.json({
      response: getFallbackResponse(lastUserMessage, activeAgent),
      fallback: true,
      backend: "nextjs",
    })
  }
}

export async function GET() {
  if (getFastApiUrl()) {
    try {
      const proxied = await proxyFastApi("/health", {
        method: "GET",
        headers: getFastApiHeaders(),
      })

      if (proxied?.response.ok && typeof proxied.payload === "object" && proxied.payload) {
        return NextResponse.json({
          ...(proxied.payload as Record<string, unknown>),
          backend: "fastapi",
        })
      }

      if (proxied) {
        console.error("FastAPI health proxy error:", proxied.payload)
      }
    } catch (error) {
      console.error("FastAPI health proxy request failed:", error)
    }
  }

  if (!hasLocalProviders()) {
    try {
      const proxied = await proxyRemoteChat({
        method: "GET",
      })

      if (proxied?.response.ok && typeof proxied.payload === "object" && proxied.payload) {
        return NextResponse.json({
          ...(proxied.payload as Record<string, unknown>),
          backend: "remote",
        })
      }

      if (proxied) {
        console.error("Remote health proxy error:", proxied.payload)
      }
    } catch (error) {
      console.error("Remote health proxy request failed:", error)
    }
  }

  return NextResponse.json(buildLocalHealth())
}
