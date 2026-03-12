"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowUp } from "lucide-react"

export function ScrollToTop() {
    const [isVisible, setIsVisible] = useState(false)
    const [scrollProgress, setScrollProgress] = useState(0)
    const rafRef = useRef<number | null>(null)

    // Throttled scroll handler for 90 FPS performance
    const handleScroll = useCallback(() => {
        if (rafRef.current) return

        rafRef.current = requestAnimationFrame(() => {
            // Show button after scrolling 300px
            const shouldShow = window.scrollY > 300
            setIsVisible(shouldShow)

            // Calculate scroll progress
            const scrollHeight = document.documentElement.scrollHeight - window.innerHeight
            const progress = (window.scrollY / scrollHeight) * 100
            setScrollProgress(Math.min(progress, 100))

            rafRef.current = null
        })
    }, [])

    useEffect(() => {
        window.addEventListener("scroll", handleScroll, { passive: true })
        return () => {
            window.removeEventListener("scroll", handleScroll)
            if (rafRef.current) cancelAnimationFrame(rafRef.current)
        }
    }, [handleScroll])

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        })
    }

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.8, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.8, y: 20 }}
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    className="fixed bottom-6 left-6"
                    style={{
                        position: 'fixed',
                        zIndex: 99999,
                        isolation: 'isolate'
                    }}
                >
                    <motion.button
                        whileHover={{ scale: 1.1, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={scrollToTop}
                        className="relative group"
                        aria-label="Scroll to top"
                    >
                        {/* Progress ring */}
                        <svg
                            className="w-12 h-12 -rotate-90 transform"
                            viewBox="0 0 44 44"
                        >
                            {/* Background circle */}
                            <circle
                                cx="22"
                                cy="22"
                                r="18"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="3"
                                className="text-primary/20"
                            />
                            {/* Progress circle */}
                            <circle
                                cx="22"
                                cy="22"
                                r="18"
                                fill="none"
                                stroke="url(#gradient-scroll)"
                                strokeWidth="3"
                                strokeLinecap="round"
                                strokeDasharray={`${scrollProgress * 1.13} 113`}
                                className="transition-all duration-150"
                            />
                            <defs>
                                <linearGradient id="gradient-scroll" x1="0%" y1="0%" x2="100%" y2="0%">
                                    <stop offset="0%" stopColor="hsl(var(--primary))" />
                                    <stop offset="100%" stopColor="hsl(221 83% 60%)" />
                                </linearGradient>
                            </defs>
                        </svg>

                        {/* Center button */}
                        <span className="absolute inset-0 flex items-center justify-center">
                            <span className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center text-white shadow-lg group-hover:shadow-primary/30 transition-shadow">
                                <ArrowUp className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" />
                            </span>
                        </span>
                    </motion.button>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
