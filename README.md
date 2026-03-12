# Vidya Raut Portfolio

Portfolio website for Vidya Raut built with Next.js 16, React 19, TypeScript, Tailwind CSS, `next-intl`, and an optional FastAPI-backed multi-agent chatbot.

## Overview

This project is a multilingual portfolio with:

- a homepage-driven navigation flow
- dedicated subpages for `skills`, `projects`, and `certifications`
- an inline game section on the homepage below contact
- a multi-agent chatbot for portfolio, market, opportunity, and puzzle-help flows
- optional FastAPI support for chat proxying and backend deployment

## Stack

- Next.js 16 App Router
- React 19
- TypeScript
- Tailwind CSS
- Framer Motion
- `next-intl`
- FastAPI + `httpx` (optional backend)

## Routes

- `/[locale]`
- `/[locale]/skills`
- `/[locale]/projects`
- `/[locale]/certifications`
- `/[locale]/game`
  This redirects to `/{locale}#game`
- `/api/chat`

Supported locales:

- `en`
- `hi`
- `mr`

## Active Project Structure

```text
src/
  app/
    [locale]/
      page.tsx
      skills/page.tsx
      projects/page.tsx
      certifications/page.tsx
      game/page.tsx
    api/chat/route.ts
    globals.css
    layout.tsx
    page.tsx
    providers.tsx
  components/
    AIChatbot.tsx
    Footer.tsx
    Game.tsx
    GlobalLayout.tsx
    Navigation.tsx
    PageBackButton.tsx
    ScrollToTop.tsx
    SectionIntro.tsx
    Timeline.tsx
    ui/
  i18n/
  lib/
    assistant-agents.ts
    collection-utils.ts
    data.ts
    legacy-data.ts
    openrouter.ts
```

## Installation

### Prerequisites

- Node.js 20+
- npm
- Python 3.11+ if you want the FastAPI backend

### Frontend setup

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open:

- `http://localhost:3000/en`

### Optional FastAPI backend

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn fastapi_backend.main:app --reload --port 8000
```

Open:

- `http://127.0.0.1:8000/health`

## Environment Variables

Copy `.env.example` to `.env.local` and set only what you need.

```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SITE_NAME=Vidya Raut Portfolio

OPENAI_API_KEY=
OPENAI_MODEL=gpt-5.4

OPENROUTER_API_KEY=
OPENROUTER_MODEL=openai/gpt-3.5-turbo

FASTAPI_URL=
FASTAPI_INTERNAL_TOKEN=

CHAT_UPSTREAM_URL=
FASTAPI_DEV_REWRITE=
```

### Configuration Notes

- `OPENAI_API_KEY` and `OPENROUTER_API_KEY` are optional.
- `FASTAPI_URL` is optional. If set, the Next.js route proxies to FastAPI first.
- `CHAT_UPSTREAM_URL` is optional. In non-production, both the Next.js route and the FastAPI backend can proxy to an upstream chat API when no local AI keys are configured.
- `FASTAPI_DEV_REWRITE=true` is only for direct local rewrite testing. It is off by default so dev and production behave consistently.

## Chatbot Architecture

Supported agents:

- `portfolio`
- `market`
- `opportunity`
- `puzzle`

### Next.js `/api/chat` resolution order

1. Proxy to `FASTAPI_URL` if configured
2. Use local OpenAI / OpenRouter keys if present
3. In non-production, proxy to `CHAT_UPSTREAM_URL` or the default dev upstream
4. Fall back to deterministic local responses

### FastAPI backend behavior

The optional FastAPI backend:

- mirrors the same four-agent model
- supports OpenAI Responses API
- supports OpenRouter fallback
- supports remote upstream proxying when no local AI keys are configured

## Usage Examples

### Health checks

```bash
curl http://localhost:3000/api/chat
curl http://127.0.0.1:8000/health
```

### Chat request

```bash
curl -X POST http://localhost:3000/api/chat \
  -H "content-type: application/json" \
  --data '{
    "agent": "portfolio",
    "messages": [
      { "role": "user", "content": "Give me a concise summary of Vidya Raut''s profile." }
    ]
  }'
```

### Puzzle helper request

```bash
curl -X POST http://localhost:3000/api/chat \
  -H "content-type: application/json" \
  --data '{
    "agent": "puzzle",
    "messages": [
      { "role": "user", "content": "Give me a hint for this crossword clue: storage market" }
    ]
  }'
```

## Quality Checks

```bash
npm run lint
npm run type-check
npm run build
npm audit --audit-level=moderate
./.venv/bin/python -m py_compile api/index.py fastapi_backend/main.py
```

## Recent Changes

- consolidated the homepage as the primary product surface
- moved the game into the homepage flow below contact
- redirected `/[locale]/game` to `#game`
- improved chatbot shell stability across agent switches
- aligned heading behavior across homepage and subpages
- cleaned the footer layout and removed the footer `Game` link
- added `puzzle` support to the FastAPI backend
- added remote-upstream fallback support to FastAPI health/chat
- removed unused legacy components and generated cache artifacts
- refreshed README to match the current architecture

## Known Limitations

- the crossword iframe depends on a third-party source:
  `https://marathigames.in/Crossword/crossword.html`
- local chat remains fallback-only unless provider keys or a remote upstream are configured
- chat rate limiting is in-memory in both the Next.js route and the FastAPI backend

## Contribution Guidelines

1. Create a feature branch from `main`.
2. Keep changes small and consistent with the existing design system.
3. Run:
   - `npm run lint`
   - `npm run type-check`
   - `npm run build`
4. If you touch the backend, also run:
   - `./.venv/bin/python -m py_compile api/index.py fastapi_backend/main.py`
5. Update docs when behavior, routes, or configuration change.
6. Open a pull request with a concise summary and verification notes.

## Release Checklist

- homepage loads at `/en`
- solid white/light and solid black/dark theme backgrounds remain intact
- chatbot opens, switches agents, and sends messages
- `GET /api/chat` works
- `POST /api/chat` works
- `/[locale]/game` redirects to `#game`
- footer links and CTA are correct
- lint, type-check, build, and audit pass
