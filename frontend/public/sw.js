const CACHE_NAME = 'vectoria-cache-v5';
const STATIC_CACHE = 'vectoria-static-v5';

// Same-origin assets safe to cache long-term (hashed assets, images, fonts)
const PRECACHE_URLS = [
  '/favicon.ico',
];

// ── Install: pre-cache critical static assets ──────────────────────────────────
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) =>
      Promise.allSettled(
        PRECACHE_URLS.map((url) =>
          cache.add(url).catch(() => {
            // silently skip if asset isn't available yet
          })
        )
      )
    )
  );
  self.skipWaiting();
});

// ── Activate: purge old caches ─────────────────────────────────────────────────
self.addEventListener('activate', (event) => {
  const allowed = [CACHE_NAME, STATIC_CACHE];
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((k) => !allowed.includes(k))
          .map((k) => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

// ── Fetch handler ──────────────────────────────────────────────────────────────
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Let external requests (images.unsplash.com, fonts, CDN, API) pass through
  if (url.origin !== self.location.origin) {
    return;
  }

  // Non-GET requests (POST, PUT, DELETE — admin forms, bookings, etc.)
  if (event.request.method !== 'GET') {
    return;
  }

  // Never cache API requests (they require auth tokens and return dynamic data)
  if (url.pathname.startsWith('/api/')) {
    return;
  }

  // NEVER cache Next.js internals:
  //  - /_next/static/* : hashed JS/CSS chunks (safe, but RSC payload references them)
  //  - /_next/data/*   : data payloads
  //  - any .rsc URL    : React Server Component payload
  //  - the RSC header on navigation requests
  const isNextInternal = url.pathname.startsWith('/_next/') || url.pathname.endsWith('.rsc');
  const isRscRequest =
    isNextInternal ||
    event.request.headers.get('RSC') !== null ||
    event.request.headers.get('Next-Router-State-Tree') !== null;

  if (isRscRequest) {
    return; // let the browser handle it directly, no caching
  }

  // For HTML navigation requests: network-first, fall back to cache when offline
  const isHtml =
    event.request.mode === 'navigate' ||
    (event.request.headers.get('accept') || '').includes('text/html');

  if (isHtml) {
    // Network-first with a 3s timeout; fall back to cache offline
    const networkFetch = fetch(event.request)
      .then((response) => {
        if (response && response.status === 200 && response.type === 'basic') {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        }
        return response;
      });

    const timeoutFetch = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('sw-timeout')), 3000)
    );

    event.respondWith(
      Promise.race([networkFetch, timeoutFetch]).catch(() =>
        caches.match(event.request).then((cached) => cached || Response.error())
      )
    );
    return;
  }

  // For other static assets (images, fonts): stale-while-revalidate
  event.respondWith(
    caches.open(STATIC_CACHE).then((cache) =>
      cache.match(event.request).then((cached) => {
        const networkFetch = fetch(event.request)
          .then((response) => {
            if (response && response.status === 200 && response.type === 'basic') {
              cache.put(event.request, response.clone());
            }
            return response;
          })
          .catch(() => cached);

        return cached || networkFetch;
      })
    )
  );
});

// ── Push Notifications ────────────────────────────────────────────────────────
self.addEventListener('push', (event) => {
  const data = event.data ? event.data.json() : {
    title: 'Vectoria Rent Car',
    body: 'Votre réservation a été mise à jour.',
    url: '/dashboard'
  };

  const options = {
    body: data.body,
    icon: '/favicon.ico',
    badge: '/favicon.ico',
    vibrate: [100, 50, 100],
    data: {
      url: data.url || '/'
    },
    actions: [
      { action: 'view', title: 'Voir Détails' },
      { action: 'close', title: 'Fermer' }
    ]
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'close') return;
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then((clientList) => {
      for (const client of clientList) {
        if (client.url === event.notification.data.url && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(event.notification.data.url);
      }
    })
  );
});
