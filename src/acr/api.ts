// acr: chamadas às RPCs do schema `acr` (ver acr-atendimento/supabase/acr-fluxo.sql).
// O `Database` tipado do upstream só conhece `public`, então o client é
// reapontado para o tipo genérico aqui, num lugar só.
import type { SupabaseClient } from "@supabase/supabase-js";
import { supabase } from "@/supabase/client";

export type EstadoConversa = "ia" | "aguardando_humano" | "com_humano";

export type Estado = {
  conversa_id: string;
  estado: EstadoConversa;
  dono_nome: string | null;
  assumida_em: string | null;
  passada_em: string | null;
  motivo: string | null;
};

const acr = () => (supabase as unknown as SupabaseClient).schema("acr");

export async function estadoConversas(ids: string[]): Promise<Estado[]> {
  const res = await acr().rpc("estado_conversas", { ids });
  if (res.error) {
    console.warn("[acr] estado_conversas falhou", res.error);
    throw res.error;
  }
  return (res.data ?? []) as Estado[];
}

export async function devolver(conv: string): Promise<void> {
  const { error } = await acr().rpc("devolver", { conv });
  if (error) {
    console.warn("[acr] devolver falhou", error);
    throw error;
  }
}

export async function inscreverPush(sub: PushSubscriptionJSON): Promise<void> {
  const { error } = await acr().rpc("inscrever_push", { sub });
  if (error) {
    console.warn("[acr] inscrever_push falhou", error);
    throw error;
  }
}
