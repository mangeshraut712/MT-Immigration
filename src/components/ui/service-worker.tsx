'use client';

import { useEffect } from 'react';

import { withBasePath } from '@/config/paths';

export function ServiceWorker() {
    useEffect(() => {
        if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
            const swUrl = withBasePath('/sw.js');
            navigator.serviceWorker
                .register(swUrl)
                .catch(() => {
                    // Silent failure keeps service worker registration from polluting the console.
                });
        }
    }, []);

    return null; // This component doesn't render anything
}
