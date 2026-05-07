const CACHE_NAME = "vax-card-cache-v1";
const CACHE_TTL = 24 * 60 * 60 * 1000;
const API_PREFIX = "/api/patient/children/";
const VACCINATIONS_SUFFIX = "/vaccinations";

self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil(Promise.resolve());
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") {
    return;
  }

  const url = new URL(request.url, self.location.origin);
  if (!url.pathname.startsWith(API_PREFIX) || !url.pathname.endsWith(VACCINATIONS_SUFFIX)) {
    return;
  }

  event.respondWith(
    caches.open(CACHE_NAME).then(async (cache) => {
      const metaRequest = new Request(`${request.url}::meta`);
      const cachedResponse = await cache.match(request);
      const rawMeta = await cache.match(metaRequest);
      const stale = !rawMeta || Date.now() - Number(await rawMeta.text()) > CACHE_TTL;

      if (cachedResponse && !stale) {
        return cachedResponse;
      }

      try {
        const networkResponse = await fetch(request);
        if (networkResponse.ok) {
          cache.put(request, networkResponse.clone());
          cache.put(metaRequest, new Response(String(Date.now())));
        }
        return networkResponse;
      } catch (error) {
        if (cachedResponse) {
          return cachedResponse;
        }

        return new Response(JSON.stringify({ error: "Offline and no cached vaccination data available." }), {
          status: 503,
          headers: { "Content-Type": "application/json" },
        });
      }
    }),
  );
});
