const CACHE_PREFIX = 'travel-planner-shell-';
const CACHE_NAME = `${CACHE_PREFIX}v1`;
const scopeUrl = new URL(self.registration.scope);
const offlineUrl = new URL('./index.html', scopeUrl).href;
const shellUrls = [
  './',
  './index.html',
  './version.js',
  './manifest.webmanifest',
  './app-icon.svg',
  './app-icon-180.png',
  './app-icon-192.png',
  './app-icon-512.png',
].map(path=>new URL(path, scopeUrl).href);

self.addEventListener('install', event=>{
  event.waitUntil((async ()=>{
    const cache = await caches.open(CACHE_NAME);
    await Promise.allSettled(shellUrls.map(url=>cache.add(new Request(url, {cache:'reload'}))));
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', event=>{
  event.waitUntil((async ()=>{
    const names = await caches.keys();
    await Promise.all(names
      .filter(name=>name.startsWith(CACHE_PREFIX) && name!==CACHE_NAME)
      .map(name=>caches.delete(name)));
    await self.clients.claim();
  })());
});

async function networkFirst(request, fallbackKey){
  const cache = await caches.open(CACHE_NAME);
  try{
    const response = await fetch(request, {cache:'no-store'});
    if(response && response.ok) await cache.put(fallbackKey || request, response.clone());
    return response;
  }catch(error){
    const cached = await cache.match(fallbackKey || request, {ignoreSearch:true});
    if(cached) return cached;
    throw error;
  }
}

self.addEventListener('fetch', event=>{
  const request = event.request;
  if(request.method!=='GET') return;
  const url = new URL(request.url);
  if(url.origin!==scopeUrl.origin) return;

  if(request.mode==='navigate'){
    event.respondWith(networkFirst(request, offlineUrl));
    return;
  }
  const cacheKey = url.pathname.endsWith('/version.js')
    ? new URL('./version.js', scopeUrl).href
    : request;
  event.respondWith(networkFirst(request, cacheKey));
});
