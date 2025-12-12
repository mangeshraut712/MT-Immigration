'use client';

import { motion, useScroll, useSpring } from 'framer-motion';

/**
 * Scroll progress indicator that shows reading progress at the top of the page
 */
export function ScrollProgress() {
    const { scrollYProgress } = useScroll();
    const scaleX = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001,
    });

    return (
        <motion.div
            className="fixed top-0 left-0 right-0 h-1 bg-blue-600 origin-left z-[60]"
            style={{ scaleX }}
        />
    );
}

/**
 * Scroll to top of page with smooth animation
 */
export function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

/**
 * Scroll to element by ID with offset for fixed header
 */
export function scrollToElement(elementId: string, offset = 80) {
    const element = document.getElementById(elementId);
    if (element) {
        const top = element.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
    }
}
