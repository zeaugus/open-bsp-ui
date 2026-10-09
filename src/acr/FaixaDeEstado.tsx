// acr: faixa logo abaixo do cabeçalho do chat que diz quem responde a conversa.
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useBoundStore from "@/stores/useBoundStore";
import { devolver } from "./api";
import { motivoLegivel } from "./motivos";
import { useEstadoConversa } from "./useEstado";
import { estadoDe, formatarTempo, useAgora } from "./util";

export default function FaixaDeEstado() {
  const conversaId = useBoundStore((s) => s.ui.activeConvId);
  const queryClient = useQueryClient();
  const { data } = useEstadoConversa(conversaId ?? undefined);
  const agora = useAgora();

  const devolverMut = useMutation({
    mutationFn: () => devolver(conversaId!),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["acr"] }),
  });

  if (!conversaId) return null;
  // Sem dado (RPC ausente ou erro): trata como IA, o erro já foi para o console.
  const estado = estadoDe(data);
  const motivo = motivoLegivel(data?.motivo);

  if (estado === "aguardando_humano") {
    return (
      <div
        role="status"
        className="acr-faixa z-20 border-b border-[var(--acr-laranja)] bg-[var(--acr-amarelo)] px-[16px] py-[10px] text-[var(--acr-navy-deep)]"
      >
        <div className="text-[15px] font-bold leading-[20px]">
          Aguardando a equipe há{" "}
          {formatarTempo(data?.passada_em ?? null, agora)}
        </div>
        {motivo && (
          <div className="text-[14px] leading-[19px]">Motivo: {motivo}</div>
        )}
        <div className="text-[13px] leading-[18px]">
          Responda para assumir. Enquanto isso, a IA só responde dúvidas novas.
        </div>
      </div>
    );
  }

  if (estado === "com_humano") {
    return (
      <div
        role="status"
        className="acr-faixa z-20 flex flex-wrap items-center gap-x-[12px] gap-y-[8px] border-b border-[var(--acr-celeste)] bg-[var(--acr-navy)] px-[16px] py-[10px] text-white"
      >
        <div className="min-w-0 flex-1 basis-[200px]">
          <div className="text-[15px] font-bold leading-[20px]">
            Com {data?.dono_nome || "a equipe"}
          </div>
          <div className="text-[13px] leading-[18px] opacity-90">
            A IA não responde até alguém devolver.
          </div>
        </div>
        <button
          className="min-h-[44px] shrink-0 rounded-full bg-[var(--acr-celeste)] px-[16px] text-[14px] font-bold text-[var(--acr-navy-deep)] disabled:opacity-50 active:opacity-80"
          disabled={devolverMut.isPending}
          onClick={() => devolverMut.mutate()}
        >
          Devolver para a IA
        </button>
      </div>
    );
  }

  return (
    <div
      role="status"
      className="acr-faixa z-20 border-b border-border bg-muted px-[16px] py-[8px] text-[14px] text-foreground"
    >
      A IA está respondendo esta conversa
    </div>
  );
}
