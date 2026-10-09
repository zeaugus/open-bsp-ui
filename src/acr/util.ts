// acr: apoio comum às peças de estado (normalização, tempo decorrido).
import { useEffect, useState } from "react";
import type { Estado, EstadoConversa } from "./api";

/** Qualquer estado desconhecido (ex.: "devolvida") conta como "ia". */
export function estadoDe(e: Estado | null | undefined): EstadoConversa {
  return e?.estado === "aguardando_humano" || e?.estado === "com_humano"
    ? e.estado
    : "ia";
}

/** "1 min", "12 min", "2 h 5 min", "2 h", "1 d 3 h". Nunca menos de 1 min. */
export function formatarTempo(desde: string | null, agora: number) {
  const ms = desde ? agora - new Date(desde).getTime() : 0;
  const min = Math.max(1, Math.floor((Number.isFinite(ms) ? ms : 0) / 60_000));
  if (min < 60) return `${min} min`;
  const h = Math.floor(min / 60);
  if (h < 24) return min % 60 ? `${h} h ${min % 60} min` : `${h} h`;
  const d = Math.floor(h / 24);
  return h % 24 ? `${d} d ${h % 24} h` : `${d} d`;
}

/** Relógio local que acorda a cada 30 s, para o tempo decorrido andar sozinho. */
export function useAgora() {
  const [agora, setAgora] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setAgora(Date.now()), 30_000);
    return () => clearInterval(id);
  }, []);
  return agora;
}
