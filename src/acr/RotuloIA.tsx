// acr: mensagens escritas pela IA ganham o rótulo "Mia (IA)" e balão de outra cor.
// Agente de IA = agente sem user_id (ninguém é membro dele), como o "Assistente UASS".
import { useAgent } from "@/queries/useAgents";

/** True quando o agente que escreveu a mensagem é uma IA. */
export function useEhIA(agentId: string | null | undefined) {
  const { data } = useAgent(agentId ?? "");
  return !!agentId && !!data && data.user_id === null;
}

export default function RotuloIA() {
  return (
    <div className="p-[6px] pb-0 text-[12.8px] font-bold text-primary">
      Mia (IA)
    </div>
  );
}
