// Advanced Analytics & Monitoring for 2026
import { useEffect, useCallback } from 'react';

// Performance Monitoring
export function usePerformanceMonitoring() {
    const measurePageLoad = useCallback(() => {
        if (typeof window !== 'undefined' && 'performance' in window) {
            const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
            const paint = performance.getEntriesByType('paint');

            const metrics = {
                // Core Web Vitals
                FCP: paint.find(entry => entry.name === 'first-contentful-paint')?.startTime,
                LCP: 0, // Will be measured by web-vitals library
                CLS: 0, // Will be measured by web-vitals library
                FID: 0, // Will be measured by web-vitals library

                // Navigation Timing
                DNS: navigation.domainLookupEnd - navigation.domainLookupStart,
                TCP: navigation.connectEnd - navigation.connectStart,
                TTFB: navigation.responseStart - navigation.requestStart,
                DOMContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
                LoadComplete: navigation.loadEventEnd - navigation.loadEventStart,

                // Resource Loading
                TotalResources: performance.getEntriesByType('resource').length,
                TotalResourceSize: performance.getEntriesByType('resource')
                    .reduce((total, entry) => total + ((entry as PerformanceResourceTiming).transferSize || 0), 0),

                // User Experience
                TimeToInteractive: 0, // Measured separately
            };

            // Send to analytics service
            if (process.env.NODE_ENV === 'development') {
                console.log('Performance Metrics:', metrics);
            }

            return metrics;
        }
    }, []);

    const trackUserInteraction = useCallback((action: string, metadata?: Record<string, unknown>) => {
        const event = {
            action,
            timestamp: Date.now(),
            url: window.location.href,
            userAgent: navigator.userAgent,
            viewport: `${window.innerWidth}x${window.innerHeight}`,
            ...metadata
        };

        if (process.env.NODE_ENV === 'development') {
            console.log('User Interaction:', event);
        }
    }, []);

    useEffect(() => {
        // Measure page load on mount
        const timer = setTimeout(measurePageLoad, 100);

        // Track page visibility changes
        const handleVisibilityChange = () => {
            trackUserInteraction('visibility_change', {
                hidden: document.hidden,
                timeSpent: Date.now() - performance.timeOrigin
            });
        };

        // Track errors
        const handleError = (event: ErrorEvent) => {
            trackUserInteraction('javascript_error', {
                message: event.message,
                filename: event.filename,
                lineno: event.lineno,
                colno: event.colno,
                stack: event.error?.stack
            });
        };

        // Track unhandled promise rejections
        const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
            trackUserInteraction('promise_rejection', {
                reason: event.reason?.toString(),
                stack: event.reason?.stack
            });
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);
        window.addEventListener('error', handleError);
        window.addEventListener('unhandledrejection', handleUnhandledRejection);

        return () => {
            clearTimeout(timer);
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            window.removeEventListener('error', handleError);
            window.removeEventListener('unhandledrejection', handleUnhandledRejection);
        };
    }, [measurePageLoad, trackUserInteraction]);

    return { measurePageLoad, trackUserInteraction };
}

// Real User Monitoring (RUM)
export function useRealUserMonitoring() {
    const trackRouteChange = useCallback((from: string, to: string) => {
        if (process.env.NODE_ENV === 'development') {
            console.log('Route Change:', { from, to, timestamp: Date.now() });
        }
    }, []);

    const trackConversion = useCallback((event: string, value?: number, metadata?: Record<string, unknown>) => {
        if (process.env.NODE_ENV === 'development') {
            console.log('Conversion:', { event, value, metadata, timestamp: Date.now() });
        }
    }, []);

    const trackFeatureUsage = useCallback((feature: string, action: string, metadata?: Record<string, unknown>) => {
        if (process.env.NODE_ENV === 'development') {
            console.log('Feature Usage:', { feature, action, metadata, timestamp: Date.now() });
        }
    }, []);

    return { trackRouteChange, trackConversion, trackFeatureUsage };
}

// A/B Testing Framework
export function useABTesting() {
    const getVariant = useCallback((experimentId: string, variants: string[]): string => {
        // Simple hash-based variant assignment
        const userId = getUserId();
        const hash = simpleHash(userId + experimentId);
        const variantIndex = Math.abs(hash) % variants.length;
        return variants[variantIndex];
    }, []);

    const trackExperiment = useCallback((experimentId: string, variant: string, event: string, metadata?: Record<string, unknown>) => {
        if (process.env.NODE_ENV === 'development') {
            console.log('A/B Test Event:', { experimentId, variant, event, metadata });
        }
    }, []);

    return { getVariant, trackExperiment };
}

// Utility functions
function getUserId(): string {
    // Get or create anonymous user ID
    if (typeof window !== 'undefined') {
        let userId = localStorage.getItem('mt-user-id');
        if (!userId) {
            userId = 'user_' + Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
            localStorage.setItem('mt-user-id', userId);
        }
        return userId;
    }
    return 'anonymous';
}

function simpleHash(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32-bit integer
    }
    return hash;
}

// Export analytics utilities
export const analytics = {
    track: (event: string, properties?: Record<string, unknown>) => {
        if (process.env.NODE_ENV === 'development') {
            console.log('Analytics Event:', { event, properties, timestamp: Date.now() });
        }
    },

    identify: (userId: string, traits?: Record<string, unknown>) => {
        if (process.env.NODE_ENV === 'development') {
            console.log('User Identify:', { userId, traits });
        }
    },

    page: (name?: string, properties?: Record<string, unknown>) => {
        if (process.env.NODE_ENV === 'development') {
            console.log('Page View:', { name, properties, url: window.location.href });
        }
    }
};