'use client';

import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

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

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.15 }
    }
};

const cardVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: { type: "spring" as const, stiffness: 100, damping: 15 }
    }
};

export function TestimonialsSection() {
    return (
        <section id="testimonials" className="section-padding bg-white overflow-hidden relative">
            {/* Solid White Background */}
            <div className="absolute inset-0 bg-white" />

            <div className="container-wide relative z-10">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
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
                    <p className="text-xl text-zinc-500 leading-relaxed">
                        Real stories from real clients who found their path forward with us.
                    </p>
                </motion.div>

                {/* Testimonials Grid */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-50px" }}
                    className="grid md:grid-cols-2 gap-8"
                >
                    {testimonials.map((testimonial, index) => (
                        <motion.div key={index} variants={cardVariants}>
                            <div className="h-full bg-white rounded-2xl border border-zinc-100 shadow-sm hover:shadow-xl p-8 transition-all duration-300 group hover:-translate-y-1 flex flex-col">
                                {/* Quote Icon */}
                                <div className="mb-6">
                                    <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                                        <Quote className="w-6 h-6" />
                                    </div>
                                </div>

                                {/* Quote Text */}
                                <p className="text-lg leading-relaxed mb-8 text-zinc-600 italic flex-grow">
                                    &quot;{testimonial.quote}&quot;
                                </p>

                                {/* Footer */}
                                <div className="flex items-center justify-between pt-6 border-t border-zinc-50 mt-auto">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-zinc-100 flex items-center justify-center font-bold text-zinc-500 text-sm">
                                            {testimonial.name.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="font-serif font-medium text-foreground">{testimonial.name}</p>
                                            <p className="text-xs text-zinc-400 uppercase tracking-wide">{testimonial.location}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="flex gap-0.5 mb-1 justify-end">
                                            {[...Array(testimonial.rating)].map((_, i) => (
                                                <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                            ))}
                                        </div>
                                        <span className="text-xs font-medium bg-zinc-50 text-zinc-500 px-2 py-1 rounded-md">
                                            {testimonial.case}
                                        </span>
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
