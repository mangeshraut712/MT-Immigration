'use client';

import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Phone, ArrowRight } from 'lucide-react';
import Link from "next/link";

export function CTASection() {
    return (
        <section className="relative bg-black text-white py-24 md:py-32 overflow-hidden">
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.1),transparent_50%),radial-gradient(circle_at_70%_70%,rgba(255,255,255,0.1),transparent_50%)]" />
            </div>

            <div className="container-wide relative z-10">
                <div className="max-w-4xl mx-auto text-center">
                    {/* Heading */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
                            Your Immigration Journey
                            <br />
                            <span className="text-gray-400">Starts Here.</span>
                        </h2>
                        <p className="text-xl md:text-2xl text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed">
                            Don&apos;t navigate the complex immigration system alone. Get expert guidance from attorneys who understand your unique situation.
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
                            className="h-14 px-8 text-lg rounded-full font-semibold bg-white text-black hover:bg-gray-100 shadow-lg hover:shadow-xl transition-all hover:scale-105 group"
                        >
                            <Link href="#contact" className="flex items-center">
                                Schedule Consultation
                                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </Button>
                        <Button
                            asChild
                            variant="outline"
                            size="lg"
                            className="h-14 px-8 text-lg rounded-full font-semibold border-2 border-white text-white bg-transparent hover:bg-white hover:text-black transition-all hover:scale-105"
                        >
                            <a href="tel:+15551234567" className="flex items-center gap-2">
                                <Phone size={18} />
                                Call Now
                            </a>
                        </Button>
                    </motion.div>

                    {/* Trust message */}
                    <motion.p
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.4 }}
                        className="text-sm text-gray-500"
                    >
                        Free initial consultations available • Response within 24-48 hours
                    </motion.p>
                </div>
            </div>
        </section>
    );
}
