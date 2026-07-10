/* Bible Study service worker — must activate even if some precache URLs fail */
const CACHE_VERSION = "bible-study-v5";
const BASE = self.location.pathname.replace(/\/sw\.js$/, "") || "";

const PRECACHE = [
  `${BASE}/`,
  `${BASE}/index.html`,
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

async function precacheAll() {
  const cache = await caches.open(CACHE_VERSION);
  await Promise.all(
    PRECACHE.map(async (url) => {
      try {
        const res = await fetch(url, { cache: "no-cache" });
        if (res.ok) await cache.put(url, res.clone());
      } catch {
        // Ignore individual failures so the SW still installs
      }
    }),
  );
}

self.addEventListener("install", (event) => {
  event.waitUntil(precacheAll().then(() => self.skipWaiting()));
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
  if (BASE && !url.pathname.startsWith(BASE)) return;

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

  // Always handle navigations so Chrome treats this as a real app, not a shortcut
  if (request.mode === "navigate" || request.headers.get("accept")?.includes("text/html")) {
    event.respondWith(networkFirst(request));
  }
});

async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) return cached;
  const fresh = await fetch(request);
  if (fresh.ok) {
    const cache = await caches.open(CACHE_VERSION);
    cache.put(request, fresh.clone());
  }
  return fresh;
}

async function staleWhileRevalidate(request) {
  const cache = await caches.open(CACHE_VERSION);
  const cached = await cache.match(request);
  const network = fetch(request)
    .then((response) => {
      if (response.ok) cache.put(request, response.clone());
      return response;
    })
    .catch(() => cached);
  return cached || network;
}

async function networkFirst(request) {
  const cache = await caches.open(CACHE_VERSION);
  try {
    const fresh = await fetch(request);
    if (fresh.ok) cache.put(request, fresh.clone());
    return fresh;
  } catch {
    const cached =
      (await caches.match(request)) ||
      (await caches.match(`${BASE}/`)) ||
      (await caches.match(`${BASE}/index.html`));
    return cached || Response.error();
  }
}
