# M&T Immigration

Boutique immigration law-firm website built on **Next.js 16.2**, **React 19.2**, **TypeScript 5**, and a server-side AI + intake architecture designed for a modern 2026 deployment stack.

[![Next.js](https://img.shields.io/badge/Next.js-16.2.0-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2.1-149eca?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178c6?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8?logo=tailwindcss)](https://tailwindcss.com/)

## Overview

This repository powers a direct-attorney immigration website with:

- A polished marketing site built with the **App Router**
- A guarded **server-side chat route** with bounded context windows
- A structured **consultation intake flow** with validation, rate limiting, webhook forwarding, and optional confirmation emails
- A **source-backed Knowledge Hub** for immigration news, public decisions, and analysis
- **Server-side payment redirects** instead of raw client-side checkout URLs
- Optional **FastAPI specialist agents** for richer AI routing in production

The current codebase is aligned with the 2026 Next.js / React stack already present in `package.json`, not a speculative future stack.

## What’s Modern Here

- **Next.js 16.2** with Turbopack, `proxy.ts`, improved dev/build timing logs, and App Router conventions
- **React 19.2** runtime with modern rendering semantics and current server/client composition
- **React Compiler** enabled via `reactCompiler: true`
- **OpenAI Responses API** usage for server-side chat and live insights refresh
- **OpenRouter-compatible routing** for production chat provider flexibility
- **Upstash Redis / local fallback model** for shared public-route throttling
- **Structured server-only boundaries** for AI, request guards, payments, and webhook signing

## Core Features

### 1. Attorney-Led Marketing Site

- Solo-practice positioning with direct-attorney framing
- Monochrome premium UI with motion, editorial spacing, and mobile-first layout
- Pricing, FAQ, services, process, contact, and payment sections built as reusable page modules
- **Multilingual Support**: Full i18n with 12 languages including English, Spanish, Urdu, Hindi, Bengali, Punjabi, Arabic, Persian, Tagalog, Chinese, Vietnamese, and Korean
- **Enhanced Animations**: Smooth, performant animations with `prefers-reduced-motion` accessibility support

### 2. AI Chat With Safe Fallbacks

- `/api/chat` keeps model keys off the client
- Request-size checks, origin checks, rate limiting, and bounded transcript windows
- Fallback response path still returns useful guidance when no provider key is configured
- Optional FastAPI proxy mode for specialist agents

### 3. Structured Intake Workflow

- Multi-step intake form with client + server validation
- Signed outbound webhook delivery
- Optional confirmation emails through Resend
- Local and shared rate limiting support

### 4. Knowledge Hub

- Immigration-specific insights page at `/insights`
- Live feed generation with web-backed source gathering when configured
- Public-source snapshot fallback when live refresh is unavailable
- Source-backed article pages instead of generic generated filler
- Duplicate-entry protection in the live feed pipeline

### 5. Safer Payment Handoff

- Payment buttons route through internal `/pay/[method]` redirects
- Server validates configured payment hosts before redirecting
- Hosted checkout stays external to the website itself

### 6. Optional FastAPI Agents

- `api/agents.py` supports specialist agent routing on Vercel Python functions
- Same-project Vercel deployment path is supported
- Separate local FastAPI development path is supported
- Plain `npm run dev` does **not** emulate the Vercel Python route

## Tech Stack

| Area          | Library / Service                             | Version                 |
| ------------- | --------------------------------------------- | ----------------------- |
| Framework     | `next`                                        | `16.2.0`                |
| React         | `react`, `react-dom`                          | `19.2.1`                |
| Language      | `typescript`                                  | `5.x`                   |
| Styling       | `tailwindcss`                                 | `3.4.18`                |
| Motion        | `framer-motion`                               | `12.23.25`              |
| Validation    | `zod`                                         | `4.1.13`                |
| Forms         | `react-hook-form`                             | `7.68.0`                |
| UI primitives | Radix UI packages                             | current pinned versions |
| AI SDK        | `openai`                                      | `6.27.0`                |
| Rate limiting | `@upstash/ratelimit`, `@upstash/redis`        | `2.0.8`, `1.37.0`       |
| Analytics     | `@vercel/analytics`, `@vercel/speed-insights` | `2.0.1`, `2.0.0`        |

## Project Structure

```text
api/
  agents.py                 Optional FastAPI specialist-agent backend

src/
  app/
    api/                    Route handlers for chat, intake, insights, payment redirects
    insights/               Knowledge Hub pages
    brief-break/            Puzzle page
    [locale]/               Locale-based routing for i18n
    layout.tsx              Root layout
    page.tsx                Homepage
    globals.css             Global design tokens and utilities
  i18n/                    Internationalization configuration
    routing.ts             Locale routing definitions
    request.ts             Request locale handling
  messages/                Translation files
    en.json, es.json, ur.json, hi.json, bn.json, pa.json, ar.json, fa.json, tl.json, zh.json, vi.json, ko.json
  lib/
    animations.ts           Animation variants and helpers
  components/
    features/
      chatbot/              Chat widget
      insights/             Knowledge Hub client/article components
      intake/               Intake form
      game/                 Brief Break game
    layout/                 Navbar, footer, scroll helpers
    sections/               Homepage sections
    ui/                     Shared primitives
  config/
    firm.ts                 Firm identity and env-driven contact data
    payments.ts             Payment method config
    site.ts                 Site URL, metadata, canonical helpers
  content/
    legalInsights.ts        Source-backed Knowledge Hub content and fallbacks
    legalKnowledgeBase.ts   Chat fallback content
    chatAgents.ts           Agent catalog
  server/
    ai/                     AI provider helpers and insights generation
    schemas/                Shared Zod schemas
    payments.ts             Server-side payment redirect validation
    request-guards.ts       Origin, content-type, and payload checks
    webhooks.ts             Signed webhook helpers
    intake-email.ts         Optional confirmation-email sender
    rate-limit.ts           Shared/local throttling
```

## Local Development

### Prerequisites

- Node.js 20+ recommended
- npm
- Python 3.10+ only if you plan to run the optional FastAPI service locally

### Quick Start

```bash
git clone https://github.com/mangeshraut712/MT-Immigration.git
cd MT-Immigration
npm install
cp .env.example .env.local
npm run check:ai-config
npm run dev
```

### Default Local Mode

Use local development in **direct Next.js mode**:

```env
USE_FASTAPI_AGENTS=false
```

This is the supported path for plain `npm run dev`.

### Local FastAPI Mode

If you want to run the FastAPI agent service separately:

```bash
python3 -m venv .venv
. .venv/bin/activate
pip install -r requirements.txt
export OPENROUTER_API_KEY=your_key_here
export OPENROUTER_MODEL=openai/gpt-4.1-mini
export FASTAPI_AGENT_SHARED_SECRET=replace_with_a_long_random_secret
python3 -m uvicorn api.agents:app --reload --port 8000
```

Then point Next.js to it:

```env
USE_FASTAPI_AGENTS=true
FASTAPI_AGENT_BASE_URL=http://127.0.0.1:8000
FASTAPI_AGENT_SHARED_SECRET=replace_with_a_long_random_secret
```

If you want same-project local parity for Next + Python functions, use:

```bash
vercel dev
```

## Environment Variables

### Required for Production

- `NEXT_PUBLIC_SITE_URL`
- `UPSTASH_REDIS_REST_URL`
- `UPSTASH_REDIS_REST_TOKEN`

### Internationalization

The site supports 12 languages. Configure default locale:

- `NEXT_PUBLIC_DEFAULT_LOCALE` (default: "en")

### Required for Live AI

Use one provider path:

- `OPENROUTER_API_KEY` with optional `OPENROUTER_MODEL`
- or `OPENAI_API_KEY` with optional `OPENAI_MODEL`

### Required for Intake Forwarding

- `INTAKE_WEBHOOK_URL`

Recommended:

- `INTAKE_WEBHOOK_BEARER_TOKEN`
- or `INTAKE_WEBHOOK_SIGNING_SECRET`

### Optional Email Confirmations

- `RESEND_API_KEY`
- `INTAKE_CONFIRMATION_FROM_EMAIL`
- `INTAKE_CONFIRMATION_REPLY_TO`

### Optional Payment Redirects

- `STRIPE_CHECKOUT_URL`
- `PAYPAL_CHECKOUT_URL`
- `WIRE_TRANSFER_REQUEST_URL`

Optional client readiness flags:

- `NEXT_PUBLIC_STRIPE_CHECKOUT_ENABLED`
- `NEXT_PUBLIC_PAYPAL_CHECKOUT_ENABLED`
- `NEXT_PUBLIC_WIRE_TRANSFER_REQUEST_ENABLED`

### Firm Identity

These should be set before go-live:

- `NEXT_PUBLIC_FIRM_NAME`
- `NEXT_PUBLIC_FIRM_SHORT_NAME`
- `NEXT_PUBLIC_FIRM_PHONE_DISPLAY`
- `NEXT_PUBLIC_FIRM_PHONE_HREF`
- `NEXT_PUBLIC_FIRM_EMAIL`
- `NEXT_PUBLIC_FIRM_EMAIL_HREF`
- `NEXT_PUBLIC_FIRM_CITY`
- `NEXT_PUBLIC_FIRM_REGION_LABEL`
- `NEXT_PUBLIC_FIRM_HOURS`
- `NEXT_PUBLIC_FIRM_RESPONSE_TIME`

## Scripts

| Command                   | Purpose                         |
| ------------------------- | ------------------------------- |
| `npm run dev`             | Start local development server  |
| `npm run build`           | Production build                |
| `npm run start`           | Run production server           |
| `npm run lint`            | ESLint                          |
| `npm run typecheck`       | TypeScript check                |
| `npm run verify`          | Lint + typecheck + build        |
| `npm run check:ai-config` | Preflight env/config validation |
| `npm run smoke:release`   | Quick route-level smoke test    |

## Deployment Modes

### Mode A: Direct Next.js AI Path

- `USE_FASTAPI_AGENTS=false`
- Server-side chat and insights run directly from the Next.js app

### Mode B: Same-Project FastAPI Agents

- `USE_FASTAPI_AGENTS=true`
- `FASTAPI_AGENT_SHARED_SECRET` required
- Leave `FASTAPI_AGENT_BASE_URL` blank on Vercel when `api/agents.py` is deployed in the same project

### Mode C: External FastAPI Agents

- `USE_FASTAPI_AGENTS=true`
- `FASTAPI_AGENT_BASE_URL=https://your-fastapi-service`
- `FASTAPI_AGENT_SHARED_SECRET` required

## Security Model

- AI keys stay server-side
- Intake and chat POST routes reject untrusted origins
- JSON content type and request-size checks are enforced
- Public routes are rate-limited
- Intake webhook delivery can be bearer-authenticated and/or HMAC-signed
- Payment redirects are validated server-side
- Placeholder AI secrets are ignored instead of treated as valid

## Production Checklist

- Replace placeholder firm contact values with real production details
- Configure real AI provider credentials if you want live AI instead of fallback mode
- Configure `INTAKE_WEBHOOK_URL` before opening intake publicly
- Configure shared Upstash rate limiting in production
- Configure payment redirect URLs before enabling hosted checkout buttons
- Configure Resend if confirmation emails are required
- If using FastAPI agents, set both `USE_FASTAPI_AGENTS=true` and `FASTAPI_AGENT_SHARED_SECRET`

## Verification

Before release:

```bash
npm run check:ai-config
npm run verify
npm run smoke:release -- http://127.0.0.1:3000
```

Typical expected results:

- `/` returns `200`
- `/api/chat` returns readiness JSON
- `/api/chat` POST returns a response payload
- `/api/intake` returns readiness JSON
- `/insights` renders a source-backed Knowledge Hub page

## Notes

- Local development can run cleanly with no AI key configured; chat and insights will use built-in fallback paths.
- The Knowledge Hub is now designed to prefer public-source, source-linked entries over generic generated filler.
- Plain `npm run dev` should keep `USE_FASTAPI_AGENTS=false` unless you are explicitly running FastAPI separately.

## Recent Updates

### Multilingual Support
The website now supports 12 languages to serve diverse client demographics:
- English (en) - Default
- Spanish (es) - US Hispanic population
- Urdu (ur) - Pakistan
- Hindi (hi) - India
- Bengali (bn) - Bangladesh
- Punjabi (pa) - Pakistan/India
- Arabic (ar) - Middle East
- Persian (fa) - Iran
- Tagalog (tl) - Philippines
- Chinese (zh) - China
- Vietnamese (vi) - Vietnam
- Korean (ko) - Korea

### Animation Enhancements
- Added new animation variants: popIn, quickFadeUp, slideInRight, slideInLeft, floatAnimation, pulseGlow, shimmer
- All sections optimized with `useReducedMotion` for accessibility
- Respect users who prefer reduced motion

## License

Copyright © M&T Immigration Law Firm.

Attorney advertising. Prior results do not guarantee a similar outcome.
