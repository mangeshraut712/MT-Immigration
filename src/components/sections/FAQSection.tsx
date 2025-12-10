'use client';

import { motion } from 'framer-motion';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { HelpCircle } from "lucide-react";

const faqCategories = [
    {
        category: "Getting Started",
        faqs: [
            {
                question: "What does 'low-bono' mean?",
                answer: "Low-bono means we offer legal services at a reduced rate compared to standard market prices, specifically to help low-to-moderate income individuals access justice. Our fees are typically 30-50% lower than traditional firms while maintaining the same high-quality representation."
            },
            {
                question: "Do you offer virtual consultations?",
                answer: "Yes! We are a fully digital-first firm offering secure video consultations via Zoom or WhatsApp for clients nationwide and internationally. All consultations are confidential and conducted by licensed attorneys."
            },
            {
                question: "What languages do you support?",
                answer: "We provide support in English, Spanish, Urdu, Punjabi, and French through our multilingual team and professional translation services. We can also arrange interpreters for other languages as needed."
            },
        ]
    },
    {
        category: "Pricing & Payments",
        faqs: [
            {
                question: "Are USCIS fees included in your pricing?",
                answer: "No, government filing fees are separate and paid directly to the Department of Homeland Security. Our fees cover legal representation, form preparation, and comprehensive case management only. We'll provide a complete breakdown of all costs during your consultation."
            },
            {
                question: "How do payment plans work?",
                answer: "We offer flexible installments via Stripe. Depending on the case type, you can spread your legal fee payments over 3-6 months with no interest charges. We require a small retainer to begin work, with the balance divided into equal monthly payments."
            },
            {
                question: "Do you offer sliding-scale pricing?",
                answer: "Yes, we offer income-based sliding-scale fees for eligible clients. This may require documentation of household income. Our goal is to make quality legal representation accessible to everyone, regardless of financial situation."
            },
        ]
    },
    {
        category: "Process & Timeline",
        faqs: [
            {
                question: "How fast can you file my application?",
                answer: "Timelines depend on your cooperation in providing documents. Typically, we can prepare and file within 1-2 weeks of receiving all necessary information and documentation. Rush services are available for urgent cases."
            },
            {
                question: "Will you prepare me for my interview?",
                answer: "Absolutely. We conduct thorough mock interviews to ensure you are confident and prepared for all types of questions immigration officers may ask. We provide detailed guidance on what to expect, what documents to bring, and how to present your case effectively."
            },
            {
                question: "How do I track my case status?",
                answer: "We provide regular updates via email and text message. You'll also have access to our client portal where you can view case progress, upload documents, and communicate with your attorney 24/7."
            },
        ]
    },
    {
        category: "Legal & Results",
        faqs: [
            {
                question: "Do you guarantee results?",
                answer: "No attorney can guarantee results in immigration cases as the final decision rests with USCIS or the Department of State. However, we guarantee diligent, expert, and honest representation to maximize your chances of success. We have a 95% approval rate across all case types."
            },
            {
                question: "What if my case is denied?",
                answer: "If your case is denied, we'll review the decision and discuss your options, which may include filing an appeal, motion to reopen, or alternative immigration pathways. We stand by our clients through every step of the process."
            },
            {
                question: "Are you licensed to practice immigration law?",
                answer: "Yes, our lead attorney is fully licensed and a member of the American Immigration Lawyers Association (AILA). We maintain the highest ethical standards and stay current with all immigration law changes."
            },
        ]
    },
];

export function FAQSection() {
    return (
        <section id="faq" className="section-padding bg-white relative overflow-hidden">
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
                        <span className="text-sm font-semibold tracking-widest uppercase text-primary">Common Questions</span>
                        <div className="h-px w-12 bg-primary"></div>
                    </div>
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-medium tracking-tight text-foreground mb-6 leading-[1.1]">
                        Frequently Asked <br />
                        <span className="text-zinc-400 italic">Questions.</span>
                    </h2>
                    <p className="text-xl text-zinc-500 leading-relaxed max-w-2xl mx-auto">
                        Clear answers to help you understand our process and services.
                    </p>
                </motion.div>

                {/* FAQ Categories */}
                <div className="space-y-12 max-w-4xl mx-auto">
                    {faqCategories.map((category, categoryIndex) => (
                        <motion.div
                            key={categoryIndex}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ duration: 0.5, delay: categoryIndex * 0.1 }}
                        >
                            {/* Category Header */}
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
                                    <HelpCircle className="w-5 h-5 text-blue-600" />
                                </div>
                                <h3 className="text-2xl font-serif font-medium text-foreground">{category.category}</h3>
                            </div>

                            {/* FAQs */}
                            <Accordion type="single" collapsible className="space-y-4">
                                {category.faqs.map((faq, faqIndex) => (
                                    <motion.div
                                        key={faqIndex}
                                        initial={{ opacity: 0, x: -20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: faqIndex * 0.05 }}
                                    >
                                        <AccordionItem
                                            value={`${categoryIndex}-${faqIndex}`}
                                            className="bg-white border border-zinc-100 rounded-2xl px-6 shadow-sm hover:border-zinc-200 transition-all duration-300 data-[state=open]:border-blue-100 data-[state=open]:shadow-md data-[state=open]:bg-blue-50/10"
                                        >
                                            <AccordionTrigger className="text-left text-base md:text-lg font-semibold hover:text-primary transition-colors py-6 hover:no-underline">
                                                {faq.question}
                                            </AccordionTrigger>
                                            <AccordionContent className="text-muted-foreground leading-relaxed pb-6 text-base">
                                                {faq.answer}
                                            </AccordionContent>
                                        </AccordionItem>
                                    </motion.div>
                                ))}
                            </Accordion>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
