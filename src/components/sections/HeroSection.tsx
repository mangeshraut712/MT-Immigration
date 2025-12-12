'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Sparkles, Phone, Clock, FileText } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { fadeUpVariants } from '@/lib/animations';

export function HeroSection() {
    const { scrollY } = useScroll();
    const opacity = useTransform(scrollY, [0, 300], [1, 0]);
    const y = useTransform(scrollY, [0, 300], [0, 100]);
    const scale = useTransform(scrollY, [0, 300], [1, 0.95]);

    return (
        <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-white">
            {/* Simple, Clean Background */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(59,130,246,0.05),transparent_50%)]" />

            {/* Subtle Grid Pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.01)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_0%,black_40%,transparent_100%)]" />

            <motion.div
                style={{ opacity, y, scale }}
                className="container-wide relative z-10 pt-32 pb-20 text-center"
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
                        Trusted by 1000+ Families Nationwide
                    </Badge>
                </motion.div>

                {/* Main headline */}
                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.1, ease: [0.25, 0.1, 0.25, 1] }}
                    className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-serif font-medium tracking-tight mb-8 leading-[1.05]"
                >
                    <span className="text-foreground drop-shadow-sm">
                        Affordable Legal Services
                    </span>
                    <br />
                    <span className="text-zinc-400 italic font-light">
                        Delivered with{' '}
                        <span className="relative inline-block font-medium text-blue-600 not-italic">
                            Care
                            {/* Simple subtle underline */}
                            <motion.span
                                aria-hidden
                                className="absolute -bottom-1 left-0 right-0 h-[2px] bg-blue-500/40 origin-left"
                                initial={{ scaleX: 0 }}
                                animate={{ scaleX: 1 }}
                                transition={{ delay: 0.8, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                            />
                        </span>
                        .
                    </span>
                </motion.h1>

                {/* Subheadline */}
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.25 }}
                    className="text-xl md:text-2xl text-zinc-500 max-w-3xl mx-auto leading-relaxed mb-12 text-balance"
                >
                    Low-bono support for <strong className="text-zinc-800 font-semibold">visitor</strong>, <strong className="text-zinc-800 font-semibold">student</strong>, <strong className="text-zinc-800 font-semibold">marriage-based</strong>, and <strong className="text-zinc-800 font-semibold">humanitarian</strong> immigration cases.
                </motion.p>

                {/* CTA Buttons */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.35 }}
                    className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16"
                >
                    <Button
                        asChild
                        size="lg"
                        className="h-14 px-8 text-lg rounded-full font-semibold bg-zinc-900 text-white hover:bg-zinc-800 shadow-xl shadow-zinc-900/10 hover:shadow-2xl hover:shadow-zinc-900/20 transition-all hover:scale-105 group"
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
                        className="h-14 px-8 text-lg rounded-full font-semibold border-zinc-200 text-zinc-800 bg-white/50 backdrop-blur-sm hover:bg-white hover:text-zinc-900 transition-all hover:scale-105 shadow-sm"
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
                    className="flex flex-wrap justify-center items-center gap-x-8 gap-y-4 text-sm font-medium text-zinc-500"
                >
                    <div className="flex items-center gap-2 px-4 py-2 rounded-full glass bg-white/40">
                        <Phone size={16} className="text-emerald-500" />
                        <span>Free Initial Call</span>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 rounded-full glass bg-white/40">
                        <Clock size={16} className="text-blue-500" />
                        <span>24-48hr Response</span>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 rounded-full glass bg-white/40">
                        <FileText size={16} className="text-indigo-500" />
                        <span>95% Approval Rate</span>
                    </div>
                </motion.div>
            </motion.div>
        </section>
    );
}
