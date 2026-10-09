// acr: service worker do app da equipe. Só recebe push; não faz cache de nada,
// para um deploy novo nunca ficar preso atrás de arquivo velho.
// Formato do push: { titulo, corpo, url }.

self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (event) =>
  event.waitUntil(self.clients.claim()),
);

self.addEventListener("push", (event) => {
  let dados = {};
  try {
    dados = event.data ? event.data.json() : {};
  } catch {
    dados = { corpo: event.data ? event.data.text() : "" };
  }
  const titulo = dados.titulo || "UASS-PJC Atendimento";
  event.waitUntil(
    self.registration.showNotification(titulo, {
      body: dados.corpo || "",
      icon: "/uass-icon-192.png",
      badge: "/uass-icon-192.png",
      data: { url: dados.url || "/" },
    }),
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const alvo = new URL(
    (event.notification.data && event.notification.data.url) || "/",
    self.location.origin,
  ).href;

  event.waitUntil(
    (async () => {
      const janelas = await self.clients.matchAll({
        type: "window",
        includeUncontrolled: true,
      });
      const aberta = janelas.find((j) =>
        j.url.startsWith(self.location.origin),
      );
      if (aberta) {
        try {
          await aberta.focus();
          await aberta.navigate(alvo);
          return;
        } catch {
          // cai para openWindow
        }
      }
      await self.clients.openWindow(alvo);
    })(),
  );
});
