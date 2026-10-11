self.addEventListener("install", (event) => {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener("activate", (event) => {
  event.waitUntil((async () => {
    const cacheNames = await caches.keys();
    await Promise.all(cacheNames
      .filter((name) => name.startsWith("elsewhere-shell-"))
      .map((name) => caches.delete(name)));
    await self.registration.unregister();
    await self.clients.claim();
  })());
});

self.addEventListener("fetch", (event) => {
  if (event.request.mode === "navigate") {
    event.respondWith(Response.redirect(new URL("/", self.location.origin), 302));
  }
});
