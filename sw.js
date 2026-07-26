// ShadowMeta — service worker
// El armazón de la app se guarda en caché para que funcione sin conexión.
// Los iconos de Data Dragon se cachean a medida que se ven (stale-while-revalidate).

const VERSION = 'sm-v1';
const SHELL = 'shell-' + VERSION;
const ICONOS = 'iconos-' + VERSION;

const ARCHIVOS = [
  './',
  './index.html',
  './css/style.css',
  './js/data.js',
  './js/app.js',
  './favicon.svg',
  './manifest.webmanifest'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(SHELL)
      .then(c => c.addAll(ARCHIVOS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(claves => Promise.all(
        claves.filter(k => !k.endsWith(VERSION)).map(k => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  if (e.request.method !== 'GET') return;

  // Iconos de Data Dragon: se sirven de caché y se refrescan en segundo plano
  if (url.hostname === 'ddragon.leagueoflegends.com') {
    e.respondWith(
      caches.open(ICONOS).then(async cache => {
        const guardado = await cache.match(e.request);
        const red = fetch(e.request)
          .then(r => { if (r.ok) cache.put(e.request, r.clone()); return r; })
          .catch(() => guardado);
        return guardado || red;
      })
    );
    return;
  }

  // Armazón propio: primero la red, con la caché como respaldo sin conexión
  if (url.origin === location.origin) {
    e.respondWith(
      fetch(e.request)
        .then(r => {
          if (r.ok) {
            const copia = r.clone();
            caches.open(SHELL).then(c => c.put(e.request, copia));
          }
          return r;
        })
        .catch(() => caches.match(e.request).then(r => r || caches.match('./index.html')))
    );
  }
});
