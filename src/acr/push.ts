// acr: service worker e inscrição de push deste aparelho.
import { inscreverPush } from "./api";

const VAPID = import.meta.env.VITE_VAPID_PUBLIC_KEY as string | undefined;

export function registrarServiceWorker() {
  if (!("serviceWorker" in navigator)) return;
  navigator.serviceWorker.register("/sw.js").catch((e) => {
    console.warn("[acr] service worker não registrou", e);
  });
}

export const pushSuportado = () =>
  "serviceWorker" in navigator &&
  "PushManager" in window &&
  "Notification" in window;

export const temChaveVapid = () => !!VAPID;

export const ehIOS = () =>
  /iphone|ipad|ipod/i.test(navigator.userAgent) ||
  (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);

export const instaladoNaTela = () =>
  window.matchMedia("(display-mode: standalone)").matches ||
  (navigator as unknown as { standalone?: boolean }).standalone === true;

function chaveParaBytes(base64url: string) {
  const base64 = (base64url + "=".repeat((4 - (base64url.length % 4)) % 4))
    .replace(/-/g, "+")
    .replace(/_/g, "/");
  const bin = atob(base64);
  const bytes = new Uint8Array(new ArrayBuffer(bin.length));
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return bytes;
}

async function inscricaoAtual() {
  const reg = await navigator.serviceWorker.ready;
  return reg.pushManager.getSubscription();
}

/** Este aparelho já recebe push? Se sim, renova o cadastro no banco. */
export async function jaAtivo(): Promise<boolean> {
  if (!pushSuportado() || Notification.permission !== "granted") return false;
  const sub = await inscricaoAtual();
  if (!sub) return false;
  await inscreverPush(sub.toJSON()).catch(() => {});
  return true;
}

/** Pede permissão, inscreve no push e grava no banco. */
export async function ativarNotificacoes(): Promise<
  "ativo" | "negado" | "erro"
> {
  if (!VAPID) {
    console.warn("[acr] VITE_VAPID_PUBLIC_KEY ausente");
    return "erro";
  }
  const permissao = await Notification.requestPermission();
  if (permissao !== "granted") return "negado";
  try {
    const reg = await navigator.serviceWorker.ready;
    const sub =
      (await reg.pushManager.getSubscription()) ??
      (await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: chaveParaBytes(VAPID),
      }));
    await inscreverPush(sub.toJSON());
    return "ativo";
  } catch (e) {
    console.warn("[acr] inscrição de push falhou", e);
    return "erro";
  }
}
