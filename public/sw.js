/* Bible Study service worker — caches app shell + Bible JSON for offline use */
const CACHE_VERSION = "bible-study-v1";
const PRECACHE = [
  "/",
  "/bible",
  "/search",
  "/notes",
  "/plans",
  "/manifest.webmanifest",
  "/icons/icon-192.png",
  "/icons/icon-512.png",
  "/data/bibles/kjv.json",
  "/data/bibles/nkjv.json",
  "/data/bibles/bbe.json",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_VERSION).then((cache) => cache.addAll(PRECACHE)).then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_VERSION).map((k) => caches.delete(k))),
    ).then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  // Bible data: cache-first
  if (url.pathname.startsWith("/data/bibles/")) {
    event.respondWith(cacheFirst(request));
    return;
  }

  // Static assets / next chunks: stale-while-revalidate
  if (
    url.pathname.startsWith("/_next/") ||
    url.pathname.startsWith("/icons/") ||
    url.pathname.endsWith(".webmanifest")
  ) {
    event.respondWith(staleWhileRevalidate(request));
    return;
  }

  // Navigations / pages: network-first with cache fallback
  if (request.mode === "navigate" || request.headers.get("accept")?.includes("text/html")) {
    event.respondWith(networkFirst(request));
  }
});

async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) return cached;
  const fresh = await fetch(request);
  const cache = await caches.open(CACHE_VERSION);
  cache.put(request, fresh.clone());
  return fresh;
}

async function staleWhileRevalidate(request) {
  const cache = await caches.open(CACHE_VERSION);
  const cached = await cache.match(request);
  const network = fetch(request)
    .then((response) => {
      cache.put(request, response.clone());
      return response;
    })
    .catch(() => cached);
  return cached || network;
}

async function networkFirst(request) {
  const cache = await caches.open(CACHE_VERSION);
  try {
    const fresh = await fetch(request);
    cache.put(request, fresh.clone());
    return fresh;
  } catch {
    const cached = await cache.match(request);
    if (cached) return cached;
    return caches.match("/") || Response.error();
  }
}
