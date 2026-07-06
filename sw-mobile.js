const CACHE_NAME = 'lumo-mobile-v12';
const CACHE_PREFIX = 'lumo-mobile-';
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

async function cacheAppShell(){
  const cache = await caches.open(CACHE_NAME);
  await Promise.all(
    APP_SHELL.map(url => cache.add(new Request(url, {cache:'reload'})))
  );
}

self.addEventListener('install', event => {
  event.waitUntil(cacheAppShell().catch(() => undefined));
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(key => key.startsWith(CACHE_PREFIX) && key !== CACHE_NAME).map(key => caches.delete(key))
    ))
  );
  self.clients.claim();
});

self.addEventListener('message', event => {
  if(event.data && event.data.type === 'SKIP_WAITING'){
    self.skipWaiting();
  }
  if(event.data && event.data.type === 'REFRESH_APP_CACHE'){
    event.waitUntil((async()=>{
      const keys = await caches.keys();
      await Promise.all(keys.filter(key => key.startsWith(CACHE_PREFIX)).map(key => caches.delete(key)));
      await cacheAppShell();
      const clients = await self.clients.matchAll({type:'window'});
      for(const client of clients) client.postMessage({type:'APP_CACHE_REFRESHED'});
    })().catch(() => undefined));
  }
});

self.addEventListener('fetch', event => {
  if(event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  const isAppPage = url.origin === location.origin &&
    (event.request.mode === 'navigate' || url.pathname.endsWith('/mobile.html') || url.pathname.endsWith('/index.html'));
  if(isAppPage){
    event.respondWith(
      fetch(event.request, {cache:'reload'}).then(response => {
        const copy = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy)).catch(() => undefined);
        return response;
      }).catch(() => caches.match(event.request))
    );
    return;
  }
  event.respondWith(
    caches.match(event.request).then(cached => {
      const fetched = fetch(event.request).then(response => {
        if(url.origin === location.origin && response && response.status === 200){
          const copy = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy)).catch(() => undefined);
        }
        return response;
      }).catch(() => cached);
      return cached || fetched;
    })
  );
});
