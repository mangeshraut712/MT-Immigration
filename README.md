# M&T Immigration Law Firm Website

A boutique immigration law-firm website built with **Next.js 16**, **React 19**, and a restrained monochrome design system with direct-attorney positioning, server-side AI intake, OpenRouter-backed specialist agents, and a branded stress-relief puzzle page.

[![Next.js](https://img.shields.io/badge/Next.js-16.1.6-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2.1-blue?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8?logo=tailwindcss)](https://tailwindcss.com/)

## Quick Start

```bash
git clone https://github.com/mangeshraut712/MT-Immigration.git
cd MT-Immigration
npm install
cp .env.example .env.local
npm run check:ai-config
npm run dev
```

Use `USE_FASTAPI_AGENTS=false` for the default local setup. The FastAPI path is optional and should only be enabled when you are running the Python service separately or using a same-project Vercel deployment.

## 🚀 Key Features

### 🧠 **Server-Side AI Intake**
- **Next.js chat route**: The website chat runs through a server-side `/api/chat` route instead of a client-exposed model key.
- **FastAPI specialist agents**: Python-powered agents handle screening, documents, deadlines, and strategy through `api/agents.py`.
- **OpenRouter SDK integration**: The FastAPI agents use the official OpenRouter Python SDK with server-side environment variables only.
- **Fallback safety**: The site still works without a live model key, using curated immigration responses for common matters.
- **Legal guardrails**: Responses stay informational, avoid legal-advice claims, and escalate urgent matters toward consultation.

### ⚖️ **Boutique Firm Positioning**
- **Solo-practice framing**: Copy and layout emphasize direct attorney access, disciplined intake, and transparent fees.
- **Legal content cleanup**: Replaced unverifiable testimonials/metrics with standards-based trust language and clearer disclaimers.
- **Shared brand system**: The site uses a centralized logo asset and reusable `SiteLogo` component for consistent branding.

### 🎮 **Brief Break Puzzle Page**
- **Law-themed game**: `/brief-break` adds a branded “Docket Zip” puzzle for playful, short stress relief.
- **On-theme design**: The page keeps the same typography, motion style, spacing, and monochrome palette as the main site.
- **Daily challenge feel**: Includes a docket ID, timer, streak tracking, hints, reset/undo controls, and share-ready result copy.

### 🔒 **Security, Intake, and Reliability**
- **Validated intake API**: Consultation requests go through a server-side intake route with schema validation and rate limiting.
- **Security headers**: Vercel headers are configured in `vercel.json`.
- **Production-safe telemetry behavior**: Analytics and Speed Insights only mount on real Vercel deployments.
- **Secret scanning**: CI includes a committed-secret scan before lint/build.

### ⚡ **Architecture**
- **Next.js App Router** with React Server Components
- **FastAPI serverless function** for optional specialist agents on Vercel
- **Typed validation** with Zod on the Next.js side and Pydantic on the FastAPI side
- **Project organization** split into `config`, `content`, `server`, `components`, and `app`

---

## 🛠️ Tech Stack

| Category | Technology | Version |
|----------|------------|---------|
| **Framework** | Next.js (Turbo) | 16.1.6 |
| **Core** | React | 19.2.1 |
| **Language** | TypeScript | 5.x |
| **Styling** | Tailwind CSS | 3.4+ |
| **UI Library** | Shadcn/UI | Latest |
| **Motion** | Framer Motion | 12.x |
| **Icons** | Lucide React | 0.556 |
| **Toast** | Sonner | 2.0 |
| **Forms** | React Hook Form + Zod | Latest |
| **AI Provider** | OpenRouter (OpenAI-compatible API) | Latest |
| **Optional Python Backend** | FastAPI + Uvicorn | Latest |

---

## 📁 Project Structure

```bash
api/
└── agents.py                # FastAPI specialist-agents backend for Vercel Python functions
public/
└── brand/
    └── mtlogo.png           # Canonical brand logo asset used across the site
src/
├── app/                      # Next.js App Router
│   ├── layout.tsx            # Root layout with providers
│   ├── page.tsx              # Homepage composition
│   ├── globals.css           # Tailwind & CSS Variables
│   ├── providers.tsx         # Theme and other providers
│   ├── api/                  # Next.js route handlers
│   ├── brief-break/          # Stress-relief puzzle page
│   ├── robots.ts             # SEO robots configuration
│   └── sitemap.ts            # SEO sitemap generation
├── components/
│   ├── branding/             # Shared branding primitives (logo, marks)
│   ├── features/             # Complex interactive modules
│   │   ├── chatbot/          # AI assistant with specialist routing
│   │   ├── game/             # Brief Break puzzle experience
│   │   └── intake/           # Multi-step intake form
│   ├── layout/               # Structural components
│   │   ├── Navbar.tsx        # Navigation with scroll effects
│   │   ├── Footer.tsx        # Footer with links
│   │   └── BackToTop.tsx     # Scroll to top button
│   ├── sections/             # Landing page sections
│   │   ├── HeroSection.tsx   # Hero with floating elements
│   │   ├── StatsSection.tsx  # Animated counters
│   │   ├── ServicesSection.tsx # Service cards with dialogs
│   │   └── ...               # Other sections
│   └── ui/                   # Shadcn/UI atoms
│       ├── button.tsx
│       ├── loading.tsx       # Loading states
│       ├── scroll-progress.tsx # Reading progress
│       └── ...
├── config/
│   ├── firm.ts               # Firm identity, contact details, and brand asset paths
│   └── site.ts               # Site metadata and canonical URL helpers
├── content/
│   ├── chatAgents.ts         # Shared agent catalog for UI + server
│   └── legalKnowledgeBase.ts # Immigration copy and fallback chatbot knowledge base
├── lib/
    ├── utils.ts              # cn() helper
    ├── hooks.ts              # Custom React hooks
    └── animations.ts         # Framer Motion variants
└── server/
    ├── ai/                   # Server-only AI helpers
    ├── schemas/              # Shared request validation schemas
    └── rate-limit.ts         # In-memory route throttling
```

---

## 🚦 Getting Started

### Prerequisites

- Node.js 20 LTS recommended
- npm
- Python 3.10+ only if you plan to run the optional FastAPI agents locally
- Vercel CLI optional if you want local parity with the Python function route via `vercel dev`

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/mangeshraut712/MT-Immigration.git
    cd MT-Immigration
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Create your local environment file:**
    ```bash
    cp .env.example .env.local
    ```

    Required values:
    - `OPENROUTER_API_KEY`: server-side key for the default direct AI path
    - `OPENROUTER_MODEL`: OpenRouter model slug, defaults to `openai/gpt-4.1-mini`

    Optional values:
    - `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN`: required in production for shared API rate limiting across serverless instances
    - `INTAKE_WEBHOOK_URL`: webhook target for validated intake submissions (required in production if you want the intake form to accept and forward submissions)
    - `USE_FASTAPI_AGENTS`: defaults to `false` for local `npm run dev`; set to `true` only when the FastAPI agents service is reachable
    - `FASTAPI_AGENT_BASE_URL`: required for local FastAPI development; leave blank only on Vercel if the Python function is deployed in the same project
    - `FASTAPI_AGENT_SHARED_SECRET`: required only when `USE_FASTAPI_AGENTS=true`
    - `OPENROUTER_BASE_URL`: defaults to `https://openrouter.ai/api/v1`
    - `OPENROUTER_APP_NAME`: optional attribution title sent to OpenRouter
    - `OPENROUTER_SITE_URL`: optional attribution URL sent to OpenRouter
    - `OPENAI_API_KEY` and `OPENAI_MODEL`: optional direct OpenAI fallback for the Next.js chat route when FastAPI agents are disabled or not used
    - `AI_BENCH_REVIEW_ENABLED`: optional override for the second AI review pass; defaults to off locally and on in production

    Do not expose provider keys in `NEXT_PUBLIC_*` variables.

4.  **Run the development server:**
    ```bash
    npm run dev
    ```

    Open [http://localhost:3000](http://localhost:3000) with your browser.

### Build for Production

```bash
npm run build
npm start
```

---

## 🧪 Developer Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with Turbopack |
| `npm run build` | Create optimized production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint across the repo |
| `npm run typecheck` | Run TypeScript without emitting files |
| `npm run verify` | Run lint, typecheck, and production build together |
| `npm run check:ai-config` | Validate env assumptions before running or deploying |
| `npm run smoke:release` | Probe the built app’s critical routes against a running server |

`npm run check:ai-config` is a preflight check only. It verifies env wiring, not downstream provider access, webhook readiness, or full deploy health.

---

## 📱 Page Sections

1.  **Hero Section**: High-impact positioning for a solo-practice immigration firm.
2.  **Stats**: Practice highlights focused on process, security, and client experience.
3.  **Process**: Visual timeline of the client journey.
4.  **Services**: Interactive cards with modal details for each practice area.
5.  **Why Us**: Value proposition with boutique-practice framing.
6.  **Client Experience**: Standards-based trust section instead of unverifiable testimonials.
7.  **About**: Attorney-led practice story and credentials framing.
8.  **Pricing**: Transparent fee ranges and payment-plan messaging.
9.  **FAQ**: Accordion-style Q&A.
10. **CTA Banner**: Final consultation call to action.
11. **Contact**: Multi-step intake form with validated submission flow.
12. **Brief Break**: A separate puzzle page for stress relief and playful brand interaction.

---

## 🎯 Recent Improvements

- ✅ Moved AI chat behind server-side routes with OpenRouter-backed specialist agents
- ✅ Added optional FastAPI specialist agents for intake and triage
- ✅ Added shared legal-team roles: Intake Clerk, Document Counsel, Hearing Clerk, Lead Counsel, and Bench Review
- ✅ Added privacy and terms pages
- ✅ Added a reusable shared logo component with a single canonical brand asset
- ✅ Reorganized the codebase into clearer `config`, `content`, and `server` folders
- ✅ Added the `/brief-break` law-themed puzzle page and homepage teaser section
- ✅ Cleaned up stale placeholder assets and unused barrel files
- ✅ Verified lint, build, Python syntax, and audit status

---

## 🚀 Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import project in Vercel Dashboard
3. Auto-detected as Next.js - click Deploy

The `vercel.json` includes security headers and caching configuration.

This project can also deploy a Vercel Python function for the FastAPI agents backend alongside the Next.js app.

### Deploy Modes

Use one of these two production modes:

1. Direct Next.js AI path
   - `USE_FASTAPI_AGENTS=false`
   - `OPENROUTER_API_KEY` or `OPENAI_API_KEY`
2. Same-project FastAPI agents path
   - `USE_FASTAPI_AGENTS=true`
   - `OPENROUTER_API_KEY`
   - `FASTAPI_AGENT_SHARED_SECRET`
   - Leave `FASTAPI_AGENT_BASE_URL` blank on Vercel when the Python function is deployed in the same project

### Required Vercel Environment Variables

| Area | Variables |
|------|-----------|
| Minimum site | `NEXT_PUBLIC_SITE_URL` |
| Direct AI chat | `OPENROUTER_API_KEY` and optional `OPENROUTER_MODEL`, or `OPENAI_API_KEY` and optional `OPENAI_MODEL` |
| Intake forwarding | `INTAKE_WEBHOOK_URL` |
| Shared rate limiting | `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN` |
| FastAPI agents | `USE_FASTAPI_AGENTS=true`, `OPENROUTER_API_KEY`, `FASTAPI_AGENT_SHARED_SECRET` |
| External FastAPI agents | `FASTAPI_AGENT_BASE_URL` only when FastAPI is deployed outside the same Vercel project |
| Optional AI behavior | `AI_BENCH_REVIEW_ENABLED`, `OPENROUTER_BASE_URL`, `OPENROUTER_APP_NAME`, `OPENROUTER_SITE_URL`, `OPENROUTER_REASONING_EFFORT` |

## 🔐 Secret Handling

- The FastAPI agents backend calls OpenRouter using `OPENROUTER_API_KEY`.
- FastAPI chat requests require `FASTAPI_AGENT_SHARED_SECRET` and a matching `x-agent-shared-secret` header from the trusted caller.
- The Python dependency for the agents service is the official `openrouter` SDK.
- Intake submissions go through a validated server route with shared rate limiting and must be wired to `INTAKE_WEBHOOK_URL` in production.
- The repo includes a FastAPI agents service in [api/agents.py](./api/agents.py) that reads OpenRouter environment variables from Vercel.
- If an OpenRouter key was previously exposed anywhere outside this working tree, revoke it in the provider dashboard and remove it from GitHub, Vercel, and any local shell history.
- CI now runs a committed-secret scan to catch future leaks earlier.

## 🤖 FastAPI Agents

- `api/agents.py` exposes a FastAPI-based specialist agent backend with these routes:
  - `GET /api/agents/health`
  - `GET /api/agents/catalog`
  - `POST /api/agents/chat`
- The agent roles are:
  - `screening` -> Intake Clerk
  - `documents` -> Document Counsel
  - `deadlines` -> Hearing Clerk
  - `strategy` -> Lead Counsel
- Responses can include a final `Bench Review` pass and fallback safely when no valid provider response is available.
- The current Next.js chat route can proxy to that FastAPI service when `USE_FASTAPI_AGENTS=true`.
- If `FASTAPI_AGENT_BASE_URL` is unset, the Next route assumes the FastAPI service is deployed in the same Vercel project at `/api/agents`.
- Under plain local `npm run dev`, leave `USE_FASTAPI_AGENTS=false` unless you are running FastAPI separately and set `FASTAPI_AGENT_BASE_URL`.
- The `POST /api/agents/chat` route rejects requests unless `x-agent-shared-secret` matches `FASTAPI_AGENT_SHARED_SECRET`.
- The FastAPI service is configured through the OpenRouter SDK and can send optional attribution headers (`HTTP-Referer` and `X-Title`) when configured.
- Public metadata routes expose only non-sensitive catalog metadata (no system prompts or provider/model internals).

### Local FastAPI run

```bash
python3 -m venv .venv
. .venv/bin/activate
pip install -r requirements.txt
export OPENROUTER_API_KEY=your_key_here
export OPENROUTER_MODEL=openai/gpt-4.1-mini
export FASTAPI_AGENT_SHARED_SECRET=replace_with_a_long_random_secret
python3 -m uvicorn api.agents:app --reload --port 8000
```

If you want the Next.js chat widget to use the local FastAPI service during development:

```bash
export USE_FASTAPI_AGENTS=true
export FASTAPI_AGENT_BASE_URL=http://127.0.0.1:8000
export OPENROUTER_API_KEY=your_key_here
export OPENROUTER_MODEL=openai/gpt-4.1-mini
export FASTAPI_AGENT_SHARED_SECRET=replace_with_a_long_random_secret
export UPSTASH_REDIS_REST_URL=your_upstash_rest_url
export UPSTASH_REDIS_REST_TOKEN=your_upstash_rest_token
```

### Vercel-Style Local Development

`npm run dev` only starts the Next.js app. It does not emulate the Vercel Python function route. If you want local parity with the same-project `/api/agents/*` deployment model, use:

```bash
vercel dev
```

If you stay on `npm run dev`, keep `USE_FASTAPI_AGENTS=false` unless you are running the FastAPI service separately and setting `FASTAPI_AGENT_BASE_URL`.

## 🧾 Production Checklist

- Replace the placeholder firm contact details in [firm.ts](./src/config/firm.ts) before going live.
- Keep the FastAPI agents backend enabled in production with `USE_FASTAPI_AGENTS=true`.
- Set `OPENROUTER_API_KEY` in your deployment environment instead of hardcoding any provider token.
- Set `OPENROUTER_MODEL` to the OpenRouter model you want the agents to use.
- Set `FASTAPI_AGENT_SHARED_SECRET` in both Next.js and FastAPI environments so internal chat proxy calls are authenticated.
- Set `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` so chat and intake rate limits are shared across production instances.
- Set `INTAKE_WEBHOOK_URL` in production so intake submissions are accepted and forwarded to your CRM or automation tool.
- If FastAPI is deployed separately, set `FASTAPI_AGENT_BASE_URL`.

## ✅ Post-Deploy Verification

Run these checks after GitHub merge and Vercel deploy:

1. Homepage
```bash
curl -I https://your-deployment-url.vercel.app/
```
Expected: `200`

2. Chat readiness
```bash
curl https://your-deployment-url.vercel.app/api/chat
```
Expected: JSON with `ok: true`

3. Chat request
```bash
curl -sS https://your-deployment-url.vercel.app/api/chat \
  -H "Content-Type: application/json" \
  -d '{"messages":[{"role":"user","content":"Hello"}],"agent":"screening"}'
```
Expected: `200` JSON with `content` and `source`

4. Intake readiness
```bash
curl https://your-deployment-url.vercel.app/api/intake
```
Expected: JSON with `ok: true` and `configured: true` before go-live

5. FastAPI agents health
```bash
curl https://your-deployment-url.vercel.app/api/agents/health
```
Expected when FastAPI agents are enabled: JSON with `ready: true` and `agentAuthConfigured: true`

---

## 📄 License

© 2025 M&T Immigration Law Firm. All rights reserved.

**Attorney Advertising**: Prior results do not guarantee a similar outcome.
