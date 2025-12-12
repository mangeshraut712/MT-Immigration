'use client';

import { motion } from 'framer-motion';
import { Scale } from 'lucide-react';

interface LoadingProps {
    size?: 'sm' | 'md' | 'lg';
    fullScreen?: boolean;
    text?: string;
}

export function Loading({ size = 'md', fullScreen = false, text }: LoadingProps) {
    const sizeClasses = {
        sm: 'w-8 h-8',
        md: 'w-12 h-12',
        lg: 'w-16 h-16',
    };

    const iconSizes = {
        sm: 16,
        md: 24,
        lg: 32,
    };

    const content = (
        <div className="flex flex-col items-center justify-center gap-4">
            <motion.div
                className={`${sizeClasses[size]} bg-foreground text-background rounded-xl flex items-center justify-center`}
                animate={{
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, -5, 0],
                }}
                transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: 'easeInOut',
                }}
            >
                <Scale size={iconSizes[size]} />
            </motion.div>
            {text && (
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-sm text-muted-foreground"
                >
                    {text}
                </motion.p>
            )}
        </div>
    );

    if (fullScreen) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
                {content}
            </div>
        );
    }

    return content;
}

/**
 * Skeleton loading component for content placeholders
 */
interface SkeletonProps {
    className?: string;
    animate?: boolean;
}

export function Skeleton({ className = '', animate = true }: SkeletonProps) {
    return (
        <div
            className={`bg-zinc-200 rounded-md ${animate ? 'animate-pulse' : ''} ${className}`}
        />
    );
}

/**
 * Card skeleton for loading service cards, testimonials, etc.
 */
export function CardSkeleton() {
    return (
        <div className="bg-white rounded-2xl p-8 border border-zinc-100">
            <Skeleton className="w-16 h-16 rounded-xl mb-6" />
            <Skeleton className="w-3/4 h-6 mb-3" />
            <Skeleton className="w-full h-4 mb-2" />
            <Skeleton className="w-5/6 h-4 mb-6" />
            <div className="flex justify-between items-center pt-6 border-t border-zinc-50">
                <Skeleton className="w-20 h-6 rounded-full" />
                <Skeleton className="w-16 h-4" />
            </div>
        </div>
    );
}

/**
 * Text skeleton for paragraphs
 */
export function TextSkeleton({ lines = 3 }: { lines?: number }) {
    return (
        <div className="space-y-2">
            {Array.from({ length: lines }).map((_, i) => (
                <Skeleton
                    key={i}
                    className={`h-4 ${i === lines - 1 ? 'w-4/5' : 'w-full'}`}
                />
            ))}
        </div>
    );
}
