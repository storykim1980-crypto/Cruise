/* Tokyo Cruise Log service worker — build 2609190110.3db0c7 */
const CACHE = "tcl-2609190110.3db0c7";
const CORE = ["./", "./index.html", "./en/", "./css/styles.css?v=2609190110.3db0c7", "./js/i18n.js?v=2609190110.3db0c7", "./js/layout.js?v=2609190110.3db0c7", "./js/data.js?v=2609190110.3db0c7"];

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE)
      .then((c) => c.addAll(CORE))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  const url = new URL(e.request.url);
  if (e.request.method !== "GET" || url.origin !== location.origin) return;

  // HTML navigation: network-first (always fresh), offline fallback to cache
  if (e.request.mode === "navigate") {
    e.respondWith(
      fetch(e.request)
        .then((res) => {
          const cp = res.clone();
          caches.open(CACHE).then((c) => c.put(e.request, cp));
          return res;
        })
        .catch(() => caches.match(e.request).then((m) => m || caches.match("./index.html")))
    );
    return;
  }

  // assets: cache-first + background revalidate (versioned URLs are immutable)
  e.respondWith(
    caches.match(e.request).then((hit) => {
      const fresh = fetch(e.request)
        .then((res) => {
          const cp = res.clone();
          caches.open(CACHE).then((c) => c.put(e.request, cp));
          return res;
        })
        .catch(() => hit);
      return hit || fresh;
    })
  );
});
