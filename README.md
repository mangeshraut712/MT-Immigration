# M&T Immigration Law Firm Website

A state-of-the-art, AI-powered specialized immigration law firm website built with **Next.js 16**, **React 19**, and a premium "Apple-style" black & white design system.

![Project Banner](https://via.placeholder.com/1200x600?text=M%26T+Immigration+Law+Firm)

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

### ⚡ **Performance & Architecture**
- **Next.js 16**: Utilizing the latest App Router and React Server Components (RSC).
- **React 19**: Leveraging the newest React features for concurrent rendering.
- **Component Architecture**: Highly organized codebase with clear separation of concerns:
  - `components/layout`: Core structural frame (Navbar, Footer).
  - `components/features`: Complex interactive modules (Chatbot, Intake Form).
  - `components/sections`: Marketing landing page sections.
- **Dynamic Loading**: Critical sections and the Chatbot are properly code-split using `next/dynamic` for optimal Core Web Vitals.

### 📝 **Smart Intake System**
- **Accessibility**: integrated `aria` labels, keyboard navigation, and semantic HTML5.
- **Multi-step Wizard**: A frictionless "Contact -> Case Details -> Review" flow.
- **Real-time Validation**: Ensures data integrity before submission.

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

---

## 📁 Project Structure

```bash
src/
├── app/                  # Next.js App Router
│   ├── layout.tsx        # Root layout with ChatBot wrapper
│   ├── page.tsx          # Homepage composition
│   └── globals.css       # Tailwind & CSS Variables
├── components/
│   ├── features/         # Complex interactive modules
│   │   ├── chatbot/      # AI Assistant (ChatBot.tsx, logic)
│   │   └── intake/       # Multi-step Intake Form
│   ├── layout/           # Structural components (Navbar, Footer)
│   ├── sections/         # Landing page sections (Hero, About, etc.)
│   └── ui/               # Reusable Shadcn/UI atoms
├── data/
│   └── legalKnowledgeBase.ts # AI Brain & Intent Logic
└── lib/                  # Utilities (cn, helpers)
```

---

## 🚦 Getting Started

### Prerequisites

- Node.js 18+ (Recommended: 20 LTS)
- npm or pnpm

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/mt-immigration.git
    cd mt-immigration
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    # or
    pnpm install
    ```

3.  **Run the development server:**
    ```bash
    npm run dev
    ```

    Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Build for Production

```bash
npm run build
npm start
```

---

## 🧪 Developer Commands

- **`npm run lint`**: Check for TypeScript and ESLint errors (currently passing with 0 errors).
- **`npm run build`**: Create an optimized production build (Turbo enabled).

---

## 📱 Page Overview

1.  **Hero Section**: High-impact introduction with static CTA area.
2.  **Stats**: Trust indicators and metrics.
3.  **Process**: Visual timeline of the client journey.
4.  **Services**: Detailed breakdown of practice areas (Visas, Green Cards, etc.).
5.  **Why Us**: Value proposition and differentiators.
6.  **Testimonials**: Social proof from past clients.
7.  **About**: Attorney profile and firm background.
8.  **Pricing**: Transparent "Low-bono" fee structure.
9.  **FAQ**: Common questions answered in accordion format.
10. **Contact**: Integrated multi-step intake form with sidebar contact info.

---

## 📄 License

© 2025 M&T Immigration Law Firm. All rights reserved.
