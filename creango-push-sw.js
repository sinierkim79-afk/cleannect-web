self.addEventListener("push", (event) => {
  const payload = event.data ? event.data.json() : {};
  const title = payload.title || "크린고 알림";
  event.waitUntil(self.registration.showNotification(title, {
    body: payload.body || "크린고에서 확인이 필요한 작업이 있습니다.",
    icon: "/favicon.png",
    badge: "/favicon.png",
    data: { route: payload.route || "/(tabs)/tasks", requestId: payload.requestId },
    tag: payload.requestId ? `creango-${payload.requestId}` : "creango-notification",
    renotify: true,
  }));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const destination = new URL(event.notification.data?.route || "/(tabs)/tasks", self.location.origin).href;
  event.waitUntil(clients.matchAll({ type: "window", includeUncontrolled: true }).then((windows) => {
    const matched = windows.find((client) => client.url === destination);
    return matched ? matched.focus() : clients.openWindow(destination);
  }));
});
