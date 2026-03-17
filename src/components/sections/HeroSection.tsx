'use client';

import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Sparkles, Phone, Clock, FileText } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { fadeUpVariants } from '@/lib/animations';

export function HeroSection() {
    const shouldReduceMotion = useReducedMotion();
    const { scrollY } = useScroll();
    const opacity = useTransform(scrollY, [0, 260], [1, shouldReduceMotion ? 1 : 0.78]);
    const y = useTransform(scrollY, [0, 260], [0, shouldReduceMotion ? 0 : 40]);

    return (
        <section className="relative flex min-h-[calc(100svh-4rem)] items-center justify-center overflow-hidden bg-white md:min-h-[90vh]">
            {/* Simple, Clean Background */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(59,130,246,0.05),transparent_50%)]" />

            {/* Subtle Grid Pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.01)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_0%,black_40%,transparent_100%)]" />

            <motion.div
                style={{ opacity, y }}
                className="container-wide relative z-10 py-20 text-center sm:py-24 md:pt-32 md:pb-20"
            >
                {/* Badge */}
                <motion.div
                    variants={fadeUpVariants}
                    initial="hidden"
                    animate="visible"
                    className="inline-flex mb-8"
                >
                    <Badge variant="secondary" className="px-5 py-2.5 text-sm font-medium glass rounded-full text-zinc-600 border-zinc-200/60 shadow-sm backdrop-blur-xl">
                        <Sparkles className="w-4 h-4 mr-2 text-blue-500 fill-blue-500/20" />
                        Solo attorney practice with direct case ownership
                    </Badge>
                </motion.div>

                {/* Main headline */}
                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.1, ease: [0.25, 0.1, 0.25, 1] }}
                    className="mb-8 text-4xl font-serif font-medium tracking-tight leading-[1.02] sm:text-5xl md:text-7xl lg:text-8xl"
                >
                    <span className="text-foreground drop-shadow-sm">
                        Focused immigration counsel
                    </span>
                    <br />
                    <span className="text-zinc-400 italic font-light">
                        with{' '}
                        <span className="relative inline-block font-medium text-blue-600 not-italic">
                            clear strategy
                            {/* Simple subtle underline */}
                            <motion.span
                                aria-hidden
                                className="absolute -bottom-1 left-0 right-0 h-[2px] bg-blue-500/40 origin-left"
                                initial={{ scaleX: 0 }}
                                animate={{ scaleX: 1 }}
                                transition={{ delay: 0.8, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                            />
                        </span>
                    </span>
                </motion.h1>

                {/* Subheadline */}
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.25 }}
                    className="mx-auto mb-12 max-w-3xl text-lg leading-relaxed text-zinc-500 text-balance sm:text-xl md:text-2xl"
                >
                    Boutique support for <strong className="text-zinc-800 font-semibold">visitor</strong>, <strong className="text-zinc-800 font-semibold">student</strong>, <strong className="text-zinc-800 font-semibold">family-based</strong>, <strong className="text-zinc-800 font-semibold">humanitarian</strong>, and <strong className="text-zinc-800 font-semibold">urgent removal</strong> matters, with direct attorney communication from intake through filing.
                </motion.p>

                {/* CTA Buttons */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.35 }}
                    className="mb-14 flex flex-col items-stretch justify-center gap-4 sm:flex-row sm:items-center"
                >
                    <Button
                        asChild
                        size="lg"
                        className="group h-14 w-full max-w-sm px-8 text-lg rounded-full font-semibold bg-zinc-900 text-white hover:bg-zinc-800 shadow-xl shadow-zinc-900/10 hover:shadow-2xl hover:shadow-zinc-900/20 transition-all hover:scale-105 sm:w-auto"
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
                        className="h-14 w-full max-w-sm px-8 text-lg rounded-full font-semibold border-zinc-200 text-zinc-800 bg-white/50 backdrop-blur-sm hover:bg-white hover:text-zinc-900 transition-all hover:scale-105 shadow-sm sm:w-auto"
                    >
                        <Link href="#services">
                            Explore Services
                        </Link>
                    </Button>
                </motion.div>

                {/* Refined Trust indicators */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="flex flex-col items-center justify-center gap-3 text-sm font-medium text-zinc-500 sm:flex-row sm:flex-wrap sm:gap-x-8 sm:gap-y-4"
                >
                    <div className="flex items-center gap-2 px-4 py-2 rounded-full glass bg-white/40">
                        <Phone size={16} className="text-emerald-500" />
                        <span>Direct attorney access</span>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 rounded-full glass bg-white/40">
                        <Clock size={16} className="text-blue-500" />
                        <span>1-2 business day response</span>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 rounded-full glass bg-white/40">
                        <FileText size={16} className="text-indigo-500" />
                        <span>Transparent consult fees</span>
                    </div>
                </motion.div>
            </motion.div>
        </section>
    );
}
