'use client';

import { motion } from 'framer-motion';
import {
    Heart, GraduationCap, Shield, Briefcase, Plane,
    RefreshCw, Zap, FileText, Globe, ArrowRight, CheckCircle2, Clock,
    ChevronRight, Star
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import Link from 'next/link';

const services = [
    {
        id: "visitor",
        title: "Visitor Visa (B1/B2)",
        description: "Comprehensive preparation for tourist and business travel visas.",
        icon: Plane,
        timeline: "2-4 weeks",
        price: "From $350",
        features: [
            "DS-160 preparation and guidance",
            "Interview coaching with mock sessions",
            "Document checklist and strategy"
        ],
        requirements: ["Valid passport", "Ties to home country", "Financial ability"],
        stat: "98% Approval Rate for Business Travelers"
    },
    {
        id: "student",
        title: "Student Visa (F-1)",
        description: "Guidance for international students pursuing education in the US.",
        icon: GraduationCap,
        timeline: "1-3 months",
        price: "From $450",
        features: [
            "Admission pathway guidance",
            "I-20 + SEVIS I-901 fee guidance",
            "Comprehensive Interview preparation"
        ],
        requirements: ["I-20 Form", "SEVIS receipt", "Financial docs", "Academic records"],
        stat: "Helping students from 50+ countries"
    },
    {
        id: "marriage",
        title: "Marriage-Based",
        description: "Green cards for spouses of US Citizens and Permanent Residents.",
        icon: Heart,
        timeline: "6-18 months",
        price: "From $1,800",
        features: [
            "Adjustment of Status (I-130, I-485)",
            "Consular Processing support",
            "Interview prep & evidence strategy"
        ],
        requirements: ["Valid Marriage", "Petitioner Citizenship/LPR", "Financial Support"],
        stat: "Over 500 families reunited"
    },
    {
        id: "change-status",
        title: "Change of Status",
        description: "Switching from one non-immigrant status to another (e.g., B2 to F1).",
        icon: RefreshCw,
        timeline: "3-6 months",
        price: "From $850",
        features: [
            "Eligibility and risk assessment",
            "I-539 form preparation",
            "RFE response support"
        ],
        requirements: ["Valid current status", "No immigrant intent", "Financial solvency"],
        stat: "Expert handling of complex transitions"
    },
    {
        id: "work-permit",
        title: "Work Permit (I-765)",
        description: "Employment authorization documents (EAD) for eligible applicants.",
        icon: Briefcase,
        timeline: "1-3 months",
        price: "From $250",
        features: [
            "Category-specific eligibility analysis",
            "Application preparation & filing",
            "Application tracking"
        ],
        requirements: ["Underlying petition", "Eligibility category"],
        stat: "Fast-tracked filing available"
    },
    {
        id: "asylum",
        title: "Asylum (I-589)",
        description: "Protection for those fearing persecution in their home country.",
        icon: Shield,
        timeline: "6-24 months",
        price: "Consult for Quote",
        features: [
            "Application prep and affidavit support",
            "Country-conditions research",
            "Interview preparation"
        ],
        requirements: ["Fear of persecution", "Physical presence in US"],
        stat: "Compassionate, confidential support"
    },
    {
        id: "u-visa",
        title: "U Visa (Victims)",
        description: "Status for victims of certain crimes who assist law enforcement.",
        icon: FileText,
        timeline: "3-12 months", // Initial processing varies widely
        price: "Consult for Quote",
        features: [
            "I-918 + Supplement B support",
            "Evidence gathering",
            "Bona fide determination guidance"
        ],
        requirements: ["Victim of qualifying crime", "Helpfulness to police"],
        stat: "Dedicated team for sensitive cases"
    },
    {
        id: "advance-parole",
        title: "Advance Parole",
        description: "Travel authorization (I-131) for pending green card applicants.",
        icon: Globe,
        timeline: "1-2 months",
        price: "From $300",
        features: [
            "Travel authorization preparation",
            "Risk counseling & analysis",
            "Emergency handling if needed"
        ],
        requirements: ["Pending I-485", "DACA", "TPS"],
        stat: "Secure your ability to re-enter"
    },
    {
        id: "expedite",
        title: "Expedite Requests",
        description: "Accelerating pending cases for humanitarian or financial reasons.",
        icon: Zap,
        timeline: "1-4 weeks",
        price: "From $500",
        features: [
            "Compelling request drafting",
            "Evidence compilation",
            "Strategy tailored to USCIS criteria"
        ],
        requirements: ["Severe financial loss", "Humanitarian emergency", "US Govt interest"],
        stat: "High success with well-documented requests"
    },
];

export function ServicesSection() {
    return (
        <section id="services" className="section-padding bg-zinc-50 relative overflow-hidden">
            {/* Subtle Gradient Background */}
            <div className="absolute inset-0 bg-gradient-subtle" />

            {/* Noise Texture Integration is global, but we add a specific light glow here */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-blue-50/50 rounded-full blur-[100px] pointer-events-none" />

            <div className="container-wide relative z-10">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="max-w-3xl mb-16 md:mb-24"
                >
                    <div className="flex items-center gap-3 mb-6">
                        <div className="h-px w-12 bg-primary"></div>
                        <span className="text-sm font-semibold tracking-widest uppercase text-primary">Our Expertise</span>
                    </div>
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-medium text-foreground mb-8 leading-[1.1]">
                        Comprehensive legal <br />
                        <span className="text-zinc-400 italic">solutions for you.</span>
                    </h2>
                    <p className="text-xl text-zinc-500 leading-relaxed max-w-2xl text-balance">
                        From simple visas to complex defense, we provide clear pathways and strategies tailored to your unique immigration journey.
                    </p>
                </motion.div>

                {/* Services Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                    {services.map((service, index) => (
                        <Dialog key={service.id}>
                            <DialogTrigger asChild>
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.05 }}
                                    className="group relative bg-white rounded-2xl p-8 border border-zinc-100 hover:border-zinc-200 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer text-left h-full flex flex-col"
                                >
                                    <div className="mb-6 inline-flex p-3 rounded-xl bg-zinc-50 text-zinc-900 group-hover:scale-110 group-hover:bg-black group-hover:text-white transition-all duration-300">
                                        <service.icon size={28} strokeWidth={1.5} />
                                    </div>

                                    <h3 className="text-2xl font-serif font-medium mb-3 group-hover:text-blue-600 transition-colors">
                                        {service.title}
                                    </h3>

                                    <p className="text-zinc-500 mb-6 leading-relaxed flex-grow">
                                        {service.description}
                                    </p>

                                    <div className="flex items-center justify-between pt-6 border-t border-zinc-50 mt-auto">
                                        <Badge variant="secondary" className="bg-zinc-100 text-zinc-600 font-normal">
                                            {service.timeline}
                                        </Badge>
                                        <div className="flex items-center text-sm font-semibold text-blue-600 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                                            Details <ChevronRight size={16} className="ml-1" />
                                        </div>
                                    </div>
                                </motion.div>
                            </DialogTrigger>

                            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto sm:max-h-none">
                                <DialogHeader>
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="p-3 rounded-xl bg-blue-50 text-blue-600">
                                            <service.icon size={32} />
                                        </div>
                                        <div>
                                            <DialogTitle className="text-2xl font-serif">{service.title}</DialogTitle>
                                            <DialogDescription className="text-base mt-1">
                                                {service.description}
                                            </DialogDescription>
                                        </div>
                                    </div>
                                </DialogHeader>

                                <div className="grid md:grid-cols-2 gap-8 py-4">
                                    {/* Features */}
                                    <div className="space-y-4">
                                        <h4 className="font-semibold text-foreground flex items-center gap-2">
                                            <CheckCircle2 size={18} className="text-green-500" />
                                            What We Handle
                                        </h4>
                                        <ul className="space-y-3">
                                            {service.features.map((feature, i) => (
                                                <li key={i} className="text-sm text-zinc-600 flex items-start gap-2">
                                                    <span className="block w-1.5 h-1.5 rounded-full bg-zinc-300 mt-1.5 shrink-0" />
                                                    {feature}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    {/* Requirements & Info */}
                                    <div className="space-y-6">
                                        <div>
                                            <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                                                <FileText size={18} className="text-blue-500" />
                                                Key Requirements
                                            </h4>
                                            <ul className="space-y-2">
                                                {service.requirements.map((req, i) => (
                                                    <li key={i} className="text-sm text-zinc-600 bg-zinc-50 px-3 py-1.5 rounded-md inline-block mr-2 mb-2">
                                                        {req}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>

                                        <div className="bg-zinc-50 rounded-xl p-4">
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-sm text-zinc-500 flex items-center gap-2">
                                                    <Clock size={14} /> Estimated Timeline
                                                </span>
                                                <span className="font-semibold text-foreground">{service.timeline}</span>
                                            </div>
                                            <div className="h-px bg-zinc-200 my-3" />
                                            <div className="flex items-center gap-2 text-sm text-zinc-600">
                                                <Star size={14} className="text-yellow-500 fill-yellow-500" />
                                                <span className="italic">{service.stat}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-zinc-100 mt-4">
                                    <Button asChild className="flex-1 bg-black text-white hover:bg-zinc-800 h-12 rounded-xl text-base">
                                        <Link href="#contact">
                                            Book Consultation
                                            <ArrowRight size={16} className="ml-2" />
                                        </Link>
                                    </Button>
                                    <Button variant="outline" className="flex-1 h-12 rounded-xl text-base border-zinc-200 hover:bg-zinc-50" asChild>
                                        <Link href="#pricing">
                                            View Pricing ({service.price})
                                        </Link>
                                    </Button>
                                </div>
                            </DialogContent>
                        </Dialog>
                    ))}
                </div>
            </div>
        </section>
    );
}
