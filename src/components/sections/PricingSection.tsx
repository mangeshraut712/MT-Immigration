'use client';

import { motion } from 'framer-motion';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { fadeUpVariants, staggerContainerVariants, staggerItemVariants, slideLeftVariants } from '@/lib/animations';

const pricingData = [
    { service: "Visitor Visa (B1/B2)", price: "$350–$650", includes: "DS-160, coaching" },
    { service: "Student Visa (F-1)", price: "$450–$900", includes: "I-20 guidance, prep" },
    { service: "Change of Status", price: "$850–$1,800", includes: "I-539, risk assessment" },
    { service: "Marriage-Based AOS", price: "$1,800–$3,500", includes: "Full forms, evidence" },
    { service: "Consular Processing", price: "$1,200–$2,400", includes: "NVC support" },
    { service: "Work Permit (I-765)", price: "$250–$450", includes: "Eligibility analysis" },
    { service: "Advance Parole (I-131)", price: "$250–$450", includes: "Authorization prep" },
    { service: "Expedite Request Prep", price: "$300–$600", includes: "Drafting, evidence" },
    { service: "U Visa", price: "$1,800–$3,500", includes: "Full support" },
    { service: "Asylum", price: "$2,500–$6,000", includes: "Research, prep" },
];

const benefits = [
    "Transparent, upfront pricing",
    "Sliding-scale options available",
    "Flexible payment plans via Stripe",
    "No hidden fees",
    "Free initial consultation",
    "Income-based discounts"
];

export function PricingSection() {
    return (
        <section id="pricing" className="section-padding bg-zinc-50 relative overflow-hidden">
            {/* Gradient Background */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.05),transparent_50%)]" />

            <div className="container-wide relative z-10">
                <div className="grid lg:grid-cols-3 gap-16">
                    {/* Sticky sidebar */}
                    <motion.div
                        variants={slideLeftVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="lg:col-span-1"
                    >
                        <div className="lg:sticky lg:top-32 space-y-8">
                            <div>
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="h-px w-8 bg-zinc-300"></div>
                                    <span className="text-xs font-semibold tracking-widest uppercase text-zinc-500">Transparent Fees</span>
                                </div>
                                <h2 className="text-4xl md:text-5xl font-serif font-medium tracking-tight text-foreground mt-4 mb-6 leading-[1.1]">
                                    Low-bono services <br />
                                    <span className="text-zinc-400 italic">for everyone.</span>
                                </h2>
                                <p className="text-zinc-500 leading-relaxed text-lg">
                                    Based on complexity, urgency, and scope. All prices include consultations and filings.
                                </p>
                                <p className="text-sm text-zinc-500 mt-4 p-4 bg-white border border-zinc-200 rounded-xl shadow-sm">
                                    <strong>Note:</strong> Legal service fees only. USCIS filing fees are separate.
                                </p>
                            </div>

                            <div className="space-y-4">
                                <h4 className="font-serif font-medium text-foreground text-lg">Why Choose Us?</h4>
                                <motion.ul
                                    variants={staggerContainerVariants}
                                    initial="hidden"
                                    whileInView="visible"
                                    viewport={{ once: true }}
                                    className="space-y-3"
                                >
                                    {benefits.map((item, i) => (
                                        <motion.li
                                            key={i}
                                            variants={staggerItemVariants}
                                            className="flex items-center gap-3 text-sm text-zinc-600"
                                        >
                                            <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0">
                                                <Check className="w-3 h-3" />
                                            </div>
                                            {item}
                                        </motion.li>
                                    ))}
                                </motion.ul>
                            </div>

                            <Button asChild size="lg" className="w-full rounded-xl bg-black text-white hover:bg-zinc-800 shadow-lg hover:shadow-xl transition-all h-12 text-base">
                                <Link href="#contact">Get a Custom Quote</Link>
                            </Button>
                        </div>
                    </motion.div>

                    {/* Pricing table */}
                    <motion.div
                        variants={fadeUpVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="lg:col-span-2"
                    >
                        <div className="bg-white rounded-3xl border border-zinc-200 shadow-xl shadow-zinc-200/50 hover:shadow-2xl transition-shadow duration-500 overflow-hidden">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-zinc-50/50 hover:bg-zinc-50/50 border-b border-zinc-100">
                                        <TableHead className="w-[40%] font-serif font-bold text-zinc-900 py-6 text-lg pl-8">Service</TableHead>
                                        <TableHead className="w-[25%] font-serif font-bold text-zinc-900 text-lg">Price Range</TableHead>
                                        <TableHead className="font-serif font-bold text-zinc-900 text-lg pr-8">Includes</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {pricingData.map((item, index) => (
                                        <motion.tr
                                            key={index}
                                            initial={{ opacity: 0, y: 10 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: index * 0.05 }}
                                            className="hover:bg-blue-50/30 transition-colors duration-200 border-b border-zinc-50 last:border-0 group cursor-default"
                                        >
                                            <TableCell className="font-medium py-6 pl-8 text-zinc-700 group-hover:text-blue-700 transition-colors">{item.service}</TableCell>
                                            <TableCell className="text-zinc-900 font-medium font-sans">{item.price}</TableCell>
                                            <TableCell className="text-zinc-500 pr-8">{item.includes}</TableCell>
                                        </motion.tr>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                        <p className="mt-6 text-sm text-zinc-400 text-center">
                            Payment plans available via Stripe. Sliding-scale may require income documentation.
                        </p>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
