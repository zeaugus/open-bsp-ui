// acr: abre o guia "virar app" por cima de tudo na primeira visita pelo celular.
// Decide uma vez, ao carregar: celular, fora do app instalado e guia ainda não visto.
// Antes do login também: assim a pessoa instala primeiro e entra uma vez só, já no app.
import { useState } from "react";
import { useLocation } from "@tanstack/react-router";
import GuiaInstalar from "./GuiaInstalar";
import { deveMostrarGuia } from "./instalar";

// /instalar já é o guia; /onboard e /oauth são fluxos de fora da equipe.
const FORA = /^\/(instalar|onboard|oauth)/;

export default function GuiaPrimeiraVez() {
  const caminho = useLocation({ select: (l) => l.pathname });
  const [aberto, setAberto] = useState(deveMostrarGuia);
  if (!aberto || FORA.test(caminho)) return null;
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="acr-guia-titulo"
      className="fixed inset-0 z-[100] overflow-y-auto"
    >
      <GuiaInstalar aoSair={() => setAberto(false)} />
    </div>
  );
}
