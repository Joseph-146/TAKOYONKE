/* Takoyonke PWA shell cache. Business data remains in app storage / Firestore, not this cache. */
const CACHE = 'takoyonke-shell-v1';
const APP_SHELL = ['/', '/index.html', '/manifest.webmanifest', '/icons/icon-192.svg', '/icons/icon-512.svg'];
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(APP_SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== self.location.origin) return;
  event.respondWith((async () => {
    const cached = await caches.match(req);
    if (cached) return cached;
    try {
      const response = await fetch(req);
      if (response && response.ok && (req.destination === 'script' || req.destination === 'style' || req.destination === 'image')) {
        const cache = await caches.open(CACHE); cache.put(req, response.clone());
      }
      return response;
    } catch (err) {
      if (req.mode === 'navigate') return (await caches.match('/index.html')) || Response.error();
      return Response.error();
    }
  })());
});
