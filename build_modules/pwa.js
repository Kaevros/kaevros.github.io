const fs = require('fs-extra');
const path = require('path');

async function createServiceWorker(outputDir) {
  const sw = `self.addEventListener('install', (e) => {
  self.skipWaiting();
});
self.addEventListener('activate', () => {
  clients.claim();
});
self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  event.respondWith((async () => {
    const cache = await caches.open('static-v1');
    const cached = await cache.match(req);
    if (cached) return cached;
    try {
      const res = await fetch(req);
      if (res && res.status === 200 && res.type === 'basic') {
        cache.put(req, res.clone());
      }
      return res;
    } catch (e) {
      return cached || Response.error();
    }
  })());
});`;
  await fs.writeFile(path.join(outputDir, 'service-worker.js'), sw);
  console.log('--- service-worker.js oluşturuldu.');
}

module.exports = createServiceWorker;
