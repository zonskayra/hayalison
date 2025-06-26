/* ===========================================
   SERVICE WORKER - PWA FEATURES
   =========================================== */

const CACHE_NAME = 'mobile-app-v1.0.0';
const STATIC_CACHE = 'static-v1';
const DYNAMIC_CACHE = 'dynamic-v1';
const IMAGE_CACHE = 'images-v1';

// Files to cache immediately
const STATIC_FILES = [
    '/',
    '/index.html',
    '/critical-css.css',
    '/mobile-styles.css',
    '/web-styles.css',
    '/device-detector.js',
    '/mobile-performance.js',
    '/image-optimizer.js',
    '/images/logo.png',
    '/manifest.json'
];

// Dynamic files to cache on first visit
const DYNAMIC_FILES = [
    '/urun1.html',
    '/urun2.html',
    '/images/boyama-kitabi-main.jpg',
    '/images/sarki-kitabi.jpg'
];

// Image files for intelligent caching
const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];

/**
 * Service Worker Install Event
 */
self.addEventListener('install', (event) => {
    console.log('🔧 Service Worker installing...');
    
    event.waitUntil(
        Promise.all([
            // Cache static files
            caches.open(STATIC_CACHE).then(cache => {
                console.log('📦 Caching static files...');
                return cache.addAll(STATIC_FILES);
            }),
            
            // Skip waiting to activate immediately
            self.skipWaiting()
        ])
    );
});

/**
 * Service Worker Activate Event
 */
self.addEventListener('activate', (event) => {
    console.log('✅ Service Worker activating...');
    
    event.waitUntil(
        Promise.all([
            // Clean old caches
            caches.keys().then(cacheNames => {
                return Promise.all(
                    cacheNames.map(cacheName => {
                        if (cacheName !== STATIC_CACHE && 
                            cacheName !== DYNAMIC_CACHE && 
                            cacheName !== IMAGE_CACHE) {
                            console.log('🗑️ Deleting old cache:', cacheName);
                            return caches.delete(cacheName);
                        }
                    })
                );
            }),
            
            // Take control of all clients
            self.clients.claim()
        ])
    );
});

/**
 * Service Worker Fetch Event
 */
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);
    
    // Skip cross-origin requests
    if (url.origin !== location.origin) {
        return;
    }
    
    // Handle different types of requests
    if (isImageRequest(request)) {
        event.respondWith(handleImageRequest(request));
    } else if (isStaticAsset(request)) {
        event.respondWith(handleStaticRequest(request));
    } else if (isPageRequest(request)) {
        event.respondWith(handlePageRequest(request));
    } else {
        event.respondWith(handleDynamicRequest(request));
    }
});

/**
 * Check if request is for an image
 */
function isImageRequest(request) {
    return IMAGE_EXTENSIONS.some(ext => request.url.includes(ext));
}

/**
 * Check if request is for static asset
 */
function isStaticAsset(request) {
    return request.url.includes('.css') || 
           request.url.includes('.js') || 
           request.url.includes('/images/logo');
}

/**
 * Check if request is for a page
 */
function isPageRequest(request) {
    return request.destination === 'document' || 
           request.url.includes('.html');
}

/**
 * Handle image requests with cache-first strategy
 */
function handleImageRequest(request) {
    return caches.open(IMAGE_CACHE).then(cache => {
        return cache.match(request).then(response => {
            if (response) {
                console.log('🖼️ Image served from cache:', request.url);
                return response;
            }
            
            return fetch(request).then(fetchResponse => {
                // Only cache successful responses
                if (fetchResponse.ok) {
                    cache.put(request, fetchResponse.clone());
                    console.log('📸 Image cached:', request.url);
                }
                return fetchResponse;
            }).catch(() => {
                // Return placeholder image on failure
                return new Response(
                    '<svg width="300" height="200" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="#f3f4f6"/><text x="50%" y="50%" text-anchor="middle" fill="#9ca3af">Image unavailable</text></svg>',
                    {
                        headers: {
                            'Content-Type': 'image/svg+xml',
                            'Cache-Control': 'max-age=86400'
                        }
                    }
                );
            });
        });
    });
}

/**
 * Handle static asset requests with cache-first strategy
 */
function handleStaticRequest(request) {
    return caches.open(STATIC_CACHE).then(cache => {
        return cache.match(request).then(response => {
            if (response) {
                console.log('📦 Static asset served from cache:', request.url);
                return response;
            }
            
            return fetch(request).then(fetchResponse => {
                if (fetchResponse.ok) {
                    cache.put(request, fetchResponse.clone());
                }
                return fetchResponse;
            });
        });
    });
}

/**
 * Handle page requests with network-first strategy
 */
function handlePageRequest(request) {
    return fetch(request).then(response => {
        if (response.ok) {
            // Cache successful page responses
            caches.open(DYNAMIC_CACHE).then(cache => {
                cache.put(request, response.clone());
            });
        }
        return response;
    }).catch(() => {
        // Serve from cache if network fails
        return caches.open(DYNAMIC_CACHE).then(cache => {
            return cache.match(request).then(response => {
                if (response) {
                    console.log('📄 Page served from cache (offline):', request.url);
                    return response;
                }
                
                // Return offline page
                return caches.match('/offline.html').then(offlineResponse => {
                    return offlineResponse || new Response(
                        '<!DOCTYPE html><html><head><title>Offline</title></head><body><h1>You are offline</h1><p>Please check your internet connection.</p></body></html>',
                        {
                            headers: {
                                'Content-Type': 'text/html'
                            }
                        }
                    );
                });
            });
        });
    });
}

/**
 * Handle dynamic requests with network-first strategy
 */
function handleDynamicRequest(request) {
    return fetch(request).then(response => {
        if (response.ok) {
            caches.open(DYNAMIC_CACHE).then(cache => {
                cache.put(request, response.clone());
            });
        }
        return response;
    }).catch(() => {
        return caches.open(DYNAMIC_CACHE).then(cache => {
            return cache.match(request);
        });
    });
}

/**
 * Background Sync Event
 */
self.addEventListener('sync', (event) => {
    console.log('🔄 Background sync triggered:', event.tag);
    
    if (event.tag === 'contact-form') {
        event.waitUntil(syncContactForm());
    }
});

/**
 * Sync contact form data
 */
function syncContactForm() {
    return self.registration.sync.register('contact-form-sync');
}

/**
 * Push Event for notifications
 */
self.addEventListener('push', (event) => {
    console.log('📬 Push notification received');
    
    const options = {
        body: event.data ? event.data.text() : 'Yeni bildiriminiz var!',
        icon: '/images/icon-192x192.png',
        badge: '/images/badge-72x72.png',
        vibrate: [200, 100, 200],
        data: {
            url: '/'
        },
        actions: [
            {
                action: 'open',
                title: 'Aç',
                icon: '/images/action-open.png'
            },
            {
                action: 'close',
                title: 'Kapat',
                icon: '/images/action-close.png'
            }
        ]
    };
    
    event.waitUntil(
        self.registration.showNotification('Kişisel Hediyeler', options)
    );
});

/**
 * Notification Click Event
 */
self.addEventListener('notificationclick', (event) => {
    console.log('🔔 Notification clicked:', event.action);
    
    event.notification.close();
    
    if (event.action === 'open') {
        event.waitUntil(
            clients.openWindow(event.notification.data.url)
        );
    }
});

/**
 * Message Event for communication with main thread
 */
self.addEventListener('message', (event) => {
    console.log('💬 Message received:', event.data);
    
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
    
    if (event.data && event.data.type === 'GET_CACHE_SIZE') {
        getCacheSize().then(size => {
            event.ports[0].postMessage({ cacheSize: size });
        });
    }
});

/**
 * Get total cache size
 */
function getCacheSize() {
    return caches.keys().then(cacheNames => {
        return Promise.all(
            cacheNames.map(cacheName => {
                return caches.open(cacheName).then(cache => {
                    return cache.keys().then(keys => keys.length);
                });
            })
        ).then(sizes => {
            return sizes.reduce((total, size) => total + size, 0);
        });
    });
}

console.log('🚀 Service Worker loaded successfully');