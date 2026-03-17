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
                question: "How do consultations work?",
                answer: "Consultations are the first step for most matters. They are used to identify the issue, spot deadlines, review available documents, and decide whether the next move is a filing, further evidence gathering, or a more urgent strategy session."
            },
            {
                question: "Do you offer virtual consultations?",
                answer: "Yes. The practice is set up for remote consultations by phone or video, which makes it possible to review many immigration matters without an in-person visit."
            },
            {
                question: "What languages do you support?",
                answer: "English consultations are supported directly, and interpreter-friendly workflows can be arranged when a client is more comfortable in another language."
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
                answer: "Installment options may be available depending on the scope of work and urgency of the matter. Payment structure is discussed during the consultation so the client understands what is due before work begins and what can be spread out."
            },
            {
                question: "Do you offer sliding-scale pricing?",
                answer: "Reduced-fee arrangements may be considered in limited matters. If affordability is a concern, raise it during the consultation so the office can explain what options are realistically available."
            },
        ]
    },
    {
        category: "Process & Timeline",
        faqs: [
            {
                question: "How fast can you file my application?",
                answer: "Timelines depend on the case type, how quickly documents are collected, and whether there are urgent deadlines. Straightforward matters can often move quickly once the required evidence is in hand."
            },
            {
                question: "Will you prepare me for my interview?",
                answer: "Yes. Interview preparation is part of many immigration matters, especially where officer questions, credibility, or document organization can affect the result."
            },
            {
                question: "How do I track my case status?",
                answer: "Status updates are typically handled through email and scheduled follow-up. The exact communication workflow depends on the scope of representation and the needs of the case."
            },
        ]
    },
    {
        category: "Legal & Results",
        faqs: [
            {
                question: "Do you guarantee results?",
                answer: "No attorney can guarantee results in immigration matters because the final decision belongs to the government agency or immigration court handling the case. What you should expect is candid advice, disciplined preparation, and honest communication about risk."
            },
            {
                question: "What if my case is denied?",
                answer: "If your case is denied, we'll review the decision and discuss your options, which may include filing an appeal, motion to reopen, or alternative immigration pathways. We stand by our clients through every step of the process."
            },
            {
                question: "Are you licensed to practice immigration law?",
                answer: "This website is built around an attorney-led immigration practice. Representation details, licensing, and engagement terms should always be confirmed during the consultation and in the written engagement agreement."
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
