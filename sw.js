self.addEventListener("push", event => {
  let data = {};
  try { data = event.data ? event.data.json() : {}; } catch (_) {}
  const title = "RANDOM – New message";
  const options = {
    body: "You have a new message.",
    icon: "/random-web/icon-192.png",
    badge: "/random-web/icon-192.png",
    tag: data.tag || "random-new-message",
    renotify: true,
    data: { url: data.url || "/random-web/" }
  };
  event.waitUntil(self.registration.showNotification(title, options));
});
self.addEventListener("notificationclick", event => {
  event.notification.close();
  const target = new URL(event.notification.data?.url || "/random-web/", self.location.origin).href;
  event.waitUntil((async () => {
    const clientsList = await clients.matchAll({ type: "window", includeUncontrolled: true });
    for (const client of clientsList) {
      if ("focus" in client) { await client.focus(); if ("navigate" in client) await client.navigate(target); return; }
    }
    if (clients.openWindow) await clients.openWindow(target);
  })());
});
self.addEventListener("notificationclose", () => {});
