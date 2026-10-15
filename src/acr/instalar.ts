// acr: apoio ao guia "virar app" (detecção do aparelho, aviso visto, botão do Chrome).
import { useSyncExternalStore } from "react";
import { ehIOS, instaladoNaTela } from "./push";

const CHAVE = "acr-guia-instalar";

export const ehAndroid = () => /android/i.test(navigator.userAgent);

/** Celular: iPhone ou Android pelo navegador, ou tela de toque estreita. */
export const ehCelular = () =>
  /iphone|ipod|android/i.test(navigator.userAgent) ||
  (navigator.maxTouchPoints > 0 &&
    window.matchMedia("(max-width: 767px)").matches);

/** iPhone fora do Safari (Chrome, Instagram, Facebook...): lá não dá para instalar. */
export function iosForaDoSafari() {
  const ua = navigator.userAgent;
  return (
    ehIOS() &&
    (!/Safari\//.test(ua) ||
      /CriOS|FxiOS|EdgiOS|OPiOS|OPT\/|GSA\/|DuckDuckGo|YaBrowser|Instagram|FBAN|FBAV|Line\//.test(
        ua,
      ))
  );
}

/** Já viu o guia? Sem acesso ao armazenamento, conta como visto (não insiste). */
function guiaJaVisto() {
  try {
    return localStorage.getItem(CHAVE) !== null;
  } catch {
    return true;
  }
}

export function marcarGuiaVisto() {
  try {
    localStorage.setItem(CHAVE, "1");
  } catch {
    // segue sem lembrar; o guia fecha do mesmo jeito
  }
}

/** Primeira visita no celular, fora do app instalado. */
export const deveMostrarGuia = () =>
  ehCelular() && !instaladoNaTela() && !guiaJaVisto();

export async function copiarTexto(texto: string) {
  try {
    await navigator.clipboard.writeText(texto);
    return true;
  } catch {
    // navegador dentro de outro app: tenta o jeito antigo
  }
  try {
    const campo = document.createElement("textarea");
    campo.value = texto;
    campo.setAttribute("readonly", "");
    campo.style.position = "fixed";
    campo.style.opacity = "0";
    document.body.appendChild(campo);
    campo.select();
    const ok = document.execCommand("copy");
    campo.remove();
    return ok;
  } catch {
    return false;
  }
}

// O Chrome do Android avisa uma vez, cedo, que o app pode ser instalado.
// Guarda o aviso desde a carga do módulo para o botão "Instalar o app".
type PedidoInstalar = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

let pedido: PedidoInstalar | null = null;
const ouvintes = new Set<() => void>();
const avisar = () => ouvintes.forEach((f) => f());

window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  pedido = e as PedidoInstalar;
  avisar();
});
window.addEventListener("appinstalled", () => {
  pedido = null;
  avisar();
});

function assinar(f: () => void) {
  ouvintes.add(f);
  return () => ouvintes.delete(f);
}

/** O Chrome ofereceu instalar? */
export const usePodeInstalar = () =>
  useSyncExternalStore(assinar, () => pedido !== null);

/** Abre a janela de instalação do Chrome. O aviso só vale uma vez. */
export async function pedirInstalacao() {
  const atual = pedido;
  if (!atual) return;
  pedido = null;
  avisar();
  await atual.prompt();
}
