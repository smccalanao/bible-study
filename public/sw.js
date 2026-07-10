/* Bible Study service worker — caches app shell + Bible JSON for offline use */
const CACHE_VERSION = "bible-study-v4";

// Derive base path from SW location (e.g. /bible-study when on GitHub Pages)
const BASE = self.location.pathname.replace(/\/sw\.js$/, "") || "";

const PRECACHE = [
  `${BASE}/`,
  `${BASE}/bible/`,
  `${BASE}/search/`,
  `${BASE}/notes/`,
  `${BASE}/stories/`,
  `${BASE}/manifest.webmanifest`,
  `${BASE}/icons/icon-192.png`,
  `${BASE}/icons/icon-512.png`,
  `${BASE}/data/bibles/kjv.json`,
  `${BASE}/data/bibles/nkjv.json`,
  `${BASE}/data/bibles/bbe.json`,
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_VERSION)
      .then((cache) => cache.addAll(PRECACHE))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((k) => k !== CACHE_VERSION).map((k) => caches.delete(k))),
      )
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  const path = url.pathname;

  if (path.includes("/data/bibles/")) {
    event.respondWith(cacheFirst(request));
    return;
  }

  if (
    path.includes("/_next/") ||
    path.includes("/icons/") ||
    path.endsWith(".webmanifest")
  ) {
    event.respondWith(staleWhileRevalidate(request));
    return;
  }

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
    return caches.match(`${BASE}/`) || Response.error();
  }
}
