const CACHE_NAME = 'vectoria-cache-v6';
const STATIC_CACHE = 'vectoria-static-v6';

const PRECACHE_URLS = [
  '/favicon.ico',
  '/placeholder-car.jpg',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) =>
      Promise.allSettled(
        PRECACHE_URLS.map((url) => cache.add(url).catch(() => {}))
      )
    )
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  const allowed = [CACHE_NAME, STATIC_CACHE];
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((k) => !allowed.includes(k)).map((k) => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  if (url.origin !== self.location.origin) return;
  if (event.request.method !== 'GET') return;
  if (url.pathname.startsWith('/api/')) return;

  const isNextInternal = url.pathname.startsWith('/_next/') || url.pathname.endsWith('.rsc');
  const isRscRequest =
    isNextInternal ||
    event.request.headers.get('RSC') !== null ||
    event.request.headers.get('Next-Router-State-Tree') !== null;

  if (isRscRequest) return;

  const isHtml =
    event.request.mode === 'navigate' ||
    (event.request.headers.get('accept') || '').includes('text/html');

  if (isHtml) {
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

  const isImage = url.pathname.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i);
  const isFont = url.pathname.match(/\.(woff|woff2|ttf|otf|eot)$/i);
  const isStatic = isImage || isFont || url.pathname.match(/\.(css|js)$/i);

  if (isStatic) {
    event.respondWith(
      caches.open(STATIC_CACHE).then((cache) =>
        cache.match(event.request).then((cached) => {
          if (cached) return cached;
          return fetch(event.request).then((response) => {
            if (response && response.status === 200) {
              cache.put(event.request, response.clone());
            }
            return response;
          }).catch(() => cached);
        })
      )
    );
    return;
  }

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
    data: { url: data.url || '/' },
    actions: [
      { action: 'view', title: 'Voir Détails' },
      { action: 'close', title: 'Fermer' }
    ]
  };

  event.waitUntil(self.registration.showNotification(data.title, options));
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
