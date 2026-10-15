// acr: aviso discreto "Ativar notificações deste aparelho", depois do login.
import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import useBoundStore from "@/stores/useBoundStore";
import {
  ativarNotificacoes,
  ehIOS,
  instaladoNaTela,
  jaAtivo,
  pushSuportado,
  temChaveVapid,
} from "./push";

type Modo = "oculto" | "ativar" | "ios";

export default function AvisoNotificacoes() {
  const logado = useBoundStore((s) => !!s.ui.user);
  const [modo, setModo] = useState<Modo>("oculto");
  const [ocupado, setOcupado] = useState(false);

  useEffect(() => {
    if (!logado) return;
    let vivo = true;
    void (async () => {
      // iPhone só recebe push com o app na tela de início.
      if (ehIOS() && !instaladoNaTela()) return vivo && setModo("ios");
      if (!pushSuportado() || !temChaveVapid()) return;
      if (Notification.permission === "denied") return;
      if (await jaAtivo()) return;
      if (vivo) setModo("ativar");
    })();
    return () => {
      vivo = false;
    };
  }, [logado]);

  if (modo === "oculto") return null;

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-[calc(env(safe-area-inset-bottom)+12px)] z-[70] flex justify-center px-[16px]">
      <div className="pointer-events-auto rounded-full bg-[var(--acr-navy)] px-[16px] py-[8px] text-[13px] text-white shadow-lg">
        {modo === "ios" ? (
          <Link to="/instalar">
            Para receber avisos no iPhone, adicione à tela de início
          </Link>
        ) : (
          <button
            disabled={ocupado}
            onClick={async () => {
              setOcupado(true);
              const r = await ativarNotificacoes();
              setOcupado(false);
              if (r !== "erro") setModo("oculto");
            }}
          >
            Ativar notificações deste aparelho
          </button>
        )}
      </div>
    </div>
  );
}
