const CACHE_NAME = "ceo-os-v4-2-prod";
const ASSETS_TO_CACHE = [
  './index.html',
  './manifest.json',
  './service-worker.js'
];

// Install event - cache assets
self.addEventListener('install', event => {
  console.log('[ServiceWorker] Install event');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[ServiceWorker] Caching assets');
        return cache.addAll(ASSETS_TO_CACHE);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  console.log('[ServiceWorker] Activate event');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('[ServiceWorker] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event - Stale-While-Revalidate strategy
self.addEventListener('fetch', event => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') {
    return;
  }

  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }

  event.respondWith(
    caches.open(CACHE_NAME).then(cache => {
      return cache.match(event.request).then(cachedResponse => {
        // Return cached response immediately
        const fetchedResponse = fetch(event.request)
          .then(networkResponse => {
            // Cache the network response for next time
            if (networkResponse && networkResponse.status === 200 && networkResponse.type !== 'error') {
              cache.put(event.request, networkResponse.clone());
            }
            return networkResponse;
          })
          .catch(err => {
            console.log('[ServiceWorker] Fetch failed; returning cached or offline page.', err);
            return cachedResponse || new Response('Offline - cached content unavailable', { status: 503 });
          });

        return cachedResponse || fetchedResponse;
      });
    })
  );
});

// Background sync for offline task queueing (future enhancement)
self.addEventListener('sync', event => {
  if (event.tag === 'sync-tasks') {
    event.waitUntil(
      // Task sync logic would go here
      Promise.resolve()
    );
  }
});

// Push notification support (future enhancement)
self.addEventListener('push', event => {
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body || 'CEO OS Task Update',
      icon: './data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192 192"><rect fill="%230b0b12" width="192" height="192"/><text x="50%" y="50%" font-size="48" fill="%2334d399" text-anchor="middle" dominant-baseline="middle" font-weight="bold">CEO</text></svg>',
      badge: './data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192 192"><rect fill="%2334d399" width="192" height="192"/></svg>',
      tag: 'ceo-os-notification',
      requireInteraction: false
    };

    event.waitUntil(
      self.registration.showNotification('CEO OS', options)
    );
  }
});

// Notification click handler
self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then(clientList => {
      for (let i = 0; i < clientList.length; i++) {
        const client = clientList[i];
        if (client.url === '/' && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow('./');
      }
    })
  );
});