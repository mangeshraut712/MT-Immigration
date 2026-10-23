// Service Worker for PWA functionality
const CACHE_VERSION = 'v1.2.0';
const STATIC_CACHE = `mt-immigration-static-${CACHE_VERSION}`;
const DYNAMIC_CACHE = `mt-immigration-dynamic-${CACHE_VERSION}`;
const CACHEABLE_DESTINATIONS = new Set(['style', 'script', 'image', 'font', 'manifest']);

function scopedUrl(path) {
    return new URL(path, self.registration.scope).toString();
}

self.addEventListener('install', (event) => {
    event.waitUntil(
        (async () => {
            const cache = await caches.open(STATIC_CACHE);
            await cache.addAll([
                scopedUrl('manifest.json'),
                scopedUrl('brand/mtlogo.png'),
                scopedUrl('favicon.ico'),
            ]);
            self.skipWaiting();
        })()
    );
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        (async () => {
            const cacheNames = await caches.keys();
            await Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
                        return caches.delete(cacheName);
                    }
                    return undefined;
                })
            );
            self.clients.claim();
        })()
    );
});

self.addEventListener('fetch', (event) => {
    if (event.request.method !== 'GET' || event.request.url.startsWith('chrome-extension://')) {
        return;
    }

    const requestUrl = new URL(event.request.url);
    if (requestUrl.origin !== self.location.origin || requestUrl.pathname.includes('/api/')) {
        return;
    }

    if (event.request.mode === 'navigate' || event.request.destination === 'document') {
        event.respondWith(
            fetch(event.request).catch(
                () =>
                    new Response('Offline - Please check your connection', {
                        status: 503,
                        statusText: 'Service Unavailable',
                        headers: { 'Content-Type': 'text/plain; charset=utf-8' },
                    }),
            ),
        );
        return;
    }

    if (!CACHEABLE_DESTINATIONS.has(event.request.destination)) {
        return;
    }

    event.respondWith(
        (async () => {
            const cachedResponse = await caches.match(event.request);
            if (cachedResponse) {
                return cachedResponse;
            }

            const networkResponse = await fetch(event.request);
            if (networkResponse.ok && !networkResponse.redirected && networkResponse.status < 300) {
                const cache = await caches.open(DYNAMIC_CACHE);
                cache.put(event.request, networkResponse.clone());
            }

            return networkResponse;
        })()
    );
});

self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    event.waitUntil(self.clients.openWindow(scopedUrl('')));
});
