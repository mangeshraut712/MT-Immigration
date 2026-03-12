"use client"

import { Suspense, lazy } from "react"
import { Navigation } from "@/components/Navigation"
import { ScrollToTop } from "@/components/ScrollToTop"

// Lazy load the AI Chatbot for better performance
const AIChatbot = lazy(() =>
    import("@/components/AIChatbot").then(mod => ({ default: mod.AIChatbot }))
)

// Loading component for the chatbot
function ChatbotLoading() {
    return (
        <div className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-muted animate-pulse" />
    )
}

export function GlobalLayout() {
    return (
        <>
            <Navigation />
            <ScrollToTop />
            {/* AI Chatbot with lazy loading */}
            <Suspense fallback={<ChatbotLoading />}>
                <AIChatbot />
            </Suspense>
        </>
    )
}
