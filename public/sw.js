const CACHE_NAME = "memovya-shell-v1";
const APP_SHELL = ["/", "/offline.html", "/manifest.webmanifest", "/favicon.svg", "/icons/memovya-192.svg", "/icons/memovya-512.svg"];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL)));
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))))
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  const url = new URL(request.url);
  if (request.method !== "GET" || url.origin !== self.location.origin) return;
  // Never cache authenticated routes or API responses containing private data.
  if (url.pathname.startsWith("/dashboard") || url.pathname.startsWith("/auth") || url.pathname.startsWith("/api")) return;
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request).catch(async () => (await caches.match("/offline.html")) || Response.error())
    );
  }
});
