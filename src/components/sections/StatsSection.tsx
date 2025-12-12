'use client';

import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { useEffect, useState } from 'react';
import { FileCheck, Shield, Gavel, Users, Check, Globe } from 'lucide-react';

const stats = [
    { label: "Successful Cases", value: 500, suffix: "+", icon: FileCheck },
    { label: "Approval Rate", value: 95, suffix: "%", icon: Shield },
    { label: "Years Experience", value: 10, suffix: "+", icon: Gavel },
    { label: "Happy Clients", value: 1000, suffix: "+", icon: Users },
];

const features = [
    { label: "Licensed Attorney", icon: Check },
    { label: "5+ Languages", icon: Globe },
    { label: "Payment Plans", icon: Check },
];

function AnimatedCounter({ value, suffix }: { value: number; suffix: string }) {
    const count = useMotionValue(0);
    const rounded = useTransform(count, Math.round);
    const [displayValue, setDisplayValue] = useState(0);

    useEffect(() => {
        const controls = animate(count, value, {
            duration: 2,
            ease: "easeOut"
        });

        const unsubscribe = rounded.on("change", (latest) => {
            setDisplayValue(latest);
        });

        return () => {
            controls.stop();
            unsubscribe();
        };
    }, [count, rounded, value]);

    return <span>{displayValue}{suffix}</span>;
}

export function StatsSection() {
    const [inView, setInView] = useState(false);

    return (
        <section className="py-16 md:py-20 bg-zinc-950 text-white relative overflow-hidden">
            {/* Subtle premium gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-transparent pointer-events-none" />

            {/* Dot pattern */}
            <div className="absolute inset-0 bg-[radial-gradient(#ffffff15_1px,transparent_1px)] [background-size:24px_24px] opacity-20"></div>

            <div className="container-wide relative z-10">
                {/* Main Stats */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true, margin: "-100px" }}
                    onViewportEnter={() => setInView(true)}
                    className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 mb-12"
                >
                    {stats.map((stat, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1, type: "spring" as const, stiffness: 100 }}
                            className="flex flex-col items-center text-center group"
                        >
                            <div className="p-4 rounded-2xl bg-white/10 mb-4 group-hover:bg-white/20 transition-colors duration-300">
                                <stat.icon className="w-7 h-7 text-white" />
                            </div>
                            <div className="text-4xl md:text-5xl font-bold tracking-tight mb-2 text-white">
                                {inView ? (
                                    <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                                ) : (
                                    `0${stat.suffix}`
                                )}
                            </div>
                            <div className="text-sm font-medium text-white/70 uppercase tracking-wider">
                                {stat.label}
                            </div>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Separator */}
                <div className="w-full h-px bg-white/10 mb-8"></div>

                {/* Feature badges */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 }}
                    className="flex flex-wrap justify-center items-center gap-6 md:gap-10"
                >
                    {features.map((feature, index) => (
                        <div key={index} className="flex items-center gap-2 text-white/80">
                            <feature.icon className="w-5 h-5 text-green-400" />
                            <span className="text-sm font-medium">{feature.label}</span>
                        </div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
