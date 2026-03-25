'use client';

import { useEffect } from 'react';

export function ServiceWorker() {
    useEffect(() => {
        if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
            navigator.serviceWorker
                .register('/sw.js')
                .catch(() => {
                    // Silent failure keeps service worker registration from polluting the console.
                });
        }
    }, []);

    return null; // This component doesn't render anything
}
