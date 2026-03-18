'use client';

import { useEffect } from 'react';
import { logger } from '@/lib/logger';

export function WebVitals() {
    useEffect(() => {
        // Only run on client side
        if (typeof window === 'undefined') return;

        // Web Vitals tracking
        import('web-vitals').then(({ onCLS, onFCP, onLCP, onTTFB }) => {
            // Cumulative Layout Shift
            onCLS((metric) => {
                logger.performance('CLS', metric.value, {
                    rating: metric.rating,
                    id: metric.id,
                });
            });

            // First Contentful Paint
            onFCP((metric) => {
                logger.performance('FCP', metric.value, {
                    rating: metric.rating,
                    id: metric.id,
                });
            });

            // Largest Contentful Paint
            onLCP((metric) => {
                logger.performance('LCP', metric.value, {
                    rating: metric.rating,
                    id: metric.id,
                });
            });

            // Time to First Byte
            onTTFB((metric) => {
                logger.performance('TTFB', metric.value, {
                    rating: metric.rating,
                    id: metric.id,
                });
            });
        }).catch((error) => {
            logger.error('Failed to load web-vitals', error);
        });
    }, []);

    return null; // This component doesn't render anything
}