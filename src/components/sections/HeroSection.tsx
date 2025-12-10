'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export function HeroSection() {
    const { scrollY } = useScroll();
    const opacity = useTransform(scrollY, [0, 300], [1, 0]);
    const y = useTransform(scrollY, [0, 300], [0, 100]);

    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-white">
            {/* Solid White Background - no decorations */}
            <div className="absolute inset-0 bg-white" />

            <motion.div
                style={{ opacity, y }}
                className="container-wide relative z-10 pt-32 pb-20 text-center"
            >
                {/* Badge with modern styling */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="inline-flex mb-8"
                >
                    <Badge variant="secondary" className="px-4 py-2 text-sm font-medium glass">
                        <Sparkles className="w-4 h-4 mr-2 text-primary" />
                        Trusted Immigration Law Firm
                    </Badge>
                </motion.div>

                {/* Main headline with stagger animation */}
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-serif font-medium tracking-tight mb-6 leading-[1.05]"
                >
                    <span className="text-foreground">
                        Affordable Legal Services
                    </span>
                    <br />
                    <span className="text-foreground/80 italic">
                        Delivered with Care.
                    </span>
                </motion.h1>

                {/* Subheadline */}
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-12"
                >
                    Low-bono support for visitor, student, marriage-based, and humanitarian immigration cases. Honest guidance, clear fees, and full-service preparation.
                </motion.p>

                {/* CTA Buttons with proper colors */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16"
                >
                    <Button
                        asChild
                        size="lg"
                        className="h-14 px-8 text-lg rounded-full font-semibold bg-foreground text-background hover:bg-foreground/90 shadow-lg hover:shadow-xl transition-all hover:scale-105 group"
                    >
                        <Link href="#contact" className="flex items-center">
                            Book a Consultation
                            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </Button>
                    <Button
                        asChild
                        variant="outline"
                        size="lg"
                        className="h-14 px-8 text-lg rounded-full font-semibold border-2 border-foreground text-foreground bg-background hover:bg-foreground hover:text-background transition-all hover:scale-105"
                    >
                        <Link href="#services">
                            Explore Services
                        </Link>
                    </Button>
                </motion.div>


            </motion.div>
        </section>
    );
}
