const CACHE_NAME = 'vectoria-cache-v2';

// Only cache local, same-origin assets — never external URLs (Unsplash, CDN, etc.)
const PRECACHE_URLS = [
  '/',
  '/fleet',
  '/search',
];

// ── Install: pre-cache local pages ────────────────────────────────────────────
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) =>
      // addAll fails if ANY request fails — wrap each individually
      Promise.allSettled(
        PRECACHE_URLS.map((url) =>
          cache.add(url).catch(() => {
            // silently skip if a route isn't available yet
          })
        )
      )
    )
  );
  self.skipWaiting();
});

// ── Activate: purge old caches ─────────────────────────────────────────────────
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((k) => k !== CACHE_NAME)
          .map((k) => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

// ── Fetch: network-first for external, cache-first for same-origin ─────────────
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Let external requests (images.unsplash.com, fonts, etc.) go through directly
  if (url.origin !== self.location.origin) {
    return; // don't intercept — browser handles it normally
  }

  // Same-origin: stale-while-revalidate strategy
  event.respondWith(
    caches.open(CACHE_NAME).then((cache) =>
      cache.match(event.request).then((cached) => {
        const networkFetch = fetch(event.request)
          .then((response) => {
            if (response && response.status === 200 && response.type === 'basic') {
              cache.put(event.request, response.clone());
            }
            return response;
          })
          .catch(() => cached); // offline fallback

        return cached || networkFetch;
      })
    )
  );
});
