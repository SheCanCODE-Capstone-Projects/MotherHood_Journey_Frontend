// Service Worker for vaccination data caching
// This file is copied to public/sw.js during build
// DO NOT use ES6 modules - this runs in a service worker context

const CACHE_NAME = "motherhood-vaccination-card-v1";
const VACCINATION_ROUTE_PATTERN = /\/api\/children\/[^/]+\/vaccinations$/;
const MAX_AGE_MS = 24 * 60 * 60 * 1000;

// eslint-disable-next-line no-undef
self.addEventListener("install", (event: any) => {
  event.waitUntil(self.skipWaiting());
});

// eslint-disable-next-line no-undef
self.addEventListener("activate", (event: any) => {
  event.waitUntil(self.clients.claim());
});

// eslint-disable-next-line no-undef
self.addEventListener("fetch", (event: any) => {
  const requestUrl = new URL(event.request.url);

  if (event.request.method !== "GET" || !VACCINATION_ROUTE_PATTERN.test(requestUrl.pathname)) {
    return;
  }

  event.respondWith(handleVaccinationFetch(event.request));
});

async function handleVaccinationFetch(request: any) {
  const cache = await caches.open(CACHE_NAME);
  const cachedResponse = await cache.match(request, { ignoreSearch: true });

  try {
    const networkResponse = await fetch(request);

    if (networkResponse && networkResponse.ok) {
      const cachedCopy = await buildCachedResponse(networkResponse);
      await cache.put(request, cachedCopy.clone());
    }

    return networkResponse;
  } catch (error) {
    if (cachedResponse && isFresh(cachedResponse)) {
      return cachedResponse;
    }

    if (cachedResponse) {
      return cachedResponse;
    }

    throw error;
  }
}

async function buildCachedResponse(response: any) {
  const body = await response.clone().text();
  const headers = new Headers(response.headers);

  headers.set("x-cached-at", new Date().toISOString());

  return new Response(body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

function isFresh(response: any) {
  const cachedAt = response.headers.get("x-cached-at");

  if (!cachedAt) {
    return true;
  }

  return Date.now() - new Date(cachedAt).getTime() <= MAX_AGE_MS;
}
