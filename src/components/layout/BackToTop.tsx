'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function BackToTop() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const toggleVisibility = () => {
            if (window.scrollY > 500) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener('scroll', toggleVisibility);
        return () => window.removeEventListener('scroll', toggleVisibility);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.8, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.8, y: 20 }}
                    className="fixed bottom-20 right-4 z-50 sm:bottom-8 sm:right-8"
                >
                    <Button
                        onClick={scrollToTop}
                        size="icon"
                        className="h-10 w-10 rounded-full shadow-lg transition-all hover:scale-110 hover:shadow-xl sm:h-12 sm:w-12"
                        aria-label="Back to top"
                    >
                        <ArrowUp className="h-4 w-4 sm:h-5 sm:w-5" />
                    </Button>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
