'use client';

import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Phone, ArrowRight, MessageCircle, Calendar } from 'lucide-react';
import Link from "next/link";

export function CTASection() {
    return (
        <section className="relative bg-gradient-to-br from-zinc-900 via-zinc-950 to-black text-white py-24 md:py-32 overflow-hidden">
            {/* Animated gradient orbs */}
            <div className="absolute inset-0 overflow-hidden">
                <motion.div
                    className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-[128px]"
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.3, 0.5, 0.3],
                    }}
                    transition={{
                        duration: 8,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />
                <motion.div
                    className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-[128px]"
                    animate={{
                        scale: [1.2, 1, 1.2],
                        opacity: [0.5, 0.3, 0.5],
                    }}
                    transition={{
                        duration: 10,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 1
                    }}
                />
            </div>

            {/* Grid pattern overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]" />

            <div className="container-wide relative z-10">
                <div className="max-w-4xl mx-auto text-center">
                    {/* Badge */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="inline-flex mb-8"
                    >
                        <div className="px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-sm font-medium">
                            <span className="text-blue-400">✨</span> Ready to Start?
                        </div>
                    </motion.div>

                    {/* Heading */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                    >
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-medium tracking-tight mb-6 leading-[1.1]">
                            Your Immigration Journey
                            <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-blue-400">
                                Starts Here
                            </span>
                        </h2>
                        <p className="text-xl md:text-2xl text-zinc-400 mb-12 max-w-2xl mx-auto leading-relaxed">
                            Don't navigate the complex immigration system alone. Get expert guidance from attorneys who understand your unique situation.
                        </p>
                    </motion.div>

                    {/* CTA Buttons */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
                    >
                        <Button
                            asChild
                            size="lg"
                            className="h-14 px-8 text-lg rounded-full font-semibold bg-white text-black hover:bg-zinc-100 shadow-xl shadow-white/10 hover:shadow-2xl hover:shadow-white/20 transition-all hover:scale-105 group"
                        >
                            <Link href="#contact" className="flex items-center">
                                <Calendar className="mr-2 h-5 w-5" />
                                Schedule Consultation
                                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </Button>
                        <Button
                            asChild
                            variant="outline"
                            size="lg"
                            className="h-14 px-8 text-lg rounded-full font-semibold border-2 border-white/20 text-white bg-white/5 backdrop-blur-sm hover:bg-white hover:text-black transition-all hover:scale-105"
                        >
                            <a href="tel:+15551234567" className="flex items-center gap-2">
                                <Phone size={18} />
                                Call Now
                            </a>
                        </Button>
                    </motion.div>

                    {/* Features grid */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto"
                    >
                        {[
                            { icon: MessageCircle, text: "Free Initial Call" },
                            { icon: Calendar, text: "24-48hr Response" },
                            { icon: Phone, text: "Multilingual Support" }
                        ].map((item, i) => (
                            <div
                                key={i}
                                className="flex items-center justify-center gap-3 p-4 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10"
                            >
                                <item.icon className="w-5 h-5 text-blue-400" />
                                <span className="text-sm font-medium text-zinc-300">{item.text}</span>
                            </div>
                        ))}
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
