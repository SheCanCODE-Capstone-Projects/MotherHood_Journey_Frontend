// Service Worker for vaccination data caching
// This file is copied to public/sw.js during build
// DO NOT use ES6 modules - this runs in a service worker context

const CACHE_NAME = "motherhood-vaccination-card-v1";
const VACCINATION_ROUTE_PATTERN = /\/api\/patient\/children\/[^/]+\/vaccinations$/;
const MAX_AGE_MS = 24 * 60 * 60 * 1000;

self.addEventListener("install", (event: ExtendableEvent) => {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener("activate", (event: ExtendableEvent) => {
  event.waitUntil(self.clients.claim());
});

<<<<<<< HEAD:src/lib/sw-worker.ts
self.addEventListener("fetch", (event: FetchEvent) => {
  const requestUrl = new URL(event.request.url);
=======
self.addEventListener("fetch", (event) => {
  const requestUrl = new URL(event.request.url, self.location.origin);
>>>>>>> main:public/sw.js

  if (event.request.method !== "GET" || !VACCINATION_ROUTE_PATTERN.test(requestUrl.pathname)) {
    return;
  }

  event.respondWith(handleVaccinationFetch(event.request));
});

async function handleVaccinationFetch(request: Request): Promise<Response> {
  const cache = await caches.open(CACHE_NAME);
  const cachedResponse = await cache.match(request, { ignoreSearch: true });

  try {
    const networkResponse = await fetch(request);

    if (networkResponse && networkResponse.ok) {
      const cachedCopy = await buildCachedResponse(networkResponse);
      await cache.put(request, cachedCopy.clone());
      return networkResponse;
    }

    if (cachedResponse) {
      return cachedResponse;
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
}

async function buildCachedResponse(response: Response): Promise<Response> {
  const body = await response.clone().text();
  const headers = new Headers(response.headers);

  headers.set("x-cached-at", new Date().toISOString());

  return new Response(body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}
<<<<<<< HEAD:src/lib/sw-worker.ts

function isFresh(response: Response): boolean {
  const cachedAt = response.headers.get("x-cached-at");

  if (!cachedAt) {
    return true;
  }

  return Date.now() - new Date(cachedAt).getTime() <= MAX_AGE_MS;
}
=======
>>>>>>> main:public/sw.js
