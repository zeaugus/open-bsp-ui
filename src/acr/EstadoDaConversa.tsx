// acr: etiqueta de estado e botão "Devolver para a IA" no cabeçalho do chat.
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { devolver } from "./api";
import { useEstadoConversa } from "./useEstado";

export default function EstadoDaConversa({
  conversaId,
}: {
  conversaId: string;
}) {
  const queryClient = useQueryClient();
  const { data } = useEstadoConversa(conversaId);

  const devolverMut = useMutation({
    mutationFn: () => devolver(conversaId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["acr"] }),
  });

  // Sem dado (RPC ausente ou erro): trata como IA, o erro já foi para o console.
  const estado = data?.estado ?? "ia";
  const texto =
    estado === "aguardando_humano"
      ? "Aguardando equipe"
      : estado === "com_humano"
        ? `Com ${data?.dono_nome || "a equipe"}`
        : "Com a IA";
  const cor =
    estado === "aguardando_humano"
      ? "bg-[var(--acr-amarelo)] text-[var(--acr-navy-deep)]"
      : estado === "com_humano"
        ? "bg-[var(--acr-navy)] text-white dark:bg-[var(--acr-celeste)] dark:text-[var(--acr-navy-deep)]"
        : "bg-muted text-muted-foreground";

  return (
    <div className="ml-auto flex shrink-0 flex-col items-end justify-center gap-[3px] pl-[8px]">
      <span
        className={`rounded-full px-[8px] py-[1px] text-[12px] font-medium whitespace-nowrap ${cor}`}
      >
        {texto}
      </span>
      {estado !== "ia" && (
        <button
          className="text-[12px] text-primary underline disabled:opacity-50"
          disabled={devolverMut.isPending}
          onClick={() => devolverMut.mutate()}
        >
          Devolver para a IA
        </button>
      )}
    </div>
  );
}
