'use client';

import { motion } from 'framer-motion';
import { Badge } from "@/components/ui/badge";
import { Quote, Award, Users, Globe, Scale } from 'lucide-react';

export function AboutSection() {
    return (
        <section id="about" className="section-padding bg-white relative overflow-hidden">
            {/* Subtle background gradient */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.03),transparent_50%)]" />

            {/* Decorative grid */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.01)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,black_20%,transparent_100%)]" />

            <div className="container-wide relative z-10">
                <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
                    {/* Image placeholder with enhanced design */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ type: "spring", stiffness: 50, damping: 20 }}
                        className="relative order-2 lg:order-1"
                    >
                        <div className="relative aspect-[4/5] max-w-md mx-auto lg:mx-0">
                            {/* Decorative background elements */}
                            <div className="absolute -inset-4 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-3xl transform rotate-3 opacity-50 blur-xl" />
                            <div className="absolute -inset-2 bg-gradient-to-tr from-blue-50 to-indigo-50 rounded-3xl transform -rotate-2" />

                            {/* Main image container */}
                            <div className="relative h-full bg-gradient-to-br from-zinc-100 to-zinc-50 rounded-3xl overflow-hidden flex items-center justify-center border border-zinc-200 shadow-2xl shadow-zinc-900/10">
                                <div className="text-center p-8">
                                    <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 mx-auto mb-6 flex items-center justify-center shadow-xl">
                                        <span className="text-5xl font-bold text-white">M&T</span>
                                    </div>
                                    <p className="text-zinc-400 text-sm font-medium">Attorney Photo</p>
                                </div>
                            </div>

                            {/* Floating stats card */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.3 }}
                                className="absolute -bottom-6 -right-6 bg-white p-6 rounded-2xl shadow-2xl border border-zinc-100"
                            >
                                <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">500+</div>
                                <div className="text-sm text-zinc-600 font-medium">Cases Handled</div>
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
                        <div className="flex items-center gap-3 mb-6">
                            <div className="h-px w-12 bg-blue-500" />
                            <span className="text-sm font-semibold tracking-widest uppercase text-blue-600">About</span>
                        </div>

                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-medium tracking-tight leading-[1.1]">
                            Meet the Attorney
                            <br />
                            <span className="text-zinc-400 italic font-light">Behind M&T</span>
                        </h2>

                        <div className="relative">
                            <Quote className="absolute -top-4 -left-4 w-12 h-12 text-blue-100 rotate-180" />
                            <blockquote className="text-xl md:text-2xl font-serif font-light italic leading-relaxed pl-8 border-l-4 border-blue-500/30 text-zinc-700">
                                "I've been in your shoes. I immigrated to the United States in 2015 on an F-1 student visa. I know the confusion and stress firsthand."
                            </blockquote>
                        </div>

                        <p className="text-lg text-zinc-600 leading-relaxed">
                            After navigating the process myself and working in immigration law, I founded M&T Immigration Law Firm to make reliable legal help accessible and affordable.
                        </p>

                        {/* Credentials with icons */}
                        <div className="pt-6 border-t border-zinc-200">
                            <h4 className="text-sm font-bold uppercase tracking-widest text-zinc-400 mb-6">Credentials & Expertise</h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {[
                                    { icon: Scale, text: "Licensed Attorney" },
                                    { icon: Award, text: "10+ Years Experience" },
                                    { icon: Users, text: "Pro Bono Volunteer" },
                                    { icon: Globe, text: "Multilingual Support" }
                                ].map((cred, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, x: -10 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: 0.1 * i }}
                                        className="flex items-center gap-3 p-3 rounded-xl bg-zinc-50 border border-zinc-100 hover:border-blue-200 hover:bg-blue-50/50 transition-all group"
                                    >
                                        <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center group-hover:bg-blue-500 transition-colors">
                                            <cred.icon className="w-5 h-5 text-blue-600 group-hover:text-white transition-colors" />
                                        </div>
                                        <span className="text-sm font-medium text-zinc-700">{cred.text}</span>
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
