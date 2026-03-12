# M&T Immigration Law Firm Website

A boutique immigration law-firm website built with **Next.js 16**, **React 19**, and a restrained monochrome design system with direct-attorney positioning, server-side AI intake, and a branded stress-relief puzzle page.

[![Next.js](https://img.shields.io/badge/Next.js-16.1.6-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2.1-blue?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8?logo=tailwindcss)](https://tailwindcss.com/)

## 🚀 Key Features

### 🧠 **Server-Side AI Intake**
- **Next.js chat route**: The website chat runs through a server-side `/api/chat` route instead of a client-exposed model key.
- **FastAPI specialist agents**: Optional Python-powered agents handle screening, documents, deadlines, and strategy through `api/agents.py`.
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
| **Framework** | Next.js (Turbo) | 16.0.8 |
| **Core** | React | 19.2.1 |
| **Language** | TypeScript | 5.x |
| **Styling** | Tailwind CSS | 3.4+ |
| **UI Library** | Shadcn/UI | Latest |
| **Motion** | Framer Motion | 12.x |
| **Icons** | Lucide React | 0.556 |
| **Toast** | Sonner | 2.0 |
| **Forms** | React Hook Form + Zod | Latest |
| **AI API** | OpenAI Responses API | Latest |
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
│   │   ├── chatbot/          # AI Assistant (ChatBot.tsx)
│   │   └── intake/           # Multi-step Intake Form
│   │   └── game/             # Brief Break puzzle experience
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

- Node.js 18+ (Recommended: 20 LTS)
- npm or pnpm

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
    - `OPENAI_API_KEY`: server-side key for the AI assistant
    - `OPENAI_MODEL`: defaults to `gpt-5.4`

    Optional values:
    - `INTAKE_WEBHOOK_URL`: forwards validated intake submissions to your CRM or automation tool
    - `USE_FASTAPI_AGENTS`: set to `true` to proxy the chat route through the FastAPI agents service
    - `FASTAPI_AGENT_BASE_URL`: optional external FastAPI base URL; leave blank on Vercel if the Python function is deployed in the same project

    Do not expose model keys in `NEXT_PUBLIC_*` variables.

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
| `npm run lint` | Check for TypeScript and ESLint errors |

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

- ✅ Moved AI chat behind server-side routes with OpenAI Responses support
- ✅ Added optional FastAPI specialist agents for intake and triage
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

This project can also deploy a Vercel Python function for the optional FastAPI agents backend alongside the Next.js app.

## 🔐 Secret Handling

- The chat assistant now calls the OpenAI Responses API from a server route using `OPENAI_API_KEY`.
- Intake submissions now go through a validated server route with rate limiting.
- The repo now includes a FastAPI agents service in [api/agents.py](./api/agents.py) that reads the same Vercel environment variables as the Next.js app.
- If an OpenRouter key was previously exposed anywhere outside this working tree, revoke it in the provider dashboard and remove it from GitHub, Vercel, and any local shell history.
- CI now runs a committed-secret scan to catch future leaks earlier.

## 🤖 FastAPI Agents

- `api/agents.py` exposes a FastAPI-based specialist agent backend with these routes:
  - `GET /api/agents/health`
  - `GET /api/agents/catalog`
  - `POST /api/agents/chat`
- The current Next.js chat route can proxy to that FastAPI service when `USE_FASTAPI_AGENTS=true`.
- If `FASTAPI_AGENT_BASE_URL` is unset, the Next route assumes the FastAPI service is deployed in the same Vercel project at `/api/agents`.

### Local FastAPI run

```bash
python3 -m venv .venv
. .venv/bin/activate
pip install -r requirements.txt
python3 -m uvicorn api.agents:app --reload --port 8000
```

If you want the Next.js chat widget to use the local FastAPI service during development:

```bash
USE_FASTAPI_AGENTS=true
FASTAPI_AGENT_BASE_URL=http://127.0.0.1:8000
```

## 🧾 Production Checklist

- Replace the placeholder firm contact details in [firm.ts](./src/config/firm.ts) before going live.
- Decide whether the optional FastAPI agents backend should be enabled in production.
- Set `OPENAI_API_KEY` in your deployment environment instead of hardcoding any provider token.
- Set `INTAKE_WEBHOOK_URL` if you want consultation requests forwarded to a CRM or automation tool.
- If you want the Next.js chat route to proxy to FastAPI, set `USE_FASTAPI_AGENTS=true`.
- If FastAPI is deployed separately, set `FASTAPI_AGENT_BASE_URL`.

---

## 📄 License

© 2025 M&T Immigration Law Firm. All rights reserved.

**Attorney Advertising**: Prior results do not guarantee a similar outcome.
