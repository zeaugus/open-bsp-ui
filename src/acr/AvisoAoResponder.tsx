// acr: aviso fino acima do campo de mensagem: responder tira a conversa da IA.
import useBoundStore from "@/stores/useBoundStore";
import { useEstadoConversa } from "./useEstado";
import { estadoDe } from "./util";

export default function AvisoAoResponder() {
  const conversaId = useBoundStore((s) => s.ui.activeConvId);
  const { data } = useEstadoConversa(conversaId ?? undefined);
  if (!conversaId || estadoDe(data) === "com_humano") return null;
  return (
    <div className="z-10 mx-[12px] mt-[4px] text-center text-[12px] leading-[16px] text-muted-foreground">
      Ao responder, você assume esta conversa e a IA para de responder.
    </div>
  );
}
