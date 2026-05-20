const CACHE_NAME = "motherhood-vaccination-card-v1";
<<<<<<< HEAD
const VACCINATION_ROUTE_PATTERN = /\/api\/patient\/children\/[^/]+\/vaccinations$/;
=======
const VACCINATION_ROUTE_PATTERN = /\/api\/children\/[^/]+\/vaccinations$/;
>>>>>>> 70b53139d72327305443a69b70b7ff8739383fc2
const MAX_AGE_MS = 24 * 60 * 60 * 1000;

self.addEventListener("install", (event) => {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", (event) => {
<<<<<<< HEAD
  const requestUrl = new URL(event.request.url, self.location.origin);
=======
  const requestUrl = new URL(event.request.url);
>>>>>>> 70b53139d72327305443a69b70b7ff8739383fc2

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
<<<<<<< HEAD
      return networkResponse;
    }

    if (cachedResponse) {
      return cachedResponse;
=======
>>>>>>> 70b53139d72327305443a69b70b7ff8739383fc2
    }

    return networkResponse;
  } catch (error) {
<<<<<<< HEAD
=======
    if (cachedResponse && isFresh(cachedResponse)) {
      return cachedResponse;
    }

>>>>>>> 70b53139d72327305443a69b70b7ff8739383fc2
    if (cachedResponse) {
      return cachedResponse;
    }

<<<<<<< HEAD
    return new Response(JSON.stringify({ error: "Offline and no cached vaccination data available." }), {
      status: 503,
      headers: { "Content-Type": "application/json" },
    });
=======
    throw error;
>>>>>>> 70b53139d72327305443a69b70b7ff8739383fc2
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
<<<<<<< HEAD
=======

function isFresh(response) {
  const cachedAt = response.headers.get("x-cached-at");

  if (!cachedAt) {
    return true;
  }

  return Date.now() - new Date(cachedAt).getTime() <= MAX_AGE_MS;
}
>>>>>>> 70b53139d72327305443a69b70b7ff8739383fc2
