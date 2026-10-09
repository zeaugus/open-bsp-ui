// acr: estado das conversas (IA, aguardando equipe, com atendente).
import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import useBoundStore from "@/stores/useBoundStore";
import { type Estado, estadoConversas } from "./api";

const TRINTA_SEGUNDOS = 30_000;

/** Estado de todas as conversas carregadas, de uma vez, a cada 30 s. */
export function useEstadoLista(conversaId: string): Estado | undefined {
  const conversations = useBoundStore((s) => s.chat.conversations);
  const ids = useMemo(() => Array.from(conversations.keys()), [conversations]);

  const { data } = useQuery({
    // A chave leva só a contagem (não os ids, que podem ser milhares): conversa
    // nova refaz a busca, e o queryFn sempre lê a lista atual.
    // eslint-disable-next-line @tanstack/query/exhaustive-deps
    queryKey: ["acr", "estado-lista", ids.length],
    queryFn: () => estadoConversas(ids),
    enabled: ids.length > 0,
    refetchInterval: TRINTA_SEGUNDOS,
    retry: false,
  });
  return useMemo(
    () => data?.find((e) => e.conversa_id === conversaId),
    [data, conversaId],
  );
}

/** Estado de uma conversa; recarrega ao abrir e a cada 30 s. */
export function useEstadoConversa(conversaId: string | undefined) {
  return useQuery({
    queryKey: ["acr", "estado-conversa", conversaId],
    queryFn: async () => (await estadoConversas([conversaId!]))[0] ?? null,
    enabled: !!conversaId,
    staleTime: 0,
    refetchOnMount: "always",
    refetchInterval: TRINTA_SEGUNDOS,
    retry: false,
  });
}
