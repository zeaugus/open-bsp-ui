// acr: barra colorida na borda esquerda e chip de estado em cada item da lista.
// A barra é absoluta: o item do upstream precisa de `relative` (ver README).
import { useEstadoLista } from "./useEstado";
import { estadoDe, formatarTempo, useAgora } from "./util";

const BARRA = {
  ia: "bg-border",
  aguardando_humano: "bg-[var(--acr-amarelo)]",
  com_humano: "bg-[var(--acr-navy)] dark:bg-[var(--acr-celeste)]",
};

const CHIP =
  "ml-[6px] max-w-[130px] shrink-0 truncate rounded-full px-[7px] py-[1px] text-[11px] font-bold";

function ChipAguardando({ desde }: { desde: string | null }) {
  const agora = useAgora();
  return (
    <span
      className={`${CHIP} bg-[var(--acr-amarelo)] text-[var(--acr-navy-deep)]`}
    >
      Aguardando {formatarTempo(desde, agora)}
    </span>
  );
}

export default function EstadoNaLista({ conversaId }: { conversaId: string }) {
  const dados = useEstadoLista(conversaId);
  const estado = estadoDe(dados);
  return (
    <>
      <span
        aria-hidden
        className={`absolute top-[10px] bottom-[10px] left-0 w-[4px] rounded-full ${BARRA[estado]}`}
      />
      {estado === "aguardando_humano" ? (
        <ChipAguardando desde={dados?.passada_em ?? null} />
      ) : estado === "com_humano" ? (
        <span
          className={`${CHIP} bg-[var(--acr-navy)] text-white dark:bg-[var(--acr-celeste)] dark:text-[var(--acr-navy-deep)]`}
        >
          {dados?.dono_nome || "Equipe"}
        </span>
      ) : (
        <span className={`${CHIP} bg-muted text-muted-foreground`}>IA</span>
      )}
    </>
  );
}
