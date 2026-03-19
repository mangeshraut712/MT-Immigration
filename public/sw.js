// Service Worker for PWA functionality
const CACHE_VERSION = 'v1.0.0';
const STATIC_CACHE = `mt-immigration-static-${CACHE_VERSION}`;
const DYNAMIC_CACHE = `mt-immigration-dynamic-${CACHE_VERSION}`;

// Resources to cache immediately
const STATIC_ASSETS = [
    '/',
    '/manifest.json',
    '/brand/mtlogo.png',
    '/favicon.ico',
    '/robots.txt',
    '/sitemap.xml'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
    event.waitUntil(
        (async () => {
            const cache = await caches.open(STATIC_CACHE);
            await cache.addAll(STATIC_ASSETS);
            self.skipWaiting();
        })()
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
    event.waitUntil(
        (async () => {
            const cacheNames = await caches.keys();
            await Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
                        return caches.delete(cacheName);
                    }
                })
            );
            self.clients.claim();
        })()
    );
});

// Fetch event - serve from cache or network
self.addEventListener('fetch', (event) => {
    // Skip non-GET requests and chrome-extension requests
    if (event.request.method !== 'GET' || event.request.url.startsWith('chrome-extension://')) {
        return;
    }

    // Skip API requests for real-time functionality
    if (event.request.url.includes('/api/')) {
        return;
    }

    event.respondWith(
        (async () => {
            // Try cache first for static assets
            const cachedResponse = await caches.match(event.request);
            if (cachedResponse) {
                return cachedResponse;
            }

            try {
                // Fetch from network
                const networkResponse = await fetch(event.request);

                // Cache successful responses
                if (networkResponse.ok) {
                    const cache = await caches.open(DYNAMIC_CACHE);
                    cache.put(event.request, networkResponse.clone());
                }

                return networkResponse;
            } catch (error) {
                // Return offline fallback for navigation requests
                if (event.request.destination === 'document') {
                    const cache = await caches.open(STATIC_CACHE);
                    return cache.match('/') || new Response('Offline - Please check your connection', {
                        status: 503,
                        statusText: 'Service Unavailable'
                    });
                }

                throw error;
            }
        })()
    );
});

// Background sync for offline form submissions
self.addEventListener('sync', (event) => {
    if (event.tag === 'background-sync') {
        event.waitUntil(doBackgroundSync());
    }
});

async function doBackgroundSync() {
    // Handle offline form submissions
    try {
        const cache = await caches.open('form-submissions');
        const keys = await cache.keys();

        for (const request of keys) {
            try {
                await fetch(request);
                await cache.delete(request);
            } catch (error) {
                console.error('Background sync failed:', error);
            }
        }
    } catch (error) {
        console.error('Background sync error:', error);
    }
}

// Push notifications (for future use)
self.addEventListener('push', (event) => {
    if (event.data) {
        const data = event.data.json();
        const options = {
            body: data.body,
            icon: '/brand/mtlogo.png',
            badge: '/brand/mtlogo.png',
            vibrate: [100, 50, 100],
            data: {
                dateOfArrival: Date.now(),
                primaryKey: data.primaryKey
            }
        };

        event.waitUntil(
            self.registration.showNotification(data.title, options)
        );
    }
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
    event.notification.close();

    event.waitUntil(
        clients.openWindow('/')
    );
});