'use client';

import { motion } from 'framer-motion';
import { Badge } from "@/components/ui/badge";
import { Quote } from 'lucide-react';

export function AboutSection() {
    return (
        <section id="about" className="section-padding bg-foreground text-background relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px]"></div>

            <div className="container-wide relative z-10">
                <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
                    {/* Image placeholder with layered cards */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ type: "spring", stiffness: 50, damping: 20 }}
                        className="relative order-2 lg:order-1"
                    >
                        <div className="relative aspect-[4/5] max-w-md mx-auto lg:mx-0">
                            {/* Background layers */}
                            <div className="absolute inset-0 bg-gradient-to-br from-background/20 to-background/5 rounded-3xl transform rotate-3 scale-105"></div>
                            <div className="absolute inset-0 bg-background/10 rounded-3xl transform -rotate-2 scale-102"></div>

                            {/* Main image container */}
                            <div className="relative h-full bg-background/20 rounded-3xl overflow-hidden flex items-center justify-center backdrop-blur-sm border border-background/10 shadow-2xl">
                                <div className="text-center p-8">
                                    <div className="w-32 h-32 rounded-full bg-background/20 mx-auto mb-6 flex items-center justify-center">
                                        <span className="text-5xl font-bold">M&T</span>
                                    </div>
                                    <p className="text-background/60 text-sm">Attorney Photo</p>
                                </div>
                            </div>

                            {/* Floating stats card */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.3 }}
                                className="absolute -bottom-6 -right-6 bg-background text-foreground p-6 rounded-2xl shadow-2xl"
                            >
                                <div className="text-3xl font-bold">500+</div>
                                <div className="text-sm text-muted-foreground">Cases Handled</div>
                            </motion.div>
                        </div>
                    </motion.div>

                    {/* Content */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ type: "spring", stiffness: 50, damping: 20 }}
                        className="order-1 lg:order-2 space-y-8"
                    >
                        <Badge className="bg-background/10 text-background hover:bg-background/20 border-none text-sm px-4 py-2">
                            Founder & Lead Attorney
                        </Badge>

                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-medium tracking-tight leading-tight">
                            Meet the Attorney
                        </h2>

                        <div className="relative">
                            <Quote className="absolute -top-4 -left-4 w-12 h-12 text-background/10 rotate-180" />
                            <blockquote className="text-xl md:text-2xl font-serif font-light italic leading-relaxed pl-8 border-l-4 border-background/20">
                                &quot;I&apos;ve been in your shoes. I immigrated to the United States in 2015 on an F-1 student visa. I know the confusion and stress firsthand.&quot;
                            </blockquote>
                        </div>

                        <p className="text-lg text-background/80 leading-relaxed font-sans">
                            After navigating the process myself and working in immigration law, I founded M&T Immigration Law Firm to make reliable legal help accessible and affordable.
                        </p>

                        {/* Credentials */}
                        <div className="pt-6 border-t border-background/10">
                            <h4 className="text-sm font-bold uppercase tracking-widest text-background/50 mb-6">Credentials</h4>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                {[
                                    "Licensed Attorney",
                                    "10+ Years Experience",
                                    "Pro Bono Volunteer",
                                    "Former F-1 Student",
                                    "Multilingual Support"
                                ].map((cred, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, x: -10 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: 0.1 * i }}
                                        className="flex items-center gap-3"
                                    >
                                        <div className="w-2 h-2 rounded-full bg-background/50"></div>
                                        {cred}
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
