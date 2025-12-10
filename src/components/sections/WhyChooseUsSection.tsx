'use client';

import { motion } from 'framer-motion';
import { Briefcase, GraduationCap, Heart, Shield, FileText, Clock, Users, Award, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

const whyChooseUs = [
    {
        icon: Shield,
        title: "Licensed & Insured",
        description: "Fully licensed attorney with professional liability insurance for your protection."
    },
    {
        icon: Clock,
        title: "Fast Response",
        description: "24-48 hour response time on all inquiries. We value your time."
    },
    {
        icon: Users,
        title: "Multilingual Support",
        description: "Fluent in English, Spanish, Urdu, Punjabi, and French."
    },
    {
        icon: Award,
        title: "Proven Track Record",
        description: "500+ successful cases with a 95% approval rate."
    },
];

const practiceAreas = [
    { icon: Briefcase, title: "Work Visas", count: "150+" },
    { icon: GraduationCap, title: "Student Visas", count: "200+" },
    { icon: Heart, title: "Family Immigration", count: "100+" },
    { icon: FileText, title: "Asylum Cases", count: "50+" },
];

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.1 }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { type: "spring" as const, stiffness: 100, damping: 15 }
    }
};

export function WhyChooseUsSection() {
    return (
        <section className="section-padding bg-zinc-950 text-zinc-50 relative overflow-hidden">
            {/* Premium Background - Subtle Spotlight instead of Grid */}
            <div className="absolute top-0 -left-1/4 w-1/2 h-full bg-blue-500/5 blur-[100px] rounded-full pointer-events-none" />
            <div className="absolute bottom-0 -right-1/4 w-1/2 h-full bg-purple-500/5 blur-[100px] rounded-full pointer-events-none" />

            <div className="container-wide relative z-10">
                <div className="grid lg:grid-cols-2 gap-16 lg:gap-24">
                    {/* Left column - Why Choose Us */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ type: "spring", stiffness: 50 }}
                    >
                        <div className="flex items-center gap-3 mb-6">
                            <div className="h-px w-8 bg-zinc-500"></div>
                            <span className="text-sm font-semibold tracking-widest uppercase text-zinc-400">Why Choose Us</span>
                        </div>
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-medium tracking-tight mt-4 mb-8 leading-[1.1]">
                            Unwavering commitment. <br />
                            <span className="text-zinc-500 italic">Proven results.</span>
                        </h2>

                        <motion.div
                            variants={containerVariants}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            className="grid gap-6"
                        >
                            {whyChooseUs.map((item, index) => (
                                <motion.div
                                    key={index}
                                    variants={itemVariants}
                                    className="flex gap-5 p-6 rounded-2xl bg-zinc-900/50 border border-white/5 hover:bg-zinc-900 hover:border-white/10 transition-colors group backdrop-blur-sm"
                                >
                                    <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-zinc-50 text-black flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg shadow-white/10">
                                        <item.icon size={22} />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                                        <p className="text-zinc-400 text-sm leading-relaxed">{item.description}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.6 }}
                            className="mt-10"
                        >
                            <Button
                                asChild
                                size="lg"
                                className="w-full h-14 text-lg rounded-full font-semibold bg-white text-zinc-950 hover:bg-white/90 shadow-lg hover:shadow-xl transition-all group"
                            >
                                <Link href="#contact" className="flex items-center justify-center">
                                    Schedule a Consultation
                                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                </Link>
                            </Button>
                        </motion.div>
                    </motion.div>

                    {/* Right column - Practice Areas */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ type: "spring", stiffness: 50 }}
                    >
                        <div className="flex items-center gap-3 mb-6 lg:justify-end">
                            <div className="h-px w-8 bg-zinc-500 lg:order-last"></div>
                            <span className="text-sm font-semibold tracking-widest uppercase text-zinc-400">Our Impact</span>
                        </div>
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-medium tracking-tight mt-4 mb-8 leading-[1.1] lg:text-right">
                            Excellence across <br />
                            <span className="text-zinc-500 italic">every case.</span>
                        </h2>

                        <div className="grid grid-cols-2 gap-4">
                            {practiceAreas.map((area, index) => (
                                <Link href="#services" key={index}>
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        whileInView={{ opacity: 1, scale: 1 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: index * 0.1 }}
                                        className="h-full p-8 rounded-2xl border border-white/5 bg-zinc-900/50 hover:bg-zinc-900 hover:border-white/10 transition-all duration-300 group cursor-pointer flex flex-col justify-between aspect-square backdrop-blur-sm"
                                    >
                                        <div className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center mb-4 group-hover:bg-white group-hover:text-black transition-colors shadow-inner">
                                            <area.icon size={24} />
                                        </div>
                                        <div>
                                            <p className="text-4xl font-serif font-bold text-white mb-2">{area.count}</p>
                                            <h3 className="font-medium text-zinc-300 mb-1">{area.title}</h3>
                                            <p className="text-xs text-zinc-500">cases handled</p>
                                        </div>
                                    </motion.div>
                                </Link>
                            ))}
                        </div>

                        {/* Featured stat */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.4 }}
                            className="mt-6 p-10 rounded-3xl bg-gradient-to-br from-blue-600 to-blue-800 text-white shadow-2xl"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-6xl font-serif font-bold mb-2">98%</p>
                                    <div className="h-1 w-12 bg-white/30 mb-2 rounded-full"></div>
                                    <p className="text-blue-100 font-medium tracking-wide">Success Rate</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-5xl font-serif font-bold mb-2">10+</p>
                                    <p className="text-blue-100 font-medium tracking-wide">Years Experience</p>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
