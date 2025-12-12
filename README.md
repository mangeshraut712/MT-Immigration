# M&T Immigration Law Firm Website

A state-of-the-art, AI-powered specialized immigration law firm website built with **Next.js 16**, **React 19**, and a premium "Apple-style" black & white design system.

[![Next.js](https://img.shields.io/badge/Next.js-16.0.8-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2.1-blue?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8?logo=tailwindcss)](https://tailwindcss.com/)

## 🚀 Key Features

### 🧠 **AI Legal Assistant**
- **Specialized Knowledge Base**: Powered by a custom `legalKnowledgeBase.ts` engine that understands specific intents like *B1/B2 Visas*, *Asylum*, *Deportation Defense*, and *Citizenship*.
- **Intent Detection**: Analyzes user messages to accurately map them to legal topics.
- **Actionable Responses**: Provides structured answers with bullet points, bold text, smart suggestion chips, and direct action buttons (e.g., "Book Consultation").
- **Safety First**: Includes clear legal disclaimers and triage for urgent cases.

### 🎨 **Premium "Apple-Style" Design**
- **Aesthetic**: Minimalist monochromatic theme (Black/White/Grayscale) with strategic "Blue" accents (`hsl 211 100% 50%`).
- **Typography**: `Inter` (Sans) for clean UI text and `DM Serif Display` for elegant, trustworthy headings.
- **Animations**: Powered by **Framer Motion**, featuring smooth scroll reveals, stagger effects, and interactive hover states.
- **Floating Decorative Elements**: Subtle animated gradient blobs for visual depth.
- **Trust Indicators**: Highlighted stats and badges for credibility.

### ⚡ **Performance & Architecture**
- **Next.js 16**: Utilizing the latest App Router and React Server Components (RSC).
- **React 19**: Leveraging the newest React features for concurrent rendering.
- **React Compiler**: Enabled for automatic optimizations.
- **Component Architecture**: Highly organized codebase with clear separation of concerns:
  - `components/layout`: Core structural frame (Navbar, Footer, BackToTop).
  - `components/features`: Complex interactive modules (Chatbot, Intake Form).
  - `components/sections`: Marketing landing page sections.
  - `components/ui`: Shadcn/UI component library.
- **Dynamic Loading**: Critical sections and the Chatbot are properly code-split using `next/dynamic` for optimal Core Web Vitals.
- **Custom Hooks Library**: Reusable hooks for localStorage, viewport detection, debouncing, and more.
- **Animation Library**: Centralized Framer Motion variants for consistent animations.

### 📝 **Smart Intake System**
- **Accessibility**: Integrated `aria` labels, keyboard navigation, and semantic HTML5.
- **Multi-step Wizard**: A frictionless "Contact -> Case Details -> Review" flow.
- **Real-time Validation**: Ensures data integrity before submission.
- **Form State Persistence**: Users don't lose progress.

### 🔒 **Security & SEO**
- **Security Headers**: X-Content-Type-Options, X-Frame-Options, X-XSS-Protection via `vercel.json`.
- **Asset Caching**: Optimized cache headers for fonts and images.
- **robots.txt & sitemap.xml**: Auto-generated for search engine crawling.
- **Open Graph & Twitter Cards**: Social media preview optimization.
- **Skip to Content**: Accessibility link for keyboard users.

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

---

## 📁 Project Structure

```bash
src/
├── app/                      # Next.js App Router
│   ├── layout.tsx            # Root layout with providers
│   ├── page.tsx              # Homepage composition
│   ├── globals.css           # Tailwind & CSS Variables
│   ├── providers.tsx         # Theme and other providers
│   ├── robots.ts             # SEO robots configuration
│   └── sitemap.ts            # SEO sitemap generation
├── components/
│   ├── features/             # Complex interactive modules
│   │   ├── chatbot/          # AI Assistant (ChatBot.tsx)
│   │   └── intake/           # Multi-step Intake Form
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
├── data/
│   └── legalKnowledgeBase.ts # AI Brain & Intent Logic
└── lib/
    ├── utils.ts              # cn() helper
    ├── site.ts               # Site configuration
    ├── hooks.ts              # Custom React hooks
    └── animations.ts         # Framer Motion variants
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

3.  **Run the development server:**
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

1.  **Hero Section**: High-impact introduction with animated floating elements and trust indicators.
2.  **Stats**: Animated counters showing success metrics.
3.  **Process**: Visual timeline of the client journey.
4.  **Services**: Interactive cards with modal details for each practice area.
5.  **Why Us**: Value proposition with feature highlights.
6.  **Testimonials**: Client reviews with ratings.
7.  **About**: Attorney profile and firm story.
8.  **Pricing**: Transparent "Low-bono" fee structure.
9.  **FAQ**: Accordion-style Q&A.
10. **CTA Banner**: Final call to action.
11. **Contact**: Multi-step intake form with contact information.

---

## 🎯 Recent Improvements

- ✅ Enhanced Hero Section with floating gradient elements and animated text highlights
- ✅ Added trust indicators (Free Call, 24-48hr Response, 95% Approval Rate)
- ✅ Created centralized animation library (`src/lib/animations.ts`)
- ✅ Added custom React hooks library (`src/lib/hooks.ts`)
- ✅ Added Loading and Skeleton components for better UX
- ✅ Added scroll progress indicator component
- ✅ Enhanced CSS with custom scrollbar, selection colors, and more utilities
- ✅ Improved accessibility with skip-to-content link and focus states
- ✅ Organized project structure for scalability

---

## 🚀 Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import project in Vercel Dashboard
3. Auto-detected as Next.js - click Deploy

The `vercel.json` includes security headers and caching configuration.

---

## 📄 License

© 2025 M&T Immigration Law Firm. All rights reserved.

**Attorney Advertising**: Prior results do not guarantee a similar outcome.
