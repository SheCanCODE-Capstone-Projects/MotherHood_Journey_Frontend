const CACHE_NAME = "motherhood-vaccination-card-v1";
const VACCINATION_ROUTE_PATTERN = /\/api\/children\/[^/]+\/vaccinations$/;
const MAX_AGE_MS = 24 * 60 * 60 * 1000;

self.addEventListener("install", (event) => {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", (event) => {
  const requestUrl = new URL(event.request.url);

  if (event.request.method !== "GET" || !VACCINATION_ROUTE_PATTERN.test(requestUrl.pathname)) {
    return;
  }

  event.respondWith(handleVaccinationFetch(event.request));
});

async function handleVaccinationFetch(request) {
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

async function buildCachedResponse(response) {
  const body = await response.clone().text();
  const headers = new Headers(response.headers);

  headers.set("x-cached-at", new Date().toISOString());

  return new Response(body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

function isFresh(response) {
  const cachedAt = response.headers.get("x-cached-at");

  if (!cachedAt) {
    return true;
  }

  return Date.now() - new Date(cachedAt).getTime() <= MAX_AGE_MS;
}