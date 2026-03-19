'use client';

import { usePerformanceMonitoring } from '@/lib/analytics';
import { useEffect } from 'react';

export function Analytics() {
    const { measurePageLoad, trackUserInteraction } = usePerformanceMonitoring();

    useEffect(() => {
        // Measure page load performance
        const metrics = measurePageLoad();

        // Track page view
        trackUserInteraction('page_view', {
            path: window.location.pathname,
            referrer: document.referrer,
            metrics,
        });

        // Track scroll depth
        let maxScrollDepth = 0;
        const trackScroll = () => {
            const scrollTop = window.pageYOffset;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollPercent = Math.round((scrollTop / docHeight) * 100);

            if (scrollPercent > maxScrollDepth) {
                maxScrollDepth = scrollPercent;
                if (scrollPercent % 25 === 0) { // Track at 25%, 50%, 75%, 100%
                    trackUserInteraction('scroll_depth', { depth: scrollPercent });
                }
            }
        };

        const throttledTrackScroll = throttle(trackScroll, 100);
        window.addEventListener('scroll', throttledTrackScroll);

        // Track time on page
        const startTime = Date.now();
        const trackTimeOnPage = () => {
            const timeSpent = Math.round((Date.now() - startTime) / 1000);
            if (timeSpent % 30 === 0 && timeSpent > 0) { // Track every 30 seconds
                trackUserInteraction('time_on_page', { seconds: timeSpent });
            }
        };

        const timeInterval = setInterval(trackTimeOnPage, 30000);

        // Track visibility changes (user switching tabs)
        const handleVisibilityChange = () => {
            if (document.hidden) {
                trackUserInteraction('tab_hidden');
            } else {
                trackUserInteraction('tab_visible');
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            window.removeEventListener('scroll', throttledTrackScroll);
            clearInterval(timeInterval);
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, [measurePageLoad, trackUserInteraction]);

    return null; // This component doesn't render anything
}

// Utility function for throttling
function throttle<T extends (...args: unknown[]) => void>(func: T, limit: number) {
    let inThrottle: boolean;
    return function (this: unknown, ...args: Parameters<T>) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}