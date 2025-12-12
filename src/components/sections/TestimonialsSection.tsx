'use client';

import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { fadeUpVariants, staggerContainerVariants, scaleVariants } from '@/lib/animations';

const testimonials = [
    {
        name: "Maria S.",
        location: "New York, NY",
        case: "Marriage-Based Green Card",
        quote: "M&T made what seemed impossible feel manageable. They guided us through every step with patience and expertise. Our case was approved in just 8 months!",
        rating: 5
    },
    {
        name: "Ahmed K.",
        location: "Houston, TX",
        case: "F-1 Student Visa",
        quote: "As an international student, the visa process was overwhelming. M&T simplified everything and prepared me thoroughly for my interview. Highly recommend!",
        rating: 5
    },
    {
        name: "Elena R.",
        location: "Los Angeles, CA",
        case: "Asylum Case",
        quote: "They truly care about their clients. The team went above and beyond to gather evidence for my case. I finally feel safe thanks to their dedication.",
        rating: 5
    },
    {
        name: "David L.",
        location: "Chicago, IL",
        case: "Change of Status",
        quote: "Professional, responsive, and affordable. They helped me transition from a tourist visa to a work permit seamlessly. Worth every penny.",
        rating: 5
    },
];

export function TestimonialsSection() {
    return (
        <section id="testimonials" className="section-padding bg-zinc-50 overflow-hidden relative">
            {/* Texture */}
            <div className="absolute inset-0 bg-white/50" />

            {/* Gradient Blob */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-100/50 rounded-full blur-[100px] pointer-events-none" />

            <div className="container-wide relative z-10">
                {/* Header */}
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={fadeUpVariants}
                    className="text-center mb-16 max-w-3xl mx-auto"
                >
                    <div className="flex items-center justify-center gap-3 mb-6">
                        <div className="h-px w-12 bg-primary"></div>
                        <span className="text-sm font-semibold tracking-widest uppercase text-primary">Success Stories</span>
                        <div className="h-px w-12 bg-primary"></div>
                    </div>
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-medium text-foreground mb-6 leading-[1.1]">
                        Trusted by families <br />
                        <span className="text-zinc-400 italic">across the globe.</span>
                    </h2>
                    <p className="text-xl text-zinc-500 leading-relaxed max-w-2xl mx-auto text-balance">
                        Real stories from real clients who found their path forward with us.
                    </p>
                </motion.div>

                {/* Testimonials Grid */}
                <motion.div
                    variants={staggerContainerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-50px" }}
                    className="grid md:grid-cols-2 gap-8"
                >
                    {testimonials.map((testimonial, index) => (
                        <motion.div key={index} variants={scaleVariants}>
                            <div className="h-full bg-white rounded-2xl border border-zinc-100 shadow-sm hover:shadow-xl p-8 transition-all duration-300 group hover:-translate-y-1 flex flex-col relative overflow-hidden">
                                {/* Decorative quote mark */}
                                <div className="absolute top-4 right-8 text-9xl font-serif text-zinc-50 select-none opacity-50 z-0">
                                    &rdquo;
                                </div>

                                <div className="relative z-10 flex flex-col h-full">
                                    {/* Quote Text */}
                                    <p className="text-lg leading-relaxed mb-6 text-zinc-600 italic font-medium">
                                        &quot;{testimonial.quote}&quot;
                                    </p>

                                    {/* Rating */}
                                    <div className="flex mb-6">
                                        {[...Array(testimonial.rating)].map((_, i) => (
                                            <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400 mr-1" />
                                        ))}
                                    </div>

                                    {/* Footer */}
                                    <div className="flex items-center gap-4 mt-auto pt-6 border-t border-zinc-50">
                                        <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-lg">
                                            {testimonial.name.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="font-serif font-semibold text-foreground text-lg">{testimonial.name}</p>
                                            <p className="text-sm text-zinc-400">{testimonial.location}</p>
                                            <p className="text-xs font-medium text-blue-600 mt-0.5">{testimonial.case}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
