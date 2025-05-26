// Hayali Çizgili - Optimize Edilmiş Service Worker
const CACHE_VERSION = 'v2';
const CORE_CACHE = `hayali-cizgili-core-${CACHE_VERSION}`;
const ASSETS_CACHE = `hayali-cizgili-assets-${CACHE_VERSION}`;
const IMAGE_CACHE = `hayali-cizgili-images-${CACHE_VERSION}`;
const FONT_CACHE = `hayali-cizgili-fonts-${CACHE_VERSION}`;

// Hemen önbelleğe alınacak çekirdek varlıklar
const CORE_ASSETS = [
  '/',
  '/index.html',
  '/tr/index.html',
  '/en/index.html',
  '/404.html',
  '/js/script-common.js',
  '/css/style-common.css',
  '/css/styles.css',
  '/assets/images/logo.png',
  '/offline.html'
];

// Talep edildiklerinde önbelleğe alınacak varlıklar
const ASSET_EXTENSIONS = [
  '.css',
  '.js'
];

// Görsel dosya uzantıları
const IMAGE_EXTENSIONS = [
  '.svg',
  '.png',
  '.jpg',
  '.jpeg',
  '.webp',
  '.gif',
  '.ico'
];

// Font dosya uzantıları
const FONT_EXTENSIONS = [
  '.woff',
  '.woff2',
  '.ttf',
  '.eot',
  '.otf'
];

// Maksimum önbellek boyutları
const MAX_IMAGE_CACHE_SIZE = 50 * 1024 * 1024; // 50 MB
const MAX_FONT_CACHE_SIZE = 10 * 1024 * 1024; // 10 MB

// Service Worker Kurulumu
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CORE_CACHE)
      .then(cache => {
        console.log('Çekirdek varlıklar önbelleğe alınıyor');
        return cache.addAll(CORE_ASSETS);
      })
      .then(() => self.skipWaiting())
  );
});

// Service Worker Aktivasyonu
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.filter(cacheName => {
          // Eski versiyondaki önbellekleri temizle
          return cacheName.includes('hayali-cizgili') && 
                 !cacheName.includes(CACHE_VERSION);
        }).map(cacheName => {
          console.log('Eski önbellek temizleniyor:', cacheName);
          return caches.delete(cacheName);
        })
      );
    }).then(() => {
      console.log('Service Worker aktif edildi v' + CACHE_VERSION);
      return self.clients.claim();
    })
  );
});

// İstek tipine göre önbellek stratejisini belirle
function getStrategy(request) {
  const url = new URL(request.url);
  const requestPath = url.pathname;
  
  // Navigasyon istekleri (HTML sayfaları)
  if (request.mode === 'navigate') {
    return 'network-first';
  }
  
  // CSS ve JS dosyaları
  if (ASSET_EXTENSIONS.some(ext => requestPath.endsWith(ext))) {
    return 'cache-first';
  }
  
  // Görsel dosyaları
  if (IMAGE_EXTENSIONS.some(ext => requestPath.endsWith(ext))) {
    return 'stale-while-revalidate';
  }
  
  // Font dosyaları
  if (FONT_EXTENSIONS.some(ext => requestPath.endsWith(ext))) {
    return 'cache-first';
  }
  
  // Diğer tüm istekler için ağ öncelikli
  return 'network-first';
}

// Uygun önbellek adını belirle
function getCacheName(request) {
  const url = new URL(request.url);
  const requestPath = url.pathname;
  
  // Görsel dosyaları
  if (IMAGE_EXTENSIONS.some(ext => requestPath.endsWith(ext))) {
    return IMAGE_CACHE;
  }
  
  // Font dosyaları
  if (FONT_EXTENSIONS.some(ext => requestPath.endsWith(ext))) {
    return FONT_CACHE;
  }
  
  // CSS ve JS dosyaları
  if (ASSET_EXTENSIONS.some(ext => requestPath.endsWith(ext))) {
    return ASSETS_CACHE;
  }
  
  // Diğer tüm varlıklar için çekirdek önbellek
  return CORE_CACHE;
}

// Önbellekten yanıt ver
async function getFromCache(request) {
  const cacheName = getCacheName(request);
  const cachedResponse = await caches.match(request, { cacheName });
  return cachedResponse;
}

// Yanıtı önbelleğe kaydet
async function putInCache(request, response) {
  const cacheName = getCacheName(request);
  const cache = await caches.open(cacheName);
  
  // Önbelleğe alınabilir bir yanıt mı kontrol et
  if (!response || response.status !== 200 || response.type === 'opaque') {
    return;
  }
  
  // Yanıtı önbelleğe kopyala
  try {
    await cache.put(request, response.clone());
    
    // Önbellek boyut yönetimi - sadece görsel ve font önbellekleri için
    if (cacheName === IMAGE_CACHE) {
      await manageCacheSize(cacheName, MAX_IMAGE_CACHE_SIZE);
    } else if (cacheName === FONT_CACHE) {
      await manageCacheSize(cacheName, MAX_FONT_CACHE_SIZE);
    }
  } catch (error) {
    console.error('Önbelleğe kaydetme hatası:', error);
  }
}

// Önbellek boyutunu yönet
async function manageCacheSize(cacheName, maxSize) {
  const cache = await caches.open(cacheName);
  const keys = await cache.keys();
  const cacheSize = await getCacheSize(cache, keys);
  
  if (cacheSize > maxSize) {
    // En eski varlıkları kaldır
    const keysToDelete = keys.slice(0, Math.floor(keys.length * 0.2)); // %20'sini sil
    await Promise.all(keysToDelete.map(key => cache.delete(key)));
  }
}

// Önbellek boyutunu hesapla
async function getCacheSize(cache, keys) {
  let size = 0;
  
  for (const request of keys) {
    const response = await cache.match(request);
    if (response) {
      const blob = await response.blob();
      size += blob.size;
    }
  }
  
  return size;
}

// Önce ağ, sonra önbellek stratejisi
async function networkFirst(request) {
  try {
    const networkResponse = await fetch(request);
    await putInCache(request, networkResponse);
    return networkResponse.clone();
  } catch (error) {
    const cachedResponse = await getFromCache(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Navigasyon isteği ve hiçbir şey yoksa çevrimdışı sayfaya yönlendir
    if (request.mode === 'navigate') {
      return caches.match('/offline.html');
    }
    
    throw error;
  }
}

// Önce önbellek, sonra ağ stratejisi
async function cacheFirst(request) {
  const cachedResponse = await getFromCache(request);
  
  if (cachedResponse) {
    return cachedResponse;
  }
  
  try {
    const networkResponse = await fetch(request);
    await putInCache(request, networkResponse);
    return networkResponse.clone();
  } catch (error) {
    console.error('Cache-first strateji hatası:', error);
    throw error;
  }
}

// Önbellekten hızlıca yanıt, arka planda güncelle stratejisi
async function staleWhileRevalidate(request) {
  const cachedResponse = await getFromCache(request);
  
  // Arka planda önbelleği güncelle
  const fetchPromise = fetch(request)
    .then(networkResponse => {
      putInCache(request, networkResponse);
      return networkResponse.clone();
    })
    .catch(error => {
      console.error('Stale-while-revalidate ağ hatası:', error);
      // Hata olduğunda tepki verme, işlem arka planda
    });
  
  // Önbellekten yanıt varsa hemen döndür
  if (cachedResponse) {
    return cachedResponse;
  }
  
  // Yoksa ağdan gelen yanıtı bekle
  return fetchPromise;
}

// Ağ İsteklerini Yakalama
self.addEventListener('fetch', event => {
  // Sadece GET isteklerini işle
  if (event.request.method !== 'GET') return;
  
  // Aynı originli istekleri işle
  const url = new URL(event.request.url);
  
  // CDN ve 3. parti kaynaklara özel kontrol (opsiyonel)
  const isCriticalThirdParty = url.hostname.includes('fonts.googleapis.com') || 
                               url.hostname.includes('fonts.gstatic.com') ||
                               url.hostname.includes('cdnjs.cloudflare.com');
  
  if (url.origin !== self.location.origin && !isCriticalThirdParty) {
    return; // Diğer 3. parti istekleri Service Worker tarafından yönetilmez
  }
  
  const strategy = getStrategy(event.request);
  
  switch(strategy) {
    case 'network-first':
      event.respondWith(networkFirst(event.request));
      break;
      
    case 'cache-first':
      event.respondWith(cacheFirst(event.request));
      break;
      
    case 'stale-while-revalidate':
      event.respondWith(staleWhileRevalidate(event.request));
      break;
      
    default:
      event.respondWith(networkFirst(event.request));
  }
});

// Performans iyileştirmeleri için arka planda önbelleğe alma
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'CACHE_NEW_ASSETS') {
    const urlsToCache = event.data.urls;
    const cacheName = event.data.cacheName || ASSETS_CACHE;
    
    caches.open(cacheName)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        if (event.source && event.source.postMessage) {
          event.source.postMessage({
            type: 'CACHE_COMPLETE',
            timestamp: Date.now()
          });
        }
      });
  }
});

// Basit bir çevrimdışı HTML sayfası oluştur
function createOfflinePage() {
  return fetch('/offline.html')
    .catch(() => {
      return new Response(
        `<!DOCTYPE html>
        <html lang="tr">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Çevrimdışı - Hayali Çizgili</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              text-align: center;
              padding: 50px 20px;
              color: #333;
            }
            h1 {
              color: #F8C3CD;
            }
            .message {
              margin: 30px auto;
              max-width: 600px;
              line-height: 1.6;
            }
            .retry-button {
              background-color: #F8C3CD;
              color: white;
              border: none;
              padding: 10px 20px;
              border-radius: 5px;
              cursor: pointer;
              font-size: 16px;
            }
          </style>
        </head>
        <body>
          <h1>Çevrimdışı Modu</h1>
          <div class="message">
            <p>İnternet bağlantınız olmadığı için şu anda içeriğe erişilemiyor.</p>
            <p>Lütfen bağlantınızı kontrol edip tekrar deneyin.</p>
          </div>
          <button class="retry-button" onclick="window.location.reload()">Tekrar Dene</button>
        </body>
        </html>`,
        {
          headers: {
            'Content-Type': 'text/html; charset=utf-8'
          }
        }
      );
    })
    .then(response => {
      return caches.open(CORE_CACHE)
        .then(cache => {
          return cache.put('/offline.html', response);
        });
    });
}

// Service Worker kurulduğunda çevrimdışı sayfayı oluştur
self.addEventListener('install', event => {
  event.waitUntil(createOfflinePage());
});
