/**
 * Finans Sistemi - Service Worker
 * PWA için offline destek ve cache yönetimi
 */

const CACHE_NAME = 'hc-finans-v2.0.0';
const RUNTIME_CACHE = 'hc-finans-runtime';

// Cache'lenecek dosyalar
const STATIC_CACHE_URLS = [
    '/finans/',
    '/finans/dashboard.html',
    '/finans/manifest.json',
    '/finans/src/css/main.css',
    '/finans/src/js/core/app.js',
    '/finans/src/js/core/config.js',
    '/finans/src/js/core/router.js',
    '/finans/src/js/services/storage.js',
    '/finans/src/js/utils/helpers.js',
    '/finans/src/js/modules/categories.js',
    '/finans/assets/logo.svg',
    '/finans/assets/logo.png',
    'https://fonts.googleapis.com/css2?family=Nunito:wght@300;400;500;600;700&family=Comic+Neue:wght@400;700&display=swap',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css'
];

// Network-first stratejisi için URL'ler
const NETWORK_FIRST_URLS = [
    '/finans/api/',
    '/finans/sync'
];

// Cache-first stratejisi için URL'ler
const CACHE_FIRST_URLS = [
    '/finans/assets/',
    '/finans/src/css/',
    '/finans/src/js/',
    '.woff2',
    '.woff',
    '.ttf'
];

// Install event
self.addEventListener('install', (event) => {
    console.log('Service Worker: Install');
    
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Service Worker: Caching static files');
                return cache.addAll(STATIC_CACHE_URLS);
            })
            .then(() => self.skipWaiting())
            .catch((error) => {
                console.error('Service Worker: Cache install failed:', error);
            })
    );
});

// Activate event
self.addEventListener('activate', (event) => {
    console.log('Service Worker: Activate');
    
    event.waitUntil(
        caches.keys()
            .then((cacheNames) => {
                return Promise.all(
                    cacheNames.map((cacheName) => {
                        if (cacheName !== CACHE_NAME && cacheName !== RUNTIME_CACHE) {
                            console.log('Service Worker: Removing old cache:', cacheName);
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
            .then(() => self.clients.claim())
    );
});

// Fetch event
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);
    
    // Skip non-GET requests
    if (request.method !== 'GET') {
        return;
    }
    
    // Skip chrome-extension requests
    if (url.protocol === 'chrome-extension:') {
        return;
    }
    
    // Network-first strategy
    if (NETWORK_FIRST_URLS.some(urlPattern => url.pathname.includes(urlPattern))) {
        event.respondWith(networkFirst(request));
        return;
    }
    
    // Cache-first strategy
    if (CACHE_FIRST_URLS.some(urlPattern => 
        url.pathname.includes(urlPattern) || url.pathname.endsWith(urlPattern)
    )) {
        event.respondWith(cacheFirst(request));
        return;
    }
    
    // Default: Network with cache fallback
    event.respondWith(networkWithCacheFallback(request));
});

// Network-first strategy
async function networkFirst(request) {
    try {
        const networkResponse = await fetch(request);
        
        if (networkResponse && networkResponse.status === 200) {
            const cache = await caches.open(RUNTIME_CACHE);
            cache.put(request, networkResponse.clone());
        }
        
        return networkResponse;
    } catch (error) {
        const cachedResponse = await caches.match(request);
        return cachedResponse || offlineResponse();
    }
}

// Cache-first strategy
async function cacheFirst(request) {
    const cachedResponse = await caches.match(request);
    
    if (cachedResponse) {
        // Update cache in background
        fetch(request)
            .then(response => {
                if (response && response.status === 200) {
                    caches.open(RUNTIME_CACHE)
                        .then(cache => cache.put(request, response));
                }
            })
            .catch(() => {});
        
        return cachedResponse;
    }
    
    try {
        const networkResponse = await fetch(request);
        
        if (networkResponse && networkResponse.status === 200) {
            const cache = await caches.open(RUNTIME_CACHE);
            cache.put(request, networkResponse.clone());
        }
        
        return networkResponse;
    } catch (error) {
        return offlineResponse();
    }
}

// Network with cache fallback
async function networkWithCacheFallback(request) {
    try {
        const networkResponse = await fetch(request);
        
        if (networkResponse && networkResponse.status === 200) {
            const cache = await caches.open(RUNTIME_CACHE);
            cache.put(request, networkResponse.clone());
        }
        
        return networkResponse;
    } catch (error) {
        const cachedResponse = await caches.match(request);
        return cachedResponse || offlineResponse();
    }
}

// Offline response
function offlineResponse() {
    return new Response(`
        <!DOCTYPE html>
        <html lang="tr">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Çevrimdışı - Hayali Çizgili Finans</title>
            <style>
                body {
                    font-family: 'Nunito', sans-serif;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    min-height: 100vh;
                    margin: 0;
                    background-color: #f5f5f5;
                    color: #212121;
                }
                .offline-container {
                    text-align: center;
                    padding: 2rem;
                    max-width: 400px;
                }
                .offline-icon {
                    font-size: 4rem;
                    color: #F8C3CD;
                    margin-bottom: 1rem;
                }
                h1 {
                    color: #212121;
                    margin-bottom: 0.5rem;
                }
                p {
                    color: #757575;
                    line-height: 1.5;
                }
                .retry-btn {
                    display: inline-block;
                    margin-top: 1.5rem;
                    padding: 0.75rem 1.5rem;
                    background-color: #F8C3CD;
                    color: #212121;
                    text-decoration: none;
                    border-radius: 0.5rem;
                    font-weight: 600;
                    transition: opacity 0.3s;
                }
                .retry-btn:hover {
                    opacity: 0.8;
                }
            </style>
        </head>
        <body>
            <div class="offline-container">
                <div class="offline-icon">📡</div>
                <h1>Çevrimdışısınız</h1>
                <p>İnternet bağlantınız yok gibi görünüyor. Lütfen bağlantınızı kontrol edin ve tekrar deneyin.</p>
                <a href="javascript:location.reload()" class="retry-btn">Tekrar Dene</a>
            </div>
        </body>
        </html>
    `, {
        headers: { 'Content-Type': 'text/html; charset=utf-8' }
    });
}

// Background sync
self.addEventListener('sync', (event) => {
    console.log('Service Worker: Sync event', event.tag);
    
    if (event.tag === 'sync-transactions') {
        event.waitUntil(syncTransactions());
    }
});

// Sync transactions
async function syncTransactions() {
    // TODO: Implement transaction sync with backend
    console.log('Syncing transactions...');
}

// Push notification
self.addEventListener('push', (event) => {
    if (!event.data) return;
    
    const data = event.data.json();
    const options = {
        body: data.body,
        icon: '/finans/assets/logo.png',
        badge: '/finans/assets/logo.png',
        vibrate: [200, 100, 200],
        data: data.data,
        actions: data.actions || []
    };
    
    event.waitUntil(
        self.registration.showNotification(data.title, options)
    );
});

// Notification click
self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    
    const { action, notification } = event;
    const { data } = notification;
    
    if (action && data.actions && data.actions[action]) {
        event.waitUntil(
            clients.openWindow(data.actions[action])
        );
    } else if (data.url) {
        event.waitUntil(
            clients.openWindow(data.url)
        );
    } else {
        event.waitUntil(
            clients.openWindow('/finans/')
        );
    }
});

// Message handler
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});
