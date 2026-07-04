const CACHE_NAME = 'lumo-mobile-v10';
const APP_SHELL = [
  './index.html',
  './mobile.html',
  './manifest-mobile.webmanifest',
  './icons/lumo-mobile.svg',
  './heic2any.min.js',
  './vendor/vision_bundle.mjs',
  './vendor/selfie_segmenter.tflite',
  './vendor/wasm/vision_wasm_internal.js',
  './vendor/wasm/vision_wasm_internal.wasm',
  './vendor/wasm/vision_wasm_nosimd_internal.js',
  './vendor/wasm/vision_wasm_nosimd_internal.wasm'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => Promise.all(
        APP_SHELL.map(url => cache.add(new Request(url, {cache:'reload'})))
      ))
      .catch(() => undefined)
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
    ))
  );
  self.clients.claim();
});

self.addEventListener('message', event => {
  if(event.data && event.data.type === 'SKIP_WAITING'){
    self.skipWaiting();
  }
});

self.addEventListener('fetch', event => {
  if(event.request.method !== 'GET') return;
  event.respondWith(
    caches.match(event.request).then(cached => cached || fetch(event.request))
  );
});
