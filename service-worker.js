/* =============================================================================
   Leather AI Sales Assistant — service-worker.js
   Minimal PWA service worker: caches the app shell + demo data so the app
   keeps working offline and is installable. Phase 1 = no backend, so the
   strategy is intentionally simple: cache-first for the shell, with a
   network-first fallback for the JSON data files (in case they get edited).
   ============================================================================= */

const CACHE_NAME = "leather-ai-shell-v1";

// Core files that make up the "app shell" — everything needed for the app
// to boot and run, even with no network connection.
const SHELL_FILES = [
  "./",
  "./index.html",
  "./styles.css",
  "./app.js",
  "./manifest.webmanifest",
  "./data/products.json",
  "./data/faqs.json",
  "./data/usecases.json",
  "./data/price-rules.json",
  "./data/lead-times.json"
];

/* ---------------------------------------------------------------------------
   INSTALL — pre-cache the app shell.
   --------------------------------------------------------------------------- */
self.addEventListener("install", function (event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      // addAll() will fail the whole install if any single file 404s, so we
      // add files individually and swallow per-file errors to keep the SW
      // resilient if the app is served from a sub-path or a file is missing.
      return Promise.all(
        SHELL_FILES.map(function (url) {
          return cache.add(url).catch(function (err) {
            console.warn("Service worker: failed to pre-cache", url, err);
          });
        })
      );
    })
  );
  self.skipWaiting();
});

/* ---------------------------------------------------------------------------
   ACTIVATE — clean up old cache versions.
   --------------------------------------------------------------------------- */
self.addEventListener("activate", function (event) {
  event.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(
        keys
          .filter(function (key) { return key !== CACHE_NAME; })
          .map(function (key) { return caches.delete(key); })
      );
    })
  );
  self.clients.claim();
});

/* ---------------------------------------------------------------------------
   FETCH — cache-first for the app shell, network-first (with cache fallback)
   for everything else (e.g. the /data/*.json files, in case they're updated
   on the server between visits).
   --------------------------------------------------------------------------- */
self.addEventListener("fetch", function (event) {
  // Only handle same-origin GET requests; let everything else pass through.
  if (event.request.method !== "GET") return;

  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;

  const isDataFile = url.pathname.indexOf("/data/") !== -1;

  if (isDataFile) {
    // Network-first: try fresh data, fall back to cache when offline.
    event.respondWith(
      fetch(event.request)
        .then(function (response) {
          const copy = response.clone();
          caches.open(CACHE_NAME).then(function (cache) { cache.put(event.request, copy); });
          return response;
        })
        .catch(function () { return caches.match(event.request); })
    );
    return;
  }

  // Cache-first for the app shell (HTML/CSS/JS/manifest).
  event.respondWith(
    caches.match(event.request).then(function (cached) {
      if (cached) return cached;
      return fetch(event.request).then(function (response) {
        const copy = response.clone();
        caches.open(CACHE_NAME).then(function (cache) { cache.put(event.request, copy); });
        return response;
      }).catch(function () {
        // Final fallback for navigations when totally offline and uncached.
        if (event.request.mode === "navigate") return caches.match("./index.html");
      });
    })
  );
});
