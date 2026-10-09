// acr: selo "Aguardando" na lista de conversas.
import { useEstadoLista } from "./useEstado";

export default function SeloAguardando({ conversaId }: { conversaId: string }) {
  const estado = useEstadoLista(conversaId);
  if (estado?.estado !== "aguardando_humano") return null;
  return (
    <span className="ml-[6px] rounded-full bg-[var(--acr-amarelo)] px-[7px] py-[1px] text-[11px] font-bold text-[var(--acr-navy-deep)]">
      Aguardando
    </span>
  );
}
