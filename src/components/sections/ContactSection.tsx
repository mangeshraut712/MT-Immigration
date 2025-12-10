'use client';

import { motion } from 'framer-motion';
import IntakeForm from "@/components/features/intake/IntakeForm";
import { Mail, Phone, MapPin, Clock } from 'lucide-react';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

const contactInfo = [
    {
        icon: Phone,
        label: "Phone / WhatsApp",
        value: "+1 (555) 123-4567",
        tooltip: "Click to call",
        href: "tel:+15551234567"
    },
    {
        icon: Mail,
        label: "Email",
        value: "help@mtimmigration.com",
        tooltip: "Click to email",
        href: "mailto:help@mtimmigration.com"
    },
    {
        icon: MapPin,
        label: "Office",
        value: "New York, NY",
        tooltip: "Virtual consultations nationwide"
    },
    {
        icon: Clock,
        label: "Response Time",
        value: "24-48 hours",
        tooltip: "Weekdays only"
    },
];

export function ContactSection() {
    return (
        <section id="contact" className="section-padding bg-white relative overflow-hidden">
            {/* Solid White Background */}
            <div className="absolute inset-0 bg-white" />

            <div className="container-wide relative z-10">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-16 max-w-3xl mx-auto"
                >
                    <div className="flex items-center justify-center gap-3 mb-6">
                        <div className="h-px w-12 bg-primary"></div>
                        <span className="text-sm font-semibold tracking-widest uppercase text-primary">Get Started</span>
                        <div className="h-px w-12 bg-primary"></div>
                    </div>
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-medium tracking-tight text-foreground mb-6 leading-[1.1]">
                        Ready to begin <br />
                        <span className="text-zinc-400 italic">your journey?</span>
                    </h2>
                    <p className="text-xl text-zinc-500 leading-relaxed max-w-2xl mx-auto">
                        Schedule a consultation or fill out our intake form. We&apos;ll respond within 24–48 hours.
                    </p>
                </motion.div>

                <div className="grid lg:grid-cols-3 gap-8 lg:gap-12 items-start">
                    {/* Contact Info Sidebar */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="lg:col-span-1 space-y-6"
                    >
                        {/* Contact Cards */}
                        <div className="bg-white p-8 rounded-[2rem] border border-zinc-100 shadow-xl hover:shadow-2xl transition-shadow duration-500 space-y-8">
                            <h3 className="text-xl font-serif font-bold text-zinc-900 border-b border-zinc-100 pb-4">Contact Information</h3>

                            <TooltipProvider>
                                <div className="space-y-6">
                                    {contactInfo.map((item, index) => (
                                        <Tooltip key={index}>
                                            <TooltipTrigger asChild>
                                                <motion.a
                                                    href={item.href}
                                                    initial={{ opacity: 0, y: 10 }}
                                                    whileInView={{ opacity: 1, y: 0 }}
                                                    viewport={{ once: true }}
                                                    transition={{ delay: index * 0.1 }}
                                                    className="flex items-start gap-4 cursor-pointer group"
                                                >
                                                    <motion.div
                                                        whileHover={{ scale: 1.1, rotate: 5 }}
                                                        className="p-3 rounded-xl bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300"
                                                    >
                                                        <item.icon size={20} strokeWidth={1.5} />
                                                    </motion.div>
                                                    <div>
                                                        <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-1">
                                                            {item.label}
                                                        </p>
                                                        <p className="font-medium text-zinc-900 text-lg group-hover:text-blue-600 transition-colors">
                                                            {item.value}
                                                        </p>
                                                    </div>
                                                </motion.a>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>{item.tooltip}</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    ))}
                                </div>
                            </TooltipProvider>
                        </div>

                        {/* Pricing Card */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.4 }}
                            className="bg-black text-white p-8 rounded-[2rem] shadow-xl relative overflow-hidden group"
                        >
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.2),transparent_50%)]" />
                            <h3 className="text-xl font-serif font-bold mb-6 relative z-10">Consultation Fees</h3>
                            <div className="space-y-4 relative z-10">
                                <div className="flex justify-between items-center p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/5 group-hover:bg-white/15 transition-colors">
                                    <span className="font-medium">15 min</span>
                                    <span className="text-2xl font-bold font-serif">$20</span>
                                </div>
                                <div className="flex justify-between items-center p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/5 group-hover:bg-white/15 transition-colors">
                                    <span className="font-medium">30 min</span>
                                    <span className="text-2xl font-bold font-serif">$40</span>
                                </div>
                            </div>
                            <p className="text-xs text-zinc-400 mt-6 relative z-10 text-center">
                                Fee credited toward service if retained.
                            </p>
                        </motion.div>
                    </motion.div>

                    {/* Intake Form */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="lg:col-span-2"
                    >
                        <IntakeForm />
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
