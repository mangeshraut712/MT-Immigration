<div align="center">

# M&T Immigration Law Firm

Immigration law firm website with localized pages, legal AI assistants, intake and payment flows, and a security-first Next.js architecture.

[![Next.js](https://img.shields.io/badge/Next.js-16.2-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2-149eca?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178c6?logo=typescript)](https://www.typescriptlang.org/)
[![OpenAI](https://img.shields.io/badge/OpenAI-API-412991?logo=openai)](https://platform.openai.com/)
[![Upstash](https://img.shields.io/badge/Upstash-Redis-7C3AED?logo=redis)](https://upstash.com/)
[![Vercel](https://img.shields.io/badge/Deploy-Vercel-black?logo=vercel)](https://vercel.com/)

[Live Demo](https://mt-immigration.vercel.app/en) · [Production Domain](https://mt-immigration.vercel.app) · [API Reference](https://mt-immigration.vercel.app/openapi.json)

</div>

## Overview

This project is a multilingual law-firm site built around a strong editorial homepage, AI-assisted legal workflows, and modern production hardening. It includes localized content, intake and payment sections, server-side security controls, and a dedicated Python agent API.

## Table of Contents

- [Features](#features)
- [Stack](#stack)
- [Quick Start](#quick-start)
- [Project Structure](#project-structure)
- [Scripts](#scripts)

## Features

- 12 localized languages with shared App Router flow.
- Legal AI assistants for screening, documents, deadlines, and strategy.
- Intake, payments, testimonials, FAQs, and contact sections.
- Security-first request guards, rate limiting, and sanitization.
- PWA support, analytics hooks, and performance-oriented rendering.
- OpenAPI and `llms.txt` routes for machine-readable discovery.

## Stack

- Next.js 16
- React 19
- TypeScript
- next-intl
- Radix UI
- Framer Motion
- OpenAI API
- Upstash Redis
- Jest and Testing Library

## Quick Start

```bash
git clone https://github.com/mangeshraut712/MT-Immigration.git
cd MT-Immigration
npm install
cp .env.example .env.local
npm run check:ai-config
npm run dev
```

Open `http://localhost:3000`.

### Optional agent API

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn api.agents:app --reload --port 8000
```

## Project Structure

```text
.
├── api/                  # FastAPI agent API
├── public/               # Brand assets, PWA files, manifest
├── scripts/              # AI config and release smoke checks
├── src/
│   ├── app/              # App Router pages and routes
│   ├── components/       # Layout, sections, and UI primitives
│   ├── config/           # Site, firm, and payment config
│   ├── content/          # Legal and assistant content
│   ├── i18n/             # Locale routing and runtime UI data
│   ├── lib/              # Utilities, animations, analytics, sanitization
│   └── server/           # Rate limiting, requests, and webhooks
├── requirements.txt      # Python agent dependencies
└── vercel.json           # Deployment config
```

## Scripts

- `npm run dev` - start the site locally.
- `npm run build` - create a production build.
- `npm run lint` - run ESLint.
- `npm run typecheck` - run the TypeScript compiler.
- `npm run test` - run the Jest suite.
- `npm run verify` - lint, typecheck, and build in one pass.
- `npm run check:ai-config` - validate AI-related environment config.
- `npm run smoke:release` - run the release smoke check.
